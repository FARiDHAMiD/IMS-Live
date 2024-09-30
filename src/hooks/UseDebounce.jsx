import React, { useEffect, useState } from "react";

const UseDebounce = (val, delay) => {
  const [debounceVal, setDebounceVal] = useState(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(val);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [val]);

  return debounceVal;
};

export default UseDebounce;
