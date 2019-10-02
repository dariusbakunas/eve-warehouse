import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const CharactersIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 110.25 131.56">
      <defs>
        <clipPath
          id="bffbd91f-2356-4f15-82d3-c181ae961a2f"
          transform="translate(-42.87 -31.43)"
        >
          <rect width="196" height="196" style={{ fill: 'none' }} />
        </clipPath>
        <clipPath
          id="ba15f342-7389-413b-b25c-f71c5b39633e"
          transform="translate(-42.87 -31.43)"
        >
          <rect
            x="42.88"
            y="31.43"
            width="110.25"
            height="119.19"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <clipPath
          id="e6a35ee6-2a7d-4e6d-9f47-775578d8491e"
          transform="translate(-42.87 -31.43)"
        >
          <polygon
            points="153.13 31.43 62.95 31.43 42.88 51.51 42.88 52.02 56.8 52.02 69.06 39.77 143.94 39.77 143.94 150.63 153.13 141.44 153.13 31.43"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <linearGradient
          id="b35d7314-fcdd-4fc3-89f2-54bdb6bf037f"
          x1="-2.32"
          y1="-0.44"
          x2="-0.78"
          y2="-0.44"
          gradientTransform="matrix(0, -77.84, -77.84, 0, 21.13, -61.07)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#666" />
          <stop offset="1" stopColor="#d5dfe6" />
        </linearGradient>
        <clipPath
          id="b9ea3dc7-9809-4a37-ac84-1cbee69a3936"
          transform="translate(-42.87 -31.43)"
        >
          <polygon
            points="56.8 52.02 42.88 52.02 42.88 163 131.57 163 131.57 52.02 56.8 52.02"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <linearGradient
          id="b7c070ae-6d22-4395-85ac-01aaf2dcf53d"
          x1="-2.55"
          y1="-0.42"
          x2="-1.02"
          y2="-0.42"
          gradientTransform="matrix(0, -72.48, -72.48, 0, 14.09, -52.99)"
          xlinkHref="#b35d7314-fcdd-4fc3-89f2-54bdb6bf037f"
        />
      </defs>
      <g style={{ clipPath: 'url(#bffbd91f-2356-4f15-82d3-c181ae961a2f)' }}>
        <g style={{ clipPath: 'url(#bffbd91f-2356-4f15-82d3-c181ae961a2f)' }}>
          <path
            d="M131.57,163v0Z"
            transform="translate(-42.87 -31.43)"
            style={{ fill: '#fff' }}
          />
          <g style={{ clipPath: 'url(#bffbd91f-2356-4f15-82d3-c181ae961a2f)' }}>
            <g style={{ opacity: 0.5 }}>
              <g
                style={{
                  clipPath: 'url(#ba15f342-7389-413b-b25c-f71c5b39633e)',
                }}
              >
                <g
                  style={{
                    clipPath: 'url(#e6a35ee6-2a7d-4e6d-9f47-775578d8491e)',
                  }}
                >
                  <rect
                    width="110.25"
                    height="119.19"
                    style={{
                      fill: 'url(#b35d7314-fcdd-4fc3-89f2-54bdb6bf037f)',
                    }}
                  />
                </g>
              </g>
            </g>
          </g>
          <g style={{ clipPath: 'url(#b9ea3dc7-9809-4a37-ac84-1cbee69a3936)' }}>
            <rect
              y="20.58"
              width="88.69"
              height="110.98"
              style={{ fill: 'url(#b7c070ae-6d22-4395-85ac-01aaf2dcf53d)' }}
            />
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default CharactersIcon;
