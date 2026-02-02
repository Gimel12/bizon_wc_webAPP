import { useState } from 'react';
import { BookOpen, ExternalLink, Search, Filter, ChevronDown, ChevronRight, Cpu, Monitor, Box, Layers } from 'lucide-react';

const manuals = [
  // Camino Series
  { id: 1, name: 'Camino A100', brand: 'EK', category: 'GPU Waterblocks', url: 'https://uploads-ssl.webflow.com/627a9ed158f3430181d090ef/6281350acf53a21e29cbe7d0_Assembly_Instruction_Waterblock_A100.pdf' },
  { id: 2, name: 'Camino A6000', brand: 'EK', category: 'GPU Waterblocks', url: 'https://uploads-ssl.webflow.com/627a9ed158f3430181d090ef/62813554d51b906517d405b7_Assembly_Instruction_Waterblock_A6000.pdf' },
  { id: 3, name: 'Camino 3090', brand: 'EK', category: 'GPU Waterblocks', url: 'https://uploads-ssl.webflow.com/627a9ed158f3430181d090ef/62813589cfef71cf24cdb864_Assembly_Instruction_Waterblock_Gigabyte3090.pdf' },
  
  // EK CPU Waterblocks
  { id: 4, name: 'EK STRX5 WB', brand: 'EK', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109825242.pdf' },
  { id: 5, name: 'EK Velocity Intel', brand: 'EK', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109810323.pdf' },
  { id: 6, name: 'EK-Velocity sTR4', brand: 'EK', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109810279.pdf' },
  { id: 7, name: 'EK-Quantum Velocity² D-RGB AM5', brand: 'EK', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109857694.pdf' },
  { id: 8, name: 'EK-Pro CPU Water Block LGA-4189', brand: 'EK Pro', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109844724.pdf' },
  { id: 9, name: 'EK-Pro CPU Water Block SP5', brand: 'EK Pro', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109904077.pdf' },
  { id: 10, name: 'EK-Pro CPU WB 4677', brand: 'EK Pro', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109861103.pdf' },
  { id: 11, name: 'EK-Pro CPU WB sTR - Nickel + Acetal', brand: 'EK Pro', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109895245.pdf' },
  { id: 12, name: 'EK-Quantum Magnitude sTRX5', brand: 'EK', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109825242.pdf' },
  { id: 13, name: 'EK-Annihilator Pro ILM s', brand: 'EK Pro', category: 'CPU Waterblocks', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109813911.pdf' },
  
  // EK RTX 30 Series
  { id: 14, name: 'EK-Quantum Vector Xtreme RTX 3080/3090', brand: 'EK', category: 'RTX 30 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109833032.pdf' },
  { id: 15, name: 'EK-Quantum Vector XC3 RTX 3070 D-RGB', brand: 'EK', category: 'RTX 30 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109836569.pdf' },
  { id: 16, name: 'EK-Quantum Vector RE RTX 3080/3080Ti/3090 Backplate', brand: 'EK', category: 'RTX 30 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109829998.pdf' },
  { id: 17, name: 'EK-Quantum Vector XC3 RTX 3080/3090 D-RGB', brand: 'EK', category: 'RTX 30 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109832646.pdf' },
  { id: 18, name: 'EK-Quantum Vector Trinity RTX 3080/3090 Backplate', brand: 'EK', category: 'RTX 30 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109833087.pdf' },
  { id: 19, name: 'EK-Quantum Vector Trinity RTX 3080/3090', brand: 'EK', category: 'RTX 30 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109833070.pdf' },
  { id: 20, name: 'EK-Quantum Vector FE RTX 3090 Ti D-RGB + Backplate', brand: 'EK', category: 'RTX 30 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109896884.pdf' },
  
  // EK RTX 40 Series
  { id: 21, name: 'EK-Quantum Vector² FE RTX 4080 D-RGB', brand: 'EK', category: 'RTX 40 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109901724.pdf' },
  { id: 22, name: 'EK-Quantum Vector² Strix/TUF RTX 4080 D-RGB', brand: 'EK', category: 'RTX 40 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109895955.pdf' },
  { id: 23, name: 'EK-Quantum Vector² Master RTX 4090 D-RGB', brand: 'EK', category: 'RTX 40 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109901670.pdf' },
  { id: 24, name: 'EK-Quantum Vector² AMP/Trinity RTX 4080 D-RGB', brand: 'EK', category: 'RTX 40 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109897270.pdf' },
  { id: 25, name: 'EK-Quantum Vector² FE RTX 4090 D-RGB', brand: 'EK', category: 'RTX 40 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109900703.pdf' },
  { id: 26, name: 'EK-PRO GPU WB AMP-Trinity RTX 4090 Rack Ni+Inox', brand: 'EK Pro', category: 'RTX 40 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109903957.pdf' },
  { id: 27, name: 'EK-PRO GPU WB AMP/Trinity RTX 4090 - Ni + Inox', brand: 'EK Pro', category: 'RTX 40 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109903971.pdf' },
  { id: 28, name: 'EK-PRO GPU WB RTX 4090 Windforce V2 – Nickel Inox', brand: 'EK Pro', category: 'RTX 40 Series', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109912843.pdf' },
  
  // EK Pro Server/Workstation
  { id: 29, name: 'EK-PRO GPU WB RTX A6000 Rack - Nickel + Inox', brand: 'EK Pro', category: 'Workstation GPUs', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109847930.pdf' },
  { id: 30, name: 'EK-PRO GPU WB RTX A100 Rack - Ni + Inox', brand: 'EK Pro', category: 'Workstation GPUs', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109847961.pdf' },
  { id: 31, name: 'EK-PRO GPU WB RTX 6000 ADA – Nickel + Inox', brand: 'EK Pro', category: 'Workstation GPUs', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109906651.pdf' },
  { id: 32, name: 'EK-PRO GPU WB RTX A6000 ADA Rack - Nickel + Inox', brand: 'EK Pro', category: 'Workstation GPUs', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109906668.pdf' },
  { id: 33, name: 'EK-PRO GPU WB H100 Rack - Nickel + Inox', brand: 'EK Pro', category: 'Workstation GPUs', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109908792.pdf' },
  
  // Manifolds & Accessories
  { id: 34, name: 'EK-Pro Manifold 2CPU 4GPU - Acetal', brand: 'EK Pro', category: 'Manifolds & Accessories', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109813485.pdf' },
  { id: 35, name: 'EK-Pro Manifold 2CPU 4GPU - Acetal (Alt)', brand: 'EK Pro', category: 'Manifolds & Accessories', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109813492.pdf' },
  { id: 36, name: 'EK-Scalar', brand: 'EK', category: 'Manifolds & Accessories', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109813973.pdf' },
  { id: 37, name: 'EK-Quantum Kinetic TBE D5 PWM', brand: 'EK', category: 'Manifolds & Accessories', url: 'https://www.ekwb.com/shop/EK-IM/EK-IM-3831109818381.pdf' },
  
  // Alphacool
  { id: 38, name: 'Alphacool ES H100 80GB HBM PCIe', brand: 'Alphacool', category: 'Workstation GPUs', url: 'https://download.alphacool.com/manual/13844_Alphacool_ES_H100_80GB_HBM_PCIe_Manual.pdf' },
  { id: 39, name: 'Alphacool ES RTX 5090 Reference 1-Slot', brand: 'Alphacool', category: 'RTX 50 Series', url: 'https://download.alphacool.com/manual/10262_Alphacool_ES_RTX_5090_Reference_1-Slot-Design_with_Backplate_Manual.pdf' },
  
  // Bykski
  { id: 40, name: 'Bykski RTX Pro 6000 Blackwell 600W', brand: 'Bykski', category: 'Workstation GPUs', url: 'https://www.bykski.us/products/bykski-durable-metal-pom-gpu-water-block-and-backplate-for-nvidia-rtx-pro-6000-blackwell-server-edition-n-rtxpro6000-sr-continuous-usage' },
];

const categories = [
  { name: 'CPU Waterblocks', icon: Cpu, color: '#3b82f6' },
  { name: 'GPU Waterblocks', icon: Monitor, color: '#8b5cf6' },
  { name: 'RTX 30 Series', icon: Monitor, color: '#22c55e' },
  { name: 'RTX 40 Series', icon: Monitor, color: '#f59e0b' },
  { name: 'RTX 50 Series', icon: Monitor, color: '#ec4899' },
  { name: 'Workstation GPUs', icon: Box, color: '#06b6d4' },
  { name: 'Manifolds & Accessories', icon: Layers, color: '#64748b' },
];

const brands = ['All', 'EK', 'EK Pro', 'Alphacool', 'Bykski'];

export function ManualsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [expandedCategories, setExpandedCategories] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
  );

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const filteredManuals = manuals.filter(manual => {
    const matchesSearch = manual.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manual.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || manual.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const groupedManuals = categories.map(category => ({
    ...category,
    manuals: filteredManuals.filter(m => m.category === category.name)
  })).filter(group => group.manuals.length > 0);

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-900/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="text-cyan-400" size={24} />
              Waterblock Manuals - 2026
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {manuals.length} instruction manuals available
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search manuals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="pl-9 pr-8 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Manual List */}
      <div className="flex-1 overflow-y-auto p-4">
        {groupedManuals.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>No manuals found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedManuals.map(group => (
              <div key={group.name} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(group.name)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${group.color}20` }}
                    >
                      <group.icon size={18} style={{ color: group.color }} />
                    </div>
                    <span className="font-semibold text-white">{group.name}</span>
                    <span className="text-sm text-slate-400">({group.manuals.length})</span>
                  </div>
                  {expandedCategories[group.name] ? (
                    <ChevronDown size={20} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={20} className="text-slate-400" />
                  )}
                </button>

                {/* Manual Items */}
                {expandedCategories[group.name] && (
                  <div className="border-t border-slate-700">
                    {group.manuals.map((manual, idx) => (
                      <a
                        key={manual.id}
                        href={manual.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between px-4 py-3 hover:bg-slate-700/30 transition-colors group ${
                          idx !== group.manuals.length - 1 ? 'border-b border-slate-700/50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                          <div>
                            <span className="text-white group-hover:text-cyan-400 transition-colors">
                              {manual.name}
                            </span>
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                              {manual.brand}
                            </span>
                          </div>
                        </div>
                        <ExternalLink size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700 bg-slate-900/80">
        <p className="text-xs text-slate-500 text-center">
          Click any manual to open the PDF in a new tab. All manuals are provided by their respective manufacturers.
        </p>
      </div>
    </div>
  );
}
