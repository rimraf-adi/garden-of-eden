import { useId } from 'react';

/** Garden of Eden mark: a tree whose branches end in graph nodes, under a rising sun. */
export default function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" stroke={`url(#${id}-g)`} strokeWidth="1.5" opacity="0.55" />
      {/* trunk and branches */}
      <g stroke={`url(#${id}-g)`} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 41 V27" />
        <path d="M24 31 C24 25 17 24 13 19" />
        <path d="M24 31 C24 25 31 24 35 19" />
        <path d="M24 27 C24 22 24 18 24 13" />
        <path d="M18.5 25 C16 24 14 22 12 25" opacity="0.7" />
        <path d="M29.5 25 C32 24 34 22 36 25" opacity="0.7" />
      </g>
      {/* knowledge nodes */}
      <g fill={`url(#${id}-g)`}>
        <circle cx="24" cy="11" r="3.2" />
        <circle cx="12" cy="18" r="2.6" />
        <circle cx="36" cy="18" r="2.6" />
        <circle cx="11" cy="25.5" r="1.8" opacity="0.8" />
        <circle cx="37" cy="25.5" r="1.8" opacity="0.8" />
      </g>
      <path d="M14 41 H34" stroke={`url(#${id}-g)`} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
