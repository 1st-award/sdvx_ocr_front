import { Navigate, useRoutes } from "react-router-dom";
/* Layouts */
import DefaultLayout from "./layouts/DefaultLayout";
/* Pages */
import ResultTable from "./pages/ResultTable";
import UploadForm from "./pages/UploadForm";
import Page404 from "./pages/Page404";

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        { element: <Navigate to="/camera" />, index: true },
        { path: "camera", element: <UploadForm /> },
        { path: "rank", element: <ResultTable /> },
      ],
    },
    {
      path: "/404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);
  return routes;
}
