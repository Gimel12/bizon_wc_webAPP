import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Save } from 'lucide-react';

const componentTypes = [
  { value: 'pump', label: 'Pump' },
  { value: 'reservoir', label: 'Reservoir' },
  { value: 'cpu-block', label: 'CPU Block' },
  { value: 'gpu-block', label: 'GPU Block' },
  { value: 'radiator', label: 'Radiator' },
  { value: 'fitting', label: 'Fitting/QDC' },
];

export function WaterComponentModal() {
  const { showWaterModal, closeWaterModal, addWaterComponent, updateWaterComponent, editingWaterComponent } = useStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState('pump');

  useEffect(() => {
    if (editingWaterComponent) {
      setName(editingWaterComponent.name);
      setType(editingWaterComponent.type);
    } else {
      setName('');
      setType('pump');
    }
  }, [editingWaterComponent, showWaterModal]);

  if (!showWaterModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingWaterComponent) {
      updateWaterComponent(editingWaterComponent.id, { name: name.trim(), type });
    } else {
      addWaterComponent({ name: name.trim(), type });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl border border-slate-600 shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">
            {editingWaterComponent ? 'Edit Component' : 'Add Watercooling Component'}
          </h2>
          <button onClick={closeWaterModal} className="p-1 hover:bg-slate-700 rounded-lg">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Component Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., GPU 1 EK Block"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Component Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              {componentTypes.map(ct => (
                <option key={ct.value} value={ct.value}>{ct.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeWaterModal}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {editingWaterComponent ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
