"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, Flame, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import axios from "axios";

export default function PollDetails({ params }) {
  const [poll, setPoll] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const userName = getCookie("userName");
  const [isLiked, setIsLiked] = useState([]);
  const [isTrendingReacted, setIsTrendingReacted] = useState([]);
  const [isVoted, setIsVoted] = useState([]);

  useEffect(() => {
    fetchPoll();
    console.log(params);
  }, [params.slug]);

  const fetchPoll = async () => {
    console.log("calling", params.slug);
    try {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/${params.slug}`
      );
      setPoll(data?.data?.data);
      console.log("cghekubg", data.data);
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
      fetchPoll();
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
      fetchPoll();
      setIsVoted((prev) => [...prev, { slug, option }]);
    } catch (err) {
      setError("Failed to add vote");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/comment/${params.slug}`, {
          comment: comment.trim(),
        }
      );
      console.log(response);
      setComment("");
      fetchPoll();
    } catch (err) {
      setError("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Poll not found
          </h2>
          <button
            onClick={() => router.push("/polls")}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Go back to polls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/polls")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Polls
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {poll?.question}
          </h1>

          <div className="space-y-3">
            {poll.options.map((option) => (
              <div key={option.option} className="flex flex-col gap-2">
                <button
                  disabled={isVoted.some(
                    (vote) =>
                      vote.slug === poll.slug && vote.option === option.option
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

          <div className="space-y-4 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Comments
            </h2>

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </form>

            <div className="space-y-4 mt-6">
              {poll.comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
