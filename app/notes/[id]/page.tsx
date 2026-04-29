'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export default function NotePage() {
  const params = useParams();
  const id = params.id as string;

  const [note, setNote] = useState<Schema['Note']['type'] | null>(null);

  useEffect(() => {
    async function fetchNote() {
      const { data, errors } = await client.models.Note.get({ id });

      if (errors) {
        console.error(errors);
        return;
      }

      setNote(data);
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
    </main>
  );
}