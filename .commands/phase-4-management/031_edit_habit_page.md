# Command 031: Edit Habit Page

## Metadata
- **ID:** 031
- **Fase:** 4 - Management
- **Estimeret tid:** 2 timer
- **Afhængigheder:** 028, 026
- **Design reference:** stribe-design/screens/08_EDIT_HABIT.md

## Formål
Implementere Edit Habit Page - reuse Add Habit form men populate med existing data.

## Analyse
Edit Habit med:
- Reuse AddHabitPage layout/components
- Load existing habit data
- Update command i stedet for Create
- Query parameter for habitId

## Implementering
- Views/EditHabitPage.xaml (reuse eller extend AddHabitPage)
- ViewModels/EditHabitViewModel.cs eller extend AddHabitViewModel
- Load habit by ID
- Update logic i stedet for create

## Status
- [ ] Implementering gennemført
