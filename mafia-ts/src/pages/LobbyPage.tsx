import React, {useState, useEffect} from 'react';
import '../styles/LobbyPage.css';
import RoomCard from '../components/RoomCard';
import { useNavigate } from 'react-router-dom';

const LobbyPage =  () => {
    const rooms=[
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
        {roomName: "커몬", description: "누구든 들어오세요", host: "병주상", participants: 3},
    ]
    const navigate = useNavigate();



    return (
        <div className="lobby-container">
            <div className="logo-container">
                <text className="title">Mafia Town</text>
            </div>
            <div className="room-list">
                {rooms.map((room, index) => (
                    <RoomCard key={index} {...room} onJoin={() => {}}/>
                ))}
            </div>
            <button onClick={() => navigate('/lobby/makeroom')} className="create-btn">새로운 방 개설하기</button>
        </div>
    );
};

export default LobbyPage;