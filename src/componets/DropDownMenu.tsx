import React, { useState } from "react";
import {
  SelectMenu,
  Position,
  Button,
  SelectField,
  SelectMenuItem,
} from "evergreen-ui";
// import Button from "./Button";
// import Button from 'evergreen-ui';
/**
 * Wraps an Evergreen UI DropDownMenu.
 * @component
 */
const DropDownMenu = ({
  onSelect,
  title,
  items,
}: {
  onSelect: (item: SelectMenuItem) => void;
  title: string;
  items: string[];
}): JSX.Element => {
  const [selected, setSelected] = useState(false);
  const [value, setValue] = useState(items[0]);
  return (
    <div>
      {`${title}: `}
      <SelectMenu
        height={180}
        width={180}
        hasTitle={false}
        hasFilter={false}
        position={Position.TOP}
        options={items.map((label) => ({ label, value: label }))}
        selected={value}
        onSelect={(item) => {
          onSelect(item);
          setValue(item.label);
        }}
        // onSelect={(item) => setValue(item.label)}
      >
        <Button>{value}</Button>
      </SelectMenu>
    </div>
  );
};

export default DropDownMenu;
