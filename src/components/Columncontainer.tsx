import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, ID } from "../types";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  deleteColumn: (id: string) => void;
}

function ColumnContainer({ column, deleteColumn }: Props) { 
    
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
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

  if (isDragging) {
    return <div  ref={setNodeRef}
    style={style}
    className="
      bg-columnBackgroundColor
      opacity-60
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
    "></div>
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
            0
          </div>
          {column.title}
        </div>
        <button
           onClick={() => {
            console.log("Delete button clicked", column.id); // Debugging line
            deleteColumn(column.id);
          }}
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
        {/* Add dynamic content here */}
        <p>Content</p>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-sm text-gray-500">Footer</div>
    </div>
  );
}

export default ColumnContainer;
