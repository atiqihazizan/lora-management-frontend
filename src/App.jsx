import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { RouterProvider } from "react-router";
import { useStateContext } from "./utils/useContexts";
import routers from "./Routers";

function App() {
  const { tilesLoading } = useStateContext();

  if (tilesLoading) return <></>
  return (
    <RouterProvider router={routers} />
  );
}

export default App;
