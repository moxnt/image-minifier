export type PresignerBody = {
  presignedURL: URL;
  key: string;
};

export type FileStatus =
  | "added"
  | "signed"
  | "uploaded"
  | "processed"
  | "downloaded"
  | "faulty";
