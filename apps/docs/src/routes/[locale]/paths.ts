import type { Paths } from '@k8ordo/framework';

import { locales } from '../../i18n';

// ロケールは全ページに掛かる区間。ここより下のページは、どれもロケールの数だけ書かれる
const paths: Paths<'/:locale'> = () => locales.all;

export default paths;
