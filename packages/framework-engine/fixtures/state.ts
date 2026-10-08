// @k8ordo/state の代わり。生成された表は search を export するページを
// urlReader(search) で読む。フィクスチャのページは読み方そのものを export
// するので、それをそのまま返す
export const urlReader = <T>(read: T): T => read;
