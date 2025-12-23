# Command 029: Emoji Picker Component

## Metadata
- **ID:** 029
- **Fase:** 4 - Management
- **Estimeret tid:** 2-3 timer
- **Afhængigheder:** 028
- **Design reference:** stribe-design/screens/07_ADD_HABIT.md (Icon Picker section)

## Formål
Implementere emoji picker component til Add/Edit Habit pages.

## Analyse
Emoji picker med:
- Grid af emoji options (6-8 columns)
- Searchable/filterable (optional v2)
- Selected state visual feedback
- Bindable SelectedEmoji property

## Implementering
Controls/EmojiPicker.xaml:
- CollectionView med emoji grid
- Selection handling
- Default emoji set (fra Constants.CommonEmojis)
- Highlight selected emoji

## Status
- [ ] Implementering gennemført
