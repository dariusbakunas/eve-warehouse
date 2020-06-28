export class ApiError extends Error {
  public url?: string;
  public body?: string;
  public status?: string;
  public statusText?: string;

  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}
