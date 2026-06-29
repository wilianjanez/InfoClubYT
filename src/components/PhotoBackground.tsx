import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const PhotoBackground: React.FC<{
  src: string;
  durationInFrames: number;
}> = ({src, durationInFrames}) => {
  const frame = useCurrentFrame();
  const progress = durationInFrames > 0 ? Math.min(frame / durationInFrames, 1) : 0;

  // Ken Burns: slow zoom in + lateral pan
  const scale = 1.0 + 0.12 * progress;
  const translateX = -2 + 4 * progress;

  // Fade in on section start
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity}}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateX(${translateX}%)`,
          transformOrigin: 'center center',
        }}
      />
    </AbsoluteFill>
  );
};
