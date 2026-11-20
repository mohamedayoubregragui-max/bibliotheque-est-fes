import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Layers,
  Network,
  Database,
  ShieldCheck,
  BrainCircuit,
  Wrench,
  BarChart3,
  Flame,
  Globe2,
  BookMarked,
  Briefcase,
  Atom,
  Workflow
} from 'lucide-react';

interface BookCoverBadgeProps {
  category: string;
  department: string;
  title: string;
  coverUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookCoverBadge: React.FC<BookCoverBadgeProps> = ({
  category,
  department,
  title,
  coverUrl,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fallback themes based on department and discipline
  const getTheme = () => {
    switch (department) {
      case 'Génie Informatique':
        if (category.includes('Sécurité') || category.includes('Cybersécurité')) {
          return {
            bg: 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80',
            accent: 'bg-emerald-600/10 text-emerald-700',
            bar: 'bg-emerald-600',
            Icon: ShieldCheck,
            tag: 'SÉCURITÉ',
          };
        }
        if (category.includes('Intelligence') || category.includes('Machine Learning')) {
          return {
            bg: 'bg-violet-50/90 text-violet-800 border-violet-200/80',
            accent: 'bg-violet-600/10 text-violet-700',
            bar: 'bg-violet-600',
            Icon: BrainCircuit,
            tag: 'DATA & IA',
          };
        }
        if (category.includes('Réseaux')) {
          return {
            bg: 'bg-sky-50/90 text-sky-800 border-sky-200/80',
            accent: 'bg-sky-600/10 text-sky-700',
            bar: 'bg-sky-600',
            Icon: Network,
            tag: 'RÉSEAUX',
          };
        }
        if (category.includes('Systèmes d\'Information') || category.includes('SQL')) {
          return {
            bg: 'bg-cyan-50/90 text-cyan-800 border-cyan-200/80',
            accent: 'bg-cyan-600/10 text-cyan-700',
            bar: 'bg-cyan-600',
            Icon: Database,
            tag: 'DONNÉES',
          };
        }
        if (category.includes('Web')) {
          return {
            bg: 'bg-indigo-50/90 text-indigo-800 border-indigo-200/80',
            accent: 'bg-indigo-600/10 text-indigo-700',
            bar: 'bg-indigo-600',
            Icon: Globe2,
            tag: 'DEV WEB',
          };
        }
        return {
          bg: 'bg-blue-50/90 text-blue-800 border-blue-200/80',
          accent: 'bg-blue-600/10 text-blue-700',
          bar: 'bg-blue-600',
          Icon: Code2,
          tag: 'LOGICIEL',
        };

      case 'Génie Électrique':
        return {
          bg: 'bg-amber-50/90 text-amber-900 border-amber-200/80',
          accent: 'bg-amber-600/10 text-amber-800',
          bar: 'bg-amber-500',
          Icon: Cpu,
          tag: 'ÉLECTRIQUE',
        };

      case 'Génie Industriel':
        if (category.includes('Qualité')) {
          return {
            bg: 'bg-teal-50/90 text-teal-900 border-teal-200/80',
            accent: 'bg-teal-600/10 text-teal-800',
            bar: 'bg-teal-600',
            Icon: BarChart3,
            tag: 'QUALITÉ',
          };
        }
        return {
          bg: 'bg-orange-50/90 text-orange-900 border-orange-200/80',
          accent: 'bg-orange-600/10 text-orange-800',
          bar: 'bg-orange-500',
          Icon: Workflow,
          tag: 'INDUSTRIEL',
        };

      case 'Management & Gestion':
        return {
          bg: 'bg-stone-100/90 text-stone-800 border-stone-200',
          accent: 'bg-stone-600/10 text-stone-700',
          bar: 'bg-stone-600',
          Icon: Briefcase,
          tag: 'GESTION',
        };

      case 'Sciences Fondamentales':
        if (category.includes('Thermodynamique')) {
          return {
            bg: 'bg-rose-50/90 text-rose-900 border-rose-200/80',
            accent: 'bg-rose-600/10 text-rose-800',
            bar: 'bg-rose-500',
            Icon: Flame,
            tag: 'PHYSIQUE',
          };
        }
        if (category.includes('Langues')) {
          return {
            bg: 'bg-slate-50 text-slate-800 border-slate-200',
            accent: 'bg-slate-600/10 text-slate-700',
            bar: 'bg-slate-500',
            Icon: BookMarked,
            tag: 'LANGUES',
          };
        }
        return {
          bg: 'bg-purple-50/90 text-purple-900 border-purple-200/80',
          accent: 'bg-purple-600/10 text-purple-800',
          bar: 'bg-purple-600',
          Icon: Atom,
          tag: 'SCIENCES',
        };

      default:
        return {
          bg: 'bg-stone-50 text-stone-800 border-stone-200',
          accent: 'bg-stone-600/10 text-stone-700',
          bar: 'bg-stone-500',
          Icon: Layers,
          tag: 'OUVRAGE',
        };
    }
  };

  const theme = getTheme();
  const IconComponent = theme.Icon;
  const showRealImage = Boolean(coverUrl) && !imageError;

  // 1. SMALL SIZE (for Cart modal, Manager table rows, compact lists)
  if (size === 'sm') {
    if (showRealImage) {
      return (
        <div className={`w-11 h-15 rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative flex items-center justify-center shadow-2xs ${className}`}>
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
        </div>
      );
    }
    return (
      <div className={`w-11 h-15 rounded-md border flex flex-col justify-between p-1 shrink-0 ${theme.bg} ${className}`}>
        <span className="text-[7px] font-bold font-mono tracking-wider opacity-75">{theme.tag}</span>
        <IconComponent className="w-4 h-4 opacity-90 mx-auto" />
        <div className={`h-0.5 w-full rounded-full ${theme.bar}`} />
      </div>
    );
  }

  // 2. LARGE SIZE (for Book Detail Modal)
  if (size === 'lg') {
    if (showRealImage) {
      return (
        <div className={`w-full max-w-[260px] aspect-3/4 mx-auto rounded-2xl overflow-hidden relative flex items-center justify-center p-3 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200/70 border border-stone-200 shadow-md ${className}`}>
          {/* Subtle soft backdrop reflection */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 blur-md pointer-events-none scale-110"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />

          <img
            src={coverUrl}
            alt={`Couverture de ${title}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
            className="max-h-full max-w-full object-contain rounded-md shadow-lg border border-black/10 relative z-10 transition-transform duration-300 hover:scale-[1.02]"
          />

          <div className="absolute bottom-2 left-3 right-3 z-20 flex justify-between items-center text-[10px] font-mono opacity-60">
            <span>EST FÈS</span>
            <span className="uppercase">{theme.tag}</span>
          </div>
        </div>
      );
    }

    // Large Fallback
    return (
      <div className={`w-full aspect-3/4 rounded-xl border relative overflow-hidden flex flex-col justify-between p-5 shadow-xs select-none ${theme.bg} ${className}`}>
        <div className="absolute -right-6 -bottom-6 opacity-8 pointer-events-none">
          <IconComponent className="w-40 h-40" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-white/70 shadow-2xs border border-black/5">
            EST · {theme.tag}
          </span>
          <div className="w-2 h-2 rounded-full bg-current opacity-40" />
        </div>
        <div className="my-auto py-4 flex flex-col items-center text-center space-y-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${theme.accent}`}>
            <IconComponent className="w-9 h-9 stroke-[1.5]" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-balance max-w-[200px] line-clamp-2 opacity-90">
            {title}
          </span>
        </div>
        <div className="space-y-1.5 pt-2 border-t border-black/5">
          <div className="flex justify-between items-center text-[10px] opacity-75 font-mono">
            <span>Fonds EST Fès</span>
            <span className="uppercase">{department.replace('Génie ', '')}</span>
          </div>
          <div className={`h-1 w-full rounded-full ${theme.bar}`} />
        </div>
      </div>
    );
  }

  // 3. MEDIUM SIZE (standard on catalog cards & suggested books cards)
  if (showRealImage) {
    return (
      <div className={`w-full h-48 rounded-xl overflow-hidden relative flex items-center justify-center p-2.5 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200/50 border border-stone-200/80 group-hover:border-amber-400 group-hover:shadow-xs transition-all select-none ${className}`}>
        {/* Subtle diffused ambient reflection */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-8 blur-md pointer-events-none scale-105"
          style={{ backgroundImage: `url(${coverUrl})` }}
        />

        {/* Real Authentic Book Cover: object-contain to never distort or cut */}
        <img
          src={coverUrl}
          alt={`Couverture de ${title}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageError(true)}
          className="max-h-full max-w-full h-auto w-auto object-contain rounded shadow-[0_3px_10px_rgba(0,0,0,0.12)] border border-black/5 group-hover:scale-102 transition-transform duration-300 relative z-10"
        />

        {/* Discrete department badge on top right */}
        <div className="absolute top-2 right-2 z-20">
          <span className="text-[9px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 border border-stone-200 shadow-2xs">
            {theme.tag}
          </span>
        </div>

        {/* Bottom subtle baseline */}
        <div className="absolute bottom-1.5 left-3 right-3 z-20 flex items-center justify-between opacity-50 text-[9px] font-mono">
          <span>EST FÈS</span>
          <div className={`h-0.5 w-4 rounded-full ${theme.bar}`} />
        </div>
      </div>
    );
  }

  // Medium Fallback
  return (
    <div className={`w-full h-48 rounded-xl border relative overflow-hidden flex flex-col justify-between p-3 select-none transition-colors ${theme.bg} ${className}`}>
      <div className="absolute -right-3 -bottom-3 opacity-10 pointer-events-none">
        <IconComponent className="w-24 h-24" />
      </div>
      <div className="flex items-center justify-between z-10">
        <span className="text-[9px] font-bold font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-white/80 border border-black/5 shadow-2xs">
          {theme.tag}
        </span>
        <span className="text-[9px] font-mono opacity-60">EST FÈS</span>
      </div>
      <div className="z-10 flex items-center gap-2.5 my-auto">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${theme.accent}`}>
          <IconComponent className="w-5 h-5 stroke-[1.6]" />
        </div>
        <p className="text-xs font-bold leading-tight line-clamp-2 pr-2">
          {title}
        </p>
      </div>
      <div className="z-10 pt-1.5 border-t border-black/5 flex items-center justify-between text-[10px] opacity-70">
        <span className="truncate max-w-[70%]">{department}</span>
        <div className={`h-1 w-6 rounded-full ${theme.bar}`} />
      </div>
    </div>
  );
};
