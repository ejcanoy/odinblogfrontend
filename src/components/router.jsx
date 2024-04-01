import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home/home";
import BlogDashboard from "../pages/blogdashboard/blogdashboard";
import Post from "../pages/post/post";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/blogdashboard",
            element: <BlogDashboard />
        },
        {
            path:"/post/:postID",
            element: <Post/>
        }
    ])

    return <RouterProvider router={router}/>
}

export default Router;