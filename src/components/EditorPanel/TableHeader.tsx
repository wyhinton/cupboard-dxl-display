import React, { useState, useEffect } from "react";
import { toTitleCase } from "../../utils";
/**
 * Wraps an Evergreen UI Button.
 * @component
 */
const TableHeader = ({
  propName,
  setFilter,
  setFilterDirection,
  className,
  activeFilter,
}: {
  propName: string;
  setFilterDirection: (dir: boolean) => void;
  setFilter: (str: string) => void;
  className?: string;
  activeFilter: string | undefined;
}): JSX.Element => {
  const [sortDirection, setSortDirection] = useState(true);
  const [sortVisibility, setSortVisibility] = useState(false);
  const title = toTitleCase(propName);
  useEffect(() => {
    propName === activeFilter
      ? setSortVisibility(true)
      : setSortVisibility(false);
  }, [activeFilter]);
  return (
    <th
      className={className ?? "editor-panel-table-header"}
      onClick={() => {
        setFilter(propName);
        setSortDirection(!sortDirection);
        setFilterDirection(sortDirection);
      }}
    >
      {title}
      {sortVisibility && sortDirection
        ? "▲"
        : sortVisibility && !sortDirection
        ? "▼"
        : ""}
    </th>
  );
};

export default TableHeader;
// ▲▲▲
// ▼▼▼

enum SortState {
  UP = "UP",
  DOWN = "DOWN",
  OFF = "OFF",
}
