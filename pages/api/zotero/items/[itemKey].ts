import { getSession } from '../../../../lib/session';
import { invalidateUserCache } from '../../../../lib/cache';
import { NextApiRequest, NextApiResponse } from 'next';

interface Tag {
    tag: string;
}

async function itemKeyRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req, res);
    const { user } = session;
    const { itemKey } = req.query;
    const { tags, version } = req.body;

    if (!user || !user.isLoggedIn || !user.accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'PATCH') {
        const isRead = tags.some((tag: Tag) => tag.tag === '_read');
        const newTags = isRead
            ? tags.filter((tag: Tag) => tag.tag !== '_read')
            : [...tags, { tag: '_read' }];

        try {
            const response = await fetch(`https://api.zotero.org/users/${user.userId}/items/${itemKey}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Zotero-API-Key': user.accessToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tags: newTags, version }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                if (errorText.includes("Write access denied")) {
                    return res.status(403).json({ message: "Write access denied. Please ensure your API key has write permissions." });
                }
                try {
                    const errorData = JSON.parse(errorText);
                    return res.status(response.status).json({ message: `Failed to update item: ${response.statusText} - ${JSON.stringify(errorData)}` });
                } catch (e) {
                    return res.status(response.status).json({ message: `Failed to update item: ${response.statusText} - ${errorText}` });
                }
            }

            // Invalidate cache for this user after update
            if (!user.userId) {
                return res.status(401).json({ message: 'Unauthorized: User ID missing' });
            }
            invalidateUserCache(user.userId);

            // Zotero API returns 204 No Content on success, so we need to fetch the updated item
            const updatedItemResponse = await fetch(`https://api.zotero.org/users/${user.userId}/items/${itemKey}?format=json`, {
                headers: {
                    'Zotero-API-Key': user.accessToken,
                },
            });
            const updatedItem = await updatedItemResponse.json();

            res.status(200).json(updatedItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['PATCH']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default itemKeyRoute;
