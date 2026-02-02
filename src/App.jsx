import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { PCCase } from './components/PCCase';
import { ControlPanel } from './components/ControlPanel';
import { BlockPalette } from './components/BlockPalette';
import { CreateBlockModal } from './components/CreateBlockModal';
import { WatercoolingSection } from './components/WatercoolingSection';
import { WaterComponentModal } from './components/WaterComponentModal';
import { TutorialsSection } from './components/TutorialsSection';
import { TutorialModal } from './components/TutorialModal';
import { ManualsSection } from './components/ManualsSection';
import { OrderPartsSection } from './components/OrderPartsSection';
import { KBSection } from './components/KBSection';
import { LoginPage } from './components/LoginPage';
import { Cpu, Droplets, BookOpen, FileText, ShoppingCart, BookMarked } from 'lucide-react';

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
        active 
          ? 'bg-slate-700 text-white border-b-2 border-blue-500' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

function App() {
  const { activeTab, setActiveTab, isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden">
      <Header />
      
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700 bg-slate-900">
        <TabButton 
          active={activeTab === 'builder'} 
          onClick={() => setActiveTab('builder')} 
          icon={Cpu} 
          label="PC Builder" 
        />
        <TabButton 
          active={activeTab === 'watercooling'} 
          onClick={() => setActiveTab('watercooling')} 
          icon={Droplets} 
          label="Watercooling Loop" 
        />
        <TabButton 
          active={activeTab === 'tutorials'} 
          onClick={() => setActiveTab('tutorials')} 
          icon={BookOpen} 
          label="Tutorials" 
        />
        <TabButton 
          active={activeTab === 'manuals'} 
          onClick={() => setActiveTab('manuals')} 
          icon={FileText} 
          label="Manuals" 
        />
        <TabButton 
          active={activeTab === 'orderparts'} 
          onClick={() => setActiveTab('orderparts')} 
          icon={ShoppingCart} 
          label="Order Parts" 
        />
        <TabButton 
          active={activeTab === 'kb'} 
          onClick={() => setActiveTab('kb')} 
          icon={BookMarked} 
          label="KB" 
        />
      </div>
      
      {/* Content Area */}
      {activeTab === 'builder' && (
        <div className="flex-1 flex overflow-hidden">
          <BlockPalette />
          <div className="flex-1 p-4 overflow-hidden">
            <div className="pc-case-container w-full h-full">
              <PCCase />
            </div>
          </div>
          <ControlPanel />
        </div>
      )}

      {activeTab === 'watercooling' && (
        <div className="flex-1 overflow-hidden">
          <WatercoolingSection />
        </div>
      )}

      {activeTab === 'tutorials' && (
        <div className="flex-1 overflow-hidden">
          <TutorialsSection />
        </div>
      )}

      {activeTab === 'manuals' && (
        <div className="flex-1 overflow-hidden">
          <ManualsSection />
        </div>
      )}

      {activeTab === 'orderparts' && (
        <div className="flex-1 overflow-hidden">
          <OrderPartsSection />
        </div>
      )}

      {activeTab === 'kb' && (
        <div className="flex-1 overflow-hidden">
          <KBSection />
        </div>
      )}
      
      {/* Modals */}
      <CreateBlockModal />
      <WaterComponentModal />
      <TutorialModal />
    </div>
  );
}

export default App
