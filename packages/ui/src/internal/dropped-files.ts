// フォルダーは中身を辿らないとファイルにならないので、ドロップでは受けない
export const droppedFiles = (dataTransfer: DataTransfer): File[] =>
  Array.from(dataTransfer.items).flatMap((item) => {
    if (item.kind !== 'file' || item.webkitGetAsEntry()?.isDirectory === true) {
      return [];
    }
    const file = item.getAsFile();
    return file === null ? [] : [file];
  });
