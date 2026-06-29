import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

const CYAN   = '#00D4FF';
const GOLD   = '#FFB800';
const BG     = '#080C18';

// Quebra o título em palavras e identifica a primeira como destaque
const parseTitle = (titulo: string) => {
  const upper = titulo.toUpperCase();
  const spaceIdx = upper.indexOf(' ');
  if (spaceIdx < 0) return {firstWord: upper, rest: ''};
  return {
    firstWord: upper.slice(0, spaceIdx),
    rest: upper.slice(spaceIdx + 1),
  };
};

// Fonte adaptativa ao comprimento do título
const adaptFontSize = (titulo: string) => {
  const len = titulo.length;
  if (len > 60) return 78;
  if (len > 45) return 92;
  if (len > 30) return 108;
  return 124;
};

export const Thumbnail: React.FC<{titulo: string}> = ({titulo}) => {
  const {firstWord, rest} = parseTitle(titulo);
  const fs = adaptFontSize(titulo);

  return (
    <AbsoluteFill style={{backgroundColor: BG, overflow: 'hidden', fontFamily: anton}}>

      {/* Gradiente lateral direito — cria profundidade */}
      <AbsoluteFill style={{
        background: [
          `radial-gradient(ellipse 50% 80% at 95% 50%, rgba(0,212,255,0.12) 0%, transparent 65%)`,
          `radial-gradient(ellipse 40% 60% at 10% 50%, rgba(139,92,246,0.09) 0%, transparent 65%)`,
        ].join(', '),
      }} />

      {/* Linha vertical esquerda — sotaque fino */}
      <div style={{
        position: 'absolute',
        left: 0, top: 60, bottom: 60,
        width: 6,
        background: `linear-gradient(to bottom, ${CYAN}, #8B5CF6, ${CYAN})`,
        borderRadius: '0 4px 4px 0',
      }} />

      {/* Nome do canal — topo esquerdo, discreto */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <Img
          src={staticFile('logo.png')}
          style={{height: 44, width: 44, objectFit: 'contain', borderRadius: 8}}
        />
        <span style={{
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 22,
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}>
          Info Club
        </span>
      </div>

      {/* Título principal — ocupa a maior parte da tela */}
      <div style={{
        position: 'absolute',
        left: 40,
        right: 260,
        top: 100,
        bottom: 90,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px 0 32px',
      }}>
        <div style={{lineHeight: 1.05}}>
          {/* Primeira palavra em ciano — chama atenção */}
          <span style={{
            display: 'inline',
            fontSize: fs,
            color: CYAN,
            textShadow: `0 0 60px ${CYAN}55, 0 3px 24px rgba(0,0,0,0.8)`,
          }}>
            {firstWord}{' '}
          </span>
          {/* Resto em branco */}
          <span style={{
            display: 'inline',
            fontSize: fs,
            color: '#FFFFFF',
            textShadow: '0 3px 24px rgba(0,0,0,0.8)',
          }}>
            {rest}
          </span>
        </div>
      </div>

      {/* Badge "VOCÊ SABIA?" — lado direito */}
      <div style={{
        position: 'absolute',
        right: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 190,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `3px solid ${GOLD}`,
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {/* Topo do badge */}
        <div style={{
          backgroundColor: GOLD,
          width: '100%',
          textAlign: 'center',
          padding: '6px 0',
        }}>
          <span style={{
            fontFamily: inter,
            fontWeight: 900,
            fontSize: 16,
            color: '#07070F',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            Você Sabia?
          </span>
        </div>
        {/* Corpo do badge */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.75)',
          width: '100%',
          textAlign: 'center',
          padding: '14px 10px',
        }}>
          <span style={{
            fontSize: 80,
            lineHeight: 1,
          }}>💡</span>
        </div>
      </div>

      {/* Tagline — rodapé */}
      <div style={{
        position: 'absolute',
        bottom: 34,
        left: 40,
        fontFamily: inter,
        fontWeight: 700,
        fontSize: 18,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: 3,
        textTransform: 'uppercase',
      }}>
        conhecimento nunca é demais
      </div>

    </AbsoluteFill>
  );
};
