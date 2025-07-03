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

async function callbackRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req, res);
    const { oauth_token, oauth_verifier } = req.query;
    const { requestToken } = session;

    if (!requestToken || oauth_token !== requestToken.key || !requestToken.secret || !requestToken.key) {
        return res.status(400).json({ message: 'Invalid request token or secret' });
    }

    const accessTokenData = {
        url: 'https://www.zotero.org/oauth/access',
        method: 'POST',
        data: { oauth_verifier },
    };

    try {
        const response = await fetch(accessTokenData.url, {
            method: accessTokenData.method,
            headers: { ...oauth.toHeader(oauth.authorize(accessTokenData, { key: requestToken.key, secret: requestToken.secret })) },
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${await response.text()}`);
        }

        const responseData = await response.text();
        const params = new URLSearchParams(responseData);

        session.user = {
            isLoggedIn: true,
            accessToken: params.get('oauth_token'),
            userId: params.get('userID'),
            username: params.get('username'),
        };
        await session.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default callbackRoute;
