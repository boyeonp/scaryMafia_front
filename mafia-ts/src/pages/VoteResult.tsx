import React, { useEffect, useState } from 'react';
import '../styles/VoteResult.css';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Player {
  userId: string;
  nickname: string;
}

const ResultAnnounce: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = location.state?.roomId;

  const [deadPlayer, setDeadPlayer] = useState<string>('???');
  const [noOneDied, setNoOneDied] = useState<boolean>(false); // ✅ 아무도 안 죽었는지 여부

  useEffect(() => {
    const fetchNightResult = async () => {
      try {
        const res = await api.get(`/game-logic/state/${roomId}`);
        console.log('🌙 밤 결과:', res.data);

        const eliminatedIds: string[] = res.data.eliminatedPlayers;

        if (!eliminatedIds || eliminatedIds.length === 0) {
          setNoOneDied(true);
          return;
        }

        // ✅ 가장 최근에 죽은 사람을 가져오기
        const lastEliminatedId = eliminatedIds[eliminatedIds.length - 1];

        const dead = res.data.players.find((p: Player) =>
          p.userId === lastEliminatedId
        );
        setDeadPlayer(dead?.nickname || '???');
      } catch (err) {
        console.error('밤 결과 불러오기 실패', err);
        setDeadPlayer('에러 발생');
      }
    };

    fetchNightResult();

    const timer = setTimeout(() => {
      navigate('/game/day', { state: { roomId } });
    }, 5000); // 5초 후 다음 페이지

    return () => clearTimeout(timer);
  }, [navigate, roomId]);

  return (
    <div className="result-page">
      <p className="result-title">결과 발표</p>
      <div className="result-box">
        <p className="result-text bold">아침이 밝았습니다.</p>
        {noOneDied ? (
          <p className="result-text">어젯밤, 아무도 죽지 않았습니다.</p> // ✅ 조건 분기
        ) : (
          <p className="result-text">
            어젯밤, <span className="highlight">{deadPlayer}</span>님이 죽었습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultAnnounce;
