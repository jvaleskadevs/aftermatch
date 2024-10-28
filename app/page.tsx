import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
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
    src: `${NEXT_PUBLIC_URL}/intro.png`,
    aspectRatio: '1.91:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/laliga`,
});

export const metadata: Metadata = {
  title: 'aftermatch',
  description: 'The aftermatch is a farcaster frame displaying the results of the most important football leagues',
  openGraph: {
    title: 'aftermatch',
    description: 'The aftermatch is a farcaster frame displaying the results of the most important football leagues',
    images: [`${NEXT_PUBLIC_URL}/intro.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>aftermatch</h1>
      <h3>the aftermatch is a farcaster frame displaying the results of the most important football leagues</h3>
    </>
  );
}
