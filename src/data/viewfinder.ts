export interface ViewfinderMoment {
  id: string;
  text: string;
  subtext: string;
  x: number; // percentage position
  y: number;
}

export const viewfinderMoments: ViewfinderMoment[] = [
  { id: '1', text: 'Nassau Community College', subtext: 'Where the eye learned to see', x: 15, y: 20 },
  { id: '2', text: 'FIT NYC', subtext: 'Fashion meets vision', x: 75, y: 15 },
  { id: '3', text: 'AS IF Magazine', subtext: 'Brooklyn. The real ones know.', x: 25, y: 50 },
  { id: '4', text: 'The Bold Move', subtext: 'NYC to Florida. No safety net.', x: 65, y: 45 },
  { id: '5', text: 'PAV Photography', subtext: 'The brand. The legacy.', x: 50, y: 75 },
  { id: '6', text: 'Vogue', subtext: 'They called. She answered.', x: 80, y: 70 },
  { id: '7', text: 'Naturally Unexpected', subtext: 'Always.', x: 40, y: 30 },
  { id: '8', text: '♛', subtext: 'Queen moves only', x: 50, y: 50 },
];
