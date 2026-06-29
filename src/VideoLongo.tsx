import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {VideoProps} from './schema';
import {AnimatedBackground} from './components/AnimatedBackground';
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
}) => {
  const {fps, durationInFrames} = useVideoConfig();

  const introLen = Math.round(fps * 1.6);
  const outroLen = Math.round(fps * 4);

  const bodyStart = introLen;
  const bodyEnd = durationInFrames - outroLen;
  const bodyFrames = bodyEnd - bodyStart;
  const numSections = secoes.length || 1;
  const perSection = Math.floor(bodyFrames / numSections);

  return (
    <AbsoluteFill>
      <AnimatedBackground />
      <Audio src={staticFile(audioSrc)} />

      {/* Header escuro com logo + título */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 100,
        backgroundColor: COLORS.dark,
        display: 'flex',
        alignItems: 'center',
        padding: '0 56px',
        gap: 20,
        zIndex: 2,
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

      {/* Seções empilhadas, aparecem progressivamente */}
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
      }}>
        {secoes.map((secao, i) => (
          <InfoSection
            key={i}
            secao={secao}
            startFrame={bodyStart + i * perSection}
            color={SEC_COLORS[i % SEC_COLORS.length]}
            variant="longo"
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
