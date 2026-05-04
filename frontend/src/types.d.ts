export type PresignerBody = {
  uploadURL: URL;
  key: string;
};

export type FileStatus =
  | "added"
  | "signed"
  | "uploaded"
  | "processed"
  | "downloaded"
  | "faulty";
