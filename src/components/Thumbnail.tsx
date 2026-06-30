import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {ThumbnailProps} from '../schema';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

const CYAN = '#00D4FF';
const GOLD = '#FFB800';
const BG   = '#07070F';

const adaptFontSize = (len: number) => {
  if (len > 60) return 76;
  if (len > 45) return 90;
  if (len > 30) return 106;
  return 120;
};

// Quebra no primeiro "?" / "!" ou na metade das palavras
const splitTitle = (titulo: string): [string, string] => {
  const upper = titulo.toUpperCase();
  for (const ch of ['?', '!']) {
    const i = upper.indexOf(ch);
    if (i > 4 && i < upper.length - 3) {
      return [upper.slice(0, i + 1).trim(), upper.slice(i + 1).trim()];
    }
  }
  const words = upper.split(' ');
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
};

export const Thumbnail: React.FC<ThumbnailProps> = ({titulo, foto}) => {
  const fs = adaptFontSize(titulo.length);
  const [line1, line2] = splitTitle(titulo);
  const hasPhoto = !!foto;

  return (
    <AbsoluteFill style={{backgroundColor: BG, overflow: 'hidden', fontFamily: anton}}>

      {/* Foto de fundo (quando disponível) */}
      {hasPhoto && (
        <Img
          src={staticFile(foto)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      )}

      {/* Gradiente: escuro à esquerda (texto), foto visível à direita */}
      <AbsoluteFill style={{
        background: hasPhoto
          ? 'linear-gradient(to right, rgba(7,7,15,0.97) 0%, rgba(7,7,15,0.88) 45%, rgba(7,7,15,0.45) 72%, rgba(7,7,15,0.10) 100%)'
          : [
              'radial-gradient(ellipse 55% 65% at 38% 52%, rgba(0,212,255,0.10) 0%, transparent 70%)',
              'radial-gradient(ellipse 35% 40% at 85% 30%, rgba(255,140,0,0.08) 0%, transparent 65%)',
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

      {/* Nome do canal — topo esquerdo */}
      <div style={{
        position: 'absolute',
        top: 40, left: 40,
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

      {/* Título principal */}
      <div style={{
        position: 'absolute',
        left: 40, right: hasPhoto ? 300 : 260,
        top: 100, bottom: 90,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px 0 32px',
      }}>
        <div style={{lineHeight: 1.05}}>
          <span style={{
            display: 'inline',
            fontSize: fs,
            color: CYAN,
            textShadow: `0 0 60px ${CYAN}55, 0 3px 24px rgba(0,0,0,0.9)`,
          }}>
            {line1}{' '}
          </span>
          {line2 && (
            <span style={{
              display: 'inline',
              fontSize: fs,
              color: '#FFFFFF',
              textShadow: '0 3px 24px rgba(0,0,0,0.9)',
            }}>
              {line2}
            </span>
          )}
        </div>
      </div>

      {/* Badge "VOCÊ SABIA?" */}
      <div style={{
        position: 'absolute',
        right: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: `3px solid ${GOLD}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: hasPhoto ? '0 8px 32px rgba(0,0,0,0.6)' : 'none',
      }}>
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
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.70)',
          width: '100%',
          textAlign: 'center',
          padding: '14px 10px',
        }}>
          <span style={{fontSize: 72, lineHeight: 1}}>💡</span>
        </div>
      </div>

      {/* Rodapé: linha + tagline */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 20, right: 0,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        padding: '0 52px',
        gap: 20,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          height: 4, width: 220, borderRadius: 2, flexShrink: 0,
          background: `linear-gradient(90deg, ${CYAN}, #8B5CF6, #FF3D9A)`,
        }} />
        <span style={{
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 17,
          color: 'rgba(255,255,255,0.30)',
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}>
          conhecimento nunca é demais
        </span>
      </div>

    </AbsoluteFill>
  );
};
