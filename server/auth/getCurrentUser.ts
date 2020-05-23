import { ISessionUser, IUser } from "./auth0Verify";
import { Request } from "express";

const getCurrentUser: (req: Request & { user?: ISessionUser }) => Promise<IUser | null> = async (req) => {
  if (req && req.user) {
    const user: ISessionUser = req.user;

    return {
      email: user.email,
      picture: user.picture,
      status: user.status,
    };
  }

  return null;
};

export default getCurrentUser;
