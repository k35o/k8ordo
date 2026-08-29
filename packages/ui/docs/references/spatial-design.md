# Spacing and layout

`@k8ordo/ui` is a design that lets the spacing speak. Do not pack things in;
leave room.

## Spacing principles

A 4pt spacing system, using Tailwind's standard scale.

### Padding inside a component

| Use               | Class  | Value |
| ----------------- | ------ | ----- |
| Compact           | `p-4`  | 16px  |
| Standard          | `p-6`  | 24px  |
| Generous          | `p-8`  | 32px  |
| Inside a big card | `p-10` | 40px  |

### Spacing between blocks of text

| Relationship           | Class   | Use                                     |
| ---------------------- | ------- | --------------------------------------- |
| Closely related        | `mt-2`  | Descriptions, help text                 |
| Standard               | `mt-4`  | Between paragraphs, between form fields |
| Between sections       | `mt-8`  | A section break                         |
| Between major sections | `mt-12` | A page-level break                      |

### Spacing between sections

| Relationship     | Class              | Use                            |
| ---------------- | ------------------ | ------------------------------ |
| Between cards    | `gap-6`            | Cards side by side (in a grid) |
| Between sections | `gap-8` – `gap-10` | Sections stacked vertically    |

## Border radius

**"Soft where you touch, precise where you read."**

Vary the radius with the element's role.

### Things you touch (soft)

| Use                           | Class          | Value |
| ----------------------------- | -------------- | ----- |
| Button                        | `rounded-full` | Pill  |
| Input, Textarea, Select       | `rounded-xl`   | 1rem  |
| Card, CheckboxCard, RadioCard | `rounded-xl`   | 1rem  |

### Things you read (precise)

| Use      | Class          | Value                          |
| -------- | -------------- | ------------------------------ |
| Alert    | `rounded-lg`   | 0.75rem                        |
| Badge    | `rounded-full` | Pill (fine, since it is small) |
| Tabs     | As-is          |                                |
| Checkbox | `rounded-md`   | 0.5rem                         |

### Everything else

| Use                              | Class          |
| -------------------------------- | -------------- |
| Dialog, Modal                    | `rounded-lg`   |
| Avatar, IconButton, progress bar | `rounded-full` |

## Shadow

Express depth with a soft, gentle shadow.

| Use                      | Style                                                      |
| ------------------------ | ---------------------------------------------------------- |
| Card (default)           | `shadow-sm` (with `appearance="shadow"`)                   |
| Card (bordered)          | `border border-border-mute` (with `appearance="bordered"`) |
| Modal / Dialog / Tooltip | `shadow-md`                                                |
| Dropdown / ListBox       | `shadow-md`                                                |
| Button                   | None                                                       |

Never use `shadow-xl` or heavier.

## Page structure

### The bg-subtle plus white card pattern

Make the page background `bg-bg-subtle` (a light grey) and float the content on
white cards.

```tsx
// Good: a white card floating on a grey ground
<div className="bg-bg-subtle min-h-screen">
  <Card appearance="shadow">
    <div className="p-8">Content</div>
  </Card>
</div>
```

### Build hierarchy out of spacing

```tsx
// Good: the size of the gap shows how related things are
<section className="mt-12">
  <Heading level="h2">Section</Heading>
  <p className="mt-2">A description that belongs to it</p>
  <div className="mt-8">Content that sits a little apart</div>
</section>

// Bad: the same gap everywhere
<section className="mt-4">
  <Heading level="h2">Section</Heading>
  <p className="mt-4">Description</p>
  <div className="mt-4">Content</div>
</section>
```

### A card is not the answer to everything

Content does not have to go in a card. Spacing and a separator are often enough.

```tsx
import { Separator } from '@k8ordo/ui';

// Good: divide with a separator
<div>
  <section>Content A</section>
  <div className="py-8">
    <Separator />
  </div>
  <section>Content B</section>
</div>

// Excessive: everything in a card
<Card>Content A</Card>
<Card>Content B</Card>
```

## What not to do

- Extremely tight spacing such as `gap-1` or `p-1`
- Cramming content in (space wins over information density)
- Nested cards (Card in Card)
- A z-index above 12
