import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

interface Suggestion {
  displayName: string; // full string, used for geocoding
  primary: string;     // short label shown in dropdown
  secondary: string;   // city + postcode
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  inputClassName?: string;
}

function parseSuggestion(item: Record<string, unknown>): Suggestion {
  const a = (item.address ?? {}) as Record<string, string>;
  const parts: string[] = [];

  if (a.house_number && a.road) {
    parts.push(`${a.house_number} ${a.road}`);
  } else if (a.road) {
    parts.push(a.road);
  } else if (a.neighbourhood ?? a.suburb) {
    parts.push((a.neighbourhood ?? a.suburb)!);
  }

  const city    = a.city ?? a.town ?? a.village ?? a.county ?? '';
  const postcode = a.postcode ?? '';
  const primary  = parts[0] ?? (item.display_name as string).split(',')[0];
  const secondary = [city, postcode].filter(Boolean).join(' ');

  return { displayName: item.display_name as string, primary, secondary };
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Address or postcode',
  icon,
  inputClassName = '',
}) => {
  // inputDisplay is what the <input> shows; value prop is what goes to geocoding
  const [inputDisplay, setInputDisplay] = useState(value);
  const [suggestions, setSuggestions]   = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen]             = useState(false);
  const [loading, setLoading]           = useState(false);
  const [activeIdx, setActiveIdx]       = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync display when parent clears the value externally
  useEffect(() => {
    if (!value) setInputDisplay('');
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 3) { setSuggestions([]); setIsOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=gb&addressdetails=1&limit=6`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'FastManVan/1.0' } },
      );
      const data: Record<string, unknown>[] = await res.json();
      const items = data.map(parseSuggestion);
      setSuggestions(items);
      setIsOpen(items.length > 0);
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputDisplay(v);
    onChange(v); // keep parent synced with raw typed value for geocoding fallback
    setActiveIdx(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(v), 350);
  };

  const handleSelect = (s: Suggestion) => {
    const display = [s.primary, s.secondary].filter(Boolean).join(', ');
    setInputDisplay(display);
    onChange(s.displayName); // full nominatim string → best geocoding result
    setSuggestions([]);
    setIsOpen(false);
    setActiveIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(suggestions[activeIdx]); }
    else if (e.key === 'Escape') { setIsOpen(false); }
  };

  const handleClear = () => {
    setInputDisplay('');
    onChange('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputDisplay}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0E2A47]/20 focus:border-[#0E2A47] outline-none text-sm transition-colors ${icon ? 'pl-9' : 'pl-3'} ${inputDisplay ? 'pr-9' : 'pr-3'} ${inputClassName}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading
            ? <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            : inputDisplay
              ? <button type="button" onClick={handleClear} className="text-gray-300 hover:text-gray-500 transition-colors"><X className="w-4 h-4" /></button>
              : null
          }
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={e => { e.preventDefault(); handleSelect(s); }}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 last:border-0 ${i === activeIdx ? 'bg-[#0E2A47]/6' : 'hover:bg-gray-50'}`}
            >
              <MapPin className="w-4 h-4 text-[#0E2A47]/40 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{s.primary}</p>
                {s.secondary && <p className="text-xs text-gray-400 truncate mt-0.5">{s.secondary}</p>}
              </div>
            </button>
          ))}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5">
            <img src="https://nominatim.openstreetmap.org/ui/mapicons/poi_boundary_administrative.p.20.png" alt="" className="w-3 h-3 opacity-40" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-[10px] text-gray-400">Powered by OpenStreetMap</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
