import React from "react";
import "../styles/SignupPage.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // API 호출을 위한 axios 인스턴스   

const SignupPage: React.FC = () => {
    const [userEmail, setUserEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const navigate = useNavigate();

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault(); // 폼 제출 이벤트 방지
        if (!userEmail || !password || !nickname) {
            alert("모든 항목을 입력해주세요.");
            return;
        }
        try {
            const response = await api.post("/auth/signup", {
                userEmail,
                password,
                nickname
            });
            alert("회원가입 성공! 로그인 페이지로 이동합니다.");
            console.log("회원가입 성공:", response.data);
            navigate('/login'); // 회원가입 후 로그인 페이지로 이동
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
    }

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
            <div className='logo-container'>
                <text className="title">회원가입</text>
            </div>
            <div className="signup-content">
                <div className="input-container">
                    <text className="signup-input-title">이메일</text>
                    <input onChange={(event) => setUserEmail(event.target.value)} value={userEmail} className="input-box" type="text" placeholder="아이디를 입력하세요." required />
                </div>
                <div className="input-container">
                    <text className="signup-input-title">비밀번호</text>
                    <input onChange={(event) => setPassword(event.target.value)} value={password} className="input-box" type="password" placeholder="비밀번호를 입력하세요." required />
                </div>
                <div className="input-container">
                    <text className="signup-input-title">닉네임</text>
                    <input onChange={(event) => setNickname(event.target.value)} value={nickname} className="input-box" type="text" placeholder="닉네임을 입력하세요" required />
                </div>
            </div>    
            <button type="submit" className="submit-btn">완료</button>
            </form>
        </div>
    );
};

export default SignupPage;