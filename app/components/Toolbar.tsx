import type { Editor } from "@tiptap/react";
import React from "react";

// ─── Toolbar Button ────────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function ToolbarButton({ onClick, isActive, title, children, disabled }: ToolbarButtonProps) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      disabled={disabled}
      className={`
        relative flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium
        transition-all duration-100 select-none
        ${isActive
          ? "bg-blue-100 text-blue-700 shadow-inner"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {children}
    </button>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────

export function Separator() {
  return <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />;
}

// ─── Heading Select ───────────────────────────────────────────────────────────

export function HeadingSelect({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <select
      value={
        editor.isActive("heading", { level: 1 }) ? "1" :
        editor.isActive("heading", { level: 2 }) ? "2" :
        editor.isActive("heading", { level: 3 }) ? "3" :
        editor.isActive("heading", { level: 4 }) ? "4" : "0"
      }
      onChange={(e) => {
        const level = parseInt(e.target.value);
        if (level === 0) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
        }
      }}
      className="h-8 px-2 pr-7 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 cursor-pointer hover:bg-gray-50 transition-colors appearance-none min-w-[108px]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: "right 4px center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "16px",
      }}
    >
      <option value="0">Paragraph</option>
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
      <option value="4">Heading 4</option>
    </select>
  );
}
