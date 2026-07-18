/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Pencil, PencilOff } from 'lucide-react';
import { DMXChannelType } from '../types';
import { DmxSimulatorEngine } from '../DmxSimulatorEngine';

interface DmxInspectorProps {
  dmxBuffer: Uint8Array;
  engine: DmxSimulatorEngine;
  onStateChange: () => void;
}

export const DmxInspector: React.FC<DmxInspectorProps> = ({ dmxBuffer, engine, onStateChange }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // Track the cell actively being dragged to prevent sliding into other cells
  const [draggedCell, setDraggedCell] = useState<{
    fixtureId: number;
    channelOffset: number;
    address: number;
  } | null>(null);

  const getChannelName = (address: number): string => {
    const fixtureIdx = Math.floor((address - 1) / 6) + 1;
    const channelOffset = (address - 1) % 6 + 1;

    if (fixtureIdx <= 12) {
      const prefix = `F${fixtureIdx} `;
      switch (channelOffset) {
        case 1: return prefix + 'M';
        case 2: return prefix + 'R';
        case 3: return prefix + 'G';
        case 4: return prefix + 'B';
        case 5: return prefix + 'W';
        case 6: return prefix + 'S';
        default: return prefix + `ch${channelOffset}`;
      }
    }
    return `DMX ${address}`;
  };

  const getChannelTypeByOffset = (offset: number): DMXChannelType => {
    switch (offset) {
      case 1: return DMXChannelType.Master;
      case 2: return DMXChannelType.Red;
      case 3: return DMXChannelType.Green;
      case 4: return DMXChannelType.Blue;
      case 5: return DMXChannelType.White;
      case 6: return DMXChannelType.Strobe;
      default: return DMXChannelType.Master;
    }
  };

  // Add global mouse listeners when dragging is active to support smooth dragging outside cells
  useEffect(() => {
    if (!draggedCell) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const cellElement = document.getElementById(
        `dmx-cell-f${draggedCell.fixtureId}-${draggedCell.address}`
      );
      if (!cellElement) return;

      const rect = cellElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const ratio = Math.max(0, Math.min(1, x / width));
      const value = Math.round(ratio * 100); // 0 ~ 100 manual override range

      const channelType = getChannelTypeByOffset(draggedCell.channelOffset);

      engine.handleDmxCellChange(draggedCell.fixtureId, channelType, value);
      onStateChange();
    };

    const handleGlobalMouseUp = () => {
      setDraggedCell(null);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggedCell, engine, onStateChange]);

  const handleCellMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    fixtureId: number,
    channelOffset: number,
    address: number
  ) => {
    if (!isEditMode) return;
    e.preventDefault();

    // Set dragging cell
    setDraggedCell({ fixtureId, channelOffset, address });

    // Instantly apply initial click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, x / width));
    const value = Math.round(ratio * 100);

    const channelType = getChannelTypeByOffset(channelOffset);

    engine.handleDmxCellChange(fixtureId, channelType, value);
    onStateChange();
  };

  return (
    <div
      id="dmx-inspector"
      className="bg-[#121214] border border-[#1c1c1e] rounded flex flex-col h-full p-3 sm:p-3.5 max-h-none lg:max-h-[520px] overflow-hidden shadow-lg select-none"
    >
      <div className="flex justify-between items-center mb-3 select-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">
            DMX Output Matrix
          </span>
          {isEditMode && (
            <span className="text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded animate-pulse font-mono font-bold uppercase">
              DRAG MODE ACTIVE
            </span>
          )}
        </div>
        
        {/* Toggle Edit Mode with Pencil Icon */}
        <button
          onClick={() => {
            setIsEditMode(!isEditMode);
            if (isEditMode) setDraggedCell(null);
          }}
          className={`px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center justify-center border text-[10px] font-bold gap-1.5 ${
            isEditMode
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
              : 'bg-[#1a1a1c] border-[#333] text-gray-300 hover:text-white hover:bg-[#252528]'
          }`}
          title={isEditMode ? 'Exit Edit Mode' : 'Enter Interactive Edit Mode'}
        >
          {isEditMode ? (
            <>
              <Pencil className="w-3.5 h-3.5 text-amber-400" />
              <span>EDIT ACTIVE</span>
            </>
          ) : (
            <>
              <PencilOff className="w-3.5 h-3.5 text-gray-500" />
              <span>EDIT CHANNELS</span>
            </>
          )}
        </button>
      </div>

      {/* Structured view: One row per fixture (12 fixtures) with 6 DMX channels in each row */}
      <div className="flex-1 overflow-y-auto pr-0.5 flex flex-col gap-1.5">
        {Array.from({ length: 12 }).map((_, fIdx) => {
          const fixtureNum = fIdx + 1;
          const baseAddr = fIdx * 6 + 1;

          return (
            <div 
              key={`fixture-row-${fixtureNum}`}
              className="flex items-center gap-2 bg-[#161618] border border-[#222224] rounded px-2 py-1 transition-all hover:border-[#333]"
            >
              {/* Compact Fixture Index Label */}
              <div className="w-10 text-center bg-black py-1 rounded border border-[#222] flex flex-col justify-center shrink-0">
                <span className="text-[10px] font-black text-sky-400 block font-mono">F{fixtureNum}</span>
                <span className="text-[7px] text-[#555] block font-mono font-bold">#{baseAddr}</span>
              </div>

              {/* 6 DMX Channel cells */}
              <div className="grid grid-cols-6 flex-1 gap-1.5">
                {Array.from({ length: 6 }).map((_, cIdx) => {
                  const channelOffset = cIdx + 1;
                  const address = baseAddr + cIdx;
                  const value = dmxBuffer[address] || 0;
                  const isActive = value > 0;
                  const label = getChannelName(address).replace(`F${fixtureNum} `, '');
                  const channelType = getChannelTypeByOffset(channelOffset);
                  const isChannelOverridden = engine.isChannelOverridden(fixtureNum, channelType);
                  const cellId = `dmx-cell-f${fixtureNum}-${address}`;
                  const isBeingDragged = draggedCell?.fixtureId === fixtureNum && draggedCell?.channelOffset === channelOffset;

                  return (
                    <div
                      id={cellId}
                      key={cellId}
                      onMouseDown={(e) => handleCellMouseDown(e, fixtureNum, channelOffset, address)}
                      className={`relative flex flex-col justify-between p-1 rounded border text-center select-none h-10 transition-all ${
                        isEditMode 
                          ? 'cursor-ew-resize hover:border-amber-400/80 hover:bg-[#201c18]' 
                          : ''
                      } ${
                        isBeingDragged
                          ? 'bg-[#2a2015] border-amber-400 text-amber-200 ring-1 ring-amber-500/50'
                          : isChannelOverridden
                          ? 'bg-[#1e1a13] border-amber-500 text-amber-200'
                          : isActive
                          ? 'bg-[#18181c] border-sky-600 text-[#e4e4e7]'
                          : 'bg-[#101012] border-[#1a1a1c] text-[#555]'
                      }`}
                      title={isEditMode ? `Click & Drag Left/Right to adjust ${label}` : `${label}: ${value}`}
                    >
                      {/* Channel Label */}
                      <span className="text-[7.5px] font-bold tracking-tight truncate uppercase text-[#999] block leading-none">
                        {label}
                      </span>

                      {/* Raw Value */}
                      <span className={`text-[11px] font-mono font-black leading-none my-0.5 ${
                        isBeingDragged ? 'text-amber-300 scale-110' : isChannelOverridden ? 'text-amber-400' : isActive ? 'text-sky-400' : 'text-[#3a3a40]'
                      }`}>
                        {value}
                      </span>

                      {/* Micro intensity bar (Updates instantly at 60fps with Cross values) */}
                      <div className="w-full bg-[#050505] h-[2px] rounded-full overflow-hidden mt-0.5">
                        <div
                          className={`h-full ${
                            isBeingDragged ? 'bg-amber-300' : isChannelOverridden ? 'bg-amber-400' : 'bg-sky-400'
                          }`}
                          style={{ width: `${(value / 255) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
