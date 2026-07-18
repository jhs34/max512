/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Fixture, DMXChannelType } from '../types';
import { DmxSimulatorEngine } from '../DmxSimulatorEngine';

interface StagePreviewProps {
  fixtures: Fixture[];
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  isBlackout: boolean;
  instanceId?: string;
}

export const StagePreview: React.FC<StagePreviewProps> = ({
  fixtures,
  selectedIds,
  onToggleSelect,
  isBlackout,
  instanceId = 'default',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(800);

  // Responsive stage sizing using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width || entry.target.clientWidth || 800;
        setStageWidth(Math.max(300, width));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const trussY = 40;
  const stageFloorY = 220;

  return (
    <div
      id="stage-preview-container"
      ref={containerRef}
      className="relative w-full h-[220px] sm:h-[280px] lg:h-[240px] bg-[#000] border-b border-[#222] overflow-hidden flex flex-col justify-between p-3 sm:p-4"
    >
      {/* Top Header info */}
      <div className="flex justify-between items-center z-10 select-none">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] uppercase tracking-widest text-[#666] font-bold">
            DMX Stage Preview (Live)
          </h3>
        </div>
      </div>

      {/* SVG Stage Rendering Layer */}
      <div className="absolute inset-0 pt-10 pb-16 sm:pb-20 lg:pb-8 px-4 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${stageWidth} 280`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Draw Truss Hatching Patterns */}
            <pattern id={`truss-hatch-${instanceId}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 20 20 M 20 0 L 0 20" stroke="#334155" strokeWidth="1" />
            </pattern>
            {/* Spotlight Beam Gradients - permanently defined in top-level defs for cross-browser reliability */}
            {fixtures.map((fixture) => {
              const { colorString, intensity } = DmxSimulatorEngine.computeFixtureGlow(fixture, isBlackout);
              const gradId = `beam-grad-${instanceId}-${fixture.id}`;
              return (
                <linearGradient key={gradId} id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colorString} stopOpacity={0.65 * intensity} />
                  <stop offset="40%" stopColor={colorString} stopOpacity={0.25 * intensity} />
                  <stop offset="100%" stopColor={colorString} stopOpacity="0" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Metal Truss Rig */}
          <rect
            x="0"
            y={trussY - 12}
            width={stageWidth}
            height="18"
            fill={`url(#truss-hatch-${instanceId})`}
            stroke="#1e293b"
            strokeWidth="2"
            opacity="0.85"
          />
          <line
            x1="0"
            y1={trussY - 12}
            x2={stageWidth}
            y2={trussY - 12}
            stroke="#475569"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1={trussY + 6}
            x2={stageWidth}
            y2={trussY + 6}
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Render spotlight beams and floor projection puddles */}
          {fixtures.map((fixture, idx) => {
            const spacing = stageWidth / 13;
            const xLens = spacing * (idx + 1);
            const yLens = trussY + 12;

            const { colorString, beamColorString, intensity } = DmxSimulatorEngine.computeFixtureGlow(fixture, isBlackout);

            // Fixed lighting pointing straight down
            const panOffset = 0;
            const tiltOffset = 0;

            const xTarget = xLens + panOffset;
            const yTarget = stageFloorY + tiltOffset;

            // Beam width expands down to target
            const baseBeamWidth = 14;
            const targetBeamWidth = Math.max(10, 45 * (fixture.currentValues[DMXChannelType.Master] / 100));

            const gradId = `beam-grad-${instanceId}-${fixture.id}`;

             return (
              <g key={`fixture-gfx-${fixture.id}`}>
                {/* SVG Beam Gradient */}
                {intensity > 0.02 && (
                  <>
                    {/* Glowing Spotlight Beam Polygon */}
                    <polygon
                      points={`
                        ${xLens - baseBeamWidth / 2},${yLens}
                        ${xLens + baseBeamWidth / 2},${yLens}
                        ${xTarget + targetBeamWidth / 2},${yTarget}
                        ${xTarget - targetBeamWidth / 2},${yTarget}
                      `}
                      fill={`url(#${gradId})`}
                      opacity="0.8"
                    />

                    {/* Floor reflection oval puddle */}
                    <ellipse
                      cx={xTarget}
                      cy={yTarget}
                      rx={targetBeamWidth * 0.9}
                      ry={targetBeamWidth * 0.3}
                      fill={colorString}
                      opacity={0.35 * intensity}
                      filter="blur(4px)"
                    />
                    <ellipse
                      cx={xTarget}
                      cy={yTarget}
                      rx={targetBeamWidth * 0.45}
                      ry={targetBeamWidth * 0.15}
                      fill="#ffffff"
                      opacity={0.35 * intensity}
                      filter="blur(1px)"
                    />
                  </>
                )}

                {/* Draw Fixture Body Hanging on Truss */}
                {/* Clamp line */}
                <line
                  x1={xLens}
                  y1={trussY + 4}
                  x2={xLens}
                  y2={yLens}
                  stroke="#64748b"
                  strokeWidth="2.5"
                />

                {/* Fixture head tilt body */}
                {/* Let's compute angle to look at target */}
                {(() => {
                  const dx = xTarget - xLens;
                  const dy = yTarget - yLens;
                  const angleRad = Math.atan2(dy, dx);
                  const angleDeg = (angleRad * 180) / Math.PI - 90; // normalize facing down

                  return (
                    <g transform={`translate(${xLens}, ${yLens}) rotate(${angleDeg})`}>
                      {/* Fixture Base bracket */}
                      <path
                        d="M -9 -2 L -9 4 L 9 4 L 9 -2"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                      />
                      {/* Lens Housing */}
                      <rect
                        x="-7"
                        y="4"
                        width="14"
                        height="12"
                        rx="2"
                        fill="#1e293b"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      {/* Lens emitting glass */}
                      <rect
                        x="-6"
                        y="14"
                        width="12"
                        height="3"
                        fill={intensity > 0.15 ? colorString : '#0f172a'}
                        stroke="#475569"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fixture Interactive Buttons & Identifiers */}
      <div className="w-full flex justify-between gap-1 z-10 mt-auto select-none">
        {fixtures.map((fixture) => {
          const isSelected = selectedIds.has(fixture.id);
          const { colorString, intensity } = DmxSimulatorEngine.computeFixtureGlow(fixture, isBlackout);

          return (
            <button
              key={`interactive-fixture-node-${fixture.id}`}
              onClick={() => onToggleSelect(fixture.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded border transition-all pointer-events-auto cursor-pointer ${
                isSelected
                  ? 'bg-[#1a1a1c] border-[#facc15] shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                  : 'bg-[#1a1a1c] border-[#333] hover:bg-[#252528]'
              }`}
            >
              {/* Fixture Indicator LED bulb */}
              <div
                className="w-4 h-4 rounded-full border border-[#333] transition-all duration-150 flex items-center justify-center relative mb-1"
                style={{
                  backgroundColor: intensity > 0.05 ? colorString : '#222',
                  boxShadow: intensity > 0.05 ? `0 0 15px ${colorString}` : 'none',
                }}
              >
              </div>

              {/* Number and Base Address */}
              <span className={`text-[9px] font-mono ${isSelected ? 'text-[#facc15] font-bold' : 'text-[#444]'}`}>
                F{fixture.id.toString().padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
