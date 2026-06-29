import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from './Brand';

export const AnimatedBackground: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
    <AbsoluteFill style={{
      backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.07) 1px, transparent 1px)',
      backgroundSize: '36px 36px',
    }} />
  </AbsoluteFill>
);
