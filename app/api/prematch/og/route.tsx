import { ImageResponse } from '@vercel/og'
import eplData from '../../data/england-premier-league-12.json'
import laligaData from '../../data/spain-laliga-12.json'
import bundesligaData from '../../data/germany-bundesliga-12.json'
import serieaData from '../../data/italy-serie-a-12.json'
import { NEXT_PUBLIC_URL } from '../../../config'

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
      
    const hasMVP = searchParams.has('mvp');
    const mvp = hasMVP
      ? searchParams.get('mvp')?.slice(0, 100)
      : false;   
      
    let leagueData;
    if (league === 'epl') leagueData = eplData;
    if (league === 'laliga') leagueData = laligaData;
    if (league === 'seriea') leagueData = serieaData;
    if (league === 'bundesliga') leagueData = bundesligaData;
    const game = getGameData({ leagueData, gameIdx });
    console.log(game);
        
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: mvp === 'true' ? 32 : 42,
            background: 'white',
            color: '#edd3fb',
            width: '100%',
            height: '100%',
          }}
        >          
          <img width={'100%'} height={'100%'} src={`${NEXT_PUBLIC_URL}/bg.png`} style={{ transform:  'scaleY(-1)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <h4>{`${game.home.name} - ${game.away.name}`}</h4>
            { mvp === 'true' && 
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 18, margin: '16px auto', maxWidth: '70%' }}>
                {game.mvp.map((s: any) => (
                  <div style={{ display: 'flex', marginBottom: '6px' }} key={s.id}>
                    {s.tip}
                  </div>
                ))}
                <div style={{ display: 'flex', margin: '16px auto', fontSize: '12px' }}>AI pregenerated content, NFA</div>
              </div>
            }
          </div>          
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
        emoji: 'twemoji',
        headers: {
          'cache-control': 'public, max-age=0, must-revalidate'
        }
      }      
    )
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
