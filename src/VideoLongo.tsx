import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {VideoProps} from './schema';
import {AnimatedBackground} from './components/AnimatedBackground';
import {PhotoBackground} from './components/PhotoBackground';
import {SectionCard} from './components/SectionCard';
import {Captions} from './components/Captions';
import {Intro, Outro} from './components/Chrome';
import {COLORS} from './components/Brand';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

const SEC_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

// Gradiente escuro na base — deixa o card legível sem escurecer a foto inteira
const BottomGradient: React.FC = () => (
  <AbsoluteFill style={{
    background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.40) 42%, rgba(0,0,0,0) 68%)',
    pointerEvents: 'none',
  }} />
);

export const VideoLongo: React.FC<VideoProps> = ({
  titulo,
  audioSrc,
  captions,
  secoes,
  fotos,
}) => {
  const {fps, durationInFrames} = useVideoConfig();

  const introLen = Math.round(fps * 1.6);
  const outroLen = Math.round(fps * 4);
  const bodyStart = introLen;
  const bodyEnd   = durationInFrames - outroLen;
  const bodyFrames = bodyEnd - bodyStart;
  const numSections = secoes.length || 1;
  const perSection  = Math.floor(bodyFrames / numSections);

  return (
    <AbsoluteFill>
      {/* Fundo de fallback (visível durante intro/outro e quando não há foto) */}
      <AnimatedBackground />

      <Audio src={staticFile(audioSrc)} />

      {/* Uma seção por vez: foto + gradiente + card */}
      {secoes.map((secao, i) => {
        const fromFrame = bodyStart + i * perSection;
        const isLast = i === secoes.length - 1;
        const dur = isLast ? (bodyEnd - fromFrame) : perSection;
        const foto = fotos?.[i];

        return (
          <Sequence key={i} from={fromFrame} durationInFrames={dur}>
            {foto
              ? <PhotoBackground src={foto} durationInFrames={dur} />
              : <AnimatedBackground />
            }
            <BottomGradient />
            <SectionCard
              secao={secao}
              color={SEC_COLORS[i % SEC_COLORS.length]}
              durationInFrames={dur}
              variant="longo"
              index={i}
              total={secoes.length}
            />
          </Sequence>
        );
      })}

      {/* Header semi-transparente — permanece sobre tudo */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 88,
        background: 'linear-gradient(to bottom, rgba(12,10,50,0.95) 0%, rgba(12,10,50,0.65) 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 56px',
        gap: 20,
        zIndex: 10,
      }}>
        <div style={{fontFamily: anton, fontSize: 26, color: COLORS.cream, letterSpacing: 1, flexShrink: 0}}>
          INFO<span style={{color: COLORS.gold}}> CLUB</span>
        </div>
        <div style={{width: 2, height: 26, backgroundColor: COLORS.gold, opacity: 0.45, flexShrink: 0}} />
        <div style={{
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 21,
          color: 'rgba(255,255,255,0.88)',
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          {titulo}
        </div>
      </div>

      <Captions captions={captions} variant="longo" />

      <Sequence durationInFrames={introLen}>
        <Intro />
      </Sequence>

      <Sequence from={durationInFrames - outroLen} durationInFrames={outroLen}>
        <Outro />
        <Audio src={staticFile('audio/cta.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};
