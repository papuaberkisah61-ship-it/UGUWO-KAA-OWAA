export function PapuaFamilyCrest({className = 'w-10 h-10'}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 64 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Traditional Honai curved roof with carved gold border & family silhouettes */}
      <path
        d="M32 4C18 11 8 22 4 35H60C56 22 46 11 32 4Z"
        fill="#5C3D2E"
        stroke="#F2C22B"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M32 9C21 15 13 24 10 33H54C51 24 43 15 32 9Z"
        fill="#FAF3E0"
        stroke="#C9A24D"
        strokeWidth="1.2"
      />
      {/* Subtle geometric carving notches along the arch */}
      <path
        d="M22 14L25 11M42 14L39 11M32 6V9"
        stroke="#F2C22B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Family silhouettes inside the warm house */}
      <circle cx="24" cy="23.5" r="2.2" fill="#163B22" />
      <path d="M20.5 32.5C20.5 28.5 22 26.5 24 26.5C26 26.5 27.5 28.5 27.5 32.5H20.5Z" fill="#163B22" />
      <circle cx="32" cy="22" r="2.4" fill="#163B22" />
      <path d="M28 32.5C28 28 29.8 25.5 32 25.5C34.2 25.5 36 28 36 32.5H28Z" fill="#163B22" />
      <circle cx="39.5" cy="24.5" r="1.9" fill="#163B22" />
      <path d="M36.5 32.5C36.5 29.2 37.8 27.2 39.5 27.2C41.2 27.2 42.5 29.2 42.5 32.5H36.5Z" fill="#163B22" />
      {/* Base foundation */}
      <rect x="7" y="34" width="50" height="4" rx="2" fill="#F2C22B" />
      <path d="M12 40H52" stroke="#C9A24D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HonaiCardIcon({className = 'w-8 h-8'}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 40 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 4L35 16H31V30H9V16H5L20 4Z"
        fill="#F4EAD5"
        stroke="#5C3D2E"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M5 16H35" stroke="#5C3D2E" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="21" r="1.6" fill="#5C3D2E" />
      <circle cx="23.5" cy="21" r="1.6" fill="#5C3D2E" />
      <path d="M14 29C14 25.8 15.2 24 16.5 24C17.8 24 19 25.8 19 29" fill="#5C3D2E" />
      <path d="M21 29C21 25.8 22.2 24 23.5 24C24.8 24 26 25.8 26 29" fill="#5C3D2E" />
    </svg>
  );
}

export function PapuaCarvingCorner({className = 'w-48 h-28'}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 220 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Subtle Papuan Asmat / Sentani inspired diagonal carving motif */}
      <path
        d="M60 120C90 80 130 45 220 15"
        stroke="#C9A24D"
        strokeWidth="2.5"
        strokeOpacity="0.35"
      />
      <path
        d="M95 120C125 85 160 58 220 38"
        stroke="#C9A24D"
        strokeWidth="2"
        strokeOpacity="0.3"
      />
      <path
        d="M135 120C158 94 185 76 220 64"
        stroke="#C9A24D"
        strokeWidth="2"
        strokeOpacity="0.3"
      />
      <path
        d="M110 92C118 82 132 82 138 92C144 102 130 112 120 105"
        stroke="#F2C22B"
        strokeWidth="1.8"
        strokeOpacity="0.28"
        strokeLinecap="round"
      />
      <path
        d="M155 68C164 56 178 56 184 67C190 78 176 88 166 80"
        stroke="#F2C22B"
        strokeWidth="1.8"
        strokeOpacity="0.28"
        strokeLinecap="round"
      />
      <circle cx="152" cy="96" r="3" fill="#F2C22B" fillOpacity="0.25" />
      <circle cx="192" cy="52" r="3" fill="#F2C22B" fillOpacity="0.25" />
    </svg>
  );
}

export function PapuaGeometricDivider({className = ''}: {className?: string}) {
  return (
    <div
      className={`h-2 w-full papua-motif-bar opacity-85 ${className}`}
      aria-hidden="true"
    />
  );
}
