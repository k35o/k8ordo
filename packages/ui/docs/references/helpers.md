# Helpers and types

Utility functions and type definitions that `@k8ordo/ui` provides.

```tsx
import { cn, between, commalize, uuidV4 } from '@k8ordo/ui';
import type { Status, Direction, Option } from '@k8ordo/ui';
```

## Helper functions

### cn

Merges Tailwind classes (clsx + tailwind-merge).

```tsx
import { cn } from '@k8ordo/ui';

cn('text-fg-base', isActive && 'bg-primary-bg', className);
// Conflicting classes resolve automatically
cn('px-4 py-2', 'px-6'); // → 'py-2 px-6'
```

### between

Clamps a value to a range.

```tsx
import { between } from '@k8ordo/ui';

between(150, 0, 100); // → 100
between(-5, 0, 100); // → 0
between(50, 0, 100); // → 50
```

### commalize

Formats a number with thousands separators.

```tsx
import { commalize } from '@k8ordo/ui';

commalize(1000); // → '1,000'
commalize(1234567); // → '1,234,567'
```

### toPrecision

Rounds to the given number of decimal places.

```tsx
import { toPrecision } from '@k8ordo/ui';

toPrecision(3.14159, 2); // → 3.14
```

### cast

Type-cast utility.

```tsx
import { cast } from '@k8ordo/ui';
```

### isInternalRoute

Tells whether a href points at an internal route.

```tsx
import { isInternalRoute } from '@k8ordo/ui';

isInternalRoute('/about'); // → true
isInternalRoute('https://ext.com'); // → false
```

### findAllColors

Extracts every color from the design tokens.

```tsx
import { findAllColors } from '@k8ordo/ui';

const colors = findAllColors();
```

### uuidV4

Generates a UUID v4.

```tsx
import { uuidV4 } from '@k8ordo/ui';

const id = uuidV4(); // → 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
```

## Type definitions

### Status

```tsx
type Status = 'success' | 'info' | 'warning' | 'error';
```

Used for the status of Alert, Badge, Toast, and similar components.

### Direction

```tsx
type Direction = 'up' | 'down' | 'right' | 'left';
```

Used to point ChevronIcon and similar icons.

### Option

```tsx
type Option = { value: string; label: string };
```

Used for the choices in Select, Autocomplete, and similar components.
