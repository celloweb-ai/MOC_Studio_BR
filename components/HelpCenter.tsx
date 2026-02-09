
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { geminiService } from '../services/geminiService';
// Added Bot icon to imports
import { 
  Search, Book, FileText, Shield, LifeBuoy, ChevronRight, 
  ExternalLink, Scale, HelpCircle, FileSearch, Globe, 
  Sparkles, Loader2, ChevronDown, ChevronUp, Cpu, 
  Info, Database, Settings, Settings2, Layout, ListChecks, ShieldCheck,
  BookOpen, Video, Award, Milestone, CheckCircle2, ShieldAlert, X, 
  Edit3, Save, Link as LinkIcon, ArrowRight, BookMarked, Fingerprint, Terminal,
  ClipboardCheck, HardDrive, ScrollText, Copy, Check, Clock, Plus, Trash2,
  Activity, Zap, BarChart3, Ruler, Boxes, Play, PlayCircle, MonitorPlay,
  Layers, Navigation, MoveRight, Share2, Globe2, Bot
} from 'lucide-react';
import { RegulatoryStandard, UsefulLink } from '../types';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  level: 'Basic' | 'Advanced' | 'Expert';
  readTime: string;
}

const KNOWLEDGE_BASE: Article[] = [
  { id: '1', category: 'Basics', title: 'Fundamentals of MOC Lifecycle', level: 'Basic', readTime: '5 min', content: 'The Management of Change (MOC) process is a systematic approach to technical changes in complex industrial environments.' },
  { id: '2', category: 'Basics', title: 'Navigating the Digital Twin', level: 'Basic', readTime: '3 min', content: 'Learn how to interpret real-time telemetry and parametric streams from facility assets using the MOC Studio interface.' },
  { id: '3', category: 'Risk', title: 'Quantitative Risk Assessment Methodology', level: 'Advanced', readTime: '8 min', content: 'MOC Studio uses a 5x5 Probability vs Severity matrix to calculate composite risk scores for every technical submission.' },
  { id: '4', category: 'Governance', title: 'Role-Based Access Control (RBAC)', level: 'Advanced', readTime: '4 min', content: 'Understanding the hierarchy of sign-off authority between Engineers, Managers, and Auditors for industrial compliance.' },
  { id: '5', category: 'Safety', title: 'Emergency Bypass Protocols', level: 'Expert', readTime: '10 min', content: 'Procedures for initiating immediate changes during critical failures or safety upsets without standard review delays.' },
];

const ICON_OPTIONS = [
  { name: 'Layout', component: <Layout size={16} /> },
  { name: 'Database', component: <Database size={16} /> },
  { name: 'ScrollText', component: <ScrollText size={16} /> },
  { name: 'Fingerprint', component: <Fingerprint size={16} /> },
  { name: 'Globe', component: <Globe size={16} /> },
  { name: 'Settings', component: <Settings size={16} /> },
  { name: 'Activity', component: <Activity size={16} /> },
  { name: 'Zap', component: <Zap size={16} /> },
  { name: 'BarChart3', component: <BarChart3 size={16} /> },
  { name: 'Shield', component: <Shield size={16} /> },
  { name: 'Boxes', component: <Boxes size={16} /> },
  { name: 'Terminal', component: <Terminal size={16} /> },
  { name: 'Link', component: <LinkIcon size={16} /> }
];

const getIconByName = (name: string) => {
  const icon = ICON_OPTIONS.find(i => i.name === name);
  return icon ? icon.component : <LinkIcon size={16} />;
};

const HelpCenter: React.FC = () => {
  const { language, startEmergencyMOC, addNotification, standards, saveStandard, deleteStandard, usefulLinks, saveUsefulLink, deleteUsefulLink, user } = useApp();
  const t = TRANSLATIONS[language];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'docs' | 'methodology' | 'standards' | 'workflow' | 'tutorials' | 'links'>('docs');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copied, setCopied] = useState(false);

  // Permission check for link management
  const canManageLinks = user?.role === 'Manager' || user?.role === 'Auditor';

  // Standards Edit Modal State
  const [isStandardModalOpen, setIsStandardModalOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Partial<RegulatoryStandard> | null>(null);
  const [isSavingStandard, setIsSavingStandard] = useState(false);

  // Useful Links Edit Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Partial<UsefulLink> | null>(null);
  const [isSavingLink, setIsSavingLink] = useState(false);

  // Instant filtering logic
  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) return KNOWLEDGE_BASE;
    const lowerQuery = searchTerm.toLowerCase();
    return KNOWLEDGE_BASE.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) || 
      article.content.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery)
    );
  }, [searchTerm]);

  const filteredStandards = useMemo(() => {
    if (!searchTerm.trim()) return standards;
    const lowerQuery = searchTerm.toLowerCase();
    return standards.filter(s => 
      s.code.toLowerCase().includes(lowerQuery) || 
      s.title.toLowerCase().includes(lowerQuery) || 
      s.desc.toLowerCase().includes(lowerQuery)
    );
  }, [searchTerm, standards]);

  const filteredLinks = useMemo(() => {
    if (!searchTerm.trim()) return usefulLinks;
    const lowerQuery = searchTerm.toLowerCase();
    return usefulLinks.filter(l => 
      l.label.toLowerCase().includes(lowerQuery) || 
      l.url.toLowerCase().includes(lowerQuery)
    );
  }, [searchTerm, usefulLinks]);

  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const context = `Industrial Help Center Context: Searching for documentation or technical advice on "${searchTerm}". User is an engineer at MOC Studio.`;
      const response = await geminiService.getTechnicalAdvice(searchTerm, context);
      setAiResponse(response);
    } catch (error) {
      setAiResponse("Unable to connect to the technical intelligence module. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyAi = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addNotification({ title: 'Copied to Clipboard', message: 'Technical advice stored in buffer.', type: 'info' });
    }
  };

  const handleOpenStandardModal = (s?: RegulatoryStandard) => {
    if (s) {
      setEditingStandard({ ...s });
    } else {
      setEditingStandard({
        id: `S${Date.now()}`,
        code: '',
        title: '',
        status: 'Active',
        desc: ''
      });
    }
    setIsStandardModalOpen(true);
  };

  const handleSaveStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStandard?.code || !editingStandard?.title) return;
    
    setIsSavingStandard(true);
    try {
      await saveStandard(editingStandard as RegulatoryStandard);
      setIsStandardModalOpen(false);
      addNotification({ 
        title: language === 'pt-BR' ? 'Norma Atualizada' : 'Standard Synchronized', 
        message: `The regulatory record for ${editingStandard.code} has been updated.`, 
        type: 'success' 
      });
    } finally {
      setIsSavingStandard(false);
    }
  };

  const handleDeleteStandard = async (id: string) => {
    await deleteStandard(id);
    addNotification({ 
      title: language === 'pt-BR' ? 'Norma Removida' : 'Standard Purged', 
      message: 'The standard has been removed from the registry.', 
      type: 'warning' 
    });
  };

  // Link Management Handlers
  const handleOpenLinkModal = (l?: UsefulLink) => {
    if (l) {
      setEditingLink({ ...l });
    } else {
      setEditingLink({
        id: `L${Date.now()}`,
        label: '',
        url: '',
        icon: 'Link'
      });
    }
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink?.label || !editingLink?.url) return;
    
    setIsSavingLink(true);
    try {
      await saveUsefulLink(editingLink as UsefulLink);
      setIsLinkModalOpen(false);
      addNotification({ 
        title: language === 'pt-BR' ? 'Link Atualizado' : 'Operational Link Updated', 
        message: `Shortcut to ${editingLink.label} has been synchronized.`, 
        type: 'success' 
      });
    } finally {
      setIsSavingLink(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    await deleteUsefulLink(id);
    addNotification({ 
      title: language === 'pt-BR' ? 'Link Removido' : 'Link Purged', 
      message: 'Navigation shortcut removed from operational dashboard.', 
      type: 'warning' 
    });
  };

  const workflowSteps = useMemo(() => [
    { step: '01', title: language === 'pt-BR' ? 'Iniciação' : 'Initiation', desc: language === 'pt-BR' ? 'Definição do escopo e justificativa técnica conforme API RP 754.' : 'Define change scope and technical boundaries as per API RP 754.' },
    { step: '02', title: language === 'pt-BR' ? 'Avaliação' : 'Evaluation', desc: language === 'pt-BR' ? 'Análise multidisciplinar de riscos (HAZOP/LOPA) e revisão técnica.' : 'Multidisciplinary risk assessment (HAZOP/LOPA) and technical review.' },
    { step: '03', title: language === 'pt-BR' ? 'Aprovação' : 'Approval', desc: language === 'pt-BR' ? 'Assinatura dos gestores técnicos e SMS autorizados via protocolo seguro.' : 'Sign-off by authorized technical and HSE managers via secure protocol.' },
    { step: '04', title: language === 'pt-BR' ? 'Implementação' : 'Implementation', desc: language === 'pt-BR' ? 'Execução física da mudança, treinamento e atualização de P&IDs.' : 'Physical execution, operational training, and P&ID redlining.' },
    { step: '05', title: language === 'pt-BR' ? 'Validação' : 'Validation', desc: language === 'pt-BR' ? 'PSSR (Pre-Startup Safety Review) e verificação de encerramento.' : 'PSSR (Pre-Startup Safety Review) and close-out verification.' },
  ], [language]);

  const videoTutorials = useMemo(() => [
    { id: 'v1', title: language === 'pt-BR' ? 'Introdução ao MOC Studio' : 'Introduction to MOC Studio', duration: '12:45', category: 'Training', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400' },
    { id: 'v2', title: language === 'pt-BR' ? 'Análise de Risco Quantitativa' : 'Quantitative Risk Analysis', duration: '15:20', category: 'Advanced', thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400' },
    { id: 'v3', title: language === 'pt-BR' ? 'Navegação em Gêmeos Digitais' : 'Digital Twin Navigation', duration: '08:30', category: 'Operational', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400' },
    { id: 'v4', title: language === 'pt-BR' ? 'Protocolos de Emergência' : 'Emergency Protocols', duration: '05:15', category: 'Safety', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400' },
  ], [language]);

  const helpTabs = useMemo(() => [
    { id: 'docs', label: t.knowledgeBase, icon: <BookMarked size={18} /> },
    { id: 'methodology', label: t.methodology, icon: <Scale size={18} /> },
    { id: 'standards', label: t.standards, icon: <Globe size={18} /> },
    { id: 'workflow', label: t.workflow, icon: <Milestone size={18} /> },
    { id: 'tutorials', label: t.tutorials, icon: <Video size={18} /> },
    { id: 'links', label: language === 'pt-BR' ? 'Links Úteis' : 'Useful Links', icon: <Globe2 size={18} /> }
  ], [t, language]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      {/* Hero Section */}
      <header className="relative p-12 lg:p-20 rounded-[4rem] overflow-hidden group border border-black/5 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/60 shadow-2xl transition-colors duration-500">
        <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000 dark:text-white text-slate-900">
           <Terminal size={300} />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <Sparkles size={14} className="animate-pulse" /> 
            {language === 'pt-BR' ? 'Nexo de Conhecimento IA' : 'AI Knowledge Nexus'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none max-w-4xl">
            {language === 'pt-BR' ? 'Central de Inteligência MOC' : 'MOC Intelligence Hub'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl leading-relaxed uppercase tracking-tight opacity-70">
            {language === 'pt-BR' ? 'Documentação técnica, normas regulatórias e suporte de engenharia alimentado por Gemini.' : 'Technical documentation, regulatory standards, and Gemini-powered engineering support.'}
          </p>
          
          <form onSubmit={handleAiSearch} className="relative mt-4 w-full max-w-3xl group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder={language === 'pt-BR' ? 'O que você deseja consultar hoje?' : 'Search for articles, standards, or AI advice...'} 
              className="w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-[3rem] py-8 pl-20 pr-32 text-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xl" 
            />
            <button 
              type="submit"
              disabled={isAiLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>{isAiLoading ? 'Analyzing...' : 'Ask AI'}</span>
            </button>
          </form>
        </div>
      </header>

      {/* REORGANIZED NAVIGATION BAR - Corrected for theme and clarity */}
      <div className="flex justify-center py-4 px-4 sticky top-0 z-40 bg-transparent">
        <div className="inline-flex p-1.5 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3.5rem] border border-slate-200 dark:border-white/10 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
          {helpTabs.map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => { 
                setActiveTab(tab.id as any); 
                setSelectedArticle(null); 
                setAiResponse(null);
              }} 
              className={`relative px-8 py-5 rounded-[3rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-300 shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-xl scale-105 z-10' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 active:scale-95'
              }`}
            >
              {tab.icon} 
              <span className="hidden md:inline">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* AI Response Display */}
      {aiResponse && (
        <div className="animate-in slide-in-from-top-4 duration-500">
           <div className="glass-panel p-12 rounded-[3.5rem] border-blue-500/30 bg-blue-500/5 relative group/ai overflow-hidden">
              <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none rotate-12">
                 <Bot size={200} className="text-blue-500" />
              </div>
              <div className="absolute -top-4 left-12 px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                 <Cpu size={14} /> AI Technical Grade Advice
              </div>
              <button 
                onClick={() => setAiResponse(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="prose prose-invert max-w-none relative z-10">
                 <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed italic font-medium">
                   {aiResponse}
                 </p>
              </div>
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/10 flex justify-between items-center relative z-10">
                 <div className="flex gap-4">
                    <span className="px-4 py-1.5 bg-slate-200/50 dark:bg-white/5 rounded-lg text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/10">Confidence: 98.4%</span>
                    <span className="px-4 py-1.5 bg-slate-200/50 dark:bg-white/5 rounded-lg text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/10">Standard: API compliant</span>
                 </div>
                 <button 
                  onClick={handleCopyAi}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 shadow-sm"
                 >
                   {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                   {copied ? 'Copied' : 'Copy Advice'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {activeTab === 'docs' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {selectedArticle ? (
                <div className="glass-panel p-12 rounded-[3.5rem] border-slate-200 dark:border-white/10 animate-in slide-in-from-right-4">
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-black text-[10px] uppercase tracking-widest mb-10 hover:translate-x-[-4px] transition-transform"
                  >
                    <ChevronRight size={16} className="rotate-180" /> {language === 'pt-BR' ? 'Voltar para Lista' : 'Back to Articles'}
                  </button>
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{selectedArticle.category}</span>
                        <div className="flex gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                           <span className="flex items-center gap-1"><Book size={14} /> {selectedArticle.level}</span>
                           <span className="flex items-center gap-1"><Clock size={14} /> {selectedArticle.readTime} Read</span>
                        </div>
                     </div>
                     <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{selectedArticle.title}</h2>
                     <div className="p-10 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 leading-relaxed text-lg shadow-inner">
                        {selectedArticle.content}
                        <p className="mt-6">The technical scope defined within this module adheres to standardized O&G engineering practices. All data processed is categorized based on the criticality of the change request. MOC Studio ensures that every documentation piece is linked back to the master governance registry.</p>
                        <p className="mt-4 font-black text-blue-600 dark:text-blue-400 uppercase text-xs tracking-widest border-t border-slate-200 dark:border-white/5 pt-6 flex items-center gap-2"><CheckCircle2 size={16} /> Technical Review Verified v2.1</p>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                    <div 
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="glass-panel p-8 rounded-[3rem] border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <span className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            {article.category}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-tight mb-4">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                          {article.content}
                        </p>
                      </div>
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{article.level} Grade</span>
                         <ArrowRight size={18} className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30 grayscale">
                      <FileSearch size={64} className="mb-4 text-slate-400" />
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No matching documents</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'methodology' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-500">
               <div className="glass-panel p-12 rounded-[4rem] border-slate-200 dark:border-white/10">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-4">
                    <Scale size={28} className="text-blue-600 dark:text-blue-500" /> {language === 'pt-BR' ? 'O Framework de Risco MOC Studio' : 'The MOC Studio Risk Framework'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                     <div className="space-y-6">
                        <h4 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Composite Scoring ($P \times S$)</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                          Our proprietary risk calculation engine follows the multiplication principle of Probability and Severity. Every technical change is evaluated against operational, safety, and environmental impacts.
                        </p>
                        <ul className="space-y-4">
                           <li className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-600 flex items-center justify-center shrink-0 font-black text-xs">15+</div>
                              <div>
                                 <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Extreme Threshold</span>
                                 <span className="text-[11px] text-slate-500">Requires HSE Director and Technical Manager dual sign-off.</span>
                              </div>
                           </li>
                           <li className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-600 flex items-center justify-center shrink-0 font-black text-xs">8-14</div>
                              <div>
                                 <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">High Risk Grade</span>
                                 <span className="text-[11px] text-slate-500">Requires formal peer review and department head approval.</span>
                              </div>
                           </li>
                        </ul>
                     </div>
                     <div className="bg-slate-100 dark:bg-slate-950/50 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center space-y-6">
                        <div className="text-center">
                           <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-2">Governance Reliability</div>
                           <div className="text-5xl font-black text-slate-900 dark:text-white">99.9%</div>
                        </div>
                        <div className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 w-[99.9%]"></div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">Algorithm compliant with ISO 31000 standards.</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'standards' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-end">
                  <button 
                    onClick={() => handleOpenStandardModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                  >
                    <Plus size={16} /> {language === 'pt-BR' ? 'Nova Norma' : 'Provision New Standard'}
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredStandards.length > 0 ? filteredStandards.map((s, idx) => (
                    <div key={idx} className="glass-panel p-8 rounded-[3rem] border-slate-200 dark:border-white/5 group hover:border-emerald-500/30 transition-all relative">
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                             <ClipboardCheck size={20} />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">{s.status}</span>
                            <button 
                              onClick={() => handleOpenStandardModal(s)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-white transition-all"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteStandard(s.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                       </div>
                       <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{s.code}</h3>
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">{s.title}</h4>
                       <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                         {s.desc}
                       </p>
                       <button className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:translate-x-2 transition-all">
                          Read Standard <ExternalLink size={14} />
                       </button>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30 grayscale">
                      <Globe size={64} className="mb-4 text-slate-400" />
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No matching standards</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'workflow' && (
             <div className="glass-panel p-12 rounded-[4rem] border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden animate-in slide-in-from-bottom-8">
                <div className="absolute top-0 right-0 p-20 opacity-5 -rotate-12 dark:text-emerald-500 text-emerald-900">
                   <Milestone size={300} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-12 flex items-center gap-4 relative z-10">
                   <Milestone size={32} className="text-emerald-600 dark:text-emerald-500" /> 
                   {language === 'pt-BR' ? 'Ciclo de Vida MOC Studio' : 'MOC Lifecycle Blueprint'}
                </h3>
                <div className="relative pl-14 space-y-10 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[3px] before:bg-gradient-to-b before:from-emerald-500 before:to-emerald-500/5 relative z-10">
                  {workflowSteps.map(s => (
                    <div key={s.step} className="relative group animate-in slide-in-from-left-6" style={{ animationDelay: `${parseInt(s.step) * 150}ms` }}>
                       <div className="absolute -left-[54px] top-0 w-10 h-10 rounded-2xl bg-white dark:bg-slate-950 border-4 border-emerald-500 flex items-center justify-center z-10 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all">
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500">{s.step}</span>
                       </div>
                       <div className="bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:border-emerald-500/30 p-6 rounded-[2rem] transition-all">
                          <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
                            {s.title}
                            <span className="text-[8px] font-black bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity">VERIFIED STAGE</span>
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium max-w-xl">{s.desc}</p>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-6 relative z-10">
                   <button className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95 group/btn">
                      <ScrollText size={18} className="group-hover/btn:scale-110 transition-transform" /> Download Governance SOP
                   </button>
                   <button onClick={() => setActiveTab('tutorials')} className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-white/10 text-emerald-600 dark:text-emerald-500 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-emerald-600/20 dark:border-emerald-500/20 transition-all active:scale-95">
                      <PlayCircle size={18} /> Watch Masterclass
                   </button>
                </div>
             </div>
          )}

          {activeTab === 'tutorials' && (
             <div className="space-y-8 animate-in fade-in duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {videoTutorials.map((v) => (
                      <div key={v.id} className="glass-panel p-0 rounded-[3rem] overflow-hidden border-slate-200 dark:border-white/5 group hover:border-blue-500/40 transition-all shadow-xl">
                         <div className="aspect-video relative flex items-center justify-center overflow-hidden">
                            <img src={v.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" alt={v.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 to-transparent opacity-80"></div>
                            
                            <div className="relative z-10 flex flex-col items-center">
                               <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                                  <Play fill="currentColor" size={24} className="translate-x-0.5" />
                               </div>
                               <span className="mt-4 text-[9px] font-black text-blue-600 dark:text-white uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">Engage Player</span>
                            </div>

                            <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-lg text-[10px] font-black text-slate-900 dark:text-white font-mono border border-slate-200 dark:border-white/10">
                               {v.duration}
                            </div>
                            <div className="absolute top-4 left-4">
                               <span className="px-3 py-1 bg-blue-600 rounded-lg text-[8px] font-black text-white uppercase tracking-widest shadow-lg">New Lesson</span>
                            </div>
                         </div>
                         <div className="p-8 bg-white dark:bg-slate-900/50">
                            <div className="flex justify-between items-center mb-3">
                               <span className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em]">{v.category}</span>
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {language === 'pt-BR' ? 'Adicionado recentemente' : 'Added 2d ago'}</span>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{v.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2 mb-6">
                               Industrial-grade training module focused on {v.title.toLowerCase()} and compliance within the MOC Studio ecosystem.
                            </p>
                            <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                               Begin Module <MoveRight size={14} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="glass-panel p-10 rounded-[4rem] bg-blue-600/5 border-blue-500/20 text-center space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                   <Award size={48} className="mx-auto text-blue-600 dark:text-blue-500 mb-2" />
                   <div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{language === 'pt-BR' ? 'Certificação de Treinamento' : 'Technical Clearance Certificate'}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                         Engineers must complete all 4 foundational training modules to maintain high-integrity system clearance. Your training progress is linked to your Industrial UID for auditing.
                      </p>
                   </div>
                   <div className="flex justify-center items-center gap-10 py-6">
                      <div className="text-center">
                         <div className="text-3xl font-black text-slate-900 dark:text-white">75%</div>
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progress</div>
                      </div>
                      <div className="h-10 w-px bg-slate-200 dark:bg-white/10"></div>
                      <div className="text-center">
                         <div className="text-3xl font-black text-slate-900 dark:text-white">3/4</div>
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Modules</div>
                      </div>
                   </div>
                   <button className="inline-flex items-center gap-3 px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95 group/btn">
                      Resume Training <Navigation size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                   </button>
                </div>
             </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-8 animate-in fade-in duration-700">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-4">
                    <Globe2 size={28} className="text-emerald-600 dark:text-emerald-500" /> {language === 'pt-BR' ? 'Diretório de Links Úteis' : 'Useful Links Directory'}
                  </h3>
                  {canManageLinks && (
                    <button 
                      onClick={() => handleOpenLinkModal()}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                      <Plus size={16} /> {language === 'pt-BR' ? 'Provisionar Link' : 'Provision New Link'}
                    </button>
                  )}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLinks.length > 0 ? filteredLinks.map((link) => (
                    <div key={link.id} className="glass-panel p-8 rounded-[3rem] border-slate-200 dark:border-white/5 group hover:border-emerald-500/30 transition-all relative flex flex-col justify-between h-full bg-white dark:bg-slate-900/40">
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                             {getIconByName(link.icon)}
                          </div>
                          {canManageLinks && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                onClick={() => handleOpenLinkModal(link)}
                                className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-blue-600/10 dark:hover:bg-blue-500/20 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all"
                               >
                                 <Edit3 size={14} />
                               </button>
                               <button 
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 dark:hover:bg-red-500/20 text-slate-400 dark:text-slate-500 hover:text-red-500 rounded-xl transition-all"
                               >
                                 <Trash2 size={14} />
                               </button>
                            </div>
                          )}
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{link.label}</h4>
                          <p className="text-[10px] text-slate-400 font-mono truncate mb-8 opacity-60">{link.url}</p>
                       </div>
                       <button 
                        onClick={() => window.open(link.url, '_blank')}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-white/5 hover:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/5 group/btn"
                       >
                          Open Resource <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                       </button>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30 grayscale border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]">
                      <Globe size={64} className="mb-4 text-slate-400" />
                      <p className="text-xs font-black uppercase tracking-widest">No links provisioned in directory</p>
                    </div>
                  )}
               </div>

               {!canManageLinks && (
                 <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] flex items-center gap-6">
                    <Info size={24} className="text-blue-600 dark:text-blue-500" />
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight leading-relaxed">
                      Administrative Registry: Only authorized personnel (Managers/Auditors) can modify the global link directory. If a resource is missing, contact your department head.
                    </p>
                 </div>
               )}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-10 rounded-[3.5rem] bg-rose-600/10 border-rose-500/20 group hover:border-rose-500/40 transition-all shadow-xl">
            <div className="w-16 h-16 bg-rose-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-600/20 mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all">
               <ShieldAlert size={32} />
            </div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">{t.emergencyProtocol}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-10 font-medium tracking-tight">
              {language === 'pt-BR' ? 'Protocolos de desvio acelerados para situações de risco crítico imediato. Ignore as filas de revisão padrão com supervisão de auditoria.' : 'Accelerated bypass protocols for immediate critical risk situations. Bypass standard review queues with audit oversight.'}
            </p>
            <button 
              onClick={startEmergencyMOC} 
              className="w-full bg-rose-600 hover:bg-rose-500 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Terminal size={18} />
              {t.initiateBypass}
            </button>
          </div>

          <div className="glass-panel p-10 rounded-[3.5rem] border-slate-200 dark:border-white/5 space-y-8 shadow-xl">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
                    <span className="w-8 h-px bg-slate-200 dark:bg-white/10"></span> Useful Links
                </h4>
                {canManageLinks && (
                  <button 
                    onClick={() => handleOpenLinkModal()}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-1"
                    title="Manage Navigation Shortcuts"
                  >
                    <Settings2 size={14} /> <span className="text-[9px] font-black uppercase">Manage</span>
                  </button>
                )}
             </div>
             <div className="space-y-4">
                {usefulLinks.length > 0 ? usefulLinks.slice(0, 5).map((link) => (
                  <div key={link.id} className="relative group">
                    <button 
                      onClick={() => window.open(link.url, '_blank')}
                      className="w-full flex items-center justify-between p-5 bg-white dark:bg-white/5 hover:bg-blue-600/10 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all group/btn"
                    >
                      <span className="flex items-center gap-4 text-xs font-black text-slate-500 dark:text-slate-400 group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400 uppercase tracking-widest">
                        {getIconByName(link.icon)} {link.label}
                      </span>
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400 transition-all group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                )) : (
                  <div className="py-10 text-center opacity-20 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                    <LinkIcon size={32} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">No shortcuts provisioned</p>
                  </div>
                )}
             </div>
             {usefulLinks.length > 0 && (
               <button 
                onClick={() => setActiveTab('links')}
                className="w-full text-center text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
               >
                 View All Resources
               </button>
             )}
          </div>
        </div>
      </div>

      {/* Standard Modal */}
      {isStandardModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsStandardModalOpen(false)}></div>
          <div className="glass-panel w-full max-w-2xl rounded-[3.5rem] overflow-hidden flex flex-col relative z-10 shadow-2xl border-slate-200 dark:border-white/10">
             <header className="px-10 py-8 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-blue-600/5">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl">
                      <Globe size={28} />
                   </div>
                   <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {editingStandard?.id ? 'Modify Standard Record' : 'Provision New Standard'}
                    </h3>
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mt-1">Regulatory Governance Archive</p>
                  </div>
                </div>
                <button onClick={() => setIsStandardModalOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={28} /></button>
             </header>

             <form onSubmit={handleSaveStandard} className="p-12 space-y-8 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Standard Code</label>
                      <input 
                        required
                        value={editingStandard?.code}
                        onChange={(e) => setEditingStandard({...editingStandard, code: e.target.value.toUpperCase()})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase"
                        placeholder="e.g. API 521"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Classification</label>
                      <select 
                        value={editingStandard?.status}
                        onChange={(e) => setEditingStandard({...editingStandard, status: e.target.value as any})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 dark:text-white outline-none cursor-pointer"
                      >
                         <option value="Active">Active</option>
                         <option value="Compliance">Compliance</option>
                         <option value="Technical">Technical</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Standard Nomenclature</label>
                   <input 
                     required
                     value={editingStandard?.title}
                     onChange={(e) => setEditingStandard({...editingStandard, title: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                     placeholder="e.g. Pressure-relieving Systems"
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Technical Abstract</label>
                   <textarea 
                     required
                     rows={4}
                     value={editingStandard?.desc}
                     onChange={(e) => setEditingStandard({...editingStandard, desc: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                     placeholder="Detailed description of the standard scope and applicability..."
                   />
                </div>

                <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex items-center gap-4">
                   <Info size={24} className="text-blue-600 dark:text-blue-500 shrink-0" />
                   <p className="text-[10px] text-slate-500 dark:text-slate-300 font-medium leading-relaxed uppercase tracking-tight">
                     This standard will be accessible to all facility engineers through the Digital Twin and MOC Lifecycle search engines.
                   </p>
                </div>
                
                <footer className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-6">
                  <button 
                    type="button" 
                    onClick={() => setIsStandardModalOpen(false)} 
                    className="px-8 py-4 rounded-2xl font-black text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-[11px] uppercase tracking-widest"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    disabled={isSavingStandard}
                    className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl transition-all active:scale-95"
                  >
                    {isSavingStandard ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingStandard?.id ? 'Commit Update' : 'Synchronize Standard'}
                  </button>
                </footer>
             </form>
          </div>
        </div>
      )}

      {/* Useful Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsLinkModalOpen(false)}></div>
          <div className="glass-panel w-full max-w-2xl rounded-[3.5rem] overflow-hidden flex flex-col relative z-10 shadow-2xl border-slate-200 dark:border-white/10">
             <header className="px-10 py-8 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-emerald-600/5">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl">
                      <LinkIcon size={28} />
                   </div>
                   <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {editingLink?.id ? 'Update Shortcut' : 'Provision Shortcut'}
                    </h3>
                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mt-1">Operational Navigation Registry</p>
                  </div>
                </div>
                <button onClick={() => setIsLinkModalOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={28} /></button>
             </header>

             <form onSubmit={handleSaveLink} className="p-12 space-y-8 bg-white dark:bg-slate-900">
                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Shortcut Label</label>
                   <input 
                     required
                     value={editingLink?.label}
                     onChange={(e) => setEditingLink({...editingLink, label: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                     placeholder="e.g. Flare Diagnostics"
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Destination URL</label>
                   <input 
                     required
                     value={editingLink?.url}
                     onChange={(e) => setEditingLink({...editingLink, url: e.target.value})}
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                     placeholder="https://..."
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Visual Identity (Icon)</label>
                   <div className="grid grid-cols-6 gap-3 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/5">
                      {ICON_OPTIONS.map((opt) => (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => setEditingLink({...editingLink, icon: opt.name})}
                          className={`p-4 rounded-xl flex items-center justify-center transition-all ${
                            editingLink?.icon === opt.name 
                              ? 'bg-emerald-600 text-white shadow-lg' 
                              : 'bg-white/5 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-white/10 border border-slate-100 dark:border-white/5'
                          }`}
                          title={opt.name}
                        >
                          {opt.component}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-[2rem] flex items-center gap-4">
                   <Info size={24} className="text-emerald-600 dark:text-emerald-500 shrink-0" />
                   <p className="text-[10px] text-slate-500 dark:text-slate-300 font-medium leading-relaxed uppercase tracking-tight">
                     Operational links are persistent for all system users across the facility network.
                   </p>
                </div>
                
                <footer className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end gap-6">
                  <button 
                    type="button" 
                    onClick={() => setIsLinkModalOpen(false)} 
                    className="px-8 py-4 rounded-2xl font-black text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-[11px] uppercase tracking-widest"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    disabled={isSavingLink}
                    className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl transition-all active:scale-95"
                  >
                    {isSavingLink ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingLink?.id ? 'Commit Update' : 'Provision Shortcut'}
                  </button>
                </footer>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
