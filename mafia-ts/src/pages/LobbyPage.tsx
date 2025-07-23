import React, {useState, useEffect} from 'react';
import '../styles/LobbyPage.css';
import RoomCard from '../components/RoomCard';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

type RoomWithCount= {
    roomId: string;
    title: string;
    notes: string;
    hostUser: {nickname: string};
    participantCount: number;
};

const LobbyPage =  () => {
    const [rooms, setRooms] = useState<RoomWithCount[]>([]);
    const navigate = useNavigate();

    const fetchRoomsWithParticipantCount = async () => {
        try {
        const res = await api.get('/rooms/waiting');
        const rawRooms = res.data;

        // 각 room에 대해 participant 수 가져오기
        const enrichedRooms: RoomWithCount[] = await Promise.all(
            rawRooms.map(async (room: any) => {
            try {
                const participantsRes = await api.get(`/rooms/${room.roomId}/participants`);
                const count = participantsRes.data?.participants?.length || 0;
                return {
                ...room,
                participantCount: count,
                };
            } catch (err) {
                console.error(`참여자 수 조회 실패 (roomId=${room.roomId})`, err);
                return {
                ...room,
                participantCount: 0,
                };
            }
            })
        );

        setRooms(enrichedRooms);
        } catch (err) {
        console.error('대기 중인 방 목록 조회 실패', err);
        }
    };

    useEffect(()=> {

        fetchRoomsWithParticipantCount();

        const interval = setInterval(() => {
            fetchRoomsWithParticipantCount();
        }, 2000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="lobby-container">
            <div className="logo-container">
                <text className="title">Mafia Town</text>
            </div>
            <div className="room-list">
                {rooms.map((room) => (
                    <RoomCard 
                    key={room.roomId}
                    roomId = {room.roomId} 
                    roomName={room.title}
                    description={room.notes}
                    host={room.hostUser.nickname}
                    participants={room.participantCount}
                    onJoin={()=> navigate(`/roomwaiting`, {state: {roomId: room.roomId}})}
                    />
                ))}
            </div>
            <button onClick={() => navigate('/lobby/makeroom')} className="create-btn">새로운 방 개설하기</button>
        </div>
    );
};

export default LobbyPage;