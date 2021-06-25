import React, { FC, ReactNode } from "react";
import { Draggable, DraggableProps } from "react-beautiful-dnd";

interface IXDrag extends Omit<DraggableProps, "children"> {
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
}

const XDrag: FC<IXDrag> = ({ className, children, dragAll, ...props }) => {
  console.log(React.isValidElement(children));
  console.log(props);
  // console.log();
  // console.log(props.dragg);
  if (!React.isValidElement(children)) return <div />;
  return (
    <Draggable {...props}>
      {(provided, snapshot) => {
        const test = () => {
          console.log(snapshot.isDragging);
        };
        const dragHandleProps = dragAll ? provided.dragHandleProps : {};
        return (
          <div
            className={className}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...dragHandleProps}
          >
            {React.cloneElement(children, { provided })}
          </div>
        );
      }}
    </Draggable>
  );
};

XDrag.defaultProps = {
  dragAll: true,
};

export default XDrag;

{
  /* <div
className={className}
ref={provided.innerRef}
{...provided.draggableProps}
{...dragHandleProps}
>
{React.cloneElement(children, { provided })}
</div> */
}
