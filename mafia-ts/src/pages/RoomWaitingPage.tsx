import React, { useState, useEffect } from 'react';
import '../styles/RoomWaitingPage.css';
import { useNavigate } from 'react-router-dom';

const RoomWaitingPage: React.FC = () => {
  const roomName = "커몬";
  const host = "병주상";
  const participants = ["유진", "보연", "민지"];
  const maxParticipants = 8;
  const navigate = useNavigate();

  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [count, setCount] = useState<number | null>(null);

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

  return (
    <div className="waiting-page">
      <div className="waiting-box">
        <p className="room-title">방 제목: <span>{roomName}</span></p>
        <div className='info-box'>
          <p className="host-line">
            <span className="host-label">host:</span> {host}
            <span className="host-action"> 호스트 변경하기</span>
          </p>

          <div className="participant-section">
            <p className="participant-count">참여인원 4/{maxParticipants}</p>
            <ul className="participant-list">
              {participants.map((name, index) => (
                <li key={index}>• {name}</li>
              ))}
            </ul>
          </div>
        </div>


        <p className="notice-text">참여인원이 {maxParticipants}명 되면 게임이 바로 시작됩니다.</p>

        {/* ✅ 시작 버튼 (임시) */}
        <button className="start-btn" onClick={() => {
          setShowCountdown(true);
          setCount(3);
        }}>시작</button>

        <button className="exit-btn" onClick={() => navigate('/lobby')}>방 나가기</button>
      </div>
              
        {showCountdown && (
            <div className='fullscreen-blur'>
                <div className="count-text">
                    게임을 시작합니다
                    <br />
                    {count}
                </div>
            </div>
        )}
    </div>
  );
};

export default RoomWaitingPage;
