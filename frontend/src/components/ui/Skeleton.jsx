import React from 'react';
import './Skeleton.css';

export default function Skeleton({ width = '100%', height = 12, className = '' }) {
  const style = { width, height: typeof height === 'number' ? `${height}px` : height };
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}
