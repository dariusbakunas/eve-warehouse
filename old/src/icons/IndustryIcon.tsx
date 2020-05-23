import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const IndustryIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 70.08 70">
      <defs>
        <clipPath id="b65795ad-9392-477a-a95c-ca09a2c10616">
          <path
            d="M64.68,34.8V27.43L43.11,34.8V27.43L21.53,34.8,18.24,0H8.69L5.4,34.8,0,40.2V70H70.08V40.2Zm-13,25.38H44.84V44.61h6.82Zm11.67,0H56.52V44.61h6.81Z"
            style={{ fill: 'none' }}
            clipRule="evenodd"
          />
        </clipPath>
        <linearGradient
          id="b91100cb-7b96-48e1-a289-29b11b9d66e9"
          x1="-28.53"
          y1="99"
          x2="-27.53"
          y2="99"
          gradientTransform="matrix(0, -70, -70, 0, 6965.11, -1927.45)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#666" />
          <stop offset="1" stopColor="#d5dfe6" />
        </linearGradient>
      </defs>
      <g id="b0867a8c-bf03-4503-a0f1-44f06ab0e7c4" data-name="Layer 2">
        <g id="e28e21f7-5443-4948-b533-e477b9479aa9" data-name="Layer 1">
          <g style={{ clipPath: 'url(#b65795ad-9392-477a-a95c-ca09a2c10616)' }}>
            <rect width="70.08" height="70" style={{ fill: 'url(#b91100cb-7b96-48e1-a289-29b11b9d66e9)' }} />
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default IndustryIcon;
