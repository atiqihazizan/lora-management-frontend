import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import  StateProvider  from "./context/StateContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StateProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </StateProvider>
    </QueryClientProvider>
  </StrictMode>
)
