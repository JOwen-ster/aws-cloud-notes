'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { downloadData } from 'aws-amplify/storage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const client = generateClient<Schema>();

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [note, setNote] = useState<Schema['Note']['type'] | null>(null);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      const { data, errors } = await client.models.Note.get({ id });

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

    if (id) fetchNote();
  }, [id]);

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
          {preview ? 'Plain Text' : 'Preview'}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>

      {preview ? (
        <div className="prose max-w-none border rounded p-4 bg-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap border rounded p-4 bg-gray-50">
          {content}
        </pre>
      )}
    </main>
  );
}
