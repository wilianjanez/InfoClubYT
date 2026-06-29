// Lê temas/temas.xlsx, sorteia um tema com Status="fila" e escreve em props.json.
// Se props.json já tiver um "tema" definido (payload manual), pula a seleção.
import fsp from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const ROOT = process.cwd();
const SHEET_PATH = path.join(ROOT, 'temas', 'temas.xlsx');
const PROPS_PATH = path.join(ROOT, 'props.json');

// Normaliza cabeçalho para comparação sem acento/maiúsculas
const norm = (s) => (s || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const findCol = (header, ...keywords) =>
  header.findIndex((h) => keywords.some((k) => norm(h).includes(k)));

const run = async () => {
  // Se já tiver tema no props.json (disparado com payload completo), pula
  let props = {};
  try {
    props = JSON.parse(await fsp.readFile(PROPS_PATH, 'utf8'));
  } catch (_) {}

  if (props.tema) {
    console.log(`Tema já definido no payload: "${props.tema}" — pulando seleção automática`);
    return;
  }

  // Lê planilha
  const workbook = XLSX.readFile(SHEET_PATH);
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1, defval: ''});

  if (rows.length < 2) throw new Error('Planilha vazia ou sem dados');

  const header = rows[0];

  // Detecta colunas pelo nome do cabeçalho
  const colTema      = findCol(header, 'tema');
  const colPublicado = findCol(header, 'publicado');

  if (colTema < 0 || colPublicado < 0) {
    throw new Error(`Colunas necessárias não encontradas. Cabeçalhos detectados: ${header.join(', ')}`);
  }

  console.log(`Colunas detectadas — Tema: ${colTema} | Publicado: ${colPublicado}`);

  // Filtra linhas onde Publicado é falsy (false, "", 0 = ainda não publicado)
  const disponiveis = rows
    .slice(1)
    .map((row, i) => ({row, excelRow: i + 2}))
    .filter(({row}) => !row[colPublicado]);

  if (disponiveis.length === 0) {
    throw new Error('Nenhum tema disponível na planilha. Todos já foram publicados!');
  }

  console.log(`${disponiveis.length} tema(s) disponível(is)`);

  // Sorteia um aleatoriamente
  const {row, excelRow} = disponiveis[Math.floor(Math.random() * disponiveis.length)];

  const tema = row[colTema].toString().trim();

  // Gera row_id único para identificar esta linha
  props.row_id = String(excelRow);
  props.tema   = tema;

  await fsp.writeFile(PROPS_PATH, JSON.stringify(props, null, 2));
  console.log(`✅ Tema selecionado: "${tema}" (linha Excel ${excelRow})`);
};

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
