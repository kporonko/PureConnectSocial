import React from 'react';
import {IPost} from "../interfaces/IPost";
import Loader from "./Loader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import AuthorOfPostPageBlock from "./AuthorOfPostPageBlock";
import LocalizedStrings from "react-localization";
import PostPageStats from "./PostPageStats";

const PostPageContent = (props: {
    theme: string,
    post: IPost|undefined,
    setPost: React.Dispatch<React.SetStateAction<IPost|undefined>>
}) => {

    const strings = new LocalizedStrings({
        en:{
            image:"Image",
            description:"Description",
        },
        ua: {
            image:"Зображення",
            description:"Опис",
        }
    })

    return (
        <div className={'post-page-content-wrapper'}>
            {props.post ?
            <div className={'post-page-content'}>
                <div className='post-page-top-panel-wrapper'>
                    <FontAwesomeIcon className={'post-page-icon'} icon={solid('arrow-left')}/>
                    <div>
                        <AuthorOfPostPageBlock post={props.post}/>
                    </div>
                    { props.post.isMine ?
                        <FontAwesomeIcon className={'post-page-icon'} icon={solid('edit')}/> :
                        <FontAwesomeIcon className={'post-page-icon'} icon={solid('circle-exclamation')}/>
                    }
                </div>

                <div className={'post-page-content-grid'}>
                    <div className='post-page-image-block'>
                        <label className={'post-page-label'}>{strings.image}</label>
                        <div className='post-page-image-wrapper'>
                            <img className={'post-page-image'} src={props.post.image} alt=""/>
                        </div>
                    </div>

                    <div className='post-page-right-grid-block'>
                        <div className='post-page-description-wrapper'>
                            <label className={'post-page-label'}>{strings.description}</label>
                            <div className='post-page-description'>
                                {props.post.description}
                            </div>
                        </div>
                        <PostPageStats post={props.post}/>
                    </div>

                </div>
            </div>
            :
            <Loader theme={props.theme}/>}
        </div>
    );
};

export default PostPageContent;