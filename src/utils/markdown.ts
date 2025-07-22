import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  headerIds: false, // Don't add IDs to headers
  mangle: false // Don't escape HTML
});

// Create a custom renderer
const renderer = new marked.Renderer();

// Override link renderer to add target="_blank" and rel="noopener noreferrer"
renderer.link = (href, title, text) => {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`;
};

// Override image renderer to add loading="lazy" and class
renderer.image = (href, title, text) => {
  return `<img src="${href}" alt="${text}" title="${title || ''}" loading="lazy" class="rounded-lg max-w-full h-auto" />`;
};

marked.use({ renderer });

export function formatMarkdown(text: string): string {
  try {
    // Convert markdown to HTML
    const html = marked(text);
    
    // Sanitize HTML to prevent XSS
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'img',
        'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'blockquote', 'pre', 'code'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'loading']
    });

    return clean;
  } catch (error) {
    console.error('Error formatting markdown:', error);
    return text;
  }
}