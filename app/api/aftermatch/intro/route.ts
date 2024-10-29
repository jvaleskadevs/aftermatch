import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY || 'NEYNAR_ONCHAIN_KIT' });
  if (!isValid) return new NextResponse('Message not valid', { status: 500 });

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'EPL',
          target: `${NEXT_PUBLIC_URL}/api/aftermach/epl`,
          postUrl: `${NEXT_PUBLIC_URL}/api/aftermach/epl`
        },
        {
          label: 'La Liga',
          target: `${NEXT_PUBLIC_URL}/api/aftermach/laliga`,
          postUrl: `${NEXT_PUBLIC_URL}/api/aftermach/laliga`
        },
        {
          label: 'Serie A',
          target: `${NEXT_PUBLIC_URL}/api/aftermach/seriea`,
          postUrl: `${NEXT_PUBLIC_URL}/api/aftermach/seriea`
        },
        {
          label: 'Bundesliga',
          target: `${NEXT_PUBLIC_URL}/api/aftermach/bundesliga`,
          postUrl: `${NEXT_PUBLIC_URL}/api/aftermach/bundesliga`
        }
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/the_aftermatch.png`,
        aspectRatio: '1.91:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/aftermach/intro`
    }),
    {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    }
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
