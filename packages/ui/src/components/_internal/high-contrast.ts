/**
 * 影と地の色だけで縁取っている面に、高コントラストと強制カラーのときだけ線を引く。
 * 強制カラーでは影が消えて地の色も揃えられ、高コントラストでは影が境界として
 * 弱すぎる。outline にしているのは寸法を変えないためで、内側に引くのは
 * 入れ子の面（Modal の中の Dialog）の線を重ねて 1 本に見せるため。
 * 色と位置まで条件の中に置き、フォーカス中は外すのは、面そのもの（Modal の
 * <dialog>）が受けたフォーカスの UA のリングを塗り替えないようにするため。
 */
export const HIGH_CONTRAST_EDGE = [
  'contrast-more:not-focus-visible:outline',
  'contrast-more:not-focus-visible:outline-border-base',
  'contrast-more:not-focus-visible:-outline-offset-1',
  'forced-colors:not-focus-visible:outline',
  'forced-colors:not-focus-visible:-outline-offset-1',
].join(' ');
