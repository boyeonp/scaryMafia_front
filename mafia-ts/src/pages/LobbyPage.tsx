import React from 'react';
import '../styles/LobbyPage.css';
import RoomCard from '../components/RoomCard';

const LobbyPage =  () => {
    const rooms=[
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
    ]

    return (
        <div className="lobby-container">
            <div className="logo-container">
                <text className="title">Mafia Town</text>
            </div>
            <div className="room-list">
                {rooms.map((room, index) => (
                    <RoomCard key={index} {...room} />
                ))}
            </div>
            <button className="create-btn">새로운 방 개설하기</button>
        </div>
    );
};

export default LobbyPage;