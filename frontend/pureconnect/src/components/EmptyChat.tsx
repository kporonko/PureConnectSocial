import React from 'react';
import LocalizedStrings from "react-localization";

const EmptyChat: React.FC = () => {

    let strings = new LocalizedStrings({
        en:{
            choose:"Choose a chat",
            chooseLong:"Choose a chat at the left to start a conversation",
        },
        ua: {
            choose:"Выберите чат",
            chooseLong:"Выберите чат из списка слева, чтобы начать общение",
        }
    });

    return (
        <div className="empty-chat">
            <div className="empty-chat-content">
                <h2>{strings.choose}</h2>
                <p>{strings.chooseLong}</p>
            </div>
        </div>
    );
};

export default EmptyChat;