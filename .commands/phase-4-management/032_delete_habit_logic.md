# Command 032: Delete Habit Logic

## Metadata
- **ID:** 032
- **Fase:** 4 - Management
- **Estimeret tid:** 1-2 timer
- **Afhængigheder:** 026
- **Design reference:** N/A (Business logic)

## Formål
Implementere delete habit functionality med confirmation dialog og cascade delete.

## Analyse
Delete logic med:
- Confirmation dialog (are you sure?)
- Cascade delete all completions
- Navigate tilbage efter delete
- Error handling

## Implementering
Allerede implementeret i HabitDetailViewModel (command 025).
Dette command verificerer og polisher:
- Confirmation dialog UX
- Cascade delete virker korrekt
- Navigation after delete
- Error handling robust

## Status
- [ ] Verifikation gennemført
