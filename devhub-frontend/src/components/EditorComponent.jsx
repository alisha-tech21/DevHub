import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex gap-2 p-2 border-b border-neutral-800 bg-[#09090B]">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="p-1 px-2 bg-neutral-800 rounded"
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="p-1 px-2 bg-neutral-800 rounded"
      >
        H2
      </button>
      <button
        onClick={() => {
          const url = window.prompt("URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        className="p-1 px-2 bg-indigo-600 rounded"
      >
        Add Image
      </button>
    </div>
  );
};

export default function BlogEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Start writing your awesome blog...</p>",
  });

  return (
    <div className="bg-[#121316] text-white p-6 rounded-lg border border-neutral-800">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[400px] p-4 outline-none"
      />
    </div>
  );
}
