// SignalRService.ts - Create this new file in your utils folder

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BASE_URL } from './FetchData';

// Singleton pattern for SignalR connection
class SignalRService {
    private static instance: SignalRService;
    private connection: HubConnection | null = null;
    private listeners: Array<{ event: string; callback: Function }> = [];

    private constructor() {}

    public static getInstance(): SignalRService {
        if (!SignalRService.instance) {
            SignalRService.instance = new SignalRService();
        }
        return SignalRService.instance;
    }

    public async initializeConnection(): Promise<void> {
        if (this.connection) {
            return; // Connection already initialized
        }

        try {
            const token = localStorage.getItem('access_token');

            this.connection = new HubConnectionBuilder()
                .withUrl(`${BASE_URL}chatHub`, {
                    accessTokenFactory: () => token || ''
                })
                .withAutomaticReconnect()
                .build();

            // Start the connection
            await this.connection.start();
            console.log('SignalR Global Connection Established');

            // Register all existing listeners
            this.registerAllListeners();
        } catch (error) {
            console.error('Error initializing SignalR connection:', error);
            this.connection = null;
        }
    }

    private registerAllListeners(): void {
        if (!this.connection) return;

        // Clear all existing handlers first
        this.connection.off("SendMessage");
        this.connection.off("OnUserJoined");

        // Register all stored listeners
        this.listeners.forEach(listener => {
            if (this.connection) {
                this.connection.on(listener.event, (...args) => {
                    listener.callback(...args);
                });
            }
        });
    }

    public addListener(event: string, callback: Function): void {
        // Store the listener
        this.listeners.push({ event, callback });

        // If connection exists, register the listener immediately
        if (this.connection) {
            this.connection.on(event, (...args) => {
                callback(...args);
            });
        }
    }

    public removeListener(event: string, callback: Function): void {
        // Remove from our tracking array
        this.listeners = this.listeners.filter(
            listener => !(listener.event === event && listener.callback === callback)
        );

        // If connection exists, remove the specific handler
        if (this.connection) {
            this.connection.off(event);

            // Re-register remaining listeners for this event
            this.listeners
                .filter(listener => listener.event === event)
                .forEach(listener => {
                    if (this.connection) {
                        this.connection.on(listener.event, (...args) => {
                            listener.callback(...args);
                        });
                    }
                });
        }
    }

    public async joinChat(chatId: number): Promise<void> {
        if (!this.connection) {
            await this.initializeConnection();
        }

        if (this.connection) {
            try {
                await this.connection.invoke("JoinChat", chatId);
                console.log(`Joined chat: ${chatId}`);
            } catch (error) {
                console.error(`Error joining chat ${chatId}:`, error);
            }
        }
    }

    public async leaveChat(chatId: number): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.invoke("LeaveChat", chatId);
                console.log(`Left chat: ${chatId}`);
            } catch (error) {
                console.error(`Error leaving chat ${chatId}:`, error);
            }
        }
    }

    public getConnection(): HubConnection | null {
        return this.connection;
    }

    public async stopConnection(): Promise<void> {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            console.log('SignalR Connection Stopped');
        }
    }
}

export default SignalRService;