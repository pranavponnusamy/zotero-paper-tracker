import { getSession } from '../../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req, res);
    if (session.user) {
        res.json({
            ...session.user,
            isLoggedIn: true,
        });
    } else {
        res.json({
            isLoggedIn: false,
        });
    }
}

export default userRoute;
