/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScenePreset, ChasePreset, DMXChannelType } from './types';

// Helper to create empty or preset value objects for 1-12 fixtures
const createUniformAll = (r: number, g: number, b: number, w: number, m = 100): Record<number, Partial<Record<DMXChannelType, number>>> => {
  const vals: Record<number, Partial<Record<DMXChannelType, number>>> = {};
  for (let i = 1; i <= 12; i++) {
    vals[i] = {
      [DMXChannelType.Red]: r,
      [DMXChannelType.Green]: g,
      [DMXChannelType.Blue]: b,
      [DMXChannelType.White]: w,
      [DMXChannelType.Master]: m,
    };
  }
  return vals;
};

export const DEFAULT_SCENES: ScenePreset[] = [
  // Scene Bank A
  {
    id: 'A1',
    bank: 'A',
    number: 1,
    name: '좌흰 (Left White)',
    fixtureValues: {
      12: {
        [DMXChannelType.Red]: 100,
        [DMXChannelType.Green]: 100,
        [DMXChannelType.Blue]: 100,
        [DMXChannelType.White]: 0,
        [DMXChannelType.Master]: 100
      }
    }
  },
  {
    id: 'A2',
    bank: 'A',
    number: 2,
    name: '우흰 (Right White)',
    fixtureValues: {
      1: {
        [DMXChannelType.Red]: 100,
        [DMXChannelType.Green]: 100,
        [DMXChannelType.Blue]: 100,
        [DMXChannelType.White]: 0,
        [DMXChannelType.Master]: 100
      }
    }
  },
  {
    id: 'A3',
    bank: 'A',
    number: 3,
    name: '기본흰 (Base White)',
    fixtureValues: {
      1: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      3: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      6: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      7: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      10: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      12: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
    }
  },
  {
    id: 'A4',
    bank: 'A',
    number: 4,
    name: '은은레드 (Soft Red)',
    fixtureValues: {
      1: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      3: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      6: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      7: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      10: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      12: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      2: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      5: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      8: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      11: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      4: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 20, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      9: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 20, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
    }
  },
  {
    id: 'A5',
    bank: 'A',
    number: 5,
    name: '감성그린 (Green Mood)',
    fixtureValues: {
      1: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      3: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      6: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      7: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      10: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      12: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      2: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      5: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      8: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      11: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      4: { [DMXChannelType.Red]: 30, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 20, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      9: { [DMXChannelType.Red]: 30, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 20, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
    }
  },
  {
    id: 'A6',
    bank: 'A',
    number: 6,
    name: '깊은블루 (Deep Blue)',
    fixtureValues: {
      1: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      3: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      6: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      7: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      10: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      12: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      2: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      5: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      8: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      11: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      4: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 60, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      9: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 60, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
    }
  },
  {
    id: 'A7',
    bank: 'A',
    number: 7,
    name: '노을옐로 (Sunset Yellow)',
    fixtureValues: {
      1: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      3: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      6: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      7: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      10: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      12: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 40, [DMXChannelType.Master]: 100 },
      2: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      5: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      8: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      11: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      4: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 45, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      9: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 45, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
    }
  },
  {
    id: 'A8',
    bank: 'A',
    number: 8,
    name: '전흰 (Full White)',
    fixtureValues: createUniformAll(100, 100, 100, 0, 100)
  },
  {
    id: 'A9',
    bank: 'A',
    number: 9,
    name: '6좌흰 (Left 6 White)',
    fixtureValues: {
      7: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      8: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      9: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      10: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      11: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      12: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
    }
  },
  {
    id: 'A10',
    bank: 'A',
    number: 10,
    name: '6우흰 (Right 6 White)',
    fixtureValues: {
      1: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      2: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      3: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      4: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      5: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      6: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
    }
  },
  {
    id: 'A11',
    bank: 'A',
    number: 11,
    name: 'r기본흰 (Rev Base White)',
    fixtureValues: {
      2: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      4: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      5: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      8: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      9: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
      11: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
    }
  },
  {
    id: 'A12',
    bank: 'A',
    number: 12,
    name: '토크 (Talk)',
    fixtureValues: createUniformAll(0, 0, 0, 100, 100)
  },
  {
    id: 'A13',
    bank: 'A',
    number: 13,
    name: '금빛 (Golden)',
    fixtureValues: createUniformAll(100, 80, 10, 30, 100)
  },
  {
    id: 'A14',
    bank: 'A',
    number: 14,
    name: '암전대기 (Blackout Ready)',
    fixtureValues: createUniformAll(0, 0, 0, 0, 0)
  },
  {
    id: 'A15',
    bank: 'A',
    number: 15,
    name: '퇴장 (Exit)',
    fixtureValues: createUniformAll(100, 100, 100, 100, 100)
  }
];

export const DEFAULT_CHASES: ChasePreset[] = [
  // CHASE BANK A
  {
    id: 'A14',
    bank: 'A',
    number: 14,
    name: 'A14 Pulse Animation',
    steps: [
      { fixtureValues: createUniformAll(100, 100, 100, 0, 100) },
      { fixtureValues: createUniformAll(75, 75, 75, 0, 100) },
      { fixtureValues: createUniformAll(50, 50, 50, 0, 100) },
      { fixtureValues: createUniformAll(25, 25, 25, 0, 100) },
      { fixtureValues: createUniformAll(0, 0, 0, 0, 0) },
      { fixtureValues: createUniformAll(0, 0, 0, 0, 0) },
      { fixtureValues: createUniformAll(0, 0, 0, 0, 0) }
    ]
  },
  // CHASE BANK B
  {
    id: 'B1',
    bank: 'B',
    number: 1,
    name: '사이버 (Cyber)',
    steps: [
      {
        fixtureValues: {
          1: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          3: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          5: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          7: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          9: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          11: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          2: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          4: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          6: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          8: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          10: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          12: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
        }
      }
    ]
  },
  {
    id: 'B2',
    bank: 'B',
    number: 2,
    name: 'r사이버 (Rev Cyber)',
    steps: [
      {
        fixtureValues: {
          1: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          3: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          5: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          7: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          9: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          11: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          2: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          4: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          6: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          8: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          10: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          12: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
        }
      }
    ]
  },
  {
    id: 'B3',
    bank: 'B',
    number: 3,
    name: '보노 (Bono)',
    steps: [
      {
        fixtureValues: {
          1: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          3: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          5: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          7: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          9: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          11: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          2: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          4: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          6: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          8: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          10: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          12: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
        }
      }
    ]
  },
  {
    id: 'B4',
    bank: 'B',
    number: 4,
    name: 'r보노 (Rev Bono)',
    steps: [
      {
        fixtureValues: {
          1: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          3: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          5: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          7: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          9: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          11: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 90, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          2: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          4: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          6: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          8: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          10: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          12: { [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
        }
      }
    ]
  },
  {
    id: 'B5',
    bank: 'B',
    number: 5,
    name: '화염 (Flame)',
    steps: [
      {
        fixtureValues: {
          1: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          3: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          5: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          7: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          9: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          11: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          2: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          4: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          6: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          8: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          10: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          12: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
        }
      },
      {
        fixtureValues: {
          1: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          3: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          5: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          7: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          9: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          11: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 40, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          2: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          4: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          6: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          8: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          10: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          12: { [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
        }
      }
    ]
  },
  {
    id: 'B6',
    bank: 'B',
    number: 6,
    name: '무지개 (Rainbow)',
    steps: [
      { fixtureValues: createUniformAll(100, 0, 0, 0, 100) }, // Red
      { fixtureValues: createUniformAll(0, 100, 0, 0, 100) }, // Green
      { fixtureValues: createUniformAll(0, 0, 100, 0, 100) }, // Blue
      { fixtureValues: createUniformAll(100, 0, 100, 0, 100) } // Purple
    ]
  },
  {
    id: 'B7',
    bank: 'B',
    number: 7,
    name: '노을 (Sunset)',
    steps: [
      { fixtureValues: createUniformAll(100, 50, 0, 20, 100) }
    ]
  },
  {
    id: 'B8',
    bank: 'B',
    number: 8,
    name: '스포트 (Spot)',
    steps: [
      {
        fixtureValues: {
          1: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 50, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          2: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 50, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          3: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 50, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          4: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 50, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          5: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 100, [DMXChannelType.Master]: 100 },
          6: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 100, [DMXChannelType.Master]: 100 },
          7: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 100, [DMXChannelType.Master]: 100 },
          8: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 100, [DMXChannelType.Master]: 100 },
          9: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 50, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          10: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 50, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          11: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 50, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 },
          12: { [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 50, [DMXChannelType.White]: 0, [DMXChannelType.Master]: 100 }
        }
      }
    ]
  }
];
