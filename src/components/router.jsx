import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "../pages/home/home";
import BlogDashboard from "../pages/blogdashboard/blogdashboard";
import Post from "../pages/post/post";
import Signup from "../pages/signup/signup";
import Login from "../pages/login/login";

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
        },
        {
            path:"/signup",
            element: <Signup />
        },
        {
            path:"/login",
            element: <Login />
        }
    ])

    return <RouterProvider router={router}/>
}

export default Router;