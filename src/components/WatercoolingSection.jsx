import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Droplets, CheckCircle, AlertCircle, Info, Download, Upload, RotateCcw, Copy } from 'lucide-react';

const componentTypes = [
  { value: 'pump', label: 'Pump/Res Combo', color: '#06b6d4', w: 80, h: 100, ports: { in: 1, out: 1 } },
  { value: 'reservoir', label: 'Reservoir', color: '#0891b2', w: 60, h: 90, ports: { in: 1, out: 1 } },
  { value: 'cpu-block', label: 'CPU Block', color: '#3b82f6', w: 90, h: 70, ports: { in: 1, out: 1 } },
  { value: 'gpu-block', label: 'GPU Block', color: '#8b5cf6', w: 120, h: 60, ports: { in: 1, out: 1 } },
  { value: 'radiator', label: 'Radiator', color: '#64748b', w: 140, h: 50, ports: { in: 1, out: 1 } },
  { value: 'fitting', label: 'Fitting/QDC', color: '#f59e0b', w: 40, h: 40, ports: { in: 1, out: 1 } },
  { value: 'koolance', label: 'Koolance Unit', color: '#22c55e', w: 80, h: 100, ports: { in: 1, out: 1 }, isExternal: true },
  { value: 'manifold', label: 'Manifold', color: '#ec4899', w: 60, h: 220, ports: { left: 8, right: 8, bottom: 2 } },
];

function isPortConnected(connections, componentId, portId) {
  return connections.some(c => 
    (c.from === componentId && c.fromPort === portId) ||
    (c.to === componentId && c.toPort === portId)
  );
}

function PortButton({ portId, portType, position, style, componentId, isManifoldPort = false }) {
  const { 
    waterConnectingFrom, 
    waterConnectingPort,
    setWaterConnecting,
    connectWaterPorts,
    clearWaterConnecting,
    waterConnections,
  } = useStore();

  const isConnected = isPortConnected(waterConnections, componentId, portId);
  const isInlet = portType === 'inlet';
  const isWaitingForInlet = waterConnectingPort?.startsWith('outlet');
  const isWaitingForOutlet = waterConnectingPort?.startsWith('inlet');

  const handleClick = (e) => {
    e.stopPropagation();
    if (!waterConnectingFrom) {
      setWaterConnecting(componentId, portId);
    } else if (waterConnectingFrom === componentId) {
      clearWaterConnecting();
    } else {
      const fromIsOutlet = waterConnectingPort.startsWith('outlet');
      const toIsInlet = portId.startsWith('inlet');
      
      if (fromIsOutlet && toIsInlet) {
        connectWaterPorts(waterConnectingFrom, waterConnectingPort, componentId, portId);
      } else if (!fromIsOutlet && !toIsInlet) {
        connectWaterPorts(componentId, portId, waterConnectingFrom, waterConnectingPort);
      } else {
        clearWaterConnecting();
      }
    }
  };

  const baseClass = isManifoldPort 
    ? 'w-4 h-4 text-[8px]' 
    : 'w-6 h-6 text-xs';

  return (
    <button
      className={`port-button absolute ${baseClass} rounded-full border-2 flex items-center justify-center font-bold transition-all ${
        isConnected 
          ? 'bg-green-500 border-green-400 text-white' 
          : (isInlet && isWaitingForInlet) || (!isInlet && isWaitingForOutlet)
            ? `${isInlet ? 'bg-cyan-500 border-cyan-400' : 'bg-orange-500 border-orange-400'} text-white animate-pulse cursor-pointer hover:scale-110`
            : `bg-slate-700 border-slate-500 text-slate-300 ${isInlet ? 'hover:bg-cyan-600 hover:border-cyan-400' : 'hover:bg-orange-600 hover:border-orange-400'}`
      }`}
      style={style}
      onClick={handleClick}
      title={`${isInlet ? 'Inlet' : 'Outlet'} ${portId}`}
    >
      {isManifoldPort ? (isInlet ? 'I' : 'O') : (isInlet ? 'IN' : 'OUT')}
    </button>
  );
}

function WaterBlock({ component }) {
  const { 
    moveWaterComponent, 
    deleteWaterComponent, 
    resizeWaterComponent,
    duplicateWaterComponent,
    waterConnectingFrom,
  } = useStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const typeInfo = componentTypes.find(t => t.value === component.type) || componentTypes[0];
  const defaultW = typeInfo.w;
  const defaultH = typeInfo.h;
  const w = component.customWidth || defaultW;
  const h = component.customHeight || defaultH;
  const { color } = typeInfo;
  const isManifold = component.type === 'manifold';

  const handleMouseDown = (e) => {
    if (e.target.closest('.port-button') || e.target.closest('.resize-handle')) return;
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    
    const canvas = document.querySelector('.water-canvas');
    const canvasRect = canvas?.getBoundingClientRect();
    
    dragOffset.current = {
      x: e.clientX - (canvasRect?.left || 0) - component.x,
      y: e.clientY - (canvasRect?.top || 0) - component.y,
    };
    
    const handleMouseMove = (e) => {
      if (!canvasRect) return;
      const newX = e.clientX - canvasRect.left - dragOffset.current.x;
      const newY = e.clientY - canvasRect.top - dragOffset.current.y;
      
      moveWaterComponent(
        component.id,
        Math.max(0, Math.min(newX, canvasRect.width - w)),
        Math.max(0, Math.min(newY, canvasRect.height - h))
      );
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = w;
    const startH = h;
    
    const handleResizeMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newW = Math.max(40, startW + deltaX);
      const newH = Math.max(30, startH + deltaY);
      resizeWaterComponent(component.id, newW, newH);
    };
    
    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const isSourceComponent = waterConnectingFrom === component.id;

  const renderPorts = () => {
    if (isManifold) {
      const leftPorts = [];
      const rightPorts = [];
      const bottomPorts = [];
      
      // 8 ports on left side (inlets) and 8 on right side (outlets)
      for (let i = 1; i <= 8; i++) {
        const spacing = h / 9;
        leftPorts.push(
          <PortButton
            key={`inlet-${i}`}
            portId={`inlet-${i}`}
            portType="inlet"
            componentId={component.id}
            isManifoldPort={true}
            style={{ left: -10, top: spacing * i - 8 }}
          />
        );
        rightPorts.push(
          <PortButton
            key={`outlet-${i}`}
            portId={`outlet-${i}`}
            portType="outlet"
            componentId={component.id}
            isManifoldPort={true}
            style={{ right: -10, top: spacing * i - 8 }}
          />
        );
      }
      
      // 2 bottom ports - 1 inlet, 1 outlet
      bottomPorts.push(
        <PortButton
          key="inlet-bottom"
          portId="inlet-bottom"
          portType="inlet"
          componentId={component.id}
          isManifoldPort={true}
          style={{ bottom: -10, left: w / 3 - 8 }}
        />
      );
      bottomPorts.push(
        <PortButton
          key="outlet-bottom"
          portId="outlet-bottom"
          portType="outlet"
          componentId={component.id}
          isManifoldPort={true}
          style={{ bottom: -10, right: w / 3 - 8 }}
        />
      );
      
      return [...leftPorts, ...rightPorts, ...bottomPorts];
    } else if (component.type === 'koolance') {
      // Koolance has both ports at the bottom
      return (
        <>
          <PortButton
            portId="inlet"
            portType="inlet"
            componentId={component.id}
            style={{ bottom: -12, left: '30%', transform: 'translateX(-50%)' }}
          />
          <PortButton
            portId="outlet"
            portType="outlet"
            componentId={component.id}
            style={{ bottom: -12, left: '70%', transform: 'translateX(-50%)' }}
          />
        </>
      );
    } else {
      return (
        <>
          <PortButton
            portId="inlet"
            portType="inlet"
            componentId={component.id}
            style={{ top: -12, left: '50%', transform: 'translateX(-50%)' }}
          />
          <PortButton
            portId="outlet"
            portType="outlet"
            componentId={component.id}
            style={{ bottom: -12, left: '50%', transform: 'translateX(-50%)' }}
          />
        </>
      );
    }
  };

  return (
    <div
      className={`absolute cursor-grab select-none group ${isDragging ? 'cursor-grabbing z-50' : 'z-10'}`}
      style={{ left: component.x, top: component.y, width: w, height: h }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className={`w-full h-full rounded-lg border-2 flex flex-col items-center justify-center relative transition-all ${
          isSourceComponent ? 'ring-2 ring-white animate-pulse' : ''
        }`}
        style={{ borderColor: color, backgroundColor: `${color}25` }}
      >
        {/* Delete button */}
        <button
          onClick={() => deleteWaterComponent(component.id)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          title="Delete"
        >
          <Trash2 size={12} className="text-white" />
        </button>

        {/* Duplicate button */}
        <button
          onClick={() => duplicateWaterComponent(component.id)}
          className="absolute -top-2 -left-2 w-5 h-5 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          title="Duplicate"
        >
          <Copy size={10} className="text-white" />
        </button>

        {renderPorts()}

        <Droplets size={Math.min(24, Math.max(12, Math.min(w, h) / 4))} style={{ color }} />
        <span 
          className="font-medium text-center px-1 truncate w-full text-white mt-1"
          style={{ fontSize: `${Math.min(14, Math.max(8, w / 10))}px` }}
        >
          {component.name}
        </span>
        <span 
          className="text-slate-400 text-center truncate w-full"
          style={{ fontSize: `${Math.min(12, Math.max(7, w / 12))}px` }}
        >
          {typeInfo.label}
        </span>

        {/* Resize Handle */}
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-30"
          onMouseDown={handleResizeStart}
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${color} 50%)`,
            borderBottomRightRadius: '6px',
          }}
        />
      </div>
    </div>
  );
}

function getPortPosition(comp, portId) {
  const typeInfo = componentTypes.find(t => t.value === comp.type) || componentTypes[0];
  const w = comp.customWidth || typeInfo.w;
  const h = comp.customHeight || typeInfo.h;
  const isManifold = comp.type === 'manifold';
  const isKoolance = comp.type === 'koolance';

  if (isManifold) {
    const spacing = h / 9;
    
    // Left side inlets (numbered 1-8)
    if (portId.startsWith('inlet-') && !portId.includes('bottom')) {
      const num = parseInt(portId.split('-')[1]);
      return { x: comp.x, y: comp.y + spacing * num };
    }
    // Right side outlets (numbered 1-8)
    else if (portId.startsWith('outlet-') && !portId.includes('bottom')) {
      const num = parseInt(portId.split('-')[1]);
      return { x: comp.x + w, y: comp.y + spacing * num };
    }
    // Bottom ports - 1 inlet, 1 outlet
    else if (portId === 'inlet-bottom') {
      return { x: comp.x + w / 3, y: comp.y + h };
    } else if (portId === 'outlet-bottom') {
      return { x: comp.x + (w * 2) / 3, y: comp.y + h };
    }
  }

  // Koolance has both ports at the bottom
  if (isKoolance) {
    if (portId === 'inlet') {
      return { x: comp.x + w * 0.3, y: comp.y + h };
    } else {
      return { x: comp.x + w * 0.7, y: comp.y + h };
    }
  }
  
  // Default: inlet on top, outlet on bottom
  if (portId === 'inlet' || portId.startsWith('inlet')) {
    return { x: comp.x + w / 2, y: comp.y };
  } else {
    return { x: comp.x + w / 2, y: comp.y + h };
  }
}

function WaterChassisLayout() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      style={{ zIndex: 1 }}
    >
      {/* Main case frame */}
      <rect x="10" y="10" width="780" height="580" rx="8" 
        fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="2" />

      {/* Board Area (Motherboard) */}
      <g id="board-area">
        <rect x="100" y="30" width="250" height="180" rx="6" 
          fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="225" y="125" fill="rgba(59,130,246,0.5)" fontSize="14" fontFamily="monospace" textAnchor="middle">BOARD</text>
      </g>

      {/* 7 PCI Slots */}
      <g id="pci-slots">
        <text x="100" y="235" fill="rgba(139,92,246,0.5)" fontSize="11" fontFamily="monospace">PCI SLOTS</text>
        
        <rect x="100" y="245" width="500" height="32" rx="4" 
          fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="350" y="266" fill="rgba(139,92,246,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">PCI Slot 1</text>
        
        <rect x="100" y="282" width="500" height="32" rx="4" 
          fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="350" y="303" fill="rgba(139,92,246,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">PCI Slot 2</text>
        
        <rect x="100" y="319" width="500" height="32" rx="4" 
          fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="350" y="340" fill="rgba(139,92,246,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">PCI Slot 3</text>
        
        <rect x="100" y="356" width="500" height="32" rx="4" 
          fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="350" y="377" fill="rgba(139,92,246,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">PCI Slot 4</text>
        
        <rect x="100" y="393" width="500" height="32" rx="4" 
          fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="350" y="414" fill="rgba(139,92,246,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">PCI Slot 5</text>
        
        <rect x="100" y="430" width="500" height="32" rx="4" 
          fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="350" y="451" fill="rgba(139,92,246,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">PCI Slot 6</text>
        
        <rect x="100" y="467" width="500" height="32" rx="4" 
          fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="350" y="488" fill="rgba(139,92,246,0.4)" fontSize="9" fontFamily="monospace" textAnchor="middle">PCI Slot 7</text>
      </g>

      {/* PSU Chamber */}
      <g id="psu-chamber">
        <line x1="20" y1="520" x2="780" y2="520" stroke="rgba(100,116,139,0.5)" strokeWidth="2" />
        <rect x="20" y="525" width="760" height="60" rx="4" 
          fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.2)" strokeWidth="1" />
        <text x="400" y="560" fill="rgba(100,116,139,0.4)" fontSize="12" fontFamily="monospace" textAnchor="middle">PSU CHAMBER</text>
      </g>
    </svg>
  );
}

function WaterFlowLines() {
  const { waterComponents, waterConnections, removeWaterConnection } = useStore();

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      <defs>
        <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
        </marker>
      </defs>
      
      {waterConnections.map((conn) => {
        const fromComp = waterComponents.find(c => c.id === conn.from);
        const toComp = waterComponents.find(c => c.id === conn.to);
        if (!fromComp || !toComp) return null;

        const startPos = getPortPosition(fromComp, conn.fromPort);
        const endPos = getPortPosition(toComp, conn.toPort);

        const startX = startPos.x;
        const startY = startPos.y;
        const endX = endPos.x;
        const endY = endPos.y;

        const midY = (startY + endY) / 2;
        const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

        return (
          <g key={conn.id} style={{ pointerEvents: 'all' }}>
            <path
              d={path}
              stroke="transparent"
              strokeWidth={15}
              fill="none"
              style={{ cursor: 'pointer' }}
              onClick={() => removeWaterConnection(conn.id)}
            />
            <path
              d={path}
              stroke="url(#waterFlow)"
              strokeWidth={4}
              fill="none"
              markerEnd="url(#arrowhead)"
              className="water-flow-line"
            />
            <path
              d={path}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={2}
              fill="none"
              strokeDasharray="8 12"
              className="water-flow-animated"
            />
          </g>
        );
      })}
    </svg>
  );
}

function WaterPalette() {
  const { addWaterComponent } = useStore();

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('waterComponentType', type.value);
    e.dataTransfer.setData('waterComponentLabel', type.label);
  };

  return (
    <div className="w-48 bg-slate-800/90 border-r border-slate-700 p-3 flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Components</h3>
      {componentTypes.map(type => (
        <div
          key={type.value}
          draggable
          onDragStart={(e) => handleDragStart(e, type)}
          className="flex items-center gap-2 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg cursor-grab border border-slate-600 hover:border-slate-500 transition-colors"
          style={{ borderLeftColor: type.color, borderLeftWidth: 3 }}
        >
          <Droplets size={16} style={{ color: type.color }} />
          <span className="text-sm text-white">{type.label}</span>
        </div>
      ))}
    </div>
  );
}

export function WatercoolingSection() {
  const { 
    waterComponents, 
    waterConnections, 
    addWaterComponent, 
    isLoopComplete, 
    clearWaterConnecting, 
    waterConnectingFrom,
    exportWaterLoop,
    importWaterLoop,
    clearWaterLoop,
  } = useStore();
  const canvasRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('waterComponentType');
    const label = e.dataTransfer.getData('waterComponentLabel');
    if (!type) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 40;

    addWaterComponent({
      type,
      name: label,
      x: Math.max(0, x),
      y: Math.max(0, y),
    });
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleCanvasClick = () => {
    if (waterConnectingFrom) clearWaterConnecting();
  };

  const handleExport = () => {
    const config = exportWaterLoop();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watercooling-loop.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const success = importWaterLoop(ev.target.result);
          if (!success) {
            alert('Failed to import. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (confirm('Clear all watercooling components?')) {
      clearWaterLoop();
    }
  };

  const loopComplete = isLoopComplete();

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Droplets className="text-cyan-400" size={22} />
            Watercooling Loop Builder
          </h2>
          <p className="text-sm text-slate-400">Drag components, click OUT then IN to connect</p>
        </div>
        <div className="flex items-center gap-2">
          {waterComponents.length > 0 && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
              loopComplete 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
            }`}>
              {loopComplete ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {loopComplete ? 'Loop Complete!' : 'Loop Incomplete'}
            </div>
          )}
          
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm text-white"
            title="Export Loop"
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white"
            title="Import Loop"
          >
            <Upload size={14} />
            Import
          </button>
          {waterComponents.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 rounded-lg text-sm text-red-400"
              title="Clear All"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <WaterPalette />
        
        <div 
          ref={canvasRef}
          className="water-canvas flex-1 relative bg-slate-900/50 overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
          style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <WaterChassisLayout />

          {waterComponents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center bg-slate-900/80 p-6 rounded-xl">
                <Droplets size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-lg text-slate-500">Drag components here</p>
                <p className="text-sm text-slate-600 mt-2">Click <strong>OUT</strong> port, then click <strong>IN</strong> port to connect</p>
              </div>
            </div>
          )}

          <WaterFlowLines />
          
          {waterComponents.map(comp => (
            <WaterBlock key={comp.id} component={comp} />
          ))}
        </div>

        {/* Instructions Panel */}
        <div className="w-56 bg-slate-800/90 border-l border-slate-700 p-3 text-xs text-slate-400">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Info size={14} />
            How to Connect
          </h3>
          <ol className="space-y-2">
            <li><span className="text-cyan-400">1.</span> Drag components from the left</li>
            <li><span className="text-cyan-400">2.</span> Click the <strong className="text-orange-400">OUT</strong> port on source</li>
            <li><span className="text-cyan-400">3.</span> Click the <strong className="text-cyan-400">IN</strong> port on target</li>
            <li><span className="text-cyan-400">4.</span> Complete the loop back to start</li>
          </ol>
          <div className="mt-4 p-2 bg-slate-900/50 rounded border border-slate-700">
            <p className="text-slate-500">
              <strong className="text-cyan-400">IN</strong> = Water enters<br/>
              <strong className="text-orange-400">OUT</strong> = Water exits
            </p>
          </div>
          <div className="mt-3">
            <p className="text-slate-500">Components: {waterComponents.length}</p>
            <p className="text-slate-500">Connections: {waterConnections.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
