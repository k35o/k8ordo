import type { RouteDefinition } from '@funstack/router/server';
import { route } from '@funstack/router/server';

import { LocaleLayout } from './layouts/locale-layout';
import { Ai } from './pages/ai';
import { AiAgents } from './pages/ai/agents';
import { AiChat } from './pages/ai/chat';
import { GenerativeUi } from './pages/ai/generative-ui';
import { Components } from './pages/components';
import { AccordionPage } from './pages/components/accordion-page';
import { AlertPage } from './pages/components/alert-page';
import { AnchorPage } from './pages/components/anchor-page';
import { AutocompletePage } from './pages/components/autocomplete-page';
import { AvatarPage } from './pages/components/avatar-page';
import { BadgePage } from './pages/components/badge-page';
import { BreadcrumbPage } from './pages/components/breadcrumb-page';
import { ButtonPage } from './pages/components/button-page';
import { CardPage } from './pages/components/card-page';
import { CheckboxCardPage } from './pages/components/checkbox-card-page';
import { CheckboxGroupPage } from './pages/components/checkbox-group-page';
import { CheckboxPage } from './pages/components/checkbox-page';
import { CodePage } from './pages/components/code-page';
import { DialogPage } from './pages/components/dialog-page';
import { DrawerPage } from './pages/components/drawer-page';
import { DropdownMenuPage } from './pages/components/dropdown-menu-page';
import { FileFieldPage } from './pages/components/file-field-page';
import { FormControlPage } from './pages/components/form-control-page';
import { FormPage } from './pages/components/form-page';
import { GridPage } from './pages/components/grid-page';
import { HeadingPage } from './pages/components/heading-page';
import { IconButtonPage } from './pages/components/icon-button-page';
import { IconsPage } from './pages/components/icons-page';
import { ListBoxPage } from './pages/components/list-box-page';
import { ModalPage } from './pages/components/modal-page';
import { NumberFieldPage } from './pages/components/number-field-page';
import { PaginationPage } from './pages/components/pagination-page';
import { PasswordInputPage } from './pages/components/password-input-page';
import { PopoverPage } from './pages/components/popover-page';
import { ProgressPage } from './pages/components/progress-page';
import { RadioCardPage } from './pages/components/radio-card-page';
import { RadioPage } from './pages/components/radio-page';
import { ScrollLinkedPage } from './pages/components/scroll-linked-page';
import { SelectPage } from './pages/components/select-page';
import { SeparatorPage } from './pages/components/separator-page';
import { SkeletonPage } from './pages/components/skeleton-page';
import { SliderPage } from './pages/components/slider-page';
import { SpinnerPage } from './pages/components/spinner-page';
import { StackPage } from './pages/components/stack-page';
import { SwitchPage } from './pages/components/switch-page';
import { TablePage } from './pages/components/table-page';
import { TabsPage } from './pages/components/tabs-page';
import { TextFieldPage } from './pages/components/text-field-page';
import { TextareaPage } from './pages/components/textarea-page';
import { ToastPage } from './pages/components/toast-page';
import { TooltipPage } from './pages/components/tooltip-page';
import { Form } from './pages/form';
import { GetStarted } from './pages/get-started';
import { Helpers } from './pages/helpers';
import { ChainPage } from './pages/helpers/chain-page';
import { CnPage } from './pages/helpers/cn-page';
import { CreateSafeContextPage } from './pages/helpers/create-safe-context-page';
import { MergePropsPage } from './pages/helpers/merge-props-page';
import { MergeRefsPage } from './pages/helpers/merge-refs-page';
import { Home } from './pages/home';
import { HooksPage } from './pages/hooks';
import { UseBreakpointPage } from './pages/hooks/use-breakpoint-page';
import { UseClickAwayPage } from './pages/hooks/use-click-away-page';
import { UseClientPage } from './pages/hooks/use-client-page';
import { UseClipboardPage } from './pages/hooks/use-clipboard-page';
import { UseControllableStatePage } from './pages/hooks/use-controllable-state-page';
import { UseDebouncedTransitionPage } from './pages/hooks/use-debounced-transition-page';
import { UseDeferredDebouncePage } from './pages/hooks/use-deferred-debounce-page';
import { UseDisclosurePage } from './pages/hooks/use-disclosure-page';
import { UseHashPage } from './pages/hooks/use-hash-page';
import { UseHoverPage } from './pages/hooks/use-hover-page';
import { UseInViewPage } from './pages/hooks/use-in-view-page';
import { UseIntersectionObserverPage } from './pages/hooks/use-intersection-observer-page';
import { UseIntervalPage } from './pages/hooks/use-interval-page';
import { UseLocalStoragePage } from './pages/hooks/use-local-storage-page';
import { UseResizePage } from './pages/hooks/use-resize-page';
import { UseScrollDirectionPage } from './pages/hooks/use-scroll-direction-page';
import { UseScrollLockPage } from './pages/hooks/use-scroll-lock-page';
import { UseSessionStoragePage } from './pages/hooks/use-session-storage-page';
import { UseStepPage } from './pages/hooks/use-step-page';
import { UseTimeoutPage } from './pages/hooks/use-timeout-page';
import { UseWindowResizePage } from './pages/hooks/use-window-resize-page';
import { UseWindowSizePage } from './pages/hooks/use-window-size-page';
import { UseWritingModePage } from './pages/hooks/use-writing-mode-page';
import { I18n } from './pages/i18n';
import { NotFound } from './pages/not-found';
import { RootRedirect } from './pages/root-redirect';
import { RouterPage } from './pages/router';
import { ServerPage } from './pages/server';
import { State } from './pages/state';
import { StaticPage } from './pages/static';
import { Theming } from './pages/theming';
import { Ui } from './pages/ui';
import { Router } from './router';

const routes: RouteDefinition[] = [
  route({
    path: '/',
    component: <RootRedirect />,
  }),
  route({
    path: '/:locale',
    component: LocaleLayout,
    children: [
      route({
        path: '/',
        component: <Home />,
      }),
      route({
        path: '/ui',
        component: <Ui />,
      }),
      route({
        path: '/form',
        component: <Form />,
      }),
      route({
        path: '/state',
        component: <State />,
      }),
      route({
        path: '/router',
        component: <RouterPage />,
      }),
      route({
        path: '/static',
        component: <StaticPage />,
      }),
      route({
        path: '/server',
        component: <ServerPage />,
      }),
      route({
        path: '/ui/get-started',
        component: <GetStarted />,
      }),
      route({
        path: '/ui/ai',
        component: <Ai />,
      }),
      route({
        path: '/ui/ai/chat',
        component: <AiChat />,
      }),
      route({
        path: '/ui/ai/generative-ui',
        component: <GenerativeUi />,
      }),
      route({
        path: '/ui/ai/agents',
        component: <AiAgents />,
      }),
      route({
        path: '/ui/components',
        component: <Components />,
      }),
      route({
        path: '/ui/components/button',
        component: <ButtonPage />,
      }),
      route({
        path: '/ui/components/icon-button',
        component: <IconButtonPage />,
      }),
      route({
        path: '/ui/components/anchor',
        component: <AnchorPage />,
      }),
      route({
        path: '/ui/components/text-field',
        component: <TextFieldPage />,
      }),
      route({
        path: '/ui/components/textarea',
        component: <TextareaPage />,
      }),
      route({
        path: '/ui/components/number-field',
        component: <NumberFieldPage />,
      }),
      route({
        path: '/ui/components/select',
        component: <SelectPage />,
      }),
      route({
        path: '/ui/components/checkbox',
        component: <CheckboxPage />,
      }),
      route({
        path: '/ui/components/checkbox-card',
        component: <CheckboxCardPage />,
      }),
      route({
        path: '/ui/components/checkbox-group',
        component: <CheckboxGroupPage />,
      }),
      route({
        path: '/ui/components/switch',
        component: <SwitchPage />,
      }),
      route({
        path: '/ui/components/password-input',
        component: <PasswordInputPage />,
      }),
      route({
        path: '/ui/components/radio',
        component: <RadioPage />,
      }),
      route({
        path: '/ui/components/radio-card',
        component: <RadioCardPage />,
      }),
      route({
        path: '/ui/components/autocomplete',
        component: <AutocompletePage />,
      }),
      route({
        path: '/ui/components/slider',
        component: <SliderPage />,
      }),
      route({
        path: '/ui/components/file-field',
        component: <FileFieldPage />,
      }),
      route({
        path: '/ui/components/form-control',
        component: <FormControlPage />,
      }),
      route({
        path: '/ui/components/form',
        component: <FormPage />,
      }),
      route({
        path: '/ui/components/accordion',
        component: <AccordionPage />,
      }),
      route({
        path: '/ui/components/avatar',
        component: <AvatarPage />,
      }),
      route({
        path: '/ui/components/badge',
        component: <BadgePage />,
      }),
      route({
        path: '/ui/components/card',
        component: <CardPage />,
      }),
      route({
        path: '/ui/components/code',
        component: <CodePage />,
      }),
      route({
        path: '/ui/components/table',
        component: <TablePage />,
      }),
      route({
        path: '/ui/components/list-box',
        component: <ListBoxPage />,
      }),
      route({
        path: '/ui/components/progress',
        component: <ProgressPage />,
      }),
      route({
        path: '/ui/components/heading',
        component: <HeadingPage />,
      }),
      route({
        path: '/ui/components/alert',
        component: <AlertPage />,
      }),
      route({
        path: '/ui/components/skeleton',
        component: <SkeletonPage />,
      }),
      route({
        path: '/ui/components/spinner',
        component: <SpinnerPage />,
      }),
      route({
        path: '/ui/components/toast',
        component: <ToastPage />,
      }),
      route({
        path: '/ui/components/tooltip',
        component: <TooltipPage />,
      }),
      route({
        path: '/ui/components/dialog',
        component: <DialogPage />,
      }),
      route({
        path: '/ui/components/drawer',
        component: <DrawerPage />,
      }),
      route({
        path: '/ui/components/modal',
        component: <ModalPage />,
      }),
      route({
        path: '/ui/components/popover',
        component: <PopoverPage />,
      }),
      route({
        path: '/ui/components/dropdown-menu',
        component: <DropdownMenuPage />,
      }),
      route({
        path: '/ui/components/separator',
        component: <SeparatorPage />,
      }),
      route({
        path: '/ui/components/stack',
        component: <StackPage />,
      }),
      route({
        path: '/ui/components/grid',
        component: <GridPage />,
      }),
      route({
        path: '/ui/components/tabs',
        component: <TabsPage />,
      }),
      route({
        path: '/ui/components/breadcrumb',
        component: <BreadcrumbPage />,
      }),
      route({
        path: '/ui/components/pagination',
        component: <PaginationPage />,
      }),
      route({
        path: '/ui/components/scroll-linked',
        component: <ScrollLinkedPage />,
      }),
      route({
        path: '/ui/components/icons',
        component: <IconsPage />,
      }),
      route({
        path: '/ui/theming',
        component: <Theming />,
      }),
      route({
        path: '/ui/i18n',
        component: <I18n />,
      }),
      route({
        path: '/ui/hooks',
        component: <HooksPage />,
      }),
      route({
        path: '/ui/hooks/use-breakpoint',
        component: <UseBreakpointPage />,
      }),
      route({
        path: '/ui/hooks/use-click-away',
        component: <UseClickAwayPage />,
      }),
      route({
        path: '/ui/hooks/use-client',
        component: <UseClientPage />,
      }),
      route({
        path: '/ui/hooks/use-clipboard',
        component: <UseClipboardPage />,
      }),
      route({
        path: '/ui/hooks/use-debounced-transition',
        component: <UseDebouncedTransitionPage />,
      }),
      route({
        path: '/ui/hooks/use-deferred-debounce',
        component: <UseDeferredDebouncePage />,
      }),
      route({
        path: '/ui/hooks/use-disclosure',
        component: <UseDisclosurePage />,
      }),
      route({
        path: '/ui/hooks/use-hash',
        component: <UseHashPage />,
      }),
      route({
        path: '/ui/hooks/use-in-view',
        component: <UseInViewPage />,
      }),
      route({
        path: '/ui/hooks/use-intersection-observer',
        component: <UseIntersectionObserverPage />,
      }),
      route({
        path: '/ui/hooks/use-interval',
        component: <UseIntervalPage />,
      }),
      route({
        path: '/ui/hooks/use-local-storage',
        component: <UseLocalStoragePage />,
      }),
      route({
        path: '/ui/hooks/use-session-storage',
        component: <UseSessionStoragePage />,
      }),
      route({
        path: '/ui/hooks/use-resize',
        component: <UseResizePage />,
      }),
      route({
        path: '/ui/hooks/use-scroll-direction',
        component: <UseScrollDirectionPage />,
      }),
      route({
        path: '/ui/hooks/use-step',
        component: <UseStepPage />,
      }),
      route({
        path: '/ui/hooks/use-timeout',
        component: <UseTimeoutPage />,
      }),
      route({
        path: '/ui/hooks/use-window-resize',
        component: <UseWindowResizePage />,
      }),
      route({
        path: '/ui/hooks/use-scroll-lock',
        component: <UseScrollLockPage />,
      }),
      route({
        path: '/ui/hooks/use-hover',
        component: <UseHoverPage />,
      }),
      route({
        path: '/ui/hooks/use-controllable-state',
        component: <UseControllableStatePage />,
      }),
      route({
        path: '/ui/hooks/use-window-size',
        component: <UseWindowSizePage />,
      }),
      route({
        path: '/ui/hooks/use-writing-mode',
        component: <UseWritingModePage />,
      }),
      route({
        path: '/ui/helpers',
        component: <Helpers />,
      }),
      route({
        path: '/ui/helpers/cn',
        component: <CnPage />,
      }),
      route({
        path: '/ui/helpers/merge-refs',
        component: <MergeRefsPage />,
      }),
      route({
        path: '/ui/helpers/merge-props',
        component: <MergePropsPage />,
      }),
      route({
        path: '/ui/helpers/chain',
        component: <ChainPage />,
      }),
      route({
        path: '/ui/helpers/create-safe-context',
        component: <CreateSafeContextPage />,
      }),
      // 直前までのどのパスにも一致しなかったものを受ける。未定義のルートは
      // 何も描画しない（本文が空のまま）ので、明示的に置かないと白紙になる。
      route({
        path: '/*',
        component: <NotFound />,
      }),
    ],
  }),
];

export default function App() {
  return <Router fallback="static" routes={routes} />;
}
