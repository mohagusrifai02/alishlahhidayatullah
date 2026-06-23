"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 transition"
    >
      {copied ? "Tersalin ✓" : "Copy"}
    </button>
  );
}