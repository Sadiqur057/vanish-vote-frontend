"use client";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="bg-white dark:bg-gray-700">
      <div className="flex justify-between items-center h-24 relative shadow-sm font-mono container mx-auto px-4 bg-white dark:bg-gray-700 text-black dark:text-white">
        <Link href="/">
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            VanishVote
          </h3>
        </Link>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 border rounded-md bg-gray-200 dark:bg-gray-900 text-black dark:text-white"
        >
          {theme === "light" ? "🌞" : "🌙"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
