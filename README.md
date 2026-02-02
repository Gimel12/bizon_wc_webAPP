# Bizon ZX5500 PC Builder

An interactive web-based tool for planning and visualizing watercooled multi-GPU workstation builds, specifically designed for the Bizon ZX5500 chassis.

## Features

- **Visual PC Case Layout** - Drag and drop components within a virtual case representation
- **3x PSU Power Distribution** - Color-coded cable management for three 1500W PSUs (4500W total)
- **Load Balancing Dashboard** - Real-time wattage tracking per PSU with percentage indicators
- **Watercooling Loop Visualization** - Animated coolant flow through CPU, GPUs, radiators, and pump
- **Interactive Cable Routing** - Double-click PSU to start connecting, click component to complete
- **Export/Import Configurations** - Save and share your build configurations as JSON
- **Status Warnings** - Alerts for unconnected components

## Components Included

- **3x Corsair HX1500i PSUs** (1500W each)
- **Motherboard** with Threadripper support
- **CPU** (350W TDP with waterblock)
- **4x RTX 4090 GPUs** (450W each with waterblocks)
- **D5 Pump** and **Reservoir/Distribution plate**
- **Top 480mm Radiator** and **Side 360mm Radiator**
- **NVMe Storage** and **Case Fans**

## How to Use

1. **Drag** components to rearrange their position
2. **Double-click** a PSU to enter cable connection mode
3. **Click** a component to connect the power cable from that PSU
4. **Click** an existing cable to remove it
5. Use the **sidebar** to monitor power distribution and balance load

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Tech Stack

- React 19 + Vite
- Zustand (state management)
- TailwindCSS (styling)
- Lucide React (icons)
