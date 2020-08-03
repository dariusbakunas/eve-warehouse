import clsx from 'clsx';
import React from 'react';

interface IAvatar {
  className?: string;
  alt?: string;
  src?: string;
}

export const Avatar: React.FC<IAvatar> = ({ src, alt, className }) => {
  const classes = clsx('avatar-component', className);
  return <div className={classes}>{src && <img alt={alt} src={src} />}</div>;
};
