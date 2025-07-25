/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { File, FileText, ImageIcon, Music, Video, X } from "lucide-react";
import React from "react";
interface AttachmentFile {
  file: File;
  id: string;
  preview?: string;
}
const AttachmentPreview = ({
  attachments,
  setAttachments,
}: {
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentFile[]>>;
  attachments: AttachmentFile[];
}) => {
  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (fileType.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (fileType.startsWith("audio/")) return <Music className="h-4 w-4" />;
    if (fileType.includes("pdf") || fileType.includes("document"))
      return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="space-y-2 bgblur p-4 absolute bottom-[80px] left-0 right-0 h-auto">
      {attachments.map((attachment) => (
        <Card key={attachment.id} className="p-3">
          <div className="flex items-center gap-3">
            {attachment.preview ? (
              <div className="relative">
                <img
                  src={attachment.preview || "/placeholder.svg"}
                  alt={attachment.file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                {getFileIcon(attachment.file.type)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {attachment.file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(attachment.file.size)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeAttachment(attachment.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AttachmentPreview;
