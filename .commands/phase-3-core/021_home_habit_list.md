# Command 021: Home Page - Habit List

## Metadata
- **ID:** 021
- **Fase:** 3 - Core Experience
- **Estimeret tid:** 3 timer
- **Afhængigheder:** 016, 020
- **Design reference:** stribe-design/screens/05_HOME.md

## Formål
Integrere HabitCard component (fra command 020) i Home Page habit list med korrekt data binding og interactions.

## Risici
- **Medium risiko**: Integration og data binding
- **Opmærksomhed**:
  - CollectionView vs BindableLayout performance
  - Tap vs Command for completion toggle
  - Scroll behavior med FAB

## Analyse

### Hvad skal implementeres
- Replace placeholder habit cards med real HabitCard component
- Bind til HomeViewModel.Habits collection
- Wire up tap gestures for detail navigation
- Ensure smooth scrolling

### Filer der ændres
- `src/Stribe/Views/HomePage.xaml` - Replace habit card template

## Dependencies Check
✅ Command 016 (Home Page Layout) - implementeret
✅ Command 020 (HabitCard Component) - implementeret
✅ Kan implementeres nu

## Implementering

### Prompt til Claude Code
```
Opdater Habit List i HomePage til at bruge HabitCard component:

**Opdater Views/HomePage.xaml habit list section**:
```xaml
<!-- Replace existing habit list ScrollView -->
<ScrollView Grid.Row="2">
    <VerticalStackLayout Padding="16,0,16,80" Spacing="12">

        <!-- Habit Cards Collection -->
        <CollectionView ItemsSource="{Binding Habits}"
                        SelectionMode="None">

            <CollectionView.ItemTemplate>
                <DataTemplate x:DataType="models:HabitDisplayModel">
                    <!-- Use HabitCard component -->
                    <controls:HabitCard Habit="{Binding .}"
                                        ToggleCompletionCommand="{Binding Source={RelativeSource AncestorType={x:Type viewmodels:HomeViewModel}}, Path=ToggleCompletionCommand}"
                                        TapCommand="{Binding Source={RelativeSource AncestorType={x:Type viewmodels:HomeViewModel}}, Path=NavigateToDetailCommand}"
                                        Margin="0,0,0,12" />
                </DataTemplate>
            </CollectionView.ItemTemplate>

            <CollectionView.EmptyView>
                <VerticalStackLayout Padding="32"
                                     Spacing="16"
                                     VerticalOptions="Center">
                    <Label Text="🌱"
                           FontSize="64"
                           HorizontalOptions="Center" />
                    <Label Text="Ingen vaner endnu"
                           Style="{StaticResource Headline}"
                           HorizontalTextAlignment="Center" />
                    <Label Text="Tryk på + for at tilføje din første vane"
                           Style="{StaticResource Body}"
                           TextColor="{StaticResource TextSecondary}"
                           HorizontalTextAlignment="Center" />
                </VerticalStackLayout>
            </CollectionView.EmptyView>
        </CollectionView>

        <!-- Progress Summary -->
        <Label Text="{Binding ProgressText}"
               Style="{StaticResource Caption}"
               TextColor="{StaticResource TextSecondary}"
               HorizontalTextAlignment="Center"
               Margin="0,16,0,0"
               IsVisible="{Binding HasHabits}" />

    </VerticalStackLayout>
</ScrollView>
```

**Add xmlns for controls namespace**:
```xaml
xmlns:controls="clr-namespace:Stribe.Controls"
```

Reference design: stribe-design/screens/05_HOME.md
```

### Forventet resultat
- Habit list uses real HabitCard components
- Week progress bar shows correctly
- Streak displayed
- Completion checkbox functional
- Tap navigates to detail

### Verifikation
- [ ] HabitCards render correctly
- [ ] Data binding works
- [ ] Completion toggle updates UI
- [ ] Tap navigation works

## Status
- [ ] Implementering gennemført
