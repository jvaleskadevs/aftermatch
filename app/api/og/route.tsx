import { ImageResponse } from '@vercel/og'
import eplData from '../eplData.json'
import laligaData from '../laligaData.json'
import { NEXT_PUBLIC_URL } from '../../config'

export const runtime = "edge"

type GetGameData = {
  leagueData: any,
  gameIdx: string
}

const getGameData = ({ leagueData, gameIdx }: GetGameData): any => {
  let games = [];
  for (const gameId of Object.keys(leagueData)) {
    games.push(leagueData[gameId]);
  }
  return games[parseInt(gameIdx) || 0];
}

type GetGameStats = {
  game: any,
  stats: string
}

const getGameStats = ({ game, stats }: GetGameStats): any => {
  return game?.statistics?.filter((g: any) => g?.categoryName?.toLowerCase() === stats)?.[0] || undefined;
}

export async function GET(request: Request) {
  try {
    const fontData = await fetch(
      new URL('/nimbus.otf', NEXT_PUBLIC_URL),
    ).then((res) => res.arrayBuffer());

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
    const gameIdx = (hasGame
      ? searchParams.get('game')?.slice(0, 100)
      : '0') || '0';      
      
    const hasStats = searchParams.has('stats');
    const stats = hasStats
      ? searchParams.get('stats')?.slice(0, 100)
      : false;

    console.log(stats);
      
    const leagueData = league === 'epl' ? eplData : laligaData; 
    const game = getGameData({ leagueData, gameIdx });
    console.log(game);

        
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 42,
            background: 'white',
            color: '#edd3fb',
            width: '100%',
            height: '100%',
          }}
        >          
          <img width={'100%'} height={'100%'} src={`${NEXT_PUBLIC_URL}/bg.png`} />
          { stats !== 'true'
              ? <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                >{`${game.home.name} ${game.result.home}-${game.result.away} ${game.away.name}`}</div>
              : <div>LOL</div>
          }
        </div>
      ),
      {
        width: 802,
        height: 420,
        fonts: [{
            data: fontData,
            name: 'Nimbus',
            style: 'normal',
            weight: 400
        }],
        emoji: 'twemoji'
      }      
    )
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
