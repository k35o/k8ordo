# ヘルパー・型

k8ordo UI が提供するユーティリティ関数と型定義。

```tsx
import { cn, between, commalize, uuidV4 } from '@k8ordo/ui';
import type { Status, Direction, Option } from '@k8ordo/ui';
```

## ヘルパー関数

### cn

Tailwind クラスのマージ（clsx + tailwind-merge）。

```tsx
import { cn } from '@k8ordo/ui';

cn('text-fg-base', isActive && 'bg-primary-bg', className);
// 重複するクラスを自動的に解決
cn('px-4 py-2', 'px-6'); // → 'py-2 px-6'
```

### between

値を範囲内にクランプ。

```tsx
import { between } from '@k8ordo/ui';

between(150, 0, 100); // → 100
between(-5, 0, 100); // → 0
between(50, 0, 100); // → 50
```

### commalize

数値を3桁区切りでフォーマット。

```tsx
import { commalize } from '@k8ordo/ui';

commalize(1000); // → '1,000'
commalize(1234567); // → '1,234,567'
```

### toPrecision

指定した小数点以下の精度に丸める。

```tsx
import { toPrecision } from '@k8ordo/ui';

toPrecision(3.14159, 2); // → 3.14
```

### cast

型キャストユーティリティ。

```tsx
import { cast } from '@k8ordo/ui';
```

### isInternalRoute

内部ルートかどうかの判定。

```tsx
import { isInternalRoute } from '@k8ordo/ui';

isInternalRoute('/about'); // → true
isInternalRoute('https://ext.com'); // → false
```

### findAllColors

デザイントークンからすべてのカラーを抽出。

```tsx
import { findAllColors } from '@k8ordo/ui';

const colors = findAllColors();
```

### uuidV4

UUID v4 の生成。

```tsx
import { uuidV4 } from '@k8ordo/ui';

const id = uuidV4(); // → 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
```

## 型定義

### Status

```tsx
type Status = 'success' | 'info' | 'warning' | 'error';
```

Alert, Badge, Toast 等のステータス表示に使用。

### Direction

```tsx
type Direction = 'up' | 'down' | 'right' | 'left';
```

ChevronIcon 等の方向指定に使用。

### Option

```tsx
type Option = { value: string; label: string };
```

Select, Autocomplete 等の選択肢に使用。
