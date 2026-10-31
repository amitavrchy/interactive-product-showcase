module.exports = {
  onPreBuild: async ({ utils }) => {
    const fs = require('fs');
    const path = require('path');
    const candidates = [
      path.join(process.cwd(), '.netlify/plugins/node_modules/@netlify/plugin-nextjs/dist/build/content/static.js'),
      path.join(process.cwd(), 'node_modules/@netlify/plugin-nextjs/dist/build/content/static.js'),
    ];
    for (const file of candidates) {
      if (!fs.existsSync(file)) continue;
      let c = fs.readFileSync(file, 'utf8');
      if (c.includes('WIN_STATIC_FIX')) {
        console.log('win-static-fix already applied', file);
        return;
      }
      const from = `var publishStaticDir = async (ctx) => {
  try {
    await rm(ctx.tempPublishDir, { recursive: true, force: true });
    await mkdir(basename(ctx.tempPublishDir), { recursive: true });
    await rename(ctx.publishDir, ctx.tempPublishDir);
    await rename(ctx.staticDir, ctx.publishDir);
  } catch (error) {
    ctx.failBuild("Failed publishing static content", error instanceof Error ? { error } : {});
  }
};`;
      const to = `var publishStaticDir = async (ctx) => {
  try {
    // WIN_STATIC_FIX: avoid Windows rename locks by copy+rm
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
      if (!c.includes('Failed publishing static content')) {
        console.log('pattern missing in', file);
        continue;
      }
      if (!c.includes(from)) {
        // looser replace of the two rename lines in publishStaticDir
        c = c.replace(
          /var publishStaticDir = async \(ctx\) => \{[\s\S]*?\n\};/,
          to
        );
      } else {
        c = c.replace(from, to);
      }
      fs.writeFileSync(file, c);
      console.log('win-static-fix patched', file);
      return;
    }
    console.log('win-static-fix: plugin-nextjs static.js not found yet');
  },
};
