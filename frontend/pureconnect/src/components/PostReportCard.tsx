import React from 'react';
import {IPostReport} from "../interfaces/IPostReport";
import {useNavigate} from "react-router";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LocalizedStrings from "react-localization";

const PostReportCard = (props: {
    report: IPostReport,
}) => {
    const nav = useNavigate()

    const strings = new LocalizedStrings({
        en:{
            goToPost: "Go to post",
        },
        ua: {
            goToPost: "Перейти до посту",
        }
    })

    const handleGoPost = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        nav(`/admin-post/${props.report.postId}`)
    }

    return (
        <div className='report-card-wrapper'>
            <div onClick={() => nav(`/post-report/${props.report.id}`)} className='report-card-content'>
                <div className='report-card-text'>
                    {props.report.text}
                </div>

                <div className='report-card-date'>
                    {new Date(props.report.createdAt?.toString()).toLocaleDateString()}
                </div>

                <div onClick={(e) => handleGoPost(e)} className='go-to-post-button' style={{display: 'flex', gap:'10px', alignItems:'center'}}>
                    {strings.goToPost}
                    <FontAwesomeIcon icon={solid('arrow-right')}/>
                </div>
            </div>
        </div>
    );
};

export default PostReportCard;