/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check, RefreshCw, Twitter } from "lucide-react";
import { toast } from "sonner";

// Mock stats data - in a real app, this would come from an API
interface TweetStats {
  impressions: number;
  engagements: number;
  retweets: number;
  likes: number;
  replies: number;
}

const generateTweetSuggestions = (product: any): string[] => {
  return [
    `Tired of boring phone cases? Our ${product.name} is AI-designed and shockproof. Check it out 👇 #PhoneCase #TechAccessories`,
    `Protect your phone in style with our ${product.name}. Crystal clear design with maximum protection! Limited time offer 🔥 #MustHave`,
    `Why compromise between style and protection? The ${product.name} offers both! Reinforced corners and a sleek design. Shop now! ✨`
  ];
};

export default function TweetGenerator({ product }: { product: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(
    generateTweetSuggestions(product)
  );
  const [selectedTweet, setSelectedTweet] = useState<string>(suggestions[0]);
  const [editedTweet, setEditedTweet] = useState<string>(suggestions[0]);
  const [activeTab, setActiveTab] = useState<string>("suggestions");
  const [isSaving, setIsSaving] = useState(false);
  const [viewGenerator, setViewGenerator] = useState(false);
  const [savedTweets, setSavedTweets] = useState<
    { tweet: string; stats: TweetStats }[]
  >([]);

  const handleRegenerateTweets = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newSuggestions = generateTweetSuggestions(product);
      setSuggestions(newSuggestions);
      setSelectedTweet(newSuggestions[0]);
      setEditedTweet(newSuggestions[0]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSelectTweet = (tweet: string) => {
    setSelectedTweet(tweet);
    setEditedTweet(tweet);
  };

  const handleEditTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTweet(e.target.value);
  };

  const handleSaveTweet = () => {
    setIsSaving(true);
    setTimeout(() => {
      setSavedTweets([
        ...savedTweets,
        {
          tweet: editedTweet,
          stats: {
            impressions: Math.floor(Math.random() * 10000),
            engagements: Math.floor(Math.random() * 1000),
            retweets: Math.floor(Math.random() * 100),
            likes: Math.floor(Math.random() * 500),
            replies: Math.floor(Math.random() * 50)
          }
        }
      ]);
      setIsSaving(false);
      toast("Your tweet has been saved and is ready to be posted.");
      setViewGenerator(true);
    }, 1000);
  };

  const characterCount = editedTweet.length;
  const isOverLimit = characterCount > 280;

  if (viewGenerator) {
    return (
      <div className="space-y-6 border border-gray-200 h-fit p-6 rounded-xl shadow-lg bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Saved Tweets Analytics
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewGenerator(false)}
            className="border-black-500 text-black-500 hover:bg-black-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Tweet
          </Button>
        </div>

        <div className="grid gap-6">
          {savedTweets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No saved tweets yet. Generate and save a tweet to see analytics.
            </div>
          ) : (
            savedTweets.map((savedTweet, index) => (
              <Card key={index} className="border-gray-200 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-black-100 flex items-center justify-center">
                      <Twitter className="h-5 w-5 text-black-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        Your Company
                      </p>
                      <p className="text-gray-500 text-sm">@yourcompany</p>
                      <p className="mt-2 text-gray-700">{savedTweet.tweet}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Impressions
                      </p>
                      <p className="text-lg font-bold text-black-600">
                        {savedTweet.stats.impressions}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Engagements
                      </p>
                      <p className="text-lg font-bold text-black-600">
                        {savedTweet.stats.engagements}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Retweets
                      </p>
                      <p className="text-lg font-bold text-black-600">
                        {savedTweet.stats.retweets}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Likes</p>
                      <p className="text-lg font-bold text-black-600">
                        {savedTweet.stats.likes}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Replies
                      </p>
                      <p className="text-lg font-bold text-black-600">
                        {savedTweet.stats.replies}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 border border-gray-200 h-fit p-6 rounded-xl shadow-lg bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Tweet Generator</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerateTweets}
          disabled={isGenerating}
          className="border-black-500 text-black-500 hover:bg-black-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid bg-gray-100 w-full grid-cols-2 rounded-lg">
          <TabsTrigger
            value="suggestions"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Suggestions
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Edit & Finalize
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4 mt-4">
          <RadioGroup
            value={selectedTweet}
            onValueChange={handleSelectTweet}
            className="space-y-4"
          >
            {suggestions.map((tweet, index) => (
              <div key={index} className="flex items-start space-x-2">
                <RadioGroupItem
                  value={tweet}
                  id={`tweet-${index}`}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`tweet-${index}`}
                    className="font-normal cursor-pointer"
                  >
                    <Card
                      className={`border transition-all duration-200 ${
                        selectedTweet === tweet
                          ? "border-black-500 border-2 shadow-md"
                          : "border-gray-200"
                      } hover:shadow-sm`}
                    >
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{tweet}</p>
                        <div className="flex justify-end mt-2">
                          <p className="text-xs text-gray-500">
                            {tweet.length} / 280
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-end mt-6">
            <Button
              className="bg-black hover:bg-black/70 text-white cursor-pointer"
              onClick={() => setActiveTab("edit")}
            >
              Continue to Edit
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="tweet-editor" className="text-gray-700 font-medium">
              Edit Your Tweet
            </Label>
            <Textarea
              id="tweet-editor"
              value={editedTweet}
              onChange={handleEditTweet}
              className="min-h-[120px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 resize-none"
              placeholder="Edit your tweet here..."
            />
            <div
              className={`flex justify-end text-sm ${
                isOverLimit ? "text-red-500" : "text-gray-500"
              }`}
            >
              {characterCount} / 280 characters
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-black-100 flex items-center justify-center">
                <Twitter className="h-5 w-5 text-black-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Your Company</p>
                <p className="text-gray-500 text-sm">@yourcompany</p>
                <p className="mt-2 text-gray-700">{editedTweet}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setActiveTab("suggestions")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back to Suggestions
            </Button>
            <Button
              className="bg-black hover:bg-black/30 text-white cursor-pointer"
              onClick={handleSaveTweet}
              disabled={isOverLimit || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Tweet
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
