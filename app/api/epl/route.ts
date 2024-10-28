import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY || 'NEYNAR_ONCHAIN_KIT' });
  if (!isValid) return new NextResponse('Message not valid', { status: 500 });
  
  const week = 9;

  //const text = message.input || '';
  let state = {
    game: 0,
    stats: false
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
    if (message.button === 1) state.game++;
    if (message.button === 2) state.stats = !state.stats;
  } catch (e) {
    console.error(e);
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Next'
        },
        {
          label: state.stats ? 'Game' : 'Stats'
        },
        {
          action: 'link',
          label: 'Share',
          target: `https://warpcast.com/~/compose?text=hey%20check%20the%20results%20of%20these%20games&embeds[]=${NEXT_PUBLIC_URL}/`
        },
        {
          label: 'Back',
          target: `${NEXT_PUBLIC_URL}/api/intro`
        }
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/og?league=epl&week=${week}&game=${state.game}${state.stats ? '&stats=true' : ''}`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/epl`,
      state: {
        game: state.game,
        stats: state.stats
      }
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
