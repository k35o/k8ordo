import { useId } from 'react';
import type { FC } from 'react';

import { BaseIcon } from './base';
import type { BaseIconProps, IconRenderProps } from './base';

// 公式ブラウザロゴ。色・形は改変せず、複数同時描画でのグラデーション id 衝突を避けるため
// useId() でコンポーネントインスタンスごとに id を一意化している。

const Chrome: FC<IconRenderProps> = ({ className, ...rest }) => {
  const uid = useId();
  return (
    <svg
      className={className}
      {...rest}
      viewBox="-10 -10 276 276"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient
        id={`${uid}-a`}
        x1="145"
        x2="34"
        y1="253"
        y2="61"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#1e8e3e" />
        <stop offset="1" stopColor="#34a853" />
      </linearGradient>
      <linearGradient
        id={`${uid}-b`}
        x1="111"
        x2="222"
        y1="254"
        y2="62"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fcc934" />
        <stop offset="1" stopColor="#fbbc04" />
      </linearGradient>
      <linearGradient
        id={`${uid}-c`}
        x1="17"
        x2="239"
        y1="80"
        y2="80"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#d93025" />
        <stop offset="1" stopColor="#ea4335" />
      </linearGradient>
      <circle cx="128" cy="128" r="64" fill="#fff" />
      <path
        fill={`url(#${uid}-a)`}
        d="M96 183.4A63.7 63.7 0 0 1 72.6 160L17.2 64A128 128 0 0 0 128 256l55.4-96A64 64 0 0 1 96 183.4Z"
      />
      <path
        fill={`url(#${uid}-b)`}
        d="M192 128a63.7 63.7 0 0 1-8.6 32L128 256A128 128 0 0 0 238.9 64h-111a64 64 0 0 1 64 64Z"
      />
      <circle cx="128" cy="128" r="52" fill="#1a73e8" />
      <path
        fill={`url(#${uid}-c)`}
        d="M96 72.6a63.7 63.7 0 0 1 32-8.6h110.8a128 128 0 0 0-221.7 0l55.5 96A64 64 0 0 1 96 72.6Z"
      />
    </svg>
  );
};

const Edge: FC<IconRenderProps> = ({ className, ...rest }) => {
  const uid = useId();
  return (
    <svg
      className={className}
      {...rest}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id={`${uid}-b`}
          cx="161.8"
          cy="68.9"
          r="95.4"
          gradientTransform="matrix(1 0 0 -.95 0 248.8)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".7" stopOpacity="0" />
          <stop offset=".9" stopOpacity=".5" />
          <stop offset="1" />
        </radialGradient>
        <radialGradient
          id={`${uid}-d`}
          cx="-340.3"
          cy="63"
          r="143.2"
          gradientTransform="matrix(.15 -.99 -.8 -.12 176.6 -125.4)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".8" stopOpacity="0" />
          <stop offset=".9" stopOpacity=".5" />
          <stop offset="1" />
        </radialGradient>
        <radialGradient
          id={`${uid}-e`}
          cx="113.4"
          cy="570.2"
          r="202.4"
          gradientTransform="matrix(-.04 1 2.13 .08 -1179.5 -106.7)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#35c1f1" />
          <stop offset=".1" stopColor="#34c1ed" />
          <stop offset=".2" stopColor="#2fc2df" />
          <stop offset=".3" stopColor="#2bc3d2" />
          <stop offset=".7" stopColor="#36c752" />
        </radialGradient>
        <radialGradient
          id={`${uid}-f`}
          cx="376.5"
          cy="568"
          r="97.3"
          gradientTransform="matrix(.28 .96 .78 -.23 -303.8 -148.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#66eb6e" />
          <stop offset="1" stopColor="#66eb6e" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={`${uid}-a`}
          x1="63.3"
          y1="84"
          x2="241.7"
          y2="84"
          gradientTransform="matrix(1 0 0 -1 0 266)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0c59a4" />
          <stop offset="1" stopColor="#114a8b" />
        </linearGradient>
        <linearGradient
          id={`${uid}-c`}
          x1="157.3"
          y1="161.4"
          x2="46"
          y2="40.1"
          gradientTransform="matrix(1 0 0 -1 0 266)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1b9de2" />
          <stop offset=".2" stopColor="#1595df" />
          <stop offset=".7" stopColor="#0680d7" />
          <stop offset="1" stopColor="#0078d4" />
        </linearGradient>
      </defs>
      <path
        d="M235.7 195.5a93.7 93.7 0 0 1-10.6 4.7 101.9 101.9 0 0 1-35.9 6.4c-47.3 0-88.5-32.5-88.5-74.3a31.5 31.5 0 0 1 16.4-27.3c-42.8 1.8-53.8 46.4-53.8 72.5 0 74 68.1 81.4 82.8 81.4 7.9 0 19.8-2.3 27-4.6l1.3-.4a128.3 128.3 0 0 0 66.6-52.8 4 4 0 0 0-5.3-5.6Z"
        transform="translate(-4.6 -5)"
        style={{ fill: `url(#${uid}-a)` }}
      />
      <path
        d="M235.7 195.5a93.7 93.7 0 0 1-10.6 4.7 101.9 101.9 0 0 1-35.9 6.4c-47.3 0-88.5-32.5-88.5-74.3a31.5 31.5 0 0 1 16.4-27.3c-42.8 1.8-53.8 46.4-53.8 72.5 0 74 68.1 81.4 82.8 81.4 7.9 0 19.8-2.3 27-4.6l1.3-.4a128.3 128.3 0 0 0 66.6-52.8 4 4 0 0 0-5.3-5.6Z"
        transform="translate(-4.6 -5)"
        style={{ isolation: 'isolate', opacity: '.35', fill: `url(#${uid}-b)` }}
      />
      <path
        d="M110.3 246.3A79.2 79.2 0 0 1 87.6 225a80.7 80.7 0 0 1 29.5-120c3.2-1.5 8.5-4.1 15.6-4a32.4 32.4 0 0 1 25.7 13 31.9 31.9 0 0 1 6.3 18.7c0-.2 24.5-79.6-80-79.6-43.9 0-80 41.6-80 78.2a130.2 130.2 0 0 0 12.1 56 128 128 0 0 0 156.4 67 75.5 75.5 0 0 1-62.8-8Z"
        transform="translate(-4.6 -5)"
        style={{ fill: `url(#${uid}-c)` }}
      />
      <path
        d="M110.3 246.3A79.2 79.2 0 0 1 87.6 225a80.7 80.7 0 0 1 29.5-120c3.2-1.5 8.5-4.1 15.6-4a32.4 32.4 0 0 1 25.7 13 31.9 31.9 0 0 1 6.3 18.7c0-.2 24.5-79.6-80-79.6-43.9 0-80 41.6-80 78.2a130.2 130.2 0 0 0 12.1 56 128 128 0 0 0 156.4 67 75.5 75.5 0 0 1-62.8-8Z"
        transform="translate(-4.6 -5)"
        style={{ opacity: '.41', fill: `url(#${uid}-d)`, isolation: 'isolate' }}
      />
      <path
        d="M157 153.8c-.9 1-3.4 2.5-3.4 5.6 0 2.6 1.7 5.2 4.8 7.3 14.3 10 41.4 8.6 41.5 8.6a59.6 59.6 0 0 0 30.3-8.3 61.4 61.4 0 0 0 30.4-52.9c.3-22.4-8-37.3-11.3-43.9C228 28.8 182.3 5 132.6 5a128 128 0 0 0-128 126.2c.5-36.5 36.8-66 80-66 3.5 0 23.5.3 42 10a72.6 72.6 0 0 1 30.9 29.3c6.1 10.6 7.2 24.1 7.2 29.5s-2.7 13.3-7.8 19.9Z"
        transform="translate(-4.6 -5)"
        style={{ fill: `url(#${uid}-e)` }}
      />
      <path
        d="M157 153.8c-.9 1-3.4 2.5-3.4 5.6 0 2.6 1.7 5.2 4.8 7.3 14.3 10 41.4 8.6 41.5 8.6a59.6 59.6 0 0 0 30.3-8.3 61.4 61.4 0 0 0 30.4-52.9c.3-22.4-8-37.3-11.3-43.9C228 28.8 182.3 5 132.6 5a128 128 0 0 0-128 126.2c.5-36.5 36.8-66 80-66 3.5 0 23.5.3 42 10a72.6 72.6 0 0 1 30.9 29.3c6.1 10.6 7.2 24.1 7.2 29.5s-2.7 13.3-7.8 19.9Z"
        transform="translate(-4.6 -5)"
        style={{ fill: `url(#${uid}-f)` }}
      />
    </svg>
  );
};

const Firefox: FC<IconRenderProps> = ({ className, ...rest }) => {
  const uid = useId();
  return (
    <svg
      className={className}
      {...rest}
      viewBox="0 0 531 548"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M511.22 183.799C499.671 156.043 476.328 126.08 457.951 116.6C471.018 141.907 480.086 169.076 484.845 197.177L484.913 197.624C454.882 122.771 403.991 92.6018 362.409 26.9195C360.272 23.575 358.169 20.196 356.168 16.7482C355.135 14.9552 354.169 13.1279 353.238 11.2659C351.515 7.92154 350.169 4.40469 349.273 0.749918C349.273 0.405128 349.032 0.0948176 348.687 0.0258593C348.515 -0.00861977 348.342 -0.00861977 348.17 0.0258593C348.136 0.0258593 348.066 0.0948176 348.032 0.0948176C347.998 0.0948176 347.894 0.163776 347.86 0.198254L347.963 0.0603386C281.281 39.125 258.663 111.392 256.56 147.527C229.941 149.354 204.461 159.181 183.498 175.696C181.292 173.835 178.981 172.11 176.603 170.49C170.569 149.32 170.292 126.909 175.844 105.6C151.364 117.461 129.608 134.286 111.954 154.975H111.817C101.3 141.631 102.025 97.6703 102.645 88.4989C99.5423 89.7401 96.5773 91.3261 93.7843 93.1879C84.5093 99.8079 75.8213 107.255 67.8213 115.426C58.7533 124.633 50.4443 134.563 43.0313 145.148C25.9643 169.352 13.8623 196.694 7.41431 225.587C7.27631 226.173 7.17331 226.759 7.07031 227.346C6.58731 229.69 4.79431 241.379 4.44931 243.93C4.44931 244.137 4.41531 244.309 4.38031 244.516C2.07031 256.618 0.622312 268.858 0.0703125 281.132C0.0703125 281.581 0.0703125 282.029 0.0703125 282.512C0.0703125 429.116 118.954 547.966 265.558 547.966C394.854 547.966 505.325 454.838 527.184 327.403C527.633 323.99 528.011 320.577 528.391 317.163C533.874 271.961 527.943 226.104 511.186 183.764L511.22 183.799ZM205.254 391.604C206.496 392.189 207.668 392.844 208.944 393.431L209.116 393.535C207.806 392.914 206.53 392.259 205.22 391.604H205.254Z"
        fill={`url(#${uid}-paint0_linear_108_10279)`}
      />
      <path
        d="M511.219 183.799C499.669 156.043 476.327 126.082 457.95 116.6C471.017 141.907 480.085 169.076 484.843 197.177C484.843 197.107 484.843 197.211 484.878 197.418V197.694C509.979 265.617 496.325 334.679 476.672 376.846C446.261 442.149 372.613 509.038 257.315 505.798C132.743 502.281 23.0315 409.843 2.55151 288.787C-1.17249 269.685 2.55151 260.032 4.41251 244.482C1.82651 256.515 0.413516 268.79 0.103516 281.098C0.103516 281.547 0.103516 281.995 0.103516 282.478C0.103516 429.082 118.952 547.966 265.591 547.966C394.887 547.966 505.358 454.838 527.252 327.404C527.701 323.99 528.079 320.577 528.458 317.163C533.94 271.962 528.011 226.104 511.254 183.764L511.219 183.799Z"
        fill={`url(#${uid}-paint1_radial_108_10279)`}
      />
      <path
        d="M511.219 183.799C499.669 156.043 476.327 126.082 457.95 116.6C471.017 141.907 480.085 169.076 484.843 197.177C484.843 197.107 484.843 197.211 484.878 197.418V197.694C509.979 265.617 496.325 334.679 476.672 376.846C446.261 442.149 372.613 509.038 257.315 505.798C132.743 502.281 23.0315 409.843 2.55151 288.787C-1.17249 269.685 2.55151 260.032 4.41251 244.482C1.82651 256.515 0.413516 268.79 0.103516 281.098C0.103516 281.547 0.103516 281.995 0.103516 282.478C0.103516 429.082 118.952 547.966 265.591 547.966C394.887 547.966 505.358 454.838 527.252 327.404C527.701 323.99 528.079 320.577 528.458 317.163C533.94 271.962 528.011 226.104 511.254 183.764L511.219 183.799Z"
        fill={`url(#${uid}-paint2_radial_108_10279)`}
      />
      <path
        d="M382.199 215.002C382.786 215.416 383.303 215.829 383.855 216.209C377.2 204.382 368.891 193.556 359.203 184.04C276.694 101.532 337.585 5.12865 347.858 0.232642L347.962 0.0947266C281.28 39.1594 258.662 111.428 256.559 147.561C259.661 147.354 262.73 147.113 265.868 147.113C314.036 147.217 358.41 173.144 382.165 215.036L382.199 215.002Z"
        fill={`url(#${uid}-paint3_radial_108_10279)`}
      />
      <path
        d="M266.041 231.482C265.593 238.102 242.286 260.859 234.114 260.859C158.605 260.859 146.365 306.509 146.365 306.509C149.71 344.952 176.466 376.639 208.91 393.396C210.392 394.155 211.875 394.844 213.393 395.533C215.943 396.671 218.564 397.74 221.184 398.74C232.287 402.67 243.94 404.911 255.732 405.394C388.028 411.601 413.68 247.205 318.208 199.452C342.653 195.21 368.03 205.037 382.235 214.967C358.48 173.075 314.07 147.147 265.903 147.044C262.766 147.044 259.663 147.319 256.595 147.491C229.976 149.319 204.496 159.146 183.533 175.661C187.567 179.074 192.153 183.66 201.807 193.142C219.805 210.899 266.007 229.31 266.111 231.448L266.041 231.482Z"
        fill={`url(#${uid}-paint4_radial_108_10279)`}
      />
      <path
        d="M266.041 231.482C265.593 238.102 242.286 260.859 234.114 260.859C158.605 260.859 146.365 306.509 146.365 306.509C149.71 344.952 176.466 376.639 208.91 393.396C210.392 394.155 211.875 394.844 213.393 395.533C215.943 396.671 218.564 397.74 221.184 398.74C232.287 402.67 243.94 404.911 255.732 405.394C388.028 411.601 413.68 247.205 318.208 199.452C342.653 195.21 368.03 205.037 382.235 214.967C358.48 173.075 314.07 147.147 265.903 147.044C262.766 147.044 259.663 147.319 256.595 147.491C229.976 149.319 204.496 159.146 183.533 175.661C187.567 179.074 192.153 183.66 201.807 193.142C219.805 210.899 266.007 229.31 266.111 231.448L266.041 231.482Z"
        fill={`url(#${uid}-paint5_radial_108_10279)`}
      />
      <path
        d="M171.119 166.87C172.981 168.042 174.808 169.283 176.602 170.524C170.568 149.354 170.292 126.943 175.843 105.635C151.363 117.495 129.607 134.322 111.953 155.009C113.229 155.009 151.742 154.284 171.119 166.87Z"
        fill={`url(#${uid}-paint6_radial_108_10279)`}
      />
      <path
        d="M2.54922 288.822C23.0302 409.877 132.741 502.315 257.314 505.832C372.577 509.108 446.259 442.184 476.669 376.881C496.323 334.678 510.011 265.617 484.944 197.728V197.452C484.944 197.246 484.91 197.142 484.91 197.211L484.978 197.659C494.392 259.17 463.119 318.714 414.193 359.02L414.055 359.366C318.79 436.943 227.628 406.188 209.181 393.569C207.871 392.948 206.595 392.293 205.32 391.638C149.774 365.089 126.846 314.474 131.742 271.099C104.814 271.478 80.1612 255.997 68.8522 231.552C68.8522 231.552 110.951 201.52 166.462 227.621C197.907 241.896 233.661 243.31 266.141 231.552C266.037 229.38 219.836 211.002 201.838 193.246C192.218 183.764 187.632 179.179 183.564 175.766C181.391 173.903 179.082 172.179 176.702 170.558C175.116 169.49 173.358 168.317 171.22 166.904C151.843 154.32 113.364 155.043 112.089 155.043H111.951C101.435 141.7 102.159 97.7393 102.779 88.5679C99.6762 89.8091 96.7112 91.3952 93.9182 93.257C84.6442 99.877 75.9552 107.324 67.9562 115.496C58.8882 124.702 50.5782 134.631 43.1652 145.217C26.0982 169.421 13.9962 196.763 7.54922 225.656C7.41122 226.243 -2.03678 267.48 2.61822 288.89L2.54922 288.822Z"
        fill={`url(#${uid}-paint7_radial_108_10279)`}
      />
      <path
        d="M359.201 184.04C368.889 193.556 377.199 204.383 383.853 216.21C385.233 217.243 386.577 218.313 387.853 219.485C448.019 274.927 416.505 353.401 414.16 358.986C463.051 318.714 494.324 259.135 484.946 197.625C454.88 122.805 403.989 92.6365 362.408 26.9541C360.27 23.6096 358.167 20.2308 356.167 16.7829C355.133 14.9899 354.167 13.1625 353.236 11.3007C351.512 7.95621 350.167 4.43935 349.272 0.784586C349.272 0.439796 349.03 0.129485 348.685 0.0605274C348.513 0.0260481 348.34 0.0260481 348.168 0.0605274C348.133 0.0605274 348.064 0.129485 348.03 0.129485C347.996 0.129485 347.892 0.198443 347.858 0.232922C337.583 5.12893 276.693 101.532 359.201 184.04Z"
        fill={`url(#${uid}-paint8_linear_108_10279)`}
        fillOpacity="0.8"
      />
      <path
        d="M387.855 219.484C386.579 218.346 385.235 217.243 383.855 216.209C383.304 215.795 382.786 215.382 382.2 215.002C368.029 205.037 342.653 195.211 318.173 199.486C413.645 247.24 388.027 411.635 255.697 405.43C243.905 404.947 232.286 402.706 221.149 398.775C218.529 397.775 215.908 396.706 213.356 395.568C211.874 394.879 210.357 394.189 208.875 393.43L209.047 393.534C227.493 406.119 318.656 436.909 413.921 359.331L414.059 358.986C416.403 353.401 447.952 274.961 387.751 219.484H387.855Z"
        fill={`url(#${uid}-paint9_radial_108_10279)`}
      />
      <path
        d="M146.399 306.509C146.399 306.509 158.639 260.859 234.148 260.859C242.319 260.859 265.662 238.068 266.076 231.482C233.63 243.239 197.841 241.827 166.397 227.552C110.92 201.451 68.7871 231.482 68.7871 231.482C80.0961 255.928 104.749 271.443 131.677 271.03C126.746 314.439 149.709 365.054 205.254 391.568C206.496 392.154 207.668 392.809 208.944 393.396C176.534 376.639 149.744 344.952 146.399 306.509Z"
        fill={`url(#${uid}-paint10_radial_108_10279)`}
      />
      <path
        d="M511.22 183.799C499.669 156.043 476.326 126.081 457.949 116.6C471.017 141.907 480.085 169.076 484.843 197.177L484.912 197.624C454.88 122.771 403.99 92.6018 362.409 26.9195C360.27 23.575 358.167 20.196 356.168 16.7482C355.133 14.9552 354.167 13.1279 353.237 11.2659C351.513 7.92154 350.169 4.40469 349.272 0.749918C349.272 0.405128 349.031 0.0948176 348.685 0.0258593C348.513 -0.00861977 348.34 -0.00861977 348.168 0.0258593C348.134 0.0258593 348.065 0.0948176 348.03 0.0948176C347.996 0.0948176 347.893 0.163776 347.858 0.198254L347.962 0.0603386C281.279 39.125 258.661 111.392 256.558 147.527C259.661 147.32 262.729 147.079 265.868 147.079C314.034 147.182 358.409 173.11 382.164 215.002C367.994 205.037 342.618 195.211 318.137 199.487C413.609 247.24 387.991 411.636 255.661 405.429C243.869 404.946 232.25 402.706 221.113 398.775C218.493 397.775 215.873 396.706 213.322 395.568C211.839 394.879 210.321 394.19 208.839 393.431L209.011 393.535C207.701 392.914 206.426 392.259 205.15 391.604C206.391 392.189 207.563 392.844 208.839 393.431C176.429 376.674 149.639 344.988 146.294 306.544C146.294 306.544 158.534 260.894 234.043 260.894C242.215 260.894 265.557 238.103 265.97 231.518C265.868 229.345 219.665 210.968 201.667 193.211C192.048 183.73 187.462 179.144 183.393 175.731C181.186 173.869 178.911 172.11 176.532 170.524C170.498 149.354 170.222 126.943 175.774 105.635C151.294 117.495 129.537 134.322 111.884 155.009H111.747C101.23 141.665 101.954 97.7048 102.575 88.5334C99.472 89.7746 96.507 91.3606 93.714 93.2225C84.439 99.8424 75.75 107.29 67.751 115.462C58.683 124.668 50.374 134.597 42.961 145.182C25.894 169.386 13.792 196.729 7.34399 225.622C7.20599 226.208 7.10299 226.794 6.99899 227.38C6.51699 229.724 4.275 241.585 3.931 244.137C1.896 256.411 0.586 268.755 0 281.168C0 281.615 0 282.064 0 282.546C0 429.151 118.884 548 265.488 548C394.783 548 505.255 454.872 527.114 327.438C527.562 324.024 527.941 320.611 528.321 317.198C533.803 271.996 527.873 226.139 511.116 183.799H511.22ZM484.877 197.418V197.694H484.912V197.418H484.877Z"
        fill={`url(#${uid}-paint11_linear_108_10279)`}
      />
      <defs>
        <linearGradient
          id={`${uid}-paint0_linear_108_10279`}
          x1="485.232"
          y1="84.5337"
          x2="59.4373"
          y2="492.596"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.05" stopColor="#FFF44F" />
          <stop offset="0.37" stopColor="#FF980E" />
          <stop offset="0.53" stopColor="#FF3647" />
          <stop offset="0.7" stopColor="#E31587" />
        </linearGradient>
        <radialGradient
          id={`${uid}-paint1_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(454.105 114.926) scale(544.585 553.729)"
        >
          <stop offset="0.13" stopColor="#FFBD4F" />
          <stop offset="0.28" stopColor="#FF980E" />
          <stop offset="0.47" stopColor="#FF3750" />
          <stop offset="0.78" stopColor="#EB0878" />
          <stop offset="0.86" stopColor="#E50080" />
        </radialGradient>
        <radialGradient
          id={`${uid}-paint2_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(262.561 287.874) scale(558.183 553.729)"
        >
          <stop offset="0.3" stopColor="#960E18" />
          <stop offset="0.35" stopColor="#B11927" stopOpacity="0.74" />
          <stop offset="0.43" stopColor="#DB293D" stopOpacity="0.34" />
          <stop offset="0.5" stopColor="#F5334B" stopOpacity="0.09" />
          <stop offset="0.53" stopColor="#FF3750" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={`${uid}-paint3_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(331.367 -20.2613) scale(177.771 301.899)"
        >
          <stop offset="0.13" stopColor="#FFF44F" />
          <stop offset="0.53" stopColor="#FF980E" />
        </radialGradient>
        <radialGradient
          id={`${uid}-paint4_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(208.912 429.892) scale(235.025 257.644)"
        >
          <stop offset="0.35" stopColor="#3A8EE6" />
          <stop offset="0.67" stopColor="#9059FF" />
          <stop offset="1" stopColor="#C139E6" />
        </radialGradient>
        <radialGradient
          id={`${uid}-paint5_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(264.213 240.816) rotate(5.84609) scale(118.808 137.994)"
        >
          <stop offset="0.21" stopColor="#9059FF" stopOpacity="0" />
          <stop offset="1" stopColor="#6E008B" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient
          id={`${uid}-paint6_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(269.642 38.8309) scale(187.345 188.139)"
        >
          <stop offset="0.1" stopColor="#FFE226" />
          <stop offset="0.79" stopColor="#FF7139" />
        </radialGradient>
        <radialGradient
          id={`${uid}-paint7_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(397.282 -91.0267) scale(893.633 750.192)"
        >
          <stop offset="0.11" stopColor="#FFF44F" />
          <stop offset="0.46" stopColor="#FF980E" />
          <stop offset="0.72" stopColor="#FF3647" />
          <stop offset="0.9" stopColor="#E31587" />
        </radialGradient>
        <linearGradient
          id={`${uid}-paint8_linear_108_10279`}
          x1="342.031"
          y1="-63.76"
          x2="452.363"
          y2="424.117"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF44F" />
          <stop offset="0.3" stopColor="#FF980E" />
          <stop offset="0.57" stopColor="#FF3647" />
          <stop offset="0.74" stopColor="#E31587" />
        </linearGradient>
        <radialGradient
          id={`${uid}-paint9_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(227.963 98.8379) scale(514.369 505.435)"
        >
          <stop offset="0.14" stopColor="#FFF44F" />
          <stop offset="0.48" stopColor="#FF980E" />
          <stop offset="0.66" stopColor="#FF3647" />
          <stop offset="0.9" stopColor="#E31587" />
        </radialGradient>
        <radialGradient
          id={`${uid}-paint10_radial_108_10279`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(392.599 131.299) scale(618.139 553.177)"
        >
          <stop offset="0.09" stopColor="#FFF44F" />
          <stop offset="0.63" stopColor="#FF980E" />
        </radialGradient>
        <linearGradient
          id={`${uid}-paint11_linear_108_10279`}
          x1="457.168"
          y1="84.4303"
          x2="116.68"
          y2="458.139"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.17" stopColor="#FFF44F" stopOpacity="0.8" />
          <stop offset="0.677885" stopColor="#FFF44F" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Safari: FC<IconRenderProps> = ({ className, ...rest }) => {
  const uid = useId();
  return (
    <svg
      className={className}
      {...rest}
      viewBox="194.5 190.1 135.1 135.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`${uid}-a`}
          x1="132.55"
          x2="134.37"
          y1="111.67"
          y2="-105.3"
          href={`#${uid}-b`}
        >
          <stop offset="0" stopColor="#d2d2d2" />
          <stop offset=".53" stopColor="#f2f2f2" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id={`${uid}-b`} gradientUnits="userSpaceOnUse" />
        <linearGradient
          id={`${uid}-c`}
          x1="65.44"
          x2="67.4"
          y1="115.72"
          y2="17.14"
          href={`#${uid}-b`}
        >
          <stop offset="0" stopColor="#005ad5" />
          <stop offset=".16" stopColor="#0875f0" />
          <stop offset=".31" stopColor="#218cee" />
          <stop offset=".63" stopColor="#27a5f3" />
          <stop offset=".81" stopColor="#25aaf2" />
          <stop offset="1" stopColor="#21aaef" />
        </linearGradient>
        <linearGradient
          id={`${uid}-d`}
          x1="158.7"
          x2="176.28"
          y1="96.71"
          y2="79.53"
          href={`#${uid}-b`}
        >
          <stop offset="0" stopColor="#c72e24" />
          <stop offset="1" stopColor="#fd3b2f" />
        </linearGradient>
        <filter id={`${uid}-e`} colorInterpolationFilters="sRGB">
          <feFlood floodOpacity=".28" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feGaussianBlur stdDeviation="3" />
          <feOffset dx=".3" dy="2.8" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id={`${uid}-f`} colorInterpolationFilters="sRGB">
          <feFlood floodOpacity=".31" />
          <feComposite floodOpacity=".31" in2="SourceGraphic" operator="out" />
          <feGaussianBlur floodOpacity=".3" stdDeviation=".7" />
          <feOffset dy="1.8" />
          <feComposite in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id={`${uid}-g`} colorInterpolationFilters="sRGB">
          <feFlood floodOpacity=".61" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feGaussianBlur stdDeviation=".5" />
          <feOffset dx=".8" dy=".8" />
          <feComposite in="SourceGraphic" result="A" />
          <feColorMatrix values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0" />
          <feFlood floodOpacity=".4" />
          <feComposite in2="A" operator="in" />
          <feGaussianBlur stdDeviation="3.8" />
          <feOffset dx="2.3" dy="3.3" />
          <feComposite in="A" />
        </filter>
        <filter id={`${uid}-h`} width="110%" height="110%" x="-1%" y="-1%">
          <feGaussianBlur in="SourceAlpha" stdDeviation=".4" />
          <feOffset dx=".1" dy=".2" />
          <feComponentTransfer result="A">
            <feFuncA type="linear" />
          </feComponentTransfer>
          <feFlood floodColor="rgba(0,0,0,0.5)" />
          <feComposite in2="A" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient
          id={`${uid}-i`}
          cx="-69.88"
          cy="69.29"
          r="54.01"
          gradientTransform="matrix(.9023 -.01249 .0377 2.7234 -9.44 -120.29)"
          href={`#${uid}-b`}
        >
          <stop offset="0" stopColor="#24a5f3" stopOpacity=".01" />
          <stop offset="1" stopColor="#1e8ceb" stopOpacity=".98" />
        </radialGradient>
        <radialGradient
          id={`${uid}-j`}
          cx="109.35"
          cy="13.76"
          r="93.08"
          gradientTransform="matrix(-.01822 1.0922 -1.042 -.01765 136.95 -115.33)"
          href={`#${uid}-b`}
        >
          <stop offset="0" stopOpacity="0" />
          <stop offset=".96" stopColor="#5488d6" stopOpacity="0" />
          <stop offset="1" stopColor="#5d96eb" />
        </radialGradient>
      </defs>
      <g filter={`url(#${uid}-f)`} transform="translate(194.2 190.07)">
        <ellipse
          cx="67.77"
          cy="67.73"
          fill={`url(#${uid}-c)`}
          paintOrder="stroke fill markers"
          rx="54.01"
          ry="53.98"
        />
        <ellipse
          cx="-69.88"
          cy="69.29"
          fill={`url(#${uid}-i)`}
          rx="54.01"
          ry="53.98"
          transform="translate(137.65 -1.55)"
        />
      </g>
      <ellipse
        cx="120"
        cy="14.15"
        fill={`url(#${uid}-j)`}
        rx="93.08"
        ry="93.67"
        transform="matrix(.58082 0 0 .57636 192.3 249.63)"
      />
      <g
        filter={`url(#${uid}-g)`}
        transform="matrix(.58289 0 0 .56508 196.8 181.63)"
      >
        <path
          fill="#cac7c8"
          d="m46 191.66.73.35 72.18-48.2-7.34-8.95L46 191.66Z"
        />
        <path
          fill="#fbfffc"
          d="m45.8 190.87.2.8 65.57-56.8-6.95-8.92-58.83 64.92Z"
        />
        <path
          fill={`url(#${uid}-d)`}
          d="m118.91 143.81-7.35-8.95 66.08-57.2.27.73-59 65.42Z"
        />
        <path
          fill="#fb645c"
          d="m104.62 125.95 6.94 8.92 66.08-57.2-.65-.35-72.37 48.63Z"
        />
      </g>
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit="1"
        strokeWidth="1.33"
        d="m286.59 278.44 3.14-2.14m-11.23-17.8 7.8-1.37m-8.32-2.9 3.78-.3m-3.3-12.47 7.8 1.38m-8.2 3.03 3.76.38m-1.2-13.05 7.47 2.73m-3.77-10.5 6.86 3.96m-1.87-10.96 6.07 5.09m.05-11.07 5.09 6.07m1.97-10.99 3.97 6.86m3.7-10.53 2.71 7.43m5.62-9.62 1.37 7.8m15.62-7.89-1.38 7.8m9.82-5.6-2.72 7.42m10.5-3.75-3.96 6.86m10.98-1.89-5.12 6.07m16.18 6.96-6.87 3.96m10.45 3.88-7.45 2.7m9.64 5.6-7.82 1.38m7.81 15.79-7.82-1.39m5.6 9.7-7.44-2.71m3.8 10.47-6.87-3.95m1.91 10.98-6.07-5.07m-.05 11.2-5.1-6.08m-1.95 10.99-4-6.88m-3.87 10.5-2.7-7.43m-5.61 9.61-1.37-7.78m-15.78 7.75 1.4-7.86m-9.7 5.58 2.72-7.47m-10.5 3.73 3.97-6.87m-10.96 1.9 5.08-6.03m-8.26 3.13 2.75-2.68m3.84 8.23 2.2-3.1m5.2 7.44 1.66-3.45m6.43 6.47 1.02-3.7m7.52 5.32.43-3.82m8.08 3.8-.31-3.84m8.81 2.33-.97-3.69m9.06.75-1.58-3.48m9.05-.76-2.16-3.18m8.78-2.38-2.68-2.73m8.24-3.85-3.11-2.2m7.42-5.2-3.47-1.67m6.42-6.41-3.7-1.03m5.17-7.46-3.78-.37m3.8-8.24-3.81.3m2.35-8.8-3.7.97m.8-9.06-3.49 1.61m-1.03-9.12-3.2 2.2m-2.12-8.62-2.72 2.7m-3.84-8.28-2.23 3.12m-5.21-7.45-1.66 3.44m-6.55-6.32-1.02 3.63m-7.42-5.2-.38 3.81m-8.09-3.66.28 3.8m-8.79-2.34.95 3.68m-8.9-.72 1.61 3.46m-9.06.82 2.18 3.16m-8.82 2.27 2.68 2.7m-8.25 3.85 3.1 2.23m-7.44 5.17 3.42 1.66m-6.3 6.36 3.7 1.05m-3.71 24.39 3.7-.91m-2.44 5.03 7.48-2.72m-5.86 6.73 3.5-1.61m-1.53 5.43 6.87-3.95m-13.33-20.52 7.96.01m41.16-41.44v-7.96m.02 98.74.01-7.94m49.33-41.4-7.95-.01"
        filter={`url(#${uid}-h)`}
        transform="translate(-65 7.73)"
      />
    </svg>
  );
};

export const ChromeIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Chrome {...props} />} size={size} />
);

export const EdgeIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Edge {...props} />} size={size} />
);

export const FirefoxIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Firefox {...props} />} size={size} />
);

export const SafariIcon: FC<Partial<BaseIconProps>> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Safari {...props} />} size={size} />
);
