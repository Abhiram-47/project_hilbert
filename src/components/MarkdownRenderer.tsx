import React, { useEffect } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  useEffect(() => {
    // Configure marked
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
      breaks: true,
      gfm: true
    });
  }, []);

  const processContent = (text: string) => {
    // Process math equations first (before markdown)
    let processed = text;
    
    // Block math ($$...$$)
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
      try {
        const html = katex.renderToString(equation.trim(), {
          displayMode: true,
          throwOnError: false
        });
        return `<div class="math-block my-4">${html}</div>`;
      } catch (e) {
        return `<div class="math-error bg-red-50 border border-red-200 rounded p-2 my-2">Math Error: ${equation}</div>`;
      }
    });
    
    // Inline math ($...$)
    processed = processed.replace(/\$([^$\n]+?)\$/g, (match, equation) => {
      try {
        const html = katex.renderToString(equation.trim(), {
          displayMode: false,
          throwOnError: false
        });
        return `<span class="math-inline">${html}</span>`;
      } catch (e) {
        return `<span class="math-error text-red-600">[Math Error: ${equation}]</span>`;
      }
    });

    // Process markdown
    const htmlContent = marked(processed);
    
    return htmlContent;
  };

  useEffect(() => {
    // Highlight code blocks after render
    Prism.highlightAll();
  });

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processContent(content) }}
      style={{
        // Custom styles for better integration
        '--tw-prose-body': 'inherit',
        '--tw-prose-headings': 'inherit',
        '--tw-prose-lead': 'inherit',
        '--tw-prose-links': 'inherit',
        '--tw-prose-bold': 'inherit',
        '--tw-prose-counters': 'inherit',
        '--tw-prose-bullets': 'inherit',
        '--tw-prose-hr': 'inherit',
        '--tw-prose-quotes': 'inherit',
        '--tw-prose-quote-borders': 'inherit',
        '--tw-prose-captions': 'inherit',
        '--tw-prose-code': 'inherit',
        '--tw-prose-pre-code': 'inherit',
        '--tw-prose-pre-bg': 'inherit',
        '--tw-prose-th-borders': 'inherit',
        '--tw-prose-td-borders': 'inherit',
      } as React.CSSProperties}
    />
  );
};

export default MarkdownRenderer;