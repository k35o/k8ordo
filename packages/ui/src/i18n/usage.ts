import type { Messages } from './messages';

/**
 * Where each key is drawn: the component, or the part of one, by the name it
 * is imported under.
 */
export const messageUsage: Readonly<Record<keyof Messages, readonly string[]>> =
  {
    close: ['Alert', 'Dialog', 'Drawer', 'Response'],
    required: ['FormControl'],
    loading: ['Spinner', 'Progress', 'Combobox'],
    avatar: ['Avatar'],
    color: ['Code'],

    alertSuccess: ['Alert'],
    alertInfo: ['Alert'],
    alertWarning: ['Alert'],
    alertError: ['Alert'],

    toastRegion: ['ToastProvider'],

    copy: ['CopyButton', 'Message.Copy'],
    copied: ['CopyButton', 'CodeBlock', 'Message.Copy'],
    copyFailed: ['CopyButton', 'CodeBlock', 'Message.Copy'],

    autocompletePlaceholder: ['Autocomplete'],
    autocompleteRemoveTag: ['Autocomplete'],
    autocompleteClear: ['Autocomplete'],
    autocompleteEmpty: ['Autocomplete'],

    comboboxToggle: ['Combobox'],
    comboboxEmpty: ['Combobox'],
    comboboxFailed: ['Combobox'],
    fileFieldRemove: ['FileField'],
    fileFieldTrigger: ['FileField.Dropzone', 'FileField (generative UI)'],
    fileFieldDrop: ['FileField.Dropzone', 'FileField (generative UI)'],

    numberFieldIncrement: ['NumberField'],
    numberFieldDecrement: ['NumberField'],
    numberFieldRangeUnderflow: ['NumberField'],
    numberFieldRangeOverflow: ['NumberField'],

    rangeSliderStart: ['RangeSlider'],
    rangeSliderEnd: ['RangeSlider'],

    calendarPreviousMonth: ['Calendar', 'DatePicker'],
    calendarNextMonth: ['Calendar', 'DatePicker'],
    datePickerOpen: ['DatePicker'],
    datePickerDialog: ['DatePicker'],

    colorPickerHue: ['ColorPicker'],
    colorPickerSaturation: ['ColorPicker'],
    colorPickerLightness: ['ColorPicker'],
    colorPickerSwatches: ['ColorPicker'],
    passwordShow: ['PasswordInput'],
    passwordHide: ['PasswordInput'],

    listBoxPlaceholder: ['ListBox'],

    breadcrumb: ['Breadcrumb'],
    tabList: ['Tabs (generative UI)'],

    paginationLabel: ['Pagination'],
    paginationPrevious: ['Pagination'],
    paginationNext: ['Pagination'],

    stepperComplete: ['Stepper'],
    dataTableColumns: ['DataTable'],
    dataTableSelectAll: ['DataTable'],
    dataTableSelectRow: ['DataTable'],

    codeBlockCopy: ['CodeBlock'],
    carousel: ['Carousel'],
    carouselSlide: ['Carousel.Slide'],
    carouselPrevious: ['Carousel'],
    carouselNext: ['Carousel'],
    resizablePanelsHandle: ['ResizablePanels.Handle'],
    tableOfContents: ['TableOfContents'],

    commandPalette: ['CommandPalette'],
    commandPaletteSearch: ['CommandPalette'],
    commandPaletteEmpty: ['CommandPalette'],
    chat: ['Conversation.Messages'],
    scrollToLatest: ['Conversation.ScrollButton'],
    reasoning: ['Reasoning'],
    reasoningStreaming: ['Reasoning'],
    suggestions: ['Suggestion.List'],
    send: ['PromptInput'],
    stop: ['PromptInput'],
    attach: ['PromptInput.Attach'],
    attachments: ['Attachment.List', 'PromptInput.Attachments'],
    attachmentRemove: ['PromptInput.Attachments'],
    attachmentImage: ['Attachment.Item', 'PromptInput.Attachments'],
    sources: ['Source.List'],
    messageActions: ['Message.Actions'],
    regenerate: ['Message.Regenerate'],
    feedbackPositive: ['Message.Feedback'],
    feedbackNegative: ['Message.Feedback'],
    toolInput: ['ToolInvocation'],
    toolOutput: ['ToolInvocation'],
    toolError: ['ToolInvocation'],
    toolDenied: ['ToolInvocation'],
    toolApprovalRequest: ['ToolInvocation'],
    toolApprove: ['ToolInvocation'],
    toolDeny: ['ToolInvocation'],

    responseCopied: ['Response'],
    responseCopyCode: ['Response'],
    responseCopyLink: ['Response'],
    responseCopyTable: ['Response'],
    responseCopyTableAsCsv: ['Response'],
    responseCopyTableAsMarkdown: ['Response'],
    responseCopyTableAsTsv: ['Response'],
    responseDownloadDiagram: ['Response'],
    responseDownloadDiagramAsMmd: ['Response'],
    responseDownloadDiagramAsPng: ['Response'],
    responseDownloadDiagramAsSvg: ['Response'],
    responseDownloadFile: ['Response'],
    responseDownloadImage: ['Response'],
    responseDownloadTable: ['Response'],
    responseDownloadTableAsCsv: ['Response'],
    responseDownloadTableAsMarkdown: ['Response'],
    responseExitFullscreen: ['Response'],
    responseViewFullscreen: ['Response'],
    responseImageNotAvailable: ['Response'],
    responseOpenExternalLink: ['Response'],
    responseExternalLinkWarning: ['Response'],
    responseOpenLink: ['Response'],
  };
