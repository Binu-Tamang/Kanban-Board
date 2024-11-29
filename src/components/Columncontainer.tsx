import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import TaaskCard from "./TaaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: string) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function ColumnContainer(props: Props) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(column.title);

  // Memoize the task IDs to avoid unnecessary re-renders
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  // DnD Kit Sortable setup
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  // Style for drag-and-drop transition
  const style = {
    transition,
    transform: transform ? CSS.Transform.toString(transform) : undefined,
  };

  // Handle title submission for editing
  const handleTitleSubmit = () => {
    setEditMode(false);
    if (title.trim() && title.trim() !== column.title) {
      updateColumn(column.id, title.trim());
    }
  };

  // Simplify dragging state UI
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor opacity-40 border-2 border-rose-500 w-[350px] h-[500px] rounded-md shadow-md"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] rounded-md flex flex-col p-4 shadow-md"
    >
      {/* Title */}
      <div
        {...attributes}
        {...listeners}
        className="mb-4 bg-columnBackgroundColor text-md h-[60px] cursor-grab rounded-md p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2 items-center">
          <div className="bg-columnBackgroundColor px-2 py-1 text-sm">
            {tasks.length}
          </div>
          {!editMode ? (
            <span
              onClick={() => setEditMode(true)}
              className="cursor-pointer hover:text-rose-500"
            >
              {title}
            </span>
          ) : (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit();
              }}
              className="bg-black focus:border-rose-500 border rounded outline-none px-2 text-white"
              autoFocus
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          aria-label="Delete column"
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-2 py-1"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Task Container */}
      <div className="flex flex-grow flex-col gap-2 overflow-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Footer */}
      <button
        onClick={() => createTask(column.id)}
        className="mt-4 flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}

export default ColumnContainer;
