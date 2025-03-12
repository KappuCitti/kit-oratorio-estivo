import path from 'node:path';
import fs from 'node:fs/promises';
import { db } from '@/database';

async function writeNewFile(permissions: string[]) {
  const tagFile = path.join(__dirname, '../src/models/permissions.model.ts');

  const stream = await fs.open(tagFile, 'w');

  await stream.write('export const PERMISSIONS = [\n');

  for (const permission of permissions) {
    await stream.write(`  '${permission}',\n`);
  }

  await stream.write('] as const;\n\n');

  await stream.write(
    'Object.freeze(PERMISSIONS);\n\nexport type Permission = (typeof PERMISSIONS)[number];'
  );

  await stream.close();
}

async function main() {
  const permissions = (
    await db.query.permissionTable
      .findMany({
        columns: { name: true },
      })
      .execute()
  ).map((p) => p.name);
  await writeNewFile(permissions);
  console.log('File created successfully');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
