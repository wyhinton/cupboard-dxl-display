import React, { useState } from "react";

import { toTitleCase } from "../../utils";
/**
 * <th> component with a arrow indicating the filter direction
 */
const TableHeader = ({
  headerTitle,
  setFilter,
  setFilterDirection,
  className,
  activeFilter,
}: {
  headerTitle: string;
  setFilterDirection: (direction: boolean) => void;
  setFilter: (filter: string) => void;
  className?: string;
  activeFilter: string | undefined;
}): JSX.Element => {

  const [sortDirection, setSortDirection] = useState(true);

  const showSortArrow =  headerTitle === activeFilter

  return (
    <th
      className={className ?? "editor-panel-table-header"}
      onClick={() => {
        setFilter(headerTitle);
        setSortDirection(!sortDirection);
        setFilterDirection(sortDirection);
      }}
    >
      {toTitleCase(headerTitle)}
      {showSortArrow && sortDirection
        ? "▲"
        : showSortArrow && !sortDirection
        ? "▼"
        : ""}
    </th>
  );
};

export default TableHeader;

