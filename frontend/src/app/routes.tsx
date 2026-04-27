import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import MapHome from "./pages/MapHome";
import CatDetail from "./pages/CatDetail";
import CheckIn from "./pages/CheckIn";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: MapHome },
      { path: "cat/:id", Component: CatDetail },
      { path: "checkin", Component: CheckIn },
      { path: "profile", Component: UserProfile },
    ],
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  }
]);
