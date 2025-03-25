export interface Game {
    _id: string;
    name: string;
    active: boolean;
    leagues: League[];
}

export interface League {
    _id: string,
    name: string,
    active: boolean,
    seasons: Season[]
}

// NEW: Add Season interface
export interface Season {
    seasonNumber: number;
    startDate: number;
    endDate: number;
    active: boolean;
    meetingDays: string[];
    numberOfRounds: number;
    roundLengthWeeks: number;
    globalScorecard: Scorecard;
    rounds: Round[];
}

// NEW: Add Round interface
export interface Round {
    round_number: number;
    start_date: number;
    end_date: number;
    scorecard: Scorecard;
    active: boolean;
}

// NEW: Add Scorecard interface
export interface Scorecard {
    name: string;
    points: ScorecardPoint[];
}

// NEW: Add ScorecardPoint interface
export interface ScorecardPoint {
    name: string;
    value: number;
    description: string;
}