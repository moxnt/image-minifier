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
}: {
  filename: string | undefined;
  status: FileStatus;
}) {
  const IconComponent = ICON_MAP[status];
  return (
    <div className="p-4 rounded-lg bg-gray-800 flex flex-row gap-2">
      <span>{filename}</span>
      {IconComponent && <IconComponent />}
    </div>
  );
}
