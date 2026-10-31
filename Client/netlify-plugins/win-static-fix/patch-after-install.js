const fs = require('fs');
const path = require('path');
function patch(file) {
  if (!fs.existsSync(file)) return false;
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('WIN_STATIC_FIX')) {
    console.log('already patched', file);
    return true;
  }
  const to = `var publishStaticDir = async (ctx) => {
  try {
    // WIN_STATIC_FIX: avoid Windows rename locks by copy+rm
    const { cp } = require('fs/promises');
    await rm(ctx.tempPublishDir, { recursive: true, force: true });
    await mkdir(ctx.tempPublishDir, { recursive: true });
    await cp(ctx.publishDir, ctx.tempPublishDir, { recursive: true, force: true });
    await rm(ctx.publishDir, { recursive: true, force: true });
    await mkdir(ctx.publishDir, { recursive: true });
    await cp(ctx.staticDir, ctx.publishDir, { recursive: true, force: true });
    await rm(ctx.staticDir, { recursive: true, force: true });
  } catch (error) {
    console.error('WIN_STATIC_FIX error', error);
    ctx.failBuild("Failed publishing static content", error instanceof Error ? { error } : {});
  }
};`;
  if (!/var publishStaticDir = async \(ctx\) => \{[\s\S]*?\n\};/.test(c)) {
    console.log('pattern missing', file);
    return false;
  }
  c = c.replace(/var publishStaticDir = async \(ctx\) => \{[\s\S]*?\n\};/, to);
  fs.writeFileSync(file, c);
  console.log('patched', file);
  return true;
}
const roots = [
  path.join(process.cwd(), '.netlify/plugins/node_modules/@netlify/plugin-nextjs/dist/build/content/static.js'),
  path.join(process.cwd(), 'node_modules/@netlify/plugin-nextjs/dist/build/content/static.js'),
];
let ok = false;
for (const f of roots) ok = patch(f) || ok;
if (!ok) {
  console.log('searching for static.js...');
  const { execSync } = require('child_process');
  try {
    const out = execSync('dir /s /b static.js', { cwd: path.join(process.cwd(), '.netlify'), encoding: 'utf8' });
    for (const line of out.split(/\r?\n/).filter(Boolean)) {
      if (line.includes('plugin-nextjs') && line.includes('content')) ok = patch(line.trim()) || ok;
    }
  } catch (_) {}
}
if (!ok) console.warn('win-static-fix: could not find plugin static.js');
