// Identidade visual do canal Info Club.
// Tema claro: navy escuro + indigo + palette de seções vibrante.

export const COLORS = {
  dark: '#1E1B4B',       // navy — header bg, intro/outro bg, texto principal
  darkSoft: '#2D2D44',
  cream: '#FFFFFF',       // branco — texto sobre fundo escuro, card bg
  gold: '#818CF8',        // indigo-400 — accent brand (legível no escuro e claro)
  goldDeep: '#6366F1',    // indigo-500
  pirita: '#EF4444',
  ouro: '#10B981',
  misto: '#F59E0B',
  cyan: '#06B6D4',
  pink: '#EC4899',
  bg: '#F0F4FF',          // fundo principal dos vídeos
  bgCard: '#FFFFFF',      // fundo dos cards de seção
  textPrimary: '#1E1B4B', // texto sobre fundo claro
} as const;

export type Veredicto = 'OURO' | 'PIRITA' | 'MISTO';

export const verdictColor = (v: Veredicto) =>
  v === 'OURO' ? COLORS.ouro : v === 'PIRITA' ? COLORS.pirita : COLORS.misto;

export const FONT_DISPLAY = 'Anton'; // condensada, pesada — wordmark e veredicto
export const FONT_BODY = 'Inter'; // legendas e textos
