import React from 'react';
import {Composition, Still} from 'remotion';
import {VideoLongo} from './VideoLongo';
import {Short} from './Short';
import {Thumbnail} from './components/Thumbnail';
import {videoSchema, thumbnailSchema, VideoProps, FPS} from './schema';

const defaults: VideoProps = {
  titulo: 'Exemplo',
  audioSrc: 'audio/longo.mp3',
  clips: [],
  captions: [],
  audioDurationInSeconds: 60,
  ganchoTexto: '',
  secoes: [],
  secoesShort: [],
};

// duracao = duracao do audio (+ pequena folga p/ outro respirar)
const durationFrom = (props: VideoProps, extraSeconds: number) =>
  Math.max(FPS, Math.ceil((props.audioDurationInSeconds + extraSeconds) * FPS));

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoLongo"
        component={VideoLongo}
        schema={videoSchema}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={defaults}
        durationInFrames={1800}
        calculateMetadata={({props}) => ({durationInFrames: durationFrom(props, 0.5)})}
      />
      <Composition
        id="Short"
        component={Short}
        schema={videoSchema}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{...defaults, audioSrc: 'audio/short.mp3'}}
        durationInFrames={1800}
        calculateMetadata={({props}) => ({durationInFrames: durationFrom(props, 0.2)})}
      />
      <Still
        id="ThumbnailLongo"
        component={Thumbnail}
        schema={thumbnailSchema}
        width={1280}
        height={720}
        defaultProps={{titulo: 'Por que o céu é azul?'}}
      />
      <Still
        id="ThumbnailShort"
        component={Thumbnail}
        schema={thumbnailSchema}
        width={1280}
        height={720}
        defaultProps={{titulo: 'Por que dormimos?'}}
      />
    </>
  );
};
