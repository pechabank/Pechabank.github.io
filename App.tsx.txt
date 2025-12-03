import React, { useState, useEffect } from 'react';
import GlassCard from './components/TornCard';
import PechaAssistant from './components/PechaAssistant';

// --- Types & Data ---

type ViewState = 'landing' | 'flow-debit' | 'flow-credit' | 'flow-child' | 'success';
type CardSystem = 'visa' | 'mastercard';

interface OrderFormData {
  name: string;
  address: string;
  phone: string;
  cvv: string;
  system: CardSystem;
}

const INITIAL_FORM_STATE: OrderFormData = {
  name: '',
  address: '',
  phone: '',
  cvv: '',
  system: 'visa'
};

const MOCK_CHILD_CHARACTERS = [
  { id: 'bear', name: 'Мишка', emoji: '🐻', colorClass: 'from-amber-700 to-amber-900' },
  { id: 'skunk', name: 'Скунс', emoji: '🦨', colorClass: 'from-slate-700 to-slate-900' },
  { id: 'dog', name: 'Собачка', emoji: '🐶', colorClass: 'from-orange-400 to-orange-600' },
  { id: 'fox', name: 'Лисичка', emoji: '🦊', colorClass: 'from-orange-500 to-red-700' },
  { id: 'cat', name: 'Котик', emoji: '🐱', colorClass: 'from-zinc-400 to-zinc-600' },
  { id: 'lion', name: 'Лео', emoji: '🦁', colorClass: 'from-yellow-500 to-amber-700' },
  { id: 'panda', name: 'Панда', emoji: '🐼', colorClass: 'from-emerald-800 to-black' },
  { id: 'unicorn', name: 'Пони', emoji: '🦄', colorClass: 'from-pink-400 to-purple-600' },
  { id: 'owl', name: 'Сова', emoji: '🦉', colorClass: 'from-indigo-600 to-slate-800' },
];

const MOCK_UNIQUE_DESIGNS = [
  { id: 'panther', name: 'Розовая пантера', bg: 'bg-zinc-950', icon: '🐾', accent: 'text-pink-500', desc: 'Limited Edition' },
  { id: 'eiffel', name: 'Париж', bg: 'bg-blue-950', icon: '🗼', accent: 'text-blue-200', desc: 'Travel Edition' },
];

const COLORS = [
  { id: 'violet', name: 'Фиолетовый', class: 'from-violet-600 to-indigo-900' },
  { id: 'green', name: 'Изумруд', class: 'from-emerald-500 to-teal-900' },
  { id: 'pink', name: 'Неон', class: 'from-pink-500 to-rose-900' },
  { id: 'silver', name: 'Сталь', class: 'from-slate-300 to-slate-500' },
  { id: 'gold', name: 'Золото', class: 'from-yellow-400 to-amber-700' },
  { id: 'midnight', name: 'Полночь', class: 'from-blue-900 to-black' },
  { id: 'crimson', name: 'Кримсон', class: 'from-red-700 to-rose-950' },
  { id: 'mint', name: 'Мята', class: 'from-teal-200 to-emerald-400' },
  { id: 'orange', name: 'Закат', class: 'from-orange-500 to-red-600' },
];

// --- SVG Icons ---
const EiffelSVG = () => (
  <svg viewBox="0 0 200 400" className="w-full h-full text-blue-200 drop-shadow-[0_0_15px_rgba(191,219,254,0.5)] opacity-90" fill="currentColor">
    <path d="M95 10 L105 10 L110 50 L90 50 Z M90 55 L110 55 L115 100 L85 100 Z M82 105 L118 105 L125 180 L75 180 Z M70 185 L130 185 L145 350 L55 350 Z M60 300 Q100 250 140 300" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M100 0 L100 10 M70 185 L130 185 M82 105 L118 105 M55 350 L145 350" stroke="currentColor" strokeWidth="3" />
    <path d="M65 350 L50 400 L150 400 L135 350" fill="currentColor" opacity="0.5"/>
    <path d="M88 120 L112 120 M86 140 L114 140 M84 160 L116 160" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const VisaLogo = () => (
  <svg className="w-12 h-8 opacity-90" viewBox="0 0 48 32" fill="none">
    <path d="M19.5 2h-3L14.6 19.3h3l.9-4h4.9l.4 4h2.6l-3.3-17.3h-3.6zm-1.8 11l2-8.4 1.2 8.4h-3.2zM33.6 11.6c.1-.8.9-1.5 2.5-1.5 1.1 0 2 .2 2.6.5l.5-3.3c-.7-.3-1.8-.5-3.2-.5-3.6 0-6.1 1.9-6.2 4.7-.1 2 1.8 3.2 3.2 3.9 1.4.7 1.9 1.1 1.9 1.7 0 .9-1.1 1.4-2.1 1.4-1.4 0-2.2-.2-3.4-.7l-.5 3.5c.8.4 2.2.7 3.7.7 3.9 0 6.4-1.9 6.5-4.9 0-1.6-1-2.9-3.2-3.9-1.1-.6-1.8-1-1.8-1.7" fill="#fff"/>
    <path d="M9.6 2H6.4L4.3 11.2C4.1 12.1 4 12.3 3.5 12.5c-.8.4-2.1.8-2.7.9L1 14.8h4.6c.7 0 1.3-.5 1.5-1.1L9.6 2zM45.5 2h-2.3c-.7 0-1.2.2-1.5.9l-4.3 16.4h3.2l.6-3.2h4l.4 3.2h2.8L45.5 2z" fill="#fff"/>
  </svg>
);

const MasterCardLogo = () => (
  <svg className="w-12 h-12 opacity-90" viewBox="0 0 50 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="#EB001B" fillOpacity="0.9"/>
    <circle cx="34" cy="16" r="14" fill="#F79E1B" fillOpacity="0.9"/>
    <path d="M25 5.5A14.9 14.9 0 0 0 20.3 16c0 4 1.6 7.6 4.7 10.5 3.1-2.9 4.7-6.5 4.7-10.5A14.9 14.9 0 0 0 25 5.5z" fill="#FF5F00"/>
  </svg>
);

// --- 3D Card Component (Enhanced) ---

const Card3D = ({ 
  colorClass, 
  title, 
  icon, 
  design, 
  onClick,
  holderName,
  system = 'visa',
  className = "" 
}: { 
  colorClass: string, 
  title: string, 
  icon?: string, 
  design?: 'panther' | 'eiffel', 
  onClick?: () => void,
  holderName?: string,
  system?: CardSystem,
  className?: string
}) => {
  return (
    <div 
      onClick={onClick} 
      className={`relative group perspective-1000 w-full h-56 md:h-64 cursor-pointer z-10 ${className}`}
    >
      <div className={`relative w-full h-full rounded-[2rem] shadow-[0_30px_90px_rgba(0,0,0,0.7)] transition-all duration-[2000ms] cubic-bezier(0.1, 1, 0.2, 1) transform preserve-3d group-hover:rotate-y-6 group-hover:rotate-x-6 group-hover:scale-105 group-active:scale-95 bg-gradient-to-br ${colorClass} overflow-hidden border border-white/10 ring-1 ring-white/5`}>
        
        {/* Dynamic Sheen Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms] pointer-events-none z-30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform ease-in-out"></div>
        
        {/* Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none mix-blend-overlay group-hover:bg-white/20 transition-colors duration-[1500ms]"></div>

        {/* Card Content Layer (Lifted in 3D) */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between z-20 translate-z-[20px] group-hover:translate-z-[40px] transition-transform duration-[1500ms]">
          <div className="flex justify-between items-start">
             <div className="font-display font-bold text-white tracking-widest text-sm md:text-base opacity-90 drop-shadow-md">PECHA BANK</div>
             <div className="flex items-center gap-2">
                {system === 'visa' ? <VisaLogo /> : <MasterCardLogo />}
             </div>
          </div>
          
          <div className="flex items-center justify-center flex-1 transform translate-y-2">
            {design === 'panther' && <div className="text-7xl md:text-8xl animate-pulse-slow text-pink-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]">🐾</div>}
            {design === 'eiffel' && <div className="h-32 w-32 animate-float"><EiffelSVG /></div>}
            {icon && !design && <div className="text-7xl md:text-8xl drop-shadow-2xl filter saturate-150 animate-float">{icon}</div>}
          </div>

          <div>
             <div className="text-white/70 font-mono text-xs md:text-sm tracking-[0.25em] mb-3 shadow-black drop-shadow-md">•••• •••• •••• 8888</div>
             <div className="flex justify-between items-end">
                <div className="text-white/90 font-medium text-xs md:text-sm uppercase tracking-wide drop-shadow-md truncate max-w-[150px] transition-all duration-1000">
                  {holderName || "Genius Client"}
                </div>
                <div className="text-white font-bold text-sm md:text-base tracking-wide bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg group-hover:bg-white/20 transition-colors">{title}</div>
             </div>
          </div>
        </div>

        {/* Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>
    </div>
  );
};

// --- Form Components ---

const FormInput = ({ 
  value, 
  onChange, 
  placeholder, 
  className = "",
  delay = "0ms"
}: { 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string,
  className?: string,
  delay?: string
}) => (
  <input 
    type="text" 
    placeholder={placeholder} 
    value={value}
    onChange={e => onChange(e.target.value)}
    className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-violet-500 transition-all duration-500 focus:shadow-[0_0_20px_rgba(124,58,237,0.2)] animate-slide-up-fade opacity-0 ${className}`}
    style={{ animationDelay: delay, animationFillMode: 'both' }}
  />
);

const FormSection = ({ 
  data, 
  onChange, 
  delayStart = 0 
}: { 
  data: OrderFormData, 
  onChange: (d: OrderFormData) => void,
  delayStart?: number 
}) => {
  return (
    <div className="space-y-4">
       {/* Card System Toggle */}
       <div className="grid grid-cols-2 gap-4 animate-slide-up-fade opacity-0" style={{ animationDelay: `${delayStart}ms`, animationFillMode: 'both' }}>
          <button 
             onClick={() => onChange({...data, system: 'visa'})}
             className={`flex items-center justify-center p-4 rounded-2xl border transition-all duration-500 active:scale-95 ${data.system === 'visa' ? 'bg-white/10 border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'border-white/10 hover:bg-white/5'}`}
          >
             <VisaLogo />
          </button>
          <button 
             onClick={() => onChange({...data, system: 'mastercard'})}
             className={`flex items-center justify-center p-4 rounded-2xl border transition-all duration-500 active:scale-95 ${data.system === 'mastercard' ? 'bg-white/10 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-white/10 hover:bg-white/5'}`}
          >
             <MasterCardLogo />
          </button>
       </div>

       <FormInput 
         value={data.name} 
         onChange={(v) => onChange({...data, name: v})} 
         placeholder="Имя Фамилия"
         delay={`${delayStart + 100}ms`}
       />
       
       <FormInput 
         value={data.address} 
         onChange={(v) => onChange({...data, address: v})} 
         placeholder="Адрес доставки"
         delay={`${delayStart + 200}ms`}
       />

       <div className="grid grid-cols-2 gap-4">
          <FormInput 
            value={data.phone} 
            onChange={(v) => onChange({...data, phone: v})} 
            placeholder="Телефон"
            delay={`${delayStart + 300}ms`}
          />
          <FormInput 
            value={data.cvv} 
            onChange={(v) => onChange({...data, cvv: v})} 
            placeholder="Свой CVV"
            delay={`${delayStart + 400}ms`}
          />
       </div>
    </div>
  );
}

// --- Main Application ---

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [successMessage, setSuccessMessage] = useState('Карта заказана!');
  
  // Shared Form State
  const [formData, setFormData] = useState<OrderFormData>(INITIAL_FORM_STATE);

  // Card specific states
  const [debitColor, setDebitColor] = useState(COLORS[0]);
  const [creditColor, setCreditColor] = useState(COLORS[3]);
  const [childTab, setChildTab] = useState<'character' | 'unique'>('character');
  const [selectedCharacter, setSelectedCharacter] = useState(MOCK_CHILD_CHARACTERS[0]);
  const [selectedUnique, setSelectedUnique] = useState(MOCK_UNIQUE_DESIGNS[0]);
  const [childColor, setChildColor] = useState(COLORS[1]);

  // Helpers
  const scrollToCards = () => {
    document.getElementById('cards-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goHome = () => {
    setView('landing');
    setFormData(INITIAL_FORM_STATE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrder = (msg: string) => {
    setSuccessMessage(msg);
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const BackButton = ({ onClick }: { onClick?: () => void }) => (
    <button 
      onClick={onClick || goHome}
      className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-500 mb-8 text-sm font-medium tracking-wide animate-slide-up hover:scale-105 active:scale-95"
    >
      <span className="group-hover:-translate-x-1 transition-transform duration-500">←</span> Назад
    </button>
  );

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-violet-500/50 overflow-x-hidden relative">
      
      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-violet-900/30 rounded-full blur-[120px] animate-blob mix-blend-screen opacity-60"></div>
        <div className="absolute top-[40%] right-[-20%] w-[70vw] h-[70vw] bg-indigo-900/30 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-fuchsia-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen opacity-50"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 animate-slide-up">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-panel rounded-full px-6 py-3 transition-all duration-700 hover:bg-white/10">
          <div className="font-display font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 cursor-pointer" onClick={goHome}>
            Pecha<span className="text-violet-400">Bank</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all duration-500 hover:rotate-90 active:scale-90 border border-white/5">
            <div className="flex flex-col gap-1.5">
               <span className="block w-5 h-0.5 bg-white rounded-full"></span>
               <span className="block w-5 h-0.5 bg-white rounded-full"></span>
            </div>
          </button>
        </div>
      </nav>

      {/* --- LANDING VIEW --- */}
      {view === 'landing' && (
        <div className="relative z-10" key="landing">
          
          {/* Hero Section */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-9xl tracking-tight mb-8 leading-tight perspective-1000">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 animate-slide-up-fade opacity-0" style={{ animationDelay: '100ms' }}>Банк для</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300 animate-slide-up-fade opacity-0 text-liquid" style={{ animationDelay: '300ms' }}>Гениев</span>
            </h1>
            
            <button 
              onClick={scrollToCards}
              className="group relative px-12 py-6 rounded-full bg-white text-black font-bold text-lg overflow-hidden transition-all duration-1000 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] active:scale-95 animate-slide-up-fade opacity-0 mt-8"
              style={{ animationDelay: '500ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-300 via-purple-200 to-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <span className="relative z-10 flex items-center gap-2">
                Заказать карту <span className="group-hover:translate-y-1 transition-transform duration-500 ease-out">↓</span>
              </span>
            </button>
          </section>

          {/* Cards Selection Section */}
          <section id="cards-section" className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-16 text-white/90 animate-slide-up opacity-0" style={{ animationFillMode: 'both' }}>Выберите свою силу</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
              
              {/* Debit Option */}
              <div className="flex flex-col gap-6 group animate-slide-up-fade opacity-0" style={{ animationDelay: '200ms' }}>
                <Card3D 
                  colorClass={COLORS[0].class} 
                  title="Debit Core" 
                  onClick={() => setView('flow-debit')}
                />
                <div className="text-center group-hover:translate-y-[-5px] transition-transform duration-1000">
                  <h3 className="text-2xl font-bold mb-2">Дебетовая</h3>
                  <p className="text-white/50 text-sm mb-4">Классика в новом исполнении.</p>
                  <button 
                    onClick={() => setView('flow-debit')}
                    className="w-full py-4 rounded-2xl glass-button text-white font-medium hover:bg-violet-600/20 hover:border-violet-500/50 active:scale-95"
                  >
                    Оформить
                  </button>
                </div>
              </div>

              {/* Credit Option */}
              <div className="flex flex-col gap-6 group animate-slide-up-fade opacity-0" style={{ animationDelay: '400ms' }}>
                <Card3D 
                  colorClass={COLORS[3].class} 
                  title="Credit Flow" 
                  onClick={() => setView('flow-credit')}
                />
                <div className="text-center group-hover:translate-y-[-5px] transition-transform duration-1000">
                  <h3 className="text-2xl font-bold mb-2">Кредитная</h3>
                  <p className="text-white/50 text-sm mb-4">Больше возможностей. Меньше слов.</p>
                  <button 
                    onClick={() => setView('flow-credit')}
                    className="w-full py-4 rounded-2xl glass-button text-white font-medium hover:bg-violet-600/20 hover:border-violet-500/50 active:scale-95"
                  >
                    Оформить
                  </button>
                </div>
              </div>

              {/* Child Option */}
              <div className="flex flex-col gap-6 group animate-slide-up-fade opacity-0" style={{ animationDelay: '600ms' }}>
                <Card3D 
                  colorClass={MOCK_CHILD_CHARACTERS[0].colorClass} 
                  title="Junior" 
                  icon={MOCK_CHILD_CHARACTERS[0].emoji}
                  onClick={() => setView('flow-child')}
                />
                <div className="text-center group-hover:translate-y-[-5px] transition-transform duration-1000">
                  <h3 className="text-2xl font-bold mb-2">Детская</h3>
                  <p className="text-white/50 text-sm mb-4">Для маленьких гениев.</p>
                  <button 
                    onClick={() => setView('flow-child')}
                    className="w-full py-4 rounded-2xl glass-button text-white font-medium hover:bg-violet-600/20 hover:border-violet-500/50 active:scale-95"
                  >
                    Оформить
                  </button>
                </div>
              </div>

            </div>
          </section>
        </div>
      )}

      {/* --- DEBIT FLOW --- */}
      {view === 'flow-debit' && (
        <div className="relative z-20 min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto" key="flow-debit">
          <BackButton />
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="sticky top-24 animate-scale-in opacity-0" style={{ animationDelay: '100ms' }}>
              <h2 className="text-3xl font-bold mb-6">Настройка Дебетовой</h2>
              <Card3D 
                colorClass={debitColor.class} 
                title="Debit Core" 
                holderName={formData.name}
                system={formData.system}
              />
            </div>

            <GlassCard className="flex flex-col gap-8 animate-slide-up-fade opacity-0" style={{ animationDelay: '300ms' }}>
              {/* Color Picker */}
              <div>
                <label className="text-sm text-white/60 mb-4 block uppercase tracking-wider font-bold">Выберите цвет</label>
                <div className="grid grid-cols-5 gap-3">
                  {COLORS.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setDebitColor(c)}
                      style={{ animationDelay: `${400 + (i * 100)}ms` }}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.class} transition-all duration-700 hover:scale-110 active:scale-90 animate-scale-in opacity-0 ${debitColor.id === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'opacity-70 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>

              <FormSection data={formData} onChange={setFormData} delayStart={500} />

              <button 
                onClick={() => handleOrder('Дебетовая карта заказана!')}
                className="w-full py-5 rounded-2xl bg-white text-black font-bold text-lg hover:bg-violet-50 transition-all duration-700 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:scale-95 active:translate-y-0 animate-slide-up-fade opacity-0 mt-4"
                style={{ animationDelay: '1000ms', animationFillMode: 'both' }}
              >
                Заказать карту
              </button>
            </GlassCard>
          </div>
        </div>
      )}

      {/* --- CREDIT FLOW --- */}
      {view === 'flow-credit' && (
        <div className="relative z-20 min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto" key="flow-credit">
          <BackButton />
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
             <div className="sticky top-24 order-1 md:order-1 animate-scale-in opacity-0" style={{ animationDelay: '200ms' }}>
              <h2 className="text-3xl font-bold mb-6">Дизайн Кредитной</h2>
              <Card3D 
                colorClass={creditColor.class} 
                title="Credit Flow" 
                holderName={formData.name}
                system={formData.system}
              />
              <p className="text-white/60 mt-8">Минимализм и стиль. Выберите оттенок, который подходит вашему статусу.</p>
            </div>

            <GlassCard className="order-2 md:order-2 flex flex-col gap-8 animate-slide-up-fade opacity-0" style={{ animationDelay: '300ms' }}>
              <div>
                <label className="text-sm text-white/60 mb-4 block uppercase tracking-wider font-bold">Выберите оттенок</label>
                <div className="grid grid-cols-2 gap-4">
                  {COLORS.slice(0, 6).map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setCreditColor(c)}
                      style={{ animationDelay: `${400 + (i * 100)}ms` }}
                      className={`p-4 rounded-2xl border animate-scale-in opacity-0 ${creditColor.id === c.id ? 'border-violet-500 bg-white/10 shadow-[0_0_20px_rgba(124,58,237,0.2)]' : 'border-white/10 bg-transparent hover:bg-white/5'} text-left transition-all duration-500 active:scale-95`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.class} mb-2`}></div>
                      <div className="text-sm font-medium">{c.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <FormSection data={formData} onChange={setFormData} delayStart={600} />

              <button 
                onClick={() => handleOrder('Кредитная карта заказана!')}
                className="w-full py-5 rounded-2xl bg-violet-600 text-white font-bold text-lg hover:bg-violet-500 transition-all duration-700 shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] hover:-translate-y-1 active:scale-95 mt-4 animate-slide-up-fade opacity-0"
                style={{ animationDelay: '1100ms', animationFillMode: 'both' }}
              >
                Подтвердить выбор
              </button>
            </GlassCard>
          </div>
        </div>
      )}

      {/* --- CHILD FLOW --- */}
      {view === 'flow-child' && (
        <div className="relative z-20 min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto" key="flow-child">
          <BackButton />
          
          <div className="flex flex-col items-center mb-10 animate-slide-up-fade opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Конструктор Junior</h2>
            
            {/* Toggle Tabs */}
            <div className="p-1 rounded-full bg-white/10 backdrop-blur-md flex shadow-lg">
              <button 
                onClick={() => setChildTab('character')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-700 ${childTab === 'character' ? 'bg-violet-600 text-white shadow-lg scale-105' : 'text-white/60 hover:text-white'}`}
              >
                3D Персонажи
              </button>
              <button 
                onClick={() => setChildTab('unique')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-700 ${childTab === 'unique' ? 'bg-pink-600 text-white shadow-lg scale-105' : 'text-white/60 hover:text-white'}`}
              >
                Уникальный дизайн
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Preview Area */}
            <div className="sticky top-24 flex flex-col items-center animate-scale-in opacity-0" style={{ animationDelay: '200ms' }}>
               <div className="w-full max-w-md">
                 {childTab === 'character' ? (
                   <Card3D 
                     colorClass={childColor.class} 
                     title="Junior" 
                     icon={selectedCharacter.emoji} 
                     holderName={formData.name}
                     system={formData.system}
                   />
                 ) : (
                   <Card3D 
                     colorClass={selectedUnique.bg} 
                     title="Junior Unique" 
                     design={selectedUnique.id as any}
                     holderName={formData.name}
                     system={formData.system}
                   />
                 )}
               </div>
               <p className="mt-6 text-white/50 text-sm animate-pulse">Вращайте карту курсором (на ПК)</p>
            </div>

            {/* Controls Area */}
            <GlassCard className="flex flex-col gap-8 animate-slide-up-fade opacity-0" style={{ animationDelay: '400ms' }}>
              {childTab === 'character' ? (
                <>
                  <div className="animate-slide-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                    <label className="text-sm text-white/60 mb-4 block uppercase tracking-wider font-bold">Выберите друга</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {MOCK_CHILD_CHARACTERS.map(char => (
                        <button
                          key={char.id}
                          onClick={() => { setSelectedCharacter(char); setChildColor({ id: 'custom', name: 'Custom', class: char.colorClass }); }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-500 active:scale-90 ${selectedCharacter.id === char.id ? 'border-orange-400 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-105' : 'border-white/10 hover:bg-white/5 hover:scale-105'}`}
                        >
                          <span className="text-3xl animate-float" style={{ animationDuration: '3s' }}>{char.emoji}</span>
                          <span className="text-[10px] font-medium">{char.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="animate-slide-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
                     <label className="text-sm text-white/60 mb-4 block uppercase tracking-wider font-bold">Или выберите цвет</label>
                     <div className="flex gap-3 flex-wrap">
                        {COLORS.slice(0, 6).map(c => (
                          <button
                            key={c.id}
                            onClick={() => setChildColor(c)}
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.class} transition-all duration-700 hover:scale-110 active:scale-90 ${childColor.id === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110 shadow-lg' : 'opacity-60'}`}
                          />
                        ))}
                     </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="animate-slide-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                    <label className="text-sm text-white/60 mb-4 block uppercase tracking-wider font-bold">Эксклюзив</label>
                    <div className="space-y-4">
                      {MOCK_UNIQUE_DESIGNS.map(design => (
                        <button
                          key={design.id}
                          onClick={() => setSelectedUnique(design)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 active:scale-95 ${selectedUnique.id === design.id ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-white/10 hover:bg-white/5 hover:border-white/30'}`}
                        >
                          <div className={`w-12 h-12 rounded-xl bg-black flex items-center justify-center text-2xl border border-white/20 shadow-inner`}>{design.icon}</div>
                          <div className="text-left">
                            <div className="font-bold text-white">{design.name}</div>
                            <div className={`text-xs ${design.accent} font-medium tracking-wide`}>{design.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <FormSection data={formData} onChange={setFormData} delayStart={700} />

              <div className="mt-4 animate-slide-up opacity-0" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}>
                <button 
                  onClick={() => handleOrder('Детская карта заказана!')}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-700 transform hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
                >
                  <span className="relative z-10">Заказать для гения</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms] ease-in-out"></div>
                </button>
              </div>
            </GlassCard>

          </div>
        </div>
      )}

      {/* --- SUCCESS VIEW --- */}
      {view === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-fade-in p-4" key="success">
          <div className="text-center relative">
            {/* Burst Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur-[80px] opacity-20 animate-pulse-slow"></div>
            
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 mx-auto mb-8 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.6)] animate-scale-in">
               <svg className="w-14 h-14 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M5 13l4 4L19 7" 
                    className="animate-draw"
                 />
               </svg>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white animate-slide-up-fade opacity-0" style={{ animationDelay: '300ms' }}>Успешно!</h2>
            <p className="text-xl md:text-2xl text-white/70 mb-12 animate-slide-up-fade opacity-0" style={{ animationDelay: '500ms' }}>{successMessage}</p>
            
            <button 
              onClick={goHome}
              className="px-14 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-700 shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-slide-up-fade opacity-0"
              style={{ animationDelay: '700ms' }}
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}

      {/* AI Assistant - Always available */}
      <PechaAssistant contextData={`User is currently viewing: ${view}. Available cards: Debit, Credit, Child (Bear, Skunk, Dog, Panther, Eiffel).`} />

    </div>
  );
}

export default App;