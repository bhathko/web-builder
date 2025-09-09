import * as fs from 'fs';
import * as path from 'path';

export function getSubdirectoryNames(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((name) => fs.statSync(path.join(dirPath, name)).isDirectory());
}

export function getLatestCreatedDirectory(dirPath: string): string | null {
  if (!fs.existsSync(dirPath)) return null;
  const dirs = fs
    .readdirSync(dirPath)
    .map((name) => ({
      name,
      fullPath: path.join(dirPath, name),
    }))
    .filter((entry) => fs.statSync(entry.fullPath).isDirectory());

  if (dirs.length === 0) return null;

  dirs.sort(
    (a, b) => fs.statSync(b.fullPath).ctimeMs - fs.statSync(a.fullPath).ctimeMs,
  );

  return dirs[0].name;
}
