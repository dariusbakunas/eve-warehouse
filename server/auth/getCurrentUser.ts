import { ISessionUser, IUser } from "./auth0Verify";
import { Request } from "express";
import fetch from "node-fetch";

const getCurrentUser: (req: Request & { user?: ISessionUser }) => Promise<IUser> = async (req) => {
  const baseURL = req ? `${req.protocol}://${req.get("Host")}` : "";
  const res = await fetch(`${baseURL}/auth/user`);
  return await res.json();
};

export default getCurrentUser;
