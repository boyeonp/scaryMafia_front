import React, { useState, useEffect } from 'react';
import '../styles/RoomWaitingPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useUser } from '../contexts/UserContext';

interface RoomInfo {
  title: string;
  requiredPlayers: number;
  hostUser: {
    userId: string;
    nickname: string;
  };
  status: string;
}

type Participant = {
  userId: string;
  nickname: string;
};

const RoomWaitingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;

  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [host, setHost] = useState<string>("");
  const { nickname, setNickname, setRoomId } = useUser();

  const handleStartGame = async () => {
    if (nickname !== host) {
      alert("호스트만 게임 시작이 가능합니다");
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("로그인이 필요합니다.");
        return;
      }
      console.log("1️⃣ start-game 요청 시도");
      await api.post(`/rooms/${roomId}/start-game`);
      console.log("2️⃣ start-game 요청 성공");
    } catch (err) {
      console.error("❌ start-game 호출 실패:", err);
      alert("게임 시작에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (!roomId) {
      alert("유효하지 않은 접근입니다.");
      navigate('/lobby');
      return;
    }

    setRoomId(roomId);

    const fetchData = async () => {
      try {
        const roomRes = await api.get(`/rooms/${roomId}`);
        const roomData = roomRes.data;
        setRoomInfo(roomData);
        setHost(roomData.hostUser.nickname);
        const userNickname = localStorage.getItem("nickname");
        if (userNickname) {
          setNickname(userNickname);
        }

        const participantsRes = await api.get(`/rooms/${roomId}/participants`);
        const participantUsers: Participant[] = await Promise.all(
          participantsRes.data.participants.map(async (userId: string) => {
            const userRes = await api.get(`/users/userId/${userId}`);
            return {
              userId,
              nickname: userRes.data.nickname,
            };
          })
        );
        setParticipants(participantUsers);
      } catch (err) {
        console.error("데이터 조회 실패", err);
      }
    };

    fetchData();
  }, [roomId, navigate, setNickname, setRoomId]);

  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(async () => {
      try {
        const roomRes = await api.get(`/rooms/${roomId}`);
        const newRoomInfo = roomRes.data;
        setRoomInfo(newRoomInfo);

        const participantsRes = await api.get(`/rooms/${roomId}/participants`);
        const users: Participant[] = await Promise.all(
          participantsRes.data.participants.map(async (userId: string) => {
            const userRes = await api.get(`/users/userId/${userId}`);
            return {
              userId,
              nickname: userRes.data.nickname,
            };
          })
        );
        setParticipants(users);

        if (newRoomInfo.status === 'in_progress') {
          const gameState = await api.get(`/game-logic/state/${roomId}`);
          const userId = localStorage.getItem('userId');
          const me = gameState.data?.players?.find((p: any) => p.userId === userId);

          if (me && me.role){
          navigate('/role', { state: { roomId, roles: gameState.data } });
        } else{
          console.warn("역할이 아직 할당되지 않음. 대기 ... ");
        }
      }
      } catch (err) {
        console.error("상태 업데이트 실패", err);
        if ((err as any).response?.status === 404) {
          clearInterval(interval);
          alert("방이 삭제되었습니다.");
          navigate('/lobby', { replace: true });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId, navigate]);

  if (!roomInfo) return <div className="waiting-page">로딩 중 ... </div>;

  return (
    <div className="waiting-page">
      <div className="waiting-box">
        <p className="room-title">방 제목: <span>{roomInfo.title}</span></p>
        <div className='info-box'>
          <p className="host-line">
            <span className="host-label">host:</span> {host}
          </p>
          <div className="participant-section">
            <p className="participant-count">참여인원 {participants.length}/{roomInfo.requiredPlayers}</p>
            <div className="participant-grid">
              {participants.map((user, index) => (
                <div key={index} className="participant-item">• {user.nickname}</div>
              ))}
              </div>
          </div>
        </div>
        <p className="notice-text">호스트가 게임을 시작할 때까지 대기해주세요.</p>
        <div className="button-group">
          {nickname === host && (
          <button className="exit-btn" onClick={handleStartGame}>
            게임 시작
          </button>
          )}
          <button className="exit-btn"
            onClick={async () => {
              try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                  alert("로그인이 필요합니다.");
                  return;
                }
                await api.post(`/rooms/${roomId}/leave`, { userId });
                alert("방에서 나갔습니다.");
                navigate('/lobby');
              } catch (err) {
                console.error("방 나가기 실패", err);
                alert("방 나가기 중 오류가 발생했습니다.");
              }
            }}>방 나가기</button>
          </div>
      </div>
    </div>
  );
};

export default RoomWaitingPage;
