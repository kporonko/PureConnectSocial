import React, {ChangeEvent, SetStateAction, useRef, useState} from 'react';
import {useNavigate} from "react-router";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";
import LocalizedStrings from "react-localization";
import EmojiPicker, {EmojiClickData, EmojiStyle, SuggestionMode, Theme} from 'emoji-picker-react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

const ModalAddEditPostContent = (props: {
    theme: string,
    post: IPostAddRequest,
    setPost: React.Dispatch<SetStateAction<IPostAddRequest>>,
    isEdit: boolean,
}) => {

    let strings = new LocalizedStrings({
        en:{
            description:"Description",
            openEmojis: 'Open Emoji',
            closeEmojis: 'Close Emoji',
            changeDescription: 'Change description',
        },
        ua: {
            description:'Опис',
            openEmojis: 'Відкрити емоджі',
            closeEmojis: 'Закрти емоджі',
            changeDescription: 'Змінити опис',
        }
    });

    const nav = useNavigate();
    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(`${props.isEdit ? props.post.image : ''}`);

    const [isEmojiPicker, setIsEmojiPicker] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (fileInput.current && fileInput.current.files) {
            const file = fileInput.current.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);

            // Implement image to base64
            convertImageToBase64(reader, file);
        }
    };


    const convertImageToBase64 = (reader: FileReader, file: File) => {
        reader.onload = (event) => {
            props.setPost({...props.post, image: event.target?.result as string});
        };
        reader.readAsDataURL(file);
    }

    const toggleEmojiPicker = () => {
        setIsEmojiPicker(!isEmojiPicker)
    }

    const handleEmojiClick = (emoji: EmojiClickData) => {
        props.setPost({...props.post, description: props.post.description + emoji.emoji})
    }

    return (
        <div className={'modal-add-post-content'}>
            <div className={`modal-add-post-image-part-wrapper`}>
                {!props.isEdit &&
                <input
                    type="file"
                    ref={fileInput}
                    accept="image/*"
                    onChange={(e) => handleChange(e)}
                />}
                <div  className={`modal-add-post-image-wrapper ${props.isEdit && 'ma-top-2'}`}>
                    <img className="modal-add-post-image" src={preview?.toString()} alt="Preview" />
                </div>
            </div>

            <div className={"modal-add-post-desc-part-wrapper"}>
                <div className={'modal-add-post-desc-text'}>
                    {props.isEdit ? strings.changeDescription : strings.description}
                </div>
                <div>
                    <textarea
                        className={'modal-add-post-textarea'}
                        name=""
                        id=""
                        value={decodeURI(props.post.description)}
                        cols={38}
                        rows={20}
                        onChange={(e) => props.setPost({...props.post, description: e.target.value})}
                    >


                    </textarea>

                </div>
                <div>
                    <div style={{position: 'absolute', top: '60px', left: '410px'}}>
                        {isEmojiPicker &&
                            <EmojiPicker
                                width={300}
                                height={400}
                                theme={props.theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                                onEmojiClick={(emoji) => handleEmojiClick(emoji)}
                            />}
                    </div>
                    <div onClick={toggleEmojiPicker}  className={'emoji-open-block-wrapper'}>
                        <FontAwesomeIcon icon={solid('face-smile')}/>
                        <div>
                            {isEmojiPicker ? strings.closeEmojis : strings.openEmojis}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAddEditPostContent;