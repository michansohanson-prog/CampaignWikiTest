import { CONFIG } from '../config';

/**
 * The WikiService handles all data interactions using relative pathing.
 */

export const SOURCE_TYPE = {
  LOCAL: 'local',
  REMOTE: 'remote',
};

let CURRENT_SOURCE = SOURCE_TYPE.LOCAL;

// Helper function to build a RELATIVE URL safely
const get_data_url = (path) => {
  // We remove the leading slash if it exists so it stays relative
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `campaign_data/${cleanPath}`; 
};

export async function fetchWikiData(source = CURRENT_SOURCE) {
  if (source !== CURRENT_SOURCE) {
    CURRENT_SOURCE = source;
  }

  console.log(`Fetching data using: ${CURRENT_SOURCE}`);

  try {
    // We are now calling "campaign_data/..." instead of "/campaign_data/..."
    const manifestResponse = await fetch(get_data_url('data_manifest.json'));
    if (!manifestResponse.ok) throw new Error(`Failed to fetch manifest at ${get_data_url('data_manifest.json')}`);
    
    const paths = await manifestResponse.json();

    const fetchPromises = paths.map(async (path) => {
      const response = await fetch(get_data_url(path));
      if (!response.ok) return null;
      
      const rawContent = await response.text();
      const parsedData = parseMarkdown(rawContent);
      return parsedData ? { ...parsedData, path } : null;
    });

    const results = await Promise.all(fetchPromises);
    return results.filter(item => item !== null);
  } catch (error) {
    console-error("Error in fetchWikiData:", error);
    throw error;
  }
}

/**
 * Parses a raw Markdown string into our schema DTOs.
 */
export function parseMarkdown(rawContent) {
  const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const fmString = fmMatch[1];
  const data = {};

  fmString.split('\n').forEach(line => {
    const [key, ...val] = line.split(':').map(s => s.trim());
    if (key && val.length) {
      let value = val.join(':');
      value = value.replace(/^["']|["']$/g, '').trim();
      data[key] = value;
    }
  });

  const parts = rawContent.split('---');
  const bodyParts = parts.slice(2);
  const bodyContent = bodyParts.join('\n').trim();

  return {
    title: data.title || 'Untitled',
    type: data.type || 'history',
    parent_id: data.parent_id || null,
    summary: data.summary || '',
    content: bodyContent 
  };
}
