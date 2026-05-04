import {
  Logs,
  ImageUp,
  CloudSync,
  ImageDown,
  Check,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FileStatus } from "../types.d.ts";

const ICON_MAP: Record<FileStatus, LucideIcon> = {
  added: Logs,
  signed: ImageUp,
  uploaded: CloudSync,
  processed: ImageDown,
  downloaded: Check,
  faulty: TriangleAlert,
};

export default function ImageStatusChip({
  filename,
  status,
  url,
}: {
  filename: string | undefined;
  status: FileStatus;
  url: URL | undefined;
}) {
  const IconComponent = ICON_MAP[status];
  if (!url) {
    return (
      <div className="p-4 rounded-lg bg-gray-800 flex flex-row gap-2">
        <span>{filename}</span>
        {IconComponent && <IconComponent />}
      </div>
    );
  }
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
      }}
      href={url.toString()}
      className="p-4 rounded-lg bg-gray-800 flex flex-row gap-2"
      download={true}
    >
      <span>{filename}</span>
      {IconComponent && <IconComponent />}
    </a>
  );
}
