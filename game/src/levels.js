export const ROOMS = [
  {
    id: 0,
    name: "Gallery Hall",
    bounds: { x: 50, y: 50, width: 924, height: 668 },
    doors: [{ x: 950, y: 350, width: 24, height: 80, targetRoom: 1, targetX: 100, targetY: 380 }],
    scooter: { x: 100, y: 380, width: 40, height: 40 },
    walls: [
      { x: 50, y: 50, width: 924, height: 20 },
      { x: 50, y: 698, width: 924, height: 20 },
      { x: 50, y: 50, width: 20, height: 300 },
      { x: 50, y: 430, width: 20, height: 288 },
      { x: 974, y: 50, width: 20, height: 300 },
      { x: 974, y: 430, width: 20, height: 288 },
    ],
    pillars: [
      { x: 400, y: 200, width: 60, height: 60 },
      { x: 700, y: 500, width: 60, height: 60 },
    ],
    loot: [
      { id: 'diamond', type: 'diamond', x: 250, y: 340, width: 32, height: 32, value: 25000, collected: false },
      { id: 'p1', type: 'painting', x: 200, y: 60, width: 40, height: 16, value: 5000, collected: false },
      { id: 'p2', type: 'painting', x: 600, y: 60, width: 40, height: 16, value: 5000, collected: false },
      { id: 'g1', type: 'gold', x: 750, y: 350, width: 24, height: 24, value: 2500, collected: false },
    ]
  },
  {
    id: 1,
    name: "Vault Corridor",
    bounds: { x: 50, y: 50, width: 924, height: 668 },
    doors: [
      { x: 50, y: 350, width: 24, height: 80, targetRoom: 0, targetX: 930, targetY: 380 },
      { x: 950, y: 350, width: 24, height: 80, targetRoom: 2, targetX: 100, targetY: 380 }
    ],
    walls: [
      { x: 50, y: 50, width: 924, height: 20 },
      { x: 50, y: 698, width: 924, height: 20 },
      { x: 50, y: 50, width: 20, height: 300 },
      { x: 50, y: 430, width: 20, height: 288 },
      { x: 974, y: 50, width: 20, height: 300 },
      { x: 974, y: 430, width: 20, height: 288 },
    ],
    pillars: [
      { x: 250, y: 180, width: 50, height: 120 },
      { x: 500, y: 460, width: 50, height: 120 },
      { x: 750, y: 180, width: 50, height: 120 },
    ],
    loot: [
      { id: 'g2', type: 'gold', x: 500, y: 200, width: 24, height: 24, value: 2500, collected: false },
      { id: 'g3', type: 'gold', x: 500, y: 540, width: 24, height: 24, value: 2500, collected: false },
    ]
  },
  {
    id: 2,
    name: "Diamond Chamber",
    bounds: { x: 50, y: 50, width: 924, height: 668 },
    doors: [
      { x: 50, y: 350, width: 24, height: 80, targetRoom: 1, targetX: 930, targetY: 380 }
    ],
    walls: [
      { x: 50, y: 50, width: 924, height: 20 },
      { x: 50, y: 698, width: 924, height: 20 },
      { x: 50, y: 50, width: 20, height: 668 },
      { x: 974, y: 50, width: 20, height: 668 },
    ],
    pillars: [
      { x: 300, y: 250, width: 60, height: 60 },
      { x: 300, y: 460, width: 60, height: 60 },
      { x: 700, y: 250, width: 60, height: 60 },
      { x: 700, y: 460, width: 60, height: 60 },
    ],
    loot: [
      { id: 'diamond2', type: 'diamond', x: 500, y: 360, width: 32, height: 32, value: 25000, collected: false }
    ]
  }
];
