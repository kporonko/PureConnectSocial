import React, {SetStateAction, useState} from 'react';
import {IPost} from "../interfaces/IPost";
import PostActionsPanel from "./PostActionsPanel";
import PostDatePanel from "./PostDatePanel";
import PostUser from "./PostUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import ModalPost from "./ModalPost";
import ModalPostMine from "./ModalPostMine";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";

const Post = (props: {
    post: IPost,
    theme: string,
    isMy: boolean,
    setIsChangedPosts?: React.Dispatch<SetStateAction<boolean>>
    isChangedPosts?: boolean,
    postEdit?: IPostAddRequest|undefined,
    setPostEdit?: React.Dispatch<SetStateAction<IPostAddRequest>>,
    isOpenEdit?: boolean,
    setIsOpenEdit?: React.Dispatch<SetStateAction<boolean>>,
    setIsOpenUsersLikedPost?: React.Dispatch<SetStateAction<boolean>>,
    setCurrPostIdUsersLiked?: React.Dispatch<SetStateAction<number|undefined>>,
}) => {

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

            <PostActionsPanel setCurrPostIdUsersLiked={props.setCurrPostIdUsersLiked} setIsOpenUsersLikedPost={props.setIsOpenUsersLikedPost} post={props.post} theme={props.theme}/>
            <PostDatePanel post={props.post}/>
            {props.isMy ?
                <ModalPostMine isOpenEdit={props.isOpenEdit} setIsOpenEdit={props.setIsOpenEdit} postEdit={props.postEdit} setPostEdit={props.setPostEdit} isChangedPosts={props.isChangedPosts} setIsChangedPosts={props.setIsChangedPosts} post={props.post} isOpen={isOpenModal} setIsOpen={setIsOpenModal} theme={props.theme}/>
                :
                <ModalPost post={props.post} isOpen={isOpenModal} setIsOpen={setIsOpenModal} theme={props.theme}/>
            }
        </div>
    );
};

export default Post;