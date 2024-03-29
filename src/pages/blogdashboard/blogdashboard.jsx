import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import parse from 'html-react-parser'




function BlogDashboard() {
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDate, setModalDate] = useState("");
    const [deleteArticleID, setDeleteArticleID] = useState(null);

    const [newArticleTitle, setNewArticleTitle] = useState("");
    const [publish, setPublish] = useState(false);
    const [articleMessage, setArticleMessage] = useState("");
    const editorRef = useRef(null);


    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        try {
            // replace the url to env
            const response = await fetch('http://localhost:3000/post', { mode: 'cors' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function createPost(message) {
        const body = JSON.stringify({
            title: newArticleTitle,
            message: message,
            published: publish,
        });

        try {
            const response = await fetch('http://localhost:3000/post/', {
                mode: 'cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    async function updatePost(updatedMessage) {
        const body = {};
        if (newArticleTitle !== "") {
            body.title = newArticleTitle
        }

        body.message = updatedMessage;

        body.published = publish;
        try {
            const response = await fetch(`http://localhost:3000/post/${deleteArticleID}`,
                {
                    mode: 'cors',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            )
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error updating the post', error);
        }
    }

    function clearFields() {
        setNewArticleTitle("");
        setPublish(false);
        setArticleMessage("");
        setDeleteArticleID(null);
    }

    async function log() {
        if (editorRef.current) {
            try {
                if (!deleteArticleID) {
                    await createPost(editorRef.current.getContent());
                } else {
                    await updatePost(editorRef.current.getContent());
                }
                clearFields();
                await fetchData();
                setNewArticle(false);

            } catch (error) {
                console.error('Error posting data:', error);
            }
        } else {
            alert("Enter text into message box")
        }
    }

    async function deletePost(_id) {
        try {
            const response = await fetch(`http://localhost:3000/post/${_id}`, {
                mode: 'cors',
                method: 'DELETE'
            })
            alert("Post Deleted");
            console.log(response);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }

    async function handleConfirmClick(id) {
        setShowModal(false)
        await deletePost(id);
        await fetchData();
    }

    function handleDeleteClick(title, id, date) {
        setDeleteArticleID(id);
        setModalTitle(title);
        setModalDate(date)
        setShowModal(true);
    }

    function handleEditClick(title, id, published, message){
        setNewArticleTitle(title);
        setDeleteArticleID(id);
        setArticleMessage(message);
        setNewArticle(true);
        setPublish(published);
    }

    return (
        <>
            <Link className="border-2 border-black" to="/">Home</ Link>
            <h1>BlogDashboard</h1>
            <div className="flex justify-center">
                {!newArticle &&
                    <button className="border-2 border-black" onClick={() => setNewArticle(true)}>Create new article</button>
                }
                {newArticle &&
                    <button className="border-2 border-black" onClick={() => setNewArticle(false)}>Back</button>
                }
            </div>
            {
                newArticle &&
                <div className="grid justify-center m-16 gap-5">
                    <>
                        <div>
                            <h3>title</h3>
                            <input className="border-black border-2" type="text" value={newArticleTitle} onChange={(event) => setNewArticleTitle(event.target.value)} />
                            <h3>publish</h3>
                            <input
                                type="checkbox"
                                checked={publish}
                                onChange={(event) => setPublish(event.target.checked)}
                            />
                        </div>
                        <div>
                            <Editor
                                apiKey='6cep4bxq01fphrkscjzsbh6mnimta7n2f2f7ntupjmsgsiq5'
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={articleMessage === "" ? "<p></p>" : `${articleMessage}`}
                                init={{
                                    height: 500,
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
                    </>

                </div>

            }
            {!newArticle &&
                <div className="flex flex-wrap justify-between m-16 gap-5">
                    {/* make its own CARD */}
                    {articles.map(article => (
                        <div className="w-[300px]  border-2 border-black" key={article._id}>
                            <h2>{article.title}</h2>
                            <div>
                                {parse(article.message)}
                            </div>
                            <p>Date: {article.date}</p>
                            {article.published ? <p>Published</p> : <p>Not published</p>}
                            <div className="flex justify-end gap-2 ml-1">
                                <button className="border-2 border-green-900" type="button" onClick={() => handleEditClick(article.title, article._id, article.published, article.message)}>edit</button>
                                <button
                                    className="border-red-800 border-2"
                                    type="button"
                                    onClick={() => handleDeleteClick(article.title, article._id, article.date)}
                                >
                                    delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>


            }

            {showModal ? (
                <>

                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Delete Article Below?
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                        Title: {modalTitle}
                                        <br />
                                        Date: {modalDate}
                                    </p>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => handleConfirmClick(deleteArticleID)}
                                    >
                                        Confirm Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    )
}

export default BlogDashboard