'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
        StarterKit,
        Markdown,
    ],

    // LOAD CONTENT FROM AWS AMPLIFY FILE
    // STORE MARKDOWN FILES AND JUST LOAD THE CONTENT DONT STORE THE TIPTAP JSON CONVERSION
    //SINCE WE WANT TO BE ABLE TO DOWNLOAD FILES WTHOUT HAVING TO DEAL WITH CONVERSION OVERHEAD.
    content: '<p>Hello World! 🌎️</p>',


    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

  return <EditorContent editor={editor} />
}

export default Tiptap