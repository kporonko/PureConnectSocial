// interfaces/IChat.ts
export interface IChat {
    id: number;
    name: string;
    type: string;
    avatarUrl?: string;
}

export interface IChatShortResponse {
    chats: IChatShort[];
}

export interface IChatShort {
    chatId: number;
    chatAvatar: string | null;
    lastmessage: ILastMessage | null;
    name: string | null;
}

export interface ILastMessage {
    messageId: number;
    messageText: string;
    senderUsername: number;
    sendDate: string;
}

export interface IChatResponse {
    chatId: number;
    participants: IParticipant[];
    messages: IMessageInChatResponse[];
}

export interface IParticipant {
    participantId: number;
    avatar: string;
    fullName: string;
    username: string;
    email: string;
}

export interface IMessageInChatResponse {
    messageId: number;
    messageText: string;
    messageDate: string;
    senderId: string;
    email: string;
}

export interface IMessage {
    id: number;
    content: string;
    timestamp: string;
    senderId: number;
    chatId: number;
}