import React, { FC, ReactNode } from "react";
import { Draggable, DraggableProps } from "react-beautiful-dnd";
import ReactTable from "react-table";
// import "react-table/react-table.css";

interface IXDrag extends Omit<DraggableProps, "children"> {
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
}

const XDrag: FC<IXDrag> = ({ className, children, dragAll, ...props }) => {
  console.log(React.isValidElement(children));
  // console.log(props);
  if (!React.isValidElement(children)) return <div />;
  // const child = React.memo(children, []);
  return (
    <Draggable {...props}>
      {(provided, snapshot) => {
        // const test = () => {
        //   console.log(snapshot.isDragging);
        // };
        const dragHandleProps = dragAll ? provided.dragHandleProps : {};
        return (
          <>
            <tr
              className={className}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...dragHandleProps}
            >
              {React.cloneElement(children, { provided })}
              {/* {children, {provided}} */}
              {/* {provided.placeholder} */}
              {/* {children} */}
            </tr>
            <tr
              style={{
                display: snapshot.isDragging ? "table-row" : "none",
                backgroundColor: snapshot.isDragging ? "blue" : "none",
              }}
            >
              {React.cloneElement(children, { provided })}
            </tr>
          </>
        );
      }}
    </Draggable>
  );
};

XDrag.defaultProps = {
  dragAll: true,
};

export default React.memo(XDrag);

// class PureFatherWrapper extends React.PureComponent {
//   render() {
//     return (
//       <PureFather>
//         <SomeChild />
//       </PureFather>
//     );
//   }
// }
// {
//   /* <div
// className={className}
// ref={provided.innerRef}
// {...provided.draggableProps}
// {...dragHandleProps}
// >
// {React.cloneElement(children, { provided })}
// </div> */
// }
