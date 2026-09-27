import type { FC } from 'react';

import { BaseIcon } from '../../icons/base';
import type { BaseIconProps } from '../../icons/base';
import { File, Paperclip } from '../../icons/lucide-imports';

// 公開アイコンにすると生成 UI のカタログと docs の一覧に載せる対象が増えるが、
// 添付の絵柄を AI 部品の外で使う場面が無いので、ここに閉じておく。
type IconProps = Partial<BaseIconProps>;

export const AttachIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Paperclip {...props} />} size={size} />
);

export const FileIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <File {...props} />} size={size} />
);
