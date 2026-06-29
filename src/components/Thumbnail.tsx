import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {COLORS} from './Brand';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

export const Thumbnail: React.FC<{titulo: string}> = ({titulo}) => {
  const short = titulo.length > 55 ? titulo.slice(0, 52).replace(/\s\S+$/, '') + '…' : titulo;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden', fontFamily: anton}}>

      {/* Gradiente radial indigo no canto direito */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 70% 90% at 90% 50%, ${COLORS.gold}25 0%, transparent 65%)`,
      }} />

      {/* Grade de pontos */}
      <AbsoluteFill style={{
        backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Faixa lateral direita */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: 18,
        backgroundColor: COLORS.goldDeep,
      }} />

      {/* "?" decorativo grande — símbolo do canal */}
      <div style={{
        position: 'absolute',
        right: 60,
        top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: anton,
        fontSize: 340,
        color: COLORS.gold,
        opacity: 0.12,
        lineHeight: 1,
        userSelect: 'none',
      }}>?</div>

      {/* Logo INFO CLUB */}
      <div style={{
        position: 'absolute',
        top: 44,
        left: 64,
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{fontFamily: anton, fontSize: 30, color: COLORS.dark, letterSpacing: 2}}>INFO</span>
        <span style={{fontFamily: anton, fontSize: 30, color: COLORS.goldDeep, letterSpacing: 2, marginLeft: 8}}>CLUB</span>
      </div>

      {/* Linha separadora sob o logo */}
      <div style={{
        position: 'absolute',
        top: 88,
        left: 64,
        width: 180,
        height: 3,
        background: `linear-gradient(90deg, ${COLORS.goldDeep} 0%, transparent 100%)`,
        opacity: 0.5,
      }} />

      {/* Título principal */}
      <div style={{
        position: 'absolute',
        top: 108,
        left: 64,
        right: 160,
        bottom: 64,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: 105,
          lineHeight: 1.03,
          color: COLORS.dark,
          textTransform: 'uppercase',
          textShadow: '0 2px 10px rgba(30,27,75,0.10)',
          wordBreak: 'break-word',
        }}>
          {short.split(' ').map((word, i) => (
            <span key={i} style={{color: i === 0 ? COLORS.goldDeep : COLORS.dark}}>
              {word}{' '}
            </span>
          ))}
        </div>
      </div>

      {/* Linha inferior */}
      <div style={{
        position: 'absolute',
        bottom: 36,
        left: 64,
        right: 64,
        height: 2,
        background: `linear-gradient(90deg, ${COLORS.goldDeep}88 0%, transparent 100%)`,
      }} />

      {/* Tagline */}
      <div style={{
        position: 'absolute',
        bottom: 44,
        left: 64,
        fontFamily: inter,
        fontWeight: 600,
        fontSize: 18,
        color: COLORS.goldDeep,
        letterSpacing: 3,
        opacity: 0.8,
        textTransform: 'uppercase',
      }}>
        conhecimento nunca é demais
      </div>

    </AbsoluteFill>
  );
};
