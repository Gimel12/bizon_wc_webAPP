import { BookMarked, ExternalLink, Database, FileText, Users, Wrench } from 'lucide-react';

const NOTION_URL = 'https://bizonbizon.notion.site/aca171fc15154367a44dc4a80b5c1294?v=911643d843324b0b910faa4e48f18763';

const kbCategories = [
  { icon: Wrench, title: 'Installation Guides', description: 'Step-by-step installation procedures' },
  { icon: Database, title: 'Parts Database', description: 'Component specifications and compatibility' },
  { icon: FileText, title: 'Troubleshooting', description: 'Common issues and solutions' },
  { icon: Users, title: 'Best Practices', description: 'Recommended workflows and tips' },
];

export function KBSection() {
  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-4 border-b border-slate-700 bg-slate-900/80 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookMarked className="text-cyan-400" size={24} />
            Knowledge Base
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Documentation and resources
          </p>
        </div>
        <a
          href={NOTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium"
        >
          <ExternalLink size={16} />
          Open Knowledge Base
        </a>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8 text-center mb-8">
            <BookMarked size={64} className="mx-auto text-cyan-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Bizon Watercooling Knowledge Base</h3>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              Access comprehensive documentation, installation guides, troubleshooting tips, and best practices for watercooling workstations.
            </p>
            <a
              href={NOTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              <ExternalLink size={22} />
              Open in Notion
            </a>
          </div>

          {/* Categories */}
          <h4 className="text-lg font-semibold text-white mb-4">What you'll find:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kbCategories.map((cat, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex items-start gap-4">
                <div className="p-3 bg-cyan-600/20 rounded-lg">
                  <cat.icon size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-white">{cat.title}</h5>
                  <p className="text-sm text-slate-400 mt-1">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className="text-center text-slate-500 text-sm mt-8">
            The Knowledge Base opens in Notion for the best reading experience.
          </p>
        </div>
      </div>
    </div>
  );
}
