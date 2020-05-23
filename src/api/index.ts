import { ApiError } from "./apiError";
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

export const getCurrentUser: () => Promise<IUser> = async () => {
  const response = await fetch("/auth/user");

  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw await errorFromResponse(response);
  }
};
