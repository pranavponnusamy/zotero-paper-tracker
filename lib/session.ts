import { getIronSession, SessionOptions, IronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: "zotero-paper-tracker-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

interface IronSessionData {
  requestToken?: {
    key: string | null;
    secret: string | null;
  };
  user?: {
    isLoggedIn: boolean;
    accessToken: string | null;
    userId: string | null;
    username: string | null;
  };
}

export function getSession(req: NextApiRequest, res: NextApiResponse): Promise<IronSession<IronSessionData>> {
    return getIronSession(req, res, sessionOptions);
}