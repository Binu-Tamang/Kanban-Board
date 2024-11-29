import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from './ColumnContainer';  

import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

interface Column {
  id: string;
  title: string;
}

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  function createNewColumns() {
    const columnToAdd: Column = {
      id: uuidv4(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns((prevColumns) => [...prevColumns, columnToAdd]);
  }

  function deleteColumn(id: string) {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.id !== id)
    );
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      // Use arrayMove to reorder the columns array
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-2">
          <div className="flex gap-4">
            <SortableContext items={columns.map((column) => column.id)}>
              {columns.map((column) => (
                <ColumnContainer
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
            <ColumnContainer
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
