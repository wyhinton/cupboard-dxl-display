export type AppErrorType =
  | "no url for cards provided"
  | "failed to load content"
  | "failed to read layout row"
  | "failed to fetch master google sheet"
  | "failed to fetch layout or card sheet";

export default interface AppError {
  errorType: AppErrorType;
  description: string;
  source: string;
  link: string;
}
