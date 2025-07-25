/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Plus, Search, Grid3X3, List, BarChart3, Upload } from "lucide-react";
import { ContentItem, ContentStats } from "./types/content";
import AnalyticsDashboard from "./components/analytics-dashboard";
import ContentCard from "./components/content-card";
import CreateContentModal from "./components/create-content-modal";
import EditContentModal from "./components/edit-content";
import {
  useCreateContent,
  useDeleteContent,
  useFetchMyContents,
  useUpdateContent,
} from "@/app/(handlers)/content/content";
import { toast } from "sonner";

const Page = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const { data: contentsDb } = useFetchMyContents();
  useEffect(() => {
    if (contentsDb) {
      setContents(contentsDb);
    }
  }, [contentsDb]);

  const [formData, setFormData] = useState({
    title: "",
    type: "image" as "image" | "video",
    url: "",
    thumbnail: "",
    description: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published" | "archived",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "image" | "video" | "published" | "draft"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentView, setCurrentView] = useState<"content" | "analytics">(
    "content"
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(
    null
  );
  const { mutateAsync: deleteContent, isPending: deleting } =
    useDeleteContent();

  const filteredContents = contents.filter((content) => {
    const search = searchTerm.toLowerCase();

    const tagsArray = Array.isArray(content.tags)
      ? content.tags
      : typeof content.tags === "string"
      ? //@ts-expect-error
        content.tags.split(",").map((tag) => tag.trim())
      : [];

    const matchesSearch =
      content?.title?.toLowerCase().includes(search) ||
      content?.description?.toLowerCase().includes(search) ||
      //@ts-expect-error
      tagsArray.some((tag) => tag.toLowerCase().includes(search));

    const matchesFilter =
      selectedFilter === "all" ||
      content.type === selectedFilter ||
      content.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  //   const contentStats: ContentStats = {
  //     totalContent: contents.length,
  //     totalViews: contents.reduce(
  //       (sum, content) => sum + content.analytics.views,
  //       0
  //     ),
  //     totalClicks: contents.reduce(
  //       (sum, content) => sum + content.analytics.clicks,
  //       0
  //     ),
  //     avgClickThroughRate:
  //       contents.reduce(
  //         (sum, content) => sum + content.analytics.clickThroughRate,
  //         0
  //       ) / contents.length,
  //     avgEngagement:
  //       contents.reduce((sum, content) => sum + content.analytics.engagement, 0) /
  //       contents.length,
  //   };
  const { mutateAsync, isPending } = useCreateContent();
  const { mutateAsync: updateContent, isPending: isUpdating } =
    useUpdateContent();
  const handleCreateContent = async () => {
    if (!formData.url) {
      toast.error("Provide URL or upload an image");
      return;
    }
    if (!formData.title) {
      toast.error("Provide default title or upload a file");
      return;
    }

    const payload = {
      ...formData,
      type:
        formData.type === "image"
          ? "photo"
          : (formData.type as "photo" | "video"),
    };

    try {
      const newContent = await mutateAsync(payload);

      setContents((prev) => [...prev, newContent]);

      toast.success("Content created successfully");

      setFormData({
        title: "",
        type: "image",
        url: "",
        thumbnail: "",
        description: "",
        tags: [],
        status: "draft",
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create content");
    }
  };

  const handleEditContent = async (updatedContent: ContentItem) => {
    try {
      const payload = {
        url: updatedContent.url,
        title: updatedContent.title,
        tags:
          typeof updatedContent.tags === "string"
            ? //@ts-expect-error
              updatedContent.tags.split(",")
            : updatedContent.tags,
        description: updatedContent.description,
        status: updatedContent.status,
      };
      console.log(payload);
      await updateContent({
        id: updatedContent.id,
        data: payload,
      });
      setContents((prev) =>
        prev.map((content) =>
          content.id === updatedContent.id
            ? { ...updatedContent, updatedAt: new Date() }
            : content
        )
      );
      toast.success("Edit successfull");
      setEditingContent(null);
    } catch (error) {
      toast.error("Failed");
    }
  };

  const handleDeleteContent = async (id: string) => {
    const prevContents = contents;
    try {
      await deleteContent(id);

      setContents((prev) => prev.filter((content) => content.id !== id));
      toast.success("Content deketed ");
    } catch (error) {
      toast.success("Failed ");
      setContents(prevContents);
    }
  };

  return (
    <div className="min-h-screen bgblur rounded-md">
      {/* Header */}
      <header className="bgblur border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={() =>
                setCurrentView(
                  currentView === "content" ? "analytics" : "content"
                )
              }
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {currentView === "content" ? (
                <BarChart3 className="w-4 h-4 mr-2" />
              ) : (
                <Grid3X3 className="w-4 h-4 mr-2" />
              )}
              {currentView === "content" ? "Analytics" : "Content"}
            </button> */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </button>
          </div>
        </div>
      </header>

      {/* {currentView === "analytics" ? (
        <AnalyticsDashboard contents={contents} stats={contentStats} />
      ) : ( */}
      <main className="px-6 py-6">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Content</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {filteredContents.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No content found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first content.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Content
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredContents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                viewMode={viewMode}
                onEdit={setEditingContent}
                onDelete={handleDeleteContent}
              />
            ))}
          </div>
        )}
      </main>
      {/* )} */}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateContentModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateContent}
          setFormData={setFormData}
          formData={formData}
          isPending={isPending}
        />
      )}

      {editingContent && (
        <EditContentModal
          content={editingContent}
          onClose={() => setEditingContent(null)}
          onSave={handleEditContent}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default Page;
