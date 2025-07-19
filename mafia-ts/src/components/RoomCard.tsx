import React from 'react';
import '../styles/Roomcard.css';
interface RoomCardProps {
    roomName: string;
    description: string;
    host: string;
    participants: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ roomName, description, host, participants }) => {
    return(
        <div className="room-card">
            <div className="room-header">
                <div className="room-title">🔒 {roomName} </div>
                <button className="join-btn">참여하기</button>
            </div>
            <p className="room-desc">{description}</p>
            <div className="room-footer">
                <p className="host">Host: {host}</p>
                <p className="participants">{`참여인원 ${participants} / 8`}</p>
            </div>
        </div>
    )
};

export default RoomCard;    