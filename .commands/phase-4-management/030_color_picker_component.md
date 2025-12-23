# Command 030: Color Picker Component

## Metadata
- **ID:** 030
- **Fase:** 4 - Management
- **Estimeret tid:** 1-2 timer
- **Afhængigheder:** 028
- **Design reference:** stribe-design/screens/07_ADD_HABIT.md (Color Picker section)

## Formål
Implementere color picker component med predefined habit colors.

## Analyse
Color picker med:
- Horizontal row af 12 color options
- Circular color buttons
- Selected state indicator (border eller checkmark)
- Bindable SelectedColor property

## Implementering
Controls/ColorPicker.xaml:
- FlexLayout med color circles
- 12 predefined colors (fra design system)
- Selection visual feedback
- Tap handling

## Status
- [ ] Implementering gennemført
