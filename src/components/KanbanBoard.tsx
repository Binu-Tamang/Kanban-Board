import {
    DndContext,
    DragEndEvent,
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
  import ColumnContainer from "./ColumnContainer";
  
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
  
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
      })
    );
  
    const createTask = (columnId: string) => {
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
  
    const createNewColumn = () => {
      const newColumn: Column = {
        id: uuidv4(),
        title: `Column ${columns.length + 1}`,
      };
      setColumns((prevColumns) => [...prevColumns, newColumn]);
    };
  
    const deleteColumn = (id: string) => {
      setColumns((prevColumns) =>
        prevColumns.filter((column) => column.id !== id)
      );
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
      const column = event.active.data.current?.column;
      if (column?.id) {
        setActiveColumn(column);
      }
    };
  
    const onDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
  
      if (!over) return;
  
      const activeColumnId = active.id;
      const overColumnId = over.id;
  
      if (activeColumnId === overColumnId) return;
  
      setColumns((prevColumns) => {
        const activeIndex = prevColumns.findIndex(
          (col) => col.id === activeColumnId
        );
        const overIndex = prevColumns.findIndex((col) => col.id === overColumnId);
  
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
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
            </SortableContext>
            <button
              onClick={createNewColumn}
              className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2 items-center justify-center"
              aria-label="Add a new column"
            >
              <PlusIcon /> Add Column
            </button>
          </div>
  
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <div className="opacity-70">
                  <ColumnContainer
                    column={activeColumn}
                    deleteColumn={() => {}}
                    updateColumn={() => {}}
                    createTask={() => {}}
                    deleteTask={deleteTask}
                    tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                  />
                </div>
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    );
  }
  
  export default KanbanBoard;
  