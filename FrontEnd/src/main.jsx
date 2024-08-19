import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./component/Context/Context.jsx";

// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "./component/Login/Login.jsx";
// import Error from "./component/Error/Error.jsx";
// import React, { Profiler } from "react"; // Import the 'React' package
// import HomePage from "./component/HomePage/HomePage.jsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     // errorElement: <Error />
//   },
//   {
//     path: "/login",
//     element: <Login />
//   }
//   ,
//   {
//     path: "/page404",
//     element: <Error />
//   }
//   ,
//   {
//     path: "/home",
//     element: <HomePage />
//   }
//   ,
//   {
//     path: "/profil",
//     element: <Profiler />
//   }
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
   <BrowserRouter>
    <ContextProvider>
    {/* <RouterProvider router={router} /> */}
    <App />
    </ContextProvider>
   </BrowserRouter>
);

// {/* <BrowserRouter> */}
// {/* <ContextProvider> */}
// // <App />
// {/* </ContextProvider> */}
// //  </BrowserRouter>
