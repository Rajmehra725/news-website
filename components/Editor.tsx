"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ value, onChange }: any) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false, // 🔥 IMPORTANT FIX
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-3">

      {/* Toolbar */}
      <div className="flex gap-2 mb-2 border-b pb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}