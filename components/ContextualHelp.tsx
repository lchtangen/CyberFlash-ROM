
import React, { useState } from 'react';
import { HelpCircle, Search, Play, Book, X, ChevronDown, ChevronRight, MessageCircle, ExternalLink, GraduationCap } from 'lucide-react';
import { GlassCard } from './GlassCard';

// --- DATA ---

const FAQS = [
  {
    id: 1,
    question: "Device not detected in ADB mode?",
    answer: "Ensure USB Debugging is enabled in Developer Options. Try a different USB 3.0 port or cable. If on Windows, check Device Manager for 'OnePlus Drivers'."
  },
  {
    id: 2,
    question: "Stuck in Bootloop after flashing?",
    answer: "Boot into TWRP Recovery (Vol Down + Power). Go to Wipe > Format Data (type 'yes'). This decrypts the storage required for the new ROM."
  },
  {
    id: 3,
    question: "SHA256 Checksum mismatch?",
    answer: "The downloaded file is corrupt or incomplete. Do not flash it. delete the file and try downloading again from a different mirror."
  },
  {
    id: 4,
    question: "Magisk Root installation failed?",
    answer: "Ensure you are patching the correct 'boot.img' that matches your current firmware version. For Android 12+, use 'Rename apk to zip' method in recovery."
  }
];

const VIDEOS = [
  { id: 1, title: "Unlock Bootloader Guide", duration: "2:45", thumb: "bg-neon-cyan/20" },
  { id: 2, title: "Flash TWRP Recovery", duration: "3:20", thumb: "bg-neon-magenta/20" },
  { id: 3, title: "Sideload crDroid ROM", duration: "5:10", thumb: "bg-neon-lime/20" },
];

// --- COMPONENT ---

export const ContextualHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'faq' | 'video' | 'guide'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const toggleOpen = () => setIsOpen(!isOpen);

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tutorialSteps = [
    { target: "Sidebar", title: "Navigation", desc: "Access different modules like Dashboard, Installer, and Terminal here." },
    { target: "DeviceStatus", title: "Device Link", desc: "Monitor connection status, battery, and mode in real-time." },
    { target: "Dashboard", title: "Risk Analysis", desc: "Check the Success Probability gauge before starting any operation." },
  ];

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        onClick={toggleOpen}
        className={`
          fixed bottom-8 right-8 z-50 p-4 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(0,255,255,0.3)]
          ${isOpen ? 'bg-neon-red rotate-45 hover:bg-neon-red/80' : 'bg-neon-cyan hover:bg-neon-cyan/80 animate-pulse-slow'}
        `}
      >
        {isOpen ? <X className="text-deep font-bold" size={28} /> : <HelpCircle className="text-deep font-bold" size={28} />}
      </button>

      {/* Main Help Panel */}
      <div className={`
        fixed bottom-28 right-8 z-40 w-96 max-h-[600px] glass-floating flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
      `}>
        
        {/* Header */}
        <div className="p-6 bg-deep/50 border-b border-white/5 backdrop-blur-xl">
          <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
            <GraduationCap className="text-neon-cyan" />
            ASSISTANT <span className="text-neon-cyan text-glow">AI</span>
          </h2>
          <p className="text-[10px] text-text-comment font-mono uppercase mt-1">Context-aware troubleshooting</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-white/5">
          <button 
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'faq' ? 'text-neon-cyan bg-white/5' : 'text-text-secondary hover:text-white'}`}
          >
            FAQ
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'video' ? 'text-neon-magenta bg-white/5' : 'text-text-secondary hover:text-white'}`}
          >
            Videos
          </button>
          <button 
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'guide' ? 'text-neon-lime bg-white/5' : 'text-text-secondary hover:text-white'}`}
          >
            Guide
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-deep/80 backdrop-blur-md">
          
          {/* FAQ TAB */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-text-comment" size={16} />
                <input 
                  type="text" 
                  placeholder="Search issues..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-neon-cyan/50 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="border border-white/5 rounded-xl bg-white/5 overflow-hidden">
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="font-bold text-sm text-white/90">{faq.question}</span>
                      {expandedFaq === faq.id ? <ChevronDown size={16} className="text-neon-cyan" /> : <ChevronRight size={16} className="text-text-comment" />}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="p-4 pt-0 text-xs text-text-secondary leading-relaxed border-t border-white/5 bg-black/20">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8 text-text-comment text-xs">No results found.</div>
                )}
              </div>
            </div>
          )}

          {/* VIDEO TAB */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              {VIDEOS.map(video => (
                <div key={video.id} className="group relative overflow-hidden rounded-xl border border-white/10 cursor-pointer hover:border-neon-magenta/50 transition-all">
                  <div className={`h-32 w-full ${video.thumb} flex items-center justify-center`}>
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                      <Play size={20} className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="p-3 bg-deep">
                    <h4 className="font-bold text-sm text-white group-hover:text-neon-magenta transition-colors">{video.title}</h4>
                    <span className="text-[10px] text-text-comment font-mono">{video.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GUIDE TAB */}
          {activeTab === 'guide' && (
            <div className="space-y-6 text-center">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-neon-lime/10 to-transparent border border-neon-lime/30">
                <Book size={32} className="mx-auto text-neon-lime mb-3" />
                <h3 className="text-lg font-black text-white">INTERACTIVE TOUR</h3>
                <p className="text-xs text-text-secondary mt-2 mb-4">
                  Let the AI guide you through the interface elements and safety protocols.
                </p>
                <button 
                  onClick={() => setShowTutorial(true)}
                  className="px-6 py-2 bg-neon-lime text-deep font-bold rounded-lg uppercase tracking-wider text-xs hover:bg-white transition-colors"
                >
                  Start Tour
                </button>
              </div>

              <div className="space-y-2">
                 <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-text-secondary hover:text-neon-cyan transition-colors text-xs font-bold uppercase tracking-wide">
                   <ExternalLink size={16} /> Official XDA Thread
                 </a>
                 <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-text-secondary hover:text-neon-cyan transition-colors text-xs font-bold uppercase tracking-wide">
                   <MessageCircle size={16} /> Discord Community
                 </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="max-w-md w-full glass-floating p-8 border-neon-lime/50 shadow-[0_0_50px_rgba(0,255,65,0.2)] animate-[scaleNeon_0.3s_ease-out]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-neon-lime/20 flex items-center justify-center text-neon-lime font-black border border-neon-lime/50">
                {tutorialStep + 1}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{tutorialSteps[tutorialStep].title}</h3>
                <p className="text-xs text-neon-lime font-mono uppercase">Step {tutorialStep + 1} of {tutorialSteps.length}</p>
              </div>
            </div>
            
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              {tutorialSteps[tutorialStep].desc}
            </p>

            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowTutorial(false)}
                className="text-xs font-bold text-text-comment hover:text-white uppercase tracking-wider"
              >
                Skip Tour
              </button>
              <button 
                onClick={nextTutorialStep}
                className="px-6 py-3 bg-neon-lime text-deep font-black rounded-xl hover:bg-white transition-colors uppercase tracking-widest text-xs flex items-center gap-2"
              >
                {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
