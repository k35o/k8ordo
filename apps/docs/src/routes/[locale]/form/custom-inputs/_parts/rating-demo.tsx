'use client';

import { HiddenValue, useForm } from '@k8ordo/form';
import type { FormFields } from '@k8ordo/form';
import { Badge, Button, Code } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../../../../messages';

type Props = {
  /** ページの Server Component が `formFields(ratingSchema)` で導いたもの。 */
  fields: FormFields<'rating', never>;
};

const STARS = [1, 2, 3, 4, 5] as const;

// 星のボタンは <input name> を持たない、自前の入力部品の例。値は state に持ち、
// 送信には HiddenValue で載せる
export function RatingDemo({ fields }: Props) {
  const form = useForm(fields);
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState<string | null>(null);

  return (
    <form
      {...form.props}
      className="flex flex-col gap-5"
      onReset={() => {
        form.props.onReset();
        setRating(0);
        setSent(null);
      }}
      onSubmit={(event) => {
        form.props.onSubmit(event);
        if (event.defaultPrevented) {
          return;
        }
        event.preventDefault();
        const value = new FormData(event.currentTarget).get('rating');
        setSent(typeof value === 'string' ? value : '');
      }}
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-bold">
          {m.formCustomInputs.demoLabelRating()}
        </legend>
        <div className="flex gap-1">
          {STARS.map((star) => (
            <Button
              aria-label={m.formCustomInputs.demoStar(star)}
              aria-pressed={rating === star}
              color={star <= rating ? 'primary' : 'base'}
              key={star}
              onAction={() => {
                setRating(star);
              }}
              size="sm"
              variant={star <= rating ? 'solid' : 'outline'}
            >
              {String(star)}
            </Button>
          ))}
        </div>
      </fieldset>
      <HiddenValue name="rating" value={String(rating)} />
      <div className="flex items-center gap-3">
        <span className="text-fg-mute text-sm">isDirty</span>
        <Badge
          label={String(form.isDirty)}
          tone={form.isDirty ? 'warning' : 'neutral'}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="solid">
          {m.formCustomInputs.demoSubmit()}
        </Button>
        <Button
          color="base"
          renderItem={({ children, className }) => (
            <button className={className} type="reset">
              {children}
            </button>
          )}
          variant="outline"
        >
          {m.formCustomInputs.demoReset()}
        </Button>
      </div>
      {sent !== null && (
        <p className="text-sm">
          <Code>{`rating=${sent}`}</Code>
        </p>
      )}
    </form>
  );
}
