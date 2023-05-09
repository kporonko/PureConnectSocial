import React, {useEffect} from 'react';
import AdminNav, {AdminPage} from "../components/AdminNav";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import AuthorOfPostPageBlock from "../components/AuthorOfPostPageBlock";
import PostPageStats from "../components/PostPageStats";
import Loader from "../components/Loader";
import {deletePost, getPostById} from "../utils/FetchData";
import {toast, ToastContainer} from "react-toastify";
import {IPost} from "../interfaces/IPost";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import LocalizedStrings from "react-localization";
import {confirmAlert} from "react-confirm-alert";

const AdminPostPage = (props: {
    theme: string,
    setTheme: any
}) => {

    const strings = new LocalizedStrings({
        en:{
            expired:"Expired",
            error:"Error",
            description:"Description",
            image:"Image",
            areSure:"Are you sure?",
            yes:"Yes",
            no:"No",
        },
        ua: {
            expired:"Ваша сесія закінчилася. Будь ласка, увійдіть знову.",
            error:"Щось пішло не так. Будь ласка, спробуйте пізніше.",
            description:"Опис",
            image:"Зображення",
            areSure:"Ви впевнені?",
            yes:"Так",
            no:"Ні",
        }
    });

    const {postId} = useParams()
    const nav = useNavigate();
    const [post, setPost] = React.useState<IPost|undefined>(undefined);

    useEffect(() => {
        getPost();
    }, [postId])

    const getPost = async () => {
        const token = localStorage.getItem('access_token');
        if (token !== null && postId !== undefined) {
            const postResponse = await getPostById(token, Number(postId));
            if (postResponse.status === 200) {
                const post = await postResponse.json();
                setPost(post);
            }
            else if (postResponse.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error(strings.expired);
                notify();
            }
            else {
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
    }

    const handleDeletePost = () => {
        confirmAlert({
            message: strings.areSure,
            title: 'Confirm To Delete Post',
            buttons:[
                {
                    label: strings.yes,
                    onClick: DeletePost

                },
                {
                    label: strings.no,
                }
            ]
        })
    }

    const DeletePost = async () => {
        const token = localStorage.getItem('access_token');
        if (token !== null && postId !== undefined) {
            const postResponse = await deletePost(token, Number(postId));
            if (postResponse.status === 200) {
                const notify = () => toast.success("Post deleted");
                notify();
                setTimeout(() => nav('/admin-post-reports'), 2000);
            }
            else if (postResponse.status === 401) {
                setTimeout(() => nav('/'), 2000);
                const notify = () => toast.error(strings.expired);
                notify();
            }
            else {
                const notify = () => toast.error(strings.error);
                notify();
            }
        }
    }
    return (
        <div data-theme={props.theme}>
            <AdminNav theme={props.theme} setTheme={props.setTheme} page={AdminPage.Post}/>
            <div>
                <div className={'post-page-content-wrapper'}>
                    {post ?
                        <div className={'post-page-content'}>
                            <div className='post-page-top-panel-wrapper'>
                                <FontAwesomeIcon onClick={() => nav(-1)} className={'post-page-icon'} icon={solid('arrow-left')}/>
                                <AuthorOfPostPageBlock post={post}/>
                                <FontAwesomeIcon onClick={handleDeletePost} className={'post-page-icon'} icon={solid('bucket')}/>
                            </div>

                            <div className={'post-page-content-grid'}>
                                <div className='post-page-image-block'>
                                    <label className={'post-page-label'}>{strings.image}</label>
                                    <div className='post-page-image-wrapper'>
                                        <img className={'post-page-image'} src={post.image} alt=""/>
                                    </div>
                                </div>

                                <div className='post-page-right-grid-block'>
                                    <div className='post-page-description-wrapper'>
                                        <label className={'post-page-label'}>{strings.description}</label>
                                        <div className='post-page-description'>
                                            {decodeURI(post.description)}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        :
                        <Loader theme={props.theme}/>}
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover/>
        </div>
    );
};

export default AdminPostPage;