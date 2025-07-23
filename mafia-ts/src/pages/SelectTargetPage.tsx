import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SelectTargetPage.css';
import api from '../api/axios';

interface Player {
  userId: string;
  nickname: string;
}

const isActionRole = (r: string | null) =>
  ['mafia', 'doctor', 'police'].includes(r || '');

const SelectTargetPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = location.state || {};
  const userId = localStorage.getItem('userId');

  const [role, setRole] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  useEffect(() => {
    if (!roomId || !userId) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/game-logic/state/${roomId}`);
        const me = res.data.players.find((p: any) => p.userId === userId);
        setRole(me?.role || null);
        const others = res.data.players.filter((p: any) => p.userId !== userId);
        setPlayers(others);
      } catch (err) {
        console.error('플레이어 정보 조회 실패', err);
      }
    };

    fetchData();
  }, [roomId, userId]);

  const getRoleMessage = () => {
    switch (role) {
      case 'mafia':
        return { text: '죽일 사람의 이름을 입력하세요.', highlight: '죽일 사람', color: 'red' };
      case 'doctor':
        return { text: '살릴 사람의 이름을 입력하세요.', highlight: '살릴 사람', color: 'skyblue' };
      case 'police':
        return { text: '조사하고 싶은 사람의 이름을 입력하세요.', highlight: '조사하고 싶은 사람', color: 'royalblue' };
      default:
        return { text: '투표가 진행 중입니다. 잠시만 기다려주세요.', highlight: '', color: '#fff' };
    }
  };

  const { text, color } = getRoleMessage();

  const handleConfirm = async () => {
    if (!selectedId || !userId || !role || !roomId) return;

    try {
      let endpoint = '';
      const body = {
        userId,
        targetUserId: selectedId
      };

      if (role === 'mafia') {
        endpoint = `/game-logic/night-action/mafia/${roomId}`;
      } else if (role === 'doctor') {
        endpoint = `/game-logic/night-action/doctor/${roomId}`;
      } else if (role === 'police') {
        endpoint = `/game-logic/night-action/police/${roomId}`;
      }

      if (!endpoint) {
        console.warn('지원하지 않는 역할입니다:', role);
        return;
      }

      await api.post(endpoint, body);
      console.log(`[${role}] 선택 완료 → ${selectedId}`);
      setIsWaiting(true);
      const stat =await api.get(`/game-logic/night-action-status/${roomId}`);
      console.log(stat.data);
    } catch (err: any) {
      console.error(`[${role}] 선택 실패`, err);
      if (err.response) {
        console.error('응답 에러 상세:', err.response.data);
      }
    }
  };

  // ✅ 모든 역할(시민 포함) polling: allComplete 시 페이지 이동
  useEffect(() => {
    if (!roomId || !userId || !role) return;

    const pollInterval = setInterval(async () => {
      try {
        const statusRes = await api.get(`/game-logic/night-action-status/${roomId}`);
        console.log('⏳ night-action-status:', statusRes.data);

        if (statusRes.data.allComplete) {
          clearInterval(pollInterval);
          console.log('✅ 모든 역할 night action 완료됨');

          try {
            await api.post(`/game-logic/transition-night-result/${roomId}`);
            console.log('🌙 transition-night-result 완료');
          } catch (err) {
            console.warn('transition-night-result 이미 호출됨 또는 실패', err);
          }

          navigate('/game/voteresult', {
            state: {
              roomId,
              selectedId: isActionRole(role) ? selectedId : null,
              investigated: role === 'police'
            }
          });
        }
      } catch (err) {
        console.error('night-action-status polling 실패', err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [roomId, userId, role, selectedId, navigate]);

  return (
    <div className="select-page">
      <div className="select-container">
        <p className="select-text" style={{ color }}>{text}</p>

        {isActionRole(role) && !isWaiting ? (
          <>
            <div className="button-grid">
              {players.map((p) => (
                <button
                  key={p.userId}
                  className={`player-btn ${selectedId === p.userId ? 'selected' : ''}`}
                  onClick={() => setSelectedId(p.userId)}
                >
                  {p.nickname}
                </button>
              ))}
            </div>
            <button className="confirm-btn" onClick={handleConfirm} disabled={!selectedId}>
              완료
            </button>
          </>
        ) : (
          <div className="waiting-message">
            <p>다른 플레이어들이 선택을 진행 중입니다...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTargetPage;
