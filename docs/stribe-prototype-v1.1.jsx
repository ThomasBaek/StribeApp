import React, { useState, useEffect } from 'react';

// ============================================
// STRIBE - Interaktiv Prototype v1.1
// Habit Tracker MVP - Skandinavisk Design
// NYT: Fleksibel frekvens og ugedage
// ============================================

// Design Tokens
const colors = {
  primary: '#2D5A27',
  primaryLight: '#4A7C43',
  primaryLighter: '#E8F5E3',
  primaryDark: '#1E3D1A',
  background: '#FAFAF8',
  surface: '#FFFFFF',
  border: '#E8E8EC',
  textPrimary: '#1A1A2E',
  textSecondary: '#4A4A68',
  textTertiary: '#8A8AA3',
  error: '#D32F2F',
  habitGreen: '#4CAF50',
  habitBlue: '#2196F3',
  habitPurple: '#9C27B0',
  habitYellow: '#FFC107',
  habitOrange: '#FF9800',
  habitRed: '#F44336',
};

const habitColors = [
  { id: 'green', value: '#4CAF50' },
  { id: 'blue', value: '#2196F3' },
  { id: 'purple', value: '#9C27B0' },
  { id: 'yellow', value: '#FFC107' },
  { id: 'orange', value: '#FF9800' },
  { id: 'red', value: '#F44336' },
];

const emojis = [
  '🏃', '📚', '🧘', '💧', '🥗', '💊',
  '✍️', '🎸', '🌱', '🧹', '💤', '🎯',
  '💪', '🧠', '❤️', '🌞', '🌙', '⭐'
];

const weekDays = [
  { id: 0, short: 'Ma', full: 'Mandag' },
  { id: 1, short: 'Ti', full: 'Tirsdag' },
  { id: 2, short: 'On', full: 'Onsdag' },
  { id: 3, short: 'To', full: 'Torsdag' },
  { id: 4, short: 'Fr', full: 'Fredag' },
  { id: 5, short: 'Lø', full: 'Lørdag' },
  { id: 6, short: 'Sø', full: 'Søndag' },
];

const predefinedHabits = [
  { id: 'motion', emoji: '🏃', name: 'Motion', color: '#4CAF50', targetPerDay: 1, activeDays: '1111111' },
  { id: 'reading', emoji: '📚', name: 'Læse', color: '#2196F3', targetPerDay: 1, activeDays: '1111111' },
  { id: 'meditation', emoji: '🧘', name: 'Mediter', color: '#9C27B0', targetPerDay: 1, activeDays: '1111111' },
  { id: 'water', emoji: '💧', name: 'Drik vand', color: '#00BCD4', targetPerDay: 8, activeDays: '1111111' },
  { id: 'journal', emoji: '📝', name: 'Journal', color: '#FF9800', targetPerDay: 1, activeDays: '1111100' },
];

const milestones = [
  { days: 7, title: 'Én uge!', message: 'Syv dage i træk! Du er godt i gang.', badge: '🥉' },
  { days: 21, title: '21 dage!', message: 'Tre uger! Du har officielt skabt en ny vane.', badge: '🥈' },
  { days: 30, title: 'Én måned!', message: '30 dage i træk! Du er en mester.', badge: '🥇' },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatDate = (date) => {
  const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
  const months = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]}`;
};

const getDateString = (date) => date.toISOString().split('T')[0];

const getDayOfWeek = (date) => {
  // Convert Sunday=0 to Monday=0 format
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
};

const isActiveDay = (activeDays, date) => {
  const dayIndex = getDayOfWeek(date);
  return activeDays[dayIndex] === '1';
};

const getActiveDaysLabel = (activeDays) => {
  if (activeDays === '1111111') return 'Hver dag';
  if (activeDays === '1111100') return 'Hverdage';
  if (activeDays === '0000011') return 'Weekend';
  
  const activeCount = activeDays.split('').filter(d => d === '1').length;
  return `${activeCount} dage/uge`;
};

// ============================================
// PROGRESS RING COMPONENT
// ============================================

const ProgressRing = ({ current, target, size = 48, strokeWidth = 4, color, onClick }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / target, 1);
  const strokeDashoffset = circumference - progress * circumference;
  const isComplete = current >= target;

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <span className="text-white text-sm font-bold" style={{ 
            backgroundColor: color,
            borderRadius: '50%',
            width: size - strokeWidth * 2 - 4,
            height: size - strokeWidth * 2 - 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>✓</span>
        ) : (
          <span className="text-xs font-semibold" style={{ color: colors.textPrimary }}>
            {current}/{target}
          </span>
        )}
      </div>
    </button>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function StribeApp() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [previousScreen, setPreviousScreen] = useState(null);
  
  // App state
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({}); // { habitId-date: count }
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [settings, setSettings] = useState({
    dayStartTime: '04:00',
    weekStart: 'monday',
    notificationsEnabled: true,
    soundEnabled: true,
  });
  
  // Onboarding state
  const [selectedOnboardingHabits, setSelectedOnboardingHabits] = useState([]);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [skipReminders, setSkipReminders] = useState(false);
  
  // Modal state
  const [showMilestone, setShowMilestone] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);
  
  // Custom habit form
  const [customHabit, setCustomHabit] = useState({
    name: '',
    emoji: '⭐',
    color: '#4CAF50',
    targetPerDay: 1,
    activeDays: '1111111',
  });

  // Navigation helper
  const navigate = (screen, data = null) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    if (data?.habit) setSelectedHabit(data.habit);
    if (data?.editHabit) setEditingHabit(data.editHabit);
  };

  const goBack = () => {
    if (previousScreen) {
      setCurrentScreen(previousScreen);
      setPreviousScreen(null);
    }
  };

  // Habit functions
  const getCompletionCount = (habitId, date = selectedDate) => {
    const dateStr = getDateString(date);
    const key = `${habitId}-${dateStr}`;
    return completions[key] || 0;
  };

  const incrementCompletion = (habitId) => {
    const dateStr = getDateString(selectedDate);
    const key = `${habitId}-${dateStr}`;
    const habit = habits.find(h => h.id === habitId);
    const currentCount = completions[key] || 0;
    
    if (currentCount < habit.targetPerDay) {
      const newCount = currentCount + 1;
      const newCompletions = { ...completions, [key]: newCount };
      setCompletions(newCompletions);
      
      // Check for milestone when completing for the day
      if (newCount >= habit.targetPerDay) {
        const streak = calculateStreak(habitId, newCompletions);
        const milestone = milestones.find(m => m.days === streak);
        if (milestone) {
          setShowMilestone({ ...milestone, habit });
        }
      }
    }
  };

  const decrementCompletion = (habitId) => {
    const dateStr = getDateString(selectedDate);
    const key = `${habitId}-${dateStr}`;
    const currentCount = completions[key] || 0;
    
    if (currentCount > 0) {
      const newCompletions = { ...completions };
      if (currentCount === 1) {
        delete newCompletions[key];
      } else {
        newCompletions[key] = currentCount - 1;
      }
      setCompletions(newCompletions);
    }
  };

  const toggleCompletion = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    const currentCount = getCompletionCount(habitId);
    
    if (habit.targetPerDay === 1) {
      // Simple toggle for single-completion habits
      if (currentCount === 0) {
        incrementCompletion(habitId);
      } else {
        decrementCompletion(habitId);
      }
    } else {
      // Increment for multi-completion habits
      if (currentCount >= habit.targetPerDay) {
        // Reset if already complete
        const dateStr = getDateString(selectedDate);
        const key = `${habitId}-${dateStr}`;
        const newCompletions = { ...completions };
        delete newCompletions[key];
        setCompletions(newCompletions);
      } else {
        incrementCompletion(habitId);
      }
    }
  };

  const calculateStreak = (habitId, comps = completions) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    let streak = 0;
    let date = new Date();
    
    while (true) {
      // Skip days that aren't active for this habit
      if (!isActiveDay(habit.activeDays, date)) {
        date.setDate(date.getDate() - 1);
        continue;
      }
      
      const dateStr = getDateString(date);
      const key = `${habitId}-${dateStr}`;
      const count = comps[key] || 0;
      
      if (count >= habit.targetPerDay) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else if (streak === 0) {
        // Today might not be completed yet, check yesterday
        date.setDate(date.getDate() - 1);
        
        // Skip inactive days
        while (!isActiveDay(habit.activeDays, date)) {
          date.setDate(date.getDate() - 1);
        }
        
        const yesterdayKey = `${habitId}-${getDateString(date)}`;
        if ((comps[yesterdayKey] || 0) >= habit.targetPerDay) {
          streak++;
          date.setDate(date.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
      
      // Safety limit
      if (streak > 1000) break;
    }
    
    return streak;
  };

  const getLast7DaysProgress = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return [];
    
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = `${habitId}-${getDateString(date)}`;
      const count = completions[key] || 0;
      const isActive = isActiveDay(habit.activeDays, date);
      
      days.push({
        progress: isActive ? count / habit.targetPerDay : null,
        isActive,
        isComplete: count >= habit.targetPerDay,
      });
    }
    return days;
  };

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: habit.id || Date.now().toString(),
      targetPerDay: habit.targetPerDay || 1,
      activeDays: habit.activeDays || '1111111',
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (updatedHabit) => {
    setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
    const newCompletions = { ...completions };
    Object.keys(newCompletions).forEach(key => {
      if (key.startsWith(habitId)) {
        delete newCompletions[key];
      }
    });
    setCompletions(newCompletions);
  };

  const completeOnboarding = () => {
    selectedOnboardingHabits.forEach(habitId => {
      const predefined = predefinedHabits.find(h => h.id === habitId);
      if (predefined) {
        addHabit({
          ...predefined,
          reminderTime: skipReminders ? null : reminderTime,
        });
      }
    });
    navigate('home');
  };

  // ============================================
  // FREQUENCY PICKER COMPONENT
  // ============================================

  const FrequencyPicker = ({ value, onChange, color }) => (
    <div className="mb-6">
      <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>
        Hvor mange gange per dag?
      </label>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-colors hover:bg-gray-50"
          style={{ borderColor: colors.border, color: colors.textSecondary }}
        >
          −
        </button>
        <div className="flex-1 text-center">
          <span className="text-3xl font-bold" style={{ color: colors.textPrimary }}>{value}</span>
          <span className="text-sm block" style={{ color: colors.textSecondary }}>
            {value === 1 ? 'gang' : 'gange'} per dag
          </span>
        </div>
        <button
          onClick={() => onChange(Math.min(10, value + 1))}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-colors hover:bg-gray-50"
          style={{ borderColor: colors.border, color: colors.textSecondary }}
        >
          +
        </button>
      </div>
      {/* Progress ring preview */}
      <div className="flex justify-center mt-4">
        <ProgressRing current={Math.floor(value / 2)} target={value} size={64} strokeWidth={5} color={color} />
      </div>
    </div>
  );

  // ============================================
  // WEEKDAY PICKER COMPONENT
  // ============================================

  const WeekdayPicker = ({ activeDays, onChange }) => {
    const toggleDay = (index) => {
      const days = activeDays.split('');
      days[index] = days[index] === '1' ? '0' : '1';
      // Ensure at least one day is selected
      if (days.every(d => d === '0')) return;
      onChange(days.join(''));
    };

    const setPreset = (preset) => {
      onChange(preset);
    };

    return (
      <div className="mb-6">
        <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>
          Hvilke dage?
        </label>
        
        {/* Quick presets */}
        <div className="flex gap-2 mb-3">
          {[
            { label: 'Hver dag', value: '1111111' },
            { label: 'Hverdage', value: '1111100' },
            { label: 'Weekend', value: '0000011' },
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => setPreset(preset.value)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeDays === preset.value ? colors.primaryLighter : colors.surface,
                color: activeDays === preset.value ? colors.primary : colors.textSecondary,
                border: `1px solid ${activeDays === preset.value ? colors.primary : colors.border}`,
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        
        {/* Individual day toggles */}
        <div className="flex justify-between">
          {weekDays.map((day, index) => {
            const isActive = activeDays[index] === '1';
            return (
              <button
                key={day.id}
                onClick={() => toggleDay(index)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  color: isActive ? 'white' : colors.textTertiary,
                  border: `2px solid ${isActive ? colors.primary : colors.border}`,
                }}
              >
                {day.short}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================
  // SCREEN COMPONENTS
  // ============================================

  // Welcome Screen
  const WelcomeScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: colors.background }}>
      <div className="flex flex-col items-center" style={{ animation: 'fadeIn 0.6s ease-out' }}>
        <div className="w-28 h-28 rounded-3xl flex items-center justify-center mb-6 shadow-lg" style={{ backgroundColor: colors.primaryLighter }}>
          <span className="text-5xl">🌿</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight" style={{ color: colors.textPrimary }}>Stribe</h1>
        <p className="text-lg mb-12" style={{ color: colors.textSecondary }}>Byg vaner der holder</p>
        <button
          onClick={() => navigate('habitSelect')}
          className="w-full max-w-xs py-4 px-8 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: colors.primary }}
        >
          Kom i gang →
        </button>
        <p className="mt-4 text-sm flex items-center gap-2" style={{ color: colors.textTertiary }}>
          <span className="text-green-500">✓</span>Ingen konto nødvendig
        </p>
      </div>
    </div>
  );

  // Habit Selection Screen
  const HabitSelectScreen = () => {
    const toggleHabit = (habitId) => {
      if (selectedOnboardingHabits.includes(habitId)) {
        setSelectedOnboardingHabits(selectedOnboardingHabits.filter(id => id !== habitId));
      } else if (selectedOnboardingHabits.length < 3) {
        setSelectedOnboardingHabits([...selectedOnboardingHabits, habitId]);
      }
    };

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('welcome')} className="p-2 hover:bg-gray-100 rounded-full">
            <span className="text-xl">←</span>
          </button>
          <span style={{ color: colors.textSecondary }}>1/3</span>
        </div>
        <div className="flex-1 px-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>Hvad vil du gøre?</h1>
          <p className="mb-6" style={{ color: colors.textSecondary }}>Vælg 1-3 for at starte</p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {predefinedHabits.map((habit) => {
              const isSelected = selectedOnboardingHabits.includes(habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 text-left"
                  style={{
                    backgroundColor: isSelected ? colors.primaryLighter : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                >
                  <span className="text-3xl block mb-2">{habit.emoji}</span>
                  <span className="font-semibold block" style={{ color: colors.textPrimary }}>{habit.name}</span>
                  {/* Show frequency info */}
                  <span className="text-xs" style={{ color: colors.textTertiary }}>
                    {habit.targetPerDay > 1 ? `${habit.targetPerDay}x dagligt` : getActiveDaysLabel(habit.activeDays)}
                  </span>
                  <div className="mt-2 flex justify-end">
                    <div 
                      className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                      style={{
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primary : 'transparent',
                      }}
                    >
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => navigate('customHabit')}
              className="p-4 rounded-2xl border-2 border-dashed"
              style={{ borderColor: colors.textTertiary }}
            >
              <span className="text-3xl block mb-2" style={{ color: colors.textTertiary }}>➕</span>
              <span style={{ color: colors.textTertiary }}>Egen habit</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <button
            onClick={() => navigate('reminder')}
            disabled={selectedOnboardingHabits.length === 0}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}
          >
            Fortsæt →
          </button>
          <p className="text-center mt-3 text-sm" style={{ color: colors.textTertiary }}>Du kan altid tilføje flere</p>
        </div>
      </div>
    );
  };

  // Custom Habit Screen (Updated with frequency & weekdays)
  const CustomHabitScreen = () => (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">✕</span></button>
        <span className="font-semibold" style={{ color: colors.textPrimary }}>Opret din egen habit</span>
        <button
          onClick={() => {
            if (customHabit.name.trim()) {
              addHabit({ ...customHabit, id: Date.now().toString() });
              setCustomHabit({ name: '', emoji: '⭐', color: '#4CAF50', targetPerDay: 1, activeDays: '1111111' });
              goBack();
            }
          }}
          disabled={!customHabit.name.trim()}
          className="font-semibold disabled:opacity-50"
          style={{ color: colors.primary }}
        >
          Gem
        </button>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {/* Preview */}
        <div className="rounded-2xl p-6 mb-6 flex flex-col items-center" style={{ backgroundColor: `${customHabit.color}15` }}>
          <span className="text-5xl mb-2">{customHabit.emoji}</span>
          <span className="font-semibold" style={{ color: colors.textPrimary }}>{customHabit.name || 'Din habit'}</span>
          <span className="text-sm" style={{ color: colors.textSecondary }}>
            {customHabit.targetPerDay}x · {getActiveDaysLabel(customHabit.activeDays)}
          </span>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>Navn</label>
          <input
            type="text"
            value={customHabit.name}
            onChange={(e) => setCustomHabit({ ...customHabit, name: e.target.value.slice(0, 30) })}
            placeholder="Skriv habit navn..."
            className="w-full p-4 rounded-xl border-2 focus:outline-none"
            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            maxLength={30}
          />
          <span className="text-xs mt-1 block text-right" style={{ color: colors.textTertiary }}>{customHabit.name.length}/30</span>
        </div>

        {/* Emoji Picker */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>Vælg ikon</label>
          <div className="grid grid-cols-6 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setCustomHabit({ ...customHabit, emoji })}
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl"
                style={{
                  borderColor: customHabit.emoji === emoji ? colors.primary : colors.border,
                  backgroundColor: customHabit.emoji === emoji ? colors.primaryLighter : colors.surface,
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>Vælg farve</label>
          <div className="flex gap-3">
            {habitColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setCustomHabit({ ...customHabit, color: color.value })}
                className="w-10 h-10 rounded-full"
                style={{
                  backgroundColor: color.value,
                  boxShadow: customHabit.color === color.value ? `0 0 0 3px ${colors.surface}, 0 0 0 5px ${color.value}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* NEW: Frequency Picker */}
        <FrequencyPicker 
          value={customHabit.targetPerDay} 
          onChange={(v) => setCustomHabit({ ...customHabit, targetPerDay: v })}
          color={customHabit.color}
        />

        {/* NEW: Weekday Picker */}
        <WeekdayPicker
          activeDays={customHabit.activeDays}
          onChange={(v) => setCustomHabit({ ...customHabit, activeDays: v })}
        />
      </div>
    </div>
  );

  // Reminder Screen
  const ReminderScreen = () => {
    const quickOptions = [
      { id: 'morning', icon: '☀️', label: 'Morgen', range: '06-09', time: '07:00' },
      { id: 'mid_morning', icon: '🌤️', label: 'Formiddag', range: '09-12', time: '09:00' },
      { id: 'afternoon', icon: '☀️', label: 'Eftermiddag', range: '12-17', time: '14:00' },
      { id: 'evening', icon: '🌙', label: 'Aften', range: '17-21', time: '19:00' },
    ];
    const [selectedQuick, setSelectedQuick] = useState('mid_morning');

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('habitSelect')} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">←</span></button>
          <span style={{ color: colors.textSecondary }}>2/3</span>
        </div>
        <div className="flex-1 px-6">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🔔</span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>Hvornår skal vi minde dig?</h1>
            <p style={{ color: colors.textSecondary }}>Vi sender én påmindelse per dag</p>
          </div>
          <div className="rounded-2xl p-6 mb-6 text-center" style={{ backgroundColor: colors.surface, opacity: skipReminders ? 0.5 : 1 }}>
            <div className="text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>{reminderTime}</div>
          </div>
          <div className="rounded-2xl overflow-hidden border mb-6" style={{ borderColor: colors.border, opacity: skipReminders ? 0.5 : 1 }}>
            {quickOptions.map((option, index) => (
              <button
                key={option.id}
                onClick={() => { if (!skipReminders) { setSelectedQuick(option.id); setReminderTime(option.time); }}}
                disabled={skipReminders}
                className="w-full p-4 flex items-center justify-between"
                style={{
                  backgroundColor: selectedQuick === option.id ? colors.primaryLighter : colors.surface,
                  borderBottom: index < quickOptions.length - 1 ? `1px solid ${colors.border}` : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <span>{option.icon}</span>
                  <span style={{ color: colors.textPrimary }}>{option.label}</span>
                  <span style={{ color: colors.textTertiary }}>({option.range})</span>
                </div>
                <div 
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: selectedQuick === option.id ? colors.primary : colors.border,
                    backgroundColor: selectedQuick === option.id ? colors.primary : 'transparent',
                  }}
                >
                  {selectedQuick === option.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div 
              className="w-6 h-6 rounded border-2 flex items-center justify-center"
              style={{
                borderColor: skipReminders ? colors.primary : colors.border,
                backgroundColor: skipReminders ? colors.primary : 'transparent',
              }}
              onClick={() => setSkipReminders(!skipReminders)}
            >
              {skipReminders && <span className="text-white text-sm">✓</span>}
            </div>
            <span style={{ color: colors.textSecondary }}>Ingen påmindelser</span>
          </label>
        </div>
        <div className="p-6">
          <button
            onClick={completeOnboarding}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg"
            style={{ backgroundColor: colors.primary }}
          >
            Start tracking →
          </button>
        </div>
      </div>
    );
  };

  // Home Screen (Updated with Progress Rings)
  const HomeScreen = () => {
    const today = new Date();
    const isToday = getDateString(selectedDate) === getDateString(today);
    const dayOfWeek = getDayOfWeek(selectedDate);
    
    // Filter habits that are active today
    const activeHabits = habits.filter(h => isActiveDay(h.activeDays, selectedDate));
    const completedCount = activeHabits.filter(h => {
      const count = getCompletionCount(h.id);
      return count >= h.targetPerDay;
    }).length;

    const changeDate = (delta) => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + delta);
      if (newDate <= today) setSelectedDate(newDate);
    };

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
          <button className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">☰</span></button>
          <span className="text-xl font-bold" style={{ color: colors.textPrimary }}>Stribe</span>
          <button onClick={() => navigate('settings')} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">⚙️</span></button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-4 p-4">
          <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <span style={{ color: colors.textSecondary }}>◀</span>
          </button>
          <div className="text-center">
            <span className="font-medium" style={{ color: colors.textPrimary }}>{formatDate(selectedDate)}</span>
            {isToday && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primaryLighter, color: colors.primary }}>I dag</span>}
          </div>
          <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-full" style={{ visibility: isToday ? 'hidden' : 'visible' }}>
            <span style={{ color: colors.textSecondary }}>▶</span>
          </button>
        </div>

        {/* Habits List */}
        <div className="flex-1 px-4 overflow-auto">
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <span className="text-6xl mb-4">🌱</span>
              <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Ingen habits endnu</h2>
              <p className="mb-6" style={{ color: colors.textSecondary }}>Opret din første habit for at komme i gang</p>
              <button onClick={() => navigate('addHabit')} className="py-3 px-6 rounded-xl font-semibold text-white" style={{ backgroundColor: colors.primary }}>➕ Opret habit</button>
            </div>
          ) : activeHabits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
              <span className="text-4xl mb-4">😴</span>
              <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Ingen habits i dag</h2>
              <p style={{ color: colors.textSecondary }}>Du har fri fra dine habits denne dag</p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {activeHabits.map((habit) => {
                const currentCount = getCompletionCount(habit.id);
                const isCompleted = currentCount >= habit.targetPerDay;
                const streak = calculateStreak(habit.id);
                const last7 = getLast7DaysProgress(habit.id);

                return (
                  <div
                    key={habit.id}
                    className="rounded-2xl p-4 shadow-sm cursor-pointer"
                    style={{ 
                      backgroundColor: colors.surface,
                      background: isCompleted ? `linear-gradient(to right, ${colors.surface}, ${habit.color}10)` : colors.surface,
                    }}
                    onClick={() => navigate('habitDetail', { habit })}
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{habit.emoji}</span>
                        <div>
                          <span className="font-semibold block" style={{ color: colors.textPrimary }}>{habit.name}</span>
                          {habit.targetPerDay > 1 && (
                            <span className="text-xs" style={{ color: colors.textSecondary }}>
                              {currentCount}/{habit.targetPerDay} i dag
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">🔥</span>
                        <span className="font-bold" style={{ color: colors.textPrimary }}>{streak}</span>
                      </div>
                    </div>

                    {/* 7-day Progress Bar */}
                    <div className="flex gap-1 mb-3">
                      {last7.map((day, i) => (
                        <div
                          key={i}
                          className="flex-1 h-2 rounded-full transition-colors"
                          style={{
                            backgroundColor: day.isActive 
                              ? (day.isComplete ? habit.color : day.progress > 0 ? `${habit.color}50` : colors.border)
                              : `${colors.border}50`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                      {habit.targetPerDay === 1 ? (
                        // Simple checkbox for single-completion
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCompletion(habit.id); }}
                          className="flex items-center gap-2"
                        >
                          {isCompleted ? (
                            <>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: habit.color }}>
                                <span className="text-white font-bold">✓</span>
                              </div>
                              <span className="text-sm font-medium" style={{ color: habit.color }}>Done</span>
                            </>
                          ) : (
                            <div className="w-8 h-8 rounded-lg border-2" style={{ borderColor: colors.border }} />
                          )}
                        </button>
                      ) : (
                        // Progress ring for multi-completion
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); decrementCompletion(habit.id); }}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg font-bold"
                            style={{ borderColor: colors.border, color: colors.textTertiary }}
                          >
                            −
                          </button>
                          <ProgressRing
                            current={currentCount}
                            target={habit.targetPerDay}
                            size={48}
                            strokeWidth={4}
                            color={habit.color}
                            onClick={(e) => { e.stopPropagation(); incrementCompletion(habit.id); }}
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); incrementCompletion(habit.id); }}
                            className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg font-bold"
                            style={{ 
                              borderColor: isCompleted ? colors.border : habit.color, 
                              color: isCompleted ? colors.textTertiary : habit.color,
                              opacity: isCompleted ? 0.5 : 1
                            }}
                            disabled={isCompleted}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {habits.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <p className="text-center mb-3" style={{ color: completedCount === activeHabits.length && activeHabits.length > 0 ? colors.primary : colors.textSecondary }}>
              {activeHabits.length === 0 
                ? 'Ingen aktive habits i dag'
                : completedCount === activeHabits.length 
                  ? '🎉 Alle habits done i dag!'
                  : `${completedCount} af ${activeHabits.length} i dag`
              }
            </p>
            <button onClick={() => navigate('addHabit')} className="w-full py-3 rounded-xl font-medium border-2 border-dashed" style={{ borderColor: colors.primary, color: colors.primary }}>➕ Ny habit</button>
          </div>
        )}
      </div>
    );
  };

  // Habit Detail Screen (Updated)
  const HabitDetailScreen = () => {
    if (!selectedHabit) return null;
    const habit = habits.find(h => h.id === selectedHabit.id) || selectedHabit;
    const streak = calculateStreak(habit.id);
    const allCompletions = Object.keys(completions).filter(k => k.startsWith(habit.id));
    const totalActiveDays = Math.max(1, Math.ceil((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)));
    const completionRate = Math.round((allCompletions.length / totalActiveDays) * 100);
    const monthNames = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
    
    const todayCount = getCompletionCount(habit.id, new Date());
    const isCompletedToday = todayCount >= habit.targetPerDay;

    const generateCalendar = () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const days = [];
      const startPad = (firstDay.getDay() + 6) % 7;
      for (let i = 0; i < startPad; i++) days.push(null);
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(today.getFullYear(), today.getMonth(), d);
        const count = getCompletionCount(habit.id, date);
        const isActive = isActiveDay(habit.activeDays, date);
        days.push({
          day: d,
          progress: count / habit.targetPerDay,
          completed: count >= habit.targetPerDay,
          isToday: d === today.getDate(),
          isFuture: date > today,
          isActive,
        });
      }
      return days;
    };
    const calendarDays = generateCalendar();

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('home')} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">←</span></button>
          <div className="flex gap-2">
            <button onClick={() => { if (confirm('Slet habit?')) { deleteHabit(habit.id); navigate('home'); }}} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">🗑️</span></button>
            <button onClick={() => navigate('editHabit', { editHabit: habit })} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">✏️</span></button>
          </div>
        </div>
        <div className="flex-1 px-6 overflow-auto">
          <div className="text-center mb-6">
            <span className="text-5xl block mb-2">{habit.emoji}</span>
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{habit.name}</h1>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {habit.targetPerDay > 1 ? `${habit.targetPerDay}x per dag` : ''} · {getActiveDaysLabel(habit.activeDays)}
            </p>
          </div>

          {/* Today's Progress (for multi-completion) */}
          {habit.targetPerDay > 1 && (
            <div className="rounded-2xl p-6 text-center mb-4" style={{ backgroundColor: colors.surface }}>
              <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>I dag</p>
              <div className="flex justify-center">
                <ProgressRing
                  current={todayCount}
                  target={habit.targetPerDay}
                  size={80}
                  strokeWidth={6}
                  color={habit.color}
                  onClick={() => incrementCompletion(habit.id)}
                />
              </div>
              <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                {todayCount}/{habit.targetPerDay} færdige
              </p>
            </div>
          )}

          {/* Streak Card */}
          <div className="rounded-2xl p-6 text-center mb-4" style={{ backgroundColor: `${habit.color}15` }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🔥</span>
              <span className="text-4xl font-bold" style={{ color: habit.color }}>{streak}</span>
            </div>
            <span style={{ color: colors.textSecondary }}>dage i træk</span>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl p-4 text-center border" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <span className="text-lg mb-1 block">🏆</span>
              <span className="text-xl font-bold block" style={{ color: colors.textPrimary }}>{streak} dage</span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>Længste streak</span>
            </div>
            <div className="rounded-xl p-4 text-center border" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <span className="text-lg mb-1 block">📊</span>
              <span className="text-xl font-bold block" style={{ color: colors.textPrimary }}>{completionRate}%</span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>Completion rate</span>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold" style={{ color: colors.textPrimary }}>{monthNames[new Date().getMonth()]} {new Date().getFullYear()}</span>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'].map((day, i) => (
                <div key={day} className="text-center text-xs font-medium py-1" style={{ 
                  color: habit.activeDays[i] === '1' ? colors.textTertiary : `${colors.textTertiary}50`
                }}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-sm relative"
                  style={{
                    backgroundColor: day?.completed 
                      ? habit.color 
                      : day?.progress > 0 
                        ? `${habit.color}40`
                        : day?.isToday 
                          ? 'transparent'
                          : day?.isActive
                            ? `${colors.border}80`
                            : `${colors.border}30`,
                    color: day?.completed ? 'white' : day?.isFuture ? colors.textTertiary : colors.textPrimary,
                    border: day?.isToday ? `2px dashed ${habit.color}` : 'none',
                    opacity: day?.isFuture || !day?.isActive ? 0.4 : 1,
                  }}
                >
                  {day?.day}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs" style={{ color: colors.textTertiary }}>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: habit.color }} />
                <span>done</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: `${habit.color}40` }} />
                <span>delvis</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.border }} />
                <span>missed</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2 mb-6">
            <div className="rounded-xl p-4 flex items-center justify-between border" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <div className="flex items-center gap-3">
                <span>🔔</span>
                <span style={{ color: colors.textSecondary }}>Påmindelse:</span>
              </div>
              <span className="font-semibold" style={{ color: colors.textPrimary }}>{habit.reminderTime || 'Ingen'}</span>
            </div>
            <div className="rounded-xl p-4 flex items-center justify-between border" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <div className="flex items-center gap-3">
                <span>📅</span>
                <span style={{ color: colors.textSecondary }}>Aktive dage:</span>
              </div>
              <span className="font-semibold" style={{ color: colors.textPrimary }}>{getActiveDaysLabel(habit.activeDays)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add/Edit Habit Screen (Updated with frequency & weekdays)
  const AddEditHabitScreen = () => {
    const isEditing = !!editingHabit;
    const [form, setForm] = useState(
      isEditing 
        ? { ...editingHabit }
        : { name: '', emoji: '⭐', color: '#4CAF50', targetPerDay: 1, activeDays: '1111111', reminderTime: '09:00' }
    );

    const handleSave = () => {
      if (!form.name.trim()) return;
      if (isEditing) updateHabit(form);
      else addHabit({ ...form, id: Date.now().toString() });
      navigate('home');
      setEditingHabit(null);
    };

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
          <button onClick={() => { navigate('home'); setEditingHabit(null); }} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">✕</span></button>
          <span className="font-semibold" style={{ color: colors.textPrimary }}>{isEditing ? 'Rediger habit' : 'Ny habit'}</span>
          <button onClick={handleSave} disabled={!form.name.trim()} className="font-semibold disabled:opacity-50" style={{ color: colors.primary }}>Gem</button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {/* Preview */}
          <div className="rounded-2xl p-6 mb-6 flex flex-col items-center" style={{ backgroundColor: `${form.color}15` }}>
            <span className="text-5xl mb-2">{form.emoji}</span>
            <span className="font-semibold" style={{ color: colors.textPrimary }}>{form.name || 'Din habit'}</span>
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              {form.targetPerDay}x · {getActiveDaysLabel(form.activeDays)}
            </span>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>Navn</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value.slice(0, 30) })} 
              placeholder="Skriv habit navn..." 
              className="w-full p-4 rounded-xl border-2 focus:outline-none" 
              style={{ borderColor: colors.border, backgroundColor: colors.surface }} 
              maxLength={30} 
            />
          </div>

          {/* Emoji Picker */}
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>Ikon</label>
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji) => (
                <button 
                  key={emoji} 
                  onClick={() => setForm({ ...form, emoji })} 
                  className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl" 
                  style={{ 
                    borderColor: form.emoji === emoji ? colors.primary : colors.border, 
                    backgroundColor: form.emoji === emoji ? colors.primaryLighter : colors.surface 
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>Farve</label>
            <div className="flex gap-3">
              {habitColors.map((color) => (
                <button 
                  key={color.id} 
                  onClick={() => setForm({ ...form, color: color.value })} 
                  className="w-10 h-10 rounded-full" 
                  style={{ 
                    backgroundColor: color.value, 
                    boxShadow: form.color === color.value ? `0 0 0 3px ${colors.surface}, 0 0 0 5px ${color.value}` : 'none' 
                  }} 
                />
              ))}
            </div>
          </div>

          {/* NEW: Frequency Picker */}
          <FrequencyPicker 
            value={form.targetPerDay} 
            onChange={(v) => setForm({ ...form, targetPerDay: v })}
            color={form.color}
          />

          {/* NEW: Weekday Picker */}
          <WeekdayPicker
            activeDays={form.activeDays}
            onChange={(v) => setForm({ ...form, activeDays: v })}
          />

          {/* Reminder */}
          <div className="mb-6">
            <label className="block mb-2 font-medium" style={{ color: colors.textSecondary }}>Påmindelse</label>
            <div className="rounded-xl p-4 flex items-center justify-between border" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
              <div className="flex items-center gap-3">
                <span>🔔</span>
                <input
                  type="time"
                  value={form.reminderTime || ''}
                  onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
                  className="bg-transparent focus:outline-none font-semibold"
                  style={{ color: colors.textPrimary }}
                />
              </div>
              {form.reminderTime && (
                <button onClick={() => setForm({ ...form, reminderTime: null })} className="text-gray-400 hover:text-gray-600">✕</button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <button 
            onClick={handleSave} 
            disabled={!form.name.trim()} 
            className="w-full py-4 rounded-xl font-semibold text-white text-lg disabled:opacity-50" 
            style={{ backgroundColor: colors.primary }}
          >
            {isEditing ? 'Gem ændringer' : 'Gem habit'}
          </button>
          {isEditing && (
            <button
              onClick={() => { if (confirm('Arkiver habit?')) { deleteHabit(editingHabit.id); navigate('home'); setEditingHabit(null); }}}
              className="w-full py-3 mt-3 rounded-xl font-medium border"
              style={{ borderColor: colors.textSecondary, color: colors.textSecondary }}
            >
              Arkiver habit
            </button>
          )}
        </div>
      </div>
    );
  };

  // Settings Screen
  const SettingsScreen = () => (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      <div className="flex items-center p-4 border-b" style={{ borderColor: colors.border }}>
        <button onClick={() => navigate('home')} className="p-2 hover:bg-gray-100 rounded-full"><span className="text-xl">←</span></button>
        <span className="ml-4 text-lg font-semibold" style={{ color: colors.textPrimary }}>Indstillinger</span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textTertiary }}>Generelt</h3>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between p-4" style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}` }}>
              <div className="flex items-center gap-3"><span>🌙</span><span style={{ color: colors.textPrimary }}>Dag starter kl.</span></div>
              <div className="flex items-center gap-2"><span style={{ color: colors.textSecondary }}>{settings.dayStartTime}</span><span style={{ color: colors.textTertiary }}>›</span></div>
            </div>
            <div className="flex items-center justify-between p-4" style={{ backgroundColor: colors.surface }}>
              <div className="flex items-center gap-3"><span>🌐</span><span style={{ color: colors.textPrimary }}>Sprog</span></div>
              <div className="flex items-center gap-2"><span style={{ color: colors.textSecondary }}>Dansk</span><span style={{ color: colors.textTertiary }}>›</span></div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textTertiary }}>Notifikationer</h3>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: colors.border }}>
            <div className="flex items-center justify-between p-4" style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}` }}>
              <div className="flex items-center gap-3"><span>🔔</span><span style={{ color: colors.textPrimary }}>Påmindelser</span></div>
              <button onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })} className="w-12 h-7 rounded-full p-1 transition-colors" style={{ backgroundColor: settings.notificationsEnabled ? colors.primary : colors.border }}>
                <div className="w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ transform: settings.notificationsEnabled ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4" style={{ backgroundColor: colors.surface }}>
              <div className="flex items-center gap-3"><span>🔊</span><span style={{ color: colors.textPrimary }}>Lyd</span></div>
              <button onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })} className="w-12 h-7 rounded-full p-1 transition-colors" style={{ backgroundColor: settings.soundEnabled ? colors.primary : colors.border }}>
                <div className="w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ transform: settings.soundEnabled ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})` }}>
            <div className="flex items-center gap-2 mb-3"><span className="text-2xl">⭐</span><span className="font-bold text-lg">Opgrader til Pro</span></div>
            <ul className="space-y-1 mb-4 text-sm opacity-90"><li>• Ubegrænset habits</li><li>• CSV eksport</li><li>• Alle badges</li></ul>
            <p className="text-sm opacity-80 mb-4">19 kr/måned eller 149 kr engang</p>
            <button className="w-full py-3 rounded-xl font-semibold" style={{ backgroundColor: colors.surface, color: colors.primary }}>Opgrader nu</button>
          </div>
        </div>
        <div className="p-4 text-center">
          <p style={{ color: colors.textSecondary }}>Om Stribe • Privatlivspolitik</p>
          <p className="text-sm mt-2" style={{ color: colors.textTertiary }}>Version 1.1.0</p>
        </div>
      </div>
    </div>
  );

  // Milestone Modal
  const MilestoneModal = () => {
    if (!showMilestone) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-6" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowMilestone(null)}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute" style={{
              left: `${Math.random() * 100}%`, top: '-20px',
              width: `${Math.random() * 10 + 5}px`, height: `${Math.random() * 10 + 5}px`,
              backgroundColor: [colors.primary, colors.habitYellow, colors.habitBlue][Math.floor(Math.random() * 3)],
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              animation: `fall ${2 + Math.random() * 2}s linear ${Math.random() * 2}s forwards`,
            }} />
          ))}
        </div>
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()} style={{ animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <span className="text-6xl block mb-4">{showMilestone.badge}</span>
          <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>{showMilestone.title}</h2>
          <p className="mb-2" style={{ color: colors.textSecondary }}>Du har gjort {showMilestone.habit?.emoji}<br />i {showMilestone.days} dage i træk!</p>
          <p className="text-sm italic mb-6" style={{ color: colors.textTertiary }}>"{showMilestone.message}"</p>
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl font-medium border" style={{ borderColor: colors.border, color: colors.textSecondary }}>Del 📤</button>
            <button onClick={() => setShowMilestone(null)} className="flex-1 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: colors.primary }}>Fortsæt →</button>
          </div>
        </div>
        <style>{`
          @keyframes fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
          @keyframes scaleIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome': return <WelcomeScreen />;
      case 'habitSelect': return <HabitSelectScreen />;
      case 'customHabit': return <CustomHabitScreen />;
      case 'reminder': return <ReminderScreen />;
      case 'home': return <HomeScreen />;
      case 'habitDetail': return <HabitDetailScreen />;
      case 'addHabit':
      case 'editHabit': return <AddEditHabitScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <WelcomeScreen />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden">
      {renderScreen()}
      <MilestoneModal />
    </div>
  );
}
