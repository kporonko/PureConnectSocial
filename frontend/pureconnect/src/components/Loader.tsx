import React from 'react';
import loaderImage from '../assets/icons8-spinner (1).gif';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
const Loader = (props: {theme: string}) => {
    return (
        <div className={'loader-wrapper'}>
            <div className={'loader-image'}>
                <FontAwesomeIcon style={{color: `${props.theme === 'dark' ? 'white' : 'black'}`}} icon={solid('spinner')} spin size={'3x'}/>
            </div>
            <div className={'loader-text'}>
                Loading...
            </div>

        </div>
    );
};

export default Loader;