import { writeFile } from 'node:fs/promises';
import { siHostinger, siClaudecode } from 'simple-icons';
const icons = ['html5', 'css3', 'javascript', 'python', 'react', 'astro', 'django', 'fastapi', 'wordpress'];
await Promise.all(icons.map(async name => {
  const url = `https://raw.githubusercontent.com/devicons/devicon/master/icons/${name}/${name}-${name === 'django' ? 'plain' : 'original'}.svg`;
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  await writeFile(`public/technologies/${name}.svg`, await response.text());
  console.log(`${name}: downloaded original color asset`);
}));
const codexUrl = 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/codex-color.svg';
const codex = await fetch(codexUrl, { signal: AbortSignal.timeout(20000) });
if (!codex.ok) throw new Error(`Codex: ${codex.status}`);
await writeFile('public/technologies/codex.svg', await codex.text());
for (const [name, icon] of [['hostinger', siHostinger], ['claudecode', siClaudecode]]) {
  await writeFile(`public/technologies/${name}.svg`, icon.svg.replace('<svg ', `<svg fill="#${icon.hex}" `));
  console.log(name, icon.hex);
}
