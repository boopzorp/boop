
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { FontSize } from './font-size';

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
    allowBase64: true,
    HTMLAttributes: {
      class: 'rounded-md object-cover w-full max-h-96',
    },
  }),
  TextStyle,
  FontSize,
];
