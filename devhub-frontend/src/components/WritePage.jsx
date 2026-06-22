import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import { ImageUploadButton } from "./ImageUploadButton";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { TextStyle } from "@tiptap/extension-text-style";
import "highlight.js/styles/atom-one-dark.css";

import hljs from "highlight.js";
import {
  FaTextHeight,
  FaBold,
  FaItalic,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaCode,
  FaListUl,
  FaUndo,
  FaRedo,
  FaCopy,
  FaSearch,
} from "react-icons/fa";
import { Extension } from "@tiptap/core";

export const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
function WritePage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState(
    () => localStorage.getItem("blog-title") || "",
  );
  const [wordCount, setWordCount] = useState(0);
  const [isSaved, setIsSaved] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const lowlight = createLowlight(common);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState("");
  const [fontSize, setFontSize] = useState("18px");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TextStyle,
      FontSize,
      CodeBlockLowlight.configure({ lowlight }), // <--- Ye colorful banayega
      Image.configure({ inline: true, allowBase64: true }),
      CharacterCount.configure({ limit: 10000 }),
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
    ],
    content: localStorage.getItem("blog-content") || "",
    onUpdate: ({ editor }) => {
      setWordCount(editor.storage.characterCount.words());
      setIsSaved(false);
    },
    onCreate: ({ editor }) =>
      setWordCount(editor.storage.characterCount.words()),
  });
  useEffect(() => {
    if (!searchTerm) return;

    const highlighted = document.querySelector("mark");

    if (highlighted) {
      highlighted.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [searchTerm]);
  useEffect(() => {
    if (!editor) return;

    // 1. Editor ka content update hone ke baad
    const timer = setTimeout(() => {
      // Ye preview container mein jitne bhi pre code hain unhe highlight karega
      hljs.highlightAll();
    }, 100);

    return () => clearTimeout(timer);
  }, [editor?.getHTML()]);

  useEffect(() => {
    if (!editor) return;
    const interval = setInterval(() => {
      localStorage.setItem("blog-content", editor.getHTML());
      localStorage.setItem("blog-title", title);
      setIsSaved(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [editor, title]);

  const copyPreview = async () => {
    if (!editor) return;

    try {
      await navigator.clipboard.writeText(editor.getText());
      toast.success("Copied successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy!");
    }
  };
  const highlightText = (html, term) => {
    if (!term) return html;

    const regex = new RegExp(`(${term})`, "gi");

    return html.replace(
      regex,
      `<mark class="bg-yellow-400 text-black px-1 rounded">$1</mark>`,
    );
  };

  const publishBlog = async () => {
    // 1. Auth Gatekeeper
    if (!user || !user.token) {
      // User ko login page par bhej dein, sath mein ek state bhej dein
      // taake login page ko pata chale ki user kahan se aa raha hai
      navigate("/login", {
        state: {
          from: "/write",
          message: "Please sign in to publish your blog.", // Ye message hum login page par dikha sakte hain
        },
      });
      return;
    }

    if (!title) return toast.error("Title required!");

    setIsPublishing(true);
    setStatus("publishing"); // Status set karein

    try {
      const htmlContent = editor.getHTML();
      const match = htmlContent.match(/src="([^"]+)"/);
      const imageUrl = match ? match[1] : "https://via.placeholder.com/800";

      const response = await fetch(`${API_URL}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Token format verify karein
        },
        body: JSON.stringify({
          title: title.replace("# ", ""),
          content: htmlContent,
          imageUrl: imageUrl,
          tags: tags.split(",").map((t) => t.trim()),
        }),
      });

      if (response.ok) {
        setStatus("success");
        toast.success("Published successfully!"); // Success ka chhota sa toast

        // UI/Storage Reset
        localStorage.removeItem("blog-content");
        localStorage.removeItem("blog-title");
        setTitle("");
        editor.commands.setContent("");

        // 3 sec baad status clear kar dein
        setTimeout(() => setStatus(""), 3000);
      } else {
        const errorData = await response.json();
        setStatus("error");
        toast.error(errorData.message || "Publish failed!");
      }
    } catch (err) {
      console.error("Publishing error:", err);
      setStatus("error");
      toast.error("Error publishing. Please try again later.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-screen bg-[#0A0A0A] text-white flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="sticky top-0 z-50 flex flex-col lg:flex-row lg:items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 bg-[#09090B] gap-3">
        <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <FaBold />
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <FaItalic />
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          >
            <FaAlignLeft />
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          >
            <FaAlignCenter />
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          >
            <FaAlignRight />
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()} // <--- toggleCode() ki jagah toggleCodeBlock()
          >
            <FaCode />
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <FaListUl />
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors px-2"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors px-2"
            onClick={() => editor?.chain().focus().setParagraph().run()}
          >
            P
          </button>
          <div className="flex items-center gap-2 border-l border-neutral-700 pl-4">
            <FaTextHeight size={12} />
            <select
              className="bg-transparent text-[10px] outline-none cursor-pointer text-neutral-400"
              onChange={(e) => {
                const size = e.target.value;
                if (size === "default") {
                  editor.chain().focus().unsetFontSize().run();
                } else {
                  // Ye Tiptap ki command hai jo sirf selected text par kaam karti hai
                  editor
                    .chain()
                    .focus()
                    .setMark("textStyle", { fontSize: size })
                    .run();
                }
              }}
            >
              <option value="12px">Small</option>
              <option value="16px">Medium</option>
              <option value="24px">Large</option>
              <option value="32px">XL</option>
            </select>
          </div>

          <div className="hover:text-white transition-colors">
            <ImageUploadButton editor={editor} />
          </div>
          <div className="h-6 w-px bg-neutral-800 mx-1" />
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <FaUndo size={14} />
          </button>
          <button
            className="cursor-pointer hover:text-white transition-colors"
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <FaRedo size={14} />
          </button>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
          <span className="text-xs text-neutral-400">📝 {wordCount} words</span>
          <div className="flex items-center bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            <FaSearch size={12} className="text-neutral-600 mr-2" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-xs w-20 cursor-text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span
            className={`text-xs ${isSaved ? "text-green-500" : "text-yellow-500"}`}
          >
            {isSaved ? "● Auto-saved" : "● Saving..."}
          </span>
          <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
            {status === "publishing" && (
              <span className="text-xs text-neutral-400">Publishing...</span>
            )}
            {status === "success" && (
              <span className="text-xs text-green-500">Published!</span>
            )}
            {status === "error" && (
              <span className="text-xs text-red-500">Failed!</span>
            )}

            <button
              onClick={publishBlog}
              disabled={isPublishing}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold ${
                isPublishing
                  ? "bg-neutral-800 text-neutral-500"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-y-auto">
        {" "}
        {/* LEFT COLUMN: MARKDOWN EDITOR */}
        <div className="border-r border-neutral-800 p-4 sm:p-6 lg:p-8">
          {" "}
          <div className="text-xs text-neutral-500 mb-2 uppercase tracking-widest font-bold">
            MARKDOWN EDITOR
          </div>
          <input
            className="w-full bg-transparent text-3xl font-bold mb-6 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="# Title..."
          />
          <div className="mb-6">
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-2">
              Tags (comma separated)
            </label>
            <input
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white outline-none focus:border-indigo-500"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. JavaScript, React, Web Development"
            />
          </div>
          <div style={{ fontSize: fontSize }}>
            <EditorContent
              editor={editor}
              className="prose prose-invert max-w-none"
            />
          </div>
        </div>
        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div className="p-4 sm:p-6 lg:p-8 bg-[#050505] overflow-y-auto">
          {" "}
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-green-500 uppercase tracking-widest font-bold">
              LIVE PREVIEW
            </div>
            <button
              onClick={copyPreview}
              className="text-neutral-500 hover:text-white flex items-center gap-1 text-xs cursor-pointer transition-colors"
            >
              <FaCopy size={12} /> Copy
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-4">{title.replace("# ", "")}</h1>
          <div
            className="prose prose-invert max-w-none preview-content"
            dangerouslySetInnerHTML={{
              __html: highlightText(editor?.getHTML() || "", searchTerm),
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default WritePage;
