import { useState } from 'react';
import '../styles/v2-theme.css';

const V2NationalLeaderboard = () => {
    const [period, setPeriod] = useState('weekly');

    // Mock data based on the requested backend response
    const [data] = useState({
        currentUser: {
            rank: 42,
            points: 1250,
            nickname: "Tú (Dr. García)",
            avatar: "https://ui-avatars.com/api/?name=Dr+Garcia&background=0fa397&color=fff"
        },
        topPlayers: [
            { rank: 1, nickname: "Dr. House", points: 5000, avatar: "https://ui-avatars.com/api/?name=Dr+House&background=random" },
            { rank: 2, nickname: "Dra. Grey", points: 4800, avatar: "https://ui-avatars.com/api/?name=Dra+Grey&background=random" },
            { rank: 3, nickname: "Dr. Shaun Murphy", points: 4500, avatar: "https://ui-avatars.com/api/?name=Dr+Shaun&background=random" },
            { rank: 4, nickname: "Dra. Cuddy", points: 4200, avatar: "https://ui-avatars.com/api/?name=Dra+Cuddy&background=random" },
            { rank: 5, nickname: "Dr. Strange", points: 4000, avatar: "https://ui-avatars.com/api/?name=Dr+Strange&background=random" }
        ]
    });

    return (
        <div className="v2-leaderboard-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h1 className="v2-headline-medium">Ranking Nacional</h1>
                <p className="v2-body-large" style={{ opacity: 0.7 }}>Compite con médicos de todo el país</p>
            </header>

            {/* Period Selector */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                {['weekly', 'monthly', 'all'].map(p => (
                    <button
                        key={p}
                        className={period === p ? "v2-btn-filled" : "v2-btn-tonal"}
                        onClick={() => setPeriod(p)}
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                        {p === 'weekly' ? 'Semanal' : p === 'monthly' ? 'Mensual' : 'Histórico'}
                    </button>
                ))}
            </div>

            {/* Current User Tonal Card */}
            <section className="v2-card-tonal" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                <div className="v2-title-large" style={{ width: '40px', fontWeight: 'bold' }}>#{data.currentUser.rank}</div>
                <img src={data.currentUser.avatar} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                    <div className="v2-title-large">{data.currentUser.nickname}</div>
                    <div className="v2-label-large" style={{ opacity: 0.8 }}>Tu posición actual</div>
                </div>
                <div className="v2-title-large" style={{ color: 'var(--md-sys-color-primary)' }}>{data.currentUser.points} XP</div>
            </section>

            {/* Top Players List */}
            <section className="v2-card" style={{ padding: '8px' }}>
                {data.topPlayers.map((player, index) => (
                    <div
                        key={player.rank}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            borderBottom: index === data.topPlayers.length - 1 ? 'none' : '1px solid var(--md-sys-color-outline-variant)'
                        }}
                    >
                        <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                            {player.rank <= 3 ? (
                                <i className="material-icons" aria-hidden="true" style={{
                                    color: player.rank === 1 ? '#ffd700' : player.rank === 2 ? '#c0c0c0' : '#cd7f32'
                                }}>emoji_events</i>
                            ) : (
                                <span className="v2-label-large">{player.rank}</span>
                            )}
                        </div>
                        <img src={player.avatar} alt={player.nickname} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <div style={{ flex: 1 }} className="v2-body-large">{player.nickname}</div>
                        <div className="v2-label-large" style={{ fontWeight: 'bold' }}>{player.points} XP</div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default V2NationalLeaderboard;
