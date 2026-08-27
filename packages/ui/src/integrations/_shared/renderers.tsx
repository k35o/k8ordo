'use client';

import { Fragment, useId, useState } from 'react';
import type { ComponentProps, FC, ReactNode } from 'react';

import { Button } from '../../components/buttons/button';
import { IconButton } from '../../components/buttons/icon-button';
import { Accordion } from '../../components/data-display/accordion';
import { Avatar } from '../../components/data-display/avatar';
import { Badge } from '../../components/data-display/badge';
import { Card } from '../../components/data-display/card';
import { Code } from '../../components/data-display/code';
import { Heading } from '../../components/data-display/heading';
import { Table } from '../../components/data-display/table';
import { Alert } from '../../components/feedback/alert';
import { Progress } from '../../components/feedback/progress';
import { Skeleton } from '../../components/feedback/skeleton';
import { Spinner } from '../../components/feedback/spinner';
import { ToastProvider, useToast } from '../../components/feedback/toast';
import { Autocomplete } from '../../components/form/autocomplete';
import { Checkbox } from '../../components/form/checkbox';
import { CheckboxCard } from '../../components/form/checkbox-card';
import { CheckboxGroup } from '../../components/form/checkbox-group';
import { FileField } from '../../components/form/file-field';
import { Form } from '../../components/form/form';
import { FormControl } from '../../components/form/form-control';
import { NumberField } from '../../components/form/number-field';
import { PasswordInput } from '../../components/form/password-input';
import { Radio } from '../../components/form/radio';
import { RadioCard } from '../../components/form/radio-card';
import { Select } from '../../components/form/select';
import { Slider } from '../../components/form/slider';
import { Switch } from '../../components/form/switch';
import { TextField } from '../../components/form/text-field';
import { Textarea } from '../../components/form/textarea';
import {
  AccessibilityIcon,
  AIIcon,
  AlertIcon,
  AtomIcon,
  BadIcon,
  BlogIcon,
  BoringIcon,
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  ColorContrastIcon,
  ColorInfoIcon,
  CopyIcon,
  DarkModeIcon,
  DifficultIcon,
  EasyIcon,
  ExternalLinkIcon,
  FormIcon,
  GitHubIcon,
  GoodIcon,
  HistoryIcon,
  HorizontalWritingIcon,
  InformativeIcon,
  InterestingIcon,
  LightModeIcon,
  LinkIcon,
  ListIcon,
  LocationIcon,
  LogoIcon,
  MailIcon,
  MinusIcon,
  MixedColorIcon,
  NavigationMenuIcon,
  NewsIcon,
  PaletteIcon,
  PlusIcon,
  PrepareIcon,
  PublishDateIcon,
  QiitaIcon,
  RSSIcon,
  SendIcon,
  ShallowIcon,
  ShieldCheckIcon,
  SlideIcon,
  SparklesIcon,
  SubscribeIcon,
  TableIcon,
  TagIcon,
  TwitterIcon,
  UpdateDateIcon,
  VerticalWritingIcon,
  ViewIcon,
  ViewOffIcon,
} from '../../components/icons';
import { Grid } from '../../components/layout/grid';
import { ScrollLinked } from '../../components/layout/scroll-linked';
import { Separator } from '../../components/layout/separator';
import { Stack } from '../../components/layout/stack';
import { Anchor } from '../../components/navigation/anchor';
import { Breadcrumb } from '../../components/navigation/breadcrumb';
import { Pagination } from '../../components/navigation/pagination';
import { Tabs } from '../../components/navigation/tabs';
import { Dialog } from '../../components/overlays/dialog';
import { Drawer } from '../../components/overlays/drawer';
import { DropdownMenu } from '../../components/overlays/dropdown-menu';
import { ListBox } from '../../components/overlays/list-box';
import { Modal } from '../../components/overlays/modal';
import { Popover } from '../../components/overlays/popover';
import { Tooltip } from '../../components/overlays/tooltip';
import { useMessages } from '../../i18n/context';
import type {
  AccordionProps,
  AlertProps,
  AnchorProps,
  AutocompleteProps,
  AvatarProps,
  BadgeProps,
  BreadcrumbProps,
  ButtonProps,
  CardProps,
  CheckboxCardProps,
  CheckboxGroupProps,
  CheckboxProps,
  ChevronIconProps,
  CodeProps,
  GridProps,
  DialogProps,
  DrawerProps,
  DropdownMenuProps,
  FileFieldProps,
  FormControlProps,
  FormProps,
  HeadingProps,
  IconButtonProps,
  IconName,
  IconProps,
  ListBoxProps,
  ModalProps,
  NumberFieldProps,
  PaginationProps,
  PasswordInputProps,
  PopoverProps,
  ProgressProps,
  RadioCardProps,
  RadioProps,
  ScrollLinkedProps,
  SelectProps,
  SeparatorProps,
  SkeletonProps,
  SliderProps,
  SpinnerProps,
  StackProps,
  StatusIconProps,
  SwitchProps,
  TableProps,
  TabsProps,
  TextareaProps,
  TextFieldProps,
  ToastProps,
  TooltipProps,
} from './schemas';

// 生成 UI で使えるアイコン（schemas.ts の iconName と対応）。
const iconMap = {
  plus: PlusIcon,
  minus: MinusIcon,
  check: CheckIcon,
  close: CloseIcon,
  copy: CopyIcon,
  send: SendIcon,
  mail: MailIcon,
  subscribe: SubscribeIcon,
  rss: RSSIcon,
  history: HistoryIcon,
  'update-date': UpdateDateIcon,
  'publish-date': PublishDateIcon,
  link: LinkIcon,
  'external-link': ExternalLinkIcon,
  location: LocationIcon,
  'navigation-menu': NavigationMenuIcon,
  list: ListIcon,
  table: TableIcon,
  form: FormIcon,
  view: ViewIcon,
  'view-off': ViewOffIcon,
  'light-mode': LightModeIcon,
  'dark-mode': DarkModeIcon,
  palette: PaletteIcon,
  'color-contrast': ColorContrastIcon,
  'color-info': ColorInfoIcon,
  'mixed-color': MixedColorIcon,
  'horizontal-writing': HorizontalWritingIcon,
  'vertical-writing': VerticalWritingIcon,
  tag: TagIcon,
  blog: BlogIcon,
  news: NewsIcon,
  slide: SlideIcon,
  sparkles: SparklesIcon,
  ai: AIIcon,
  atom: AtomIcon,
  accessibility: AccessibilityIcon,
  'shield-check': ShieldCheckIcon,
  prepare: PrepareIcon,
  informative: InformativeIcon,
  good: GoodIcon,
  bad: BadIcon,
  easy: EasyIcon,
  difficult: DifficultIcon,
  interesting: InterestingIcon,
  boring: BoringIcon,
  shallow: ShallowIcon,
  logo: LogoIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  qiita: QiitaIcon,
} satisfies Record<IconName, FC<{ size?: 'sm' | 'md' | 'lg' }>>;

/**
 * Generative UI 統合の描画関数（'use client'）。
 *
 * @k8ordo/ui のコンポーネントを無改造で使い、関数 prop（renderItem など）は
 * ここで内部的に組み立てる。json-render / OpenUI の両アダプタがこのモジュールを
 * 参照することで「見た目・橋渡しロジック」を 1 ソースに保つ。
 *
 * NOTE: OpenUI Lang は位置引数のため、省略された中間オプションが `null` で
 * 届きうる。@k8ordo/ui 側は `undefined` のみ想定するので `?? undefined` で正規化。
 */

// `null` (OpenUI の省略引数) と `undefined` を吸収する小ヘルパー。
const u = <T,>(value: T | null | undefined): T | undefined =>
  value ?? undefined;

export function renderButton(props: ButtonProps): ReactNode {
  const { label, href } = props;
  return (
    <Button
      color={u(props.color)}
      fullWidth={u(props.fullWidth)}
      renderItem={
        href !== undefined && href !== ''
          ? ({ className, children }) => (
              <a className={className} href={href}>
                {children}
              </a>
            )
          : undefined
      }
      size={u(props.size)}
      variant={u(props.variant)}
    >
      {label}
    </Button>
  );
}

export function renderBadge(props: BadgeProps): ReactNode {
  return (
    <Badge
      label={props.label}
      size={u(props.size)}
      tone={u(props.tone)}
      variant={u(props.variant)}
    />
  );
}

export function renderHeading(props: HeadingProps): ReactNode {
  return (
    <Heading lineClamp={u(props.lineClamp)} level={u(props.level) ?? 'h2'}>
      {props.label}
    </Heading>
  );
}

export function renderAlert(props: AlertProps): ReactNode {
  return <Alert message={props.message} tone={props.tone} />;
}

export function renderSpinner(props: SpinnerProps): ReactNode {
  return <Spinner label={u(props.label)} size={u(props.size)} />;
}

export function renderSeparator(props: SeparatorProps): ReactNode {
  return (
    <Separator color={u(props.color)} orientation={u(props.orientation)} />
  );
}

// The bare Card has no padding and the generative catalog has no className
// escape hatch, so map the integration `size` to a sensible inner padding
// (default md). Mirrors the size→padding convention in Chakra / Fluent / Radix.
const CARD_PADDING_CLASS = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const satisfies Record<'sm' | 'md' | 'lg', string>;

export function renderCard(props: CardProps, children: ReactNode): ReactNode {
  return (
    <Card
      variant={u(props.variant)}
      interactive={u(props.interactive)}
      width={u(props.width)}
    >
      <div className={CARD_PADDING_CLASS[props.size ?? 'md']}>{children}</div>
    </Card>
  );
}

// Tabs は ARIA の `aria-controls` / `aria-labelledby` で ID を参照するため、
// 同一ページに複数描画されても衝突しないよう `useId()` で生成する必要がある。
// （生成 UI では Tabs が複数並ぶケースは普通にあり得る）。
export const TabsView: FC<{ props: TabsProps }> = ({ props }) => {
  const messages = useMessages();
  const baseId = useId();
  const ids = props.tabs.map((_, index) => `${baseId}-tab-${index}`) as [
    string,
    ...string[],
  ];
  return (
    <Tabs.Root ids={ids}>
      <Tabs.List label={u(props.label) ?? messages.tabList}>
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
      align={u(props.align)}
      direction={u(props.direction)}
      gap={u(props.gap)}
      justify={u(props.justify)}
      padding={u(props.padding)}
    >
      {children}
    </Stack>
  );
}

export function renderGrid(props: GridProps, children: ReactNode): ReactNode {
  return (
    <Grid
      cols={u(props.cols)}
      gap={u(props.gap)}
      minItemSize={u(props.minItemSize)}
    >
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
      disabled={u(props.disabled)}
      invalid={u(props.invalid)}
      name={props.name}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder={u(props.placeholder)}
      readOnly={u(props.readOnly)}
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
      disabled={u(props.disabled)}
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
      disabled={u(props.disabled)}
      invalid={u(props.invalid)}
      label={props.label}
      name={props.name}
      onChange={onChange}
      required={u(props.required)}
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
      disabled={u(props.disabled)}
      invalid={u(props.invalid)}
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
      autoResize={u(props.autoResize)}
      disabled={u(props.disabled)}
      invalid={u(props.invalid)}
      name={props.name}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder={u(props.placeholder)}
      readOnly={u(props.readOnly)}
      rows={u(props.rows)}
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
      disabled={u(props.disabled)}
      invalid={u(props.invalid)}
      name={props.name}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder={u(props.placeholder)}
      value={value}
    />
  );
}

export function renderNumberField(
  props: NumberFieldProps,
  value: number,
  onChange: (next: number) => void,
): ReactNode {
  return (
    <NumberField
      disabled={u(props.disabled)}
      invalid={u(props.invalid)}
      max={u(props.max)}
      min={u(props.min)}
      name={props.name}
      onChange={onChange}
      step={u(props.step)}
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
      disabled={u(props.disabled)}
      invalid={u(props.invalid)}
      max={u(props.max)}
      min={u(props.min)}
      name={props.name}
      onChange={onChange}
      step={u(props.step)}
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
    <div className="flex flex-col gap-1">
      <span className="text-fg-base text-sm font-medium" id={labelId}>
        {label}
      </span>
      {children(labelId)}
    </div>
  );
};

const RadioView: FC<{
  props: RadioProps;
  value: string;
  onChange: (next: string) => void;
}> = ({ props, value, onChange }) => (
  <LabeledField label={props.label}>
    {(labelId) => (
      <Radio
        aria-labelledby={labelId}
        disabled={u(props.disabled)}
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
        disabled={u(props.disabled)}
        invalid={u(props.invalid)}
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
        disabled={u(props.disabled)}
        invalid={u(props.invalid)}
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
      disabled={u(props.disabled)}
      nextLabel={u(props.nextLabel)}
      onChange={onChange}
      prevLabel={u(props.prevLabel)}
      totalPages={props.totalPages}
    />
  );
}

export function renderIcon(props: IconProps): ReactNode {
  const IconComponent = iconMap[props.name];
  return <IconComponent size={u(props.size) ?? 'md'} />;
}

// 汎用 Icon に乗せられない、追加引数が必要なアイコンを独立コンポーネントとして公開する。
export function renderChevronIcon(props: ChevronIconProps): ReactNode {
  return (
    <ChevronIcon direction={props.direction} size={u(props.size) ?? 'md'} />
  );
}

export function renderStatusIcon(props: StatusIconProps): ReactNode {
  return <AlertIcon size={u(props.size) ?? 'md'} status={props.status} />;
}

export function renderIconButton(props: IconButtonProps): ReactNode {
  const IconComponent = iconMap[props.icon];
  return (
    <IconButton color={u(props.color)} label={props.label} size={u(props.size)}>
      <IconComponent size={u(props.size) ?? 'md'} />
    </IconButton>
  );
}

export function renderAnchor(props: AnchorProps): ReactNode {
  return (
    <Anchor href={props.href} openInNewTab={u(props.openInNewTab)}>
      {props.label}
    </Anchor>
  );
}

export function renderAvatar(props: AvatarProps): ReactNode {
  return (
    <Avatar
      alt={u(props.alt)}
      fallback={u(props.fallback)}
      name={u(props.name)}
      size={u(props.size)}
      src={u(props.src)}
    />
  );
}

export function renderCode(props: CodeProps): ReactNode {
  return <Code>{props.code}</Code>;
}

export function renderProgress(props: ProgressProps): ReactNode {
  return (
    <Progress
      label={u(props.label)}
      max={props.max}
      min={u(props.min)}
      value={props.value}
    />
  );
}

export function renderSkeleton(props: SkeletonProps): ReactNode {
  return (
    <Skeleton
      animate={u(props.animate)}
      shape={u(props.shape)}
      size={u(props.size)}
    />
  );
}

export function renderAccordion(props: AccordionProps): ReactNode {
  return (
    <Accordion.Root>
      {props.items.map((item) => (
        <Accordion.Item defaultOpen={u(item.defaultOpen)} key={item.title}>
          <Accordion.Button>{item.title}</Accordion.Button>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export function renderBreadcrumb(props: BreadcrumbProps): ReactNode {
  return (
    <Breadcrumb.List size={u(props.size)}>
      {props.items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <Breadcrumb.Separator />}
          <Breadcrumb.Item>
            {item.href !== undefined && item.href !== '' ? (
              <Breadcrumb.Link current={u(item.current)} href={item.href}>
                {item.label}
              </Breadcrumb.Link>
            ) : (
              item.label
            )}
          </Breadcrumb.Item>
        </Fragment>
      ))}
    </Breadcrumb.List>
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
            <Table.HeaderCell align={u(column.align)} key={column.label}>
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
                align={u(props.columns[cellIndex]?.align)}
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

export function renderForm(props: FormProps, children: ReactNode): ReactNode {
  return <Form action={u(props.action)}>{children}</Form>;
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
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        side={side}
      >
        <Dialog.Root>
          <Dialog.Header
            onClose={() => {
              setIsOpen(false);
            }}
            title={title}
          />
          <Dialog.Content>{children}</Dialog.Content>
        </Dialog.Root>
      </Modal>
    </>
  );
};

export const ModalWidget: FC<{ props: ModalProps; children: ReactNode }> = ({
  props,
  children,
}) => (
  <OverlayWidget
    buttonProps={{ size: 'md', variant: 'solid' }}
    side={u(props.side)}
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
        side={u(props.side)}
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
      <Popover.Content
        renderItem={({ id, ref }) => (
          <div
            className="bg-bg-raised text-fg-base rounded-lg p-4 shadow-md"
            id={id}
            ref={ref}
          >
            {children}
          </div>
        )}
      />
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

export function renderDropdownMenu(props: DropdownMenuProps): ReactNode {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger label={props.triggerLabel} />
      <DropdownMenu.Content>
        {props.items.map((item) => (
          <DropdownMenu.Item
            key={item.label}
            label={item.label}
            onAction={() => {
              /* no-op: 生成 UI ではローカルメニューのみ */
            }}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export function renderScrollLinked(_props: ScrollLinkedProps): ReactNode {
  return <ScrollLinked />;
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
    <ListBox.Root
      onChange={onChange}
      options={props.options}
      value={value === '' ? undefined : value}
    >
      <ListBox.Trigger label={u(props.label)} />
      <ListBox.Content />
    </ListBox.Root>
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
        <CheckboxGroup.Root
          aria-labelledby={labelId}
          name={props.name}
          onChange={onChange}
          value={value}
        >
          {props.options.map((option) => (
            <CheckboxGroup.Item
              itemValue={option.value}
              key={option.value}
              label={option.label}
            />
          ))}
        </CheckboxGroup.Root>
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
      disabled={u(props.disabled)}
      id={id}
      invalid={u(props.invalid)}
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

export const FileFieldWidget: FC<{ props: FileFieldProps }> = ({ props }) => {
  const messages = useMessages();
  return (
    <FileField.Root maxFiles={u(props.maxFiles)} multiple={u(props.multiple)}>
      <FileField.Trigger
        renderItem={({ onClick, disabled }) => (
          <Button disabled={disabled} onClick={onClick} variant="outline">
            {u(props.triggerLabel) ?? messages.fileFieldTrigger}
          </Button>
        )}
      />
      <FileField.ItemList clearable={u(props.clearable)} />
    </FileField.Root>
  );
};

export const FormControlWidget: FC<{ props: FormControlProps }> = ({
  props,
}) => {
  const [value, setValue] = useState(props.defaultValue ?? '');
  const fieldType = u(props.fieldType) ?? 'text';
  return (
    <FormControl
      errorText={u(props.errorText)}
      helpText={u(props.helpText)}
      invalid={u(props.invalid)}
      label={props.label}
      renderInput={(inputProps) =>
        fieldType === 'textarea' ? (
          <Textarea
            {...inputProps}
            name={props.name}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            placeholder={u(props.placeholder)}
            value={value}
          />
        ) : fieldType === 'password' ? (
          <PasswordInput
            {...inputProps}
            name={props.name}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            placeholder={u(props.placeholder)}
            value={value}
          />
        ) : (
          <TextField
            {...inputProps}
            name={props.name}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            placeholder={u(props.placeholder)}
            value={value}
          />
        )
      }
      required={u(props.required)}
    />
  );
};
