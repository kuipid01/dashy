/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  Edit,
  Trash2,
  Eye,
  Play,
  Image as ImageIcon,
  TrendingUp,
  Calendar,
  //   Tag,
  //   MoreVertical
} from "lucide-react";
import { ContentItem } from "../types/content";

interface ContentCardProps {
  content: ContentItem;
  viewMode: "grid" | "list";
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  viewMode,
  onEdit,
  onDelete,
}) => {
  console.log(content, "coneten");
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      onDelete(content.id);
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              {content.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center">
                  {content.thumbnail ? (
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={content.url}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                {content.type === "video" ? (
                  <Play className="w-3 h-3" />
                ) : (
                  <ImageIcon className="w-3 h-3" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {content?.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {content?.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {(content?.created_at &&
                    new Date(content.created_at).toLocaleString()) ||
                    content?.createdAt.toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {content?.analytics?.views.toLocaleString()} views
                </span>
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {content?.analytics?.clickThroughRate.toFixed(1)}% CTR
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    content.status === "published"
                      ? "bg-green-100 text-green-800"
                      : content.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {content.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(content)}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-video bg-gray-100">
        {content.type === "video" ? (
          <div className="w-full h-full flex items-center justify-center">
            {content.thumbnail ? (
              <img
                src={content.thumbnail}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Play className="w-12 h-12 text-gray-400" />
            )}
          </div>
        ) : (
          <img
            src={content.url}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {content.type === "video" ? (
            <div className="flex items-center">
              <Play className="w-3 h-3 mr-1" />
              Video
            </div>
          ) : (
            <div className="flex items-center">
              <ImageIcon className="w-3 h-3 mr-1" />
              Image
            </div>
          )}
        </div>

        <div className="absolute uppercase z-10 top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              content.status === "published"
                ? "bg-green-700 text-white"
                : content.status === "draft"
                ? "bg-yellow-700 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {content.status}
          </span>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(content)}
              className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">
          {content.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {content.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {content?.analytics?.views.toLocaleString()}
          </span>
          <span className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {content?.analytics?.clickThroughRate.toFixed(1)}% CTR
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {content?.tags &&
            (typeof content.tags === "string"
              ? content.tags
                  //@ts-ignore
                  .split(",")
                  .filter(Boolean)
                  .slice(0, 3)
                  //@ts-ignore
                  .map((tag) => (
                    <span
                      key={tag.trim()}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))
              : content.tags
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((tag) => (
                    <span
                      key={tag.trim()}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  )))}

          {content?.tags &&
            typeof content.tags === "string" &&
            //@ts-ignore
            content.tags.split(",").filter(Boolean).length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +
                {
                  //@ts-ignore
                  content.tags.split(",").filter(Boolean).length - 3
                }
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
