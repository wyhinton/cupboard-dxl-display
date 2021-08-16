import React, { useState } from "react";

/**
 * Wraps an Evergreen UI Button.
 * @component
 */
const TableHeader = ({
  title,
  onClick,
  className,
}: {
  title: string;
  onClick?: () => void;
  className?: string;
}): JSX.Element => {
  return (
    <th className={className ?? "editor-panel-table-header"} onClick={onClick}>
      {title}
    </th>
  );
};

export default TableHeader;
