// チェックボックスの集まりは、選択を state に写さず DOM から読み戻す。form の
// reset は change を飛ばさずに checked を戻すので、写した state は取り残される
export const checkedValuesAround = (box: HTMLInputElement): string[] => {
  const boxes =
    box
      .closest('fieldset')
      ?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]') ?? [];
  return [...boxes]
    .filter((input) => input.checked)
    .map((input) => input.value);
};
