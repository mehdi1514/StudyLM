"use client";

import { chatSession } from "@/configs/AiModel";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Editor } from "@tiptap/react";
import { useAction, useMutation } from "convex/react";
import { Bold, Code, Heading1, Heading2, Heading3, Highlighter, Italic, Link, Save, Sparkles, Subscript, Superscript, Underline } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import ExtensionToolTip from "./ExtensionToolTip";


export default function EditorExtensions({ editor }: { editor: Editor | null }) {
    const { fileId } = useParams<{ fileId: string }>();
    const saveNotes = useMutation(api.notes.addNotes);
    const { user } = useUser();
    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('Enter the URL or modify', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor]);

    const searchAi = useAction(api.myActions.search);

    const onAiClick = async () => {
        const selectedText = editor?.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        );
        if (selectedText) {
            toast.info("AI is working on the answer...")
            const result = await searchAi({
                query: selectedText,
                fileId: fileId
            });
            const unformattedAns = JSON.parse(result);
            let allUnformattedAnswers = '';
            unformattedAns && unformattedAns.forEach((ans: { pageContent: string, metadata: { fileId: string } }) => {
                allUnformattedAnswers += ans.pageContent;
            });

            const PROMPT = `Suppose you are very good at understanding content and answering questions related to that content. Following is a question: 
            ${selectedText}
            
            Now read the whole content below and answer the above question. Make sure to give the answer in HTML format:
            ${allUnformattedAnswers}
            
            If you do not find an appriopriate answer in the content then use your own knowledge to answer the question. But mention that you didn't find the answer in the content so you are giving an answer based on your training data.
            
            Wrap important words with <mark> tag if the question says to highlight, otherise make it bold wherever necessary.`;

            const aiModelResult = await chatSession.sendMessage(PROMPT);
            const finalAns = aiModelResult.response.text().replace('```', '').replace('html', '').replace('```', '');
            editor?.commands.setContent(`${editor?.getHTML()} ${finalAns}`);

            saveNotes({
                fileId: fileId,
                notes: editor?.getHTML(),
                createdBy: user?.primaryEmailAddress?.emailAddress as string
            });

            toast.success("Saved Notes");
        } else {
            alert('Please select some text and then click the AI button');
        }

    }

    if (!editor) {
        return null
    }

    return (
        <div>
            <div className="control-group p-3 bg-slate-100">
                <div className="button-group flex gap-2 bg-slate-100">
                    <ExtensionToolTip tip="Bold">
                        <button
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={editor?.isActive('bold') ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Bold size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Italic">
                        <button
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={editor?.isActive('italic') ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Italic size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Underline">
                        <button
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={editor.isActive('underline') ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Underline size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Heading1">
                        <button
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={editor.isActive('heading', { level: 1 }) ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Heading1 size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Heading2">
                        <button
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={editor.isActive('heading', { level: 2 }) ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Heading2 size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Heading3">
                        <button
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={editor.isActive('heading', { level: 3 }) ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Heading3 size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Code">
                        <button
                            onClick={() => editor?.chain().focus().toggleCode().run()}
                            className={editor?.isActive('code') ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Code size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Highlight">
                        <button
                            onClick={() => editor?.chain().focus().toggleHighlight().run()}
                            className={editor?.isActive('highlight') ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Highlighter size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Link">
                        <button
                            onClick={setLink}
                            className={editor?.isActive('link') ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Link size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Subscript">
                        <button
                            onClick={() => editor?.chain().focus().toggleSubscript().run()}
                            className={editor.isActive('subscript') ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Subscript size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Superscript">
                        <button
                            onClick={() => editor.chain().focus().toggleSuperscript().run()}
                            className={editor.isActive('superscript') ? 'text-blue-500 bg-slate-300 p-1' : 'p-1'}
                        >
                            <Superscript size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Answer with AI">
                        <button
                            onClick={() => onAiClick()}
                            className="bg-blue-600 p-1 text-white rounded-xl hover:bg-blue-500"
                        >
                            <Sparkles size={15} />
                        </button>
                    </ExtensionToolTip>

                    <ExtensionToolTip tip="Save">
                        <button
                            onClick={() => {
                                saveNotes({
                                    fileId: fileId,
                                    notes: editor?.getHTML(),
                                    createdBy: user?.primaryEmailAddress?.emailAddress as string
                                });
                                toast.success("Saved Notes");
                            }}
                            className=""
                        >
                            <Save size={15} />
                        </button>
                    </ExtensionToolTip>

                </div>
            </div>
        </div>
    )
}
