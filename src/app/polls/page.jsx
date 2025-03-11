"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, Flame, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function PollsPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLiked, setIsLiked] = useState([]);
  const [isTrendingReacted, setIsTrendingReacted] = useState([]);
  const [isVoted, setIsVoted] = useState([]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/polls`);
      setPolls(data?.data?.data);
    } catch (err) {
      setError("Failed to fetch polls");
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (slug, reaction) => {
    try {
      const data = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/reaction/${slug}`,
        {
          reaction,
        }
      );
      fetchPolls();
      if (reaction === "like") {
        return setIsLiked((prev) => [...prev, slug]);
      }
      setIsTrendingReacted((prev) => [...prev, slug]);
    } catch (err) {
      setError("Failed to add reaction");
    }
  };

  const handleVote = async (slug, option) => {
    try {
      const data = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/vote/${slug}`,
        {
          option,
        }
      );
      fetchPolls();
      setIsVoted((prev) => [...prev, { slug, option }]);
    } catch (err) {
      setError("Failed to add vote");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Active Polls
          </h1>
          <button
            onClick={() => router.push("/polls/create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Poll
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {polls?.map((poll) => (
            <div
              key={poll._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <Link href={`/polls/${poll.slug}`}>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {poll.question}
                </h2>
              </Link>

              <div className="space-y-3">
                {poll.options.map((option) => (
                  <div key={option.option} className="flex flex-col gap-2">
                    <button
                      disabled={isVoted.some(
                        (vote) =>
                          vote.slug === poll.slug &&
                          vote.option === option.option
                      )}
                      onClick={() => handleVote(poll.slug, option.option)}
                      className={`w-full text-left px-4 py-2 rounded transition-colors
    bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
    ${
      isVoted.some(
        (vote) => vote.slug === poll.slug && vote.option === option.option
      )
        ? "bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-400"
        : "text-gray-600 dark:text-gray-400"
    }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option.option}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {option.votes} votes
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                <button
                  disabled={isLiked.includes(poll.slug)}
                  onClick={() => handleReaction(poll.slug, "like")}
                  className={`flex items-center gap-2 ${
                    isLiked.includes(poll.slug)
                      ? "text-blue-800 dark:text-blue-700"
                      : "text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-400"
                  }`}
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span>{poll.reactions.like}</span>
                </button>
                <button
                  disabled={isTrendingReacted.includes(poll.slug)}
                  onClick={() => handleReaction(poll.slug, "trending")}
                  className={`flex items-center gap-2 ${
                    isTrendingReacted.includes(poll.slug)
                      ? "text-orange-800 dark:text-orange-700"
                      : "text-gray-600 hover:text-orange-600 dark:hover:text-orange-400 dark:text-gray-400"
                  }`}
                >
                  <Flame className="h-5 w-5" />
                  <span>{poll.reactions.trending}</span>
                </button>
                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  Created by: {poll.createdBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
