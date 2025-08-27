
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Node } from '@tiptap/core';

// Custom node to represent non-editable image blocks within the editor
const ImagePlaceholder = Node.create({
  name: 'imagePlaceholder',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      blockId: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="image-placeholder"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    // This node doesn't render anything itself, it's just a placeholder in the document
    return ['div', { ...HTMLAttributes, 'data-type': 'image-placeholder', contenteditable: 'false' }];
  },
});


export const editorExtensions = [
  StarterKit.configure({
    // Disable starter kit features we'll handle manually or don't need
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
  ImagePlaceholder, // We don't render images in the editor, just hold a place for them
];
