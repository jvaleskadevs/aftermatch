import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY || 'NEYNAR_ONCHAIN_KIT' });
  if (!isValid) return new NextResponse('Message not valid', { status: 500 });
  
  const week = 9;

  //const text = message.input || '';
  let state = {
    game: 0,
    mvp: false
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
    if (message.button === 1) state.game < 10 ? state.game++ : 0;
    if (message.button === 2) state.mvp = !state.mvp;
  } catch (e) {
    console.error(e);
  }
  
  console.log(state);

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Next'
        },
        {
          label: 'Game'//state.mvp ? 'Game' : 'Ask MVP'
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
        src: `${NEXT_PUBLIC_URL}/api/prematch/og?league=epl&week=${week}&game=${state.game}&mvp${state.mvp}`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/prematch/epl`,
      state: {
        game: state.game,
        mvp: state.mvp,
        time: new Date().toISOString()
      }
    }),
    {
      headers: {
        'cache-control': 'public, max-age=0, must-revalidate'
      }
    }
  )
;
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
