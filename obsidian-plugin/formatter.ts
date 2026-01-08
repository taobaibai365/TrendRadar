import type { ThemeDetail } from "./api";

/**
 * Sanitizes a string to be used as a valid filename.
 * Removes characters that are not allowed in filenames on most operating systems.
 * @param title The string to sanitize.
 * @returns A sanitized string.
 */
function sanitizeFilename(title: string): string {
    // Replace slashes, backslashes, colons, etc., with a space
    // and remove any leading/trailing whitespace or dots.
    return title.replace(/[\\/:*?"<>|]/g, ' ').trim().replace(/\.$/, '');
}


/**
 * Formats a ThemeDetail object into a Markdown string for a new note.
 * @param theme The theme object to format.
 * @returns A string containing the full content of the note in Markdown format.
 */
export function formatThemeToMarkdown(theme: ThemeDetail): { filename: string, content: string } {
    const filename = `${sanitizeFilename(theme.title)}.md`;

    const frontmatter = `---
tags:
  - trendradar
  - ${theme.category.toLowerCase().replace(' ', '-')}
${theme.tags.map(tag => `  - ${tag.toLowerCase().replace(' ', '-')}`).join('\n')}
category: ${theme.category}
importance: ${theme.importance}
impact: ${theme.impact}
created: ${new Date().toISOString()}
---
`;

    let content = frontmatter;
    content += `\n# ${theme.title}\n\n`;

    content += `## AI Summary\n`;
    content += `${theme.summary}\n\n`;

    content += `## Key Points\n`;
    theme.key_points.forEach(point => {
        content += `- ${point}\n`;
    });
    content += `\n`;

    content += `## Source Articles (${theme.articles.length})\n`;
    theme.articles.forEach(article => {
        content += `- [${article.title}](${article.url})\n`;
    });

    return { filename, content };
}
