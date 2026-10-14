# Spacing and layout

`@k8ordo/ui` is a design that lets the spacing speak. Do not pack things in;
leave room.

## Spacing principles

A 4pt spacing system: one token, `--spacing` (0.25rem), multiplied by the step
you want — `calc(var(--spacing) * 6)` is 1.5rem. With `tailwind.css`, the
step is the utility's number (`p-6`, `gap-8`).

### Padding inside a component

| Use               | Step | Value |
| ----------------- | ---- | ----- |
| Compact           | 4    | 16px  |
| Standard          | 6    | 24px  |
| Generous          | 8    | 32px  |
| Inside a big card | 10   | 40px  |

### Spacing between blocks of text

| Relationship           | Step | Use                                     |
| ---------------------- | ---- | --------------------------------------- |
| Closely related        | 2    | Descriptions, help text                 |
| Standard               | 4    | Between paragraphs, between form fields |
| Between sections       | 8    | A section break                         |
| Between major sections | 12   | A page-level break                      |

### Spacing between sections

| Relationship     | Step   | Use                            |
| ---------------- | ------ | ------------------------------ |
| Between cards    | 6      | Cards side by side (in a grid) |
| Between sections | 8 – 10 | Sections stacked vertically    |

## Border radius

**"Soft where you touch, precise where you read."**

Vary the radius with the element's role.

### Things you touch (soft)

| Use                           | Token           | Value |
| ----------------------------- | --------------- | ----- |
| Button                        | `--radius-full` | Pill  |
| Input, Textarea, Select       | `--radius-xl`   | 1rem  |
| Card, CheckboxCard, RadioCard | `--radius-xl`   | 1rem  |

### Things you read (precise)

| Use      | Token           | Value                          |
| -------- | --------------- | ------------------------------ |
| Alert    | `--radius-lg`   | 0.75rem                        |
| Callout  | `--radius-lg`   | 0.75rem                        |
| Badge    | `--radius-full` | Pill (fine, since it is small) |
| Tabs     | As-is           |                                |
| Checkbox | `--radius-md`   | 0.5rem                         |

### Everything else

| Use                              | Token           |
| -------------------------------- | --------------- |
| Dialog, Modal                    | `--radius-lg`   |
| Avatar, IconButton, progress bar | `--radius-full` |

With `tailwind.css` these are `rounded-full`, `rounded-xl`, … .

## Shadow

Express depth with a soft, gentle shadow.

| Use                      | Style                                                    |
| ------------------------ | -------------------------------------------------------- |
| Card (default)           | `--shadow-sm` (with `variant="shadow"`)                  |
| Card (outlined)          | a 1px `--color-border-mute` border (`variant="outline"`) |
| Modal / Dialog / Tooltip | `--shadow-md`                                            |
| Dropdown / ListBox       | `--shadow-md`                                            |
| Button                   | None                                                     |

Never use `--shadow-xl` or heavier. The focus ring is a shadow too,
`--shadow-ring-info`; with a surface's own shadow, list the ring first:
`box-shadow: var(--shadow-ring-info), var(--shadow-xs)`.

## Page structure

### The bg-subtle plus white card pattern

Make the page background `--color-bg-subtle` (a light grey) and float the
content on white cards.

```css
.page {
  min-height: 100vh;
  background-color: var(--color-bg-subtle);
}

.body {
  padding: calc(var(--spacing) * 6);
}
```

```tsx
// Good: a white card floating on a grey ground
<div className={styles.page}>
  <Card variant="shadow">
    <div className={styles.body}>Content</div>
  </Card>
</div>
```

### Build hierarchy out of spacing

Let the size of the gap show how related things are: 12 steps above a
section, 2 between a heading and the description that belongs to it, 8 before
content that sits a little apart. The same gap everywhere flattens the page.

```css
.section {
  margin-top: calc(var(--spacing) * 12);
}

.description {
  margin-top: calc(var(--spacing) * 2);
}

.content {
  margin-top: calc(var(--spacing) * 8);
}
```

### A card is not the answer to everything

Content does not have to go in a card. Spacing and a separator are often enough.

```tsx
import { Separator } from '@k8ordo/ui';

// Good: divide with a separator (.divider { padding-block: calc(var(--spacing) * 8); })
<div>
  <section>Content A</section>
  <div className={styles.divider}>
    <Separator />
  </div>
  <section>Content B</section>
</div>

// Excessive: everything in a card
<Card>Content A</Card>
<Card>Content B</Card>
```

## What not to do

- Extremely tight spacing such as one step (`calc(var(--spacing) * 1)`)
- Cramming content in (space wins over information density)
- Nested cards (Card in Card)
- A z-index of your own: stack with `--z-index-raised` (inside a component), `--z-index-overlay`, `--z-index-modal` and `--z-index-toast`
