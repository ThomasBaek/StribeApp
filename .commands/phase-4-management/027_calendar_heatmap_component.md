# Command 027: Calendar Heatmap Component

## Metadata
- **ID:** 027
- **Fase:** 4 - Management
- **Estimeret tid:** 4-5 timer
- **Afhængigheder:** None
- **Design reference:** stribe-design/screens/06_HABIT_DETAIL.md (Calendar section)

## Formål
Implementere GitHub-style calendar heatmap component der viser completion history over tid.

## Analyse
Calendar heatmap med:
- Grid layout (7 rows for days of week, columns for weeks)
- Color intensity baseret på completion
- Legend (completed/incomplete)
- Scrollable horizontal
- Tap on day for detail (optional v2)

## Implementering
Controls/CalendarHeatmap.xaml med:
- FlexLayout eller Grid for calendar cells
- Bindable CalendarData property
- Color coding for completed/incomplete/future days
- Horizontal ScrollView wrapper
- Month labels

## Status
- [ ] Implementering gennemført
