import { useStore } from '../store/useStore';
import { ComponentBlock } from './ComponentBlock';
import { CableLayer } from './CableLayer';
import { ChassisLayout } from './ChassisLayout';

export function PCCase() {
  const { placedComponents, mode, connectingFrom, placeComponent, setMode, clearSelection } = useStore();

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const block = JSON.parse(data);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - 50;
      const y = e.clientY - rect.top - 30;
      placeComponent(block, Math.max(0, x), Math.max(0, y));
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      if (mode === 'connecting') {
        setMode('select');
      }
      clearSelection();
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-4 border-slate-700 overflow-hidden shadow-2xl"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Chassis Layout Background */}
      <ChassisLayout />

      {/* Empty state hint */}
      {placedComponents.length === 0 && (
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="text-center p-6 bg-slate-800/80 rounded-xl border border-slate-600 backdrop-blur-sm">
            <p className="text-lg font-bold text-slate-300 mb-1">Drop Components Here</p>
            <p className="text-sm text-slate-400">Drag blocks from the palette to place them in the chassis</p>
          </div>
        </div>
      )}

      {/* SVG Layer for cables */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <CableLayer />
      </svg>

      {/* Components layer */}
      <div 
        className="absolute inset-0"
        onClick={handleCanvasClick}
        style={{ zIndex: 10 }}
      >
        {placedComponents.map((component) => (
          <ComponentBlock 
            key={component.id} 
            component={component}
            isConnecting={mode === 'connecting'}
            isSource={connectingFrom === component.id}
          />
        ))}
      </div>

      {/* Connection mode indicator */}
      {mode === 'connecting' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-black px-4 py-2 rounded-lg font-semibold text-sm z-50 animate-pulse">
          Click a component to connect power cable (ESC to cancel)
        </div>
      )}
    </div>
  );
}
