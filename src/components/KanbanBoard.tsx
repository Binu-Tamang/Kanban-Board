import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PlusIcon from "../icons/PlusIcon";
import Columncontainer from "./Columncontainer";

interface Column {
  id: string;
  title: string;
}

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);

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

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <div className="m-auto flex gap-2">
        <div className="flex gap-4">
          {columns.map((column) => (
            <Columncontainer key={column.id} column={column} deleteColumn={deleteColumn} />
          ))}
        </div>
        <button
          onClick={createNewColumns}
          className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          aria-label="Add a new column"
        >
          <PlusIcon /> Add Columns
        </button>
      </div>
    </div>
  );
}

export default KanbanBoard;
