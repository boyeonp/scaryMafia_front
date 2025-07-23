import React, { useEffect, useState } from 'react';
import '../styles/RolePage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const RolePage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!roomId || !userId) {
      alert("잘못된 접근입니다.");
      navigate('/lobby');
      return;
    }

    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const fetchRole = async () => {
      try {
        console.log("방 id: ", roomId);
        const res = await api.get(`/game-logic/state/${roomId}`);
        
        console.log("📦 전체 게임 상태:", res.data);

        const players = res.data?.players;
        console.log("players: ", players);
        if (!Array.isArray(players)) {
          console.warn("🚫 players 배열이 아예 없음 (null 또는 undefined)");
          return;
        }

        console.log("🧑‍🤝‍🧑 전체 players 목록:", players);
        console.log("🔐 현재 userId(localStorage):", userId);

        const me = players.find((p: any) => {
          const match = p.userId === userId;
          console.log(`🧪 비교 중: playerId=${p.userId}, 내 userId=${userId} => ${match}`);
          return match;
        });

        if (!me) {
          console.warn("❌ userId가 일치하는 플레이어를 찾을 수 없음");
          return;
        }

        console.log("✅ 내 player 정보:", me);

        if (!me.role) {
          console.warn("🕳 역할이 아직 없음 (me.role is falsy)");
          return;
        }

        console.log("🎭 역할 배정 완료:", me.role);
        setRole(me.role);
        clearInterval(interval);

        timeout = setTimeout(() => {
          navigate('/game/introduce', { state: { roomId } });
        }, 5000);
      } catch (err) {
        console.error("❌ API 호출 실패", err);
      }
    };

    interval = setInterval(fetchRole, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, roomId, userId]);

  const getColor = () => {
    switch (role) {
      case 'mafia': return '#ff4d4d';
      case 'citizen': return '#66ff66';
      case 'villain': return '#6699ff';
      case 'police': return '#ffa500';
      case 'doctor': return '#00e6e6';
      default: return 'white';
    }
  };

  return (
    <div className="role-page">
      <div className="role-text-wrapper">
        <p className="role-title">역할 안내</p>
        <p className="role-line">당신은</p>
        {role ? (
          <p className="role-line">
            <span className="role-role" style={{ color: getColor() }}>
              {role.toUpperCase()}
            </span>
            입니다.
          </p>
        ) : (
          <p className="role-line">역할 정보를 불러오는 중 ..</p>
        )}
      </div>
    </div>
  );
};

export default RolePage;
