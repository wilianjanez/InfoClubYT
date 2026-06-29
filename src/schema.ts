import {z} from 'zod';

export const captionSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
});

export const secaoSchema = z.object({
  icone: z.string(),
  titulo: z.string(),
  pontos: z.array(z.string()),
});

export type Secao = z.infer<typeof secaoSchema>;

export const videoSchema = z.object({
  titulo: z.string(),
  audioSrc: z.string(),
  clips: z.array(z.string()),
  captions: z.array(captionSchema).default([]),
  audioDurationInSeconds: z.number().default(60),
  ganchoTexto: z.string().default(''),
  secoes: z.array(secaoSchema).default([]),
  secoesShort: z.array(secaoSchema).default([]),
});

export type VideoProps = z.infer<typeof videoSchema>;
export type Caption = z.infer<typeof captionSchema>;

export const FPS = 30;

export const thumbnailSchema = z.object({
  titulo: z.string().default('Título do Vídeo'),
});

export type ThumbnailProps = z.infer<typeof thumbnailSchema>;
