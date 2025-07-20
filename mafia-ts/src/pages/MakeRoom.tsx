import React from "react";
import '../styles/MakeRoom.css';
import { useNavigate } from "react-router-dom";


const MakeRoom: React.FC = () => {
    const navigate = useNavigate();
    const [roomName, setRoomName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [memberCount, setMemberCount] = React.useState(8);
    const [error, setError] = React.useState("");

    const handleSubmit=(event: React.FormEvent) => {
        event.preventDefault();
        if (memberCount < 8){
            setError("최소 인원은 8명입니다.");
            return;
        }
        console.log({roomName, description, memberCount});
        navigate("/roomwaiting");
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
            </form>
        </div>
    );
};

export default MakeRoom;