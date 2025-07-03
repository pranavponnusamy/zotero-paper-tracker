import { getSession } from '../../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req, res);
    session.destroy();
    res.redirect('/');
}

export default logoutRoute;
