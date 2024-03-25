import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home/home";
import BlogDashboard from "../pages/blogdashboard/blogdashboard";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/blogdashboard",
            element: <BlogDashboard />
        }
    ])

    return <RouterProvider router={router}/>
}

export default Router;