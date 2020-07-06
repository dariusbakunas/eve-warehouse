import React from 'react';

interface IItemCellProps {
  imageUrl?: string | null;
  name: string | null;
}

export const ItemCell: React.FC<IItemCellProps> = ({ imageUrl, name }) => {
  return (
    <div className="item-cell">
      {imageUrl && (
        <div>
          <img src={imageUrl} alt={name || 'item image'} width={40} height={40} />
        </div>
      )}
      {name}
    </div>
  );
};
