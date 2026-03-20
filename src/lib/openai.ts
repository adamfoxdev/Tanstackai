import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

/**
 * ⚠️  WARNING: Using dangerouslyAllowBrowser exposes your API key in client-side code.
 * This is intentional for this local-dev/demo project.
 * For production apps, proxy API requests through a backend server so the key stays private.
 */
export const openai = new OpenAI({
  apiKey: apiKey ?? '',
  dangerouslyAllowBrowser: true,
});

export const DEFAULT_MODEL = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? 'gpt-4o-mini';
