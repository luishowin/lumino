export default {
  "id": "physics-speed-units",
  "subject": "physics",
  "level": "beginner",
  "title": "Read a speed and its units",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "Two carts pass the same mark. One travels four metres each second. What would you need to know about the other cart to say which is faster?",
    "tutorLine": "Say the distance first, then the time."
  },
  "goal": [
    "Read a speed aloud with its units",
    "Compare two speeds written in the same units"
  ],
  "definitions": [
    {
      "term": "Distance",
      "meaning": "How much ground something covers."
    },
    {
      "term": "Time interval",
      "meaning": "The time between two events."
    },
    {
      "term": "Speed",
      "meaning": "Distance covered per unit of time."
    },
    {
      "term": "Steady speed",
      "meaning": "A speed that stays the same."
    }
  ],
  "concept": [
    {
      "title": "Read the slash",
      "body": "At a steady 3 m/s, each second adds another three metres. Read the slash as “per”.",
      "alt": "Imagine laying down a three-metre ribbon at every tick of a clock. The growing ribbon marks the journey.",
      "tutorLine": "Say the distance first, then the time.",
      "math": "3 m/s = 3 metres per second"
    },
    {
      "title": "Compare equal intervals",
      "body": "Use the same units. In one second, a cart at 5 m/s goes two metres farther than a cart at 3 m/s.",
      "alt": "Start two wind-up toys side by side. Freeze them after one second. The one farther along has covered more ground in the same time.",
      "tutorLine": "Give both carts the same time.",
      "math": "5 m − 3 m = 2 m"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Read a cart label",
      "steps": [
        "The label says 4 m/s.",
        "Choose an interval of one second.",
        "At that steady speed the cart travels 4 m in that interval."
      ],
      "tutorLine": "What does the slash tell you?"
    },
    {
      "kind": "real-world",
      "title": "Two walking routes",
      "steps": [
        "One walker holds 3 km/h and another holds 4 km/h.",
        "After one hour they have covered 3 km and 4 km.",
        "The second walker covers one extra kilometre."
      ],
      "tutorLine": "Compare the same hour for each walker."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "unit-1",
      "skillId": "speed-units",
      "q": "What does a speed of 3 m/s describe?",
      "options": [
        "3 metres every second",
        "3 seconds every metre",
        "3 metres in total",
        "3 seconds in total"
      ],
      "answer": 0,
      "why": "The slash means “per”, so m/s means metres per second."
    },
    {
      "type": "mcq",
      "id": "unit-2",
      "skillId": "speed-units",
      "q": "Which unit measures speed?",
      "options": [
        "s",
        "m²",
        "m",
        "m/s"
      ],
      "answer": 3,
      "why": "Speed has a distance unit divided by a time unit."
    },
    {
      "type": "mcq",
      "id": "unit-3",
      "skillId": "speed-units",
      "q": "What does 60 km/h mean at a steady speed?",
      "options": [
        "60 kilometres each minute",
        "60 minutes per kilometre",
        "60 kilometres each hour",
        "60 kilometres in total"
      ],
      "answer": 2,
      "why": "Read km/h as kilometres per hour."
    },
    {
      "type": "mcq",
      "id": "unit-4",
      "skillId": "speed-units",
      "q": "Two runners hold 4 m/s and 6 m/s. Who covers more ground in one second?",
      "options": [
        "The runner at 4 m/s",
        "The runner at 6 m/s",
        "They cover equal distances",
        "You need their starting positions"
      ],
      "answer": 1,
      "why": "With the same time and units, 6 m is farther than 4 m."
    },
    {
      "type": "mcq",
      "id": "unit-5",
      "skillId": "speed-units",
      "q": "Which measurement is a distance rather than a speed?",
      "options": [
        "12 cm/s",
        "12 m/s",
        "12 km/h",
        "12 m"
      ],
      "answer": 3,
      "why": "Metres measure a length. A speed also tells you the time unit."
    },
    {
      "type": "mcq",
      "id": "unit-6",
      "skillId": "speed-units",
      "q": "A cart covers the same distance in each second. How is it moving?",
      "options": [
        "Its speed is falling",
        "It is stopped",
        "Its speed is steady",
        "Its speed is rising"
      ],
      "answer": 2,
      "why": "Equal distances in equal times mean the speed is steady."
    },
    {
      "type": "explain",
      "id": "physics-speed-units-explain",
      "skillId": "speed-units",
      "q": "A friend says “12 m” tells you how fast a cart moves. What information is missing?",
      "model": "Twelve metres tells me the distance. I need the time it took to cover those metres to find its average speed.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "Speed pairs a distance with a time.",
      "Read m/s as metres per second.",
      "At steady speed, equal time intervals add equal distances."
    ],
    "formula": "Steady 4 m/s → 4 m each second"
  },
  "sandbox": null
};
