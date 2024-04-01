import { useEffect, useState } from "react";
import { useParams, Link} from "react-router-dom";
import parse from 'html-react-parser'
import Comment from "./comment";

function Post() {
    const { postID } = useParams();

    return (
        <>
            <Link className="border-2 border-black" to="/">Back</Link>
            <PostInformation id={postID} />
            <Comment id={postID}/>
        </>
    )
}

function PostInformation({ id }) {
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            console.log(id);
            try {
                const response = await fetch(`http://localhost:3000/post/${id}`, { mode: 'cors' });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPostData(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        }
        fetchPost();
    }, [id, setPostData]);

    return (
        <>
            {postData && (
                <div>
                    <h1 className="text-5xl">{postData.title}</h1>
                    <div>{parse(postData.message)}</div>
                </div>
            )}
        </>
    )


}

export default Post;
