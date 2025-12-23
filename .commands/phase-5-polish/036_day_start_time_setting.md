# Command 036: Day Start Time Setting

## Metadata
- **ID:** 036
- **Fase:** 5 - Polish & Launch
- **Estimeret tid:** 2 timer
- **Afhængigheder:** 035
- **Design reference:** stribe-design/screens/09_SETTINGS.md (Day Start section)

## Formål
Implementere day start time setting - når dagen "ruller over" (default 04:00).

## Analyse
Day start time med:
- Time picker for day rollover time
- Explanation text (why this matters)
- Save to settings
- Update streak calculations to use this time

## Implementering
- Add to SettingsPage.xaml
- SettingsViewModel property for DayStartTime
- Time picker binding
- Save command
- Update HabitService.CalculateStreakAsync to consider day start time
- Default: 04:00

## Status
- [ ] Implementering gennemført
