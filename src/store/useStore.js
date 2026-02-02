import { create } from 'zustand';

const PSU_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const users = [
  { id: 1, username: 'ruben', password: 'Havana12??', role: 'admin', name: 'Ruben' },
];

// Helper functions for localStorage persistence
const getUserDataKey = (userId) => `bizon_hub_user_${userId}`;

const saveUserData = (userId, data) => {
  try {
    localStorage.setItem(getUserDataKey(userId), JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user data:', e);
  }
};

const loadUserData = (userId) => {
  try {
    const data = localStorage.getItem(getUserDataKey(userId));
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load user data:', e);
    return null;
  }
};

const premadeConfigurations = [
  {
    id: 'zx5500-koolance-7gpu',
    name: 'ZX5500 Koolance 7x 600W GPUs',
    description: '7 GPUs, CPU Block, 4 PSUs, Full Fan Setup',
    components: [
      { type: 'cpu', name: 'CPU Block', watts: 400, zone: 'cpu' },
      { type: 'motherboard', name: 'Motherboard', watts: 400, zone: 'board' },
      { type: 'psu', name: 'PSU 1', watts: 1500, zone: 'psu-1' },
      { type: 'psu', name: 'PSU 2', watts: 1500, zone: 'psu-2' },
      { type: 'psu', name: 'PSU 3', watts: 1500, zone: 'psu-3' },
      { type: 'psu', name: 'PSU 4', watts: 1200, zone: 'psu-4' },
      { type: 'gpu', name: 'GPU 1', watts: 600, zone: 'pcie-1' },
      { type: 'gpu', name: 'GPU 2', watts: 600, zone: 'pcie-2' },
      { type: 'gpu', name: 'GPU 3', watts: 600, zone: 'pcie-3' },
      { type: 'gpu', name: 'GPU 4', watts: 600, zone: 'pcie-4' },
      { type: 'gpu', name: 'GPU 5', watts: 600, zone: 'pcie-5' },
      { type: 'gpu', name: 'GPU 6', watts: 600, zone: 'pcie-6' },
      { type: 'gpu', name: 'GPU 7', watts: 600, zone: 'pcie-7' },
      { type: 'fans', name: 'Top Fan 1', watts: 15, zone: 'top-rad' },
      { type: 'fans', name: 'Top Fan 2', watts: 15, zone: 'top-rad' },
      { type: 'fans', name: 'Top Fan 3', watts: 15, zone: 'top-rad' },
      { type: 'fans', name: 'Top Fan 4', watts: 15, zone: 'top-rad' },
      { type: 'fans', name: 'Front Fan 1', watts: 15, zone: 'front-rad' },
      { type: 'fans', name: 'Front Fan 2', watts: 15, zone: 'front-rad' },
      { type: 'fans', name: 'Front Fan 3', watts: 15, zone: 'front-rad' },
      { type: 'fans', name: 'Front Fan 4', watts: 15, zone: 'front-rad' },
      { type: 'fans', name: 'Front Fan 5', watts: 15, zone: 'front-rad' },
      { type: 'fans', name: 'Rear Fan', watts: 15, zone: 'rear-io' },
    ],
  },
];

const defaultBlockTemplates = [
  { id: 'tpl-motherboard', type: 'motherboard', name: 'Motherboard', watts: 100 },
  { id: 'tpl-cpu', type: 'cpu', name: 'CPU', watts: 125 },
  { id: 'tpl-gpu', type: 'gpu', name: 'GPU', watts: 300 },
  { id: 'tpl-psu', type: 'psu', name: 'PSU', watts: 850 },
  { id: 'tpl-ram', type: 'ram', name: 'RAM', watts: 10 },
  { id: 'tpl-storage', type: 'storage', name: 'Storage', watts: 10 },
  { id: 'tpl-pump', type: 'pump', name: 'Water Pump', watts: 25 },
  { id: 'tpl-radiator', type: 'radiator', name: 'Radiator', watts: 0 },
  { id: 'tpl-fans', type: 'fans', name: 'Fans', watts: 15 },
  { id: 'tpl-reservoir', type: 'reservoir', name: 'Reservoir', watts: 0 },
  { id: 'tpl-aio', type: 'aio', name: 'AIO Cooler', watts: 10 },
  { id: 'tpl-custom', type: 'custom', name: 'Custom Block', watts: 0 },
];

let componentCounter = 0;
let psuCounter = 0;

const defaultWaterComponents = [
  { id: 'wc-pump', type: 'pump', name: 'D5 Pump', order: 0 },
  { id: 'wc-reservoir', type: 'reservoir', name: 'Reservoir', order: 1 },
  { id: 'wc-cpu-block', type: 'cpu-block', name: 'CPU Block', order: 2 },
  { id: 'wc-gpu-block-1', type: 'gpu-block', name: 'GPU 1 Block', order: 3 },
  { id: 'wc-radiator-top', type: 'radiator', name: 'Top Radiator', order: 4 },
];

export const useStore = create((set, get) => ({
  // ============ AUTHENTICATION ============
  isAuthenticated: false,
  currentUser: null,

  login: (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const userData = loadUserData(user.id);
      set({ 
        isAuthenticated: true, 
        currentUser: { id: user.id, username: user.username, role: user.role, name: user.name },
        // Load user-specific data
        machines: userData?.machines || [],
        tutorials: userData?.tutorials || [],
        placedComponents: userData?.placedComponents || [],
        cables: userData?.cables || [],
        waterComponents: userData?.waterComponents || [],
        waterConnections: userData?.waterConnections || [],
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  },

  logout: () => set({ 
    isAuthenticated: false, 
    currentUser: null,
    machines: [],
    tutorials: [],
    placedComponents: [],
    cables: [],
    waterComponents: [],
    waterConnections: [],
  }),

  // Save current user data to localStorage
  saveCurrentUserData: () => {
    const state = get();
    if (!state.currentUser) return;
    
    saveUserData(state.currentUser.id, {
      machines: state.machines,
      tutorials: state.tutorials,
      placedComponents: state.placedComponents,
      cables: state.cables,
      waterComponents: state.waterComponents,
      waterConnections: state.waterConnections,
    });
  },

  // ============ APP STATE ============
  activeTab: 'builder',
  showCables: true,
  viewMode: 'full',
  
  blockTemplates: defaultBlockTemplates,
  customBlocks: [],
  placedComponents: [],
  cables: [],
  selectedComponents: [],
  connectingFrom: null,
  mode: 'select',
  showCreateModal: false,
  editingBlock: null,

  toggleCables: () => set({ showCables: !get().showCables }),
  setViewMode: (mode) => set({ viewMode: mode }),

  waterComponents: [],
  waterConnections: [],
  showWaterModal: false,
  editingWaterComponent: null,

  tutorials: [],
  showTutorialModal: false,
  editingTutorial: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setMode: (mode) => set({ mode, connectingFrom: null }),
  
  openCreateModal: (editBlock = null) => set({ showCreateModal: true, editingBlock: editBlock }),
  closeCreateModal: () => set({ showCreateModal: false, editingBlock: null }),

  createBlock: (blockData) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockData.type || 'custom',
      name: blockData.name,
      watts: parseInt(blockData.watts) || 0,
    };
    set({ 
      blockTemplates: [...get().blockTemplates, newBlock], 
      showCreateModal: false,
      editingBlock: null,
    });
  },

  updateBlock: (blockId, blockData) => {
    set({
      blockTemplates: get().blockTemplates.map(b => 
        b.id === blockId ? { ...b, name: blockData.name, type: blockData.type, watts: parseInt(blockData.watts) || 0 } : b
      ),
      showCreateModal: false,
      editingBlock: null,
    });
  },

  deleteBlock: (blockId) => {
    set({ blockTemplates: get().blockTemplates.filter(b => b.id !== blockId) });
  },

  // Legacy - keep for compatibility
  createCustomBlock: (blockData) => {
    get().createBlock(blockData);
  },

  updateCustomBlock: (blockId, blockData) => {
    get().updateBlock(blockId, blockData);
  },

  deleteCustomBlock: (blockId) => {
    get().deleteBlock(blockId);
  },

  placeComponent: (template, x, y) => {
    const isPsu = template.type === 'psu';
    const newComponent = {
      id: `placed-${Date.now()}-${componentCounter++}`,
      templateId: template.id,
      type: template.type,
      name: template.name,
      watts: template.watts,
      x,
      y,
      connectedPsu: null,
      usedWatts: isPsu ? 0 : undefined,
      color: isPsu ? PSU_COLORS[psuCounter++ % PSU_COLORS.length] : undefined,
    };
    set({ placedComponents: [...get().placedComponents, newComponent] });
    get().saveCurrentUserData();
  },

  selectComponent: (id, addToSelection = false) => {
    const { selectedComponents } = get();
    if (addToSelection) {
      if (selectedComponents.includes(id)) {
        set({ selectedComponents: selectedComponents.filter(sid => sid !== id) });
      } else {
        set({ selectedComponents: [...selectedComponents, id] });
      }
    } else {
      set({ selectedComponents: [id] });
    }
  },

  clearSelection: () => set({ selectedComponents: [] }),

  selectAll: () => {
    const ids = get().placedComponents.map(c => c.id);
    set({ selectedComponents: ids });
  },
  
  deleteComponent: (id) => {
    const { placedComponents, cables, selectedComponents } = get();
    const component = placedComponents.find(c => c.id === id);
    if (!component) return;

    let newCables = cables;
    let newComponents = placedComponents;

    if (component.type === 'psu') {
      const connectedCables = cables.filter(c => c.from === id);
      connectedCables.forEach(cable => {
        newComponents = newComponents.map(c => 
          c.id === cable.to ? { ...c, connectedPsu: null } : c
        );
      });
      newCables = cables.filter(c => c.from !== id);
    } else {
      const cable = cables.find(c => c.to === id);
      if (cable) {
        newComponents = newComponents.map(c => 
          c.id === cable.from ? { ...c, usedWatts: c.usedWatts - component.watts } : c
        );
        newCables = cables.filter(c => c.to !== id);
      }
    }

    newComponents = newComponents.filter(c => c.id !== id);
    set({ 
      placedComponents: newComponents, 
      cables: newCables, 
      selectedComponents: selectedComponents.filter(sid => sid !== id)
    });
    get().saveCurrentUserData();
  },

  startConnection: (componentId) => {
    const component = get().placedComponents.find(c => c.id === componentId);
    if (component && component.type === 'psu') {
      set({ connectingFrom: componentId, mode: 'connecting' });
    }
  },

  completeConnection: (targetId) => {
    const { connectingFrom, cables, placedComponents } = get();
    if (!connectingFrom || connectingFrom === targetId) {
      set({ connectingFrom: null, mode: 'select' });
      return;
    }

    const source = placedComponents.find(c => c.id === connectingFrom);
    const target = placedComponents.find(c => c.id === targetId);
    
    if (!source || !target || source.type !== 'psu' || target.type === 'psu') {
      set({ connectingFrom: null, mode: 'select' });
      return;
    }

    const existingCable = cables.find(c => c.to === targetId);
    let newCables = cables;
    let newComponents = placedComponents;

    if (existingCable) {
      const oldPsu = placedComponents.find(c => c.id === existingCable.from);
      newCables = cables.filter(c => c.to !== targetId);
      newComponents = placedComponents.map(c => {
        if (c.id === oldPsu.id) {
          return { ...c, usedWatts: c.usedWatts - target.watts };
        }
        if (c.id === targetId) {
          return { ...c, connectedPsu: null };
        }
        return c;
      });
    }

    newCables = [...newCables, { from: connectingFrom, to: targetId, color: source.color }];
    newComponents = newComponents.map(c => {
      if (c.id === connectingFrom) {
        return { ...c, usedWatts: c.usedWatts + target.watts };
      }
      if (c.id === targetId) {
        return { ...c, connectedPsu: connectingFrom };
      }
      return c;
    });

    set({ 
      cables: newCables, 
      placedComponents: newComponents,
      connectingFrom: null, 
      mode: 'select' 
    });
    get().saveCurrentUserData();
  },

  removeCable: (cableIndex) => {
    const { cables, placedComponents } = get();
    const cable = cables[cableIndex];
    if (!cable) return;

    const target = placedComponents.find(c => c.id === cable.to);
    const newComponents = placedComponents.map(c => {
      if (c.id === cable.from) {
        return { ...c, usedWatts: c.usedWatts - target.watts };
      }
      if (c.id === cable.to) {
        return { ...c, connectedPsu: null };
      }
      return c;
    });

    set({
      cables: cables.filter((_, i) => i !== cableIndex),
      placedComponents: newComponents,
    });
    get().saveCurrentUserData();
  },

  moveComponent: (id, x, y) => {
    set({
      placedComponents: get().placedComponents.map(c => 
        c.id === id ? { ...c, x, y } : c
      ),
    });
  },

  moveSelectedComponents: (deltaX, deltaY) => {
    const { placedComponents, selectedComponents } = get();
    set({
      placedComponents: placedComponents.map(c => 
        selectedComponents.includes(c.id) 
          ? { ...c, x: Math.max(0, c.x + deltaX), y: Math.max(0, c.y + deltaY) }
          : c
      ),
    });
  },

  resizeComponent: (id, width, height) => {
    set({
      placedComponents: get().placedComponents.map(c => 
        c.id === id ? { ...c, customWidth: width, customHeight: height } : c
      ),
    });
  },

  getPsuStats: () => {
    const psus = get().placedComponents.filter(c => c.type === 'psu');
    return psus.map(psu => ({
      ...psu,
      percentage: psu.watts > 0 ? Math.round((psu.usedWatts / psu.watts) * 100) : 0,
    }));
  },

  getTotalPower: () => {
    const components = get().placedComponents.filter(c => c.type !== 'psu' && c.connectedPsu);
    return components.reduce((sum, c) => sum + c.watts, 0);
  },

  getTotalCapacity: () => {
    const psus = get().placedComponents.filter(c => c.type === 'psu');
    return psus.reduce((sum, c) => sum + c.watts, 0);
  },

  exportConfig: () => {
    const { customBlocks, placedComponents, cables } = get();
    return JSON.stringify({ customBlocks, placedComponents, cables }, null, 2);
  },

  importConfig: (configStr) => {
    try {
      const config = JSON.parse(configStr);
      set({
        customBlocks: config.customBlocks || [],
        placedComponents: config.placedComponents || [],
        cables: config.cables || [],
      });
      return true;
    } catch (e) {
      return false;
    }
  },

  premadeConfigurations,

  loadPremade: (premadeId) => {
    const premade = premadeConfigurations.find(p => p.id === premadeId);
    if (!premade) return false;

    componentCounter = 0;
    psuCounter = 0;

    // Zone positions matching ChassisLayout.jsx (800x600 viewBox, scaled to percentage)
    const zonePositions = {
      'cpu': { x: 115, y: 88 },
      'board': { x: 350, y: 88 },
      'psu-1': { x: 40, y: 502 },
      'psu-2': { x: 225, y: 502 },
      'psu-3': { x: 410, y: 502 },
      'psu-4': { x: 595, y: 502 },
      'pcie-1': { x: 115, y: 208 },
      'pcie-2': { x: 115, y: 245 },
      'pcie-3': { x: 115, y: 282 },
      'pcie-4': { x: 115, y: 319 },
      'pcie-5': { x: 115, y: 356 },
      'pcie-6': { x: 115, y: 393 },
      'pcie-7': { x: 115, y: 430 },
      'top-rad': { x: 150, y: 25 },
      'front-rad': { x: 705, y: 100 },
      'rear-io': { x: 25, y: 100 },
    };

    // Component sizes for proper fitting
    const componentSizes = {
      'cpu': { w: 115, h: 85 },
      'board': { w: 115, h: 85 },
      'psu': { w: 160, h: 65 },
      'gpu': { w: 560, h: 28 },
      'fans': { w: 50, h: 45 },
    };

    const zoneCounts = {};
    const newComponents = premade.components.map((comp, idx) => {
      const isPsu = comp.type === 'psu';
      const basePos = zonePositions[comp.zone] || { x: 100 + (idx * 30), y: 100 + (idx * 20) };
      const size = componentSizes[comp.type] || { w: 80, h: 50 };
      
      zoneCounts[comp.zone] = (zoneCounts[comp.zone] || 0);
      const count = zoneCounts[comp.zone];
      zoneCounts[comp.zone]++;

      // Calculate offset for multiple items in same zone
      let xOffset = 0, yOffset = 0;
      if (comp.zone === 'top-rad') {
        xOffset = count * 55;
      } else if (comp.zone === 'front-rad') {
        yOffset = count * 55;
      }

      return {
        id: `placed-${Date.now()}-${componentCounter++}`,
        templateId: `premade-${comp.type}`,
        type: comp.type,
        name: comp.name,
        watts: comp.watts,
        x: basePos.x + xOffset,
        y: basePos.y + yOffset,
        customWidth: size.w,
        customHeight: size.h,
        connectedPsu: null,
        usedWatts: isPsu ? 0 : undefined,
        color: isPsu ? PSU_COLORS[psuCounter++ % PSU_COLORS.length] : undefined,
      };
    });

    set({ placedComponents: newComponents, cables: [], selectedComponent: null });
    return true;
  },

  resetConfig: () => {
    componentCounter = 0;
    psuCounter = 0;
    set({
      placedComponents: [],
      cables: [],
      selectedComponent: null,
      connectingFrom: null,
      mode: 'select',
    });
  },

  // ============ WATERCOOLING ============
  openWaterModal: (component = null) => set({ showWaterModal: true, editingWaterComponent: component }),
  closeWaterModal: () => set({ showWaterModal: false, editingWaterComponent: null }),
  
  waterConnectingFrom: null,
  waterConnectingPort: null,
  
  setWaterConnecting: (componentId, port) => set({ waterConnectingFrom: componentId, waterConnectingPort: port }),
  clearWaterConnecting: () => set({ waterConnectingFrom: null, waterConnectingPort: null }),

  addWaterComponent: (data) => {
    const newComponent = {
      id: `water-${Date.now()}`,
      type: data.type,
      name: data.name,
      x: data.x || 100 + Math.random() * 400,
      y: data.y || 100 + Math.random() * 200,
      customWidth: null,
      customHeight: null,
      inletConnected: null,
      outletConnected: null,
    };
    set({ waterComponents: [...get().waterComponents, newComponent], showWaterModal: false });
    get().saveCurrentUserData();
  },

  updateWaterComponent: (id, data) => {
    set({
      waterComponents: get().waterComponents.map(c => c.id === id ? { ...c, ...data } : c),
      showWaterModal: false,
      editingWaterComponent: null,
    });
    get().saveCurrentUserData();
  },

  moveWaterComponent: (id, x, y) => {
    set({
      waterComponents: get().waterComponents.map(c => c.id === id ? { ...c, x, y } : c),
    });
  },

  resizeWaterComponent: (id, width, height) => {
    set({
      waterComponents: get().waterComponents.map(c => c.id === id ? { ...c, customWidth: width, customHeight: height } : c),
    });
  },

  duplicateWaterComponent: (id) => {
    const original = get().waterComponents.find(c => c.id === id);
    if (!original) return;
    
    const duplicate = {
      ...original,
      id: `water-${Date.now()}`,
      x: original.x + 30,
      y: original.y + 30,
      inletConnected: null,
      outletConnected: null,
    };
    set({ waterComponents: [...get().waterComponents, duplicate] });
    get().saveCurrentUserData();
  },

  deleteWaterComponent: (id) => {
    const connections = get().waterConnections.filter(c => c.from !== id && c.to !== id);
    set({ 
      waterComponents: get().waterComponents.filter(c => c.id !== id),
      waterConnections: connections,
    });
    get().saveCurrentUserData();
  },

  connectWaterPorts: (fromId, fromPort, toId, toPort) => {
    const existingFrom = get().waterConnections.find(c => c.from === fromId && c.fromPort === fromPort);
    const existingTo = get().waterConnections.find(c => c.to === toId && c.toPort === toPort);
    
    if (existingFrom || existingTo) {
      return false;
    }
    
    const newConnection = {
      id: `wconn-${Date.now()}`,
      from: fromId,
      fromPort: fromPort,
      to: toId,
      toPort: toPort,
    };
    set({ 
      waterConnections: [...get().waterConnections, newConnection],
      waterConnectingFrom: null,
      waterConnectingPort: null,
    });
    get().saveCurrentUserData();
    return true;
  },

  removeWaterConnection: (connectionId) => {
    set({ waterConnections: get().waterConnections.filter(c => c.id !== connectionId) });
    get().saveCurrentUserData();
  },

  isLoopComplete: () => {
    const components = get().waterComponents;
    const connections = get().waterConnections;
    
    if (components.length < 2 || connections.length < components.length) return false;
    
    const visited = new Set();
    let current = components[0]?.id;
    
    while (current && !visited.has(current)) {
      visited.add(current);
      const outgoing = connections.find(c => c.from === current && c.fromPort === 'outlet');
      if (!outgoing) break;
      current = outgoing.to;
    }
    
    return visited.size === components.length && current === components[0]?.id;
  },

  exportWaterLoop: () => {
    const { waterComponents, waterConnections } = get();
    return JSON.stringify({ waterComponents, waterConnections }, null, 2);
  },

  importWaterLoop: (configStr) => {
    try {
      const config = JSON.parse(configStr);
      set({
        waterComponents: config.waterComponents || [],
        waterConnections: config.waterConnections || [],
      });
      get().saveCurrentUserData();
      return true;
    } catch (e) {
      return false;
    }
  },

  clearWaterLoop: () => {
    set({ waterComponents: [], waterConnections: [] });
    get().saveCurrentUserData();
  },

  // ============ TUTORIALS ============
  openTutorialModal: (tutorial = null) => set({ showTutorialModal: true, editingTutorial: tutorial }),
  closeTutorialModal: () => set({ showTutorialModal: false, editingTutorial: null }),

  addTutorial: (data) => {
    const newTutorial = {
      id: `tutorial-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      videoUrl: data.videoUrl,
      category: data.category || 'General',
    };
    set({ tutorials: [...get().tutorials, newTutorial], showTutorialModal: false });
    get().saveCurrentUserData();
  },

  updateTutorial: (id, data) => {
    set({
      tutorials: get().tutorials.map(t => t.id === id ? { ...t, ...data } : t),
      showTutorialModal: false,
      editingTutorial: null,
    });
    get().saveCurrentUserData();
  },

  deleteTutorial: (id) => {
    set({ tutorials: get().tutorials.filter(t => t.id !== id) });
    get().saveCurrentUserData();
  },

  // ============ ORDER PARTS ============
  machines: [],
  showMachineModal: false,
  editingMachine: null,
  showPartModal: false,
  editingPart: null,
  selectedMachine: null,

  openMachineModal: (machine = null) => set({ showMachineModal: true, editingMachine: machine }),
  closeMachineModal: () => set({ showMachineModal: false, editingMachine: null }),
  openPartModal: (machineId, part = null) => set({ showPartModal: true, editingPart: part, selectedMachine: machineId }),
  closePartModal: () => set({ showPartModal: false, editingPart: null }),

  addMachine: (data) => {
    const newMachine = {
      id: `machine-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      parts: [],
    };
    set({ machines: [...get().machines, newMachine], showMachineModal: false });
    get().saveCurrentUserData();
  },

  updateMachine: (id, data) => {
    set({
      machines: get().machines.map(m => m.id === id ? { ...m, name: data.name, description: data.description } : m),
      showMachineModal: false,
      editingMachine: null,
    });
    get().saveCurrentUserData();
  },

  deleteMachine: (id) => {
    set({ machines: get().machines.filter(m => m.id !== id) });
    get().saveCurrentUserData();
  },

  addPart: (machineId, data) => {
    const newPart = {
      id: `part-${Date.now()}`,
      name: data.name,
      category: data.category || 'General',
      link: data.link || '',
      quantity: data.quantity || 1,
      notes: data.notes || '',
    };
    set({
      machines: get().machines.map(m => 
        m.id === machineId ? { ...m, parts: [...m.parts, newPart] } : m
      ),
      showPartModal: false,
      editingPart: null,
    });
    get().saveCurrentUserData();
  },

  updatePart: (machineId, partId, data) => {
    set({
      machines: get().machines.map(m => 
        m.id === machineId ? { 
          ...m, 
          parts: m.parts.map(p => p.id === partId ? { ...p, ...data } : p)
        } : m
      ),
      showPartModal: false,
      editingPart: null,
    });
    get().saveCurrentUserData();
  },

  deletePart: (machineId, partId) => {
    set({
      machines: get().machines.map(m => 
        m.id === machineId ? { ...m, parts: m.parts.filter(p => p.id !== partId) } : m
      ),
    });
    get().saveCurrentUserData();
  },
}));
