import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {VideoProps} from './schema';
import {AnimatedBackground} from './components/AnimatedBackground';
import {PhotoBackground} from './components/PhotoBackground';
import {Captions} from './components/Captions';
import {Intro, Outro} from './components/Chrome';
import {InfoSection} from './components/InfoSection';
import {COLORS} from './components/Brand';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

const SEC_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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
  const bodyEnd = durationInFrames - outroLen;
  const bodyFrames = bodyEnd - bodyStart;
  const numSections = secoes.length || 1;
  const perSection = Math.floor(bodyFrames / numSections);

  const hasPhotos = fotos && fotos.length > 0;

  return (
    <AbsoluteFill>
      {/* Fallback para intro/outro — fotos cobrem durante o body */}
      <AnimatedBackground />

      {/* Foto de fundo por seção (Ken Burns) */}
      {hasPhotos && secoes.map((_, i) => {
        const foto = fotos[i];
        if (!foto) return null;
        const fromFrame = bodyStart + i * perSection;
        // Última seção estende até o fim do body para evitar flash
        const dur = i < secoes.length - 1 ? perSection + 15 : bodyEnd - fromFrame;
        return (
          <Sequence key={i} from={fromFrame} durationInFrames={dur}>
            <PhotoBackground src={foto} durationInFrames={dur} />
          </Sequence>
        );
      })}

      {/* Overlay escuro para legibilidade durante o body */}
      {hasPhotos && (
        <Sequence from={bodyStart} durationInFrames={bodyEnd - bodyStart}>
          <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.52)'}} />
        </Sequence>
      )}

      <Audio src={staticFile(audioSrc)} />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 100,
        backgroundColor: COLORS.dark,
        display: 'flex',
        alignItems: 'center',
        padding: '0 56px',
        gap: 20,
        zIndex: 10,
      }}>
        <div style={{fontFamily: anton, fontSize: 26, color: COLORS.cream, letterSpacing: 1, flexShrink: 0}}>
          INFO<span style={{color: COLORS.gold}}> CLUB</span>
        </div>
        <div style={{width: 2, height: 28, backgroundColor: COLORS.gold, opacity: 0.5, flexShrink: 0}} />
        <div style={{
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 22,
          color: COLORS.cream,
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          {titulo}
        </div>
      </div>

      {/* Seções infográficas com cards progressivos */}
      <div style={{
        position: 'absolute',
        top: 112,
        left: 56,
        right: 56,
        bottom: 96,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        justifyContent: 'center',
        zIndex: 5,
      }}>
        {secoes.map((secao, i) => (
          <InfoSection
            key={i}
            secao={secao}
            startFrame={bodyStart + i * perSection}
            color={SEC_COLORS[i % SEC_COLORS.length]}
            variant="longo"
            onPhoto={hasPhotos}
          />
        ))}
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
