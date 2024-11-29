import "./App.css";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  return (
    <div className="m-auto flex justify-center items-center gap-3 min-h-screen w-full">
  <div>
    <h1 className="text-3xl font-bold text-center text-rose-500 p-4 m-auto w-full items-center">
    Drag-and-Drop Kanban Board
    </h1>
    <KanbanBoard />
  </div>
</div>

  );
}

export default App;
