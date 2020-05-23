import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const ShipsIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 74.55 80">
      <defs>
        <clipPath id="e1c77802-d000-41f4-bc65-04f5cbde1830" transform="translate(0 0)">
          <polygon
            points="72.28 52.48 72.28 58.49 69.6 58.49 69.6 46.49 69.6 43.83 66.95 46.49 66.92 46.49 66.92 58.49 63.57 61.84 63.57 64.41 54.9 61.48 54.9 58.25 48.22 54.32 48.22 41.96 49.77 36.17 49.77 23.89 51.61 16.97 51.61 1.13 45.26 0 38.91 1.13 38.91 16.97 42.3 45.15 42.3 61.07 37.28 56.74 32.25 61.07 32.25 45.15 35.64 16.97 35.64 1.13 29.29 0 22.93 1.13 22.93 16.97 24.78 23.89 24.78 36.17 26.33 41.97 26.33 54.32 19.64 58.25 19.64 61.48 10.98 64.41 10.98 61.84 7.63 58.49 7.63 46.49 7.6 46.49 4.94 43.83 4.94 46.49 4.94 58.49 2.26 58.49 2.26 52.48 0 50.21 0 52.48 0 75.61 2.26 77.87 2.26 73.46 4.41 73.46 5.72 73.46 27.84 76.87 27.84 73.46 30.76 73.46 31.41 73.46 31.41 76.48 37.28 80 43.13 76.48 43.13 73.46 43.78 73.46 46.7 73.46 46.7 76.87 68.83 73.46 70.14 73.46 72.28 73.46 72.28 77.87 74.55 75.61 74.55 52.48 74.55 50.21 72.28 52.48"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <linearGradient
          id="ed46f28e-f3ec-4e13-8896-dfc3194acf7f"
          x1="-26.73"
          y1="103"
          x2="-25.73"
          y2="103"
          gradientTransform="matrix(0, -80, -80, 0, 8277.27, -2058.16)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#666" />
          <stop offset="1" stopColor="#d5dfe6" />
        </linearGradient>
      </defs>
      <title>Asset 1</title>
      <g id="ba5028f7-7b2f-4ea4-ac1d-2c630ad4f5a0" data-name="Layer 2">
        <g id="bc185707-16e6-4b9b-9f2a-725292223e56" data-name="Layer 1">
          <g style={{ clipPath: 'url(#e1c77802-d000-41f4-bc65-04f5cbde1830)' }}>
            <rect width="74.55" height="80" style={{ fill: 'url(#ed46f28e-f3ec-4e13-8896-dfc3194acf7f)' }} />
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default ShipsIcon;
