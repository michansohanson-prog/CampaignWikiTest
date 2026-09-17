/**
 * The WikiService handles all data interactions.
 */

export const SOURCE_TYPE = {
  LOCAL: 'local',
  REMOTE: 'remote',
};

let CURRENT_SOURCE = SOURCE_TYPE.LOCAL;

export async function fetchWikiData(source = CURRENT_SOURCE) {
  if (source !== CURRENT_SOURCE) {
    CURRENT_SOURCE = source;
  }

  console.log(`Fetching data using: ${CURRENT_SOURCE}`);

  try {
    const manifestResponse = await fetch('./campaign_data/data_manifest.json');
    if (!manifestResponse.ok) throw new Error('Failed to fetch data manifest.');
    const paths = await manifestResponse.json();

    const fetchPromises = paths.map(async (path) => {
      // Ensure we are fetching from the correct relative path for Vite's dev server
      const response = await fetch(`./campaign_data/${path}`);
      if (!response.ok) return null;
      const rawContent = await response.text();
      
      const parsedData = parseMarkdown(rawContent);
      return parsedData ? { ...parsedData, path } : null;
    });

    const results = await Promise.all(fetchPromises);
    return results.filter(item => item !== null);
  } catch (error) {
    console.error("Error in fetchWikiData:", error);
    throw error;
  }
}

/**
 * Parses a raw Markdown string into our schema DTOs.
 */
export function parseMarkdown(rawContent) {
  // Use a more robust regex to ensure we only capture the frontmatter block correctly
  const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const fmString = fmMatch[1];
  const data = {};

  // Parse Frontmatter keys
  fmString.split('\n').forEach(line => {
    const [key, ...val] = line.split(':').map(s => s.trim());
    if (key && val.length) {
      let value = val.join(':').replace(/['\"]/g, '');
      // Handle array types for tags
      if (key === 'tags' && value.includes(',')) {
        data[key] = value.split(',').map(t => t.trim()).filter(t => t !== "");
      } else {
        data[key] = value;
      }
    }
  });

  // The content is everything AFTER the second "---" separator
  const parts = rawContent.split('---');
  // Index 0 is before first ---, Index 1 is frontmatter, Index 2+ is the actual body
  const bodyParts = parts.slice(2);
  const bodyContent = bodyParts.join('\n').trim();

  return {
    title: data.title || 'Untitled',
    type: data.type || 'history',
    parent_id: data.parent_id || null,
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
    summary: data.summary || '',
    content: bodyContent // Now strictly the content after frontmatter
  };
}
