/**
 * @fileoverview Registry of host stadium data for the FIFA World Cup 2026.
 * Provides static mock data for the 5 key stadiums used in the app,
 * including match configurations, transit links, accessibility metrics,
 * and environmental KPIs.
 */

export interface TeamConfig {
  readonly name: string;
  readonly letter: string;
  readonly colorFrom: string;
  readonly colorTo: string;
}

export interface MatchConfig {
  readonly teams: {
    readonly teamA: TeamConfig;
    readonly teamB: TeamConfig;
  };
  readonly kickoff: string;
}

export interface AccessibilityConfig {
  readonly stepFreeEntrances: readonly string[];
  readonly elevators: number;
  readonly wheelchairSpaces: number;
}

export interface TransportConfig {
  readonly line: string;
  readonly travelTimeMin: number;
  readonly busRoute: string;
  readonly shuttleFreq: number;
}

export interface SustainabilityConfig {
  readonly certification: string;
  readonly renewableEnergyPercent: number;
  readonly solarPanels: number;
  readonly evStations: number;
  readonly waterRecyclingPercent: number;
  readonly wasteRecyclingPercent: number;
}

export interface StadiumData {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly country: string;
  readonly capacity: number;
  readonly match: MatchConfig;
  readonly accessibility: AccessibilityConfig;
  readonly transport: TransportConfig;
  readonly sustainability: SustainabilityConfig;
}

export const STADIUMS: Readonly<Record<string, StadiumData>> = {
  metlife: {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'East Rutherford, NJ',
    country: 'USA',
    capacity: 82500,
    match: {
      teams: {
        teamA: { name: 'USA', letter: 'U', colorFrom: 'from-blue-600', colorTo: 'to-blue-800' },
        teamB: { name: 'Germany', letter: 'G', colorFrom: 'from-yellow-400', colorTo: 'to-yellow-600' },
      },
      kickoff: '20:00',
    },
    accessibility: {
      stepFreeEntrances: ['Gate A', 'Gate C', 'Gate E'],
      elevators: 24,
      wheelchairSpaces: 800,
    },
    transport: {
      line: 'NJ Transit Meadowlands Line',
      travelTimeMin: 12,
      busRoute: 'Express 351',
      shuttleFreq: 15,
    },
    sustainability: {
      certification: 'LEED Gold',
      renewableEnergyPercent: 78,
      solarPanels: 1500,
      evStations: 120,
      waterRecyclingPercent: 65,
      wasteRecyclingPercent: 85,
    },
  },
  sofi: {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Los Angeles, CA',
    country: 'USA',
    capacity: 70240,
    match: {
      teams: {
        teamA: { name: 'USA', letter: 'U', colorFrom: 'from-blue-600', colorTo: 'to-blue-800' },
        teamB: { name: 'Mexico', letter: 'M', colorFrom: 'from-green-600', colorTo: 'to-green-800' },
      },
      kickoff: '17:30',
    },
    accessibility: {
      stepFreeEntrances: ['Entry 4', 'Entry 7', 'Entry 10'],
      elevators: 32,
      wheelchairSpaces: 950,
    },
    transport: {
      line: 'Metro C Line Shuttle',
      travelTimeMin: 8,
      busRoute: 'LA Metro Bus 117',
      shuttleFreq: 10,
    },
    sustainability: {
      certification: 'LEED Gold',
      renewableEnergyPercent: 85,
      solarPanels: 2000,
      evStations: 150,
      waterRecyclingPercent: 100,
      wasteRecyclingPercent: 80,
    },
  },
  azteca: {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    capacity: 87523,
    match: {
      teams: {
        teamA: { name: 'Mexico', letter: 'M', colorFrom: 'from-green-600', colorTo: 'to-green-800' },
        teamB: { name: 'Argentina', letter: 'A', colorFrom: 'from-blue-400', colorTo: 'to-blue-600' },
      },
      kickoff: '18:00',
    },
    accessibility: {
      stepFreeEntrances: ['Gate 1 (Especial)', 'Gate 3'],
      elevators: 8,
      wheelchairSpaces: 450,
    },
    transport: {
      line: 'Xochimilco Light Rail',
      travelTimeMin: 15,
      busRoute: 'Metrobus Line 1',
      shuttleFreq: 20,
    },
    sustainability: {
      certification: 'Green Star standard',
      renewableEnergyPercent: 60,
      solarPanels: 950,
      evStations: 40,
      waterRecyclingPercent: 50,
      wasteRecyclingPercent: 90,
    },
  },
  bc_place: {
    id: 'bc_place',
    name: 'BC Place',
    city: 'Vancouver, BC',
    country: 'Canada',
    capacity: 54500,
    match: {
      teams: {
        teamA: { name: 'Canada', letter: 'C', colorFrom: 'from-red-600', colorTo: 'to-red-800' },
        teamB: { name: 'Croatia', letter: 'H', colorFrom: 'from-red-400', colorTo: 'to-red-200' },
      },
      kickoff: '16:00',
    },
    accessibility: {
      stepFreeEntrances: ['Gate C', 'Gate H (Accessible)'],
      elevators: 12,
      wheelchairSpaces: 500,
    },
    transport: {
      line: 'Expo Line SkyTrain',
      travelTimeMin: 5,
      busRoute: 'False Creek Ferries',
      shuttleFreq: 12,
    },
    sustainability: {
      certification: 'LEED Silver',
      renewableEnergyPercent: 100,
      solarPanels: 400,
      evStations: 60,
      waterRecyclingPercent: 70,
      wasteRecyclingPercent: 95,
    },
  },
  att: {
    id: 'att',
    name: 'AT&T Stadium',
    city: 'Arlington, TX',
    country: 'USA',
    capacity: 80000,
    match: {
      teams: {
        teamA: { name: 'USA', letter: 'U', colorFrom: 'from-blue-600', colorTo: 'to-blue-800' },
        teamB: { name: 'England', letter: 'E', colorFrom: 'from-red-500', colorTo: 'to-red-700' },
      },
      kickoff: '19:00',
    },
    accessibility: {
      stepFreeEntrances: ['Gate 1', 'Gate 5', 'Gate 10'],
      elevators: 28,
      wheelchairSpaces: 750,
    },
    transport: {
      line: 'Arlington On-Demand Shuttle',
      travelTimeMin: 10,
      busRoute: 'TRE Link Bus',
      shuttleFreq: 15,
    },
    sustainability: {
      certification: 'LEED Certified',
      renewableEnergyPercent: 70,
      solarPanels: 1200,
      evStations: 80,
      waterRecyclingPercent: 60,
      wasteRecyclingPercent: 70,
    },
  },
};
