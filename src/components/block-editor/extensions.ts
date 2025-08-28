
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { mergeAttributes, Node } from '@tiptap/core';

// Custom Image node to include a caption (figcaption)
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
      },
    };
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      { class: 'my-4' },
      [
        'img',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
            class: 'rounded-md object-cover w-full max-h-96'
        }),
      ],
      ['figcaption', {class: 'text-center text-sm text-muted-foreground mt-2'}, HTMLAttributes.alt || ''],
    ];
  },
});


export const editorExtensions = [
  StarterKit.configure({
    // Disable features that we want to control more granularly if needed
    heading: {
      levels: [1, 2, 3],
    },
    codeBlock: false,
    blockquote: false,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
  Underline,
  CustomImage,
];
