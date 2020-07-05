export const removeAtIndex = (array: Array<any>, index: number) => {
  const result = array.slice();
  result.splice(index, 1);
  return result;
};
