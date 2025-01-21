import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { RouterProvider } from "react-router";
import { MqttProvider } from "./context/MqttContext";
import { useStateContext } from "./context/StateContext";
import routers from "./Routers";

function App() {
  const { tilesLoading } = useStateContext();

  if (tilesLoading) return <></>
  return (
    <MqttProvider>
      <RouterProvider router={routers} />
    </MqttProvider>
  );
}

export default App;
