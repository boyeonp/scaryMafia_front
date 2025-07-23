import React from "react";
import "../styles/SignupPage.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // API 호출을 위한 axios 인스턴스   
import { error } from "console";

const SignupPage: React.FC = () => {
    const [userEmail, setUserEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [errorMessage,setErrorMessage] = React.useState("");

    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (pw: string) => {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
    };

    const validateNickname = (name: string) => {
        return name.length <= 8;
    };
    
    // 중복 확인 (이메일, 닉네임)
    const checkEmailDuplicate = async (email: string) => {
         try {
             const response = await api.post("/auth/check-email", { userEmail: email });
             return response.data.available; // true = 사용 가능
         } catch (err) {
            console.error("이메일 중복 확인 실패", err);
             return false;
         }
     };

    const checkNicknameDuplicate = async (nickname: string) => {
         try {
             const response = await api.post("/auth/check-nickname", { nickname });
             return response.data.available; // true = 사용 가능
         } catch (err) {
            console.error("닉네임 중복 확인 실패", err);
             return false;
         }
     };

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault(); // 폼 제출 이벤트 방지
        setErrorMessage("");

        if (!userEmail || !password || !nickname) {
            alert("모든 항목을 입력해주세요.");
            return;
        }
        if (!validateEmail(userEmail)) {
            setErrorMessage("이메일 형식을 확인해주세요.");
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage("비밀번호는 영문+숫자 조합 8자 이상이어야 합니다.");
            return;
        }
        if (!validateNickname(nickname)) {
            setErrorMessage("닉네임은 최대 8글자까지만 가능합니다.");
            return;
        }
        // 회원 가입 요청 
        try {
            const response = await api.post("/auth/signup", {
                userEmail,
                password,
                nickname
            });
            alert("회원가입 성공! 로그인 페이지로 이동합니다.");
            console.log("회원가입 성공:", response.data);
            navigate('/login'); // 회원가입 후 로그인 페이지로 이동
        } catch (error: any) {
            if (error.response?.status === 409){
                setErrorMessage("이미 사용 중인 이메일 또는 닉네임입니다.");
            } else {
                setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요");
            }
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

            {/*오류 메시지 출력 */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}    

            <button type="submit" className="submit-btn">완료</button>
            </form>
        </div>
    );
};

export default SignupPage;