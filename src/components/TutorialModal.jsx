import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Save } from 'lucide-react';

const categories = ['General', 'GPU Waterblocks', 'CPU Waterblocks', 'Loop Assembly', 'Leak Testing', 'Maintenance', 'Troubleshooting'];

export function TutorialModal() {
  const { showTutorialModal, closeTutorialModal, addTutorial, updateTutorial, editingTutorial } = useStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('General');

  useEffect(() => {
    if (editingTutorial) {
      setTitle(editingTutorial.title);
      setDescription(editingTutorial.description || '');
      setVideoUrl(editingTutorial.videoUrl);
      setCategory(editingTutorial.category || 'General');
    } else {
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setCategory('General');
    }
  }, [editingTutorial, showTutorialModal]);

  if (!showTutorialModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) return;

    const data = { 
      title: title.trim(), 
      description: description.trim(), 
      videoUrl: videoUrl.trim(), 
      category 
    };

    if (editingTutorial) {
      updateTutorial(editingTutorial.id, data);
    } else {
      addTutorial(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl border border-slate-600 shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">
            {editingTutorial ? 'Edit Tutorial' : 'Add Tutorial'}
          </h2>
          <button onClick={closeTutorialModal} className="p-1 hover:bg-slate-700 rounded-lg">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Video Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How to Install GPU Waterblock"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Video URL</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">Supports YouTube, Vimeo, or direct video URLs</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this tutorial covers..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeTutorialModal}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !videoUrl.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 rounded-lg text-white font-medium flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {editingTutorial ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
