/* eslint-disable react/display-name */
import React from "react";

const Search = React.forwardRef<HTMLInputElement>((props, ref) => {
  return <input ref={ref} type="search" />;
});

export default Search;
