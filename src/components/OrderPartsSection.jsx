import { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Plus, Trash2, Edit2, ExternalLink, ShoppingCart, Package, 
  ChevronDown, ChevronRight, Server, Link, Hash, FileText, X
} from 'lucide-react';

const partCategories = [
  'Waterblocks', 'Fittings', 'Tubing', 'Radiators', 'Fans', 
  'Pumps', 'Reservoirs', 'PSUs', 'Cables', 'Thermal Paste', 
  'Coolant', 'Other'
];

function MachineModal() {
  const { showMachineModal, closeMachineModal, editingMachine, addMachine, updateMachine } = useStore();
  const [name, setName] = useState(editingMachine?.name || '');
  const [description, setDescription] = useState(editingMachine?.description || '');

  if (!showMachineModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    if (editingMachine) {
      updateMachine(editingMachine.id, { name, description });
    } else {
      addMachine({ name, description });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {editingMachine ? 'Edit Machine' : 'Add Machine'}
          </h3>
          <button onClick={closeMachineModal} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Machine Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., ZX5500, ZX9000"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 7-GPU Workstation"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={closeMachineModal}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium"
            >
              {editingMachine ? 'Update' : 'Add Machine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PartModal() {
  const { showPartModal, closePartModal, editingPart, selectedMachine, addPart, updatePart } = useStore();
  const [name, setName] = useState(editingPart?.name || '');
  const [category, setCategory] = useState(editingPart?.category || 'Waterblocks');
  const [link, setLink] = useState(editingPart?.link || '');
  const [quantity, setQuantity] = useState(editingPart?.quantity || 1);
  const [notes, setNotes] = useState(editingPart?.notes || '');

  if (!showPartModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    if (editingPart) {
      updatePart(selectedMachine, editingPart.id, { name, category, link, quantity, notes });
    } else {
      addPart(selectedMachine, { name, category, link, quantity, notes });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {editingPart ? 'Edit Part' : 'Add Part'}
          </h3>
          <button onClick={closePartModal} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Part Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., EK-Quantum Vector RTX 4090"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                {partCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Order Link</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={closePartModal}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium"
            >
              {editingPart ? 'Update' : 'Add Part'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MachineCard({ machine }) {
  const { openMachineModal, deleteMachine, openPartModal, deletePart } = useStore();
  const [expanded, setExpanded] = useState(true);

  const groupedParts = machine.parts.reduce((acc, part) => {
    if (!acc[part.category]) acc[part.category] = [];
    acc[part.category].push(part);
    return acc;
  }, {});

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
          <Server size={20} className="text-cyan-400" />
          <div>
            <h3 className="font-semibold text-white">{machine.name}</h3>
            {machine.description && <p className="text-sm text-slate-400">{machine.description}</p>}
          </div>
          <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full">
            {machine.parts.length} parts
          </span>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openPartModal(machine.id)}
            className="p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-white"
            title="Add Part"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => openMachineModal(machine)}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-white"
            title="Edit Machine"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${machine.name}" and all its parts?`)) {
                deleteMachine(machine.id);
              }
            }}
            className="p-1.5 bg-red-600/50 hover:bg-red-600 rounded text-white"
            title="Delete Machine"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-700">
          {machine.parts.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <Package size={32} className="mx-auto mb-2 opacity-50" />
              <p>No parts added yet</p>
              <button
                onClick={() => openPartModal(machine.id)}
                className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 mx-auto"
              >
                <Plus size={14} /> Add first part
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {Object.entries(groupedParts).map(([category, parts]) => (
                <div key={category} className="p-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
                  <div className="space-y-1">
                    {parts.map(part => (
                      <div 
                        key={part.id}
                        className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-xs px-1.5 py-0.5 bg-cyan-600/30 text-cyan-400 rounded">
                            x{part.quantity}
                          </span>
                          <span className="text-white truncate">{part.name}</span>
                          {part.notes && (
                            <span className="text-xs text-slate-500 truncate hidden sm:inline">
                              ({part.notes})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {part.link && (
                            <a
                              href={part.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-green-600/50 hover:bg-green-600 rounded text-white"
                              title="Open Order Link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                          <button
                            onClick={() => openPartModal(machine.id, part)}
                            className="p-1.5 bg-slate-600 hover:bg-slate-500 rounded text-white"
                            title="Edit Part"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${part.name}"?`)) {
                                deletePart(machine.id, part.id);
                              }
                            }}
                            className="p-1.5 bg-red-600/50 hover:bg-red-600 rounded text-white"
                            title="Delete Part"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function OrderPartsSection() {
  const { machines, openMachineModal } = useStore();

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-4 border-b border-slate-700 bg-slate-900/80 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="text-cyan-400" size={24} />
            Order Parts
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Organize parts by machine for easy ordering
          </p>
        </div>
        <button
          onClick={() => openMachineModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium"
        >
          <Plus size={18} />
          Add Machine
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {machines.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-600 rounded-xl">
            <Server size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-lg text-slate-400 mb-2">No machines yet</p>
            <p className="text-sm text-slate-500 mb-4">Add a machine to start organizing parts</p>
            <button
              onClick={() => openMachineModal()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white"
            >
              Add First Machine
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {machines.map(machine => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}
      </div>

      <MachineModal />
      <PartModal />
    </div>
  );
}
