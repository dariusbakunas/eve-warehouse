import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const WarehouseIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 84.42 88.33">
      <defs>
        <clipPath id="a948c4ed-01d9-47ae-a2d2-9cf9a43e8a44" transform="translate(-21.79 -19.84)">
          <rect width="128" height="128" style={{ fill: 'none' }} />
        </clipPath>
        <clipPath id="adc75d15-3757-4201-97c1-260cb140a669" transform="translate(-21.79 -19.84)">
          <rect x="21.79" y="19.84" width="70.8" height="88.33" style={{ fill: 'none' }} />
        </clipPath>
        <clipPath id="b030106e-a382-4e39-93b5-8e354e979826" transform="translate(-21.79 -19.84)">
          <path
            d="M64,65.62V59.85l-17.32-10-17.27-10-5.06,2.92ZM92.59,36.35,64,19.84v5.77l11.8,6.81,11.79,6.81Zm-31.1,71.81L21.79,85.24v-36L61.49,72.2Z"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <linearGradient
          id="a4c2bb7d-b292-4f6c-995b-29c821e36005"
          y1="128"
          x2="1"
          y2="128"
          gradientTransform="matrix(0, -88.33, -88.33, 0, 11341.03, 88.33)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#666" />
          <stop offset="1" stopColor="#d5dfe6" />
        </linearGradient>
        <clipPath id="efa4cae1-25a1-41d5-adce-6d84d1815ed2" transform="translate(-21.79 -19.84)">
          <path
            d="M64,65.62V59.85l17.32-10,17.27-10,5,2.92ZM40.4,39.23l-5-2.88L64,19.84v5.77L52.2,32.42Zm26.11,33v36l39.7-22.92v-36Z"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <linearGradient
          id="a6ca1c52-a830-4433-b602-6f28e1006102"
          x1="0"
          y1="128"
          x2="1"
          y2="128"
          gradientTransform="matrix(0, -88.33, -88.33, 0, 11354.65, 88.33)"
          xlinkHref="#a4c2bb7d-b292-4f6c-995b-29c821e36005"
        />
      </defs>
      <g style={{ clipPath: 'url(#a948c4ed-01d9-47ae-a2d2-9cf9a43e8a44)' }}>
        <g style={{ clipPath: 'url(#a948c4ed-01d9-47ae-a2d2-9cf9a43e8a44)' }}>
          <line x1="81.86" y1="22.89" x2="42.21" y2="45.78" style={{ fill: '#fff' }} />
          <line x1="13.62" y1="16.51" x2="42.21" style={{ fill: '#fff' }} />
          <g style={{ clipPath: 'url(#a948c4ed-01d9-47ae-a2d2-9cf9a43e8a44)' }}>
            <g style={{ opacity: 0.5 }}>
              <g style={{ clipPath: 'url(#adc75d15-3757-4201-97c1-260cb140a669)' }}>
                <g style={{ clipPath: 'url(#b030106e-a382-4e39-93b5-8e354e979826)' }}>
                  <rect width="70.8" height="88.33" style={{ fill: 'url(#a4c2bb7d-b292-4f6c-995b-29c821e36005)' }} />
                </g>
              </g>
            </g>
          </g>
          <g style={{ clipPath: 'url(#efa4cae1-25a1-41d5-adce-6d84d1815ed2)' }}>
            <rect x="13.62" width="70.8" height="88.33" style={{ fill: 'url(#a6ca1c52-a830-4433-b602-6f28e1006102)' }} />
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default WarehouseIcon;
