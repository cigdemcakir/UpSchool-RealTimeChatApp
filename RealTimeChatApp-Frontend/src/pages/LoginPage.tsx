import React, { ChangeEvent, useState } from "react";

type LoginPageProps = {
    onJoinChat: (username: string) => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onJoinChat }) => {
    const [username, setUsername] = useState<string>("");

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleJoinChat = () => {
        if (username.trim() === "") {
            alert("Lütfen geçerli bir kullanıcı adı girin.");
            return;
        }

        onJoinChat(username);
    };

    return (

    <div className="background">
        <div className="form-card">
            <div className="form-title">
                Welcome 👋
            </div>

            <div className="form-subtitle">
                Select your username to get started
            </div>

            <div className="auth">
                <div className="auth-label">Username</div>
                <input className="auth-input"
                       type="text"
                       value={username}
                       onChange={handleUsernameChange}/>
                <button className="auth-button" type="submit" onClick={handleJoinChat}>Join Chat!</button>
            </div>
        </div>
    </div>
    );
};

export default LoginPage;