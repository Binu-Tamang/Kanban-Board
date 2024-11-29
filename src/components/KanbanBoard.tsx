import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import PlusIcon from "../icons/PlusIcon";
import Columncontainer from "./Columncontainer";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

interface Column {
  id: string;
  title: string;
}

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  function createNewColumns() {
    const columnToAdd: Column = {
      id: uuidv4(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: string) {
    const filteredColumns = columns.filter((column) => column.id !== id);
    setColumns(filteredColumns);
  }

  function onDragStart(event: DragStartEvent) {
    console.log("DRAGE START", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext onDragStart={onDragStart}>
        <div className="m-auto flex gap-2">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <Columncontainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumns}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
            aria-label="Add a new column"
          >
            <PlusIcon /> Add Columns
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Columncontainer
                column={activeColumn}
                deleteColumn={deleteColumn}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
