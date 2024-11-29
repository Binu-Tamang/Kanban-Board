import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "../components/Columncontainer";
import TaskCard from "../components/TaaskCard"; // Fixed typo

interface Task {
  id: string;
  columnId: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
}

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const createTask = (columnId: string) => {
    if (!columnId) return; // Ensure valid columnId
    const newTask: Task = {
      id: uuidv4(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, content: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, content } : task))
    );
  };

  const createNewColumn = () => {
    const newColumn: Column = {
      id: uuidv4(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns((prevColumns) => [...prevColumns, newColumn]);
  };

  const deleteColumn = (id: string) => {
    setColumns((prevColumns) => prevColumns.filter((column) => column.id !== id));
  
    setTasks((prevTasks) => prevTasks.filter((task) => task.columnId !== id));
  };
  

  const updateColumn = (id: string, title: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === id ? { ...column, title } : column
      )
    );
  };

  const onDragStart = (event: DragStartEvent) => {
    const column = event.active.data.current?.column as Column | undefined;
    if (column) {
      setActiveColumn(column);
    }

    const task = event.active.data.current?.task as Task | undefined;
    if (task) {
      setActiveTask(task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping task over another task
    if (isActiveATask && isOverATask) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
        const overIndex = prevTasks.findIndex((t) => t.id === overId);

        // If the column IDs differ, update the column ID for the active task
        if (prevTasks[activeIndex].columnId !== prevTasks[overIndex].columnId) {
          const updatedTasks = [...prevTasks];
          updatedTasks[activeIndex] = {
            ...updatedTasks[activeIndex],
            columnId: prevTasks[overIndex].columnId,
          };

          // Reorder the tasks within the new column
          return arrayMove(updatedTasks, activeIndex, overIndex);
        }

        // If column IDs are the same, simply reorder
        return arrayMove(prevTasks, activeIndex, overIndex);
      });
    }

    // Dropping a task over a column
    if (isActiveATask && !isOverATask) {
      // Ensure dropping over a column, not a task
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeId);

        // Find the columnId the task is being dropped onto
        const newColumnId = overId;

        // If the column IDs differ, update the column ID for the active task
        if (prevTasks[activeIndex].columnId !== newColumnId) {
          const updatedTasks = [...prevTasks];
          updatedTasks[activeIndex] = {
            ...updatedTasks[activeIndex],
            columnId: newColumnId, // Assign new column ID to the task
          };

          // Return the updated tasks without reordering
          return updatedTasks;
        }

        // If no column change, return tasks as is
        return prevTasks;
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setColumns((prevColumns) => {
      const activeIndex = prevColumns.findIndex((col) => col.id === activeId);
      const overIndex = prevColumns.findIndex((col) => col.id === overId);

      return arrayMove(prevColumns, activeIndex, overIndex);
    });
    setActiveColumn(null);
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-2">
          <SortableContext items={columns.map((column) => column.id)}>
            {columns.map((column) => (
              <ColumnContainer
                key={column.id}
                column={column}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === column.id)}
              />
            ))}
          </SortableContext>
          <button
            onClick={createNewColumn}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-4 items-center justify-start"
            aria-label="Add a new column"
          >
            <PlusIcon /> Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn ? (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={() => {}}
                updateColumn={() => {}}
                createTask={() => {}}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            ) : null}
            {activeTask ? (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
