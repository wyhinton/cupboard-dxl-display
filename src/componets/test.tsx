import React, { FC, ReactNode } from "react";
import { Draggable, DraggableProps } from "react-beautiful-dnd";

interface IXDrag extends Omit<DraggableProps, "children"> {
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
}

const XDrag: FC<IXDrag> = ({ className, children, dragAll, ...props }) => {
  console.log(React.isValidElement(children));
  if (!React.isValidElement(children)) return <div />;
  return (
    <Draggable {...props}>
      {(provided, snapshot) => {
        const dragHandleProps = dragAll ? provided.dragHandleProps : {};
        return (
          <tr
            className={className}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...dragHandleProps}
          >
            {React.cloneElement(children, { provided })}
          </tr>
        );
      }}
    </Draggable>
  );
};

XDrag.defaultProps = {
  dragAll: true,
};

export default React.memo(XDrag);
