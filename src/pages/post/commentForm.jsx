import { Editor } from '@tinymce/tinymce-react';
import { useState, useRef } from "react";

function CommentForm({id, setComments}) {
    const [name, setName] = useState("");
    const [email,setEmail] = useState("");

    const editorRef = useRef(null);

    async function log() {
        if (editorRef.current) {
            try {
                await saveComment(editorRef.current.getContent());
                clearFields();
                await getComments();
            } catch (error) {
                console.error('Error posting data:', error);
            }
        } else {
            alert("Enter text into message box")
        }
    }

    async function getComments() {
        try {
            const response = await fetch(`http://localhost:3000/comment/${id}`, {mode: 'cors'});
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setComments(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function clearFields() {
        setName("");
        setEmail("");
    }

    async function saveComment(message) {
        const body = {
            name: name,
            email: email,
            message: message,
            postID: id
        }
        console.log(body)

        try {
            // get comments using the id from the post
            const response = await fetch(`http://localhost:3000/comment`,
            {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } 

    return (
        <>
            <div className="border-2 border-black grid">
                <label htmlFor="" >name</label>
                <input type="text" value={name} onChange={(event) => setName(event.target.value)} className='border-2 border-black'/>

                <label htmlFor="">email</label>
                <input type="text"  value={email} onChange={(event) => setEmail(event.target.value)} className='border-2 border-black'/>

                <div>
                            <Editor
                                apiKey='6cep4bxq01fphrkscjzsbh6mnimta7n2f2f7ntupjmsgsiq5'
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={"<p></p>"}
                                init={{
                                    height: 200,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                            <button className="border-2 border-black" onClick={log}>Save Post</button>
                        </div>
            </div>
        </>
    )
}

export default CommentForm