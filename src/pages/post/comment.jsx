import { useState } from "react";
import { useEffect } from "react"
import CommentForm from "./commentForm";
import parse from 'html-react-parser'

function Comment({ id }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
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
        getComments();
    }, [id, setComments])

    return (
        <>
            <h1>Comments</h1>
            <CommentForm id={id} setComments={setComments}/>
            <div className="grid w-full gap-5">
                {comments.map(comment => (
                    <div className="border-2 border-black" key={comment._id}>
                        <h3>{comment.name}</h3>
                        <h4>{comment.email}</h4>
                        <span>{comment.date}</span>
                        <p>{parse(comment.message)}</p>
                    </div>
                    
                ))}
            </div>
        </>
    )
}

export default Comment