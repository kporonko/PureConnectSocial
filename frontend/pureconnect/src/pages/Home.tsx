import React from 'react';
import NavMenu, {Page} from "../components/NavMenu";

const Home = (props: {theme: string, setTheme: any}) => {
    return (
        <div className={'home-wrapper'} data-theme={props.theme}>
            <NavMenu page={Page.Home} theme={props.theme}/>
        </div>
    );
};

export default Home;