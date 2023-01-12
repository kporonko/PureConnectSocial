import React, {ChangeEvent, useRef, useState} from 'react';
import {useNavigate} from "react-router";
import {IPostAddRequest} from "../interfaces/IPostAddRequest";
import LocalizedStrings from "react-localization";

const ModalAddPostContent = () => {

    let strings = new LocalizedStrings({
        en:{
            description:"Description",
        },
        ua: {
            description:'Опис',
        }
    });

    const nav = useNavigate();
    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

    const [post, setPost] = useState<IPostAddRequest>({ image: "", description: "", createdAt: undefined});

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

    console.log(post);
    const convertImageToBase64 = (reader: FileReader, file: File) => {
        reader.onload = (event) => {
            setPost({...post, image: event.target?.result as string});
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className={'modal-add-post-content'}>
            <div className={"modal-add-post-image-part-wrapper"}>
                <input
                    type="file"
                    ref={fileInput}
                    accept="image/*"
                    onChange={(e) => handleChange(e)}
                />

                <div className={"modal-add-post-image-wrapper"}>
                    <img className="modal-add-post-image" src={preview?.toString()} alt="Preview" />
                </div>
            </div>

            <div className={"modal-add-post-desc-part-wrapper"}>
                <div className={'modal-add-post-desc-text'}>
                    {strings.description}
                </div>
                <div>
                    <textarea
                        className={'modal-add-post-textarea'}
                        name=""
                        id=""
                        cols={38}
                        rows={20}
                        onChange={(e) => setPost({...post, description: e.target.value})}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default ModalAddPostContent;