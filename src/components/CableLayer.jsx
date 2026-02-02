import { useStore } from '../store/useStore';

const componentSizes = {
  psu: { w: 110, h: 70 },
  motherboard: { w: 120, h: 90 },
  cpu: { w: 90, h: 60 },
  gpu: { w: 110, h: 55 },
  pump: { w: 70, h: 60 },
  radiator: { w: 130, h: 45 },
  reservoir: { w: 55, h: 80 },
  storage: { w: 70, h: 35 },
  fans: { w: 60, h: 50 },
  ram: { w: 70, h: 35 },
  aio: { w: 90, h: 50 },
  custom: { w: 80, h: 50 },
  controller: { w: 70, h: 40 },
};

function getComponentCenter(component) {
  const size = componentSizes[component.type] || { w: 80, h: 60 };
  return {
    x: component.x + size.w / 2,
    y: component.y + size.h / 2,
  };
}

function generateCablePath(from, to) {
  const fromCenter = getComponentCenter(from);
  const toCenter = getComponentCenter(to);
  
  const fromSize = componentSizes[from.type] || { w: 80, h: 60 };
  const toSize = componentSizes[to.type] || { w: 80, h: 60 };
  
  const startX = fromCenter.x;
  const startY = from.y;
  const endX = toCenter.x;
  const endY = to.y + toSize.h;

  const midY = startY - 30;
  const bendX = startX + (endX - startX) * 0.3;

  return `M ${startX} ${startY} 
          C ${startX} ${midY}, 
            ${bendX} ${midY}, 
            ${endX} ${endY + 40}
          L ${endX} ${endY}`;
}

function CableMidpoint(path) {
  if (typeof document === 'undefined') return { x: 0, y: 0 };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathEl.setAttribute('d', path);
  svg.appendChild(pathEl);
  document.body.appendChild(svg);
  const len = pathEl.getTotalLength();
  const point = pathEl.getPointAtLength(len * 0.5);
  document.body.removeChild(svg);
  return { x: point.x, y: point.y };
}

export function CableLayer() {
  const { cables, placedComponents, removeCable, showCables } = useStore();

  if (!showCables) return null;

  return (
    <g className="cables-layer">
      {cables.map((cable, index) => {
        const fromComponent = placedComponents.find(c => c.id === cable.from);
        const toComponent = placedComponents.find(c => c.id === cable.to);
        
        if (!fromComponent || !toComponent) return null;

        const path = generateCablePath(fromComponent, toComponent);
        
        const fromCenter = getComponentCenter(fromComponent);
        const toCenter = getComponentCenter(toComponent);
        const midX = (fromCenter.x + toCenter.x) / 2;
        const midY = (fromComponent.y + toComponent.y) / 2;

        return (
          <g key={`cable-${index}`} className="cable-group">
            {/* Invisible thick path for easier clicking */}
            <path
              d={path}
              stroke="transparent"
              strokeWidth={20}
              fill="none"
              style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                removeCable(index);
              }}
            />
            {/* Visible cable */}
            <path
              d={path}
              stroke={cable.color}
              strokeWidth={4}
              fill="none"
              className="cable-path"
              style={{ 
                pointerEvents: 'none',
                filter: `drop-shadow(0 0 4px ${cable.color}40)`,
              }}
            />
            {/* White highlight */}
            <path
              d={path}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1}
              fill="none"
              strokeDasharray="4 4"
              style={{ pointerEvents: 'none' }}
            />
            {/* Delete button on cable */}
            <g 
              style={{ pointerEvents: 'all', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                removeCable(index);
              }}
            >
              <circle
                cx={midX}
                cy={midY}
                r={10}
                fill="rgba(239, 68, 68, 0.9)"
                stroke="white"
                strokeWidth={1}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
              <text
                x={midX}
                y={midY + 4}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                ×
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
