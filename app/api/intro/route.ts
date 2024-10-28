import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY || 'NEYNAR_ONCHAIN_KIT' });

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'EPL',
          target: `${NEXT_PUBLIC_URL}/api/epl`,
          postUrl: `${NEXT_PUBLIC_URL}/api/epl`
        },
        {
          label: 'La Liga',
          target: `${NEXT_PUBLIC_URL}/api/laliga`,
          postUrl: `${NEXT_PUBLIC_URL}/api/laliga`
        }
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/the_aftermatch.png`,
        aspectRatio: '1.91:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/intro`
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';