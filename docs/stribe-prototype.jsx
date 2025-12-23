import React, { useState, useEffect } from 'react';

// ============================================
// STRIBE - Interaktiv Prototype
// Habit Tracker MVP - Skandinavisk Design
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

const predefinedHabits = [
  { id: 'motion', emoji: '🏃', name: 'Motion', color: '#4CAF50' },
  { id: 'reading', emoji: '📚', name: 'Læse', color: '#2196F3' },
  { id: 'meditation', emoji: '🧘', name: 'Mediter', color: '#9C27B0' },
  { id: 'water', emoji: '💧', name: 'Vand', color: '#00BCD4' },
  { id: 'journal', emoji: '📝', name: 'Journal', color: '#FF9800' },
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

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function StribeApp() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [previousScreen, setPreviousScreen] = useState(null);
  
  // App state
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
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
  const toggleCompletion = (habitId) => {
    const dateStr = getDateString(selectedDate);
    const key = `${habitId}-${dateStr}`;
    const newCompletions = { ...completions };
    
    if (newCompletions[key]) {
      delete newCompletions[key];
    } else {
      newCompletions[key] = true;
      
      // Check for milestone
      const streak = calculateStreak(habitId, newCompletions);
      const milestone = milestones.find(m => m.days === streak);
      if (milestone) {
        const habit = habits.find(h => h.id === habitId);
        setShowMilestone({ ...milestone, habit });
      }
    }
    
    setCompletions(newCompletions);
  };

  const calculateStreak = (habitId, comps = completions) => {
    let streak = 0;
    let date = new Date();
    
    while (true) {
      const dateStr = getDateString(date);
      const key = `${habitId}-${dateStr}`;
      
      if (comps[key]) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else if (streak === 0) {
        // Check if today isn't completed yet
        date.setDate(date.getDate() - 1);
        const yesterdayKey = `${habitId}-${getDateString(date)}`;
        if (comps[yesterdayKey]) {
          streak++;
          date.setDate(date.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getLast7Days = (habitId) => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = `${habitId}-${getDateString(date)}`;
      days.push(!!completions[key]);
    }
    return days;
  };

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: habit.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (updatedHabit) => {
    setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(h => h.id !== habitId));
    // Clean up completions
    const newCompletions = { ...completions };
    Object.keys(newCompletions).forEach(key => {
      if (key.startsWith(habitId)) {
        delete newCompletions[key];
      }
    });
    setCompletions(newCompletions);
  };

  const completeOnboarding = () => {
    // Add selected habits
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
  // SCREEN COMPONENTS
  // ============================================

  // Welcome Screen
  const WelcomeScreen = () => (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="animate-fade-in flex flex-col items-center">
        {/* Logo */}
        <div 
          className="w-28 h-28 rounded-3xl flex items-center justify-center mb-6 shadow-lg animate-bounce-subtle"
          style={{ backgroundColor: colors.primaryLighter }}
        >
          <span className="text-5xl">🌿</span>
        </div>
        
        {/* Title */}
        <h1 
          className="text-4xl font-bold mb-2 tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          Stribe
        </h1>
        
        {/* Tagline */}
        <p 
          className="text-lg mb-12"
          style={{ color: colors.textSecondary }}
        >
          Byg vaner der holder
        </p>
        
        {/* CTA Button */}
        <button
          onClick={() => navigate('habitSelect')}
          className="w-full max-w-xs py-4 px-8 rounded-xl font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: colors.primary }}
        >
          Kom i gang →
        </button>
        
        {/* Trust signal */}
        <p 
          className="mt-4 text-sm flex items-center gap-2"
          style={{ color: colors.textTertiary }}
        >
          <span className="text-green-500">✓</span>
          Ingen konto nødvendig
        </p>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
      `}</style>
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
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate('welcome')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-xl">←</span>
          </button>
          <span style={{ color: colors.textSecondary }}>1/3</span>
        </div>

        {/* Content */}
        <div className="flex-1 px-6">
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: colors.textPrimary }}
          >
            Hvad vil du gøre hver dag?
          </h1>
          <p 
            className="mb-6"
            style={{ color: colors.textSecondary }}
          >
            Vælg 1-3 for at starte
          </p>

          {/* Habit Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {predefinedHabits.map((habit) => {
              const isSelected = selectedOnboardingHabits.includes(habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: isSelected ? colors.primaryLighter : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                >
                  <span className="text-3xl block mb-2">{habit.emoji}</span>
                  <span 
                    className="font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {habit.name}
                  </span>
                  <div className="mt-2">
                    <div 
                      className="w-5 h-5 rounded border-2 mx-auto flex items-center justify-center transition-colors"
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
            
            {/* Custom habit button */}
            <button
              onClick={() => navigate('customHabit')}
              className="p-4 rounded-2xl border-2 border-dashed transition-all duration-200 hover:scale-[1.02]"
              style={{ borderColor: colors.textTertiary }}
            >
              <span className="text-3xl block mb-2" style={{ color: colors.textTertiary }}>➕</span>
              <span style={{ color: colors.textTertiary }}>Egen</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6">
          <button
            onClick={() => navigate('reminder')}
            disabled={selectedOnboardingHabits.length === 0}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}
          >
            Fortsæt →
          </button>
          <p 
            className="text-center mt-3 text-sm"
            style={{ color: colors.textTertiary }}
          >
            Du kan altid tilføje flere
          </p>
        </div>
      </div>
    );
  };

  // Custom Habit Screen
  const CustomHabitScreen = () => (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
        <button 
          onClick={goBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <span className="text-xl">✕</span>
        </button>
        <span className="font-semibold" style={{ color: colors.textPrimary }}>Opret din egen habit</span>
        <button
          onClick={() => {
            if (customHabit.name.trim()) {
              addHabit({
                ...customHabit,
                id: Date.now().toString(),
              });
              setCustomHabit({ name: '', emoji: '⭐', color: '#4CAF50' });
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
        <div 
          className="rounded-2xl p-6 mb-6 flex items-center justify-center"
          style={{ backgroundColor: `${customHabit.color}15` }}
        >
          <span className="text-5xl">{customHabit.emoji}</span>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label 
            className="block mb-2 font-medium"
            style={{ color: colors.textSecondary }}
          >
            Navn
          </label>
          <input
            type="text"
            value={customHabit.name}
            onChange={(e) => setCustomHabit({ ...customHabit, name: e.target.value.slice(0, 30) })}
            placeholder="Skriv habit navn..."
            className="w-full p-4 rounded-xl border-2 focus:outline-none transition-colors"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
            maxLength={30}
          />
          <span 
            className="text-xs mt-1 block text-right"
            style={{ color: colors.textTertiary }}
          >
            {customHabit.name.length}/30
          </span>
        </div>

        {/* Emoji Picker */}
        <div className="mb-6">
          <label 
            className="block mb-2 font-medium"
            style={{ color: colors.textSecondary }}
          >
            Vælg ikon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setCustomHabit({ ...customHabit, emoji })}
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl transition-all hover:scale-110"
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
          <label 
            className="block mb-2 font-medium"
            style={{ color: colors.textSecondary }}
          >
            Vælg farve
          </label>
          <div className="flex gap-3">
            {habitColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setCustomHabit({ ...customHabit, color: color.value })}
                className="w-10 h-10 rounded-full transition-all hover:scale-110"
                style={{
                  backgroundColor: color.value,
                  boxShadow: customHabit.color === color.value 
                    ? `0 0 0 3px ${colors.surface}, 0 0 0 5px ${color.value}` 
                    : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="mt-8">
          <label 
            className="block mb-2 font-medium"
            style={{ color: colors.textSecondary }}
          >
            Forhåndsvisning
          </label>
          <div 
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{customHabit.emoji}</span>
                <span className="font-semibold" style={{ color: colors.textPrimary }}>
                  {customHabit.name || 'Din habit'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>🔥</span>
                <span className="font-bold">0</span>
              </div>
            </div>
            <div 
              className="h-2 rounded-full"
              style={{ backgroundColor: colors.border }}
            />
          </div>
        </div>
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
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate('habitSelect')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span className="text-xl">←</span>
          </button>
          <span style={{ color: colors.textSecondary }}>2/3</span>
        </div>

        {/* Content */}
        <div className="flex-1 px-6">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block animate-wiggle">🔔</span>
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: colors.textPrimary }}
            >
              Hvornår skal vi minde dig?
            </h1>
            <p style={{ color: colors.textSecondary }}>
              Vi sender én påmindelse per dag
            </p>
          </div>

          {/* Time Display */}
          <div 
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ backgroundColor: colors.surface, opacity: skipReminders ? 0.5 : 1 }}
          >
            <div className="text-4xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {reminderTime}
            </div>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => {
                setReminderTime(e.target.value);
                setSelectedQuick(null);
              }}
              disabled={skipReminders}
              className="opacity-0 absolute"
              id="time-input"
            />
          </div>

          {/* Quick Options */}
          <div 
            className="rounded-2xl overflow-hidden border mb-6"
            style={{ borderColor: colors.border, opacity: skipReminders ? 0.5 : 1 }}
          >
            {quickOptions.map((option, index) => (
              <button
                key={option.id}
                onClick={() => {
                  if (!skipReminders) {
                    setSelectedQuick(option.id);
                    setReminderTime(option.time);
                  }
                }}
                disabled={skipReminders}
                className="w-full p-4 flex items-center justify-between transition-colors"
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

          {/* Skip Option */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div 
              className="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
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

        {/* Footer */}
        <div className="p-6">
          <button
            onClick={completeOnboarding}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: colors.primary }}
          >
            Start tracking →
          </button>
        </div>

        <style>{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
          }
          .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        `}</style>
      </div>
    );
  };

  // Home Screen
  const HomeScreen = () => {
    const today = new Date();
    const isToday = getDateString(selectedDate) === getDateString(today);
    const completedCount = habits.filter(h => {
      const key = `${h.id}-${getDateString(selectedDate)}`;
      return completions[key];
    }).length;

    const changeDate = (delta) => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + delta);
      if (newDate <= today) {
        setSelectedDate(newDate);
      }
    };

    return (
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <span className="text-xl">☰</span>
          </button>
          <span 
            className="text-xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            Stribe
          </span>
          <button 
            onClick={() => navigate('settings')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-4 p-4">
          <button 
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span style={{ color: colors.textSecondary }}>◀</span>
          </button>
          <div className="text-center">
            <span 
              className="font-medium"
              style={{ color: colors.textPrimary }}
            >
              {formatDate(selectedDate)}
            </span>
            {isToday && (
              <span 
                className="ml-2 text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: colors.primaryLighter, color: colors.primary }}
              >
                I dag
              </span>
            )}
          </div>
          <button 
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-gray-100 rounded-full"
            style={{ visibility: isToday ? 'hidden' : 'visible' }}
          >
            <span style={{ color: colors.textSecondary }}>▶</span>
          </button>
        </div>

        {/* Habits List */}
        <div className="flex-1 px-4 overflow-auto">
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <span className="text-6xl mb-4">🌱</span>
              <h2 
                className="text-xl font-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                Ingen habits endnu
              </h2>
              <p 
                className="mb-6"
                style={{ color: colors.textSecondary }}
              >
                Opret din første habit for at komme i gang
              </p>
              <button
                onClick={() => navigate('addHabit')}
                className="py-3 px-6 rounded-xl font-semibold text-white"
                style={{ backgroundColor: colors.primary }}
              >
                ➕ Opret habit
              </button>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {habits.map((habit) => {
                const dateStr = getDateString(selectedDate);
                const key = `${habit.id}-${dateStr}`;
                const isCompleted = !!completions[key];
                const streak = calculateStreak(habit.id);
                const last7 = getLast7Days(habit.id);

                return (
                  <div
                    key={habit.id}
                    className="rounded-2xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                    style={{ 
                      backgroundColor: colors.surface,
                      background: isCompleted 
                        ? `linear-gradient(to right, ${colors.surface}, ${habit.color}10)`
                        : colors.surface,
                    }}
                    onClick={() => navigate('habitDetail', { habit })}
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{habit.emoji}</span>
                        <span 
                          className="font-semibold"
                          style={{ color: colors.textPrimary }}
                        >
                          {habit.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">🔥</span>
                        <span 
                          className="font-bold"
                          style={{ color: colors.textPrimary }}
                        >
                          {streak}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-1 mb-3">
                      {last7.map((completed, i) => (
                        <div
                          key={i}
                          className="flex-1 h-2 rounded-full transition-colors"
                          style={{
                            backgroundColor: completed ? habit.color : colors.border,
                          }}
                        />
                      ))}
                    </div>

                    {/* Checkbox */}
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompletion(habit.id);
                        }}
                        className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        {isCompleted ? (
                          <>
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: habit.color }}
                            >
                              <span className="text-white font-bold">✓</span>
                            </div>
                            <span 
                              className="text-sm font-medium"
                              style={{ color: habit.color }}
                            >
                              Done
                            </span>
                          </>
                        ) : (
                          <div 
                            className="w-8 h-8 rounded-lg border-2"
                            style={{ borderColor: colors.border }}
                          />
                        )}
                      </button>
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
            <p 
              className="text-center mb-3"
              style={{ color: completedCount === habits.length ? colors.primary : colors.textSecondary }}
            >
              {completedCount === habits.length 
                ? '🎉 Alle habits done i dag!'
                : `${completedCount} af ${habits.length} i dag`
              }
            </p>
            <button
              onClick={() => navigate('addHabit')}
              className="w-full py-3 rounded-xl font-medium border-2 border-dashed transition-colors hover:bg-gray-50"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              ➕ Ny habit
            </button>
          </div>
        )}
      </div>
    );
  };

  // Habit Detail Screen
  const HabitDetailScreen = () => {
    if (!selectedHabit) return null;
    
    const streak = calculateStreak(selectedHabit.id);
    const habit = habits.find(h => h.id === selectedHabit.id) || selectedHabit;
    
    // Calculate stats
    const allCompletions = Object.keys(completions).filter(k => k.startsWith(habit.id));
    const totalDays = Math.max(1, Math.ceil((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)));
    const completionRate = Math.round((allCompletions.length / totalDays) * 100);
    const longestStreak = streak; // Simplified for prototype

    // Generate calendar data
    const generateCalendar = () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const days = [];
      
      // Pad start
      const startPad = (firstDay.getDay() + 6) % 7;
      for (let i = 0; i < startPad; i++) {
        days.push(null);
      }
      
      // Actual days
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(today.getFullYear(), today.getMonth(), d);
        const dateStr = getDateString(date);
        const key = `${habit.id}-${dateStr}`;
        days.push({
          day: d,
          completed: !!completions[key],
          isToday: d === today.getDate(),
          isFuture: date > today,
        });
      }
      
      return days;
    };

    const calendarDays = generateCalendar();
    const monthNames = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];

    return (
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate('home')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span className="text-xl">←</span>
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (confirm('Er du sikker på at du vil slette denne habit?')) {
                  deleteHabit(habit.id);
                  navigate('home');
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <span className="text-xl">🗑️</span>
            </button>
            <button 
              onClick={() => navigate('editHabit', { editHabit: habit })}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <span className="text-xl">✏️</span>
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 overflow-auto">
          {/* Habit Identity */}
          <div className="text-center mb-6">
            <span className="text-5xl block mb-2">{habit.emoji}</span>
            <h1 
              className="text-2xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              {habit.name}
            </h1>
          </div>

          {/* Streak Card */}
          <div 
            className="rounded-2xl p-6 text-center mb-6"
            style={{ backgroundColor: `${habit.color}15` }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🔥</span>
              <span 
                className="text-4xl font-bold"
                style={{ color: habit.color }}
              >
                {streak}
              </span>
            </div>
            <span style={{ color: colors.textSecondary }}>dage i træk</span>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div 
              className="rounded-xl p-4 text-center border"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <span className="text-lg mb-1 block">🏆</span>
              <span 
                className="text-xl font-bold block"
                style={{ color: colors.textPrimary }}
              >
                {longestStreak} dage
              </span>
              <span 
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                Længste streak
              </span>
            </div>
            <div 
              className="rounded-xl p-4 text-center border"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <span className="text-lg mb-1 block">📊</span>
              <span 
                className="text-xl font-bold block"
                style={{ color: colors.textPrimary }}
              >
                {completionRate}%
              </span>
              <span 
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                Completion rate
              </span>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span 
                className="font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
              </span>
            </div>
            
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'].map(day => (
                <div 
                  key={day}
                  className="text-center text-xs font-medium py-1"
                  style={{ color: colors.textTertiary }}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-sm transition-colors"
                  style={{
                    backgroundColor: day?.completed 
                      ? habit.color 
                      : day?.isToday 
                        ? 'transparent'
                        : day 
                          ? `${colors.border}80`
                          : 'transparent',
                    color: day?.completed 
                      ? 'white' 
                      : day?.isFuture 
                        ? colors.textTertiary
                        : colors.textPrimary,
                    border: day?.isToday ? `2px dashed ${habit.color}` : 'none',
                    opacity: day?.isFuture ? 0.3 : 1,
                  }}
                >
                  {day?.day}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs" style={{ color: colors.textTertiary }}>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: habit.color }} />
                <span>done</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.border }} />
                <span>missed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border-2 border-dashed" style={{ borderColor: habit.color }} />
                <span>i dag</span>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div 
            className="rounded-xl p-4 flex items-center justify-between border"
            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
          >
            <div className="flex items-center gap-3">
              <span>🔔</span>
              <span style={{ color: colors.textSecondary }}>Påmindelse:</span>
              <span 
                className="font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {habit.reminderTime || 'Ingen'}
              </span>
            </div>
            <span style={{ color: colors.textTertiary }}>›</span>
          </div>
        </div>
      </div>
    );
  };

  // Add/Edit Habit Screen
  const AddEditHabitScreen = () => {
    const isEditing = !!editingHabit;
    const [form, setForm] = useState(
      isEditing 
        ? { ...editingHabit }
        : { name: '', emoji: '⭐', color: '#4CAF50', reminderTime: '09:00' }
    );

    const handleSave = () => {
      if (!form.name.trim()) return;
      
      if (isEditing) {
        updateHabit(form);
      } else {
        addHabit({
          ...form,
          id: Date.now().toString(),
        });
      }
      navigate('home');
      setEditingHabit(null);
    };

    return (
      <div 
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <button 
            onClick={() => {
              navigate('home');
              setEditingHabit(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span className="text-xl">✕</span>
          </button>
          <span className="font-semibold" style={{ color: colors.textPrimary }}>
            {isEditing ? 'Rediger habit' : 'Ny habit'}
          </span>
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="font-semibold disabled:opacity-50"
            style={{ color: colors.primary }}
          >
            Gem
          </button>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {/* Preview */}
          <div 
            className="rounded-2xl p-6 mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${form.color}15` }}
          >
            <span className="text-5xl">{form.emoji}</span>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label 
              className="block mb-2 font-medium"
              style={{ color: colors.textSecondary }}
            >
              Navn
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value.slice(0, 30) })}
              placeholder="Skriv habit navn..."
              className="w-full p-4 rounded-xl border-2 focus:outline-none transition-colors"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
              maxLength={30}
            />
          </div>

          {/* Emoji Picker */}
          <div className="mb-6">
            <label 
              className="block mb-2 font-medium"
              style={{ color: colors.textSecondary }}
            >
              Ikon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setForm({ ...form, emoji })}
                  className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl transition-all hover:scale-110"
                  style={{
                    borderColor: form.emoji === emoji ? colors.primary : colors.border,
                    backgroundColor: form.emoji === emoji ? colors.primaryLighter : colors.surface,
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <label 
              className="block mb-2 font-medium"
              style={{ color: colors.textSecondary }}
            >
              Farve
            </label>
            <div className="flex gap-3">
              {habitColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setForm({ ...form, color: color.value })}
                  className="w-10 h-10 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: color.value,
                    boxShadow: form.color === color.value 
                      ? `0 0 0 3px ${colors.surface}, 0 0 0 5px ${color.value}` 
                      : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="mb-6">
            <label 
              className="block mb-2 font-medium"
              style={{ color: colors.textSecondary }}
            >
              Påmindelse
            </label>
            <div 
              className="rounded-xl p-4 flex items-center justify-between border"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
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
                <button
                  onClick={() => setForm({ ...form, reminderTime: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6">
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}
          >
            {isEditing ? 'Gem ændringer' : 'Gem habit'}
          </button>
          
          {isEditing && (
            <button
              onClick={() => {
                if (confirm('Er du sikker på at du vil arkivere denne habit?')) {
                  deleteHabit(editingHabit.id);
                  navigate('home');
                  setEditingHabit(null);
                }
              }}
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
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div 
        className="flex items-center p-4 border-b"
        style={{ borderColor: colors.border }}
      >
        <button 
          onClick={() => navigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <span className="text-xl">←</span>
        </button>
        <span 
          className="ml-4 text-lg font-semibold"
          style={{ color: colors.textPrimary }}
        >
          Indstillinger
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        {/* General Section */}
        <div className="p-4">
          <h3 
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: colors.textTertiary }}
          >
            Generelt
          </h3>
          <div 
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: colors.border }}
          >
            <SettingRow
              icon="🌙"
              label="Dag starter kl."
              value={settings.dayStartTime}
            />
            <SettingRow
              icon="📅"
              label="Ugen starter"
              value={settings.weekStart === 'monday' ? 'Mandag' : 'Søndag'}
            />
            <SettingRow
              icon="🌐"
              label="Sprog"
              value="Dansk"
              isLast
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="p-4">
          <h3 
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: colors.textTertiary }}
          >
            Notifikationer
          </h3>
          <div 
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: colors.border }}
          >
            <SettingToggle
              icon="🔔"
              label="Påmindelser"
              value={settings.notificationsEnabled}
              onChange={(v) => setSettings({ ...settings, notificationsEnabled: v })}
            />
            <SettingToggle
              icon="🔊"
              label="Lyd"
              value={settings.soundEnabled}
              onChange={(v) => setSettings({ ...settings, soundEnabled: v })}
              isLast
            />
          </div>
        </div>

        {/* Data Section */}
        <div className="p-4">
          <h3 
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: colors.textTertiary }}
          >
            Data
          </h3>
          <div 
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: colors.border }}
          >
            <SettingRow
              icon="📤"
              label="Eksporter data (CSV)"
              showLock
            />
            <SettingRow
              icon="🗑️"
              label="Slet alle data"
              isDestructive
              isLast
            />
          </div>
        </div>

        {/* Pro Card */}
        <div className="p-4">
          <div 
            className="rounded-2xl p-5 text-white"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})` 
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-lg">Opgrader til Pro</span>
            </div>
            <ul className="space-y-1 mb-4 text-sm opacity-90">
              <li>• Ubegrænset habits</li>
              <li>• CSV eksport</li>
              <li>• Alle badges</li>
            </ul>
            <p className="text-sm opacity-80 mb-4">
              19 kr/måned eller 149 kr engang
            </p>
            <button 
              className="w-full py-3 rounded-xl font-semibold"
              style={{ backgroundColor: colors.surface, color: colors.primary }}
            >
              Opgrader nu
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p style={{ color: colors.textSecondary }}>
            <span className="cursor-pointer hover:underline">Om Stribe</span>
            {' • '}
            <span className="cursor-pointer hover:underline">Privatlivspolitik</span>
          </p>
          <p 
            className="text-sm mt-2"
            style={{ color: colors.textTertiary }}
          >
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );

  // Setting Row Component
  const SettingRow = ({ icon, label, value, showLock, isDestructive, isLast }) => (
    <div 
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
      style={{ 
        backgroundColor: colors.surface,
        borderBottom: isLast ? 'none' : `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <span style={{ color: isDestructive ? colors.error : colors.textPrimary }}>
          {label}
        </span>
        {showLock && <span className="text-xs">🔒</span>}
      </div>
      <div className="flex items-center gap-2">
        {value && (
          <span style={{ color: colors.textSecondary }}>{value}</span>
        )}
        <span style={{ color: colors.textTertiary }}>›</span>
      </div>
    </div>
  );

  // Setting Toggle Component
  const SettingToggle = ({ icon, label, value, onChange, isLast }) => (
    <div 
      className="flex items-center justify-between p-4"
      style={{ 
        backgroundColor: colors.surface,
        borderBottom: isLast ? 'none' : `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <span style={{ color: colors.textPrimary }}>{label}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="w-12 h-7 rounded-full p-1 transition-colors duration-200"
        style={{ backgroundColor: value ? colors.primary : colors.border }}
      >
        <div 
          className="w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );

  // Milestone Modal
  const MilestoneModal = () => {
    if (!showMilestone) return null;
    
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 p-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={() => setShowMilestone(null)}
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: [colors.primary, colors.habitYellow, colors.habitBlue, colors.habitPurple, colors.habitOrange][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div 
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in relative"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-6xl block mb-4">{showMilestone.badge}</span>
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: colors.textPrimary }}
          >
            {showMilestone.title}
          </h2>
          <p className="mb-2" style={{ color: colors.textSecondary }}>
            Du har gjort {showMilestone.habit?.emoji}<br />
            i {showMilestone.days} dage i træk!
          </p>
          <p 
            className="text-sm italic mb-6"
            style={{ color: colors.textTertiary }}
          >
            "{showMilestone.message}"
          </p>
          
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-xl font-medium border"
              style={{ borderColor: colors.border, color: colors.textSecondary }}
            >
              Del 📤
            </button>
            <button
              onClick={() => setShowMilestone(null)}
              className="flex-1 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Fortsæt →
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          @keyframes scale-in {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-fall { animation: fall 3s linear forwards; }
          .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        `}</style>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'habitSelect':
        return <HabitSelectScreen />;
      case 'customHabit':
        return <CustomHabitScreen />;
      case 'reminder':
        return <ReminderScreen />;
      case 'home':
        return <HomeScreen />;
      case 'habitDetail':
        return <HabitDetailScreen />;
      case 'addHabit':
      case 'editHabit':
        return <AddEditHabitScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden">
      {renderScreen()}
      <MilestoneModal />
    </div>
  );
}
