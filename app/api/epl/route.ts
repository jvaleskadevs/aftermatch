import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY || 'NEYNAR_ONCHAIN_KIT' });

  const week = 9;

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  //const text = message.input || '';
  let state = {
    game: 0
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Next Game',
        }
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/og?league=epl&week=${week}&game=${state.game}`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/epl`,
      state: {
        game: message.buttonIndex === 1 ? state.game + 1 : state.game,
        time: new Date().toISOString(),
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
