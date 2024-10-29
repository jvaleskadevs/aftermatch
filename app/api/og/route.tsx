import { ImageResponse } from '@vercel/og'
import eplData from '../eplData.json'
import laligaData from '../laligaData.json'
import bundesligaData from '../bundesligaData.json'
import serieaData from '../serieaData.json'
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

const formatStats = (stats: any): any => {
    delete stats[0];
    delete stats[1];
    delete stats[6];
    if (stats[12].categoryName === "Red Cards") {
      delete stats[16];
      delete stats[17];
    } else {
      delete stats[15];
      delete stats[16];       
    } 
    return stats;
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
            fontSize: stats === 'true' ? 32 : 42,
            background: 'white',
            color: '#edd3fb',
            width: '100%',
            height: '100%',
          }}
        >          
          <img width={'100%'} height={'100%'} src={`${NEXT_PUBLIC_URL}/bg.png`} style={{ transform:  stats === 'true' ? 'scaleY(-1)' : '' }} />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <h4>{`${game.home.name} ${game.result.home}-${game.result.away} ${game.away.name}`}</h4>
          { stats === 'true' && 
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 18, margin: '0 auto' }}>
              {formatStats(game.statistics).map((s: any) => (
                <div style={{ display: 'flex', transform: 'translateY(-120%)', marginBottom: '6px' }} key={s.categoryName}>
                  {`${s.categoryName.toLowerCase()}`}
                  <span style={{ color: '#969696', marginLeft: '16px' }}>
                    {`${s.homeValue} - ${s.awayValue}`}
                  </span>
                </div>
              ))}
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
          'Cache-Control': 'public, max-age=0, must-revalidate'
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
