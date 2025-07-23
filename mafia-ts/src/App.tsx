import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LobbyPage from "./pages/LobbyPage";
import MakeRoom from "./pages/MakeRoom";
import RolePage from "./pages/RolePage";
import RoomWaitingPage from "./pages/RoomWaitingPage";
import Introduce from "./pages/Introduce";
import IntroduceChat from "./pages/IntroduceChat";
import NightChat from "./pages/NightMafia";
import SelectTargetPage from "./pages/SelectTargetPage";
import ResultAnnounce from "./pages/VoteResult";
import DayGuide from "./pages/Day";
import DayChat from "./pages/DayChat";
import DayVote from "./pages/DayVote";
import UpDownPage from "./pages/UpDown";
import GameEndPage from "./pages/GameResult";
import DayVoteResult from "./pages/DayVoteResult";

function App(){
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/lobby/makeroom" element={<MakeRoom />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="/roomwaiting" element={<RoomWaitingPage />} />
          <Route path="/game/introduce" element={<Introduce />}/>
          <Route path="/game/introducechat" element={<IntroduceChat />} />
          <Route path="/game/nightmafia" element={<NightChat />} />
          <Route path="/game/selecttarget" element={<SelectTargetPage/>} />
          <Route path="/game/voteresult" element={<ResultAnnounce/>} />
          <Route path="/game/day" element = {<DayGuide/>} />
          <Route path="/game/daychat" element = {<DayChat/>} />
          <Route path="/game/dayvote" element={<DayVote />}/>
          <Route path="/game/dayvoteresult" element={<DayVoteResult/>}/>
          <Route path="/game/updown" element ={<UpDownPage/>}/>
          <Route path="/gameresult" element ={<GameEndPage/>}/>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
