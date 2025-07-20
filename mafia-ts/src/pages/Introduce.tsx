import React, { useEffect } from "react";
import '../styles/Introduce.css';
import { useNavigate } from 'react-router-dom';

const Introduce: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/game/introducechat');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="intro-page">
            <div className="intro-text-box">
                <p className="intro-title">자기소개 타임</p>
                <p className="intro-desc">
                    먼저 자신의 직업에 대해 설명하세요. <br/>
                    제한시간은 <span className="highlight">2분</span>입니다. <br/>
                    첫째날은 자기소개 이후 바로 밤이 되니 <br/>
                    이 점 유의하시기 바랍니다. 
                </p>
            </div>
        </div>
    );
};

export default Introduce;