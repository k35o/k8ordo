'use client';

import { Fragment, useId, useMemo, useState } from 'react';
import type {
  ComponentProps,
  FC,
  ReactElement,
  ReactNode,
  SubmitEvent,
} from 'react';

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
import { Alert } from '../components/feedback/alert';
import { Callout } from '../components/feedback/callout';
import { EmptyState } from '../components/feedback/empty-state';
import { Progress } from '../components/feedback/progress';
import { Skeleton } from '../components/feedback/skeleton';
import { Spinner } from '../components/feedback/spinner';
import { useToast } from '../components/feedback/toast';
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
  CatalogEventOf,
  CatalogName,
  CatalogProps,
  CatalogValueOf,
} from './index';
import { toTree } from './to-tree';

import styles from './render.module.css';

/**
 * What a format hands the renderer of the component `N`: the props the model
 * wrote, the children the format drew, for a field its value and the setter
 * the format's state is written through, and for a component with events the
 * handlers of the ones the model bound.
 */
export type RenderArgs<N extends CatalogName> = {
  /**
   * Values that fit the entry's `props` schema, with no `null`: a prop the
   * model left out is absent or `undefined`. The glue drops the `null` keys a
   * format wrote (OpenUI Lang writes an omitted value as `null`), nested ones
   * included, parses the rest with the schema, and passes what the parse
   * returns; it draws nothing for an element that fails.
   */
  props: CatalogProps<N>;
  /** One node per child, keyed (`Children.toArray` keys them). Left out for a component without children. */
  children?: readonly ReactNode[];
} & ([CatalogValueOf<N>] extends [never]
  ? unknown
  : {
      value: CatalogValueOf<N>;
      setValue: (next: CatalogValueOf<N>) => void;
    }) &
  ([CatalogEventOf<N>] extends [never]
    ? unknown
    : {
        /**
         * The handler of each event the model bound, by name. An event left out
         * is unbound, and the component draws as if it had no such event: a
         * card is not pressable, a button presses to no effect.
         */
        on?: Partial<Record<CatalogEventOf<N>, () => void | Promise<void>>>;
      });

/** Draws the component `N` with `@k8ordo/ui`. */
export type Renderer<N extends CatalogName> = (
  args: RenderArgs<N>,
) => ReactNode;

/**
 * `RenderArgs` with the types of the component erased, for a glue that knows
 * a component's name only at run time: the props it parsed with the entry's
 * schema, and for a field its value and setter, typed as `unknown`.
 */
export type AnyRenderArgs = {
  props: Record<string, unknown>;
  children?: readonly ReactNode[];
  value?: unknown;
  setValue?: (next: unknown) => void;
  on?: Record<string, () => void | Promise<void>>;
};

/** A renderer of `renderers` with the types of its component erased (see `rendererOf`). */
export type AnyRenderer = (args: AnyRenderArgs) => ReactNode;

// 部品は手を加えずに使い、関数を受ける prop（renderItem など）はここで組み立てる。
// モデルが書けるのは平らなデータだけで、関数は書けないため。
//
// props はスキーマに合う値（null を含まない）として受け、ここではそろえない。
// 形式ごとの書き方の違い（OpenUI Lang が省いた位置引数を null で渡すなど）は、
// その形式のつなぎがそろえてから渡す。ここで吸収すると、どの形式にも依らない
// 描画が 1 つの形式の都合を抱える。

type FieldWiring = Parameters<
  ComponentProps<typeof FormControl>['renderInput']
>[0];

// catalog は errorText を持たないので、束の invalid は常に false。欄の
// invalid は束を広げたあとに、スキーマの値で上書きする
const drawField = (
  props: {
    label: string;
    helpText?: string | undefined;
    disabled?: boolean | undefined;
    required?: boolean | undefined;
  },
  renderInput: (wiring: FieldWiring) => ReactElement,
  labelAs: 'label' | 'group' = 'label',
): ReactNode => (
  <FormControl
    disabled={props.disabled}
    helpText={props.helpText}
    label={props.label}
    labelAs={labelAs}
    renderInput={renderInput}
    required={props.required}
  />
);

const CARD_PADDING_CLASS = {
  sm: styles.cardSm,
  md: styles.cardMd,
  lg: styles.cardLg,
} as const satisfies Record<'sm' | 'md' | 'lg', string>;

const submitNothing = (event: SubmitEvent<HTMLFormElement>): void => {
  event.preventDefault();
};

const chooseNothing = (): void => {};

// Tabs は ARIA の `aria-controls` / `aria-labelledby` で ID を参照するため、
// 同一ページに複数描画されても衝突しないよう `useId()` で生成する必要がある。
// （生成 UI では Tabs が複数並ぶケースは普通にあり得る）。
const TabsWidget: FC<{ props: CatalogProps<'Tabs'> }> = ({ props }) => {
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

const DataTableWidget: FC<{ props: CatalogProps<'DataTable'> }> = ({
  props,
}) => {
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

const DialogWidget: FC<{
  props: CatalogProps<'Dialog'>;
  children: ReactNode;
}> = ({ props, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {props.triggerLabel}
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        side={props.side}
        title={props.title}
      >
        {children}
      </Dialog>
    </>
  );
};

const DrawerWidget: FC<{
  props: CatalogProps<'Drawer'>;
  children: ReactNode;
}> = ({ props, children }) => {
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

const ToastWidget: FC<{ props: CatalogProps<'Toast'> }> = ({ props }) => {
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

const FileFieldWidget: FC<{ props: CatalogProps<'FileField'> }> = ({
  props,
}) => {
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
  return drawField(
    props,
    (wiring) => (
      <FileField.Root
        {...wiring}
        maxFiles={props.maxFiles}
        multiple={props.multiple}
      >
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
    ),
    'group',
  );
};

/**
 * `@k8ordo/ui/catalog/render` ('use client')
 *
 * How each component of `@k8ordo/ui/catalog` is drawn, with the same names.
 * A format's renderer looks the component up here and calls it with the props
 * and children it resolved; a field also gets the value the format holds and
 * a setter for it, so the format decides where the value lives.
 *
 * @example
 * 'use client';
 * import { renderers } from '@k8ordo/ui/catalog/render';
 *
 * renderers.Button({ props: { label: 'OK' } });
 */
export const renderers: { [N in CatalogName]: Renderer<N> } = {
  Stack: ({ props, children }) => (
    <Stack
      align={props.align}
      direction={props.direction}
      gap={props.gap}
      justify={props.justify}
      padding={props.padding}
    >
      {children}
    </Stack>
  ),
  Grid: ({ props, children }) => (
    <Grid cols={props.cols} gap={props.gap} minItemSize={props.minItemSize}>
      {children}
    </Grid>
  ),
  Card: ({ props, children, on }) => (
    <Card
      action={on?.press}
      href={props.href}
      variant={props.variant}
      width={props.width}
    >
      <div className={CARD_PADDING_CLASS[props.size ?? 'md']}>{children}</div>
    </Card>
  ),
  Form: ({ children }) => <Form onSubmit={submitNothing}>{children}</Form>,
  // 子の 1 つずつが 1 枚のスライドになる。位置で固定の列なので index キーでよい
  Carousel: ({ props, children = [] }) => (
    <Carousel.Root label={props.label} slideSize={props.slideSize}>
      {children.map((slide, index) => (
        // eslint-disable-next-line react/no-array-index-key -- 静的な位置リスト
        <Carousel.Slide key={index}>{slide}</Carousel.Slide>
      ))}
    </Carousel.Root>
  ),
  Button: ({ props, on }) => {
    const look = {
      color: props.color,
      fullWidth: props.fullWidth,
      size: props.size,
      variant: props.variant,
    };
    return props.href === undefined ? (
      <Button {...look} action={on?.press}>
        {props.label}
      </Button>
    ) : (
      <Button {...look} href={props.href}>
        {props.label}
      </Button>
    );
  },
  IconButton: ({ props, on }) => {
    const IconComponent = iconMap[props.icon];
    return (
      <IconButton
        action={on?.press}
        color={props.color}
        label={props.label}
        size={props.size}
        variant={props.variant}
      >
        <IconComponent size={props.size ?? 'md'} />
      </IconButton>
    );
  },
  CopyButton: ({ props }) => (
    <CopyButton
      iconOnly={props.iconOnly}
      label={props.label}
      size={props.size}
      value={props.value}
    />
  ),
  Toolbar: ({ props }) => (
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
  ),
  Anchor: ({ props }) => (
    <Anchor href={props.href} openInNewTab={props.openInNewTab}>
      {props.label}
    </Anchor>
  ),
  Breadcrumb: ({ props }) => (
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
  ),
  Pagination: ({ props, value, setValue }) => (
    <Pagination
      currentPage={value}
      disabled={props.disabled}
      nextLabel={props.nextLabel}
      onChange={setValue}
      prevLabel={props.prevLabel}
      totalPages={props.totalPages}
    />
  ),
  Stepper: ({ props }) => (
    <Stepper
      aria-label={props.label}
      orientation={props.orientation}
      steps={props.steps}
      value={props.current}
    />
  ),
  SideNav: ({ props }) => (
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
  ),
  Badge: ({ props }) => (
    <Badge
      label={props.label}
      size={props.size}
      tone={props.tone}
      variant={props.variant}
    />
  ),
  Heading: ({ props }) => (
    <Heading lineClamp={props.lineClamp} level={props.level ?? 'h2'}>
      {props.label}
    </Heading>
  ),
  Avatar: ({ props }) => (
    <Avatar
      alt={props.alt}
      fallback={props.fallback}
      name={props.name}
      size={props.size}
      src={props.src}
    />
  ),
  Code: ({ props }) => <Code>{props.code}</Code>,
  Kbd: ({ props }) => (
    <span className={styles.keys}>
      {props.keys.map((key, index) => (
        // eslint-disable-next-line react/no-array-index-key -- 同じキーが並びうる静的な列
        <Kbd key={`${key}-${index}`}>{key}</Kbd>
      ))}
    </span>
  ),
  EmptyState: ({ props }) => {
    const IconComponent =
      props.icon === undefined ? undefined : iconMap[props.icon];
    return (
      <EmptyState
        description={props.description}
        icon={
          IconComponent === undefined ? undefined : <IconComponent size="lg" />
        }
        title={props.title}
      />
    );
  },
  Icon: ({ props }) => {
    const IconComponent = iconMap[props.name];
    return <IconComponent size={props.size ?? 'md'} />;
  },
  Alert: ({ props }) => <Alert message={props.message} tone={props.tone} />,
  Callout: ({ props }) => (
    <Callout label={props.label} tone={props.tone}>
      <p>{props.content}</p>
    </Callout>
  ),
  Spinner: ({ props }) => <Spinner label={props.label} size={props.size} />,
  Progress: ({ props }) => (
    <Progress
      label={props.label}
      max={props.max}
      min={props.min}
      value={props.value}
    />
  ),
  Skeleton: ({ props }) => (
    <Skeleton animate={props.animate} shape={props.shape} size={props.size} />
  ),
  Separator: ({ props }) => (
    <Separator color={props.color} orientation={props.orientation} />
  ),
  Tabs: ({ props }) => <TabsWidget props={props} />,
  Accordion: ({ props }) => (
    <Accordion.Root>
      {props.items.map((item) => (
        <Accordion.Item defaultOpen={item.defaultOpen} key={item.title}>
          <Accordion.Button level="h3">{item.title}</Accordion.Button>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
  Table: ({ props }) => (
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
  ),
  DataTable: ({ props }) => <DataTableWidget props={props} />,
  Tree: ({ props }) => (
    <Tree
      defaultExpandedIds={props.items
        .filter((item) => item.expanded === true)
        .map((item) => item.id)}
      items={toTree(props.items)}
      label={props.label}
    />
  ),
  Dialog: ({ props, children }) => (
    <DialogWidget props={props}>{children}</DialogWidget>
  ),
  Drawer: ({ props, children }) => (
    <DrawerWidget props={props}>{children}</DrawerWidget>
  ),
  Popover: ({ props, children }) => (
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
  ),
  Tooltip: ({ props }) => (
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
  ),
  DropdownMenu: ({ props, children }) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger label={props.triggerLabel} />
      <DropdownMenu.Content>{children}</DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
  DropdownMenuItem: ({ props, on }) => (
    <DropdownMenu.Item
      label={props.label}
      onAction={on?.press ?? chooseNothing}
    />
  ),
  Toast: ({ props }) => <ToastWidget props={props} />,
  TextField: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <TextField
        {...wiring}
        invalid={props.invalid}
        name={props.name}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        type={props.type}
        value={value}
      />
    )),
  Textarea: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <Textarea
        {...wiring}
        autoResize={props.autoResize}
        invalid={props.invalid}
        name={props.name}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        rows={props.rows}
        value={value}
      />
    )),
  PasswordInput: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <PasswordInput
        {...wiring}
        invalid={props.invalid}
        name={props.name}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        placeholder={props.placeholder}
        value={value}
      />
    )),
  NumberField: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <NumberField
        {...wiring}
        invalid={props.invalid}
        max={props.max}
        min={props.min}
        name={props.name}
        onChange={setValue}
        step={props.step}
        value={value}
      />
    )),
  Slider: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <Slider
        {...wiring}
        invalid={props.invalid}
        max={props.max}
        min={props.min}
        name={props.name}
        onChange={setValue}
        step={props.step}
        value={value}
      />
    )),
  // 両方のつまみが同じ name で送るので、FormData では [下側, 上側] の配列になる
  RangeSlider: ({ props, value, setValue }) =>
    drawField(
      props,
      (wiring) => (
        <RangeSlider
          {...wiring}
          invalid={props.invalid}
          max={props.max}
          min={props.min}
          name={[props.name, props.name]}
          onChange={setValue}
          step={props.step}
          value={value}
        />
      ),
      'group',
    ),
  DatePicker: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <DatePicker
        {...wiring}
        invalid={props.invalid}
        max={props.max}
        min={props.min}
        name={props.name}
        onChange={setValue}
        value={value}
      />
    )),
  Calendar: ({ props, value, setValue }) => (
    <Calendar
      max={props.max}
      min={props.min}
      onChange={setValue}
      value={value === '' ? null : value}
    />
  ),
  ColorPicker: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <ColorPicker
        {...wiring}
        invalid={props.invalid}
        name={props.name}
        onChange={setValue}
        swatches={props.swatches}
        value={value}
      />
    )),
  Combobox: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <Combobox
        {...wiring}
        invalid={props.invalid}
        name={props.name}
        onChange={setValue}
        options={props.options}
        placeholder={props.placeholder}
        value={value}
      />
    )),
  Checkbox: ({ props, value, setValue }) => (
    <Checkbox
      checked={value}
      disabled={props.disabled}
      helpText={props.helpText}
      label={props.label}
      name={props.name}
      onChange={setValue}
    />
  ),
  Switch: ({ props, value, setValue }) => (
    <Switch
      checked={value}
      disabled={props.disabled}
      helpText={props.helpText}
      invalid={props.invalid}
      label={props.label}
      name={props.name}
      onChange={setValue}
      required={props.required}
    />
  ),
  Select: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <Select
        {...wiring}
        invalid={props.invalid}
        name={props.name}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        options={props.options}
        value={value}
      />
    )),
  Radio: ({ props, value, setValue }) =>
    drawField(
      props,
      (wiring) => (
        <Radio
          {...wiring}
          name={props.name}
          onChange={setValue}
          options={props.options}
          value={value}
        />
      ),
      'group',
    ),
  RadioCard: ({ props, value, setValue }) =>
    drawField(
      props,
      (wiring) => (
        <RadioCard
          {...wiring}
          invalid={props.invalid}
          name={props.name}
          onChange={setValue}
          options={props.options}
          value={value}
        />
      ),
      'group',
    ),
  CheckboxCard: ({ props, value, setValue }) =>
    drawField(
      props,
      (wiring) => (
        <CheckboxCard
          {...wiring}
          invalid={props.invalid}
          name={props.name}
          onChange={setValue}
          options={props.options}
          value={value}
        />
      ),
      'group',
    ),
  ListBox: ({ props, value, setValue }) => (
    <ListBox
      label={props.label}
      onChange={setValue}
      options={props.options}
      value={value === '' ? undefined : value}
    />
  ),
  CheckboxGroup: ({ props, value, setValue }) =>
    drawField(
      props,
      (wiring) => (
        <CheckboxGroup
          {...wiring}
          name={props.name}
          onChange={setValue}
          options={props.options}
          value={value}
        />
      ),
      'group',
    ),
  Autocomplete: ({ props, value, setValue }) =>
    drawField(props, (wiring) => (
      <Autocomplete
        {...wiring}
        invalid={props.invalid}
        name={props.name}
        onChange={setValue}
        options={props.options}
        value={value}
      />
    )),
  FileField: ({ props }) => <FileFieldWidget props={props} />,
};

/**
 * The renderer of `name` with the types of its component erased, for a glue
 * that maps over the catalog and so knows the name only at run time. Parse
 * the props with `catalog[name].props` before calling it, as for
 * `renderers[name]`.
 *
 * @example
 * const render = rendererOf(name);
 * render({ props: parsed, children, value, setValue, on });
 */
export const rendererOf = (name: CatalogName): AnyRenderer =>
  // 名前ごとに引数の型が違う関数の union は、そのままでは呼べない。名前を
  // 実行時にしか知らないつなぎのために、型を消すのはここ 1 か所にする
  renderers[name] as AnyRenderer;
