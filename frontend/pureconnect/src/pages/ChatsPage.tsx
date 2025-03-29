import React, { useState, useEffect } from 'react';
import NavMenu from "../components/NavMenu";
import ChatList from "../components/ChatList";
import EmptyChat from "../components/EmptyChat";
import ChatComponent from "../components/ChatComponent";
import { HubConnectionBuilder } from '@microsoft/signalr';
import { IChatShortResponse } from '../interfaces/IChat';
import LocalizedStrings from "react-localization";
import {BASE_URL, fetchChats, getAvatar} from "../utils/FetchData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ChatsPage = (props: {
    theme: string,
    setTheme: any
}) => {
    const [chats, setChats] = useState<IChatShortResponse>({ chats: [] });
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [connection, setConnection] = useState<any>(null);
    const [avatarImage, setAvatarImage] = React.useState("");

    const nav = useNavigate();

    let strings = new LocalizedStrings({
        en:{
            loading:"Wait for the chat component to load",
            expired:"Your session is expired. Please login again"
        },
        ua: {
            loading:"Здесь будет компонент чата",
            expired:"Ваша сесія закінчилася. Будь-ласка, залогіньтеся заново"
        }
    });

    useEffect( () => {
        const avatar = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const response = await getAvatar(token);
                if (response.status === 401) {
                    setTimeout(() => nav('/'), 2000);
                    const notify = () => toast.error(strings.expired);
                    notify();
                }
                const body = await response.json();
                setAvatarImage(body.avatar);
            }
        };
        avatar();
    }, []);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                // Инициализация SignalR подключения
                const token = localStorage.getItem('access_token');
                const newConnection = new HubConnectionBuilder()
                    .withUrl(`${BASE_URL}chatHub`, {
                        accessTokenFactory: () => token || ''
                    })
                    .withAutomaticReconnect()
                    .build();

                // Настройка обработчиков событий
                newConnection.on("SendMessage", (chatId, signalRMessage) => {
                    console.log(`Получено сообщение в чат ${chatId}:`, signalRMessage);

                    // Если сообщение пришло в текущий открытый чат, обновляем историю
                    if (selectedChatId === chatId) {
                        // Компонент ChatComponent сам обновит свое состояние
                    }

                    // В любом случае обновляем список чатов, чтобы отобразить последнее сообщение
                    fetchChatsData();
                });

                newConnection.on("OnUserJoined", (chatId, userId) => {
                    console.log(`Пользователь ${userId} присоединился к чату ${chatId}`);
                    // Обновляем список чатов, если добавлен новый чат
                    fetchChatsData();
                });

                await newConnection.start();
                console.log('SignalR Connected');
                setConnection(newConnection);

                // Загрузка списка чатов
                await fetchChatsData();
            } catch (err) {
                console.error('Error initializing chat:', err);
                toast.error('Failed to connect to chat service');
            }
        };

        initializeChat();

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);

    const fetchChatsData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetchChats(token);

            if (response.status === 401) {
                setTimeout(() => nav('/'), 2000);
                toast.error(strings.expired);
                return;
            }

            if (!response.ok) {
                toast.error('Failed to load chats');
                return;
            }

            const responseModel = await response.json() as IChatShortResponse;
            console.log('Fetched chats:', responseModel);
            setChats(responseModel);
        } catch (error) {
            console.error('Error fetching chats:', error);
            toast.error('Failed to load chats');
        }
    };

    const handleChatSelect = (chatId: number) => {
        setSelectedChatId(chatId);
    };

    return (
        <div className="chats-page" data-theme={props.theme}>
            <NavMenu page={4} theme={props.theme} setTheme={props.setTheme}  avatar={avatarImage} />
            <div className="chats-content">
                <ChatList
                    chats={chats}
                    selectedChatId={selectedChatId}
                    onChatSelect={handleChatSelect}
                />
                <div className="chat-area">
                    {selectedChatId ? (
                        <ChatComponent
                            chatId={selectedChatId}
                            theme={props.theme}
                            connection={connection}
                            onMessageSent={fetchChatsData}
                        />
                    ) : (
                        <EmptyChat />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;