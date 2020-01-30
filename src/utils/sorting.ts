export const alphaSort = <T extends {}>(getter: (obj: T) => string) => {
  return (a: T, b: T) => {
    const aStr = getter(a);
    const bStr = getter(b);
    return aStr.localeCompare(bStr);
  };
};
