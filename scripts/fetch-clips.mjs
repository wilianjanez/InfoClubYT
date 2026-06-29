// Busca e baixa fotos do Pexels com base em foto_keywords do props.json.
// Uma foto por seção: fotos/longo/0.jpg … fotos/short/0.jpg
import fsp from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PUB = path.join(ROOT, 'public');

const fileExists = (p) => fsp.access(p).then(() => true).catch(() => false);

const searchPexelsPhoto = async (query, orientation) => {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error('Falta PEXELS_API_KEY');

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=${orientation}&size=large`;
  const res = await fetch(url, {headers: {Authorization: apiKey}});
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.photos || [];
};

const getPhotoUrl = (photo, isPortrait) => {
  const src = photo.src || {};
  // Prefere versão orientada, fallback para large/large2x
  return isPortrait
    ? (src.portrait || src.large2x || src.large)
    : (src.landscape || src.large2x || src.large);
};

const downloadPhoto = async (url, dest) => {
  if (await fileExists(dest)) {
    console.log(`[cache] ${path.relative(ROOT, dest)}`);
    return;
  }
  console.log(`Baixando foto: ${path.relative(ROOT, dest)}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download da foto falhou ${res.status}: ${url}`);
  await fsp.mkdir(path.dirname(dest), {recursive: true});
  const buf = Buffer.from(await res.arrayBuffer());
  await fsp.writeFile(dest, buf);
  console.log(`  -> ${(buf.length / 1024).toFixed(0)} KB`);
};

const fetchPhotosFor = async (keywords, format) => {
  const isPortrait = format === 'short';
  const orientation = isPortrait ? 'portrait' : 'landscape';
  const downloaded = [];

  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i];
    let photos = await searchPexelsPhoto(kw, orientation);

    // Fallback para landscape se portrait não encontrar
    if (!photos.length && isPortrait) {
      photos = await searchPexelsPhoto(kw, 'landscape');
    }

    if (!photos.length) {
      console.warn(`Pexels: sem resultado para "${kw}" (${orientation}) — seção ${i} ficará sem foto`);
      downloaded.push(null);
      continue;
    }

    const photoUrl = getPhotoUrl(photos[0], isPortrait);
    if (!photoUrl) {
      downloaded.push(null);
      continue;
    }

    const rel = `fotos/${format}/${i}.jpg`;
    await downloadPhoto(photoUrl, path.join(PUB, rel));
    downloaded.push(rel);
  }

  return downloaded;
};

const run = async () => {
  const props = JSON.parse(await fsp.readFile(path.join(ROOT, 'props.json'), 'utf8'));

  const keywordsLongo = props.foto_keywords || [];
  const keywordsShort = props.foto_keywords_short || [];

  if (!keywordsLongo.length && !keywordsShort.length) {
    console.log('props.json sem foto_keywords — pulando busca de fotos');
    return;
  }

  const fotosLongo = keywordsLongo.length ? await fetchPhotosFor(keywordsLongo, 'longo') : [];
  const fotosShort = keywordsShort.length ? await fetchPhotosFor(keywordsShort, 'short') : [];

  // Filtra nulls (seções sem foto ficam com string vazia)
  const updatedProps = {
    ...props,
    fotos_longo: fotosLongo.map((f) => f || ''),
    fotos_short: fotosShort.map((f) => f || ''),
  };

  await fsp.writeFile(path.join(ROOT, 'props.json'), JSON.stringify(updatedProps, null, 2));
  console.log(`Fotos: ${fotosLongo.filter(Boolean).length}/${fotosLongo.length} longo, ${fotosShort.filter(Boolean).length}/${fotosShort.length} short`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
