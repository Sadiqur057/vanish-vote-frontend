"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export default function CreatePoll() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresIn, setExpiresIn] = useState("24");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!question.trim()) {
      setError("Question is required");
      setLoading(false);
      return;
    }

    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      setError("At least two options are required");
      setLoading(false);
      return;
    }

    const userName = getCookie("userName");

    try {
      const options = validOptions.map((opt) => ({ option: opt }));

      const data = {
        question: question,
        options,
        expiresIn,
        isPrivate,
        isAnonymous,
        createdBy: userName,
      };
      console.log("data", data);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/polls`,
        data
      );
      console.log(response);
      router.push("/polls");
    } catch (err) {
      console.log(err);
      setError("Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/polls")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Polls
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create New Poll
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Question
              </label>
              <input
                type="text"
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Options
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add Option
              </button>
            </div>

            <div>
              <label
                htmlFor="expiresIn"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Expires In (hours)
              </label>
              <select
                id="expiresIn"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="1">1 hour</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPrivate"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Make poll private (only accessible via link)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isAnonymous"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Create poll anonymously
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Creating..." : "Create Poll"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
