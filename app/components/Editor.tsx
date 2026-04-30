"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { BubbleMenu } from "@tiptap/react/menus";

import { Icon, icons } from '@/app/components/icons';
import { HeadingSelect, Separator, ToolbarButton } from '@/app/components/Toolbar';
import Link from 'next/link'

import { generateClient } from 'aws-amplify/data';
import { downloadData, uploadData } from 'aws-amplify/storage';
import { type Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>({ authMode: 'userPool' });

// ─── Main Editor Component ─────────────────────────────────────────────────────

interface EditorProps {
  initialFileName?: string;
  noteId: string
}

export default function Editor({
  initialFileName = "New Markdown File",
  noteId
}: EditorProps) {
  const [markdownOutput, setMarkdownOutput] = useState();
  const [fileName, setFileName] = useState(initialFileName);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const tableMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: true,
    extensions: [
      Placeholder.configure({
        placeholder: "Start notetaking...",
      }),
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: { class: "code-block" },
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({
        markedOptions: { gfm: true },
      }),
    ],
    content: '',
    contentType: "markdown",
    onUpdate({ editor }) {
      const md = editor.getMarkdown?.() ?? "";
      setMarkdownOutput(md);
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[600px]",
        spellcheck: "true",
      },
    },
  });

  // Sync markdown on mount
  useEffect(() => {
    if (editor) {
      const md = editor.getMarkdown?.() ?? "";
      setMarkdownOutput(md);
    }
  }, [editor]);

  useEffect(() => {
  if (!editor) return;

  const loadNote = async () => {
    try {
      // Fetch note metadata from DynamoDB
      const { data: note, errors } = await client.models.Note.get({ id: noteId });

      if (errors || !note) {
        setError('Note not found.');
        return;
      }

      setFileName(note.title.replace(/\.md$/i, ''));

      const filepath = (note as unknown as { filepath: string }).filepath;
      if (!filepath) {
        setError('No file path associated with this note.');
        return;
      }

      // Download file content from S3
      const { body } = await downloadData({ path: filepath }).result;
      const text = await body.text();

      // Set content in the editor
      editor.commands.setContent(text, { contentType: 'markdown' });
      setMarkdownOutput(editor.getMarkdown?.() ?? text);
    } catch (err) {
      console.error('Failed to load note:', err);
      setError('Failed to load note.');
    } finally {
      setLoading(false);
    }
  };

  loadNote();
}, [editor, noteId]); // runs once editor is ready

  // Close table menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setTableMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ─── File Load ──────────────────────────────────────────────────────────────

  const handleFileLoad = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      setFileName(file.name.replace(/\.md$/i, ""));
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        editor.commands.setContent(content, { contentType: "markdown" });
        const md = editor.getMarkdown?.() ?? content;
        setMarkdownOutput(md);
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [editor],
  );

  // ─── File Save ──────────────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    if (!editor) return;
    const md = editor.getMarkdown?.() ?? markdownOutput;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [editor, fileName, markdownOutput]);

  const [saving, setSaving] = useState(false);

const handleCloudSave = useCallback(async () => {
  if (!editor) return;
  setSaving(true);
  try {
    const { data: note, errors } = await client.models.Note.get({ id: noteId });

    if (errors || !note) {
      console.error('Could not find note to save.');
      return;
    }

    const filepath = (note as unknown as { filepath: string }).filepath;
    const md = editor.getMarkdown?.() ?? '';

    await uploadData({
      path: filepath,
      data: md,
      options: { contentType: 'text/markdown' }
    }).result;

    // Also update the title in DynamoDB if it changed
    await client.models.Note.update({
      id: noteId,
      title: `${fileName}.md`,
    });

  } catch (err) {
    console.error('Failed to save note:', err);
  } finally {
    setSaving(false);
  }
}, [editor, noteId, fileName]);

  if (!editor) return null;
if (loading) return (
  <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
);
if (error) return (
  <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
    <p className="text-red-500 font-medium">{error}</p>
  </div>
);

  // ─── Toolbar groups ─────────────────────────────────────────────────────────

  const toolbarGroups = [
    // Heading
    [<HeadingSelect key="heading" editor={editor} />],
    // Inline format
    [
      <ToolbarButton
        key="bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        </svg>
      </ToolbarButton>,
      <ToolbarButton
        key="italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      </ToolbarButton>,
      <ToolbarButton
        key="underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline (Ctrl+U)"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      </ToolbarButton>,
      <ToolbarButton
        key="strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="4" y1="12" x2="20" y2="12" />
          <path d="M17.5 6.5C17.5 4.5 15.5 3 12 3S6.5 4.5 6.5 6.5c0 2.5 2.5 3.5 5.5 4" />
          <path d="M6.5 17.5C6.5 19.5 8.5 21 12 21s5.5-1.5 5.5-3.5c0-2.5-2-3.5-5.5-4" />
        </svg>
      </ToolbarButton>,
      <ToolbarButton
        key="code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Inline Code"
      >
        <Icon d={icons.code} size={14} />
      </ToolbarButton>,
    ],
    // Block format
    [
      <ToolbarButton
        key="codeBlock"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code Block"
      >
        <Icon d={icons.codeBlock} size={14} />
      </ToolbarButton>,
      <ToolbarButton
        key="bulletList"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <Icon d={icons.bulletList} size={14} />
      </ToolbarButton>,
      <ToolbarButton
        key="orderedList"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <Icon d={icons.orderedList} size={14} />
      </ToolbarButton>,
      <ToolbarButton
        key="taskList"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive("taskList")}
        title="Task List"
      >
        <Icon d={icons.taskList} size={14} />
      </ToolbarButton>,
    ],
    // Table
    [
      <div key="table" className="relative" ref={tableMenuRef}>
        <ToolbarButton
          onClick={() => setTableMenuOpen((v) => !v)}
          isActive={editor.isActive("table") || tableMenuOpen}
          title="Table"
        >
          <Icon d={icons.table} size={14} />
        </ToolbarButton>
        {tableMenuOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[180px]">
            {[
              {
                label: "Insert table",
                action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
              },
              { label: "Add column before", action: () => editor.chain().focus().addColumnBefore().run() },
              { label: "Add column after", action: () => editor.chain().focus().addColumnAfter().run() },
              { label: "Delete column", action: () => editor.chain().focus().deleteColumn().run() },
              { label: "Add row before", action: () => editor.chain().focus().addRowBefore().run() },
              { label: "Add row after", action: () => editor.chain().focus().addRowAfter().run() },
              { label: "Delete row", action: () => editor.chain().focus().deleteRow().run() },
              {
                label: "Delete table",
                action: () => editor.chain().focus().deleteTable().run(),
                danger: true,
              },
            ].map(({ label, action, danger }) => (
              <button
                key={label}
                onMouseDown={(e) => {
                  e.preventDefault();
                  action();
                  setTableMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-1.5 text-sm transition-colors
                  ${danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>,
    ],
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5] font-sans">
      {/* ── App Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        {/* Title row */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100">
          {/* Logo */}
          <Link href={'/dashboard'}>
          <div className="flex items-center gap-2 mr-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="white">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth={1.5} />
                <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth={1.5} />
                <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth={1.5} />
                <polyline points="10 9 9 9 8 9" stroke="white" strokeWidth={1.5} />
              </svg>
            </div>
          </div>
          </Link>

          {/* File name */}
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="text-base font-medium text-gray-800 bg-transparent border-b-2 border-transparent
                         hover:border-gray-300 focus:border-blue-500 focus:outline-none
                         px-1 py-0.5 transition-colors min-w-[200px]"
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700
                           bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon d={icons.upload} size={14} />
              Open
            </button>
            <button
  onClick={handleCloudSave}
  disabled={saving}
  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white
             rounded-lg transition-colors disabled:opacity-60"
  style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" }}
>
  {saving ? (
    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
  ) : (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  )}
  {saving ? 'Saving...' : 'Save'}
</button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white
                           rounded-lg transition-colors"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              <Icon d={icons.download} size={14} />
              Download
            </button>
            <button
              onClick={() => setShowMarkdown((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border
                  ${showMarkdown ? "bg-gray-900 text-white border-gray-900" : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"}`}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              Markdown
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept=".md,.markdown" onChange={handleFileLoad} className="hidden" />
        </div>

        {/* Toolbar row */}
        <div className="flex items-center gap-0.5 px-3 py-1.5 overflow-x-auto">
          {toolbarGroups.map((group, i) => (
            <div key={i} className="flex items-center gap-0.5">
              {i > 0 && <Separator />}
              {group}
            </div>
          ))}
        </div>
      </header>

      {/* ── Page Canvas ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto py-8 px-4">
        <div className={`flex gap-6 max-w-screen-xl mx-auto ${showMarkdown ? "items-start" : "justify-center"}`}>
          {/* Paper */}
          <div
            className={`
                bg-white rounded-sm shadow-md flex-shrink-0 transition-all duration-300
                ${showMarkdown ? "w-1/2" : "w-full max-w-[816px]"}
              `}
            style={{
              minHeight: "1056px",
              padding: "96px 96px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)",
            }}
            onClick={() => editor.commands.focus()}
          >
            {/* Bubble Menu */}
            {editor && (
              <BubbleMenu editor={editor} className="flex items-center gap-0.5 bg-gray-900 rounded-lg shadow-xl p-1">
                {[
                  {
                    key: "bold",
                    title: "Bold",
                    onClick: () => editor.chain().focus().toggleBold().run(),
                    active: editor.isActive("bold"),
                    icon: (
                      <svg
                        width={13}
                        height={13}
                        viewBox="0 0 24 24"
                        fill="white"
                        opacity={editor.isActive("bold") ? 1 : 0.75}
                      >
                        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                      </svg>
                    ),
                  },
                  {
                    key: "italic",
                    title: "Italic",
                    onClick: () => editor.chain().focus().toggleItalic().run(),
                    active: editor.isActive("italic"),
                    icon: (
                      <svg
                        width={13}
                        height={13}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth={2.5}
                        opacity={editor.isActive("italic") ? 1 : 0.75}
                      >
                        <line x1="19" y1="4" x2="10" y2="4" />
                        <line x1="14" y1="20" x2="5" y2="20" />
                        <line x1="15" y1="4" x2="9" y2="20" />
                      </svg>
                    ),
                  },
                  {
                    key: "underline",
                    title: "Underline",
                    onClick: () => editor.chain().focus().toggleUnderline().run(),
                    active: editor.isActive("underline"),
                    icon: (
                      <svg
                        width={13}
                        height={13}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                        opacity={editor.isActive("underline") ? 1 : 0.75}
                      >
                        <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                        <line x1="4" y1="21" x2="20" y2="21" />
                      </svg>
                    ),
                  },
                  {
                    key: "strike",
                    title: "Strike",
                    onClick: () => editor.chain().focus().toggleStrike().run(),
                    active: editor.isActive("strike"),
                    icon: (
                      <svg
                        width={13}
                        height={13}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                        opacity={editor.isActive("strike") ? 1 : 0.75}
                      >
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <path d="M6.5 6C6.5 4.5 8.5 3 12 3s5.5 1.5 5.5 3-2 3-5.5 3.5" />
                      </svg>
                    ),
                  },
                  {
                    key: "code",
                    title: "Code",
                    onClick: () => editor.chain().focus().toggleCode().run(),
                    active: editor.isActive("code"),
                    icon: <Icon d={icons.code} size={13} />,
                  },
                ].map(({ key, title, onClick, active, icon }) => (
                  <button
                    key={key}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onClick();
                    }}
                    title={title}
                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors
                        ${active ? "bg-white/20" : "hover:bg-white/10"}`}
                  >
                    {icon}
                  </button>
                ))}
              </BubbleMenu>
            )}

            <EditorContent editor={editor} />
          </div>

          {/* Markdown Panel */}
          {showMarkdown && (
            <div className="flex-1 min-w-0 sticky top-[97px]">
              <div
                className="bg-gray-900 rounded-lg shadow-md overflow-hidden"
                style={{ maxHeight: "calc(100vh - 130px)" }}
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Markdown Output</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(markdownOutput)}
                    className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                  >
                    Copy
                  </button>
                </div>
                <pre
                  className="p-4 text-sm overflow-y-auto"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: "#a5f3fc",
                    maxHeight: "calc(100vh - 180px)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: 1.7,
                  }}
                >
                  {markdownOutput}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Status Bar ───────────────────────────────────────────── */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-1.5 flex items-center gap-4">
        <div className="flex-1" />
        <span className="text-xs text-gray-400">{fileName}.md</span>
      </footer>
    </div>
  );
}
