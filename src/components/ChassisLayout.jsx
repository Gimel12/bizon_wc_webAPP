export function ChassisLayout() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 600"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="ventPattern" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2" fill="rgba(255,255,255,0.08)" />
        </pattern>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(100,116,139,0.2)" />
          <stop offset="100%" stopColor="rgba(51,65,85,0.2)" />
        </linearGradient>
      </defs>

      {/* Main case frame */}
      <rect x="10" y="10" width="780" height="580" rx="8" 
        fill="none" stroke="rgba(100,116,139,0.4)" strokeWidth="3" />

      {/* ============ TOP RADIATOR ============ */}
      <g id="top-rad">
        <rect x="100" y="20" width="580" height="55" rx="4" 
          fill="url(#metalGradient)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
        <rect x="110" y="28" width="560" height="40" rx="2" fill="url(#ventPattern)" />
        
        <circle cx="180" cy="48" r="18" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="260" cy="48" r="18" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="340" cy="48" r="18" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="420" cy="48" r="18" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        
        <text x="580" y="52" fill="rgba(148,163,184,0.4)" fontSize="10" fontFamily="monospace">TOP RAD</text>
      </g>

      {/* ============ REAR I/O (Left side) ============ */}
      <g id="rear-io">
        <rect x="20" y="20" width="70" height="450" rx="4" 
          fill="rgba(30,41,59,0.4)" stroke="rgba(100,116,139,0.25)" strokeWidth="1" />
        <text x="55" y="250" fill="rgba(148,163,184,0.35)" fontSize="10" fontFamily="monospace" textAnchor="middle" transform="rotate(-90, 55, 250)">REAR I/O</text>
      </g>

      {/* ============ FRONT RADIATOR (Right side) ============ */}
      <g id="front-rad">
        <rect x="700" y="85" width="70" height="380" rx="4" 
          fill="url(#metalGradient)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
        <rect x="708" y="95" width="54" height="360" rx="2" fill="url(#ventPattern)" />
        
        <circle cx="735" cy="145" r="22" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="735" cy="215" r="22" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="735" cy="285" r="22" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="735" cy="355" r="22" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="735" cy="425" r="22" fill="none" stroke="rgba(100,116,139,0.25)" strokeWidth="1" strokeDasharray="3 2" />
        
        <text x="735" y="465" fill="rgba(148,163,184,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">FRONT</text>
        <text x="735" y="475" fill="rgba(148,163,184,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">RAD</text>
      </g>

      {/* ============ CPU SOCKET ============ */}
      <g id="cpu-socket">
        <rect x="110" y="85" width="120" height="90" rx="4" 
          fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="170" y="125" fill="rgba(59,130,246,0.5)" fontSize="11" fontFamily="monospace" textAnchor="middle">CPU</text>
        <text x="170" y="140" fill="rgba(59,130,246,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">SOCKET</text>
      </g>

      {/* ============ RAM SLOTS ============ */}
      <g id="ram-slots">
        <rect x="250" y="85" width="80" height="90" rx="4" 
          fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="290" y="125" fill="rgba(34,211,238,0.5)" fontSize="11" fontFamily="monospace" textAnchor="middle">RAM</text>
        <text x="290" y="140" fill="rgba(34,211,238,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">SLOTS</text>
      </g>

      {/* ============ 7x PCIe SLOTS ============ */}
      <g id="pcie-slots">
        <text x="110" y="195" fill="rgba(148,163,184,0.5)" fontSize="10" fontFamily="monospace">PCIe SLOTS</text>
        
        <rect x="110" y="205" width="570" height="32" rx="3" 
          fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="120" y="226" fill="rgba(168,85,247,0.4)" fontSize="9" fontFamily="monospace">PCIe Slot 1</text>
        
        <rect x="110" y="242" width="570" height="32" rx="3" 
          fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="120" y="263" fill="rgba(168,85,247,0.4)" fontSize="9" fontFamily="monospace">PCIe Slot 2</text>
        
        <rect x="110" y="279" width="570" height="32" rx="3" 
          fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="120" y="300" fill="rgba(168,85,247,0.4)" fontSize="9" fontFamily="monospace">PCIe Slot 3</text>
        
        <rect x="110" y="316" width="570" height="32" rx="3" 
          fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="120" y="337" fill="rgba(168,85,247,0.4)" fontSize="9" fontFamily="monospace">PCIe Slot 4</text>
        
        <rect x="110" y="353" width="570" height="32" rx="3" 
          fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="120" y="374" fill="rgba(168,85,247,0.4)" fontSize="9" fontFamily="monospace">PCIe Slot 5</text>
        
        <rect x="110" y="390" width="570" height="32" rx="3" 
          fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="120" y="411" fill="rgba(168,85,247,0.4)" fontSize="9" fontFamily="monospace">PCIe Slot 6</text>
        
        <rect x="110" y="427" width="570" height="32" rx="3" 
          fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="120" y="448" fill="rgba(168,85,247,0.4)" fontSize="9" fontFamily="monospace">PCIe Slot 7</text>
      </g>

      {/* ============ PSU CHAMBER (4 slots) ============ */}
      <g id="psu-chamber">
        <line x1="20" y1="480" x2="780" y2="480" stroke="rgba(100,116,139,0.5)" strokeWidth="2" />
        
        <rect x="20" y="485" width="760" height="100" rx="4" 
          fill="rgba(30,41,59,0.4)" stroke="rgba(100,116,139,0.2)" strokeWidth="1" />
        
        <rect x="35" y="500" width="170" height="70" rx="3" 
          fill="rgba(234,179,8,0.08)" stroke="rgba(234,179,8,0.3)" strokeWidth="1" strokeDasharray="5 3" />
        <text x="90" y="540" fill="rgba(234,179,8,0.5)" fontSize="11" fontFamily="monospace">PSU 1</text>
        
        <rect x="220" y="500" width="170" height="70" rx="3" 
          fill="rgba(234,179,8,0.08)" stroke="rgba(234,179,8,0.3)" strokeWidth="1" strokeDasharray="5 3" />
        <text x="275" y="540" fill="rgba(234,179,8,0.5)" fontSize="11" fontFamily="monospace">PSU 2</text>
        
        <rect x="405" y="500" width="170" height="70" rx="3" 
          fill="rgba(234,179,8,0.08)" stroke="rgba(234,179,8,0.3)" strokeWidth="1" strokeDasharray="5 3" />
        <text x="460" y="540" fill="rgba(234,179,8,0.5)" fontSize="11" fontFamily="monospace">PSU 3</text>
        
        <rect x="590" y="500" width="170" height="70" rx="3" 
          fill="rgba(234,179,8,0.08)" stroke="rgba(234,179,8,0.3)" strokeWidth="1" strokeDasharray="5 3" />
        <text x="645" y="540" fill="rgba(234,179,8,0.5)" fontSize="11" fontFamily="monospace">PSU 4</text>
        
        <text x="400" y="595" fill="rgba(148,163,184,0.4)" fontSize="10" fontFamily="monospace" textAnchor="middle">PSU CHAMBER</text>
      </g>
    </svg>
  );
}
