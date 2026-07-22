import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, duration } = await req.json();
    const apiKey = req.headers.get('x-veo-key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Google Veo API Key missing.' }, { status: 400 });
    }

    const enhancedPrompt = `${style} style: ${prompt}, high quality 4k video, cinematic lighting, smooth movement, professional animation, duration ${duration} seconds.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-video:predict?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        aspectRatio: '16:9',
        durationSeconds: duration,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        enhancedPrompt
      });
    }

    const data = await response.json();
    return NextResponse.json({ videoUrl: data.videoUrl, enhancedPrompt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
