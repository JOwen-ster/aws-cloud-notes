// THIS IS THE CORRECT FILE TO EDIT, THE REST UNDER /edit ARE ONLY TO REDIRECT YOU TO THE ROOT IN CASE THE URL DOESNT HAVE ALL PARAMS
// CREATE AND /API ROUTE TO VERIFY AND ACCES THE FILE CONTENT FORM AMPLIFY STORAGE
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { downloadData } from 'aws-amplify/storage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const client = generateClient<Schema>();

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const fileid = params.fileid as string;

  const [note, setNote] = useState<Schema['Note']['type'] | null>(null);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      const { data, errors } = await client.models.Note.get({
        id: fileid,
      });

      if (errors) {
        console.error(errors);
        return;
      }

      setNote(data);

      if (data?.filepath) {
        const result = await downloadData({
          path: data.filepath,
        }).result;

        const text = await result.body.text();
        setContent(text);
      }
    }

    if (fileid) fetchNote();
  }, [fileid]);

  if (!note) {
    return <p className="p-6">Loading note...</p>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          ← Back
        </button>

        <button
          onClick={() => setPreview(!preview)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {preview ? 'Edit Text' : 'Preview'}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>

      {preview ? (
        <div className="prose prose-slate max-w-none border rounded p-6 bg-white min-h-[500px]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[500px] border rounded p-4 font-mono"
        />
      )}
    </main>
  );
}
>>>>>>> 746a61f (feat: add note editing page, markdown preview toggle, dashboard routing to edit, and delete button fix)
