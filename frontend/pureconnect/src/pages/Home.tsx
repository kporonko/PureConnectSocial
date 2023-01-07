import React, {useEffect} from 'react';
import NavMenu, {Page} from "../components/NavMenu";
import {getAvatar} from "../utils/FetchData";
import MainContentHome from "../components/MainContentHome";
import {useNavigate} from "react-router";

const Home = (props: {theme: string, setTheme: any}) => {

    const [avatarImage, setAvatarImage] = React.useState("");
    const nav = useNavigate();

    useEffect( () => {
        const avatar = async() => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const response = await getAvatar(token);
                if (response.status === 401) {
                    nav('/')
                }
                const body = await response.json();
                setAvatarImage(body.avatar);
            }
        };
        avatar();
    }, []);

    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <NavMenu page={Page.Home} theme={props.theme} setTheme={props.setTheme} avatar={avatarImage}/>
            <MainContentHome/>
        </div>
    );
};

export default Home;