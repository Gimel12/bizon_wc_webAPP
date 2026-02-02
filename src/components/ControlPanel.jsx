import { useStore } from '../store/useStore';
import { 
  Zap, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';

export function ControlPanel() {
  const { 
    placedComponents, 
    cables,
    exportConfig, 
    importConfig,
    resetConfig,
    getPsuStats,
    getTotalPower,
    getTotalCapacity,
    showCables,
    toggleCables,
    viewMode,
    setViewMode,
  } = useStore();

  const psuStats = getPsuStats();
  const totalPower = getTotalPower();
  const totalCapacity = getTotalCapacity();
  const unconnectedComponents = placedComponents.filter(
    c => c.type !== 'psu' && !c.connectedPsu && c.watts > 0
  );

  const handleExport = () => {
    const config = exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zx5500-config.json';
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
          const success = importConfig(ev.target.result);
          if (!success) {
            alert('Failed to import configuration. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getLoadColor = (percentage) => {
    if (percentage < 50) return 'text-green-400';
    if (percentage < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLoadBgColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-80 bg-slate-800/90 backdrop-blur border-l border-slate-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-900/50">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="text-yellow-400" size={24} />
          Bizon ZX5500 Builder
        </h1>
        <p className="text-sm text-slate-400 mt-1">Watercooled Workstation Configurator</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Power Distribution */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap size={16} />
            Power Distribution
          </h2>
          
          <div className="space-y-3">
            {psuStats.length === 0 ? (
              <div className="text-center py-4 border border-dashed border-slate-600 rounded-lg">
                <p className="text-xs text-slate-500">No PSUs placed yet</p>
                <p className="text-xs text-slate-600 mt-1">Drag a PSU block to the canvas</p>
              </div>
            ) : (
              psuStats.map((psu, index) => (
                <div key={psu.id} className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium truncate" style={{ color: psu.color }}>
                      {psu.name}
                    </span>
                    <span className={`text-sm font-mono ${getLoadColor(psu.percentage)}`}>
                      {psu.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, psu.percentage)}%`, backgroundColor: psu.color }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">{psu.usedWatts || 0}W used</span>
                    <span className="text-xs text-slate-500">{psu.watts}W max</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total Power Summary */}
          <div className="mt-4 p-3 bg-slate-900/80 rounded-lg border border-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Total Power Used</span>
              <span className="text-lg font-bold text-white">{totalPower}W</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-slate-400">Total Capacity</span>
              <span className="text-sm text-slate-400">{totalCapacity}W</span>
            </div>
            {totalCapacity > 0 && (
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
                  style={{ width: `${Math.min(100, (totalPower / totalCapacity) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Warnings/Status */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Info size={16} />
            Status
          </h2>
          
          {unconnectedComponents.length > 0 ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-yellow-400 font-medium">Unconnected Components</p>
                  <ul className="mt-1 space-y-1">
                    {unconnectedComponents.map(c => (
                      <li key={c.id} className="text-xs text-yellow-400/80">
                        • {c.name} ({c.watts}W)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={16} />
                <p className="text-sm text-green-400">All components connected!</p>
              </div>
            </div>
          )}

          {/* Cable count */}
          <div className="mt-3 text-sm text-slate-400">
            <span className="font-medium">{cables.length}</span> power cables connected
          </div>
        </div>

        {/* View Options */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers size={16} />
            View Options
          </h2>
          
          <div className="space-y-2">
            <button
              onClick={toggleCables}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                showCables 
                  ? 'bg-blue-600/20 border border-blue-500/50 text-blue-400' 
                  : 'bg-slate-700/50 border border-slate-600 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                {showCables ? <Eye size={16} /> : <EyeOff size={16} />}
                Power Cables
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800">
                {showCables ? 'Visible' : 'Hidden'}
              </span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('full')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                  viewMode === 'full'
                    ? 'bg-purple-600/20 border border-purple-500/50 text-purple-400'
                    : 'bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-white'
                }`}
              >
                Full View
              </button>
              <button
                onClick={() => setViewMode('clean')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                  viewMode === 'clean'
                    ? 'bg-purple-600/20 border border-purple-500/50 text-purple-400'
                    : 'bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-white'
                }`}
              >
                Clean View
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            How to Build
          </h2>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-green-400">1.</span>
              <span><strong>Create blocks</strong> in the left palette with custom wattage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">2.</span>
              <span><strong>Drag</strong> PSU blocks to canvas first</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">3.</span>
              <span><strong>Drag</strong> other components to canvas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">4.</span>
              <span><strong>Double-click</strong> PSU to start wiring</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">5.</span>
              <span><strong>Click</strong> component to connect power</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span>Hover + click <strong>X</strong> to delete blocks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span><strong>Click cable</strong> to remove connection</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={handleImport}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload size={16} />
            Import
          </button>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset all configurations to default?')) {
              resetConfig();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded-lg text-sm font-medium transition-colors"
        >
          <RotateCcw size={16} />
          Reset Configuration
        </button>
      </div>
    </div>
  );
}
