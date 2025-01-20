'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import EditorExtensions from './EditorExtensions';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';

export default function TextEditor({ fileId } : { fileId: string }) {

    // Get notes stored in DB
    const fetchedNotes = useQuery(api.notes.getNotes, {
        fileId: fileId
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: 'Start writing your notes here...' }),
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick: true,
                autolink: true,
                defaultProtocol: 'https',
                linkOnPaste: true,
                HTMLAttributes: {
                    class: 'underline decoration-blue-700 text-blue-700 cursor-pointer'
                }
            }),
            Subscript,
            Superscript,
            Underline,
            Heading.configure({
                levels: [1, 2, 3],
            }),
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none p-2 h-screen'
            }
        }
    });

    useEffect(() => {
        editor && fetchedNotes && editor.commands.setContent(fetchedNotes);
    }
    , [fetchedNotes, editor]);

    return (
        <>
            <EditorExtensions editor={editor} />
            <div className='overflow-scroll h-[85vh]'>
                <EditorContent editor={editor} />
            </div>
        </>

    )
}
