# Shingul Design System

## Philosophy

The UI communicates:
- "You are safe here."
- "You have time."
- "You can pass this exam."
- "Studying doesn't have to be stressful."

## Design Tokens

### Colors
- **Backgrounds**: Soft, dark tones (`--bg-0`, `--bg-1`, `--bg-2`)
- **Primary**: Calm purple (`--primary: #7c6fff`)
- **Accent**: Gentle cyan (`--accent: #4dd0e1`)
- **Text**: Soft white with muted variants
- **Borders**: Subtle, low-contrast (`--border`)

### Spacing Scale
8px / 12px / 16px / 24px / 32px / 48px

### Typography
- **Headings**: Supportive, not loud (`text-heading`)
- **Body**: Readable, comfortable (`text-body`)

### Transitions
- **Base**: 180ms ease-out
- **Slow**: 220ms ease-in-out

## Component System

All components are in `/components/ui/`:

- `PageContainer` - Max-width container with consistent padding
- `PageHeader` - Title + subtitle with optional action
- `Section` - Groups related content
- `Card` - Single consistent surface
- `Button` - Primary, secondary, ghost variants
- `InputField` / `TextareaField` - Comfortable inputs
- `StatCard` - Soft emphasis
- `EmptyState` - Supportive empty states
- `Skeleton` - Gentle loading states

## Usage

```tsx
import { PageContainer, PageHeader, Card, Button } from "@/components/ui";

export default function MyPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Page Title"
        subtitle="Reassuring subtitle"
        action={<Button>Action</Button>}
      />
      <Card>
        Content here
      </Card>
    </PageContainer>
  );
}
```

## Tone Guidelines

### Good
- "You're making progress."
- "Take this one step at a time."
- "Ready when you are."
- "Let's review what you already know."

### Avoid
- Urgency
- Guilt
- Gamification pressure
- Productivity-shaming

