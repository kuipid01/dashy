/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";

const AttachmentComp = ({ attachments }: { attachments?: string }) => {
  if (!attachments) return null;

  let urls: string[] = [];
  try {
    urls = JSON.parse(attachments);
  } catch (error: any) {
    console.error("Invalid attachment format");
    return null;
  }
  const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (!extension) return "unknown";

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension))
      return "image";
    if (["mp4", "webm", "ogg", "mkv"].includes(extension)) return "video";
    if (["pdf"].includes(extension)) return "pdf";
    if (["doc", "docx"].includes(extension)) return "doc";
    return "other";
  };

  return (
    <div className="space-4 gap-4 grid grid-cols-2">
      {urls.map((url, index) => {
        const type = getFileType(url);

        switch (type) {
          case "image":
            return (
              <img
                key={index}
                src={url}
                alt="attachment"
                className="w-24 h-24 overflow-hidden object-cover rounded shadow"
              />
            );
          case "video":
            return (
              <video key={index} controls className="w-64 rounded shadow">
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            );
          case "pdf":
            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF Attachment
              </a>
            );
          case "doc":
            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Download DOC/DOCX Attachment
              </a>
            );
          default:
            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Open Attachment
              </a>
            );
        }
      })}
    </div>
  );
};

export default AttachmentComp;
