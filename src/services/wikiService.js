import { SourceType } from '../types'; // We'll add types later or use string literals for now

/**
 * The WikiService handles all data interactions.
 * It abstracts whether we are reading local files or fetching from a remote URL.
 */
export const SOURCE_TYPE = {
  LOCAL: 'local',
  REMOTE: 'remote',
};

let CURRENT_SOURCE = SOURCE_TYPE.LOCAL;

/**
 * Fetches all wiki entries and parses them into JSON objects.
 * 
 * @param {SourceType} source - The mode to use (LOCAL or REMOTE).
 * @returns {Promise<Array>} A promise resolving to an array of formatted DTOs.
 */
export async function fetchWikiData(source = CURRENT_SOURCE) {
  if (source !== CURRENT_SOURCE) {
    CURRENT_SOURCE = source;
  }

  // This is a placeholder for the actual fetching logic
  // In LOCAL mode, this would read from campaign_data/
  // In REMOTE mode, this would fetch from your GitHub Pages URL.
  console.log(`Fetching data using: ${CURRENT_SOURCE}`);
  
  // For now, we return an empty array until we implement the specific file-reading logic
  return [];
}

/**
 * Parses a raw Markdown string into our schema DTOs.
 * This uses simple regex to extract YAML frontmatter.
 */
export function parseMarkdown(rawContent) {
  const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const fmString = fmMatch[1];
  const data = {};
  
  // Simple parser to turn "key: value" into a JS object
  fmString.split('\n').forEach(line => {
    const [key, ...val] = line.split(':').map(s => s.trim());
    if (key && val.length) {
      data[key] = val.join(':').replace(/['"]/g, '');
    }
  });

  return {
    title: data.title || 'Untitled',
    type: data.type || 'history',
    parent_id: data.parent_id || null,
    tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
    summary: data.summary || '',
    content: rawContent.split('---')[1]?.trim() || ''
  };
}
