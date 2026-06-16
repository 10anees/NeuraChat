'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Sample messages for the Tone Customizer demo
const TONE_SAMPLES = {
  original: "i am writing to tell you that the project is late and we need more time to finish it.",
  direct: "The project timeline has shifted. We require additional time to ensure completion.",
  thoughtful: "To ensure we deliver work we are both proud of, we are taking a few extra days to refine the final details.",
  warm: "Thank you so much for your patience! We're putting the finishing touches on everything and want to take just a bit more time to get it perfect for you.",
};

// Sample messages for translation demo
const TRANSLATION_SAMPLES = [
  { lang: "English", text: "Speak your mind, but keep it kind." },
  { lang: "French", text: "Exprimez votre pensée, mais restez bienveillant." },
  { lang: "Spanish", text: "Di lo que piensas, pero con amabilidad." },
  { lang: "Japanese", text: "心を開いて話しなさい、しかし親切を忘れずに。" },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  
  // Custom states for interactive demos
  const [selectedTone, setSelectedTone] = useState<'original' | 'direct' | 'thoughtful' | 'warm'>('original');
  const [displayText, setDisplayText] = useState(TONE_SAMPLES.original);
  const [isTyping, setIsTyping] = useState(false);
  
  const [currentTransIndex, setCurrentTransIndex] = useState(0);
  const [transText, setTransText] = useState(TRANSLATION_SAMPLES[0].text);
  const [isTranslating, setIsTranslating] = useState(false);

  // Chat simulator state
  const [chatStep, setChatStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([]);

  // Handles redirecting if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Keep user on landing page so they can inspect it, but provide dashboard access.
    }
  }, [isAuthenticated, loading]);

  // Typing effect for Tone Customizer
  useEffect(() => {
    const targetText = TONE_SAMPLES[selectedTone];
    setDisplayText("");
    setIsTyping(true);

    let index = 0;
    const interval = setInterval(() => {
      if (index < targetText.length) {
        setDisplayText((prev) => prev + targetText.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 10); // fast typing cadence

    return () => clearInterval(interval);
  }, [selectedTone]);

  // Rotation effect for Translation demo
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTranslating(true);
      setTimeout(() => {
        const nextIndex = (currentTransIndex + 1) % TRANSLATION_SAMPLES.length;
        setCurrentTransIndex(nextIndex);
        setTransText(TRANSLATION_SAMPLES[nextIndex].text);
        setIsTranslating(false);
      }, 400);
    }, 4500);

    return () => clearInterval(timer);
  }, [currentTransIndex]);

  // Chat simulator progression
  useEffect(() => {
    const chatSequence = [
      { sender: 'user', text: "Can you make this email sound less defensive?", time: "10:02 AM" },
      { sender: 'ai', text: "Of course. Let's shift the focus to what we've resolved instead of what went wrong. How does this feel?", time: "10:03 AM" },
      { sender: 'ai', text: "“Thank you for highlighting this. We've addressed the root cause and are back on track.”", time: "10:03 AM" },
      { sender: 'user', text: "Perfect. Snappy and professional.", time: "10:04 AM" },
    ];

    if (chatStep < chatSequence.length) {
      const delay = chatStep === 0 ? 1500 : chatSequence[chatStep - 1].text.length * 20 + 800;
      const timer = setTimeout(() => {
        setChatMessages((prev) => [...prev, chatSequence[chatStep] as any]);
        setChatStep((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Loop simulator
      const resetTimer = setTimeout(() => {
        setChatMessages([]);
        setChatStep(0);
      }, 6000);
      return () => clearTimeout(resetTimer);
    }
  }, [chatStep]);

  return (
    <div className="min-h-screen bg-[#F5EFEA] text-[#3A2A20] font-sans selection:bg-[#B83E2C] selection:text-white relative">
      
      {/* Navigation */}
      <header className="px-6 py-3 border-b border-[#E0D4C8] sticky top-0 z-40 bg-[#F5EFEA]/90 backdrop-blur-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-serif font-semibold tracking-tight highlight-accent">
              NeuraChat
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider border border-[#B83E2C]/30 text-[#B83E2C] uppercase rounded-full">
              v1.0
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <button
              onClick={() => router.push('/login')}
              className="text-xs font-semibold tracking-tight text-[#6B584A] hover:text-[#3A2A20] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push(isAuthenticated ? '/dashboard' : '/register')}
              className="px-4.5 py-2 text-xs font-semibold tracking-tight text-white bg-[#3A2A20] hover:bg-[#B83E2C] rounded-lg btn-snap shadow-sm"
            >
              {isAuthenticated ? "Enter Dashboard" : "Get Started"}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-4xl mx-auto">
        <div className="text-center animate-fade-up">
          {/* Tagline */}
          <div className="mb-5 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-highlight-accent"></span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#6B584A] font-bold">
              Reimagining Real-Time Connection
            </span>
          </div>
          
          {/* Main Typography Header (Refined proportions, tighter line-height) */}
          <h1 className="text-4xl md:text-6xl lg:text-[4.75rem] font-serif font-light tracking-tight leading-[1.1] text-[#3A2A20] mb-6 max-w-3xl mx-auto">
            We are losing the <br />
            <span className="italic font-medium font-serif pen-underline">voice</span> in our words.
          </h1>

          {/* Body Prose (More readable and elegant layout) */}
          <p className="text-base md:text-lg lg:text-xl font-serif leading-relaxed text-[#6B584A] max-w-xl mx-auto mb-10 font-light">
            Every day, we exchange a thousand messages but say almost nothing. 
            We copy-paste lifeless summaries, hide behind sterile text, and tolerate flat communication. 
            NeuraChat lives inside your conversations, restoring the depth, 
            nuance, and warmth of human expression.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-[#B83E2C] hover:bg-[#962F20] rounded-xl btn-snap shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              Create a Free Account
            </button>
            <button
              onClick={() => {
                const featuresSection = document.getElementById('details');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 text-sm font-semibold text-[#3A2A20] hover:text-[#B83E2C] bg-transparent border border-[#E0D4C8] hover:border-[#B83E2C] rounded-xl btn-snap w-full sm:w-auto"
            >
              Read the Philosophy
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Demo: The Tone Shifter (Refined Grid & Layout) */}
      <section className="px-6 py-16 border-t border-b border-[#E0D4C8] bg-[#E3D5C8]/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Tone Selectors */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#B83E2C] uppercase font-bold block mb-2">
                  Interactive Sandbox
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight text-[#3A2A20] mb-3">
                  Rewrite with intention.
                </h3>
                <p className="text-sm text-[#6B584A] leading-relaxed font-light">
                  Choose a tone to witness how NeuraChat shifts the emphasis of a rushed sentence, adjusting cadence and phrasing to match your exact intent.
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                {[
                  { id: 'original', label: 'Rushed Input' },
                  { id: 'direct', label: 'Direct & Concise' },
                  { id: 'thoughtful', label: 'Thoughtful Prose' },
                  { id: 'warm', label: 'Warm & Appreciative' }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id as any)}
                    className={`text-left px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                      selectedTone === tone.id
                        ? 'bg-[#3A2A20] text-white border-[#3A2A20] translate-x-1'
                        : 'bg-white text-[#6B584A] border-[#E0D4C8] hover:border-[#6B584A] hover:bg-[#F5EFEA]'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Output Area */}
            <div className="lg:col-span-7 bg-[#F5EFEA] rounded-xl border border-[#E0D4C8] p-6.5 shadow-sm min-h-[240px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E0D4C8]"></span>
                <span className="w-2 h-2 rounded-full bg-[#E0D4C8]"></span>
                <span className="w-2 h-2 rounded-full bg-[#E0D4C8]"></span>
              </div>
              
              <div className="my-auto">
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#6B584A] block mb-3">
                  {selectedTone === 'original' ? 'Raw Thought' : 'Refined Output'}
                </span>
                
                <p className={`font-serif leading-relaxed text-[#3A2A20] transition-all duration-300 ${
                  selectedTone === 'original' 
                    ? 'text-base text-[#6B584A] italic' 
                    : selectedTone === 'direct'
                    ? 'text-lg font-medium tracking-tight'
                    : selectedTone === 'thoughtful'
                    ? 'text-xl font-light text-[#3A2A20]'
                    : 'text-lg font-light text-[#8B5E3C]'
                }`}>
                  {displayText}
                  {isTyping && <span className="typing-caret">&nbsp;</span>}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#E0D4C8]/50 flex justify-between items-center text-[10px] text-[#6B584A] font-mono">
                <span>Characters: {displayText.length}</span>
                <span className="highlight-accent font-semibold">Tuned by NeuraChat AI</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Thoughtful Pause (More intimate font sizes and pacing) */}
      <section className="px-6 py-24 md:py-32 max-w-3xl mx-auto text-center">
        <span className="text-[10px] font-mono tracking-widest text-[#6B584A] uppercase block mb-6 font-bold">
          The Cadence of Understanding
        </span>
        <blockquote className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-light leading-tight text-[#3A2A20]">
          “Nuance is not noise. It is where <br />
          <span className="font-semibold italic pen-underline-double">understanding</span> lives.”
        </blockquote>
        <p className="mt-8 text-xs md:text-sm text-[#6B584A] max-w-sm mx-auto font-light leading-relaxed">
          We strip away the generic, automated templates. NeuraChat gives you the quiet authority to communicate exactly what you mean, exactly how it should be felt.
        </p>
      </section>

      {/* Editorial Details & Key Pillars */}
      <section id="details" className="px-6 py-16 border-t border-[#E0D4C8] bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-widest text-[#B83E2C] uppercase font-bold block mb-2">
              Detailed Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-[#3A2A20]">
              Built for deep, articulate conversations.
            </h2>
          </div>

          <div className="space-y-20 md:space-y-28">

            {/* Pillar 1: Intelligent Translation & Tone */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B83E2C] font-bold block mb-2">
                  01 / Adaptive Tone & Translation
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#3A2A20] mb-4">
                  Speak any language, naturally.
                </h3>
                <p className="text-sm text-[#6B584A] leading-relaxed mb-5 font-light">
                  NeuraChat does not do word-for-word translation. It translates cultural context, rhythm, and warmth, so your message resonates on a human level, regardless of geography.
                </p>
                <div className="p-3.5 rounded-lg border border-[#E0D4C8] bg-[#F5EFEA]/30">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B584A] block mb-1.5">
                    Simultaneous Translation:
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-[#3A2A20] text-white">
                      {TRANSLATION_SAMPLES[currentTransIndex].lang}
                    </span>
                    <span className={`text-xs font-serif italic text-[#3A2A20] transition-opacity duration-400 ${isTranslating ? 'opacity-20' : 'opacity-100'}`}>
                      "{transText}"
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#F5EFEA] border border-[#E0D4C8] rounded-xl p-6 flex flex-col justify-center min-h-[240px]">
                <span className="text-[9px] font-mono tracking-wider text-[#6B584A] uppercase block mb-4 border-b border-[#E0D4C8] pb-1.5">
                  Live Translator Log
                </span>
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-[10px] font-semibold uppercase font-mono text-[#8B5E3C]">INPUT (JA):</span>
                    <p className="text-xs font-light text-[#3A2A20] flex-1">本音を語れ、しかし親切であれ。</p>
                  </div>
                  <div className="flex justify-between items-start gap-4 pt-3 border-t border-[#E0D4C8]/50">
                    <span className="text-[10px] font-semibold uppercase font-mono text-[#B83E2C]">TUNED (EN):</span>
                    <p className="text-xs font-serif font-medium text-[#3A2A20] flex-1 italic">"Speak your mind, but keep it kind."</p>
                  </div>
                  <div className="mt-3 p-3 bg-[#E3D5C8]/20 rounded-md text-[11px] text-[#6B584A] font-light leading-relaxed">
                    NeuraChat analyzed the idiomatic depth of the Japanese proverb, preserving the lyrical quality in English.
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 2: Real-time Messaging & Sockets */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="md:order-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B83E2C] font-bold block mb-2">
                  02 / Real-time Messaging
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#3A2A20] mb-4">
                  Conversations that flow in real-time.
                </h3>
                <p className="text-sm text-[#6B584A] leading-relaxed mb-5 font-light">
                  Powered by sub-millisecond WebSockets. Feel the presence of your contacts with precise typing indicators, immediate delivery confirmations, and file attachments that land with a snap.
                </p>
                <ul className="space-y-2 text-xs text-[#6B584A] font-light">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-highlight-accent"></span>
                    Instant messaging with zero lag.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-highlight-accent"></span>
                    Smart typing indicators that mirror realistic pacing.
                  </li>
                </ul>
              </div>
              <div className="md:order-1 bg-[#F5EFEA] border border-[#E0D4C8] rounded-xl p-5 flex flex-col justify-between min-h-[240px]">
                <div className="space-y-3 flex-1 overflow-y-auto">
                  <span className="text-[9px] font-mono tracking-wider text-[#6B584A] uppercase block mb-3 border-b border-[#E0D4C8] pb-1.5">
                    Live Session Feed
                  </span>
                  
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col max-w-[85%] sim-bubble ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <div className={`p-2.5 rounded-lg text-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#3A2A20] text-white rounded-tr-none'
                          : 'bg-[#E3D5C8] text-[#3A2A20] rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-mono text-[#6B584A] mt-0.5">{msg.time}</span>
                    </div>
                  ))}

                  {chatStep < 4 && chatStep % 2 !== 0 && (
                    <div className="flex gap-1 items-center mr-auto mt-1 p-2 bg-[#E3D5C8]/40 rounded-lg rounded-tl-none">
                      <span className="w-1 h-1 rounded-full bg-[#3A2A20] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1 h-1 rounded-full bg-[#3A2A20] animate-bounce" style={{ animationDelay: '120ms' }}></span>
                      <span className="w-1 h-1 rounded-full bg-[#3A2A20] animate-bounce" style={{ animationDelay: '240ms' }}></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pillar 3: Agora HD Video & Audio Calling */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B83E2C] font-bold block mb-2">
                  03 / HD Calling Architecture
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#3A2A20] mb-4">
                  Clear audio, expressive video.
                </h3>
                <p className="text-sm text-[#6B584A] leading-relaxed mb-5 font-light">
                  Seamlessly bridge text chat with crystal-clear audio and video calling powered by Agora RTC. Dynamic ringing sequences and native floating layout controls keep you fully immersed.
                </p>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 border border-[#E0D4C8] rounded-lg p-2.5 bg-[#F5EFEA]/50">
                    <svg className="w-4 h-4 text-[#B83E2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span className="text-[10px] font-mono font-bold text-[#3A2A20]">High fidelity voice</span>
                  </div>
                  <div className="flex items-center gap-2 border border-[#E0D4C8] rounded-lg p-2.5 bg-[#F5EFEA]/50">
                    <svg className="w-4 h-4 text-[#B83E2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-mono font-bold text-[#3A2A20]">Adaptive video</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#F5EFEA] border border-[#E0D4C8] rounded-xl p-6 flex flex-col justify-between min-h-[240px] relative overflow-hidden">
                <span className="text-[9px] font-mono tracking-wider text-[#6B584A] uppercase block mb-3 border-b border-[#E0D4C8] pb-1.5">
                  Call Signaling State
                </span>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[180px] p-3 bg-[#E3D5C8] rounded-xl text-center space-y-3 border border-[#8B5E3C]/20 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-[#B83E2C] text-white flex items-center justify-center mx-auto text-sm font-serif">
                      A
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-[#3A2A20]">Amelia Rose</h4>
                      <p className="text-[8px] font-mono text-[#6B584A]">SIGNALING VIA AGORA CHANNEL...</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-1">
                      <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] shadow-sm">🔇</span>
                      <span className="w-6 h-6 rounded-full bg-[#B83E2C] text-white flex items-center justify-center text-[10px] shadow-sm">📞</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Momentum / Assured Close CTA */}
      <section className="px-6 py-20 md:py-24 max-w-3xl mx-auto text-center border-t border-[#E0D4C8]">
        <span className="text-[10px] font-mono tracking-widest text-[#B83E2C] uppercase font-bold block mb-4">
          Next Step
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-[3.25rem] font-serif font-light tracking-tight leading-tight text-[#3A2A20] mb-6">
          Shall we begin a <br />
          <span className="italic font-medium font-serif pen-underline">better conversation?</span>
        </h2>
        
        <p className="text-sm md:text-base text-[#6B584A] font-serif max-w-md mx-auto mb-8 font-light">
          Set up your workspace in minutes. Connect with your friends, invite your team, and let your AI co-pilot manage the nuance.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => router.push('/register')}
            className="px-6 py-3.5 text-sm font-semibold text-white bg-[#3A2A20] hover:bg-[#B83E2C] rounded-xl btn-snap shadow-md w-full sm:w-auto"
          >
            Create Your Account
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3.5 text-sm font-semibold text-[#3A2A20] hover:text-[#B83E2C] bg-white border border-[#E0D4C8] rounded-xl btn-snap w-full sm:w-auto"
          >
            Sign In to Workspace
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#E0D4C8] bg-[#F5EFEA] text-[10px] text-[#6B584A] text-center font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 NeuraChat. Elegant, deliberate speech.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#3A2A20] cursor-pointer">Philosophy</span>
            <span className="hover:text-[#3A2A20] cursor-pointer">Security</span>
            <span className="hover:text-[#3A2A20] cursor-pointer">Agora RTC</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
