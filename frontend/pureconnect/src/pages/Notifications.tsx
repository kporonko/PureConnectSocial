import React, {useEffect} from 'react';
import NavMenu from "../components/NavMenu";
import MainContentMyProfile from "../components/MainContentMyProfile";
import { HubConnectionBuilder } from '@microsoft/signalr';

const Notifications = (props: {
    theme: string,
    setTheme: any
}) => {

    useEffect(() => {
        // Create a connection to the SignalR hub
        const connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7219/notificationHub') // Specify the URL of the SignalR hub endpoint
            .build();

        // Handle incoming notifications
        connection.on('ReceiveNotification', (notification: any) => {
            // Process the notification and update the UI
            // Display a toast notification or update the UI to indicate the liked post
            console.log(notification);
        });

        // Start the connection
        connection.start()
            .then(() => {
                console.log('SignalR connection started.');
                // Subscribe to user-specific channels or groups if needed
                // For example, you may join a group based on the user's ID to receive personalized notifications
            })
            .catch((error: any) => {
                console.error('SignalR connection error:', error);
            });

        // Clean up the connection when the component unmounts
        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div>
             <NavMenu page={3} theme={props.theme} setTheme={props.setTheme} avatar={""}/>
        </div>
    );
};

export default Notifications;