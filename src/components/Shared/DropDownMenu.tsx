import type { SelectMenuItem } from "evergreen-ui";
import { Button, Position, SelectMenu } from "evergreen-ui";
import React, { useState } from "react";

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
        hasFilter={false}
        hasTitle={false}
        height={180}
        onSelect={(item) => {
          onSelect(item);
          setValue(item.label);
        }}
        options={items}
        position={Position.TOP}
        selected={value}
        width={180}
      >
        <Button>{value}</Button>
      </SelectMenu>
    </div>
  );
};

export default DropDownMenu;

