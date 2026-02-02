import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Cpu, HardDrive, Fan, Droplets, Box, Zap, Server, CircuitBoard, MemoryStick, Trash2, Wind } from 'lucide-react';

const componentIcons = {
  psu: Zap,
  cpu: Cpu,
  gpu: Server,
  motherboard: CircuitBoard,
  pump: Droplets,
  radiator: Fan,
  reservoir: Box,
  storage: HardDrive,
  fans: Wind,
  ram: MemoryStick,
  aio: Fan,
  custom: Box,
  controller: Box,
};

const componentSizes = {
  psu: { w: 110, h: 70 },
  motherboard: { w: 120, h: 90 },
  cpu: { w: 90, h: 60 },
  gpu: { w: 110, h: 55 },
  pump: { w: 70, h: 60 },
  radiator: { w: 130, h: 45 },
  reservoir: { w: 55, h: 80 },
  storage: { w: 70, h: 35 },
  fans: { w: 60, h: 50 },
  ram: { w: 70, h: 35 },
  aio: { w: 90, h: 50 },
  custom: { w: 80, h: 50 },
  controller: { w: 70, h: 40 },
};

export function ComponentBlock({ component, isConnecting, isSource }) {
  const { 
    selectComponent, 
    selectedComponents, 
    startConnection, 
    completeConnection,
    moveComponent,
    moveSelectedComponents,
    resizeComponent,
    deleteComponent,
    placedComponents,
    mode,
    viewMode,
  } = useStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });

  const Icon = componentIcons[component.type] || Box;
  const defaultSize = componentSizes[component.type] || { w: 80, h: 50 };
  const size = {
    w: component.customWidth || defaultSize.w,
    h: component.customHeight || defaultSize.h,
  };
  const isSelected = selectedComponents.includes(component.id);
  const isPsu = component.type === 'psu';

  const getConnectionIndicator = () => {
    if (isPsu) return null;
    if (!component.connectedPsu) {
      return <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-500 animate-pulse" title="Not connected to PSU" />;
    }
    const connectedPsu = placedComponents.find(c => c.id === component.connectedPsu);
    return (
      <div 
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full" 
        style={{ backgroundColor: connectedPsu?.color || '#888' }}
        title={`Connected to ${connectedPsu?.name || 'PSU'}`} 
      />
    );
  };

  const handleMouseDown = (e) => {
    if (mode === 'connecting') return;
    if (e.target.closest('.resize-handle')) return;
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    lastPos.current = { x: e.clientX, y: e.clientY };

    // Handle selection (with shift for multi-select)
    const addToSelection = e.shiftKey;
    selectComponent(component.id, addToSelection);

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - lastPos.current.x;
      const deltaY = moveEvent.clientY - lastPos.current.y;
      lastPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };

      // Get current selection state from store
      const currentSelection = useStore.getState().selectedComponents;
      
      if (currentSelection.length > 1 && currentSelection.includes(component.id)) {
        moveSelectedComponents(deltaX, deltaY);
      } else {
        const parentRect = document.querySelector('.pc-case-container')?.getBoundingClientRect();
        if (!parentRect) return;
        const newX = moveEvent.clientX - parentRect.left - dragOffset.current.x;
        const newY = moveEvent.clientY - parentRect.top - dragOffset.current.y;
        moveComponent(component.id, Math.max(0, newX), Math.max(0, newY));
      }
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
    const startW = size.w;
    const startH = size.h;
    
    const handleResizeMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newW = Math.max(40, startW + deltaX);
      const newH = Math.max(25, startH + deltaY);
      resizeComponent(component.id, newW, newH);
    };
    
    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    // Only handle connection clicks here - selection is handled in handleMouseDown
    if (isConnecting && !isPsu) {
      completeConnection(component.id);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (isPsu) {
      startConnection(component.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteComponent(component.id);
  };

  return (
    <div
      className={`
        absolute cursor-grab select-none transition-all duration-150 group
        ${isDragging ? 'cursor-grabbing z-50 scale-105' : 'z-10'}
        ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900' : ''}
        ${isSource ? 'ring-2 ring-white animate-pulse' : ''}
        ${isConnecting && !isPsu ? 'hover:ring-2 hover:ring-green-400 cursor-pointer' : ''}
      `}
      style={{
        left: component.x,
        top: component.y,
        width: size.w,
        height: size.h,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        className={`
          w-full h-full rounded-lg border-2 flex flex-col items-center justify-center
          transition-colors duration-200 relative
          ${isPsu ? 'bg-opacity-30' : 'border-slate-500 bg-slate-700/80 hover:bg-slate-600/80'}
        `}
        style={isPsu ? { borderColor: component.color, backgroundColor: `${component.color}30` } : {}}
      >
        {viewMode === 'full' && getConnectionIndicator()}
        
        <button
          onClick={handleDelete}
          className="absolute -top-2 -left-2 w-5 h-5 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          title="Delete"
        >
          <Trash2 size={12} className="text-white" />
        </button>
        
        <Icon size={isPsu ? 20 : 16} className="text-slate-300" style={isPsu ? { color: component.color } : {}} />
        
        <span className="text-xs font-medium text-center px-1 truncate w-full text-slate-200">{component.name}</span>
        
        {viewMode === 'full' && component.watts > 0 && !isPsu && (
          <span className="text-xs text-slate-400">{component.watts}W</span>
        )}

        {viewMode === 'full' && isPsu && (
          <div className="absolute bottom-1 left-1 right-1">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{
                  width: `${component.watts > 0 ? Math.min(100, ((component.usedWatts || 0) / component.watts) * 100) : 0}%`,
                  backgroundColor: component.color,
                }}
              />
            </div>
            <span className="text-xs text-slate-400 block text-center">{component.usedWatts || 0}/{component.watts}W</span>
          </div>
        )}

        {/* Resize Handle */}
        <div
          className="resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-30"
          onMouseDown={handleResizeStart}
          style={{
            background: isPsu 
              ? `linear-gradient(135deg, transparent 50%, ${component.color} 50%)`
              : 'linear-gradient(135deg, transparent 50%, #64748b 50%)',
            borderBottomRightRadius: '4px',
          }}
        />
      </div>

      {isPsu && !isConnecting && (
        <div className="absolute -bottom-4 left-0 right-0 text-center">
          <span className="text-xs text-slate-500">Dbl-click to wire</span>
        </div>
      )}
    </div>
  );
}
