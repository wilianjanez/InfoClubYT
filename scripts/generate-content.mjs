// Gera roteiro, títulos, gancho e keywords de clipes usando Claude.
// Lê props.json (precisa de "tema" e "veredicto"), escreve de volta com os campos gerados.
import Anthropic from '@anthropic-ai/sdk';
import fsp from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const run = async () => {
  const props = JSON.parse(await fsp.readFile(path.join(ROOT, 'props.json'), 'utf8'));

  if (!props.tema) {
    console.log('props.json sem "tema" — pulando geração de conteúdo');
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Falta ANTHROPIC_API_KEY');

  const client = new Anthropic({apiKey});
  const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

  const prompt = `Você é roteirista sênior do canal "Info Club" — curiosidades surpreendentes sobre o mundo para jovens brasileiros.
Use linguagem jovial, animada e acessível — como se estivesse contando um segredo empolgante para um amigo. Frases curtas, exclamações, perguntas retóricas. Nada de formalidade!

TEMA: ${props.tema}

Retorne APENAS um objeto JSON válido, sem markdown, com estes campos:

{
  "titulo_longo": "título do vídeo longo para YouTube (máx 70 chars, curioso e chamativo)",
  "titulo_short": "título do Short (máx 50 chars, termina com #shorts)",
  "gancho_short": "frase de abertura impactante (máx 65 chars, ex: 'Você sabia que...' — desperta curiosidade imediata)",
  "descricao_youtube_longo": "descrição do vídeo longo (2-3 parágrafos energéticos, CTA para inscrição, hashtags: #curiosidades #infoclub #sabiaque #fatos #conhecimento)",
  "descricao_youtube_short": "descrição do Short (1 parágrafo animado + hashtags #shorts #curiosidades #infoclub #sabiaque)",
  "tags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8"],
  "roteiro_longo": "roteiro completo da narração, ~3-4 minutos (450-600 palavras). Tom jovial, empolgante, conversacional PT-BR. NÃO inclua saudação inicial nem encerramento — são inseridos automaticamente. Explore o tema de forma surpreendente, traga dados reais e curiosos, quebre expectativas. Use frases curtas e exclamações.",
  "roteiro_short": "narração do Short, ~40-50 segundos (80-110 palavras). Abre respondendo o gancho de forma surpreendente, desenvolve o ponto central em 2-3 frases energéticas, encerra com fato marcante. PT-BR jovial.",
  "secoes": [
    {"icone": "🌍", "titulo": "TÍTULO DA SEÇÃO 1", "pontos": ["Fato curioso e direto", "Dado surpreendente"]},
    {"icone": "💡", "titulo": "TÍTULO DA SEÇÃO 2", "pontos": ["Fato curioso e direto", "Dado surpreendente"]},
    {"icone": "🔬", "titulo": "TÍTULO DA SEÇÃO 3", "pontos": ["Fato curioso e direto", "Dado surpreendente"]},
    {"icone": "⚡", "titulo": "TÍTULO DA SEÇÃO 4", "pontos": ["Fato curioso e direto", "Dado surpreendente"]},
    {"icone": "🎯", "titulo": "TÍTULO DA SEÇÃO 5", "pontos": ["Fato curioso e direto", "Dado surpreendente"]}
  ],
  "secoes_short": [
    {"icone": "🤯", "titulo": "TÍTULO IMPACTANTE", "pontos": ["Um único fato direto e impactante"]},
    {"icone": "💥", "titulo": "TÍTULO IMPACTANTE", "pontos": ["Um único fato direto e impactante"]},
    {"icone": "🧠", "titulo": "VOCÊ SABIA?", "pontos": ["Conclusão surpreendente em uma frase"]}
  ],
  "foto_keywords": ["termo de busca em inglês para seção 1", "seção 2", "seção 3", "seção 4", "seção 5"],
  "foto_keywords_short": ["termo para short seção 1", "short seção 2", "short seção 3"]
}

Regras de foto_keywords: 1-3 palavras em INGLÊS cada, descrevem a imagem ideal para a seção (ex: "ant colony underground", "bioluminescent ocean"). Evite palavras abstratas; prefira cenas, objetos ou lugares visuais e fotogênicos. secoes_short tem exatamente 3 entradas em foto_keywords_short.

Demais regras: português brasileiro coloquial. Títulos das seções em CAIXA ALTA (3-5 palavras). Pontos curtos (máx 12 palavras cada). Emojis temáticos e variados. secoes_short tem exatamente 3 seções com 1 ponto cada.`;

  console.log(`Gerando conteúdo para: "${props.tema}" [${model}]...`);
  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [{role: 'user', content: prompt}],
  });

  const text = message.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Claude não retornou JSON válido:\n${text}`);

  const content = JSON.parse(jsonMatch[0]);

  const updatedProps = {
    ...props,
    titulo_longo: content.titulo_longo,
    titulo_short: content.titulo_short,
    gancho_short: content.gancho_short,
    descricao_youtube_longo: content.descricao_youtube_longo,
    descricao_youtube_short: content.descricao_youtube_short,
    tags: content.tags,
    roteiro_longo: content.roteiro_longo,
    roteiro_short: content.roteiro_short,
    secoes: content.secoes || [],
    secoes_short: content.secoes_short || [],
    foto_keywords: content.foto_keywords || [],
    foto_keywords_short: content.foto_keywords_short || [],
  };

  await fsp.mkdir(path.join(ROOT, 'build'), {recursive: true});
  await fsp.writeFile(path.join(ROOT, 'props.json'), JSON.stringify(updatedProps, null, 2));
  console.log('Conteúdo gerado:', content.titulo_longo);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
