
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export const editorExtensions = [
  StarterKit.configure({
    heading: false,
    horizontalRule: false,
    listItem: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    codeBlock: false,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
];
