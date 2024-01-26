import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import Icon from '@material-ui/core/Icon';

export const BASE_PATH = 'geppetto/build/static/icons/';

export default ({
  name, selected, highlight = false, disabled = false, fontSize = 'medium', color,
}) => {
  const className = `image-icon ${selected ? 'selected' : ''} ${highlight ? ' highlight' : ''}`;
  return (
    <Icon
      fontSize={fontSize}
      style={{ opacity: disabled ? 0.9 : 1, color }}
    >
      <img className={className} src={`${BASE_PATH + name}.svg`} style={{ height: '100%' }} />
    </Icon>
  );
};

export function MechIcon (props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d="M20.1733 13.1276L22.1478 14.2683C22.3733 14.3985 22.478 14.6679 22.4008 14.9168C21.8878 16.5695 21.0121 18.0627 19.8668 19.3028C19.7811 19.3957 19.6664 19.4566 19.5415 19.4756C19.4166 19.4946 19.289 19.4705 19.1796 19.4073L17.2065 18.2669C16.3764 18.9787 15.422 19.531 14.3913 19.8959V22.1765C14.3913 22.303 14.3483 22.4257 14.2693 22.5244C14.1904 22.6232 14.0802 22.6921 13.9569 22.7198C12.3372 23.0839 10.5977 23.1027 8.89634 22.7202C8.64197 22.663 8.46067 22.4375 8.46067 22.1766V19.8959C7.43004 19.531 6.47562 18.9787 5.64548 18.2669L3.67241 19.4073C3.563 19.4705 3.43537 19.4946 3.31049 19.4756C3.18561 19.4566 3.0709 19.3957 2.98518 19.3028C1.83991 18.0627 0.964154 16.5695 0.45124 14.9168C0.374002 14.668 0.47867 14.3986 0.704176 14.2683L2.67878 13.1276C2.48045 12.0516 2.48045 10.9484 2.67878 9.87243L0.704222 8.73175C0.478716 8.6015 0.374048 8.33213 0.451287 8.08326C0.964201 6.43051 1.83991 4.93737 2.98523 3.69722C3.07094 3.60436 3.18566 3.54343 3.31054 3.52444C3.43542 3.50545 3.56304 3.52952 3.67245 3.5927L5.64553 4.73319C6.47568 4.02133 7.43009 3.46906 8.46072 3.10419V0.823529C8.46071 0.697041 8.50373 0.57432 8.5827 0.47556C8.66167 0.376801 8.77187 0.307885 8.89519 0.280155C10.5148 -0.0838562 12.2543 -0.102683 13.9557 0.27983C14.2101 0.337006 14.3914 0.562507 14.3914 0.823436V3.10414C15.422 3.46899 16.3764 4.02126 17.2066 4.73315L19.1796 3.59266C19.2891 3.52947 19.4167 3.5054 19.5416 3.52439C19.6664 3.54339 19.7812 3.60432 19.8669 3.69718C21.0121 4.93732 21.8879 6.43046 22.4008 8.08321C22.478 8.33204 22.3734 8.6014 22.1479 8.73171L20.1733 9.87238C20.3716 10.9484 20.3716 12.0516 20.1733 13.1276Z" />
    </SvgIcon>
  );
}

export function ArrowRightIcon (props) {
  return (
    <SvgIcon viewBox="0 0 8 12" {...props}>
      <path d="M7.32077 5.3627L2.33142 0.264293C1.98657 -0.0880976 1.42893 -0.0880976 1.08775 0.264293L0.258639 1.11153C-0.086213 1.46392 -0.086213 2.03374 0.258639 2.38238L3.7952 5.99625L0.258639 9.61012C-0.086213 9.96251 -0.086213 10.5323 0.258639 10.881L1.08408 11.7357C1.42893 12.0881 1.98657 12.0881 2.32775 11.7357L7.3171 6.6373C7.66562 6.28491 7.66562 5.71509 7.32077 5.3627Z" />
    </SvgIcon>
  );
}

export function RandomColorLensIcon (props) {
  return (
    <SvgIcon viewBox="0 0 15 12" {...props}>
      <path d="M8.9375 5.71875C9.14583 5.90625 9.38542 6 9.65625 6C9.92708 6 10.1562 5.90625 10.3438 5.71875C10.5521 5.53125 10.6562 5.29167 10.6562 5C10.6562 4.70833 10.5521 4.46875 10.3438 4.28125C10.1562 4.09375 9.92708 4 9.65625 4C9.38542 4 9.14583 4.09375 8.9375 4.28125C8.75 4.46875 8.65625 4.70833 8.65625 5C8.65625 5.29167 8.75 5.53125 8.9375 5.71875ZM6.9375 3.0625C7.14583 3.25 7.38542 3.34375 7.65625 3.34375C7.92708 3.34375 8.15625 3.25 8.34375 3.0625C8.55208 2.85417 8.65625 2.61458 8.65625 2.34375C8.65625 2.07292 8.55208 1.84375 8.34375 1.65625C8.15625 1.44792 7.92708 1.34375 7.65625 1.34375C7.38542 1.34375 7.14583 1.44792 6.9375 1.65625C6.75 1.84375 6.65625 2.07292 6.65625 2.34375C6.65625 2.61458 6.75 2.85417 6.9375 3.0625ZM3.625 3.0625C3.83333 3.25 4.07292 3.34375 4.34375 3.34375C4.61458 3.34375 4.84375 3.25 5.03125 3.0625C5.23958 2.85417 5.34375 2.61458 5.34375 2.34375C5.34375 2.07292 5.23958 1.84375 5.03125 1.65625C4.84375 1.44792 4.61458 1.34375 4.34375 1.34375C4.07292 1.34375 3.83333 1.44792 3.625 1.65625C3.4375 1.84375 3.34375 2.07292 3.34375 2.34375C3.34375 2.61458 3.4375 2.85417 3.625 3.0625ZM1.625 5.71875C1.83333 5.90625 2.07292 6 2.34375 6C2.61458 6 2.84375 5.90625 3.03125 5.71875C3.23958 5.53125 3.34375 5.29167 3.34375 5C3.34375 4.70833 3.23958 4.46875 3.03125 4.28125C2.84375 4.09375 2.61458 4 2.34375 4C2.07292 4 1.83333 4.09375 1.625 4.28125C1.4375 4.46875 1.34375 4.70833 1.34375 5C1.34375 5.29167 1.4375 5.53125 1.625 5.71875ZM6 0C7.64583 0 9.05208 0.520833 10.2188 1.5625C11.4062 2.60417 12 3.86458 12 5.34375C12 6.26042 11.6667 7.04167 11 7.6875C10.3542 8.33333 10 7 9 7H7C6.44772 7 6 7.44774 6 8.00002C6 8.41559 6 8.81964 6 9V9.5C6 9.77614 6.22386 10 6.5 10C6.77614 10 7 10.2238 7 10.5C7 10.6929 7 10.8926 7 11C7 11.2917 6.90625 11.5312 6.71875 11.7188C6.53125 11.9062 6.29167 12 6 12C4.33333 12 2.91667 11.4167 1.75 10.25C0.583333 9.08333 0 7.66667 0 6C0 4.33333 0.583333 2.91667 1.75 1.75C2.91667 0.583333 4.33333 0 6 0Z" fill="#989898" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12.8536 6.64648L14.7071 8.50004L12.8536 10.3536L12.1464 9.64648L12.7864 9.00658C12.3982 9.03159 12.1736 9.12507 12.0106 9.23134C11.8485 9.33706 11.7367 9.45476 11.5795 9.62029C11.5143 9.68897 11.4413 9.76588 11.3536 9.85359L10.6464 9.14648C10.691 9.10196 10.7389 9.05128 10.7904 8.9969C10.9713 8.80587 11.1953 8.5692 11.4644 8.39373C11.809 8.16894 12.2266 8.03063 12.7974 8.00455L12.1464 7.35359L12.8536 6.64648ZM8.39688 9.3444C8.07442 9.11407 7.6904 9.00004 7 9.00004V8.00004C7.8096 8.00004 8.42558 8.136 8.97812 8.53067C9.50045 8.90377 9.92094 9.48007 10.416 10.2227C10.9209 10.9801 11.2505 11.4038 11.6031 11.6557C11.8911 11.8614 12.2283 11.9744 12.789 11.9961L12.1464 11.3536L12.8536 10.6465L14.7071 12.5L12.8536 14.3536L12.1464 13.6465L12.796 12.997C12.0853 12.9748 11.527 12.8302 11.0219 12.4694C10.4995 12.0963 10.0791 11.52 9.58397 10.7774C9.07906 10.02 8.74955 9.59631 8.39688 9.3444ZM8.53563 12.6063C8.15142 12.8569 7.6767 13 7 13V12C7.5233 12 7.79858 11.8932 7.98937 11.7687C8.15146 11.663 8.26325 11.5453 8.42046 11.3798C8.48569 11.3111 8.55874 11.2342 8.64645 11.1465L9.35355 11.8536C9.30903 11.8981 9.26105 11.9488 9.20957 12.0032C9.02873 12.1942 8.80469 12.4309 8.53563 12.6063Z" fill="#989898" />
    </SvgIcon>
  );
}

export function ColorLensIcon (props) {
  return (
    <SvgIcon viewBox="0 0 15 12" {...props}>
      <path d="M8.9375 5.71875C9.14583 5.90625 9.38542 6 9.65625 6C9.92708 6 10.1562 5.90625 10.3438 5.71875C10.5521 5.53125 10.6562 5.29167 10.6562 5C10.6562 4.70833 10.5521 4.46875 10.3438 4.28125C10.1562 4.09375 9.92708 4 9.65625 4C9.38542 4 9.14583 4.09375 8.9375 4.28125C8.75 4.46875 8.65625 4.70833 8.65625 5C8.65625 5.29167 8.75 5.53125 8.9375 5.71875ZM6.9375 3.0625C7.14583 3.25 7.38542 3.34375 7.65625 3.34375C7.92708 3.34375 8.15625 3.25 8.34375 3.0625C8.55208 2.85417 8.65625 2.61458 8.65625 2.34375C8.65625 2.07292 8.55208 1.84375 8.34375 1.65625C8.15625 1.44792 7.92708 1.34375 7.65625 1.34375C7.38542 1.34375 7.14583 1.44792 6.9375 1.65625C6.75 1.84375 6.65625 2.07292 6.65625 2.34375C6.65625 2.61458 6.75 2.85417 6.9375 3.0625ZM3.625 3.0625C3.83333 3.25 4.07292 3.34375 4.34375 3.34375C4.61458 3.34375 4.84375 3.25 5.03125 3.0625C5.23958 2.85417 5.34375 2.61458 5.34375 2.34375C5.34375 2.07292 5.23958 1.84375 5.03125 1.65625C4.84375 1.44792 4.61458 1.34375 4.34375 1.34375C4.07292 1.34375 3.83333 1.44792 3.625 1.65625C3.4375 1.84375 3.34375 2.07292 3.34375 2.34375C3.34375 2.61458 3.4375 2.85417 3.625 3.0625ZM1.625 5.71875C1.83333 5.90625 2.07292 6 2.34375 6C2.61458 6 2.84375 5.90625 3.03125 5.71875C3.23958 5.53125 3.34375 5.29167 3.34375 5C3.34375 4.70833 3.23958 4.46875 3.03125 4.28125C2.84375 4.09375 2.61458 4 2.34375 4C2.07292 4 1.83333 4.09375 1.625 4.28125C1.4375 4.46875 1.34375 4.70833 1.34375 5C1.34375 5.29167 1.4375 5.53125 1.625 5.71875ZM6 0C7.64583 0 9.05208 0.520833 10.2188 1.5625C11.4062 2.60417 12 3.86458 12 5.34375C12 6.26042 11.6667 7.04167 11 7.6875C10.3542 8.33333 9.57292 8.65625 8.65625 8.65625H7.5C7.20833 8.65625 6.96875 8.76042 6.78125 8.96875C6.59375 9.15625 6.5 9.38542 6.5 9.65625C6.5 9.88542 6.58333 10.1042 6.75 10.3125C6.91667 10.5208 7 10.75 7 11C7 11.2917 6.90625 11.5312 6.71875 11.7188C6.53125 11.9062 6.29167 12 6 12C4.33333 12 2.91667 11.4167 1.75 10.25C0.583333 9.08333 0 7.66667 0 6C0 4.33333 0.583333 2.91667 1.75 1.75C2.91667 0.583333 4.33333 0 6 0Z" fill="#989898" />
    </SvgIcon>
  );
}

export function TriangleIcon (props) {
  return (
    <SvgIcon viewBox="0 0 12 6" {...props}>
      <path xmlns="http://www.w3.org/2000/svg" d="M4.58579 1.41421L0 6H12L7.41421 1.41421C6.63316 0.633165 5.36683 0.633166 4.58579 1.41421Z" fill="#323232" />
    </SvgIcon>
  );
}

export function TreeItemArrowRightIcon (props) {
  return (
    <SvgIcon viewBox="0 0 4 8" {...props}>
      <path d="M0.666504 7.33332L3.99984 3.99999L0.666504 0.666656V7.33332Z" fill="#989898" />
    </SvgIcon>
  );
}

export function TreeItemArrowDownIcon (props) {
  return (
    <SvgIcon viewBox="0 0 8 4" {...props}>
      <path d="M0.65625 0.65625H7.34375L4 4L0.65625 0.65625Z" fill="#989898" />
    </SvgIcon>
  );
}

export function TreeItemCurveIcon (props) {
  return (
    <SvgIcon viewBox="0 0 12 6" {...props}>
      <path d="M6 6C2.68629 6 0 3.31371 0 0H1C1 2.80391 3.19609 5 6 5V6Z" fill="#ffffff" />
      <path d="M6 5H11.5C11.7761 5 12 5.22386 12 5.5C12 5.77614 11.7761 6 11.5 6H6V5Z" fill="#ffffff" />
    </SvgIcon>
  );
}

export function TreeItemLineWithRadiusIcon (props) {
  return (
    <SvgIcon viewBox="0 0 6 6" {...props}>
      <path d="M0 0H1V8H0V0Z" fill="#ffffff" />
    </SvgIcon>
  );
}


export function SquareIcon (props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <rect width="20" height="20" fill={props.fillColor ? props.fillColor : "#FF7F99"} rx="5" />
    </SvgIcon>
  );
}