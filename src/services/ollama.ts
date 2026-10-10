import type { DailyColor } from '../types';


export interface OllamaStatus {
  isConnected: boolean;
  models: string[];
  error?: string;
  checkedAt: string;
}

export interface ScoutMissionOptions {
  endpoint: string;
  model: string;
  color: DailyColor;
  mode: 'all_spots' | 'nature_focus' | 'everyday_focus' | 'mindfulness' | 'creative_quest';
  difficulty?: 'gentle' | 'curious' | 'detective';
  onChunk?: (chunk: string, fullText: string) => void;
}

/**
 * Check connectivity to Ollama server and list available pulled models
 */
export async function checkOllamaStatus(endpoint: string = 'http://localhost:11434'): Promise<OllamaStatus> {
  const cleanEndpoint = endpoint.replace(/\/+$/, '');
  const timestamp = new Date().toLocaleTimeString();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${cleanEndpoint}/api/tags`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        isConnected: false,
        models: [],
        error: `HTTP Error ${res.status}: ${res.statusText}`,
        checkedAt: timestamp
      };
    }

    const data = await res.json();
    const models: string[] = Array.isArray(data.models)
      ? data.models.map((m: { name?: string }) => m.name || 'unknown')
      : [];

    return {
      isConnected: true,
      models,
      checkedAt: timestamp
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const isCorsOrFetch = errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError');

    return {
      isConnected: false,
      models: [],
      error: isCorsOrFetch
        ? 'Cannot reach Ollama at ' + cleanEndpoint + '. Make sure Ollama is running with CORS enabled (OLLAMA_ORIGINS="*").'
        : errorMessage,
      checkedAt: timestamp
    };
  }
}

/**
 * Build a structured, engaging prompt for Ollama based on Touch Grass color hunting
 */
export function buildScoutPrompt(
  color: DailyColor,
  mode: ScoutMissionOptions['mode'],
  difficulty: 'gentle' | 'curious' | 'detective' = 'curious'
): string {
  const difficultyGuide = {
    gentle: 'Keep suggestions easily accessible within a 10-minute walk from a porch, suburban street, or city park.',
    curious: 'Suggest slightly hidden details that reward attentive looking, like bark texture, flower veins, or subtle urban materials.',
    detective: 'Challenging scavenger hunt looking for rare botanical specimens, microscopic textures, or surprising architectural nuances.'
  }[difficulty];

  switch (mode) {
    case 'nature_focus':
      return `You are "Color Scout", an open-weight AI naturalist for the "Touch Grass" color challenge.
Today's assigned hunt color is: ${color.name} (Hex: ${color.hex}, Family: ${color.family}).
Difficulty: ${difficulty} (${difficultyGuide}).

Your mission is to motivate the user to leave their computer screen and step outside.
Provide a concise, vivid field guide with:
1. 🌿 3 Specific Nature Hiding Spots (e.g. particular flora, soil layers, moss species, bird plumage, stone minerals).
2. 🔬 Micro-Observation Tip: One tiny botanical or geological feature they should inspect closely with their eyes or phone camera.
3. 🍃 "Touch Grass" Mindfulness Prompt: A one-sentence sensory pause to breathe and ground themselves outside.

Format with clear headers and bullet points. Keep it engaging, poetic, yet practical!`;

    case 'everyday_focus':
      return `You are "Color Scout", an open-source AI observation companion for the "Touch Grass" challenge.
Today's assigned color is: ${color.name} (Hex: ${color.hex}).
Difficulty: ${difficulty} (${difficultyGuide}).

The user must find one photo of this color in Everyday Life (objects, architecture, clothing, food, or streetscapes).
Provide:
1. 🏙️ 3 Surprising Urban / Everyday Object Suggestions where this exact hue often appears.
2. 📸 Framing Tip: How to take a creative, artistic photo of this item with good natural lighting.
3. 🚶 Walking Route Idea: Where in a neighborhood (coffee shop, library, garden path, transit stop) to wander to find it.

Format cleanly with bullet points and friendly emoji.`;

    case 'mindfulness':
      return `You are "Color Scout", a mindful outdoor walking guide.
Today's assigned color is ${color.name} (${color.hex}).
Create an immersive, calming 15-minute "Color Walk" meditation:
1. Grounding Start: How to begin the walk without checking notifications.
2. Sensory Attunement: How to soften gaze to notice peripheral colors and shadows.
3. Two specific contemplation prompts while seeking ${color.name} in the living world.
Keep the tone warm, grounded, and restorative.`;

    case 'creative_quest':
      return `You are "Color Scout", designing a photography quest for the "Touch Grass" challenge.
Color: ${color.name} (${color.hex}).
Create a two-part creative photography mission:
- Mission 1 (Nature): A macro or texture shot focusing on how light interacts with ${color.name} outdoors.
- Mission 2 (Everyday Life): A playful composition pairing human design with ${color.name}.
Give both missions a catchy adventure title and a pro camera angle tip (e.g., worm's-eye view, golden hour backlighting).`;

    case 'all_spots':
    default:
      return `You are "Color Scout", an open-source AI guide for the "Touch Grass" daily color challenge.
Today's assigned color is: ${color.name} (Hex: ${color.hex}).
Nature context: ${color.natureFact}
Difficulty: ${difficulty} (${difficultyGuide}).

The user must capture TWO photos today:
1) One in NATURE (flower, tree, sky, stone, insect, water)
2) One in EVERYDAY LIFE (clothing, architecture, objects, food)

Please provide:
- 🌿 Nature Scout: 3 real-world outdoor locations/specimens to find this color.
- 📦 Everyday Scout: 3 indoor or urban objects/places with this hue.
- 🎯 Scout's Secret Challenge: One unique, playful observation challenge for today.

Keep your response punchy, inspiring, and concise (under 250 words).`;
  }
}

/**
 * Call Ollama API to generate a Color Scout mission, with optional streaming tokens
 */
export async function generateScoutMission(options: ScoutMissionOptions): Promise<string> {
  const { endpoint, model, color, mode, difficulty = 'curious', onChunk } = options;
  const cleanEndpoint = endpoint.replace(/\/+$/, '');
  const prompt = buildScoutPrompt(color, mode, difficulty);

  const payload = {
    model: model || 'llama3.2',
    prompt,
    stream: Boolean(onChunk),
    options: {
      temperature: 0.75,
      top_p: 0.9
    }
  };

  const response = await fetch(`${cleanEndpoint}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed (${response.status}): ${response.statusText}`);
  }

  // Handle streaming
  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            fullText += parsed.response;
            onChunk(parsed.response, fullText);
          }
        } catch {
          // Incomplete line, ignore
        }
      }
    }
    return fullText;
  } else {
    // Non-streaming response
    const data = await response.json();
    return data.response || 'No mission text generated.';
  }
}

/**
 * High-quality offline fallback guide when Ollama server is offline.
 * Ensures users always have rich exploration prompts even before configuring Ollama.
 */
export function getOfflineScoutGuide(color: DailyColor, mode: ScoutMissionOptions['mode']): string {
  const natureBullets = color.natureHints.map(h => `• ${h}`).join('\n');
  const everydayBullets = color.everydayHints.map(h => `• ${h}`).join('\n');

  if (mode === 'nature_focus') {
    return `### 🌿 Field Guide for ${color.name} (${color.hex})\n\n**Where to look in Nature:**\n${natureBullets}\n\n**Botanical Context:**\n${color.natureFact}\n\n**Seasonal Timing:**\n${color.seasonRelevance}\n\n*💡 Micro-Tip: Look beneath leaves and along shaded ridges where moisture preserves deeper pigment tones.*`;
  }

  if (mode === 'everyday_focus') {
    return `### 🏙️ Everyday Life Scout for ${color.name} (${color.hex})\n\n**Everyday Object Ideas:**\n${everydayBullets}\n\n**Composition Advice:**\nPlace your object next to a neutral cream or wooden surface under gentle window light to let ${color.name} shine without harsh glare.`;
  }

  if (mode === 'mindfulness') {
    return `### 🧘 15-Minute Sensory Color Walk\n\n1. **Pocket the Phone:** Put your device away for the first 10 minutes of walking.\n2. **Color Horizon:** Let your focus soften. Don't hunt aggressively; allow ${color.name} to catch your eye naturally.\n3. **Notice Light:** Observe whether ${color.name} appears brighter in direct sunlight or in canopy shade.\n4. **Grounding Breath:** Take three slow deep breaths outdoors before snapping your photos.`;
  }

  return `### 🧭 Color Scout Brief: ${color.name} (${color.hex})\n\n**🌿 Nature Targets:**\n${natureBullets}\n\n**📦 Everyday Life Targets:**\n${everydayBullets}\n\n**Science Note:**\n${color.natureFact}\n\n*🎯 Today's Goal: Step outside for at least 15 minutes, notice how ${color.name} interacts with daylight, and snap both photos!*`;
}
