import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {Secao} from '../schema';
import {COLORS} from './Brand';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

export const InfoSection: React.FC<{
  secao: Secao;
  startFrame: number;
  color: string;
  variant: 'longo' | 'short';
  onPhoto?: boolean;
}> = ({secao, startFrame, color, variant, onPhoto = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enter = spring({frame: relFrame, fps, config: {damping: 18, mass: 0.7, stiffness: 130}});
  const translateX = interpolate(enter, [0, 1], [-80, 0]);
  const opacity = interpolate(Math.min(relFrame, 12), [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  const isShort = variant === 'short';
  const iconSize = isShort ? 72 : 56;
  const titleSize = isShort ? 32 : 24;
  const pointSize = isShort ? 26 : 18;

  const cardBg = onPhoto ? 'rgba(255,255,255,0.93)' : COLORS.bgCard;
  const titleColor = COLORS.textPrimary;
  const pointColor = onPhoto ? '#3730A3' : '#4338CA';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: isShort ? 28 : 20,
      padding: isShort ? '24px 32px' : '16px 22px',
      backgroundColor: cardBg,
      borderRadius: 18,
      borderLeft: `8px solid ${color}`,
      boxShadow: onPhoto ? '0 8px 32px rgba(0,0,0,0.45)' : '0 4px 20px rgba(30,27,75,0.10)',
      transform: `translateX(${translateX}px)`,
      opacity,
      backdropFilter: onPhoto ? 'blur(2px)' : undefined,
    }}>
      <div style={{
        width: iconSize, height: iconSize,
        borderRadius: 14,
        backgroundColor: color + '20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isShort ? 36 : 28,
        flexShrink: 0,
      }}>
        {secao.icone}
      </div>
      <div style={{flex: 1}}>
        <div style={{
          fontFamily: anton,
          fontSize: titleSize,
          color: titleColor,
          letterSpacing: 0.5,
          marginBottom: 5,
        }}>
          {secao.titulo}
        </div>
        {secao.pontos.map((ponto, i) => (
          <div key={i} style={{
            fontFamily: inter,
            fontWeight: 500,
            fontSize: pointSize,
            color: pointColor,
            lineHeight: 1.35,
            marginTop: 2,
          }}>
            • {ponto}
          </div>
        ))}
      </div>
    </div>
  );
};
