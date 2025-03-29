import React from 'react';
import { IChatShortResponse, IChatShort } from '../interfaces/IChat';
import LocalizedStrings from "react-localization";
import ChatListItem from "./ChatListItem";

interface ChatListProps {
    chats: IChatShortResponse;
    selectedChatId: number | null;
    onChatSelect: (chatId: number) => void;
}

let strings = new LocalizedStrings({
    en:{
        main:"Messages",
    },
    ua: {
        main:"Сообщения",
    }
});

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onChatSelect }) => {
    console.log(chats.chats)

    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h2>{strings.main}</h2>
            </div>
            <div className="chat-list-content">
                {chats?.chats?.map(chat => (
                    <ChatListItem
                        key={chat.chatId}
                        chat={chat}
                        isSelected={selectedChatId === chat.chatId}
                        onSelect={onChatSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChatList;