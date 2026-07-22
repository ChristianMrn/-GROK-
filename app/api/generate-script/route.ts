import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, length, style, genre } = await req.json();
    const apiKey = req.headers.get('x-grok-key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Grok API Key missing. Please set it in Settings.' }, { status: 400 });
    }

    const systemPrompt = `You are a professional video script writer and director. 
Given a topic, length, visual style, and genre, generate a structured script JSON response.
Return ONLY valid JSON matching this schema:
{
  "title": "String",
  "hook": "String",
  "bgMusic": "String",
  "scenes": [
    {
      "sceneNumber": 1,
      "narration": "String",
      "imagePrompt": "Detailed visual scene description",
      "cameraAngle": "e.g., Low angle tracking shot",
      "duration": 5,
      "onScreenText": "Short text overlay",
      "soundEffects": "e.g., Woosh",
      "notes": "Director notes"
    }
  ],
  "seo": {
    "title": "SEO Optimized YouTube Title",
    "description": "Full YouTube Description",
    "tags": ["tag1", "tag2"],
    "chapters": [{"time": "0:00", "title": "Intro"}],
    "thumbnailTitle": "Catchy 3-4 word overlay text",
    "thumbnailPrompt": "Visual prompt for thumbnail generation",
    "summary": "Summary",
    "pinnedComment": "Engaging comment to pin"
  }
}`;

    const userPrompt = `Topic: ${topic}\nTarget Length: ${length}\nVisual Style: ${style}\nGenre: ${genre}`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Grok API error: ${err}` }, { status: response.status });
    }

    const data = await response.json();
    const scriptJson = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(scriptJson);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate script' }, { status: 500 });
  }
}
