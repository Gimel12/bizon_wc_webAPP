import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Save } from 'lucide-react';

const componentTypes = [
  { value: 'motherboard', label: 'Motherboard' },
  { value: 'cpu', label: 'CPU' },
  { value: 'gpu', label: 'GPU' },
  { value: 'psu', label: 'PSU' },
  { value: 'ram', label: 'RAM' },
  { value: 'storage', label: 'Storage' },
  { value: 'pump', label: 'Water Pump' },
  { value: 'radiator', label: 'Radiator' },
  { value: 'fans', label: 'Fans' },
  { value: 'reservoir', label: 'Reservoir' },
  { value: 'aio', label: 'AIO Cooler' },
  { value: 'controller', label: 'Controller' },
  { value: 'custom', label: 'Custom/Other' },
];

export function CreateBlockModal() {
  const { showCreateModal, closeCreateModal, createBlock, updateBlock, editingBlock } = useStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState('custom');
  const [watts, setWatts] = useState('0');

  useEffect(() => {
    if (editingBlock) {
      setName(editingBlock.name);
      setType(editingBlock.type);
      setWatts(String(editingBlock.watts));
    } else {
      setName('');
      setType('custom');
      setWatts('0');
    }
  }, [editingBlock, showCreateModal]);

  if (!showCreateModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const blockData = { name: name.trim(), type, watts };
    
    if (editingBlock) {
      updateBlock(editingBlock.id, blockData);
    } else {
      createBlock(blockData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl border border-slate-600 shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">
            {editingBlock ? 'Edit Block' : 'Create Custom Block'}
          </h2>
          <button
            onClick={closeCreateModal}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Block Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., RTX 4090 FE"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Component Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {componentTypes.map(ct => (
                <option key={ct.value} value={ct.value}>{ct.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Power Consumption (Watts)
            </label>
            <input
              type="number"
              value={watts}
              onChange={(e) => setWatts(e.target.value)}
              min="0"
              max="2000"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              {type === 'psu' ? 'For PSUs, this is the max capacity' : 'Power draw of this component'}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeCreateModal}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {editingBlock ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
