export const getItemImageUrl = (itemId: string, itemName: string) => {
  if (itemName.toLocaleLowerCase().includes('blueprint')) {
    return `https://images.evetech.net/types/${itemId}/bp`;
  } else {
    return `https://images.evetech.net/types/${itemId}/icon`;
  }
};
