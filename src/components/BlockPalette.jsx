import { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Plus, Cpu, Server, Zap, HardDrive, Fan, Droplets, Box, 
  CircuitBoard, MemoryStick, Trash2, Edit2, Wind, Package, ChevronDown, ChevronUp
} from 'lucide-react';

const typeIcons = {
  motherboard: CircuitBoard,
  cpu: Cpu,
  gpu: Server,
  psu: Zap,
  ram: MemoryStick,
  storage: HardDrive,
  pump: Droplets,
  radiator: Fan,
  fans: Wind,
  reservoir: Box,
  aio: Fan,
  custom: Box,
  controller: Box,
};

const typeColors = {
  motherboard: 'bg-emerald-600',
  cpu: 'bg-blue-600',
  gpu: 'bg-purple-600',
  psu: 'bg-yellow-600',
  ram: 'bg-cyan-600',
  storage: 'bg-slate-600',
  pump: 'bg-teal-600',
  radiator: 'bg-sky-600',
  fans: 'bg-indigo-600',
  reservoir: 'bg-cyan-700',
  aio: 'bg-violet-600',
  custom: 'bg-pink-600',
  controller: 'bg-orange-600',
};

function BlockItem({ block }) {
  const { openCreateModal, deleteBlock } = useStore();
  const Icon = typeIcons[block.type] || Box;
  const bgColor = typeColors[block.type] || 'bg-slate-600';

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    openCreateModal(block);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm(`Delete "${block.name}" block?`)) {
      deleteBlock(block.id);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        ${bgColor} rounded-lg p-2 cursor-grab active:cursor-grabbing
        hover:brightness-110 transition-all duration-150
        border-2 border-transparent hover:border-white/30
        flex flex-col items-center gap-0.5 relative group
      `}
    >
      <Icon size={20} className="text-white" />
      <span className="text-xs font-medium text-white text-center truncate w-full">
        {block.name}
      </span>
      <span className="text-xs text-white/70">{block.watts}W</span>
      
      {/* Edit/Delete buttons - show on hover */}
      <div className="absolute top-0.5 right-0.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-1 bg-white/20 rounded hover:bg-white/40"
          title="Edit block"
        >
          <Edit2 size={10} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 bg-red-500/50 rounded hover:bg-red-500"
          title="Delete block"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
}

export function BlockPalette() {
  const { blockTemplates, openCreateModal, premadeConfigurations, loadPremade } = useStore();
  const [showPremades, setShowPremades] = useState(true);

  const handleLoadPremade = (premadeId) => {
    if (confirm('This will replace your current build. Continue?')) {
      loadPremade(premadeId);
    }
  };

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden">
      {/* Premades Section */}
      <div className="border-b border-slate-700">
        <button
          onClick={() => setShowPremades(!showPremades)}
          className="w-full p-3 bg-slate-900 flex items-center justify-between hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Package size={16} className="text-cyan-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Premades</span>
          </div>
          {showPremades ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        
        {showPremades && (
          <div className="p-2 bg-slate-850 space-y-1.5">
            {premadeConfigurations.map(premade => (
              <button
                key={premade.id}
                onClick={() => handleLoadPremade(premade.id)}
                className="w-full p-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg hover:border-cyan-400 hover:from-cyan-600/30 hover:to-blue-600/30 transition-all text-left group"
              >
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-cyan-400" />
                  <span className="text-xs font-semibold text-white truncate">{premade.name}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 truncate">{premade.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Block Palette Header */}
      <div className="p-3 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Block Palette</h2>
            <p className="text-xs text-slate-400 mt-0.5">Drag blocks to canvas</p>
          </div>
          <button
            onClick={() => openCreateModal()}
            className="p-1.5 bg-green-600 hover:bg-green-500 rounded text-white"
            title="Create New Block"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {blockTemplates.map(block => (
            <BlockItem key={block.id} block={block} />
          ))}
        </div>
        
        {blockTemplates.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-lg">
            <p className="text-xs text-slate-500">No blocks available</p>
            <button
              onClick={() => openCreateModal()}
              className="mt-2 text-xs text-green-400 hover:text-green-300 flex items-center gap-1 mx-auto"
            >
              <Plus size={12} /> Create one
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-3 border-t border-slate-700 bg-slate-900/50">
        <p className="text-xs text-slate-500">
          <span className="text-yellow-400">Tip:</span> Hover over blocks to edit or delete them
        </p>
      </div>
    </div>
  );
}
