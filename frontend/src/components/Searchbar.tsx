import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

type SearchbarProps = {
  value: string;
  onChange: (value: string) => void;
  currentMatchNumber?: number;
  matchCount?: number;
  onNextMatch?: () => void;
  onPreviousMatch?: () => void;
  placeholder?: string;
};

export default function Searchbar({
  value,
  onChange,
  currentMatchNumber = 0,
  matchCount = 0,
  onNextMatch,
  onPreviousMatch,
  placeholder = "Search logs",
}: SearchbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  function clearSearch() {
    onChange("");
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || matchCount === 0) {
      return;
    }

    event.preventDefault();

    if (event.shiftKey) {
      onPreviousMatch?.();
    } else {
      onNextMatch?.();
    }
  }

  return (
    <div className="flex shrink-0 items-center">
      <div
        className={`flex h-9 items-center overflow-hidden rounded-md border border-slate-700 bg-slate-950 text-slate-300 transition-all duration-200 focus-within:border-cyan-500 ${
          isOpen || value ? "w-78 px-1.5" : "w-9 px-0"
        }`}
      >
        <button
          aria-label="Open search"
          className="grid size-8 shrink-0 place-items-center rounded text-slate-500 transition hover:bg-slate-800 hover:text-slate-100"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Search size={16} />
        </button>

        {isOpen || value ? (
          <>
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="h-full min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-200 outline-none placeholder:text-slate-600"
              type="search"
            />

            <span className="shrink-0 text-xs text-slate-500">
              {value
                ? matchCount > 0
                  ? `${currentMatchNumber} / ${matchCount}`
                  : "No matches"
                : ""}
            </span>

            <button
              aria-label="Previous match"
              className="grid size-7 shrink-0 place-items-center rounded text-slate-500 transition hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={matchCount === 0}
              onClick={onPreviousMatch}
              type="button"
            >
              <ChevronUp size={14} />
            </button>

            <button
              aria-label="Next match"
              className="grid size-7 shrink-0 place-items-center rounded text-slate-500 transition hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={matchCount === 0}
              onClick={onNextMatch}
              type="button"
            >
              <ChevronDown size={14} />
            </button>

            <button
              aria-label="Clear search"
              className="grid size-7 shrink-0 place-items-center rounded text-slate-500 transition hover:bg-slate-800 hover:text-slate-100"
              onClick={clearSearch}
              type="button"
            >
              <X size={14} />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
