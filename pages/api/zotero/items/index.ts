import { getSession } from '../../../../lib/session';
import { getCache, setCache } from '../../../../lib/cache';
import { NextApiRequest, NextApiResponse } from 'next';

async function itemsRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req, res);
    const { user } = session;
    const { collection } = req.query;

    if (!user || !user.isLoggedIn || !user.accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const cacheKey = `items-${user.userId}-${collection || 'all'}`;
    const cachedData = getCache(cacheKey);
    if (cachedData) {
        return res.status(200).json(cachedData);
    }

    try {
        let items: any[] = [];
        let url;

        if (collection) {
            url = `https://api.zotero.org/users/${user.userId}/collections/${collection}/items?format=json&limit=100`;
        } else {
            url = `https://api.zotero.org/users/${user.userId}/items?format=json&limit=100`;
        }

        while (url) {
            const response = await fetch(url, {
                headers: {
                    'Zotero-API-Key': user.accessToken,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            items = items.concat(data);

            const linkHeader = response.headers.get('Link');
            if (linkHeader) {
                const links = linkHeader.split(', ');
                const nextLink = links.find(link => link.endsWith('rel="next"'));
                url = nextLink ? nextLink.substring(nextLink.indexOf('<') + 1, nextLink.indexOf('>')) : null;
            } else {
                url = null;
            }
        }

        const filteredItems = items.filter(item => item && item.data && item.data.itemType !== 'attachment');
        setCache(cacheKey, filteredItems);
        res.status(200).json(filteredItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default itemsRoute;
