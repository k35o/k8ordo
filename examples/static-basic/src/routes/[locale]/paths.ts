import type { Paths } from '@k8ordo/framework';

import { locales } from '../../i18n';

// 静的化ではパラメータを発明できないので、値はそのディレクトリが言う。ここより
// 下のページは、どれもロケールの数だけ書かれる
const paths: Paths<'/:locale'> = () => locales.all;

export default paths;
