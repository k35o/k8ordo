import { ApiEntry } from '../../../../../components/api-entry';
import { DocPage } from '../../../../../components/doc-page';
import * as m from '../../../../../messages';

const t = m.formReferenceServer;
const FROM = '@k8ordo/form/server';

const RULE_PARAMS = {
  field: { name: 'field', type: 'FieldPath', description: t.ruleField },
  message: {
    name: 'message',
    type: 'string | (() => string)',
    description: t.ruleMessage,
  },
} as const;

const RULE_RETURNS = { type: 'Rule', description: t.ruleReturns } as const;

const FORM_STATE = [
  {
    name: 'errors',
    type: 'Record<string, string>',
    description: t.formStateErrors,
  },
  {
    name: 'values',
    type: 'Record<string, string | string[]>',
    description: t.formStateValues,
  },
  {
    name: 'rows',
    type: 'Record<string, number>',
    description: t.formStateRows,
  },
  { name: 'formError', type: 'string', description: t.formStateFormError },
  { name: 'token', type: 'string', description: t.formStateToken },
] as const;

export default function FormReferenceServerPage() {
  return (
    <DocPage
      introduction={t.introduction}
      path="/:locale/form/reference/server"
    >
      <ApiEntry
        caveats={t.formFieldsCaveats}
        from={FROM}
        id="form-fields"
        name="formFields"
        params={[
          {
            name: 'input',
            type: 'ZodObject | FormDefinition',
            description: t.formFieldsInput,
          },
        ]}
        returns={{ type: 'FormFields', description: t.formFieldsReturns }}
        signature="formFields(input: ZodObject | FormDefinition): FormFields"
        summary={t.formFieldsSummary}
      />

      <ApiEntry
        caveats={t.parseFormCaveats}
        from={FROM}
        id="parse-form"
        name="parseForm"
        params={[
          {
            name: 'input',
            type: 'ZodObject | FormDefinition',
            description: t.parseFormInput,
          },
          {
            name: 'formData',
            type: 'FormData',
            description: t.parseFormFormData,
          },
        ]}
        returns={{ type: 'ParseResult', description: t.parseFormReturns }}
        signature="parseForm(input: ZodObject | FormDefinition, formData: FormData): ParseResult"
        summary={t.parseFormSummary}
      />

      <ApiEntry
        caveats={t.defineFormCaveats}
        from={FROM}
        id="define-form"
        name="defineForm"
        params={[
          {
            name: 'schema',
            type: 'ZodObject',
            description: t.defineFormSchema,
          },
          { name: 'rules', type: 'Rule[]', description: t.defineFormRules },
        ]}
        returns={{ type: 'FormDefinition', description: t.defineFormReturns }}
        signature="defineForm(schema: ZodObject, rules?: Rule[]): FormDefinition"
        summary={t.defineFormSummary}
      />

      <ApiEntry
        from={FROM}
        id="same-as"
        name="sameAs"
        params={[
          RULE_PARAMS.field,
          { name: 'other', type: 'FieldPath', description: t.ruleOther },
          RULE_PARAMS.message,
        ]}
        returns={RULE_RETURNS}
        signature="sameAs(field: FieldPath, other: FieldPath, message: RuleMessage): Rule"
        summary={t.sameAsSummary}
      />

      <ApiEntry
        from={FROM}
        id="min-checked"
        name="minChecked"
        params={[
          RULE_PARAMS.field,
          { name: 'min', type: 'number', description: t.ruleMin },
          RULE_PARAMS.message,
        ]}
        returns={RULE_RETURNS}
        signature="minChecked(field: FieldPath, min: number, message: RuleMessage): Rule"
        summary={t.minCheckedSummary}
      />

      <ApiEntry
        from={FROM}
        id="required-when"
        name="requiredWhen"
        params={[
          RULE_PARAMS.field,
          { name: 'when', type: 'FieldPath', description: t.ruleWhen },
          { name: 'equals', type: 'string', description: t.ruleEquals },
          RULE_PARAMS.message,
        ]}
        returns={RULE_RETURNS}
        signature="requiredWhen(field: FieldPath, when: FieldPath, equals: string, message: RuleMessage): Rule"
        summary={t.requiredWhenSummary}
      />

      <ApiEntry
        fields={FORM_STATE}
        from={FROM}
        id="form-state"
        name="FormState"
        signature={`type FormState = {
  errors?: Record<string, string>;
  values?: Record<string, string | string[]>;
  rows?: Record<string, number>;
  formError?: string;
  token?: string;
};`}
        summary={t.formStateSummary}
      />
    </DocPage>
  );
}
