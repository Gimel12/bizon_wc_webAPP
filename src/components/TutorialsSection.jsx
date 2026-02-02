import { useStore } from '../store/useStore';
import { Plus, Trash2, Edit2, Play, Video, BookOpen } from 'lucide-react';

const categories = ['General', 'GPU Waterblocks', 'CPU Waterblocks', 'Loop Assembly', 'Leak Testing', 'Maintenance', 'Troubleshooting'];

function getVideoEmbed(url) {
  if (!url) return { type: null, embedUrl: null };
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = null;
    
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    
    return videoId 
      ? { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${videoId}` }
      : { type: 'unknown', embedUrl: url };
  }
  
  // Loom
  if (url.includes('loom.com')) {
    let videoId = null;
    
    if (url.includes('loom.com/share/')) {
      videoId = url.split('loom.com/share/')[1]?.split('?')[0];
    } else if (url.includes('loom.com/embed/')) {
      videoId = url.split('loom.com/embed/')[1]?.split('?')[0];
    }
    
    return videoId
      ? { type: 'loom', embedUrl: `https://www.loom.com/embed/${videoId}` }
      : { type: 'unknown', embedUrl: url };
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId
      ? { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${videoId}` }
      : { type: 'unknown', embedUrl: url };
  }
  
  return { type: 'unknown', embedUrl: url };
}

function TutorialCard({ tutorial }) {
  const { openTutorialModal, deleteTutorial } = useStore();
  const { type, embedUrl } = getVideoEmbed(tutorial.videoUrl);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-colors group">
      <div className="aspect-video bg-slate-900 relative">
        {embedUrl && type !== 'unknown' ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={tutorial.title}
            frameBorder="0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video size={48} className="text-slate-600" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-xs px-2 py-0.5 bg-blue-600/30 text-blue-400 rounded-full">
              {tutorial.category}
            </span>
            <h3 className="text-lg font-semibold text-white mt-2">{tutorial.title}</h3>
            {tutorial.description && (
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{tutorial.description}</p>
            )}
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openTutorialModal(tutorial)}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded"
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this tutorial?')) {
                  deleteTutorial(tutorial.id);
                }
              }}
              className="p-1.5 bg-red-600/50 hover:bg-red-600 rounded"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TutorialsSection() {
  const { tutorials, openTutorialModal } = useStore();

  const groupedTutorials = tutorials.reduce((acc, tutorial) => {
    const cat = tutorial.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tutorial);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="text-blue-400" size={22} />
            Training Tutorials
          </h2>
          <p className="text-sm text-slate-400">Video guides for technicians</p>
        </div>
        <button
          onClick={() => openTutorialModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium"
        >
          <Plus size={18} />
          Add Tutorial
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tutorials.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-600 rounded-xl">
            <Video size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-lg text-slate-400 mb-2">No tutorials yet</p>
            <p className="text-sm text-slate-500 mb-4">Add video tutorials for your technicians</p>
            <button
              onClick={() => openTutorialModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            >
              Add First Tutorial
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTutorials).map(([category, categoryTutorials]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Play size={14} />
                  {category}
                  <span className="text-slate-600">({categoryTutorials.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTutorials.map(tutorial => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
