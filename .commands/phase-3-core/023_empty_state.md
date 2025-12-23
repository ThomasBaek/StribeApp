# Command 023: Empty State

## Metadata
- **ID:** 023
- **Fase:** 3 - Core Experience
- **Estimeret tid:** 1-2 timer
- **Afhængigheder:** 021
- **Design reference:** stribe-design/screens/05_HOME.md (Empty State section)

## Formål
Polere empty state i Home Page med illustration, motivational tekst, og clear call-to-action.

## Risici
- **Lav risiko**: Pure UI task
- **Opmærksomhed**:
  - Empty state skal kun vises når INGEN habits
  - CTA skal være tydelig

## Analyse

### Hvad skal implementeres
- Polished empty state layout
- Emoji eller illustration
- Motivational copy
- CTA button til add habit

### Filer der ændres
- `src/Stribe/Views/HomePage.xaml` - Polish empty state

## Dependencies Check
✅ Command 021 (Home Habit List) - implementeret
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Polish Empty State i HomePage:

**Opdater empty state i Views/HomePage.xaml**:
```xaml
<!-- Replace existing EmptyView in CollectionView -->
<CollectionView.EmptyView>
    <ContentView>
        <VerticalStackLayout Padding="32"
                             Spacing="24"
                             VerticalOptions="Center"
                             Margin="0,40,0,0">

            <!-- Illustration -->
            <Label Text="🌱"
                   FontSize="80"
                   HorizontalOptions="Center" />

            <!-- Headline -->
            <Label Text="Ingen vaner endnu"
                   Style="{StaticResource Headline}"
                   FontSize="24"
                   HorizontalTextAlignment="Center" />

            <!-- Body text -->
            <Label HorizontalTextAlignment="Center"
                   LineBreakMode="WordWrap"
                   Margin="0,0,0,16">
                <Label.FormattedText>
                    <FormattedString>
                        <Span Text="Start din rejse mod bedre vaner.&#x0a;"
                              Style="{StaticResource Body}"
                              TextColor="{StaticResource TextSecondary}" />
                        <Span Text="Lille fremgang hver dag gør en stor forskel."
                              Style="{StaticResource Body}"
                              TextColor="{StaticResource TextSecondary}" />
                    </FormattedString>
                </Label.FormattedText>
            </Label>

            <!-- CTA Button -->
            <Button Text="Tilføj din første vane"
                    Style="{StaticResource PrimaryButton}"
                    Command="{Binding NavigateToAddHabitCommand}"
                    HorizontalOptions="Center"
                    WidthRequest="250" />

        </VerticalStackLayout>
    </ContentView>
</CollectionView.EmptyView>
```

Reference design: stribe-design/screens/05_HOME.md
```

### Forventet resultat
- Polished empty state
- Clear CTA button
- Motivational copy
- Centered layout

### Verifikation
- [ ] Empty state vises kun når no habits
- [ ] CTA button navigerer til add habit
- [ ] Text readable og motiverende

## Status
- [ ] Implementering gennemført
