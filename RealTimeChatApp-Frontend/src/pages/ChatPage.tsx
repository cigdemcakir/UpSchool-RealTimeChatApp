import { ChangeEvent, useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import "./ChatPage.css";

type Message = {
    username: string;
    content: string;
    createdOn: Date;
};

type ChatPageProps = {
    username: string;
};

const ChatPage = ({ username }: ChatPageProps) => {
    const [message, setMessage] = useState<Message>({
        username: "",
        content: "",
        createdOn: new Date(),
    });
    const [userList, setUserList] = useState<string[]>([]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection>();

    useEffect(() => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7163/userhub")
            .withAutomaticReconnect()
            .build();

        hubConnection.on("UserAdded", (userName: string) => {
            setUserList((prevUserList) => [...prevUserList, userName]);
        });

        hubConnection.on("MessageAdded", (message: Message) => {
            setChatMessages((prevMessages) =>
                prevMessages ? [...prevMessages, message] : [message]
            );
        });

        const startConnection = async () => {
            try {
                await hubConnection.start();
                console.log("SignalR connection started.");
                setConnection(hubConnection);
                hubConnection.invoke("AddUser", username);
                const users = await hubConnection.invoke("GetUserList");
                setUserList(users);
                const messages = await hubConnection.invoke("GetMessageList");
                setChatMessages(messages);
            } catch (err: any) {
                console.error(err.toString());
            }
        };

        startConnection();

        return () => {
            if (hubConnection) {
                hubConnection.stop();
            }
        };
    }, [username]);

    const handleSendMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (message.content.trim() === "") {
            alert("Lütfen geçerli bir mesaj girin.");
            return;
        }

        if (connection && connection.state === "Connected") {
            connection
                .invoke("AddMessage", {
                    username: username,
                    content: message.content,
                    createdOn: new Date(),
                })
                .then(() => {
                    console.log("Mesaj gönderildi:", message.content);
                    setMessage({
                        username: "",
                        content: "",
                        createdOn: new Date(),
                    });
                })
                .catch((err: Error) => console.error(err.toString()));
        } else {
            console.error("SignalR connection is not in the 'Connected' state.");
        }
    };

    const handleLeaveRoom = () =>
    {
        window.location.href = "/LoginPage";
    };

    return (
        <body>
        <div className="chat-container">
            <header className="chat-header">
                <h1><i className="fas fa-smile"></i> Chat App</h1>
                <a id="leave-btn" className="btn" onClick={handleLeaveRoom}>Leave Room</a>
            </header>
            <main className="chat-main">
                <div className="chat-sidebar">
                    <div style={{display:'flex', alignItems:'center'}}>
                        <img src="/users.png" alt="User Icon" style={{height:'24px',width:'24px'}} className="user-icon" />
                        <h3><i className="fas fa-users" style={{marginLeft:'20px'}}></i> Users</h3>
                    </div>
                    <ul>
                        {userList.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                </div>
                <div className="chat-messages">
                    <h2>Messages:</h2>
                    {chatMessages ? (
                        <ul>
                            {chatMessages.map((msg, index) => (
                                <li key={index}>
                                    <strong>{msg.username}:</strong> {msg.content}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className="chat-form-container">
                    <form id="chat-form">
                        <input
                            type="text"
                            value={message.content}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setMessage({
                                    ...message,
                                    content: e.target.value,
                                    createdOn: new Date(),
                                })
                            }
                        />
                        <button onClick={handleSendMessage} className="send-button">Send</button>
                    </form>
                </div>
            </main>
        </div>
        </body>

    );
};

export default ChatPage;

