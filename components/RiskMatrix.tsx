
import React, { useState } from 'react';
import { AlertTriangle, Download, Info, Shield, Loader2, CheckCircle, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';

const RiskMatrix: React.FC = () => {
  const { language, user } = useApp();
  const t = TRANSLATIONS[language];
  const [selected, setSelected] = useState<{p: number, s: number} | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success'>('idle');

  const getRiskColor = (p: number, s: number) => {
    const score = p * s;
    if (score >= 15) return 'bg-red-600';
    if (score >= 8) return 'bg-orange-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getRiskLevelLabel = (p: number, s: number) => {
    const score = p * s;
    if (score >= 15) return t.extremeRisk;
    if (score >= 8) return t.highRisk;
    if (score >= 4) return t.mediumRisk;
    return t.lowRisk;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');
    
    // Simulate complex generation delay for technical document compilation
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    try {
      const timestamp = new Date().toISOString();
      const score = selected ? selected.p * selected.s : 'N/A';
      const grade = selected ? getRiskLevelLabel(selected.p, selected.s) : 'Global Overview';
      
      const reportContent = `
==================================================
MOC STUDIO | TECHNICAL RISK ASSESSMENT REPORT
==================================================
Generated on: ${timestamp}
Authorized by: ${user?.name || 'System Administrator'}
Clearance Role: ${user?.role || 'Engineer'}

REPORT PARAMETERS:
--------------------------------------------------
${selected ? `Selected Probability (P): ${selected.p}
Selected Severity (S): ${selected.s}
Composite Risk Score: ${score}
Risk Classification: ${grade.toUpperCase()}` : 'Scope: Global Matrix Infrastructure Overview'}

GOVERNANCE STANDARDS:
--------------------------------------------------
* API RP 754: Process Safety Performance Indicators
* ISO 31000: Risk Management Framework
* NR-13: Pressurized Equipment Compliance

REQUIRED SIGN-OFFS BASED ON SCORE:
--------------------------------------------------
${selected && selected.p * selected.s >= 15 
  ? "[CRITICAL] REQUIRES HSE DIRECTOR & TECHNICAL MANAGER APPROVAL" 
  : selected && selected.p * selected.s >= 8 
  ? "[HIGH] REQUIRES FORMAL PEER REVIEW & DEPT HEAD APPROVAL"
  : "[MANAGED] STANDARD OPERATIONAL CLEARANCE"}

DIGITAL SIGNATURE:
--------------------------------------------------
VERIFIED BY MOC STUDIO GOVERNANCE ENGINE
HASH: ${Math.random().toString(36).substring(2, 15).toUpperCase()}
==================================================
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MOC_Risk_Report_${selected ? `Score_${score}` : 'Global'}_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExportStatus('success');
      
      // Reset success icon after 3 seconds
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight leading-none mb-1 glow-title">
            {t.techRiskMatrix}
          </h2>
          <p className="text-slate-500 dark:text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
            {t.quantAssessment}
          </p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className={`px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all border font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 ${
            exportStatus === 'success' 
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20' 
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-white/20'
          }`}
        >
          {isExporting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : exportStatus === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <FileText size={18} />
          )}
          <span>{isExporting ? 'Compiling Dossier...' : exportStatus === 'success' ? 'Report Downloaded' : t.exportPdf}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-10 rounded-[3.5rem]">
          <div className="flex mb-4">
             <div className="w-12 shrink-0 flex items-center justify-center -rotate-90">
                <span className="text-[11px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.3em] whitespace-nowrap">{t.probability}</span>
             </div>
             <div className="flex-1">
                <div className="grid grid-cols-5 gap-4 mb-4">
                   {[1,2,3,4,5].map(s => (
                     <div key={s} className="text-center text-[11px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-tighter">S-{s}</div>
                   ))}
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {[5, 4, 3, 2, 1].map((p) => (
                    [1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={`${p}-${s}`}
                        onClick={() => setSelected({p, s})}
                        className={`aspect-square rounded-2xl border-2 transition-all flex items-center justify-center text-xs font-black ${
                          selected?.p === p && selected?.s === s 
                            ? 'border-slate-900 dark:border-white scale-110 shadow-2xl z-10 ring-4 ring-blue-500/20' 
                            : 'border-transparent hover:scale-105 opacity-90 hover:opacity-100'
                        } ${getRiskColor(p, s)} text-white`}
                      >
                        {p * s}
                      </button>
                    ))
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <span className="text-[11px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-[0.3em]">{t.severity}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/10">
            <h4 className="text-lg font-black text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-3">
               <Info size={22} className="text-blue-500 dark:text-blue-400" />
               {t.assessmentDetails}
            </h4>
            {selected ? (
              <div className="space-y-5 animate-in slide-in-from-right-2 duration-300">
                <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/20 shadow-inner">
                  <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">{t.score}</div>
                  <div className="text-4xl font-black text-slate-900 dark:text-slate-50">{selected.p * selected.s}</div>
                </div>
                <div className={`p-4 rounded-2xl font-black text-center ${getRiskColor(selected.p, selected.s)} text-white shadow-xl uppercase tracking-widest text-[11px]`}>
                   {getRiskLevelLabel(selected.p, selected.s)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-200 font-bold leading-relaxed italic border-l-4 border-blue-500/40 pl-4 py-2">
                  {language === 'pt-BR' 
                    ? '"Requer aprovação imediata da alta gerência e validação de contenção secundária."'
                    : '"Requires immediate senior management sign-off and secondary containment validation."'
                  }
                </p>
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-white/20 rounded-[2rem]">
                <AlertTriangle className="mx-auto text-slate-300 dark:text-slate-400 mb-4 opacity-40" size={48} />
                <p className="text-slate-500 dark:text-slate-300 text-xs font-black uppercase tracking-widest px-6 leading-relaxed">{t.selectCell}</p>
              </div>
            )}
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/30">
             <h4 className="text-slate-900 dark:text-slate-50 font-black uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
               <Shield size={16} className="text-blue-400" />
               {t.govRule}
             </h4>
             <ul className="text-xs text-slate-700 dark:text-slate-200 space-y-4 font-black tracking-tight leading-tight">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  <span>{t.rule1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  <span>{t.rule2}</span>
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;
