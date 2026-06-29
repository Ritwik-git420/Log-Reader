export type LogTabStatus = "loading" | "ready" | "error";

export type LogTab = {
  fileId: string;
  filename: string;
  size?: number;
  createdAt?: string;
  status: LogTabStatus;
};
