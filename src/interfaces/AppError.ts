export type AppErrorType =
  | "failed to load content"
  | "failed to read layout row";

export default interface AppError {
  errorType: AppErrorType;
  description: string;
  source: string;
  link: string;
}
