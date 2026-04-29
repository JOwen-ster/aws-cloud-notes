'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { downloadData } from 'aws-amplify/storage';

const client = generateClient<Schema>();

export default function NotePage() {
  const params = useParams();
  const id = params.id as string;

  const [note, setNote] = useState<Schema['Note']['type'] | null>(null);
  const [content, setContent] = useState<string>('');

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
    return <div className="p-8">Loading note...</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{note.title}</h1>

      <div className="mt-4 text-sm text-zinc-500">
        <p>Created: {note.dateOfCreation ?? 'Unknown'}</p>
        <p>File path: {note.filepath ?? 'No file path saved'}</p>
      </div>

      <div className="mt-8 whitespace-pre-wrap rounded-lg border p-4">
        {content || 'No file content found.'}
      </div>
    </main>
  );
}