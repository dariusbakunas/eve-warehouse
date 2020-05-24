import React from "react";

interface IAvatar {
  alt?: string;
  src?: string;
}

export const Avatar: React.FC<IAvatar> = ({ src, alt }) => {
  return <div className="avatar-component">{src && <img alt={alt} src={src} />}</div>;
};
