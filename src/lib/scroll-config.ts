export const ERA_RANGES = {
  era01: [0, 0.25],
  era02: [0.25, 0.5],
  era03: [0.5, 0.75],
  era04: [0.75, 1],
} as const;

export type EraKey = keyof typeof ERA_RANGES;

export interface EraMeta {
  key: EraKey;
  year: string;
  title: string;
}

export const ERAS: EraMeta[] = [
  { key: "era01", year: "1985", title: "Pixel Was Born" },
  { key: "era02", year: "1994", title: "The explosion of Color" },
  { key: "era03", year: "2001", title: "The Polygon Revolution" },
  { key: "era04", year: "Today", title: "Cloud Immersion" },
];

export const SCROLL_STORY_HEIGHT_VH = ERAS.length * 100;