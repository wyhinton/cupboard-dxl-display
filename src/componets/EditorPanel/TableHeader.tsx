import React, { useState } from "react";

/**
 * Wraps an Evergreen UI Button.
 * @component
 */
const TableHeader = ({
  title,
  onClick,
}: {
  title: string;
  onClick?: () => void;
}): JSX.Element => {
  return <th onClick={onClick}>{title}</th>;
};

export default TableHeader;
