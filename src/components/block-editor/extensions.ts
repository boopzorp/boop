
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4],
    },
    codeBlock: false,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
  Underline,
  Image.configure({
    // Allow images to have alt and title attributes, which we use for captions
    allowBase64: true,
    HTMLAttributes: {
      class: 'rounded-md object-cover w-full max-h-96',
    },
  }),
];
