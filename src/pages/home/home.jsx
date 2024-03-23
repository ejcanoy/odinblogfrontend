import { useEffect, useState } from "react";

function Home() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:3000/post', { mode: 'cors' });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                const publishedArticles = data.filter((article) => article.published);
                setArticles(publishedArticles);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [])


    return (
        <>
            <h1>Home</h1>
            <div className="flex flex-wrap justify-between m-16 gap-5">
                {/* make its own CARD */}
                {articles.map(article => (
                    <button className="w-[300px]  border-2 border-black" key={article._id}>
                        <h2>{article.title}</h2>
                        <p>{article.message}</p>
                        <p>Date: {article.date}</p>
                    </button>
                ))}
            </div>
        </>
    )
}

export default Home