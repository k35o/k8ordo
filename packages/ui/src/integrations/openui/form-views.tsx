'use client';

import { useStateField } from '@openuidev/react-lang';
import type { ComponentRenderProps } from '@openuidev/react-lang';
import type { FC } from 'react';

import * as ui from '../_shared/renderers';
import type * as s from '../_shared/schemas';

export const TextFieldView: FC<ComponentRenderProps<s.TextFieldProps>> = ({
  props,
}) => {
  const field = useStateField<string>(props.name, props.defaultValue ?? '');
  return ui.renderTextField(props, field.value, field.setValue);
};

export const CheckboxView: FC<ComponentRenderProps<s.CheckboxProps>> = ({
  props,
}) => {
  const field = useStateField<boolean>(
    props.name,
    props.defaultChecked ?? false,
  );
  return ui.renderCheckbox(props, field.value, field.setValue);
};

export const SwitchView: FC<ComponentRenderProps<s.SwitchProps>> = ({
  props,
}) => {
  const field = useStateField<boolean>(
    props.name,
    props.defaultChecked ?? false,
  );
  return ui.renderSwitch(props, field.value, field.setValue);
};

export const SelectView: FC<ComponentRenderProps<s.SelectProps>> = ({
  props,
}) => {
  const field = useStateField<string>(
    props.name,
    props.defaultValue ?? props.options[0]?.value ?? '',
  );
  return ui.renderSelect(props, field.value, field.setValue);
};

export const TextareaView: FC<ComponentRenderProps<s.TextareaProps>> = ({
  props,
}) => {
  const field = useStateField<string>(props.name, props.defaultValue ?? '');
  return ui.renderTextarea(props, field.value, field.setValue);
};

export const PasswordInputView: FC<
  ComponentRenderProps<s.PasswordInputProps>
> = ({ props }) => {
  const field = useStateField<string>(props.name, props.defaultValue ?? '');
  return ui.renderPasswordInput(props, field.value, field.setValue);
};

export const NumberFieldView: FC<ComponentRenderProps<s.NumberFieldProps>> = ({
  props,
}) => {
  const field = useStateField<number>(props.name, props.defaultValue ?? 0);
  return ui.renderNumberField(props, field.value, field.setValue);
};

export const SliderView: FC<ComponentRenderProps<s.SliderProps>> = ({
  props,
}) => {
  const field = useStateField<number>(
    props.name,
    props.defaultValue ?? props.min ?? 0,
  );
  return ui.renderSlider(props, field.value, field.setValue);
};

export const RadioView: FC<ComponentRenderProps<s.RadioProps>> = ({
  props,
}) => {
  const field = useStateField<string>(
    props.name,
    props.defaultValue ?? props.options[0]?.value ?? '',
  );
  return ui.renderRadio(props, field.value, field.setValue);
};

export const RadioCardView: FC<ComponentRenderProps<s.RadioCardProps>> = ({
  props,
}) => {
  const field = useStateField<string>(
    props.name,
    props.defaultValue ?? props.options[0]?.value ?? '',
  );
  return ui.renderRadioCard(props, field.value, field.setValue);
};

export const CheckboxCardView: FC<
  ComponentRenderProps<s.CheckboxCardProps>
> = ({ props }) => {
  const field = useStateField<string[]>(props.name, props.defaultValue ?? []);
  return ui.renderCheckboxCard(props, field.value, field.setValue);
};

export const PaginationView: FC<ComponentRenderProps<s.PaginationProps>> = ({
  props,
}) => {
  const field = useStateField<number>(props.name, props.defaultPage ?? 1);
  return ui.renderPagination(props, field.value, field.setValue);
};

export const ListBoxView: FC<ComponentRenderProps<s.ListBoxProps>> = ({
  props,
}) => {
  const field = useStateField<string>(
    props.name,
    props.defaultValue ?? props.options[0]?.value ?? '',
  );
  return ui.renderListBox(props, field.value, field.setValue);
};

export const CheckboxGroupView: FC<
  ComponentRenderProps<s.CheckboxGroupProps>
> = ({ props }) => {
  const field = useStateField<string[]>(props.name, props.defaultValue ?? []);
  return ui.renderCheckboxGroup(props, field.value, field.setValue);
};

export const AutocompleteView: FC<
  ComponentRenderProps<s.AutocompleteProps>
> = ({ props }) => {
  const field = useStateField<string[]>(props.name, props.defaultValue ?? []);
  return ui.renderAutocomplete(props, field.value, field.setValue);
};
