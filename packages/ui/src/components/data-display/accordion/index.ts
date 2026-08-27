import { Accordion as Root } from './accordion';
import { AccordionButton } from './accordion-button';
import { AccordionItem } from './accordion-item';
import { AccordionPanel } from './accordion-panel';

export const Accordion = {
  Root,
  Button: AccordionButton,
  Item: AccordionItem,
  Panel: AccordionPanel,
} as const;
