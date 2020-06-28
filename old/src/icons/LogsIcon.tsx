import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const LogsIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 93.55 75">
      <defs>
        <clipPath id="ba30fd35-dedd-4d4c-8091-72a8bfcb12ee" transform="translate(0 0)">
          <path
            d="M13.12,42.73v5.11H42.38a28,28,0,0,1,1.23-5.11Zm0-13.73v5.11H48.36A28.16,28.16,0,0,1,53.71,29ZM67,61h6.85v6.82H67Zm-.78-16.33V35h8.4v9.68L72.21,57.07H68.57Zm-19,7.12A23.17,23.17,0,1,0,70.38,28.65,23.17,23.17,0,0,0,47.21,51.83M0,31.55a4.09,4.09,0,1,0,4.09-4.09A4.09,4.09,0,0,0,0,31.55M13.12,20.38H71.75V15.26H13.12Zm0-13.73H71.75V1.53H13.12ZM0,4.09A4.09,4.09,0,1,0,4.09,0,4.09,4.09,0,0,0,0,4.09"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <linearGradient
          id="a535a8d6-c821-40bc-91b6-0cd7bf3ec197"
          x1="-17.22"
          y1="97.81"
          x2="-16.22"
          y2="97.81"
          gradientTransform="matrix(0, -75, -75, 0, 7382.9, -1216.8)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#666" />
          <stop offset="1" stopColor="#d5dfe6" />
        </linearGradient>
      </defs>
      <g id="a8635014-cdf8-4e3b-b9a9-3452d47185f7" data-name="Layer 2">
        <g id="ace2a55b-6220-40e5-9e43-c4c9a00fe442" data-name="Layer 1">
          <g style={{ clipPath: 'url(#ba30fd35-dedd-4d4c-8091-72a8bfcb12ee)' }}>
            <rect width="93.55" height="75" style={{ fill: 'url(#a535a8d6-c821-40bc-91b6-0cd7bf3ec197)' }} />
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default LogsIcon;
