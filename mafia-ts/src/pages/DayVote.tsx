import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/DayVote.css';
import api from '../api/axios';

interface Player {
  userId: string;
  nickname: string;
  isAlive: boolean;
}

const DayVote: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId || localStorage.getItem('roomId');
  const userId = localStorage.getItem('userId');

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ roomId를 localStorage에 저장 (한 번만)
  useEffect(() => {
    if (location.state?.roomId) {
      localStorage.setItem('roomId', location.state.roomId);
    }
  }, [location.state?.roomId]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        if (!roomId) throw new Error('roomId가 없습니다.');
        const res = await api.get(`/game-logic/state/${roomId}`);
        if (res.data && Array.isArray(res.data.players)) {
          setPlayers(res.data.players);
        } else {
          console.warn('플레이어 데이터가 올바르지 않습니다:', res.data);
          setPlayers([]);
        }
      } catch (err) {
        console.error('플레이어 목록 불러오기 실패', err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [roomId]);

  const handleVote = async () => {
    if (!selectedId || !userId || !roomId) return;
    try {
      console.log('투표 데이터:', { userId, targetUserId: selectedId });
      const res = await api.post(`/game-logic/vote/${roomId}`, {
        userId,
        targetUserId: selectedId
      });
      console.log('투표 완료:', res.data);

      if (res.data.allVotesComplete) {
        await api.post(`/game-logic/transition-day-result/${roomId}`);
        navigate('/game/voteresult', { state: { roomId } });
      } else {
        alert('투표가 완료되었습니다. 다른 유저들을 기다리는 중...');
      }
    } catch (err: any) {
      console.error('투표 실패', err);
      alert(`투표 실패: ${err?.response?.data?.message || '서버 오류'}`);
    }
  };

  const aliveOthers = players.filter(
    (p) => p.isAlive && p.userId !== userId
  );

  if (loading) {
    return <div className="vote-page">플레이어 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="vote-page">
      <div className="vote-container">
        <p className="vote-title">
          이제 투표를 시작합니다.
          <br />
          마피아로 의심되는 사람을 고르세요
        </p>

        <div className="button-grid">
          {aliveOthers.length > 0 ? (
            aliveOthers.map((p) => (
              <button
                key={p.userId}
                className={`player-btn ${selectedId === p.userId ? 'selected' : ''}`}
                onClick={() => setSelectedId(p.userId)}
              >
                {p.nickname}
              </button>
            ))
          ) : (
            <p>투표 가능한 생존자가 없습니다.</p>
          )}
        </div>

        <button
          className="confirm-btn"
          onClick={handleVote}
          disabled={!selectedId}
        >
          투표 완료
        </button>
      </div>
    </div>
  );
};

export default DayVote;
