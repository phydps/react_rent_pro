import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import RentLayout from "@/pages/Layout";
import News from "@/pages/News";
import HouseList from "@/pages/List";
import Profile from "@/pages/Profile";
import CityList from "@/pages/CityList";
import Map from "@/pages/Map";
import Login from "@/pages/Login/index";
import Detail from "@/pages/HouseDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RentLayout />,
    children: [
      {
        // path: "/home",
        index: true,
        element: <Home />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/list",
        element: <HouseList />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/citylist",
    element: <CityList />,
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/detail/:id",
    element: <Detail />,
  },
]);

export default router;
