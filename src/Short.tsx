import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {VideoProps, Secao} from './schema';
import {AnimatedBackground} from './components/AnimatedBackground';
import {PhotoBackground} from './components/PhotoBackground';
import {Captions} from './components/Captions';
import {COLORS} from './components/Brand';

const anton = loadAnton().fontFamily;
const inter = loadInter().fontFamily;

const SEC_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const FullScreenSection: React.FC<{
  secao: Secao;
  color: string;
  foto?: string;
  durationInFrames: number;
}> = ({secao, color, foto, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, mass: 0.7}});
  const scale = interpolate(enter, [0, 1], [0.93, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, opacity}}>
      {foto ? (
        <>
          <PhotoBackground src={foto} durationInFrames={durationInFrames} />
          <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.58)'}} />
        </>
      ) : (
        <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      )}

      {/* Barra colorida no topo */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 12, backgroundColor: color}} />

      {/* Conteúdo centralizado */}
      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 36,
        padding: '0 72px 180px',
      }}>
        <div style={{fontSize: 120, lineHeight: 1}}>{secao.icone}</div>
        <div style={{
          fontFamily: anton,
          fontSize: width * 0.1,
          color: foto ? '#FFFFFF' : COLORS.textPrimary,
          textAlign: 'center',
          lineHeight: 1.1,
          borderBottom: `5px solid ${color}`,
          paddingBottom: 20,
          width: '100%',
          textShadow: foto ? '0 2px 12px rgba(0,0,0,0.7)' : 'none',
        }}>
          {secao.titulo}
        </div>
        {secao.pontos.map((ponto, i) => (
          <div key={i} style={{
            fontFamily: inter,
            fontWeight: 600,
            fontSize: width * 0.055,
            color: foto ? 'rgba(255,255,255,0.92)' : '#4338CA',
            textAlign: 'center',
            lineHeight: 1.4,
            textShadow: foto ? '0 1px 8px rgba(0,0,0,0.8)' : 'none',
          }}>
            • {ponto}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
    <div style={{
      position: 'absolute',
      bottom: '8%',
      left: 0, right: 0,
      textAlign: 'center',
      fontFamily: anton,
      fontSize: width * 0.1,
      color: COLORS.dark,
      letterSpacing: 4,
      opacity,
      textTransform: 'uppercase',
    }}>
      ↓ Se inscreva ↓
    </div>
  );
};

export const Short: React.FC<VideoProps> = ({audioSrc, captions, ganchoTexto, secoesShort, fotosShort}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const ganchoLen = Math.round(fps * 3);
  const subscribeLen = Math.round(fps * 3);
  const subscribeStart = durationInFrames - subscribeLen;

  const bodyStart = ganchoLen;
  const bodyEnd = subscribeStart;
  const bodyFrames = bodyEnd - bodyStart;
  const numSections = secoesShort.length || 1;
  const perSection = Math.floor(bodyFrames / numSections);

  const hasFotos = fotosShort && fotosShort.length > 0;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {!hasFotos && <AnimatedBackground />}
      <Audio src={staticFile(audioSrc)} />

      {secoesShort.map((secao, i) => (
        <Sequence key={i} from={bodyStart + i * perSection} durationInFrames={perSection}>
          <FullScreenSection
            secao={secao}
            color={SEC_COLORS[i % SEC_COLORS.length]}
            foto={hasFotos ? fotosShort[i] : undefined}
            durationInFrames={perSection}
          />
        </Sequence>
      ))}

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
