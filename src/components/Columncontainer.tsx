import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TaaskCard from "./TaaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: string) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask } = props;
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(column.title);

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

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleTitleSubmit = () => {
    setEditMode(false);
    if (title.trim() !== column.title) {
      updateColumn(column.id, title.trim());
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          bg-columnBackgroundColor
          opacity-40
          border-2
          border-rose-500
          w-[350px]
          h-[500px]
          min-h-[500px]
          rounded-md
          flex
          flex-col
          p-4
          shadow-md
        "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-columnBackgroundColor
        w-[350px]
        h-[500px]
        min-h-[500px]
        rounded-md
        flex
        flex-col
        p-4
        shadow-md
      "
    >
      {/* Title */}
      <div
        {...attributes}
        {...listeners}
        className="
          mb-4
          bg-columnBackgroundColor
          text-md
          h-[60px]
          cursor-grab
          rounded-md
          rounded-b-none
          p-3
          font-bold
          border-columnBackgroundColor
          border-4
          flex
          items-center
          justify-between
        "
      >
        <div className="flex gap-2">
          <div
            className="
              flex
              justify-center
              items-center
              bg-columnBackgroundColor
              px-2
              py-1
              text-sm
            "
          >
            {tasks.length}
          </div>
          {!editMode ? (
            <span onClick={() => setEditMode(true)}>{title}</span>
          ) : (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit();
              }}
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              autoFocus
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="
            stroke-gray-500
            hover:stroke-white
            hover:bg-columnBackgroundColor
            rounded
            px-1
            py-2
          "
        >
          <TrashIcon />
        </button>
      </div>

      {/* Task Container */}
      <div className="flex flex-grow flex-col gap-2 overflow-auto">
        {tasks.map((task) => (
          <TaaskCard key={task.id} task={task} deleteTask={deleteTask} />
        ))}
      </div>

      {/* Footer */}
      <button
        className="
          mt-4
          flex
          gap-2
          items-center
          border-columnBackgroundColor
          border-2
          rounded-md
          p-4
          hover:bg-mainBackgroundColor
          hover:text-rose-500
          active:bg-black
        "
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}

export default ColumnContainer;
