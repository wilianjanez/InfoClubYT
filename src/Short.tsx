import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {VideoProps} from './schema';
import {AnimatedBackground} from './components/AnimatedBackground';
import {PhotoBackground} from './components/PhotoBackground';
import {SectionCard} from './components/SectionCard';
import {Captions} from './components/Captions';
import {COLORS} from './components/Brand';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

const SEC_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const BottomGradient: React.FC = () => (
  <AbsoluteFill style={{
    background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 48%, rgba(0,0,0,0) 72%)',
    pointerEvents: 'none',
  }} />
);

const Gancho: React.FC<{texto: string}> = ({texto}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18}});
  const opacity = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  if (!texto) return null;
  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.dark,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 80px',
      opacity: interpolate(enter, [0, 1], [0, 1]),
    }}>
      <div style={{
        fontFamily: anton,
        fontSize: width * 0.095,
        color: COLORS.cream,
        textAlign: 'center',
        lineHeight: 1.1,
        opacity,
      }}>
        {texto}<span style={{color: COLORS.gold}}> ?</span>
      </div>
    </AbsoluteFill>
  );
};

const SubscribeTag: React.FC = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.dark,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        fontFamily: anton,
        fontSize: width * 0.1,
        color: COLORS.cream,
        letterSpacing: 4,
        opacity,
        textTransform: 'uppercase',
      }}>
        ↓ Se inscreva ↓
      </div>
    </AbsoluteFill>
  );
};

export const Short: React.FC<VideoProps> = ({audioSrc, captions, ganchoTexto, secoesShort, fotosShort}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const ganchoLen    = Math.round(fps * 3);
  const subscribeLen = Math.round(fps * 3);
  const subscribeStart = durationInFrames - subscribeLen;

  const bodyStart  = ganchoLen;
  const bodyEnd    = subscribeStart;
  const bodyFrames = bodyEnd - bodyStart;
  const numSections = secoesShort.length || 1;
  const perSection  = Math.floor(bodyFrames / numSections);

  const hasFotos = fotosShort && fotosShort.length > 0;

  return (
    <AbsoluteFill>
      {!hasFotos && <AnimatedBackground />}
      <Audio src={staticFile(audioSrc)} />

      {/* Seções: uma por vez com foto + gradiente + glass card */}
      {secoesShort.map((secao, i) => {
        const fromFrame = bodyStart + i * perSection;
        const isLast = i === secoesShort.length - 1;
        const dur = isLast ? (bodyEnd - fromFrame) : perSection;
        const foto = hasFotos ? fotosShort[i] : undefined;
        const color = SEC_COLORS[i % SEC_COLORS.length];

        return (
          <Sequence key={i} from={fromFrame} durationInFrames={dur}>
            {foto
              ? <PhotoBackground src={foto} durationInFrames={dur} />
              : <AnimatedBackground />
            }
            {/* Barra colorida no topo */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 10,
              backgroundColor: color,
              zIndex: 2,
            }} />
            <BottomGradient />
            <SectionCard
              secao={secao}
              color={color}
              durationInFrames={dur}
              variant="short"
              index={i}
              total={secoesShort.length}
            />
          </Sequence>
        );
      })}

      <Sequence durationInFrames={ganchoLen}>
        <Gancho texto={ganchoTexto} />
      </Sequence>

      <Captions captions={captions} variant="short" />

      <Sequence from={subscribeStart} durationInFrames={subscribeLen}>
        <SubscribeTag />
      </Sequence>
    </AbsoluteFill>
  );
};
