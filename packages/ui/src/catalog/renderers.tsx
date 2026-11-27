'use client';

import { Fragment, useId, useMemo, useState } from 'react';
import type { ComponentProps, FC, ReactNode, SubmitEvent } from 'react';

import { Button } from '../components/buttons/button';
import { CopyButton } from '../components/buttons/copy-button';
import { IconButton } from '../components/buttons/icon-button';
import { Toolbar } from '../components/buttons/toolbar';
import { Accordion } from '../components/data-display/accordion';
import { Avatar } from '../components/data-display/avatar';
import { Badge } from '../components/data-display/badge';
import { Card } from '../components/data-display/card';
import { Carousel } from '../components/data-display/carousel';
import { Code } from '../components/data-display/code';
import { DataTable } from '../components/data-display/data-table';
import type { DataTableSort } from '../components/data-display/data-table';
import { Heading } from '../components/data-display/heading';
import { Kbd } from '../components/data-display/kbd';
import { Table } from '../components/data-display/table';
import { Tree } from '../components/data-display/tree';
import type { TreeItem } from '../components/data-display/tree';
import { Alert } from '../components/feedback/alert';
import { Callout } from '../components/feedback/callout';
import { EmptyState } from '../components/feedback/empty-state';
import { Progress } from '../components/feedback/progress';
import { Skeleton } from '../components/feedback/skeleton';
import { Spinner } from '../components/feedback/spinner';
import { ToastProvider, useToast } from '../components/feedback/toast';
import { Autocomplete } from '../components/form/autocomplete';
import { Calendar } from '../components/form/calendar';
import { Checkbox } from '../components/form/checkbox';
import { CheckboxCard } from '../components/form/checkbox-card';
import { CheckboxGroup } from '../components/form/checkbox-group';
import { ColorPicker } from '../components/form/color-picker';
import { Combobox } from '../components/form/combobox';
import { DatePicker } from '../components/form/date-picker';
import { FileField } from '../components/form/file-field';
import { Form } from '../components/form/form';
import { FormControl } from '../components/form/form-control';
import { NumberField } from '../components/form/number-field';
import { PasswordInput } from '../components/form/password-input';
import { Radio } from '../components/form/radio';
import { RadioCard } from '../components/form/radio-card';
import { RangeSlider } from '../components/form/range-slider';
import { Select } from '../components/form/select';
import { Slider } from '../components/form/slider';
import { Switch } from '../components/form/switch';
import { TextField } from '../components/form/text-field';
import { Textarea } from '../components/form/textarea';
import { AlertIcon } from '../components/icons/alert';
import { ChevronIcon } from '../components/icons/chevron';
import { Grid } from '../components/layout/grid';
import { Separator } from '../components/layout/separator';
import { Stack } from '../components/layout/stack';
import { Anchor } from '../components/navigation/anchor';
import { Breadcrumb } from '../components/navigation/breadcrumb';
import { Pagination } from '../components/navigation/pagination';
import { SideNav } from '../components/navigation/side-nav';
import { Stepper } from '../components/navigation/stepper';
import { Tabs } from '../components/navigation/tabs';
import { Dialog } from '../components/overlays/dialog';
import { Drawer } from '../components/overlays/drawer';
import { DropdownMenu } from '../components/overlays/dropdown-menu';
import { ListBox } from '../components/overlays/list-box';
import { Popover } from '../components/overlays/popover';
import { Tooltip } from '../components/overlays/tooltip';
import { getLocale, getMessages } from '../i18n/current';
import { iconMap } from './icon-map';
import type {
  AccordionProps,
  AlertProps,
  CalloutProps,
  AnchorProps,
  AutocompleteProps,
  ComboboxProps,
  AvatarProps,
  BadgeProps,
  BreadcrumbProps,
  ButtonProps,
  CalendarProps,
  CardProps,
  CarouselProps,
  CheckboxCardProps,
  CheckboxGroupProps,
  CheckboxProps,
  ChevronIconProps,
  CodeProps,
  ColorPickerProps,
  DataTableProps,
  DateFieldProps,
  DatePickerProps,
  GridProps,
  DialogProps,
  DrawerProps,
  DropdownMenuItemProps,
  DropdownMenuProps,
  EmptyStateProps,
  FileFieldProps,
  FormControlProps,
  FormProps,
  HeadingProps,
  IconButtonProps,
  CopyButtonProps,
  IconProps,
  KbdProps,
  ListBoxProps,
  ModalProps,
  NumberFieldProps,
  PaginationProps,
  PasswordInputProps,
  PopoverProps,
  ProgressProps,
  RadioCardProps,
  RadioProps,
  RangeSliderProps,
  SelectProps,
  SeparatorProps,
  SideNavProps,
  SkeletonProps,
  SliderProps,
  SpinnerProps,
  StackProps,
  StatusIconProps,
  StepperProps,
  SwitchProps,
  TableProps,
  TreeProps,
  TabsProps,
  TextareaProps,
  TextFieldProps,
  ToastProps,
  ToolbarProps,
  TooltipProps,
} from './schemas';

import styles from './renderers.module.css';

/**
 * 部品は手を加えずに使い、関数を受ける prop（renderItem など）はここで組み立てる。
 * モデルが書けるのは平らなデータだけで、関数は書けないため。
 *
 * props はスキーマに合う値（null を含まない）として受け、ここではそろえない。
 * 形式ごとの書き方の違い（OpenUI Lang が省いた位置引数を null で渡すなど）は、
 * その形式のつなぎがそろえてから渡す。ここで吸収すると、どの形式にも依らない
 * 描画が 1 つの形式の都合を抱える。
 */

type Press = (() => void | Promise<void>) | undefined;

export function renderButton(props: ButtonProps, onPress: Press): ReactNode {
  const { label, href } = props;
  const look = {
    color: props.color,
    fullWidth: props.fullWidth,
    size: props.size,
    variant: props.variant,
  };
  return href === undefined ? (
    <Button {...look} action={onPress}>
      {label}
    </Button>
  ) : (
    <Button {...look} href={href}>
      {label}
    </Button>
  );
}

export function renderBadge(props: BadgeProps): ReactNode {
  return (
    <Badge
      label={props.label}
      size={props.size}
      tone={props.tone}
      variant={props.variant}
    />
  );
}

export function renderHeading(props: HeadingProps): ReactNode {
  return (
    <Heading lineClamp={props.lineClamp} level={props.level ?? 'h2'}>
      {props.label}
    </Heading>
  );
}

export function renderAlert(props: AlertProps): ReactNode {
  return <Alert message={props.message} tone={props.tone} />;
}

export function renderCallout(props: CalloutProps): ReactNode {
  return (
    <Callout label={props.label} tone={props.tone}>
      <p>{props.content}</p>
    </Callout>
  );
}

export function renderSpinner(props: SpinnerProps): ReactNode {
  return <Spinner label={props.label} size={props.size} />;
}

export function renderSeparator(props: SeparatorProps): ReactNode {
  return <Separator color={props.color} orientation={props.orientation} />;
}

const CARD_PADDING_CLASS = {
  sm: styles.cardSm,
  md: styles.cardMd,
  lg: styles.cardLg,
} as const satisfies Record<'sm' | 'md' | 'lg', string>;

export function renderCard(
  props: CardProps,
  children: ReactNode,
  onPress: Press,
): ReactNode {
  return (
    <Card
      action={onPress}
      href={props.href}
      variant={props.variant}
      width={props.width}
    >
      <div className={CARD_PADDING_CLASS[props.size ?? 'md']}>{children}</div>
    </Card>
  );
}

// Tabs は ARIA の `aria-controls` / `aria-labelledby` で ID を参照するため、
// 同一ページに複数描画されても衝突しないよう `useId()` で生成する必要がある。
// （生成 UI では Tabs が複数並ぶケースは普通にあり得る）。
export const TabsView: FC<{ props: TabsProps }> = ({ props }) => {
  const messages = getMessages();
  const baseId = useId();
  const ids = props.tabs.map((_, index) => `${baseId}-tab-${index}`);
  return (
    <Tabs.Root defaultSelectedId={ids[0] ?? ''}>
      <Tabs.List label={props.label ?? messages.tabList}>
        {props.tabs.map((tab, index) => (
          <Tabs.Tab id={ids[index] ?? ''} key={ids[index]}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {props.tabs.map((tab, index) => (
        <Tabs.Panel id={ids[index] ?? ''} key={ids[index]}>
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
};

export function renderTabs(props: TabsProps): ReactNode {
  return <TabsView props={props} />;
}

export function renderStack(props: StackProps, children: ReactNode): ReactNode {
  return (
    <Stack
      align={props.align}
      direction={props.direction}
      gap={props.gap}
      justify={props.justify}
      padding={props.padding}
    >
      {children}
    </Stack>
  );
}

export function renderGrid(props: GridProps, children: ReactNode): ReactNode {
  return (
    <Grid cols={props.cols} gap={props.gap} minItemSize={props.minItemSize}>
      {children}
    </Grid>
  );
}

export function renderTextField(
  props: TextFieldProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return (
    <TextField
      disabled={props.disabled}
      invalid={props.invalid}
      name={props.name}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder={props.placeholder}
      readOnly={props.readOnly}
      value={value}
    />
  );
}

export function renderCheckbox(
  props: CheckboxProps,
  checked: boolean,
  onChange: (next: boolean) => void,
): ReactNode {
  return (
    <Checkbox
      checked={checked}
      disabled={props.disabled}
      label={props.label}
      name={props.name}
      onChange={onChange}
    />
  );
}

export function renderSwitch(
  props: SwitchProps,
  checked: boolean,
  onChange: (next: boolean) => void,
): ReactNode {
  return (
    <Switch
      checked={checked}
      disabled={props.disabled}
      invalid={props.invalid}
      label={props.label}
      name={props.name}
      onChange={onChange}
      required={props.required}
    />
  );
}

export function renderSelect(
  props: SelectProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return (
    <Select
      disabled={props.disabled}
      invalid={props.invalid}
      name={props.name}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      options={props.options}
      value={value}
    />
  );
}

export function renderTextarea(
  props: TextareaProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return (
    <Textarea
      autoResize={props.autoResize}
      disabled={props.disabled}
      invalid={props.invalid}
      name={props.name}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder={props.placeholder}
      readOnly={props.readOnly}
      rows={props.rows}
      value={value}
    />
  );
}

export function renderPasswordInput(
  props: PasswordInputProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return (
    <PasswordInput
      disabled={props.disabled}
      invalid={props.invalid}
      name={props.name}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder={props.placeholder}
      value={value}
    />
  );
}

export function renderNumberField(
  props: NumberFieldProps,
  value: number | null,
  onChange: (next: number | null) => void,
): ReactNode {
  return (
    <NumberField
      disabled={props.disabled}
      invalid={props.invalid}
      max={props.max}
      min={props.min}
      name={props.name}
      onChange={onChange}
      step={props.step}
      value={value}
    />
  );
}

export function renderSlider(
  props: SliderProps,
  value: number,
  onChange: (next: number) => void,
): ReactNode {
  return (
    <Slider
      disabled={props.disabled}
      invalid={props.invalid}
      max={props.max}
      min={props.min}
      name={props.name}
      onChange={onChange}
      step={props.step}
      value={value}
    />
  );
}

// 両方のつまみが同じ name で送るので、FormData では [下側, 上側] の配列になる
export function renderRangeSlider(
  props: RangeSliderProps,
  value: readonly [number, number],
  onChange: (next: readonly [number, number]) => void,
): ReactNode {
  return (
    <RangeSlider
      aria-label={props.label}
      disabled={props.disabled}
      invalid={props.invalid}
      max={props.max}
      min={props.min}
      name={[props.name, props.name]}
      onChange={onChange}
      step={props.step}
      value={value}
    />
  );
}

// Radio / RadioCard は `aria-labelledby` の宛先 ID を持つ必要があるが、
// `${name}-label` は同じ name の別 Renderer が同居すると衝突する。
// `useId()` でユニーク化したラベルを子に渡す共有ラッパー。
const LabeledField: FC<{
  label: string;
  children: (labelId: string) => ReactNode;
}> = ({ label, children }) => {
  const labelId = useId();
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel} id={labelId}>
        {label}
      </span>
      {children(labelId)}
    </div>
  );
};

const ColorPickerView: FC<{
  props: ColorPickerProps;
  value: string;
  onChange: (next: string) => void;
}> = ({ props, value, onChange }) => (
  <LabeledField label={props.label}>
    {(labelId) => (
      <ColorPicker
        aria-labelledby={labelId}
        disabled={props.disabled}
        invalid={props.invalid}
        name={props.name}
        onChange={onChange}
        required={props.required}
        swatches={props.swatches}
        value={value}
      />
    )}
  </LabeledField>
);

export function renderColorPicker(
  props: ColorPickerProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return <ColorPickerView onChange={onChange} props={props} value={value} />;
}

const DateFieldView: FC<{
  props: DateFieldProps;
  value: string;
  onChange: (next: string) => void;
}> = ({ props, value, onChange }) => (
  <LabeledField label={props.label}>
    {(labelId) => (
      <TextField
        aria-labelledby={labelId}
        disabled={props.disabled}
        invalid={props.invalid}
        max={props.max}
        min={props.min}
        name={props.name}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        required={props.required}
        type="date"
        value={value}
      />
    )}
  </LabeledField>
);

export function renderDateField(
  props: DateFieldProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return <DateFieldView onChange={onChange} props={props} value={value} />;
}

const DatePickerView: FC<{
  props: DatePickerProps;
  value: string;
  onChange: (next: string) => void;
}> = ({ props, value, onChange }) => (
  <LabeledField label={props.label}>
    {(labelId) => (
      <DatePicker
        aria-labelledby={labelId}
        disabled={props.disabled}
        invalid={props.invalid}
        max={props.max}
        min={props.min}
        name={props.name}
        onChange={onChange}
        required={props.required}
        value={value}
      />
    )}
  </LabeledField>
);

export function renderDatePicker(
  props: DatePickerProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return <DatePickerView onChange={onChange} props={props} value={value} />;
}

export function renderCalendar(
  props: CalendarProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return (
    <Calendar
      max={props.max}
      min={props.min}
      onChange={onChange}
      value={value === '' ? null : value}
    />
  );
}

const RadioView: FC<{
  props: RadioProps;
  value: string;
  onChange: (next: string) => void;
}> = ({ props, value, onChange }) => (
  <LabeledField label={props.label}>
    {(labelId) => (
      <Radio
        aria-labelledby={labelId}
        disabled={props.disabled}
        name={props.name}
        onChange={onChange}
        options={props.options}
        value={value}
      />
    )}
  </LabeledField>
);

const RadioCardView: FC<{
  props: RadioCardProps;
  value: string;
  onChange: (next: string) => void;
}> = ({ props, value, onChange }) => (
  <LabeledField label={props.label}>
    {(labelId) => (
      <RadioCard
        aria-labelledby={labelId}
        disabled={props.disabled}
        invalid={props.invalid}
        name={props.name}
        onChange={onChange}
        options={props.options}
        value={value}
      />
    )}
  </LabeledField>
);

export function renderRadio(
  props: RadioProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return <RadioView onChange={onChange} props={props} value={value} />;
}

export function renderRadioCard(
  props: RadioCardProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return <RadioCardView onChange={onChange} props={props} value={value} />;
}

const CheckboxCardView: FC<{
  props: CheckboxCardProps;
  value: string[];
  onChange: (next: string[]) => void;
}> = ({ props, value, onChange }) => (
  <LabeledField label={props.label}>
    {(labelId) => (
      <CheckboxCard
        aria-labelledby={labelId}
        disabled={props.disabled}
        invalid={props.invalid}
        name={props.name}
        onChange={onChange}
        options={props.options}
        value={value}
      />
    )}
  </LabeledField>
);

export function renderCheckboxCard(
  props: CheckboxCardProps,
  value: string[],
  onChange: (next: string[]) => void,
): ReactNode {
  return <CheckboxCardView onChange={onChange} props={props} value={value} />;
}

export function renderPagination(
  props: PaginationProps,
  currentPage: number,
  onChange: (next: number) => void,
): ReactNode {
  return (
    <Pagination
      currentPage={currentPage}
      disabled={props.disabled}
      nextLabel={props.nextLabel}
      onChange={onChange}
      prevLabel={props.prevLabel}
      totalPages={props.totalPages}
    />
  );
}

export function renderIcon(props: IconProps): ReactNode {
  const IconComponent = iconMap[props.name];
  return <IconComponent size={props.size ?? 'md'} />;
}

// 汎用 Icon に乗せられない、追加引数が必要なアイコンを独立コンポーネントとして公開する。
export function renderChevronIcon(props: ChevronIconProps): ReactNode {
  return <ChevronIcon direction={props.direction} size={props.size ?? 'md'} />;
}

export function renderStatusIcon(props: StatusIconProps): ReactNode {
  return <AlertIcon size={props.size ?? 'md'} status={props.status} />;
}

export function renderIconButton(
  props: IconButtonProps,
  onPress: Press,
): ReactNode {
  const IconComponent = iconMap[props.icon];
  return (
    <IconButton
      action={onPress}
      color={props.color}
      label={props.label}
      size={props.size}
      variant={props.variant}
    >
      <IconComponent size={props.size ?? 'md'} />
    </IconButton>
  );
}

export function renderCopyButton(props: CopyButtonProps): ReactNode {
  return (
    <CopyButton
      iconOnly={props.iconOnly}
      label={props.label}
      size={props.size}
      value={props.value}
    />
  );
}

export function renderAnchor(props: AnchorProps): ReactNode {
  return (
    <Anchor href={props.href} openInNewTab={props.openInNewTab}>
      {props.label}
    </Anchor>
  );
}

export function renderAvatar(props: AvatarProps): ReactNode {
  return (
    <Avatar
      alt={props.alt}
      fallback={props.fallback}
      name={props.name}
      size={props.size}
      src={props.src}
    />
  );
}

export function renderCode(props: CodeProps): ReactNode {
  return <Code>{props.code}</Code>;
}

export function renderKbd(props: KbdProps): ReactNode {
  return (
    <span className={styles.keys}>
      {props.keys.map((key, index) => (
        // eslint-disable-next-line react/no-array-index-key -- 同じキーが並びうる静的な列
        <Kbd key={`${key}-${index}`}>{key}</Kbd>
      ))}
    </span>
  );
}

export function renderEmptyState(props: EmptyStateProps): ReactNode {
  const { icon } = props;
  const IconComponent = icon === undefined ? undefined : iconMap[icon];
  return (
    <EmptyState
      description={props.description}
      icon={
        IconComponent === undefined ? undefined : <IconComponent size="lg" />
      }
      title={props.title}
    />
  );
}

// 子の 1 つずつが 1 枚のスライドになる。位置で固定の列なので index キーでよい
export function renderCarousel(
  props: CarouselProps,
  slides: readonly ReactNode[],
): ReactNode {
  return (
    <Carousel.Root label={props.label} slideSize={props.slideSize}>
      {slides.map((slide, index) => (
        // eslint-disable-next-line react/no-array-index-key -- 静的な位置リスト
        <Carousel.Slide key={index}>{slide}</Carousel.Slide>
      ))}
    </Carousel.Root>
  );
}

export function renderProgress(props: ProgressProps): ReactNode {
  return (
    <Progress
      label={props.label}
      max={props.max}
      min={props.min}
      value={props.value}
    />
  );
}

export function renderSkeleton(props: SkeletonProps): ReactNode {
  return (
    <Skeleton animate={props.animate} shape={props.shape} size={props.size} />
  );
}

export function renderAccordion(props: AccordionProps): ReactNode {
  return (
    <Accordion.Root>
      {props.items.map((item) => (
        <Accordion.Item defaultOpen={item.defaultOpen} key={item.title}>
          <Accordion.Button level="h3">{item.title}</Accordion.Button>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export function renderBreadcrumb(props: BreadcrumbProps): ReactNode {
  return (
    <Breadcrumb.List size={props.size}>
      {props.items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <Breadcrumb.Separator />}
          <Breadcrumb.Item>
            {item.href === undefined ? (
              item.label
            ) : (
              <Breadcrumb.Link current={item.current} href={item.href}>
                {item.label}
              </Breadcrumb.Link>
            )}
          </Breadcrumb.Item>
        </Fragment>
      ))}
    </Breadcrumb.List>
  );
}

export function renderStepper(props: StepperProps): ReactNode {
  return (
    <Stepper
      aria-label={props.label}
      orientation={props.orientation}
      steps={props.steps}
      value={props.current}
    />
  );
}

// 平らな一覧を親子の木に組む。親の見つからない項目は根に置く
export const toTree = (items: TreeProps['items']): TreeItem[] => {
  const ids = new Set(items.map((item) => item.id));
  const build = (parentId: string | undefined): TreeItem[] =>
    items
      .filter((item) =>
        parentId === undefined
          ? item.parentId === undefined || !ids.has(item.parentId)
          : item.parentId === parentId,
      )
      .map((item): TreeItem => {
        const children = build(item.id);
        return children.length > 0
          ? { id: item.id, label: item.label, children }
          : { id: item.id, label: item.label };
      });
  return build(undefined);
};

export function renderTree(props: TreeProps): ReactNode {
  return (
    <Tree
      defaultExpandedIds={props.items
        .filter((item) => item.expanded === true)
        .map((item) => item.id)}
      items={toTree(props.items)}
      label={props.label}
    />
  );
}

export function renderSideNav(props: SideNavProps): ReactNode {
  return (
    <SideNav.Root label={props.label}>
      {props.groups.map((group) => (
        <SideNav.Group key={group.title} title={group.title}>
          {group.links.map((link) => (
            <SideNav.Link
              current={link.current}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </SideNav.Link>
          ))}
        </SideNav.Group>
      ))}
    </SideNav.Root>
  );
}

export function renderTable(props: TableProps): ReactNode {
  return (
    <Table.Root>
      {props.caption !== undefined && props.caption !== '' ? (
        <Table.Caption>{props.caption}</Table.Caption>
      ) : null}
      <Table.Head>
        <Table.Row>
          {props.columns.map((column) => (
            <Table.HeaderCell align={column.align} key={column.label}>
              {column.label}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {props.rows.map((row, rowIndex) => (
          // eslint-disable-next-line react/no-array-index-key -- 生成された静的な行
          <Table.Row key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <Table.Cell
                align={props.columns[cellIndex]?.align}
                // eslint-disable-next-line react/no-array-index-key -- 静的なセル
                key={cellIndex}
              >
                {cell}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

const submitNothing = (event: SubmitEvent<HTMLFormElement>): void => {
  event.preventDefault();
};

export function renderForm(_props: FormProps, children: ReactNode): ReactNode {
  return <Form onSubmit={submitNothing}>{children}</Form>;
}

const OverlayWidget: FC<{
  triggerLabel: string;
  title: string;
  side: ModalProps['side'];
  buttonProps?: Pick<ComponentProps<typeof Button>, 'size' | 'variant'>;
  children: ReactNode;
}> = ({ triggerLabel, title, side, buttonProps, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {triggerLabel}
      </Button>
      {side === 'left' || side === 'right' ? (
        <Drawer
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          side={side}
          title={title}
        >
          {children}
        </Drawer>
      ) : (
        <Dialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          side={side}
          title={title}
        >
          {children}
        </Dialog>
      )}
    </>
  );
};

export const ModalWidget: FC<{ props: ModalProps; children: ReactNode }> = ({
  props,
  children,
}) => (
  <OverlayWidget
    buttonProps={{ size: 'md', variant: 'solid' }}
    side={props.side}
    title={props.title}
    triggerLabel={props.triggerLabel}
  >
    {children}
  </OverlayWidget>
);

export const DialogWidget: FC<{ props: DialogProps; children: ReactNode }> = ({
  props,
  children,
}) => (
  <OverlayWidget
    side="center"
    title={props.title}
    triggerLabel={props.triggerLabel}
  >
    {children}
  </OverlayWidget>
);

export const DrawerWidget: FC<{ props: DrawerProps; children: ReactNode }> = ({
  props,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        variant="outline"
      >
        {props.triggerLabel}
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        side={props.side}
        title={props.title}
      >
        {children}
      </Drawer>
    </>
  );
};

export function renderPopover(
  props: PopoverProps,
  children: ReactNode,
): ReactNode {
  return (
    <Popover.Root>
      <Popover.Trigger
        renderItem={(triggerProps) => (
          <Button {...triggerProps} variant="outline">
            {props.triggerLabel}
          </Button>
        )}
      />
      <Popover.Content label={props.triggerLabel}>
        <div className={styles.popover}>{children}</div>
      </Popover.Content>
    </Popover.Root>
  );
}

export function renderTooltip(props: TooltipProps): ReactNode {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        renderItem={(triggerProps) => (
          <Button {...triggerProps} variant="outline">
            {props.triggerLabel}
          </Button>
        )}
      />
      <Tooltip.Content>{props.content}</Tooltip.Content>
    </Tooltip.Root>
  );
}

export function renderToolbar(props: ToolbarProps): ReactNode {
  return (
    <Toolbar.Root aria-label={props.label} orientation={props.orientation}>
      {props.items.map((item, index) => {
        const IconComponent =
          item.icon === undefined ? undefined : iconMap[item.icon];
        return (
          <Toolbar.Item
            // eslint-disable-next-line react/no-array-index-key -- 生成された静的な並び
            key={`${item.label}-${index}`}
            renderItem={(itemProps) =>
              IconComponent === undefined ? (
                <Button {...itemProps} size="sm" variant="skeleton">
                  {item.label}
                </Button>
              ) : (
                <IconButton {...itemProps} label={item.label} size="sm">
                  <IconComponent size="sm" />
                </IconButton>
              )
            }
          />
        );
      })}
    </Toolbar.Root>
  );
}

export function renderDropdownMenu(
  props: DropdownMenuProps,
  children: ReactNode,
): ReactNode {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger label={props.triggerLabel} />
      <DropdownMenu.Content>{children}</DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

const chooseNothing = (): void => {};

export function renderDropdownMenuItem(
  props: DropdownMenuItemProps,
  onPress: Press,
): ReactNode {
  return (
    <DropdownMenu.Item
      label={props.label}
      onAction={onPress ?? chooseNothing}
    />
  );
}

// ToastProvider はラッパー側で巻く必要があるため、ローカルにも 1 段被せる。
const ToastTriggerInner: FC<{ props: ToastProps }> = ({ props }) => {
  const { open } = useToast();
  return (
    <Button
      onClick={() => {
        open(props.tone, props.message);
      }}
      variant="outline"
    >
      {props.triggerLabel}
    </Button>
  );
};

export const DataTableWidget: FC<{ props: DataTableProps }> = ({ props }) => {
  const locale = getLocale();
  const collator = useMemo(
    () => new Intl.Collator(locale, { numeric: true }),
    [locale],
  );
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const rows = props.rows.map((cells, index) => ({ id: String(index), cells }));
  const columnIndex = sort === null ? -1 : Number(sort.columnId);
  const sorted =
    sort === null
      ? rows
      : rows.toSorted((a, b) =>
          collator.compare(
            a.cells[columnIndex] ?? '',
            b.cells[columnIndex] ?? '',
          ),
        );
  const ordered =
    sort?.direction === 'descending' ? sorted.toReversed() : sorted;
  return (
    <DataTable
      columns={props.columns.map((column, index) => ({
        id: String(index),
        header: column.label,
        cell: (row: { cells: string[] }) => row.cells[index] ?? '',
        align: column.align,
        sortable: column.sortable,
      }))}
      getRowId={(row) => row.id}
      label={props.label}
      onSelectedIdsChange={
        props.selectable === true ? setSelectedIds : undefined
      }
      onSortChange={setSort}
      rows={ordered}
      selectedIds={selectedIds}
      sort={sort}
    />
  );
};

export const ToastWidget: FC<{ props: ToastProps }> = ({ props }) => (
  <ToastProvider>
    <ToastTriggerInner props={props} />
  </ToastProvider>
);

export function renderListBox(
  props: ListBoxProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return (
    <ListBox
      label={props.label}
      onChange={onChange}
      options={props.options}
      value={value === '' ? undefined : value}
    />
  );
}

export function renderCheckboxGroup(
  props: CheckboxGroupProps,
  value: string[],
  onChange: (next: string[]) => void,
): ReactNode {
  return (
    <LabeledField label={props.label}>
      {(labelId) => (
        <CheckboxGroup
          aria-labelledby={labelId}
          name={props.name}
          onChange={onChange}
          options={props.options}
          value={value}
        />
      )}
    </LabeledField>
  );
}

// Autocomplete は本体側で `id` が必須。`name` ベースだと同 name の Autocomplete が
// 複数の Renderer に同居したときに id が衝突するので `useId()` でユニーク化する。
const AutocompleteView: FC<{
  props: AutocompleteProps;
  value: string[];
  onChange: (next: string[]) => void;
}> = ({ props, value, onChange }) => {
  const id = useId();
  return (
    <Autocomplete
      disabled={props.disabled}
      id={id}
      invalid={props.invalid}
      name={props.name}
      onChange={onChange}
      options={props.options}
      value={value}
    />
  );
};

export function renderAutocomplete(
  props: AutocompleteProps,
  value: string[],
  onChange: (next: string[]) => void,
): ReactNode {
  return <AutocompleteView onChange={onChange} props={props} value={value} />;
}

const ComboboxView: FC<{
  props: ComboboxProps;
  value: string;
  onChange: (next: string) => void;
}> = ({ props, value, onChange }) => (
  <LabeledField label={props.label}>
    {(labelId) => (
      <Combobox
        aria-labelledby={labelId}
        disabled={props.disabled}
        invalid={props.invalid}
        name={props.name}
        onChange={onChange}
        options={props.options}
        placeholder={props.placeholder}
        required={props.required}
        value={value}
      />
    )}
  </LabeledField>
);

export function renderCombobox(
  props: ComboboxProps,
  value: string,
  onChange: (next: string) => void,
): ReactNode {
  return <ComboboxView onChange={onChange} props={props} value={value} />;
}

export const FileFieldWidget: FC<{ props: FileFieldProps }> = ({ props }) => {
  const messages = getMessages();
  const trigger = (
    <FileField.Trigger
      renderItem={(wiring) => (
        <Button {...wiring} variant="outline">
          {props.triggerLabel ?? messages.fileFieldTrigger}
        </Button>
      )}
    />
  );
  return (
    <FileField.Root maxFiles={props.maxFiles} multiple={props.multiple}>
      {props.dropzone === true ? (
        <FileField.Dropzone>
          <p className={styles.dropHint}>{messages.fileFieldDrop}</p>
          {trigger}
        </FileField.Dropzone>
      ) : (
        trigger
      )}
      <FileField.ItemList clearable={props.clearable} />
    </FileField.Root>
  );
};

export function renderFormControl(
  props: FormControlProps,
  value: string,
  setValue: (next: string) => void,
): ReactNode {
  const fieldType = props.fieldType ?? 'text';
  return (
    <FormControl
      errorText={props.errorText}
      helpText={props.helpText}
      label={props.label}
      renderInput={(inputProps) =>
        fieldType === 'textarea' ? (
          <Textarea
            {...inputProps}
            name={props.name}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            placeholder={props.placeholder}
            value={value}
          />
        ) : fieldType === 'password' ? (
          <PasswordInput
            {...inputProps}
            name={props.name}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            placeholder={props.placeholder}
            value={value}
          />
        ) : (
          <TextField
            {...inputProps}
            name={props.name}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            placeholder={props.placeholder}
            value={value}
          />
        )
      }
      required={props.required}
    />
  );
}
