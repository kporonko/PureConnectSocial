import React from 'react';
import { IChatShort } from '../interfaces/IChat';
import LocalizedStrings from "react-localization";

interface ChatListItemProps {
    chat: IChatShort;
    isSelected: boolean;
    onSelect: (chatId: number) => void;
}

    const getTimeMessage = (date: string|undefined, language: string = 'en') => {

        const messageDate = new Date(date!);
        const now = new Date();

        // Разница в миллисекундах
        const diffMs = now.getTime() - messageDate.getTime();

        // Конвертация в различные единицы времени
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.44);
        const diffYears = Math.floor(diffDays / 365.25);

        // Строки для локализации
        const timeStrings = new LocalizedStrings({
            en: {
                justNow: "just now",
                minuteAgo: "minute ago",
                minutesAgo: "minutes ago",
                hourAgo: "hour ago",
                hoursAgo: "hours ago",
                dayAgo: "day ago",
                daysAgo: "days ago",
                weekAgo: "week ago",
                weeksAgo: "weeks ago",
                monthAgo: "month ago",
                monthsAgo: "months ago",
                yearAgo: "year ago",
                yearsAgo: "years ago"
            },
            ru: {
                justNow: "щойно",
                minuteAgo: "хвилину тому",
                minutesAgo: "хвилин тому",
                hourAgo: "годину тому",
                hoursAgo: "годин тому",
                dayAgo: "день тому",
                daysAgo: "днів тому",
                weekAgo: "тиждень тому",
                weeksAgo: "тижнів тому",
                monthAgo: "місяць тому",
                monthsAgo: "місяців тому",
                yearAgo: "рік тому",
                yearsAgo: "років тому"
            }
        });

        timeStrings.setLanguage(language);

        // Возвращаем соответствующее значение согласно условиям
        if (diffMinutes < 1) {
            return timeStrings.justNow;
        } else if (diffMinutes < 60) {
            return `${diffMinutes} ${diffMinutes === 1 ? timeStrings.minuteAgo : timeStrings.minutesAgo}`;
        } else if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? timeStrings.hourAgo : timeStrings.hoursAgo}`;
        } else if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? timeStrings.dayAgo : timeStrings.daysAgo}`;
        } else if (diffWeeks < 4) {
            return `${diffWeeks} ${diffWeeks === 1 ? timeStrings.weekAgo : timeStrings.weeksAgo}`;
        } else if (diffMonths < 12) {
            return `${diffMonths} ${diffMonths === 1 ? timeStrings.monthAgo : timeStrings.monthsAgo}`;
        } else {
            return `${diffYears} ${diffYears === 1 ? timeStrings.yearAgo : timeStrings.yearsAgo}`;
        }

        return ''
    }

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isSelected, onSelect }) => {
    return (
        <div
            className={`chat-list-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(chat.chatId)}
        >
            <div className={'small-chat-avatar-wrapper'}>
                <div className={'small-chat-avatar'}>
                    {chat.chatAvatar && <img src={chat.chatAvatar} alt="Chat avatar" />}
                </div>
            </div>

            <div className={'small-chat-text-wrapper'}>
                <div>
                    <div className={'small-chat-msg-username small-chat-name'}>
                        {chat.name}
                    </div>
                </div>
                <div className={'small-chat-msg-wrapper'}>
                    <div className={'small-chat-msg-text'}>
                        {chat.lastmessage?.messageText}
                    </div>

                    <div className={"small-chat-msg-time"}>
                        {getTimeMessage(chat.lastmessage?.sendDate)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;