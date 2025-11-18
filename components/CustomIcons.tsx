// Custom SVG icons for SiterSyn
export const CustomIcons = {
  // Lightning bolt with particles
  Lightning: ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#lightning-gradient)"
      />
      <circle cx="6" cy="8" r="1" fill="currentColor" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="18" cy="16" r="1" fill="currentColor" opacity="0.4">
        <animate
          attributeName="opacity"
          values="0.4;1;0.4"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <defs>
        <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // Brain with neural network
  Brain: ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2a4 4 0 0 0-4 4v1a2 2 0 0 0-2 2v2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2V9a2 2 0 0 0-2-2V6a4 4 0 0 0-4-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="url(#brain-gradient)"
      />
      <path
        d="M8 10 L12 8 L16 10 M8 14 L12 12 L16 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      >
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      <defs>
        <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // Code with sparkles
  Code: ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 18l6-6-6-6M8 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 4l-2 16"
        stroke="url(#code-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="4" cy="4" r="1.5" fill="currentColor">
        <animate
          attributeName="r"
          values="1;2;1"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.4;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="20" cy="20" r="1.5" fill="currentColor">
        <animate
          attributeName="r"
          values="1;2;1"
          dur="2.3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.4;1"
          dur="2.3s"
          repeatCount="indefinite"
        />
      </circle>
      <defs>
        <linearGradient id="code-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // Rocket with trail
  Rocket: ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L4 8v6l8 8 8-8V8l-8-6z"
        fill="url(#rocket-gradient)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2" fill="white" opacity="0.9" />
      <path
        d="M10 18 L8 22 M14 18 L16 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-opacity"
          values="1;0.3;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
      <defs>
        <linearGradient id="rocket-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // Magic wand with stars
  Wand: ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 4V2m0 6V6m-2-1h4M6 14l-3 3m14-14l-9 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 21l9-9"
        stroke="url(#wand-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="6" r="1.5" fill="currentColor">
        <animate
          attributeName="opacity"
          values="1;0.3;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="10" cy="14" r="1" fill="currentColor">
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="6" cy="18" r="1" fill="currentColor">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <defs>
        <linearGradient id="wand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // Logo sparkle
  Sparkle: ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="url(#sparkle-gradient)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="20s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M18 6L18.5 7.5L20 8L18.5 8.5L18 10L17.5 8.5L16 8L17.5 7.5L18 6Z"
        fill="currentColor"
        opacity="0.7"
      >
        <animate
          attributeName="opacity"
          values="0.4;1;0.4"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
    </svg>
  ),
}
