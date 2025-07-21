import React, { useState, useEffect } from 'react';
import '../styles/RoomWaitingPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import userEvent from '@testing-library/user-event';
import { SettingsPhoneTwoTone } from '@mui/icons-material';

interface RoomInfo{
  title: string;
  requiredPlayers: number;
  hostUser: {
    nickname: string;
  };
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
  const [count, setCount] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);
  const [host, setHost] = useState<string>("");

  useEffect(() => {
    if (!roomId){
      alert("유효하지 않은 접근입니다.");
      navigate('/lobby');
      return;
    }
    

    // 방 정보 조회
    const fetchRoomInfo = async() => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        setRoomInfo(res.data);
        setHost(res.data.hostUser.nickname);
      } catch(err){
        console.error("방 정보 조회 실패", err);
        alert("방 정보를 불러오지 못했습니다.");
      }
    };

    // 참여자 목록 조회 
    const fetchParticipants = async() => {
      try {
        const res = await api.get(`/rooms/${roomId}/participants`);
        // user으로 매핑
        const users: Participant[] = await Promise.all(
          res.data.participants.map(async (userId:string) => {
            const userRes = await api.get(`/users/userId/${userId}`);
            return {
              userId,
              nickname: userRes.data.nickname,
            };
          })
        );
        setParticipants(users);
      } catch (err) {
        console.error("참여자 목록 조회 실패", err);
      }
    };
    
    fetchRoomInfo();
    fetchParticipants();
  }, [roomId, navigate]);

  useEffect(() => {
    if (count===null) return;

    if (count > 0){
      const timer = setTimeout(() => {
        setCount((prev) => (prev ?? 1)-1);
          }, 1000);
        return () => clearTimeout(timer);  // cleanup
      }
        
    if (count ===0){
      setTimeout(() => {
        navigate('/role');
        }, 1000);
      }
    }, [count]);


    //인원 수 자동 체크 
    useEffect(() => {
      if (!roomId || !roomInfo) return;

      const interval = setInterval(async () => {
        try {
          const res = await api.get(`/rooms/${roomId}/participants`);
          const users: Participant[] = await Promise.all(
            res.data.participants.map(async (userId: string) => {
              const userRes = await api.get(`/users/userId/${userId}`);
              return {
                userId,
                nickname: userRes.data.nickname,
              };
            })
          );
          setParticipants(users);

          // 조건 충족 시 Introudce 페이지로 자동 이동 
          if (users.length === roomInfo.requiredPlayers){
            clearInterval(interval);
            navigate("/game/introduce", {state: {roomId}});
          }
        } catch (err){
          console.error("자동 시작 체크 실패", err);
        }
      }, 2000); //2초마다 인원 수 체크 

      return () => clearInterval(interval);
    }, [roomId, roomInfo, navigate]);
    
    if (!roomInfo) return <div className="waiting-page">로딩 중 ... </div>;

  return (
    <div className="waiting-page">
      <div className="waiting-box">
        <p className="room-title">방 제목: <span>{roomInfo.title}</span></p>
        <div className='info-box'>
          <p className="host-line">
            <span className="host-label">host:</span> {host}
            <span className="host-action" onClick={()=> setShowHostModal(true)}> 호스트 변경하기</span>
          </p>

          <div className="participant-section">
            <p className="participant-count">참여인원 {participants.length}/{roomInfo.requiredPlayers}</p>
            <ul className="participant-list">
              {participants.map((user, index) => (
                <li key={index}>• {user.nickname}</li>
              ))}
            </ul>
          </div>
        </div>


        <p className="notice-text">참여인원이 {roomInfo.requiredPlayers}명 되면 게임이 바로 시작됩니다.</p>

        {/* ✅ 시작 버튼 (임시) */}
        <button className="start-btn" onClick={() => {
          setShowCountdown(true);
          setCount(3);
        }}>시작</button>

        <button className="exit-btn" onClick={() => navigate('/lobby')}>방 나가기</button>
      </div>

        {/*게임 시작 카운트다운 */}  
        {showCountdown && (
            <div className='fullscreen-blur'>
                <div className="count-text">
                    게임을 시작합니다
                    <br />
                    {count}
                </div>
            </div>
        )}

        {/*호스트 변경 팝업 */}
        {showHostModal && (
          <div className='modal-overlay'>
            <div className='modal'>
              <p>호스트를 선택하세요</p>
              <ul className="host-select-list">
                {participants.map((user,index) => {
                  return(
                  <li key={index}>
                    <button className='host-select-btn' 
                    onClick={async() => {
                      try{
                        await api.put(`/rooms/${roomId}`, {
                          hostUserId: user.userId,
                        });
                        setHost(user.nickname);
                        setShowHostModal(false);
                      } catch (err){
                        console.error("호스트 변경 실패", err);
                        alert("호스트 변경 중 오류가 발생했습니다.");
                      }
                    }}>
                      {user.nickname}
                    </button>
                  </li>
                  );
                })}
              </ul>
              <button className='modal-cancel-btn' onClick={() => setShowHostModal(false)}>취소</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default RoomWaitingPage;
