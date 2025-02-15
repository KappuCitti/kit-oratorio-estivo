import { query } from '@/database';
import path from 'node:path';
import fs from 'node:fs/promises';

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

(async () => {
  const permissions = await query<{
    Name: string;
  }>`SELECT Name FROM Permission`;
  if (!permissions.success) {
    console.error(permissions.error);
    process.exit(1);
  }
  await writeNewFile(permissions.data.map((p) => p.Name));
  console.log('File created successfully');
  process.exit(0);
})();
