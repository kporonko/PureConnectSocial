import React, { useState, useEffect, useRef } from 'react';
import { IChatResponse, IMessageInChatResponse } from '../interfaces/IChat';
import LocalizedStrings from "react-localization";
import { BASE_URL } from "../utils/FetchData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface ChatComponentProps {
    chatId: number;
    theme: string;
    connection: any;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chatId, theme, connection }) => {
    const [chat, setChat] = useState<IChatResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const nav = useNavigate();

    let strings = new LocalizedStrings({
        en:{
            loading: "Loading chat messages...",
            typePlaceholder: "Type a message...",
            send: "Send",
            error: "Something went wrong. Please try again later.",
            expired: "Your session is expired. Please login again",
            empty: "No messages yet. Start a conversation!",
            today: "Today",
            yesterday: "Yesterday"
        },
        ua: {
            loading: "Завантаження повідомлень...",
            typePlaceholder: "Введіть повідомлення...",
            send: "Надіслати",
            error: "Щось пішло не так. Спробуйте пізніше.",
            expired: "Ваша сесія закінчилася. Будь-ласка, залогіньтеся заново",
            empty: "Ще немає повідомлень. Почніть розмову!",
            today: "Сьогодні",
            yesterday: "Вчора"
        }
    });

    useEffect(() => {
        if (chatId) {
            fetchChatHistory();
        }
    }, [chatId]);

    useEffect(() => {
        // Прокрутка к последнему сообщению при обновлении чата
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [chat]);

    const fetchChatHistory = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${BASE_URL}api/Chat/${chatId}/messages`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                setTimeout(() => nav('/'), 2000);
                toast.error(strings.expired);
                return;
            }

            if (!response.ok) {
                toast.error(strings.error);
                return;
            }

            const data = await response.json() as IChatResponse;
            setChat(data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            toast.error(strings.error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!message.trim() || !chatId) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${BASE_URL}api/Chat/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: message }),
            });

            if (response.status === 401) {
                setTimeout(() => nav('/'), 2000);
                toast.error(strings.expired);
                return;
            }

            if (!response.ok) {
                toast.error(strings.error);
                return;
            }

            // Успешная отправка сообщения
            setMessage('');
            // Обновляем историю чата
            fetchChatHistory();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(strings.error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getTimeMessage = (date: string|undefined) => {
        if (date === undefined)
            return '';

        const messageDate = new Date(date);
        const now = new Date();

        // Форматирование даты для сообщений
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate >= today) {
            return `${strings.today}, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (messageDate >= yesterday) {
            return `${strings.yesterday}, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return messageDate.toLocaleDateString() + ', ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    const getDisplayName = (senderId: string) => {
        if (!chat) return '';

        const participant = chat.participants.find(p => p.participantId.toString() === senderId);
        return participant ? (participant.fullName || participant.username) : senderId;
    };

    const getCurrentUserId = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.id?.toString() || '';
    };

    const groupMessagesByDate = (messages: IMessageInChatResponse[]) => {
        const grouped: { [key: string]: IMessageInChatResponse[] } = {};

        messages.forEach(message => {
            const date = new Date(message.messageDate);
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }

            grouped[dateKey].push(message);
        });

        return grouped;
    };

    const formatDateHeader = (dateKey: string) => {
        const [year, month, day] = dateKey.split('-').map(num => parseInt(num));
        const date = new Date(year, month, day);
        const now = new Date();

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.getTime() === today.getTime()) {
            return strings.today;
        } else if (date.getTime() === yesterday.getTime()) {
            return strings.yesterday;
        } else {
            return date.toLocaleDateString();
        }
    };

    if (loading) {
        return <div className="chat-loading">{strings.loading}</div>;
    }

    return (
        <div className="chat-component" data-theme={theme}>
            {chat ? (
                <>
                    <div className="chat-header">
                        {/* Если групповой чат - показать название, если личный - имя собеседника */}
                        <h2>{chat.participants.length > 2
                            ? chat.participants.map(p => p.fullName || p.username).join(', ')
                            : chat.participants.find(p => p.participantId.toString() !== getCurrentUserId())?.fullName ||
                            chat.participants.find(p => p.participantId.toString() !== getCurrentUserId())?.username}
                        </h2>
                    </div>

                    <div className="chat-messages-container" ref={messageContainerRef}>
                        {chat.messages.length === 0 ? (
                            <div className="empty-chat-message">{strings.empty}</div>
                        ) : (
                            Object.entries(groupMessagesByDate(chat.messages)).map(([dateKey, messages]) => (
                                <div key={dateKey} className="message-date-group">
                                    <div className="date-divider">
                                        <span>{formatDateHeader(dateKey)}</span>
                                    </div>

                                    {messages.map(message => {
                                        const isCurrentUser = message.senderId === getCurrentUserId();
                                        return (
                                            <div
                                                key={message.messageId}
                                                className={`message-item ${isCurrentUser ? 'current-user' : 'other-user'}`}
                                            >
                                                {!isCurrentUser && (
                                                    <div className="message-sender">{getDisplayName(message.senderId)}</div>
                                                )}
                                                <div className="message-bubble">
                                                    <div className="message-text">{message.messageText}</div>
                                                    <div className="message-time">{getTimeMessage(message.messageDate)}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="chat-input-container">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={strings.typePlaceholder}
                            className="chat-input"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!message.trim()}
                            className="chat-send-button"
                        >
                            {strings.send}
                        </button>
                    </div>
                </>
            ) : (
                <div className="empty-chat-message">{strings.error}</div>
            )}
        </div>
    );
};

export default ChatComponent;