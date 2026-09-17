// FragmentInstance のメソッド（observeUsing など）は @types/react ではなく
// @types/react-dom が declare module 'react' で足す。ルートの tsconfig の types は
// allowlist で react-dom を含まないため、react-dom を import しないファイルでは
// FragmentInstance が空のままになる。observers は react-dom の値を一切使わないので、
// 型だけをここで取り込む。
/// <reference types="react-dom" />
