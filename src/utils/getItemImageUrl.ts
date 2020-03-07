export const getItemImageUrl = (itemId: string, itemName: string, bpCopy?: boolean) => {
  if (itemName.toLocaleLowerCase().includes('blueprint')) {
    return bpCopy ? `https://images.evetech.net/types/${itemId}/bpc` : `https://images.evetech.net/types/${itemId}/bp`;
  } else {
    return `https://images.evetech.net/types/${itemId}/icon`;
  }
};
