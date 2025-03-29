import React, { useState, useEffect, useRef } from 'react';
import { IChatResponse, IMessageInChatResponse } from '../interfaces/IChat';
import { IMessageSignalRModel } from '../interfaces/IMessageSignalRModel';
import LocalizedStrings from "react-localization";
import { BASE_URL } from "../utils/FetchData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface ChatComponentProps {
    chatId: number;
    theme: string;
    connection: any;
    onMessageSent?: () => void; // Add this optional callback prop
}

const ChatComponent: React.FC<ChatComponentProps> = ({
                                                         chatId,
                                                         theme,
                                                         connection,
                                                         onMessageSent
                                                     }) => {
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
            yesterday: "Yesterday",
            justNow: "just now"
        },
        ua: {
            loading: "Завантаження повідомлень...",
            typePlaceholder: "Введіть повідомлення...",
            send: "Надіслати",
            error: "Щось пішло не так. Спробуйте пізніше.",
            expired: "Ваша сесія закінчилася. Будь-ласка, залогіньтеся заново",
            empty: "Ще немає повідомлень. Почніть розмову!",
            today: "Сьогодні",
            yesterday: "Вчора",
            justNow: "щойно"
        }
    });

    // Загрузка истории чата при изменении chatId
    useEffect(() => {
        if (chatId) {
            fetchChatHistory();
        }
    }, [chatId]);

    // Настройка обработчиков SignalR
    useEffect(() => {
        if (connection && chatId && chat) {
            // Отписываемся от предыдущих событий для предотвращения дублирования
            connection.off("SendMessage");

            // Присоединяемся к группе чата (если Hub имеет метод JoinChat)
            try {
                connection.invoke("JoinChat", chatId)
                    .catch((err:any) => console.error("Error joining chat:", err));
            } catch (error) {
                console.log("JoinChat method not available:", error);
            }

            // Подписываемся на получение новых сообщений
            connection.on("SendMessage", (receivedChatId: number, signalRMessage: IMessageSignalRModel) => {
                console.log("Received message via SignalR:", receivedChatId, signalRMessage);

                // Проверяем, что сообщение для текущего чата
                if (receivedChatId === chatId) {
                    // Преобразуем модель SignalR в формат модели для UI
                    const messageForUI: IMessageInChatResponse = {
                        messageId: signalRMessage.messageId,
                        messageText: signalRMessage.messageText,
                        messageDate: new Date(signalRMessage.messageDate).toISOString(),
                        senderId: signalRMessage.senderId.toString(),
                        email: '' // Email может отсутствовать в SignalR модели
                    };

                    setChat(prevChat => {
                        if (!prevChat) return prevChat;

                        // Проверяем, не дублируется ли сообщение
                        const messageExists = prevChat.messages.some(m =>
                            m.messageId === messageForUI.messageId);

                        if (messageExists) return prevChat;

                        // Добавляем новое сообщение в список
                        return {
                            ...prevChat,
                            messages: [...prevChat.messages, messageForUI]
                        };
                    });
                }
            });

            // При размонтировании компонента или изменении чата
            return () => {
                connection.off("SendMessage");
                try {
                    connection.invoke("LeaveChat", chatId)
                        .catch((err: any) => console.error("Error leaving chat:", err));
                } catch (error) {
                    console.log("LeaveChat method not available:", error);
                }
            };
        }
    }, [connection, chatId, chat]);

    // Прокрутка к последнему сообщению при обновлении чата
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [chat?.messages]);

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

        // Сохраняем текст сообщения для оптимистичного обновления
        const messageText = message.trim();
        setMessage(''); // Очищаем поле ввода сразу

        // Добавляем сообщение локально для мгновенного отображения (оптимистичное обновление)
        if (chat) {
            const optimisticMessage: IMessageInChatResponse = {
                messageId: -new Date().getTime(), // Временный отрицательный ID, чтобы не конфликтовать с реальными
                messageText: messageText,
                messageDate: new Date().toISOString(),
                senderId: chat.userId.toString(),
                email: '' // Можно получить из локального хранилища, если нужно
            };

            setChat(prevChat => {
                if (!prevChat) return prevChat;
                return {
                    ...prevChat,
                    messages: [...prevChat.messages, optimisticMessage]
                };
            });
        }

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${BASE_URL}api/Chat/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: messageText }),
            });

            if (response.status === 401) {
                setTimeout(() => nav('/'), 2000);
                toast.error(strings.expired);
                return;
            }

            if (!response.ok) {
                toast.error(strings.error);
                // Можно добавить код для удаления оптимистично добавленного сообщения
                return;
            }

            // Call the callback to update the chat list if provided
            if (onMessageSent) {
                onMessageSent();
            }

            // НЕ обновляем историю чата - сообщение придет через SignalR
            // fetchChatHistory();
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

        // Разница в миллисекундах
        const diffMs = now.getTime() - messageDate.getTime();

        // Конвертация в различные единицы времени
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        // Форматирование даты для сообщений
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Получаем только время (часы:минуты)
        const timeOnly = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (diffMinutes < 1) {
            return strings.justNow || 'just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} ${diffMinutes === 1 ? 'min' : 'mins'} ago`;
        } else if (messageDate >= today) {
            return timeOnly;
        } else if (messageDate >= yesterday) {
            return `${strings.yesterday}, ${timeOnly}`;
        } else if (diffDays < 7) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return `${days[messageDate.getDay()]}, ${timeOnly}`;
        } else {
            return messageDate.toLocaleDateString() + ', ' + timeOnly;
        }
    };

    const getDisplayName = (senderId: string) => {
        if (!chat) return '';

        const participant = chat.participants.find(p => p.participantId.toString() === senderId);
        return participant ? (participant.fullName || participant.username) : senderId;
    };

    const getParticipantAvatar = (senderId: string) => {
        if (!chat) return '';

        const participant = chat.participants.find(p => p.participantId.toString() === senderId);
        return participant?.avatar || '';
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

    // Функция для получения собеседника (для личного чата)
    const getInterlocutor = () => {
        if (!chat || !chat.participants) return null;

        return chat.participants.find(p => p.participantId !== chat.userId);
    };

    if (loading) {
        return <div className="chat-loading">{strings.loading}</div>;
    }

    return (
        <div className="chat-component" data-theme={theme}>
            {chat ? (
                <>
                    <div className="chat-header">
                        <div className="chat-header-info">
                            {chat.participants.length > 2 ? (
                                <div className="chat-header-group">
                                    <div className="chat-group-avatars">
                                        {chat.participants.slice(0, 3).map(participant => (
                                            <div
                                                className="chat-header-avatar"
                                                key={participant.participantId}
                                            >
                                                <img
                                                    src={participant.avatar}
                                                    alt={participant.fullName || participant.username}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <h2>{chat.participants.map(p => p.fullName || p.username).join(', ')}</h2>
                                </div>
                            ) : (
                                <>
                                    {getInterlocutor() && (
                                        <>
                                            <div className="chat-header-avatar">
                                                <img
                                                    src={getInterlocutor()?.avatar}
                                                    alt="User avatar"
                                                />
                                            </div>
                                            <h2>
                                                {getInterlocutor()?.fullName || getInterlocutor()?.username}
                                            </h2>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
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
                                        // Если ID отрицательный, это временное сообщение для оптимистичного обновления
                                        const isOptimisticMessage = message.messageId < 0;
                                        const isCurrentUser = parseInt(message.senderId) === chat.userId;
                                        return (
                                            <div
                                                key={message.messageId}
                                                className={`message-item ${isCurrentUser ? 'current-user' : 'other-user'} ${isOptimisticMessage ? 'optimistic-message' : ''}`}
                                            >
                                                <div className="message-avatar">
                                                    <img
                                                        src={getParticipantAvatar(message.senderId)}
                                                        alt={isCurrentUser ? "You" : getDisplayName(message.senderId)}
                                                    />
                                                </div>
                                                <div className="message-content">
                                                    {!isCurrentUser && (
                                                        <div className="message-sender">{getDisplayName(message.senderId)}</div>
                                                    )}
                                                    <div className="message-bubble">
                                                        <div className="message-text">{message.messageText}</div>
                                                        <div className="message-time">
                                                            {isOptimisticMessage
                                                                ? (strings.justNow || 'just now')
                                                                : getTimeMessage(message.messageDate)}
                                                        </div>
                                                    </div>
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