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
 * @param {string} source - The mode to use (LOCAL or REMOTE).
 * @returns {Promise<Array>} A promise resolving to an array of formatted DTOs.
 */
export async function fetchWikiData(source = CURRENT_SOURCE) {
  if (source !== CURRENT_SOURCE) {
    CURRENT_SOURCE = source;
  }

  console.log(`Fetching data using: ${CURRENT_SOURCE}`);

  try {
    // 1. Fetch the manifest first to know which files exist
    // In LOCAL mode, Vite serves this from our campaign_data folder
    const manifestResponse = await fetch('./campaign_data/data_manifest.json');
    if (!manifestResponse.ok) {
      throw new Error('Failed to fetch data manifest.');
    }
    const paths = await manifestResponse.json();

    // 2. Fetch all markdown files in parallel
    const fetchPromises = paths.map(async (path) => {
      const response = await fetch(`./campaign_data/${path}`);
      if (!response.ok) {
        console.error(`Failed to fetch: ${path}`);
        return null;
      }
      const rawContent = await response.text();
      
      // 3. Parse the content into a DTO
      const parsedData = parseMarkdown(rawContent);
      return parsedData ? { ...parsedData, path } : null;
    });

    const results = await Promise.all(fetchPromises);
    
    // Filter out any nulls from failed fetches and return the clean list
    return results.filter(item => item !== null);
  } catch (error) {
    console.error("Error in fetchWikiData:", error);
    throw error;
  }
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
      data[key] = val.join(':').replace(/['\"]/g, '');
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
