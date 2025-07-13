/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  TrendingUp,
  Eye,
  MousePointer,
  BarChart3,
  ArrowUp,
} from "lucide-react";
import { ContentItem, ContentStats } from "../types/content";

interface AnalyticsDashboardProps {
  contents: ContentItem[];
  stats: ContentStats;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  contents,
  stats,
}) => {
  const topPerformingContent = contents
    .sort((a, b) => b.analytics.clickThroughRate - a.analytics.clickThroughRate)
    .slice(0, 5);

  const recentContent = contents
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const publishedContent = contents.filter(
    (c) => c.status === "published"
  ).length;
  const draftContent = contents.filter((c) => c.status === "draft").length;

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalContent}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />
              {publishedContent} published
            </span>
            <span className="text-gray-500 ml-2">• {draftContent} drafts</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="w-4 h-4 mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalClicks.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="w-4 h-4 mr-1" />
            <span>+8.2% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. CTR</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgClickThroughRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="w-4 h-4 mr-1" />
            <span>+2.1% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Content
          </h3>
          <div className="space-y-4">
            {topPerformingContent.map((content, index) => (
              <div key={content.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {content.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {content.type} • {content.analytics.views.toLocaleString()}{" "}
                    views
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {content.analytics.clickThroughRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">CTR</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Type Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Content Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-700">Images</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {contents.filter((c) => c.type === "image").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Videos</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {contents.filter((c) => c.type === "video").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-700">Published</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {publishedContent}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-sm text-gray-700">Drafts</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {draftContent}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Content
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Content
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Views
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    CTR
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentContent.map((content) => (
                  <tr key={content.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={
                              content.type === "video"
                                ? content.thumbnail || ""
                                : content.url
                            }
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {content.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {content.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-sm text-gray-700">
                        {content.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          content.status === "published"
                            ? "bg-green-100 text-green-800"
                            : content.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {content.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {content.analytics.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {content.analytics.clickThroughRate.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {content.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
