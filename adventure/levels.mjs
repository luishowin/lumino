export const trails = [
  {
    id: 'wheat', name: 'Wheat Fields', title: 'The signal trail', highlight: '#ecc56e', sky: '#487aa3',
    goal: 'Run and jump across the broken causeway to reach the signal post.',
    platforms: [[0, 308, 320], [410, 274, 165], [645, 312, 235], [980, 272, 215], [1276, 304, 500]],
    exit: 1605,
  },
  {
    id: 'rice', name: 'Rice Fields', title: 'The terrace crossing', highlight: '#b6e76d', sky: '#367d82',
    goal: 'Place three 2-metre panels to bridge a 6-metre irrigation channel.',
    platforms: [[0, 298, 432], [624, 298, 375], [1080, 272, 205], [1360, 304, 420]],
    exit: 1620, action: 'Build', station: 409,
  },
  {
    id: 'mountains', name: 'Rocky Mountains', title: 'The gravity swing', highlight: '#c3def4', sky: '#5182b6',
    goal: 'Grab the rope at the cliff marker. Watch your speed change as the rope swings through its lowest point.',
    platforms: [[0, 281, 427], [668, 279, 280], [1024, 246, 210], [1308, 301, 450]],
    exit: 1600, action: 'Swing', station: 396,
  },
  {
    id: 'city', name: 'City Skyline', title: 'The frozen switch', highlight: '#ef9de0', sky: '#5c4a87',
    goal: 'Fire a heat pulse from the marked rooftop to melt the ice around the switch.',
    platforms: [[0, 290, 627], [709, 260, 198], [1000, 300, 225], [1305, 270, 480]],
    exit: 1620, action: 'Fire pulse', station: 390, target: [523, 271],
  },
  {
    id: 'rainforest', name: 'Rainforest', title: 'A clearing for seeds', highlight: '#a1e294', sky: '#366e66',
    goal: 'Throw a seed from the marked ledge into the sunlit planter.',
    platforms: [[0, 274, 476], [514, 292, 205], [795, 251, 165], [1055, 294, 238], [1365, 266, 430]],
    exit: 1615, action: 'Throw seed', station: 390, target: [538, 275],
  },
  {
    id: 'desert', name: 'Desert', title: 'The canyon relay', highlight: '#ffd196', sky: '#557db2',
    goal: 'Cross the canyon ruins to reach the relay, then restore its power.',
    platforms: [[0, 307, 345], [444, 272, 184], [700, 306, 225], [1015, 263, 253], [1344, 308, 456]],
    exit: 1630,
  },
];

export function landscape(trail) {
  return new URL(`../assets/landscapes/${trail.id}.webp`, import.meta.url).href;
}
