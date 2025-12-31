import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Note } from "../types";
import { EditIcon, EyeIcon } from "./icons";

interface EditorProps {
  note: Note | undefined;
  onUpdateNote: (id: string, content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdateNote }) => {
  const [content, setContent] = useState(note?.content || "");
  const [previewOnly, setPreviewOnly] = useState(false);

  // Debounce effect for autosaving
  useEffect(() => {
    if (!note) return;
    const handler = setTimeout(() => {
      if (content !== note.content) {
        onUpdateNote(note.id, content);
      }
    }, 1500);
    return () => clearTimeout(handler);
  }, [content, note, onUpdateNote]);

  // Update local state when a different note is selected
  useEffect(() => {
    setContent(note?.content || "");
  }, [note]);

  const markdownStyles = useMemo(
    () => ({
      h1: "text-3xl font-bold pb-2 pt-2 mb-4",
      h2: "text-2xl font-semibold pb-2 pt-2 mb-3",
      h3: "text-xl font-semibold mb-2 py-2 mt-2",
      p: "mb-4 leading-relaxed",
      ul: "list-disc pl-5 mb-4",
      ol: "list-decimal pl-5 mb-4",
      li: "mb-1",
      blockquote:
        "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4",
      code: "bg-gray-200 rounded-md px-2 py-1 font-mono text-sm",
      pre: "bg-gray-800 text-white rounded-md p-4 my-4 overflow-x-auto",
      a: "text-blue-600 hover:underline",
      table:
        "table-auto w-full my-4 border-collapse border border-gray-300",
      th: "border border-gray-300 px-4 py-2 bg-gray-100 font-semibold",
      td: "border border-gray-300 px-4 py-2",
    }),
    []
  );

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>Select a note to view or edit.</p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-semibold text-gray-800 truncate">
          {note.title}
        </h1>

        {/* 👁️ / ✏️ Toggle Button */}
        <button
          onClick={() => setPreviewOnly((p) => !p)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          title={previewOnly ? "Switch to Edit Mode" : "Switch to Preview Mode"}
        >
          {previewOnly ? (
            <EditIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <EyeIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
        {/* 📝 Textarea - hidden in preview mode */}
        {!previewOnly && (
          <div className="h-full flex flex-col">
            <textarea
              key={note.id}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-6 bg-white resize-none text-base leading-7 font-sans text-gray-800"
              placeholder="Start writing..."
            />
          </div>
        )}

        {/* 👁️ Preview Area */}
        <div
          className={`h-full overflow-y-auto p-8 bg-gray-50 border-l border-gray-200 font-sans text-gray-800 ${
            previewOnly ? "md:col-span-2" : "hidden md:block"
          }`}
        >
          <article className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className={markdownStyles.h1} {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className={markdownStyles.h2} {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className={markdownStyles.h3} {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className={markdownStyles.p} {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className={markdownStyles.ul} {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className={markdownStyles.ol} {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className={markdownStyles.li} {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className={markdownStyles.blockquote}
                    {...props}
                  />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className={markdownStyles.code} {...props} />
                  ) : (
                    <pre className={markdownStyles.pre}>
                      <code {...props} />
                    </pre>
                  ),
                a: ({ node, ...props }) => (
                  <a className={markdownStyles.a} {...props} />
                ),
                table: ({ node, ...props }) => (
                  <table className={markdownStyles.table} {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className={markdownStyles.th} {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className={markdownStyles.td} {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </main>
  );
};

export default Editor;
