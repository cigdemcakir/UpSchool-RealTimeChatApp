import "./App.css";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import { useState } from "react";


enum Page {
  LOGIN,
  CHAT,
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [username, setUsername] = useState<string>("");

  const handleJoinChat = (username: string) => {
    setUsername(username);
    setCurrentPage(Page.CHAT);
  };

  return (
    <div className="App">
      {currentPage === Page.LOGIN && <LoginPage onJoinChat={handleJoinChat} />}
      {currentPage === Page.CHAT && <ChatPage username={username} />}
    </div>
  );
}
export default App;
// import React from "react";
// import { Route, Routes } from "react-router-dom";

// import LoginPage from "./pages/LoginPage";
// import ChatPage from "./pages/ChatPage";

// const App: React.FC = () => {
//   const isLoggedIn = false; // Kullanıcının oturum açıp açmadığını burada kontrol edin

//   return (
//     <Routes>
//       <Route path="/">
//         {isLoggedIn ? (
//           <Route path="/chat" element={<ChatPage />} />
//         ) : (
//           <Route path="/login" element={<LoginPage />} />
//         )}
//       </Route>
//     </Routes>
//   );
// };

//export default App;
