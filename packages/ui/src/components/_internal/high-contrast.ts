/**
 * 影と地の色だけで縁取っている面に、高コントラストと強制カラーのときだけ線を引く。
 * 強制カラーでは影が消えて地の色も揃えられ、高コントラストでは影が境界として
 * 弱すぎる。outline にしているのは寸法を変えないためで、内側に引くのは
 * 入れ子の面（Modal の中の Dialog）の線を重ねて 1 本に見せるため。
 */
export const HIGH_CONTRAST_EDGE =
  'outline-border-base -outline-offset-1 contrast-more:outline forced-colors:outline';
