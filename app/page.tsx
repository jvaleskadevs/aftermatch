import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Results',
      target: `${NEXT_PUBLIC_URL}/api/aftermatch/intro`,
      postUrl: `${NEXT_PUBLIC_URL}/api/aftermatch/intro`
    },
    {
      label: 'Next Week',
      target: `${NEXT_PUBLIC_URL}/api/prematch/intro`,
      postUrl: `${NEXT_PUBLIC_URL}/api/prematch/intro`
    }
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/the_aftermatch.png`,
    aspectRatio: '1.91:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/intro`
});

export const metadata: Metadata = {
  title: 'aftermatch',
  description: 'The aftermatch is a farcaster frame displaying the results of the most important football leagues',
  openGraph: {
    title: 'aftermatch',
    description: 'The aftermatch is a farcaster frame displaying the results of the most important football leagues',
    images: [`${NEXT_PUBLIC_URL}/the_aftermatch.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>the aftermatch</h1>
      <h3>the aftermatch is a farcaster frame displaying the results of the most important football leagues</h3>
    </>
  );
}
