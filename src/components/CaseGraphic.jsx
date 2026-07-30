import React from 'react';

export const CaseGraphic = ({
  finish = 'matte-black',
  className = '',
  showLabel = true,
  size = 'md'
}) => {
  // Size mapping
  const sizeClasses = {
    sm: 'w-20 h-36 rounded-[16px] p-2',
    md: 'w-28 h-48 rounded-[22px] p-3',
    lg: 'w-36 h-60 rounded-[28px] p-3.5',
    xl: 'w-44 h-72 rounded-[32px] p-4'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  // Render case body based on finish key
  switch (finish) {
    case 'clear':
    case 'solar':
      return (
        <div className={`${currentSizeClass} border border-gold/40 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md shadow-[0_12px_35px_rgba(0,0,0,0.6)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          {/* Glass reflection streak */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Camera Housing */}
          <div className="self-end w-8 h-8 rounded-xl bg-white/10 border border-white/30 backdrop-blur-md flex flex-col items-center justify-center p-1 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-void/80 border border-gold/60 mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-void/80 border border-gold/60" />
          </div>

          {/* 3D Epoxy Domes Mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-2 pointer-events-none">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gold to-amber-200 shadow-[0_4px_10px_rgba(224,169,59,0.5)] border border-white/60" />
            <div className="w-9 h-3 rounded-full bg-gradient-to-r from-ember to-amber-500 shadow-[0_4px_10px_rgba(217,67,46,0.5)] border border-white/60 flex items-center justify-center">
              <span className="text-[6px] font-bold text-white tracking-widest">NIGHT</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-white to-gold/70 shadow-md border border-white/50" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-gold font-bold uppercase select-none z-10">
              SOLAR CLEAR
            </div>
          )}
        </div>
      );

    case 'gold-ring':
    case 'eclipse':
    case 'magsafe-black':
      return (
        <div className={`${currentSizeClass} border-2 border-gold/80 bg-[#0C0C0D] shadow-[0_15px_35px_rgba(0,0,0,0.9)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          {/* 18k Gold Camera Housing */}
          <div className="self-end w-8 h-8 rounded-xl bg-void border-2 border-gold flex flex-col items-center justify-center p-1 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#141414] border border-gold mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#141414] border border-gold" />
          </div>

          {/* MagSafe Gold Alignment Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-gold/70 shadow-[0_0_15px_rgba(224,169,59,0.3)] pointer-events-none flex items-center justify-center">
            <div className="w-1.5 h-4 bg-gold/70 mt-14" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-gold font-bold uppercase select-none z-10">
              ECLIPSE MAGSAFE
            </div>
          )}
        </div>
      );

    case 'frosted-ember':
    case 'ember':
      return (
        <div className={`${currentSizeClass} border border-[#A83222] bg-gradient-to-b from-[#38100B] via-[#240A07] to-[#170503] shadow-[0_12px_30px_rgba(217,67,46,0.25)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          {/* Crimson Gloss Glow */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-ember/20 rounded-full blur-xl" />

          {/* Camera Housing */}
          <div className="self-end w-8 h-8 rounded-xl bg-[#1D0805] border border-[#A83222] flex flex-col items-center justify-center p-1 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0D0302] border border-[#A83222] mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#0D0302] border border-[#A83222]" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-ember font-bold uppercase select-none z-10">
              EMBER RUBY
            </div>
          )}
        </div>
      );

    case 'frost':
    case 'translucent-white':
      return (
        <div className={`${currentSizeClass} border border-slate-300/60 bg-gradient-to-br from-slate-100/90 via-slate-200/60 to-slate-300/40 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.3)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          {/* Iced Frosted Highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />

          {/* Camera Housing */}
          <div className="self-end w-8 h-8 rounded-xl bg-white/70 border border-slate-300 flex flex-col items-center justify-center p-1 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-400 mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-400" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-slate-800 font-bold uppercase select-none z-10">
              FROST ICED
            </div>
          )}
        </div>
      );

    case 'tide':
    case 'navy':
      return (
        <div className={`${currentSizeClass} border border-sky-600/50 bg-gradient-to-b from-[#0F2035] via-[#0B1726] to-[#060D17] shadow-[0_12px_30px_rgba(15,32,53,0.6)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          {/* Deep Water Radial Highlight */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-sky-500/20 rounded-full blur-xl" />

          {/* Camera Housing */}
          <div className="self-end w-8 h-8 rounded-xl bg-[#091320] border border-sky-600/60 flex flex-col items-center justify-center p-1 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#03070C] border border-sky-500/50 mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#03070C] border border-sky-500/50" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-sky-400 font-bold uppercase select-none z-10">
              TIDE BLUE
            </div>
          )}
        </div>
      );

    case 'sage':
    case 'green':
      return (
        <div className={`${currentSizeClass} border border-emerald-700/40 bg-gradient-to-b from-[#1C2A22] via-[#142019] to-[#0D1510] shadow-[0_12px_30px_rgba(0,0,0,0.6)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          {/* Sage Satin Glow */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />

          {/* Camera Housing */}
          <div className="self-end w-8 h-8 rounded-xl bg-[#101B15] border border-emerald-700/50 flex flex-col items-center justify-center p-1 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#070D09] border border-emerald-600/40 mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#070D09] border border-emerald-600/40" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-emerald-400 font-bold uppercase select-none z-10">
              SAGE GREEN
            </div>
          )}
        </div>
      );

    case 'bone':
    case 'cream':
      return (
        <div className={`${currentSizeClass} border border-[#D9CEBA] bg-gradient-to-b from-[#EFEAE0] via-[#E2D8C6] to-[#D5C9B3] shadow-[0_12px_30px_rgba(0,0,0,0.3)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          {/* Warm Alabaster Grain Accent */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/20 via-transparent to-white/30 pointer-events-none" />

          {/* Camera Housing */}
          <div className="self-end w-8 h-8 rounded-xl bg-[#D6CAA3] border border-[#BFA985] flex flex-col items-center justify-center p-1 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2A241B] border border-[#A69170] mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2A241B] border border-[#A69170]" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-[#5C4D35] font-bold uppercase select-none z-10">
              BONE ALABASTER
            </div>
          )}
        </div>
      );

    case 'carbon':
      return (
        <div className={`${currentSizeClass} border border-ash/40 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:8px_8px] bg-coal shadow-[0_12px_30px_rgba(0,0,0,0.9)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          <div className="self-end w-8 h-8 rounded-xl bg-stone border border-ash/60 flex flex-col items-center justify-center p-1 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-void border border-ash/40 mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-void border border-ash/40" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-ash font-bold uppercase select-none z-10">
              CARBON WEAVE
            </div>
          )}
        </div>
      );

    case 'matte-black':
    case 'void':
    default:
      return (
        <div className={`${currentSizeClass} border border-coal bg-[#0A0A0B] shadow-[0_15px_35px_rgba(0,0,0,0.95)] relative flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 ${className}`}>
          <div className="self-end w-8 h-8 rounded-xl bg-[#141414] border border-grave flex flex-col items-center justify-center p-1 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#050505] border border-coal mb-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#050505] border border-coal" />
          </div>

          {showLabel && (
            <div className="self-start font-mono text-[8px] tracking-widest text-ash font-bold uppercase select-none z-10">
              VOID STEALTH
            </div>
          )}
        </div>
      );
  }
};

export default CaseGraphic;
