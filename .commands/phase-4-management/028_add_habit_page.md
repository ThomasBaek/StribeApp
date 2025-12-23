# Command 028: Add Habit Page

## Metadata
- **ID:** 028
- **Fase:** 4 - Management
- **Estimeret tid:** 3-4 timer
- **Afhængigheder:** 024
- **Design reference:** stribe-design/screens/07_ADD_HABIT.md

## Formål
Implementere Add Habit Page med form til at oprette ny habit.

## Analyse
Add Habit form med:
- Name input field (required, max 30 chars)
- Emoji picker placeholder (component i 029)
- Color picker placeholder (component i 030)
- Reminder time picker (optional)
- Save button (enabled når valid)
- Cancel button

## Implementering
- Views/AddHabitPage.xaml layout
- ViewModels/AddHabitViewModel.cs med validation
- Form validation logic
- Save command med navigation tilbage

## Status
- [ ] Implementering gennemført
