"use client";

import { setCookie } from "cookies-next";
import { Vote as Vote2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name && !isAnonymous) {
      setError("Please enter your name or choose to be anonymous");
      return;
    }

    const userName = isAnonymous ? "Anonymous" : name;
    setCookie("userName", userName);
    router.push("/polls");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Vote2 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            VanishVote
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Create anonymous polls that vanish over time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isAnonymous}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Stay Anonymous
              </span>
            </label>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Enter VanishVote
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          No login required. Your privacy is our priority.
        </p>
      </div>
    </main>
  );
}
