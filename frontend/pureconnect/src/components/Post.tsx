import React, {useState} from 'react';
import {IPost} from "../interfaces/IPost";
import PostActionsPanel from "./PostActionsPanel";
import PostDatePanel from "./PostDatePanel";
import PostUser from "./PostUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import ModalPost from "./ModalPost";
import ModalPostMine from "./ModalPostMine";

const Post = (props: {post: IPost, theme: string, isMy: boolean}) => {

    const [isOpenReadMore, setIsOpenReadMore] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);

    return (
        <div className='post-wrapper'>
            <div className='post-bar'>
                <PostUser post={props.post}/>
                <div onClick={() => setIsOpenModal(!isOpenModal)} className='post-menu'>
                    <FontAwesomeIcon icon={solid('ellipsis')}/>
                </div>
            </div>

            <div className='post-image-wrapper'>
                <img className='post-image' src={props.post.image} alt="Post Image"/>
            </div>

            <div className='post-desc'>
                {isOpenReadMore ? (
                    <div className="read-more-content">
                        <p>
                            {decodeURI(props.post.description)}
                            <span className={'read-more-span'} onClick={() => setIsOpenReadMore(false)}>Close</span>
                        </p>
                    </div>
                ) : props.post.description.length > 200 ?
                    <div className="read-more-preview">
                        <p>{props.post.description.slice(0, 200)}...
                            <span className={'read-more-span'} onClick={() => setIsOpenReadMore(true)}>Read more</span>
                        </p>
                    </div> :
                    <div className="read-more-preview">
                        <p>{decodeURI(props.post.description)}</p>
                    </div>
                }
            </div>

            <PostActionsPanel post={props.post} theme={props.theme}/>
            <PostDatePanel post={props.post}/>
            {props.isMy ?
                <ModalPostMine post={props.post} isOpen={isOpenModal} setIsOpen={setIsOpenModal} theme={props.theme}/>
                :
                <ModalPost post={props.post} isOpen={isOpenModal} setIsOpen={setIsOpenModal} theme={props.theme}/>
            }
        </div>
    );
};

export default Post;