// ドラッグ中（dragenter / dragover / dragleave）は files が空で中身を読めないので、
// 運んでいるものの種類で見分ける
export const carriesFiles = (dataTransfer: DataTransfer): boolean =>
  dataTransfer.types.includes('Files');
