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
      [DMXChannelType.Strobe]: 0,
    };
  }
  return vals;
};

export const DEFAULT_SCENES: ScenePreset[] = [
  {
    id: "A1",
    bank: "A",
    number: 1,
    name: "1",
    fixtureValues: {
      1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A2",
    bank: "A",
    number: 2,
    name: "12",
    fixtureValues: {
      12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A9",
    bank: "A",
    number: 9,
    name: "1-6",
    fixtureValues: {
      1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A10",
    bank: "A",
    number: 10,
    name: "7-12",
    fixtureValues: {
      7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A3",
    bank: "A",
    number: 3,
    name: "Base",
    fixtureValues: {
      3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A11",
    bank: "A",
    number: 11,
    name: "rBase",
    fixtureValues: {
      2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A4",
    bank: "A",
    number: 4,
    name: "Red",
    fixtureValues: {
      1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 },
      2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.White]: 34, [DMXChannelType.Strobe]: 0 },
      4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 28, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
      6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 35, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
      7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 35, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
      9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 28, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
      11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.White]: 34, [DMXChannelType.Strobe]: 0 },
      12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A5",
    bank: "A",
    number: 5,
    name: "Green",
    fixtureValues: {
      1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
      2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 44, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
      4: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 51, [DMXChannelType.Strobe]: 0 },
      6: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.White]: 56, [DMXChannelType.Strobe]: 0 },
      7: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.White]: 56, [DMXChannelType.Strobe]: 0 },
      9: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 51, [DMXChannelType.Strobe]: 0 },
      11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 44, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
      12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A6",
    bank: "A",
    number: 6,
    name: "Blue",
    fixtureValues: {
      1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 62, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 44, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 41, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      6: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 44, [DMXChannelType.Strobe]: 0 },
      7: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 44, [DMXChannelType.Strobe]: 0 },
      9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 41, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 44, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 62, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A15",
    bank: "A",
    number: 15,
    name: "White",
    fixtureValues: {
      1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A12",
    bank: "A",
    number: 12,
    name: "rRed",
    fixtureValues: {
      3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Strobe]: 0 },
      5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 34, [DMXChannelType.Strobe]: 0 },
      8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 34, [DMXChannelType.Strobe]: 0 },
      10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A13",
    bank: "A",
    number: 13,
    name: "rGreen",
    fixtureValues: {
      3: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
      5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 40, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
      8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 40, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
      10: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A14",
    bank: "A",
    number: 14,
    name: "rBlue",
    fixtureValues: {
      3: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      5: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 49, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      8: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 49, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      10: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A7",
    bank: "A",
    number: 7,
    name: "RGB",
    fixtureValues: {
      1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
      12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
    }
  },
  {
    id: "A8",
    bank: "A",
    number: 8,
    name: "Middle",
    fixtureValues: {
      6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
      7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
    }
  }
];

export const DEFAULT_CHASES: ChasePreset[] = [
  {
    id: "A1",
    bank: "A",
    number: 1,
    name: "Out",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A9",
    bank: "A",
    number: 9,
    name: "In",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A2",
    bank: "A",
    number: 2,
    name: "Right",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 4,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 5,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 6,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 7,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A10",
    bank: "A",
    number: 10,
    name: "Left",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 4,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 5,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 6,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 7,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A3",
    bank: "A",
    number: 3,
    name: "Right1",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A11",
    bank: "A",
    number: 11,
    name: "Left1",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A7",
    bank: "A",
    number: 7,
    name: "RGB",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 4,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 5,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 6,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 0, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A4",
    bank: "A",
    number: 4,
    name: "Red",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Blue]: 37, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 41, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 50, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 41, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 41, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 50, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 41, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Blue]: 37, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 53, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.White]: 48, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Blue]: 52, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 49, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 49, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Blue]: 52, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.White]: 48, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 53, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 53, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Blue]: 44, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 51, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 42, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 42, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 51, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Blue]: 44, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 53, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 100, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A5",
    bank: "A",
    number: 5,
    name: "Green",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 54, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.White]: 53, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 50, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 50, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.White]: 53, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 54, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 48, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 46, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 57, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 57, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 46, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 48, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 50, [DMXChannelType.Green]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 49, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.White]: 54, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 56, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 48, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 51, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 51, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 48, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 56, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.White]: 54, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 49, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 4,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 52, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 52, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 53, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 53, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 53, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 53, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 52, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 52, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 100, [DMXChannelType.Blue]: 0, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A6",
    bank: "A",
    number: 6,
    name: "Blue",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 51, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 56, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 54, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 47, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 47, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 54, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 56, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 51, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 2,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 50, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 41, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 47, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 46, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 46, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 47, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 41, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 50, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 3,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 41, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 39, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 51, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 42, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 49, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 49, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 42, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 51, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 39, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 41, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
        }
      },
      {
        stepNumber: 4,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 },
          2: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 46, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          3: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 45, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          4: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 41, [DMXChannelType.Strobe]: 0 },
          5: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          6: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 50, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          7: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 50, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          8: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          9: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 41, [DMXChannelType.Strobe]: 0 },
          10: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 45, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          11: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 46, [DMXChannelType.Blue]: 100, [DMXChannelType.White]: 0, [DMXChannelType.Strobe]: 0 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.Red]: 0, [DMXChannelType.Green]: 0, [DMXChannelType.Blue]: 100, [DMXChannelType.Strobe]: 0 }
        }
      }
    ]
  },
  {
    id: "A8",
    bank: "A",
    number: 8,
    name: "sStrobe",
    steps: [
      {
        stepNumber: 1,
        fixtureValues: {
          1: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 53, [DMXChannelType.Strobe]: 49 },
          12: { [DMXChannelType.Master]: 100, [DMXChannelType.White]: 53, [DMXChannelType.Strobe]: 49 }
        }
      }
    ]
  },
  {
    id: "A12",
    bank: "A",
    number: 12,
    name: "Rainbow",
    steps: [
      { stepNumber: 1, fixtureValues: createUniformAll(100, 0, 0, 0, 100) },
      { stepNumber: 2, fixtureValues: createUniformAll(100, 100, 0, 0, 100) },
      { stepNumber: 3, fixtureValues: createUniformAll(0, 100, 0, 0, 100) },
      { stepNumber: 4, fixtureValues: createUniformAll(0, 100, 100, 0, 100) },
      { stepNumber: 5, fixtureValues: createUniformAll(0, 0, 100, 0, 100) },
      { stepNumber: 6, fixtureValues: createUniformAll(100, 0, 100, 0, 100) }
    ]
  }
];
