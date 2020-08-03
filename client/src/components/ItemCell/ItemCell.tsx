import React, { useCallback, useState } from 'react';

interface IItemCellProps {
  imageUrl?: string | null;
  name: string | null;
}

export const ItemCell: React.FC<IItemCellProps> = ({ imageUrl, name }) => {
  const [imageVisible, setImageVisible] = useState(true);

  const handleImageError = useCallback(() => {
    setImageVisible(false);
  }, [setImageVisible]);

  return (
    <div className="item-cell">
      {imageUrl && <div>{imageVisible && <img src={imageUrl} alt={name || 'item image'} width={40} height={40} onError={handleImageError} />}</div>}
      {name}
    </div>
  );
};
