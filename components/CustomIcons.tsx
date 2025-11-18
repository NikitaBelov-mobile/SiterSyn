// Custom SVG icons for SiterSyn - Refined and professional
export const CustomIcons = {
  // Lightning bolt - minimal animation
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
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  ),

  // Brain with subtle neural network
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
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M8 10 L12 8 L16 10 M8 14 L12 12 L16 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  ),

  // Code - clean and simple
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
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  ),

  // Rocket - professional
  Rocket: ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L4 8v6l8 8 8-8V8l-8-6z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="12" cy="10" r="2" fill="white" opacity="0.7" />
      <path
        d="M10 18 L8 22 M14 18 L16 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  ),

  // Magic wand - elegant
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
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="10" cy="14" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="6" cy="18" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),

  // Logo sparkle - subtle rotation
  Sparkle: ({ className = "" }: { className?: string }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d="M18 6L18.5 7.5L20 8L18.5 8.5L18 10L17.5 8.5L16 8L17.5 7.5L18 6Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  ),
}
