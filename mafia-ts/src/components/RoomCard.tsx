import React from 'react';
import '../styles/Roomcard.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RoomCardProps {
    roomName: string;
    description: string;
    host: string;
    participants: number;
    onJoin: () => void; // 상위로 전달할 핸들러 추가 
}

const RoomCard: React.FC<RoomCardProps> = ({ roomName, description, host, participants, onJoin }) => {
    const navigate = useNavigate();

    const handleJoin =() => {   
        onJoin(); //참여 요청을 상위로 알림 
        navigate('/roomwaiting');
    }
   

    return(
        <div className="room-card">
            <div className="room-header">
                <div className="room-title">🔒 {roomName} </div>
                <button className="join-btn" onClick={handleJoin}>참여하기</button>
            </div>
            <p className="room-desc">{description}</p>
            <div className="room-footer">
                <p className="host">by {host}</p>
                <p className="participants">{`참여인원 ${participants} / 8`}</p>
            </div>
        </div>
    );
};

export default RoomCard;    