import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';

const anton = loadAnton().fontFamily;

// Cores do logo do canal
const CYAN   = '#00C8E8';
const ORANGE = '#FF8C00';
const PINK   = '#FF3D9A';
const GOLD   = '#FFB800';
const GREEN  = '#39D353';
const PURPLE = '#8B5CF6';

const BAR_COLORS = [CYAN, GREEN, GOLD, ORANGE, PINK, PURPLE];

// Divide o título para realçar a segunda metade em amarelo-laranja
const splitTitle = (titulo: string): [string, string] => {
  // Quebra após "?" se existir antes dos últimos 3 chars
  const qi = titulo.indexOf('?');
  if (qi > 4 && qi < titulo.length - 3) {
    return [titulo.slice(0, qi + 1).trim(), titulo.slice(qi + 1).trim()];
  }
  // Quebra após "!" da mesma forma
  const bi = titulo.indexOf('!');
  if (bi > 4 && bi < titulo.length - 3) {
    return [titulo.slice(0, bi + 1).trim(), titulo.slice(bi + 1).trim()];
  }
  // Quebra na metade das palavras
  const words = titulo.split(' ');
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};

export const Thumbnail: React.FC<{titulo: string}> = ({titulo}) => {
  const titleLen = titulo.length;
  const fontSize = titleLen > 55 ? 72 : titleLen > 38 ? 88 : titleLen > 24 ? 104 : 118;
  const [line1, line2] = splitTitle(titulo);

  return (
    <AbsoluteFill style={{backgroundColor: '#07070F', overflow: 'hidden', fontFamily: anton}}>

      {/* Barras laterais coloridas — inspiradas no gráfico de barras do logo */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 20,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {BAR_COLORS.map((c, i) => (
          <div key={i} style={{flex: 1, backgroundColor: c}} />
        ))}
      </div>

      {/* Glow suave atrás do texto */}
      <AbsoluteFill style={{
        background: [
          'radial-gradient(ellipse 55% 65% at 42% 50%, rgba(0,200,232,0.10) 0%, transparent 70%)',
          'radial-gradient(ellipse 35% 40% at 78% 30%, rgba(255,140,0,0.09) 0%, transparent 65%)',
        ].join(', '),
      }} />

      {/* Arco superior (inspirado no arco rosa do logo) */}
      <div style={{
        position: 'absolute',
        top: -2,
        left: 20,
        right: 0,
        height: 6,
        background: `linear-gradient(90deg, ${PINK} 0%, ${CYAN} 50%, transparent 100%)`,
      }} />

      {/* "?" decorativo — bem apagado no fundo */}
      <div style={{
        position: 'absolute',
        right: 30,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 480,
        color: '#FFFFFF',
        opacity: 0.03,
        lineHeight: 1,
        userSelect: 'none',
      }}>?</div>

      {/* Lâmpada — canto superior direito (elemento do logo) */}
      <div style={{
        position: 'absolute',
        top: 32,
        right: 72,
        fontSize: 64,
        opacity: 0.30,
      }}>💡</div>

      {/* Área do título */}
      <div style={{
        position: 'absolute',
        left: 58,
        right: 80,
        top: 0,
        bottom: 110,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 20px 0 48px',
        gap: 4,
      }}>
        {/* Linha 1 — branca */}
        <div style={{
          fontSize,
          color: '#FFFFFF',
          lineHeight: 1.06,
          textShadow: '0 3px 28px rgba(0,0,0,0.70)',
          textTransform: 'uppercase',
        }}>
          {line1}
        </div>

        {/* Linha 2 — amarelo-laranja (acento do logo) */}
        {line2 && (
          <div style={{
            fontSize,
            color: GOLD,
            lineHeight: 1.06,
            textShadow: `0 3px 28px rgba(0,0,0,0.70), 0 0 60px ${ORANGE}44`,
            textTransform: 'uppercase',
          }}>
            {line2}
          </div>
        )}
      </div>

      {/* Rodapé: linha gradiente + badge do canal */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 20, right: 0,
        height: 96,
        display: 'flex',
        alignItems: 'center',
        padding: '0 56px 0 52px',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Linha gradiente */}
        <div style={{
          height: 4,
          width: 260,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${CYAN}, ${ORANGE}, ${PINK})`,
        }} />

        {/* Logo do canal */}
        <Img
          src={staticFile('logo.png')}
          style={{height: 72, width: 72, objectFit: 'contain', borderRadius: 12}}
        />
      </div>

    </AbsoluteFill>
  );
};
