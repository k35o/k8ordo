# Interaction design

Interaction in `@k8ordo/ui` follows one principle: quiet change.

## Interactive states

Design with these eight states in mind.

| State    | Style                                                     |
| -------- | --------------------------------------------------------- |
| Default  | The base style                                            |
| Hover    | `--color-bg-mute` — a gentle color shift                  |
| Focus    | `box-shadow: var(--shadow-ring-info)` on `:focus-visible` |
| Active   | `--color-bg-emphasize`                                    |
| Disabled | `opacity: 0.5; cursor: not-allowed`                       |
| Loading  | A spinner or a skeleton                                   |
| Selected | `--color-primary-bg-subtle`                               |
| Error    | `--color-border-error` + `--color-fg-error`               |

## Transitions

Restrained, natural motion.

| Purpose                        | Recommended setting                                      |
| ------------------------------ | -------------------------------------------------------- |
| Hover color change             | the colors over `--duration-fast` with `--easing-out`    |
| Opacity change                 | `opacity` over `--duration-moderate` with `--easing-out` |
| When size changes are involved | the changing properties over `--duration-fast`           |
| A page or a panel replaced     | `<ViewTransition>` — the browser's cross-fade            |

`--duration-fast` is 150ms, `--duration-moderate` 200ms and `--duration-slow`
300ms. `--easing-out` and `--easing-in-out` are Tailwind's curves
(`cubic-bezier(0, 0, 0.2, 1)` and `cubic-bezier(0.4, 0, 0.2, 1)`), not the CSS
keywords of the same name. With `tailwind.css`: `transition-colors
duration-150 ease-out`.

### Timing principles

- **100ms**: immediate feedback (a button press)
- **150–200ms**: the standard transition (hover, focus)
- **300ms**: open/close animation (the limit for Accordion, Drawer)
- **Never exceed 300ms** — it starts to feel heavy

### Choosing an animation

```css
/* Good: transition only the colors that change */
.item {
  transition-property: color, background-color;
  transition-duration: var(--duration-fast);
  transition-timing-function: var(--easing-out);
}

@media (hover: hover) {
  .item:hover {
    background-color: var(--color-bg-mute);
  }
}

/* OK: list every property when several change */
.card {
  transition-property: background-color, scale;
  transition-duration: var(--duration-fast);
  transition-timing-function: var(--easing-out);
}

/* Bad: bounce or spring easing */
```

## Focus management

- Use `:focus-visible`, not `:focus` — no ring appears on a mouse click
- Keep the focus ring consistent with `--shadow-ring-info`
- Clear the default outline before applying the ring, and give it back under forced colors, where the ring (a shadow) disappears
- Keep focus on a button that is waiting on its own action: show the wait with `aria-busy` and `aria-disabled` and ignore presses, rather than setting `disabled`. Chromium moves focus to `body` when the focused element becomes disabled, so the keyboard user who pressed it loses their place. `Button` and `IconButton` do this for `onAction`
- For the same reason, a text field whose form's action is pending turns `readOnly`, not `disabled`, and ignores the keys that would change its value, so the user who pressed Enter in it keeps their place. `TextField`, `Textarea`, `PasswordInput`, `NumberField`, `DateField`, `DatePicker`, `ColorPicker`, `Combobox`, and `Autocomplete` do this. `readOnly` does not apply to a checkbox, radio, range, or select, yet Enter in one still submits the form through its submit button, so `Checkbox`, `Radio`, `Switch`, `Slider`, `RangeSlider`, and `Select` take `aria-disabled` instead and ignore what would change their value. A checkbox or radio cancels the click in the capture phase and stops it there: cancelled any later, React's change tracking has already recorded the toggle the browser then undoes, calls `onChange` for it, and misses the next real one. A range ignores the arrow, Home, End, and Page keys and the pointer; a select ignores those keys, Space, F4, typed characters, and the pointer

```css
.control:focus-visible {
  outline-style: none;
  box-shadow: var(--shadow-ring-info);

  @media (forced-colors: active) {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
}
```

## Form design

- Put the label above the input (a left-aligned label reads badly in Japanese)
- Put the error message directly under the input, in `--color-fg-error` at `--font-size-sm`
- Mark required fields with `*` after the label
- Validate on submit; keep real-time validation to a minimum
- Use the `FormControl` component so labels and errors stay consistent

```tsx
import { FormControl, TextField } from '@k8ordo/ui';

<FormControl
  label="Email address"
  errorText="This field is required"
  required
  renderInput={(props) => (
    <TextField {...props} placeholder="example@mail.com" />
  )}
/>;
```

## Accessibility

- Set `aria-label` / `aria-describedby` where they belong
- Guarantee keyboard navigation (Tab, Enter, Escape, arrow keys)
- Respect `prefers-reduced-motion`. Under it the stylesheet turns off the open animation of Popover and what is built on it (DropdownMenu, ListBox, Tooltip), the Toast, Modal, and Drawer animations, the Tabs indicator slide, and every view transition; `Card`'s hover scale runs only under `prefers-reduced-motion: no-preference`. Skeleton's pulse, Spinner's spin, and the Accordion chevron, Switch thumb, and Progress bar transitions keep running. Put your own motion under `@media (prefers-reduced-motion: no-preference)`
- Never signal state with color alone; pair it with an icon or text
- The components follow `prefers-contrast: more` and stay legible under `forced-colors: active` (see [High contrast and forced colors](./color.md#high-contrast-and-forced-colors)); do the same in your own UI

## What not to do

- Bounce or spring easing
- Animation longer than 300ms
- A strong primary color (`--color-primary-bg`) on hover
- `cursor: pointer` on anything that is not a button (links do not need it either)
- A submit button with no double-click guard
