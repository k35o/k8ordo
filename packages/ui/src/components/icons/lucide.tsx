import type { FC } from 'react';

import type { Direction, Status } from './../../types/variables';
import { BaseIcon } from './base';
import type { BaseIconProps } from './base';
import {
  Accessibility,
  AlignRight,
  Angry,
  Annoyed,
  Atom,
  Bell,
  Blend,
  Bookmark,
  BookOpenText,
  BookText,
  Bot,
  BotMessageSquare,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  ClipboardPenLine,
  Clock,
  CodeXml,
  Contrast,
  Droplets,
  ExternalLink,
  Eye,
  EyeOff,
  FlaskConical,
  GitFork,
  History,
  Info,
  Laugh,
  Lightbulb,
  Link,
  List,
  ListMinus,
  Lock,
  LockOpen,
  Mail,
  MapPin,
  Maximize,
  Minus,
  MoonStar,
  Package,
  PaintBucket,
  Palette,
  Plus,
  Presentation,
  RefreshCw,
  Rocket,
  Rss,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  Squircle,
  Sun,
  Table2,
  Tag,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  X,
} from './lucide-imports';

type IconProps = Partial<BaseIconProps>;

const CHEVRON_BY_DIRECTION: Record<Direction, typeof ChevronUp> = {
  up: ChevronUp,
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
};

export const ChevronIcon: FC<IconProps & { direction: Direction }> = ({
  direction,
  size = 'md',
}) => {
  const Chevron = CHEVRON_BY_DIRECTION[direction];
  return (
    <BaseIcon renderItem={(props) => <Chevron {...props} />} size={size} />
  );
};

export const CloseIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <X {...props} />} size={size} />
);

export const CodeXmlIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <CodeXml {...props} />} size={size} />
);

export const CheckIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Check {...props} />} size={size} />
);

const ALERT_BY_STATUS: Record<Status, typeof CircleCheck> = {
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
  error: CircleAlert,
};

export const AlertIcon: FC<IconProps & { status: Status }> = ({
  status,
  size = 'md',
}) => {
  const Alert = ALERT_BY_STATUS[status];
  return <BaseIcon renderItem={(props) => <Alert {...props} />} size={size} />;
};

export const LinkIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Link {...props} />} size={size} />
);

export const ExternalLinkIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <ExternalLink {...props} />} size={size} />
);

export const BlogIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <BookText {...props} />} size={size} />
);

export const SlideIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Presentation {...props} />} size={size} />
);

export const TagIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Tag {...props} />} size={size} />
);

export const LocationIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <MapPin {...props} />} size={size} />
);

export const FormIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <ListMinus {...props} />} size={size} />
);

export const TableIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Table2 {...props} />} size={size} />
);

export const CopyIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon
    renderItem={(props) => <ClipboardPenLine {...props} />}
    size={size}
  />
);

export const PublishDateIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Calendar {...props} />} size={size} />
);

export const UpdateDateIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Clock {...props} />} size={size} />
);

export const MixedColorIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Blend {...props} />} size={size} />
);

export const ColorInfoIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <PaintBucket {...props} />} size={size} />
);

export const ColorContrastIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Contrast {...props} />} size={size} />
);

export const NewsIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Bell {...props} />} size={size} />
);

export const SubscribeIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Bookmark {...props} />} size={size} />
);

export const PrepareIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Rocket {...props} />} size={size} />
);

export const SendIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Send {...props} />} size={size} />
);

export const MailIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Mail {...props} />} size={size} />
);

export const PlusIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Plus {...props} />} size={size} />
);

export const MinusIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Minus {...props} />} size={size} />
);

export const DarkModeIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <MoonStar {...props} />} size={size} />
);

export const LightModeIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Sun {...props} />} size={size} />
);

export const ViewIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Eye {...props} />} size={size} />
);

export const ViewOffIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <EyeOff {...props} />} size={size} />
);

export const AIIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Bot {...props} />} size={size} />
);

export const AssistantIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon
    renderItem={(props) => <BotMessageSquare {...props} />}
    size={size}
  />
);

export const RSSIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Rss {...props} />} size={size} />
);

export const HistoryIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <History {...props} />} size={size} />
);

export const RefreshIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <RefreshCw {...props} />} size={size} />
);

export const ListIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <List {...props} />} size={size} />
);

export const NavigationMenuIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <AlignRight {...props} />} size={size} />
);

export const GoodIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <ThumbsUp {...props} />} size={size} />
);

export const BadIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <ThumbsDown {...props} />} size={size} />
);

export const InterestingIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Smile {...props} />} size={size} />
);

export const BoringIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Annoyed {...props} />} size={size} />
);

export const InformativeIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Lightbulb {...props} />} size={size} />
);

export const ShallowIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Droplets {...props} />} size={size} />
);

export const EasyIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Laugh {...props} />} size={size} />
);

export const DifficultIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Angry {...props} />} size={size} />
);

export const AtomIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Atom {...props} />} size={size} />
);

export const PaletteIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Palette {...props} />} size={size} />
);

export const ShieldCheckIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <ShieldCheck {...props} />} size={size} />
);

export const AccessibilityIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Accessibility {...props} />} size={size} />
);

export const SparklesIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Sparkles {...props} />} size={size} />
);

export const HorizontalWritingIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <BookOpenText {...props} />} size={size} />
);

export const SquircleIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Squircle {...props} />} size={size} />
);

export const FlaskIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <FlaskConical {...props} />} size={size} />
);

export const PackageIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Package {...props} />} size={size} />
);

export const ForkIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <GitFork {...props} />} size={size} />
);

export const FullscreenIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Maximize {...props} />} size={size} />
);

export const LockIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <Lock {...props} />} size={size} />
);

export const LockOpenIcon: FC<IconProps> = ({ size = 'md' }) => (
  <BaseIcon renderItem={(props) => <LockOpen {...props} />} size={size} />
);
