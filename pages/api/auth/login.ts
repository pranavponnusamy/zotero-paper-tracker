import { getSession } from '../../../lib/session';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

const oauth = new OAuth({
    consumer: {
        key: process.env.ZOTERO_CLIENT_KEY as string,
        secret: process.env.ZOTERO_CLIENT_SECRET as string,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
});

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req, res);
    const requestData = {
        url: 'https://www.zotero.org/oauth/request',
        method: 'POST',
        data: { oauth_callback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback` },
    };

    try {
        const response = await fetch(requestData.url, {
            method: requestData.method,
            headers: { ...oauth.toHeader(oauth.authorize(requestData)) },
        });

        if (!response.ok) {
            throw new Error(`Failed to get request token: ${await response.text()}`);
        }

        const responseData = await response.text();
        const params = new URLSearchParams(responseData);

        session.requestToken = {
            key: params.get('oauth_token'),
            secret: params.get('oauth_token_secret'),
        };
        await session.save();

        res.redirect(`https://www.zotero.org/oauth/authorize?oauth_token=${params.get('oauth_token')}&write_access=1`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default loginRoute;
