import { ImageResponse } from '@vercel/og'
import eplData from '../eplData.json'
import laligaData from '../laligaData.json'
import { NEXT_PUBLIC_URL } from '../../config'

export const config = {
  runtime: 'experimental-edge',
}

const getGameData = (data, gameIdx) => {
  let games = [];
  for (const gameId of Object.keys(data)) {
    games.push(data[gameId]);
  }
  return games[gameIdx];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const hasLeague = searchParams.has('league');
    const league = hasLeague
      ? searchParams.get('league')?.slice(0, 100)
      : 'epl';

    const hasWeek = searchParams.has('week');
    const week = hasWeek
      ? searchParams.get('week')?.slice(0, 100)
      : '9';
      
    const hasGame = searchParams.has('game');
    const gameIdx = hasGame
      ? searchParams.get('game')?.slice(0, 100)
      : '0';      
      
    const game = getGameData(league === 'epl' ? eplData : laligaData, gameIdx);
    console.log(game);
        
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            background: 'white',
            color: 'white',
            width: '100%',
            height: '100%',
          }}
        >          
          <img width={'100%'} height={'100%'} src={`${NEXT_PUBLIC_URL}/bg.png`} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >{`${game.home.name} ${game.result.home}-${game.result.away} ${game.away.name}`}</div>
        </div>
      )
    )
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
