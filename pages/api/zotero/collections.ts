import { getSession } from '../../../lib/session';
import { getCache, setCache } from '../../../lib/cache';
import { NextApiRequest, NextApiResponse } from 'next';

async function collectionsRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req, res);
    const { user } = session;

    if (!user || !user.isLoggedIn || !user.accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const cacheKey = `collections-${user.userId}`;
    const cachedData = getCache(cacheKey);
    if (cachedData) {
        return res.status(200).json(cachedData);
    }

    try {
        const response = await fetch(`https://api.zotero.org/users/${user.userId}/collections?format=json`, {
            headers: {
                'Zotero-API-Key': user.accessToken,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCache(cacheKey, data);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default collectionsRoute;
