import React, { useState } from "react";
import { SelectMenu, Position, Button, SelectMenuItem } from "evergreen-ui";

// export interface SelectMenuItem {
//   label: string
//   value: string | number
//   labelInList?: string
//   disabled?: boolean
// }
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
  items: SelectMenuItem[];
}): JSX.Element => {
  const [value, setValue] = useState(items[0]?.label);

  return (
    <div>
      {`${title}: `}
      <SelectMenu
        height={180}
        width={180}
        hasTitle={false}
        hasFilter={false}
        position={Position.TOP}
        options={items}
        selected={value}
        onSelect={(item) => {
          onSelect(item);
          setValue(item.label);
        }}
      >
        <Button>{value}</Button>
      </SelectMenu>
    </div>
  );
};

export default DropDownMenu;

