import React, { useEffect, useState } from "react";
import '../styles/Introduce.css';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Introduce: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const roomId = location.state?.roomId;
    const [remainingTime, setRemainingTime] = useState(30);

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    useEffect(() => {
        const countdown = setInterval(() => {
            setRemainingTime((prev) => prev - 1);
        }, 1000);


        const timer = setTimeout( async () => {
        try{
            if (roomId){
                const res = await api.post(`/game-logic/transition-night/${roomId}`);
                console.log('밤으로 전환됨:', res.data);
                navigate('/game/selecttarget', {state: { roomId }});
            } else {
                console.error("roomId가 없습니다.");
            }
        } catch (err){
            console.error("밤 전환 실패",err);
        }
    }, 30000);

        return () => {
            clearInterval(countdown);
            clearTimeout(timer);
        };
    }, [navigate, roomId]);

    return (
        <div className="intro-page">
            {/* 오른쪽 상단 표시*/}
            <div className="top-right-timer">  남은 시간: {minutes}:{seconds.toString().padStart(2, '0')}</div>

            <div className="intro-text-box">
                <p className="intro-title">자기소개 타임</p>
                <p className="intro-desc">
                    먼저 자신의 직업에 대해 설명하세요. <br />
                    제한시간은 <span className="highlight">2분</span>입니다. <br />
                    첫째날은 자기소개 이후 바로 밤이 되니 <br />
                    이 점 유의하시기 바랍니다.
                </p>
            </div>
        </div>
    );
};

export default Introduce;