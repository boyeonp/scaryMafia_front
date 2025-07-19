import React from "react";
import "../styles/SignupPage.css";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="signup-container">
            <div className='logo-container'>
                <text className="title">회원가입</text>
                </div>
            <form className="signup-form">
                <text className="input-title">아이디</text>
                <input className="input-box" type="text" placeholder="아이디" required />
                <text className="input-title">비밀번호</text>
                <input className="input-box" type="password" placeholder="비밀번호" required />
                <text className="input-title">닉네임</text>
                <input className="input-box" type="text" placeholder="닉네임을 입력하세요" required />
            </form>
            <button onClick={() => navigate('/login')} className="submit-btn">완료</button>
        </div>
    );
};

export default SignupPage;