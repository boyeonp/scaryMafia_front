import React, { useEffect, useState } from 'react';
import '../styles/Day.css';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const DayGuide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;

  const [remainingTime, setRemainingTime] = useState(180); // 3분 = 180초

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  useEffect(() => {
    // 현재 방 상태 확인
    const fetchRoomState = async () => {
      if (!roomId) return;
      try {
        const res = await api.get(`/game-logic/state/${roomId}`);
        console.log('🧩 현재 게임 상태:', res.data);
      } catch (err) {
        console.error('방 상태 조회 실패', err);
      }
    };

    fetchRoomState();

    const countdown = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(async () => {
      try {
        if (roomId) {
          const res = await api.post(`/game-logic/transition-day/${roomId}`);
          console.log('🌞 낮으로 전환됨:', res.data);

          // ✅ 낮으로 전환된 후, vote phase로 진입 요청
          const votePhaseRes = await api.post(`/game-logic/transition-vote/${roomId}`);
          console.log('🗳️ 투표 phase로 전환됨:', votePhaseRes.data);

          navigate('/game/dayvote', { state: { roomId } });
        } else {
          console.error('roomId가 없습니다.');
        }
      } catch (err) {
        console.error('낮 전환 실패', err);
      }
    }, 180000); // 3분 후 실행

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [navigate, roomId]);

  return (
    <div className="vote-guide-page">
      {/* ✅ 상단 우측 타이머 표시 */}
      <div className="top-right-timer">
        남은 시간: {minutes}:{seconds.toString().padStart(2, '0')}
      </div>

      <div className="vote-guide-textbox">
        <p>
          이제, 어젯밤의 일을 추리하고,
          <br />
          투표를 통해 <span className="highlight-red">용의자를 지목</span>합니다.
          <br />
          시간은 <span className="highlight-bold">3분</span>입니다.
        </p>
      </div>
    </div>
  );
};

export default DayGuide;
