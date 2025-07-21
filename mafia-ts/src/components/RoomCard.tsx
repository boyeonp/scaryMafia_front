import React from 'react';
import '../styles/Roomcard.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";

interface RoomCardProps {
    roomId: string;
    roomName: string;
    description: string;
    host: string;
    participants: number;
    onJoin: () => void; // 상위로 전달할 핸들러 추가 
}

const RoomCard: React.FC<RoomCardProps> = ({ roomId, roomName, description, host, participants, onJoin }) => {
    const navigate = useNavigate();

    const handleJoin = async () => {
        try{
            const userId = localStorage.getItem("userId");
            if (!userId){
                alert("로그인이 필요합니다.");
                return;
            }

            await api.post(`/rooms/${roomId}/join`,{userId});
            onJoin();
        }   catch (err){
            console.error("참가 요청 실패", err);
            alert("참여 중 오류가 발생했습니다.")
        }
        onJoin(); //참여 요청을 상위로 알림 
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