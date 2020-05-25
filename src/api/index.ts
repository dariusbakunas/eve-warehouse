import { ApiError } from "./apiError";
import { IClientEnv } from "../../server";
import { IUser } from "./types";

const parseBody = <T>(response: Response): Promise<T | string> => {
  const contentType = response.headers.get("Content-Type");
  const contentLength = response.headers.get("Content-Length");
  if (contentLength !== "0" && contentType && (contentType.startsWith("application/json") || contentType.startsWith("application/hal+json"))) {
    return response.json();
  } else {
    return response.text();
  }
};

const errorFromResponse = async (response: Response) => {
  const message = `${response.status}: ${response.statusText}`;
  const error = new ApiError(message);
  const body = await parseBody(response);

  Object.assign(error, {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    body,
  });

  return error;
};

const get = async (url: string) => {
  const response = await fetch(url);

  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw await errorFromResponse(response);
  }
};

export const getCurrentUser: () => Promise<IUser> = async () => {
  return get("/auth/user");
};

export const getAppConfig: () => Promise<IClientEnv> = async () => {
  return get("/env");
};
