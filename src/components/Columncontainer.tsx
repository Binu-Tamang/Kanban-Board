import TrashIcon from "../icons/TrashIcon";
import { Column } from "../types";

interface Props {
  column: Column;
  deleteColumn: (id: string) => void;
}

function Columncontainer({ column, deleteColumn }: ColumnProps) {
  return (
    <div
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
        className="mb-4
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
            0
          </div>
          {column.title}
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
      <div className="flex flex-grow bg-gray-100 rounded p-2">
        <p>Content</p>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-sm text-gray-500">Footer</div>
    </div>
  );
}

export default Columncontainer;
