import Editor from "@/app/components/Editor";

interface EditorPageProps {
  params: Promise<{
    fileid: string;
  }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { fileid } = await params;
  const decodedFileId = decodeURIComponent(fileid);

  return <Editor initialFileName={decodedFileId} initialContent="" />;
}
