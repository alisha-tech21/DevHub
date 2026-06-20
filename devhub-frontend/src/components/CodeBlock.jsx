import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-neutral-800 bg-[#09090B]">
      {/* HEADER: Language aur Button */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 bg-[#121316]">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-medium text-neutral-400 hover:text-white transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* CODE AREA */}
      <SyntaxHighlighter
        language={language?.toLowerCase() || "javascript"}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: "1rem", background: "transparent" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
