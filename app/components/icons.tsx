import React from "react";

export const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

export const icons = {
  bold: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z",
  italic: "M19 4h-9M14 20H5M15 4L9 20",
  underline: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16",
  strike: "M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.1 2.5 2.7 3.3m11.8 2.2c.5.6.8 1.3.8 2.1 0 3.7-3.3 4.4-6.2 4.4-2.1 0-4.3-.4-6.1-1M4 12h16",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  codeBlock: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
  h1: "M4 12h8M4 6v12M12 6v12M17 6l3 3-3 3",
  h2: "M4 12h8M4 6v12M12 6v12M16 8c.5-1.3 2.5-2 3.5-.5 1 1.5-.5 2.5-3.5 4.5H21",
  h3: "M4 12h8M4 6v12M12 6v12M16 8c.5-1 2-1.5 3-.5s.5 2-.5 2.5c1.5.5 2 2.5.5 3.5S16.5 14 16 14",
  bulletList: "M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01",
  orderedList: "M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",
  taskList: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  table: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  insertTable: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  addColAfter: "M11 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6M16 3v18M19 9l3 3-3 3",
  deleteTable: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z M17 17l4 4M21 17l-4 4",
};
