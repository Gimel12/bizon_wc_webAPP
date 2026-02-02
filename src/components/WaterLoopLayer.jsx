import { useStore } from '../store/useStore';

const componentSizes = {
  psu: { w: 120, h: 70 },
  motherboard: { w: 200, h: 160 },
  cpu: { w: 80, h: 60 },
  gpu: { w: 100, h: 50 },
  pump: { w: 60, h: 60 },
  radiator: { w: 160, h: 40 },
  reservoir: { w: 50, h: 100 },
  storage: { w: 50, h: 30 },
  fans: { w: 50, h: 50 },
};

function getComponentPort(component, isOutput = false) {
  const size = componentSizes[component.type] || { w: 80, h: 60 };
  const centerX = component.x + size.w / 2;
  const centerY = component.y + size.h / 2;

  switch (component.type) {
    case 'reservoir':
      return isOutput 
        ? { x: centerX, y: component.y + size.h }
        : { x: centerX, y: component.y };
    case 'pump':
      return isOutput
        ? { x: component.x + size.w, y: centerY }
        : { x: component.x, y: centerY };
    case 'cpu':
      return isOutput
        ? { x: component.x + size.w, y: centerY }
        : { x: component.x, y: centerY };
    case 'gpu':
      return isOutput
        ? { x: component.x + size.w, y: centerY }
        : { x: component.x, y: centerY };
    case 'radiator':
      return isOutput
        ? { x: component.x, y: centerY }
        : { x: component.x + size.w, y: centerY };
    default:
      return { x: centerX, y: centerY };
  }
}

function generateWaterPath(from, to) {
  const start = getComponentPort(from, true);
  const end = getComponentPort(to, false);
  
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  const ctrlOffset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.5 + 20;
  
  const ctrl1x = start.x + (dx > 0 ? ctrlOffset : -ctrlOffset);
  const ctrl1y = start.y;
  const ctrl2x = end.x - (dx > 0 ? ctrlOffset : -ctrlOffset);
  const ctrl2y = end.y;

  return `M ${start.x} ${start.y} C ${ctrl1x} ${ctrl1y}, ${ctrl2x} ${ctrl2y}, ${end.x} ${end.y}`;
}

export function WaterLoopLayer() {
  const { waterLoop, components } = useStore();

  return (
    <g className="water-loop-layer">
      <defs>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="waterGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {waterLoop.map((connection, index) => {
        const fromComponent = components.find(c => c.id === connection.from);
        const toComponent = components.find(c => c.id === connection.to);
        
        if (!fromComponent || !toComponent) return null;
        if (!fromComponent.hasWaterblock && fromComponent.type !== 'pump' && 
            fromComponent.type !== 'reservoir' && fromComponent.type !== 'radiator') return null;
        if (!toComponent.hasWaterblock && toComponent.type !== 'pump' && 
            toComponent.type !== 'reservoir' && toComponent.type !== 'radiator') return null;

        const path = generateWaterPath(fromComponent, toComponent);

        return (
          <g key={`water-${index}`}>
            <path
              d={path}
              stroke="#0e7490"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              opacity={0.3}
            />
            <path
              d={path}
              stroke="url(#waterGradient)"
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              filter="url(#waterGlow)"
              className="water-flow"
              strokeDasharray="10 10"
            />
            <path
              d={path}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </g>
  );
}
