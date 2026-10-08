import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Post } from '../components/post';

export const listPosts = async (): Promise<readonly Post[]> =>
  JSON.parse(
    // import.meta.url はバンドル後の置き場所を指すので、ビルドが走る
    // プロジェクトのルートから辿る
    await readFile(path.join(process.cwd(), 'src/lib/posts.json'), 'utf8'),
  ) as readonly Post[];

export const findPost = async (id: number): Promise<Post | undefined> =>
  (await listPosts()).find((post) => post.id === id);
