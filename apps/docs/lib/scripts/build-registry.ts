/* @proprietary license */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { registry } from '@/components/preview/registry';

function resolveSourceFile(baseDir: string, rel: string): string {
  return path.normalize(path.join(baseDir, rel));
}

export async function buildRegistry(): Promise<void> {
  const outDir = path.join(process.cwd(), 'public/registry');
  await mkdir(outDir, { recursive: true });

  const indexes: { name: string; title?: string; description?: string }[] = [];

  for (const comp of registry.components) {
    indexes.push(
      Object.assign(
        {},
        {
          name: comp.name,
        },
        comp.title ? { title: comp.title } : {},
        comp.description ? { description: comp.description } : {},
      ),
    );

    const files = [];
    for (const f of comp.files) {
      const abs = resolveSourceFile(registry.dir, f.path);
      const content = await readFile(abs);
      files.push({
        content: content.toString('utf8'),
        type: f.type,
        path: f.path,
      });
    }

    const payload = Object.assign(
      {},
      {
        name: comp.name,
      },
      comp.title ? { title: comp.title } : {},
      comp.description ? { description: comp.description } : {},
      {
        files,
        // SAFETY: Boundary value matches the asserted domain type at this call site.
        subComponents: [] as unknown[],
        dependencies: registry.dependencies,
        devDependencies: {},
      },
    );

    const jsonRel = `${comp.name}.json`;
    const jsonPath = path.join(outDir, jsonRel);
    await mkdir(path.dirname(jsonPath), { recursive: true });
    await writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  }

  await writeFile(
    path.join(outDir, '_registry.json'),
    `${JSON.stringify({ indexes }, null, 2)}\n`,
  );
}
