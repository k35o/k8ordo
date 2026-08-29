# Interaction design

Interaction in `@k8ordo/ui` follows one principle: quiet change.

## Interactive states

Design with these eight states in mind.

| State    | Style                                                 |
| -------- | ----------------------------------------------------- |
| Default  | The base style                                        |
| Hover    | `hover:bg-bg-mute` — a gentle color shift             |
| Focus    | `focus-visible:ring-2 focus-visible:ring-border-info` |
| Active   | `active:bg-bg-emphasize`                              |
| Disabled | `opacity-50 cursor-not-allowed`                       |
| Loading  | A spinner or a skeleton                               |
| Selected | `bg-primary-bg-subtle`                                |
| Error    | `border-border-error` + `text-fg-error`               |

## Transitions

Restrained, natural motion.

| Purpose                        | Recommended setting                        |
| ------------------------------ | ------------------------------------------ |
| Hover color change             | `transition-colors duration-150 ease-out`  |
| Opacity change                 | `transition-opacity duration-200 ease-out` |
| When size changes are involved | `transition-all duration-150 ease-out`     |

### Timing principles

- **100ms**: immediate feedback (a button press)
- **150–200ms**: the standard transition (hover, focus)
- **300ms**: open/close animation (the limit for Accordion, Drawer)
- **Never exceed 300ms** — it starts to feel heavy

### Choosing an animation

```tsx
// Good: transition-colors (only the color changes)
className = 'transition-colors hover:bg-bg-mute';

// OK: transition-all (only when several properties change)
className = 'transition-all hover:bg-bg-mute hover:scale-[1.02]';

// Bad: bounce or spring easing
className = 'animate-bounce';
```

## Focus management

- Use `focus-visible`, not `focus` — no ring appears on a mouse click
- Keep the focus ring consistent with `ring-border-info`
- Clear the default outline with `outline-hidden` before applying the ring

```tsx
className =
  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border-info';
```

## Form design

- Put the label above the input (a left-aligned label reads badly in Japanese)
- Put the error message directly under the input, as `text-fg-error text-sm`
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
- Respect `prefers-reduced-motion` — the motion library handles it for you
- Never signal state with color alone; pair it with an icon or text

## What not to do

- Bounce or spring easing
- Animation longer than 300ms
- A strong primary color (`bg-primary-bg`) on hover
- `cursor-pointer` on anything that is not a button (links do not need it either)
- A submit button with no double-click guard
