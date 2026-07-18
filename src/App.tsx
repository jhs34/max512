/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { DmxSimulatorEngine } from './DmxSimulatorEngine';
import { StagePreview } from './components/StagePreview';
import { ConsoleControls } from './components/ConsoleControls';
import { DmxInspector } from './components/DmxInspector';
import { Info, HelpCircle, Sliders } from 'lucide-react';

export default function App() {
  // Instantiating the core DMX simulation engine
  const engineRef = useRef<DmxSimulatorEngine>(new DmxSimulatorEngine());
  const engine = engineRef.current;

  // React state mirrors to drive re-renders of child views
  const [fixtures, setFixtures] = useState([...engine.fixtures]);
  const [selectedFixtureIds, setSelectedFixtureIds] = useState<Set<number>>(new Set(engine.selectedFixtureIds));
  const [activeScenes, setActiveScenes] = useState<Set<string>>(new Set(engine.activeScenes));
  const [flashedScenes, setFlashedScenes] = useState<Set<string>>(new Set(engine.flashedScenes));
  const [activeChases, setActiveChases] = useState<Map<string, any>>(new Map(engine.activeChases));
  const [dmxBuffer, setDmxBuffer] = useState<Uint8Array>(engine.computeDmxBuffer());
  const [tickCounter, setTickCounter] = useState(0);
  const [activeTab, setActiveTab] = useState<'console' | 'dmx'>('console');

  // Function to pull latest state values from the simulation engine
  const syncStateFromEngine = () => {
    setFixtures([...engine.fixtures]);
    setSelectedFixtureIds(new Set(engine.selectedFixtureIds));
    setActiveScenes(new Set(engine.activeScenes));
    setFlashedScenes(new Set(engine.flashedScenes));
    setActiveChases(new Map(engine.activeChases));
    setDmxBuffer(engine.computeDmxBuffer());
    setTickCounter((prev) => prev + 1);
  };

  // High-precision animation loop for live fading & step transitions
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;

    const frameTick = (now: number) => {
      const deltaSec = Math.max(0, Math.min(0.1, (now - lastTime) / 1000));
      lastTime = now;

      // Tick the engine
      engine.tick(deltaSec);

      // Pull latest frame states
      syncStateFromEngine();

      animationFrameId = requestAnimationFrame(frameTick);
    };

    animationFrameId = requestAnimationFrame(frameTick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [engine]);

  // Handle fixture selection toggles
  const handleToggleSelectFixture = (id: number) => {
    if (engine.selectedFixtureIds.has(id)) {
      engine.selectedFixtureIds.delete(id);
    } else {
      engine.selectedFixtureIds.add(id);
    }
    syncStateFromEngine();
  };



  return (
    <div
      id="dmx-app-wrapper"
      className="h-screen bg-[#0a0a0b] text-[#e2e2e7] font-sans flex flex-col overflow-hidden select-none"
    >
      {/* DESKTOP VIEW (Visible on xl: and up) */}
      <main className="hidden xl:flex flex-1 gap-5 p-5 overflow-hidden max-w-[1750px] mx-auto w-full">
        {/* Left Side: Stage Visualization & Live DMX Matrix */}
        <div className="w-[45%] flex flex-col gap-4 h-full overflow-hidden">
          {/* 1. Stage Preview */}
          <StagePreview
            fixtures={fixtures}
            selectedIds={selectedFixtureIds}
            onToggleSelect={handleToggleSelectFixture}
            isBlackout={engine.isBlackout}
            instanceId="desktop"
          />

          {/* 3. DMX-512 Universe Matrix View */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <DmxInspector dmxBuffer={dmxBuffer} engine={engine} onStateChange={syncStateFromEngine} />
          </div>
        </div>

        {/* Right Side: Tactile Emulation Control Desk */}
        <div className="flex-1 overflow-y-auto pr-1 pb-4 max-w-[880px]">
          <ConsoleControls
            engine={engine}
            selectedFixtureIds={selectedFixtureIds}
            activeScenes={activeScenes}
            flashedScenes={flashedScenes}
            activeChases={activeChases}
            onStateChange={syncStateFromEngine}
          />
        </div>
      </main>

      {/* MOBILE / TABLET VIEW (Visible on screens below xl) */}
      <div className="flex xl:hidden flex-1 flex-col overflow-hidden">
        {/* Stage Preview (Pinned to top so users can see visual changes live) */}
        <div className="flex-shrink-0 bg-black">
          <StagePreview
            fixtures={fixtures}
            selectedIds={selectedFixtureIds}
            onToggleSelect={handleToggleSelectFixture}
            isBlackout={engine.isBlackout}
            instanceId="mobile"
          />
        </div>

        {/* Tab Selection Bar */}
        <div className="flex-shrink-0 flex border-b border-[#222] bg-[#000] p-1.5 gap-2">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex-1 py-2 text-xs font-black rounded-md transition-all flex items-center justify-center gap-1.5 border whitespace-nowrap ${
              activeTab === 'console'
                ? 'bg-[#d9cbb8] text-slate-900 border-[#a3927d] shadow-sm'
                : 'bg-[#141416] text-[#888] border-[#222] hover:text-white'
            }`}
          >
            🎚️ 콘솔 컨트롤
          </button>
          <button
            onClick={() => setActiveTab('dmx')}
            className={`flex-1 py-2 text-xs font-black rounded-md transition-all flex items-center justify-center gap-1.5 border whitespace-nowrap ${
              activeTab === 'dmx'
                ? 'bg-[#d9cbb8] text-slate-900 border-[#a3927d] shadow-sm'
                : 'bg-[#141416] text-[#888] border-[#222] hover:text-white'
            }`}
          >
            📊 DMX 매트릭스
          </button>
        </div>

        {/* Active Tab Content Container with Independent Scroll Retention */}
        <div className="flex-1 relative bg-[#0a0a0b]">
          <div className={`absolute inset-0 overflow-y-auto p-3 pb-10 ${activeTab === 'console' ? '' : 'hidden'}`}>
            <ConsoleControls
              engine={engine}
              selectedFixtureIds={selectedFixtureIds}
              activeScenes={activeScenes}
              flashedScenes={flashedScenes}
              activeChases={activeChases}
              onStateChange={syncStateFromEngine}
            />
          </div>
          <div className={`absolute inset-0 overflow-y-auto p-3 pb-10 ${activeTab === 'dmx' ? '' : 'hidden'}`}>
            <DmxInspector dmxBuffer={dmxBuffer} engine={engine} onStateChange={syncStateFromEngine} />
          </div>
        </div>
      </div>
    </div>
  );
}
