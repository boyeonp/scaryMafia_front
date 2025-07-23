import React from "react";
import '../styles/MakeRoom.css';
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; 



const MakeRoom: React.FC = () => {
    const navigate = useNavigate();
    const [roomName, setRoomName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [memberCount, setMemberCount] = React.useState(8);
    const [error, setError] = React.useState("");

    const handleSubmit= async (event: React.FormEvent) => {
        event.preventDefault();
        if (memberCount < 8){
            setError("최소 인원은 8명입니다.");
            return;
        }
        const createRoom = () => {
            const hostUserId = localStorage.getItem('userId');
            if (!hostUserId) {
                setError("로그인이 필요합니다.");
                return Promise.reject(new Error("로그인이 필요합니다."));
            }
            return api.post("/rooms", {
                title: roomName,
                notes: description,
                requiredPlayers: memberCount,
                hostUserId: hostUserId
            });
        };

        try {
            const res = await createRoom();
            if (res) {
                console.log("방 생성 성공", res.data);
                navigate("/roomwaiting", {state: {roomId: res.data.roomId}});
            }
        } catch (err: any) {
            console.error("방 생성 실패", err);
            if (err.response?.status === 409){
                if (window.confirm("이미 호스팅 중인 방이 있습니다. 기존 방을 삭제하고 새로 만드시겠습니까?")) {
                    try {
                        const hostUserId = localStorage.getItem('userId');
                        // 기존 방 삭제 API 호출 (엔드포인트는 추정)
                        await api.delete(`/rooms/by-host/${hostUserId}`);
                        // 방 삭제 후 다시 생성 시도
                        const res = await createRoom();
                        if (res) {
                            console.log("방 생성 성공", res.data);
                            navigate("/roomwaiting", {state: {roomId: res.data.roomId}});
                        }
                    } catch (deleteErr) {
                        console.error("기존 방 삭제 실패", deleteErr);
                        setError("기존 방을 삭제하는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
                    }
                } else {
                    setError("이미 방을 만들었거나, 호스팅 중입니다.");
                }
            } else {
                setError("방 생성 중 오류가 발생했습니다.");
            }
        }
    };

    const decreaseCount = () => {
        if (memberCount > 1) setMemberCount(memberCount -1);
    };

    const increaseCount = () => {
        setMemberCount(memberCount + 1);
    }

    return(
        <div className="makeroom-container">
            <form className="makeroom-form" onSubmit ={handleSubmit}>
                <div className="makeroom-title">방 개설</div>
                <div className="input-container">
                    <label className="makeroom-input-title">방 제목</label>
                    <input className="makeroom-input-box" 
                    type="text" value={roomName} 
                    onChange={(event) => setRoomName(event.target.value)} 
                    placeholder="방 제목을 작성해주세요." required />
                </div>
                <div className="input-container">
                    <label className="makeroom-input-title">방 소개</label>
                    <input className="makeroom-input-box" 
                    type="text" 
                    value={description} 
                    onChange={(event) => setDescription(event.target.value)} 
                    placeholder="개설한 방에 대한 한줄 소개를 작성해주세요." required />
                </div>
                <div className="input-container">
                    <label className="makeroom-input-title">참여 인원</label>
                    <div className="member-control">
                        <button className="member-change-btn" type="button" onClick={decreaseCount}>-</button>
                        <span className="member-count">{memberCount}</span>
                        <button className="member-change-btn" type="button" onClick={increaseCount}>+</button>
                    </div>
                    {memberCount <8 && <div className="error-text">최소 인원은 8명입니다.</div>}
                </div>
                <button type="submit" className="makeroom-submit-btn">완료</button>
                {error && <div className="error-text">{error}</div>}
            </form>
        </div>
    );
};

export default MakeRoom;
