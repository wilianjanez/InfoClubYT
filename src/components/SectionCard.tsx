import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {Secao} from '../schema';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

export const SectionCard: React.FC<{
  secao: Secao;
  color: string;
  durationInFrames: number;
  variant: 'longo' | 'short';
  index?: number;
  total?: number;
}> = ({secao, color, durationInFrames, variant, index = 0, total = 1}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();

  const ENTER = 22;
  const EXIT  = 18;
  const exitStart = Math.max(ENTER, durationInFrames - EXIT);

  // Entrada: sobe + aparece
  const enterY  = interpolate(frame, [0, ENTER],  [60, 0],  {extrapolateRight: 'clamp'});
  const enterOp = interpolate(frame, [0, ENTER],  [0, 1],   {extrapolateRight: 'clamp'});

  // Saída: sobe + some
  const exitY  = interpolate(frame, [exitStart, exitStart + EXIT], [0, -40],  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exitOp = interpolate(frame, [exitStart, exitStart + EXIT], [1, 0],    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const translateY = enterY + exitY;
  const opacity    = enterOp * exitOp;

  const isShort = variant === 'short';

  const titleSize    = isShort ? Math.round(width * 0.078) : 44;
  const pointSize    = isShort ? Math.round(width * 0.046) : 22;
  const iconFontSize = isShort ? 80 : 52;
  const hPad         = isShort ? 56 : 72;
  const bottomPad    = isShort ? 220 : 160;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', padding: `0 ${hPad}px ${bottomPad}px`}}>
      <div style={{transform: `translateY(${translateY}px)`, opacity}}>

        {/* Indicador de progresso: linha colorida + "01 / 05" */}
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14}}>
          <div style={{width: 44, height: 4, borderRadius: 2, backgroundColor: color, flexShrink: 0}} />
          <span style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: isShort ? 26 : 17,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: 3,
          }}>
            {String(index + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Card em vidro */}
        <div style={{
          backgroundColor: 'rgba(8,8,24,0.52)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.13)',
          borderLeft: `6px solid ${color}`,
          padding: isShort ? '32px 44px' : '26px 36px',
        }}>

          {/* Ícone + título */}
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 14}}>
            <span style={{fontSize: iconFontSize, lineHeight: 1, flexShrink: 0}}>
              {secao.icone}
            </span>
            <div style={{
              fontFamily: anton,
              fontSize: titleSize,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: 0.5,
              textShadow: '0 3px 18px rgba(0,0,0,0.65)',
            }}>
              {secao.titulo}
            </div>
          </div>

          {/* Pontos */}
          {secao.pontos.map((ponto, i) => (
            <div key={i} style={{
              fontFamily: inter,
              fontWeight: 600,
              fontSize: pointSize,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.45,
              marginTop: i === 0 ? 0 : 8,
              paddingLeft: iconFontSize + 20,
              textShadow: '0 1px 8px rgba(0,0,0,0.75)',
            }}>
              • {ponto}
            </div>
          ))}

        </div>
      </div>
    </AbsoluteFill>
  );
};
