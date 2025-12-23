# Simpel Habit Tracker - MVP Plan
## Codename: "Stribe" (dansk for "streak")

---

# Del 1: Konkurrentanalyse

## Hovedkonkurrenter

| App | Platform | Pris | Rating | Styrker | Svagheder |
|-----|----------|------|--------|---------|-----------|
| **Streaks** | iOS/Mac | $4.99 engangskÃ¸b | 4.8â˜… | Flot design, Apple integration, 24 habits max | Kun iOS, forvirrende UX, sync-problemer |
| **Habitify** | Cross-platform | Freemium, $4.99/md | 4.7â˜… | God statistik, multi-platform | Dyre premium features, popup-reklamer |
| **Loop Habit Tracker** | Android | Gratis (open source) | 4.8â˜… | Gratis, ingen reklamer, fleksibel | Gammel UI, ingen iOS, ingen sync |
| **HabitNow** | Android | Freemium, $11.99 | 4.6â˜… | God statistik, widgets | Mange reklamer i gratis version |
| **Productive** | iOS/Android | Freemium, $4.99/md | 4.6â˜… | Venlig UX, ingen straf for miss | BegrÃ¦nset gratis version |
| **Done** | iOS | Freemium | 4.5â˜… | Simpel, farverig | Overfladisk, mangler dybde |
| **Habitica** | Cross-platform | Freemium | 4.5â˜… | Gamification, social | For kompleks, "barnligt" design |

---

# Del 2: Brugerklager (1-stjerne reviews)

## Kategoriserede problemer fra App Store & Reddit

### ðŸ”´ KRITISKE PROBLEMER (HÃ¸j frekvens)

#### 1. Synkronisering & Data-tab
> "Widget doesn't update the information right away... when I click on widget it says 85oz when I only put in 17oz"

> "Progress from today gets affected when I go back to previous day"

> "Numbers keep changing to lower values after I save them"

**Vores lÃ¸sning:** Offline-first arkitektur med pÃ¥lidelig lokal SQLite. Ingen kompleks sync i v1.

---

#### 2. Midnat-problemet
> "I stay up late and tend to log at end of day. After midnight I can't log the day's streaks"

> "At midnight you lose ability to log... stuck in limbo until 'day starts' at set time"

> "My meditation at 12:15am resets streak because it's a new day - deal breaker"

**Vores lÃ¸sning:** Konfigurerbar "dag slutter"-tid (fx kl. 04:00 i stedet for 00:00)

---

#### 3. Forvirrende Navigation
> "Couldn't figure out how to edit a habit... none of the menu items gave me ability to edit"

> "Navigating through screens is an exercise in searching for where to tap"

> "User flow to mark task as done is too complicated"

**Vores lÃ¸sning:** Ultra-simpel UX. Ã‰n tap = done. Ingen skjulte menuer.

---

#### 4. Notifikationer der ikke virker
> "Alarms still ring even after task is marked completed"

> "Prompts me to get going while I'm in the middle of doing it"

> "Notifications come in late or not at all"

**Vores lÃ¸sning:** Simpel, pÃ¥lidelig notifikation. Ingen spam.

---

#### 5. For mange reklamer / Aggressive paywalls
> "There are A LOT of ads, like to add a new habit you need to watch an ad"

> "Bait-click to charge account... ZERO concern for customers"

> "Many advanced templates marked VIP, only boring basics for free"

**Vores lÃ¸sning:** Ingen reklamer. GenerÃ¸s gratis tier. Ã†rlig premium.

---

### ðŸŸ¡ MEDIUM PROBLEMER

#### 6. Habit limit for lav
> "12 habits is arbitrary... why can't I have additional screens?"

> "Tracking 3 exercise types uses quarter of all my slots"

**Vores lÃ¸sning:** UbegrÃ¦nset habits i premium. 5 gratis (nok til at bevise vÃ¦rdi).

---

#### 7. Manglende fleksibilitet
> "Can't track habits multiple times per day properly"

> "Weekly/monthly habits don't count correctly"

> "Partial completions marked in confusing way"

**Vores løsning:** Fleksibel habit-konfiguration:
- Vælg antal gange per dag (1-10x)
- Vælg aktive ugedage (dagligt eller udvalgte dage)
- Visuel progress-ring for multi-completion habits

---

#### 8. Ingen fejring / gamification
> "Missing confetti after a week of maintaining habit"

> "Would be cool if there were badges like '21 day streak'"

> "More rewarding sounds when checking off habits"

**Vores lÃ¸sning:** Subtil fejring. Milestone badges. Tilfredsstillende animations.

---

#### 9. Data eksport mangler
> "No ability to export data to CSV"

> "Can't back up my progress"

**Vores lÃ¸sning:** CSV eksport i premium.

---

### ðŸŸ¢ MINDRE PROBLEMER

- Manglende dark mode
- Ingen Apple Watch support
- Kan ikke tilfÃ¸je noter til habits
- Ingen "pause" funktion ved ferie

---

# Del 3: Vores Positionering

## Unique Selling Proposition (USP)

> **"Den habit tracker der bare virker. Ingen bloat. Ingen reklamer. Bare resultater."**

### Kerneprincipper

1. **Offline-first** - Virker uden internet, ingen sync-problemer
2. **Ultra-simpelt** - Max 3 taps til enhver handling
3. **Respektfuld** - Ingen manipulerende dark patterns
4. **Skandinavisk design** - Minimalistisk, roligt, fokuseret

### Target Audience

**PrimÃ¦r:** 25-45 Ã¥rige der har prÃ¸vet andre habit trackers og er frustrerede
**SekundÃ¦r:** FÃ¸rstegangsbrugere der vil have noget simpelt

### Differentiering

| Konkurrenterne | Stribe |
|----------------|--------|
| Kompleks UI med mange skjulte features | Alt synligt, ingen menuer |
| Midnat = ny dag | Konfigurerbar dag-reset |
| Aggressive upsells | Ã†rlig freemium |
| Sync-problemer | Offline-first |
| Overloaded med features | Fokuseret pÃ¥ Ã©n ting: streaks |

---

# Del 4: Kernefunktioner (Max 5)

## MVP Features

### 1. ✅ Streak Tracking
**Hvad:** Fleksibel tracking med konfigurerbar frekvens og ugedage
**Hvorfor:** Kerneværdien - tilpasset til brugerens behov
**Implementation:**
- Tap habit = mark som done (med satisfying animation)
- **Daglig frekvens:** Vælg 1-10 gange per dag (fx "Drik vand 8x dagligt")
- **Ugedage:** Vælg "Hver dag" eller specifikke ugedage (fx kun hverdage)
- Progress-ring viser delvis completion (fx 3/8 glas vand)
- Streak-tal vises tydeligt (kun for valgte dage)
- Kalendervisning af historik
- "Dag slutter" konfigurerbar (default kl. 04:00)

### 2. ðŸ”” PÃ¥mindelser
**Hvad:** Simpel notifikation pÃ¥ valgt tidspunkt
**Hvorfor:** Folk glemmer at logge
**Implementation:**
- Ã‰n notifikation per habit per dag
- Forsvinder nÃ¥r habit er markeret
- Ingen spam, ingen "nudging"

### 3. ðŸ“Š Simpel Statistik
**Hvad:** Aktuel streak, lÃ¦ngste streak, completion rate
**Hvorfor:** Folk vil se deres fremgang
**Implementation:**
- Dashboard med 3 nÃ¸gletal
- 7-dages og 30-dages view
- GitHub-style heatmap kalender

### 4. ðŸŽ¨ Personalisering
**Hvad:** VÃ¦lg ikon og farve for hver habit
**Hvorfor:** GÃ¸r appen personlig og genkendelig
**Implementation:**
- 50+ ikoner (emoji-baseret)
- 12 farver (skandinavisk palette)
- Custom habit-navne

### 5. ðŸ† Milestones
**Hvad:** Fejring ved 7, 21, 30, 60, 90, 365 dage
**Hvorfor:** Motivation og dopamin-boost
**Implementation:**
- Konfetti-animation ved milestone
- Badge samling
- Share-funktion (valgfri)

---

## IKKE i MVP (v2+)

- âŒ Cloud sync
- âŒ Apple Watch / widgets
- âŒ Social features
- âŒ Avanceret statistik
- âŒ Kategorier/grupper
- âŒ Dark mode (kommer i v1.1)
- âŒ iPad version

---

# Del 5: UI Flows

## Flow 1: Onboarding (FÃ¸rste Ã¥bning)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                     â”‚
â”‚     ðŸŒ¿ Stribe                       â”‚
â”‚                                     â”‚
â”‚   "Byg vaner der holder"            â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚
â”‚   â”‚      Kom i gang â†’         â”‚     â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚
â”‚                                     â”‚
â”‚   Ingen konto nÃ¸dvendig             â”‚
â”‚                                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
          â”‚
          â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                     â”‚
â”‚   Hvad vil du gÃ¸re hver dag?        â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”‚
â”‚   â”‚ ðŸƒ Motionâ”‚ â”‚ ðŸ“š LÃ¦se â”‚          â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”‚
â”‚   â”‚ ðŸ§˜ Mediterâ”‚ â”‚ ðŸ’§ Vand â”‚          â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”‚
â”‚   â”‚ ðŸ“ Journalâ”‚ â”‚ âž• Egen â”‚          â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â”‚
â”‚                                     â”‚
â”‚   VÃ¦lg 1-3 for at starte            â”‚
â”‚                                     â”‚
â”‚        [ FortsÃ¦t â†’ ]                â”‚
â”‚                                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
          â”‚
          â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                     â”‚
â”‚   HvornÃ¥r skal vi minde dig?        â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚
â”‚   â”‚  ðŸ•˜  09:00               â–¼â”‚     â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚
â”‚                                     â”‚
â”‚   â˜ Samme tid for alle habits       â”‚
â”‚                                     â”‚
â”‚        [ Start tracking â†’ ]         â”‚
â”‚                                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Flow 2: Daglig brug (HovedskÃ¦rm)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ â˜°                      Stribe   âš™ï¸  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                     â”‚
â”‚   Tirsdag, 23. december             â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€         â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚ ðŸƒ Motion            ðŸ”¥ 14  â”‚   â”‚
â”‚   â”‚ â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  â”‚   â”‚
â”‚   â”‚                        [ âœ“ ]â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚ ðŸ“š LÃ¦se              ðŸ”¥ 7   â”‚   â”‚
â”‚   â”‚ â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘â–‘  â”‚   â”‚
â”‚   â”‚                        [   ]â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚ ðŸ§˜ Meditation        ðŸ”¥ 21  â”‚   â”‚
â”‚   â”‚ â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ  â”‚   â”‚
â”‚   â”‚                   âœ… Done   â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                     â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€   â”‚
â”‚   2 af 3 i dag                      â”‚
â”‚                                     â”‚
â”‚              [ âž• Ny habit ]        â”‚
â”‚                                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

Interaktion:
- Tap pÃ¥ [ âœ“ ] = marker som done
- Tap pÃ¥ habit kort = Ã¥ben detaljer
- Swipe left = se i gÃ¥r
- Swipe right = se kalender
```

---

## Flow 3: Habit detaljer

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ â†                           ðŸ—‘ï¸ âœï¸  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                     â”‚
â”‚         ðŸƒ                          â”‚
â”‚       Motion                        â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚                             â”‚   â”‚
â”‚   â”‚    ðŸ”¥ 14 dage i trÃ¦k        â”‚   â”‚
â”‚   â”‚                             â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                     â”‚
â”‚   LÃ¦ngste streak: 23 dage           â”‚
â”‚   Completion rate: 78%              â”‚
â”‚                                     â”‚
â”‚   December 2025                     â”‚
â”‚   â”Œâ”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”¬â”€â”€â”          â”‚
â”‚   â”‚Maâ”‚Tiâ”‚Onâ”‚Toâ”‚Frâ”‚LÃ¸â”‚SÃ¸â”‚          â”‚
â”‚   â”œâ”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¤          â”‚
â”‚   â”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–‘â–‘â”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚          â”‚
â”‚   â”œâ”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¤          â”‚
â”‚   â”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–‘â–‘â”‚â–ˆâ–ˆâ”‚          â”‚
â”‚   â”œâ”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¤          â”‚
â”‚   â”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚â–ˆâ–ˆâ”‚          â”‚
â”‚   â”œâ”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¼â”€â”€â”¤          â”‚
â”‚   â”‚â–ˆâ–ˆâ”‚â–‘â–‘â”‚â–‘â–‘â”‚â–‘â–‘â”‚â–‘â–‘â”‚â–‘â–‘â”‚â–‘â–‘â”‚          â”‚
â”‚   â””â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”´â”€â”€â”˜          â”‚
â”‚                                     â”‚
â”‚   â–ˆâ–ˆ = done   â–‘â–‘ = missed           â”‚
â”‚                                     â”‚
â”‚   ðŸ”” PÃ¥mindelse: 09:00              â”‚
â”‚                                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Flow 4: Tilføj ny habit

```
┌─────────────────────────────────────┐
│ ← Ny habit                    Gem   │
├─────────────────────────────────────┤
│                                     │
│   Navn                              │
│   ┌───────────────────────────┐     │
│   │ Drik vand                 │     │
│   └───────────────────────────┘     │
│                                     │
│   Vælg ikon                         │
│   ┌───┬───┬───┬───┬───┬───┐        │
│   │ 🏃│ 📚│ 🧘│ 💧│ 🥗│ 💊│        │
│   ├───┼───┼───┼───┼───┼───┤        │
│   │ ✏️│ 🎸│ 🌱│ 🧹│ 💤│ 🔵│        │
│   └───┴───┴───┴───┴───┴───┘        │
│                                     │
│   Vælg farve                        │
│   ┌──┬──┬──┬──┬──┬──┐              │
│   │🔵│🟢│🟡│🟠│🔴│🟣│              │
│   └──┴──┴──┴──┴──┴──┘              │
│                                     │
│   ─────────────────────────────     │
│                                     │
│   Hvor ofte?                        │
│   ┌───────────────────────────┐     │
│   │  1x dagligt          [−][+]│    │
│   └───────────────────────────┘     │
│   (Tryk + for flere gange, fx 8x)   │
│                                     │
│   Hvilke dage?                      │
│   ┌───┬───┬───┬───┬───┬───┬───┐    │
│   │Man│Tir│Ons│Tor│Fre│Lør│Søn│    │
│   │ ● │ ● │ ● │ ● │ ● │ ● │ ● │    │
│   └───┴───┴───┴───┴───┴───┴───┘    │
│   [Hver dag] [Hverdage] [Weekend]   │
│                                     │
│   ─────────────────────────────     │
│                                     │
│   Påmindelse                        │
│   ┌───────────────────────────┐     │
│   │  🕘  09:00               ▼│     │
│   └───────────────────────────┘     │
│                                     │
│        [ Gem habit ]                │
│                                     │
└─────────────────────────────────────┘

Interaktion:
- [−][+] justerer antal gange (1-10)
- Tap på ugedag = toggle aktiv/inaktiv
- Quick-select: "Hver dag", "Hverdage", "Weekend"
```

---

## Flow 5: Milestone fejring

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                     â”‚
â”‚         ðŸŽ‰ âœ¨ ðŸŽŠ                    â”‚
â”‚                                     â”‚
â”‚    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”‚
â”‚    â”‚                         â”‚      â”‚
â”‚    â”‚      ðŸ…                 â”‚      â”‚
â”‚    â”‚                         â”‚      â”‚
â”‚    â”‚    21 DAGE!             â”‚      â”‚
â”‚    â”‚                         â”‚      â”‚
â”‚    â”‚   Du har gjort ðŸ§˜       â”‚      â”‚
â”‚    â”‚   i 21 dage i trÃ¦k!     â”‚      â”‚
â”‚    â”‚                         â”‚      â”‚
â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â”‚
â”‚                                     â”‚
â”‚   "Tre uger! Du har officielt       â”‚
â”‚    skabt en ny vane. Bliv ved!"     â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”‚
â”‚   â”‚  Del ðŸ“¤ â”‚  â”‚  FortsÃ¦t â†’  â”‚      â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â”‚
â”‚                                     â”‚
â”‚         (konfetti animation)        â”‚
â”‚                                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Flow 6: Indstillinger

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ â† Indstillinger                     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                     â”‚
â”‚   GENERELT                          â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€         â”‚
â”‚   Dag starter kl.        04:00  >   â”‚
â”‚   Ugen starter           Mandag >   â”‚
â”‚   Sprog                  Dansk  >   â”‚
â”‚                                     â”‚
â”‚   NOTIFIKATIONER                    â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€         â”‚
â”‚   PÃ¥mindelser             ðŸŸ¢ Til    â”‚
â”‚   Lyd                     ðŸŸ¢ Til    â”‚
â”‚                                     â”‚
â”‚   DATA                              â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€         â”‚
â”‚   Eksporter data (CSV)          >   â”‚
â”‚   Slet alle data                >   â”‚
â”‚                                     â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€     â”‚
â”‚                                     â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚
â”‚   â”‚   â­ Opgrader til Pro     â”‚     â”‚
â”‚   â”‚                           â”‚     â”‚
â”‚   â”‚   â€¢ UbegrÃ¦nset habits     â”‚     â”‚
â”‚   â”‚   â€¢ CSV eksport           â”‚     â”‚
â”‚   â”‚   â€¢ Alle badges           â”‚     â”‚
â”‚   â”‚                           â”‚     â”‚
â”‚   â”‚   19 kr/mÃ¥ned eller       â”‚     â”‚
â”‚   â”‚   149 kr engang           â”‚     â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚
â”‚                                     â”‚
â”‚   Om Stribe  â€¢  Privatlivspolitik   â”‚
â”‚                                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# Del 6: Monetisering

## Pricing Model

| | Gratis | Pro |
|---|--------|-----|
| Antal habits | 5 | UbegrÃ¦nset |
| Streak tracking | âœ… | âœ… |
| PÃ¥mindelser | âœ… | âœ… |
| Statistik | Basis | Fuld |
| Milestones | 7 & 21 dage | Alle |
| CSV eksport | âŒ | âœ… |
| Alle ikoner | âŒ | âœ… |
| **Pris** | Gratis | 19 kr/md eller 149 kr lifetime |

## Revenue Projection

**Antagelser:**
- 1000 downloads fÃ¸rste mÃ¥ned (realistisk for ny app)
- 5% konverterer til Pro = 50 betalende
- 70% vÃ¦lger lifetime (149 kr), 30% subscription (19 kr)

**MÃ¥ned 1:** 
- 35 Ã— 149 kr = 5.215 kr
- 15 Ã— 19 kr = 285 kr
- **Total: ~5.500 kr**

**MÃ¥ned 12 (10.000 downloads, 5% konvertering):**
- Estimeret MRR: 3.000-5.000 kr

---

# Del 7: Teknisk Arkitektur

## Tech Stack

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚           .NET MAUI App             â”‚
â”‚  (iOS + Android fra Ã©n codebase)    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              â”‚
              â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚         SQLite (Lokal DB)           â”‚
â”‚   â€¢ Habits tabel                    â”‚
â”‚   â€¢ Completions tabel               â”‚
â”‚   â€¢ Settings tabel                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              â”‚
              â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚      RevenueCat (Betalinger)        â”‚
â”‚   â€¢ Subscription management         â”‚
â”‚   â€¢ App Store + Google Play         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Database Schema

```sql
-- Habits
CREATE TABLE habits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    target_per_day INTEGER DEFAULT 1,  -- Antal gange per dag (1-10)
    active_days TEXT DEFAULT '1111111', -- Bitmask: Man-Søn (1=aktiv, 0=inaktiv)
    reminder_time TEXT,
    created_at TEXT NOT NULL,
    archived INTEGER DEFAULT 0
);

-- Daily completions
CREATE TABLE completions (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL,
    date TEXT NOT NULL,  -- YYYY-MM-DD
    count INTEGER DEFAULT 1,  -- Antal completions denne dag
    completed_at TEXT,  -- Tidspunkt for sidste completion
    FOREIGN KEY (habit_id) REFERENCES habits(id)
);

-- Settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
```

### Eksempler på active_days bitmask:
- `1111111` = Hver dag (Man, Tirs, Ons, Tors, Fre, Lør, Søn)
- `1111100` = Kun hverdage (Man-Fre)
- `0000011` = Kun weekend (Lør-Søn)
- `1010100` = Man, Ons, Fre

---

# Del 8: Tidsplan

## Sprint Plan (6 uger total)

### Uge 1-2: Setup & Core
- [ ] .NET MAUI projekt setup
- [ ] SQLite integration
- [ ] Habit CRUD operationer
- [ ] HovedskÃ¦rm layout
- [ ] Streak beregning

### Uge 3: UX & Polish
- [ ] Onboarding flow
- [ ] Habit detaljer skÃ¦rm
- [ ] Kalender view
- [ ] Animationer (check, konfetti)

### Uge 4: Features
- [ ] Notifikationer
- [ ] PÃ¥mindelser
- [ ] Milestone system
- [ ] Indstillinger

### Uge 5: Monetisering & Test
- [ ] RevenueCat integration
- [ ] Pro features gating
- [ ] Beta test (10-20 brugere)
- [ ] Bug fixes

### Uge 6: Launch
- [ ] App Store submission
- [ ] Google Play submission
- [ ] Landing page
- [ ] Product Hunt forberedelse

---

# Del 9: Success Metrics

## KPIs at tracke

| Metric | MÃ¥l (3 mÃ¥neder) |
|--------|-----------------|
| Downloads | 5.000 |
| DAU/MAU ratio | > 30% |
| Day 7 retention | > 25% |
| Pro conversion | > 5% |
| App Store rating | > 4.5â˜… |
| MRR | 3.000 kr |

---

# Del 10: Risici & Mitigering

| Risiko | Sandsynlighed | Impact | Mitigering |
|--------|---------------|--------|------------|
| .NET MAUI bugs | Medium | HÃ¸j | Test tidligt, have backup plan (Flutter) |
| Lav App Store visibility | HÃ¸j | HÃ¸j | ASO, Product Hunt, Reddit launch |
| Brugere konverterer ikke | Medium | HÃ¸j | A/B test pricing, feedback loops |
| Konkurrent laver samme app | Lav | Medium | Ship hurtigt, fokus pÃ¥ UX |

---

## NÃ¦ste skridt

1. **I dag:** GennemgÃ¥ denne plan, juster hvis nÃ¸dvendigt
2. **Denne uge:** Setup .NET MAUI projekt med Claude Code
3. **NÃ¦ste uge:** FÃ¸rste fungerende prototype

---

*Plan oprettet: 23. december 2025*
*Version: 1.1 - Fleksibel frekvens og ugedage*
