export default {
  "id": "chemistry-starter",
  "subject": "chemistry",
  "level": "beginner",
  "title": "Change that lasts",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "An ice cube melts beside an iron gate. The gate has orange flakes. Has each material become a different substance?",
    "tutorLine": "Ask what is present afterwards."
  },
  "goal": [
    "Classify a change using the substance present afterwards",
    "Explain why a change in appearance alone gives limited evidence"
  ],
  "definitions": [
    {
      "term": "Substance",
      "meaning": "A material with its own chemical identity, such as water or iron."
    },
    {
      "term": "State",
      "meaning": "The solid, liquid or gas form of a substance."
    },
    {
      "term": "Physical change",
      "meaning": "A change that leaves the chemical identity of the substance the same."
    },
    {
      "term": "Chemical change",
      "meaning": "A change in which one or more new substances form."
    }
  ],
  "concept": [
    {
      "title": "Follow the substance",
      "body": "Ice is solid water. A puddle made by melting ice is liquid water. The state changed while the substance stayed water.",
      "alt": "Picture the label on a sample jar. You would still write “water” on it after the ice melted.",
      "tutorLine": "Ask what is present afterwards.",
      "math": "solid water → liquid water"
    },
    {
      "title": "Look for a new substance",
      "body": "Iron can react with oxygen and water to form rust. Rust has a different chemical identity from the iron it came from.",
      "alt": "Imagine sorting samples into drawers by substance. A bent iron nail belongs in the iron drawer. The rust scraped from its surface needs a different label.",
      "tutorLine": "A different appearance is a clue to investigate.",
      "math": "iron + oxygen + water → rust"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Classify a crushed ice cube",
      "steps": [
        "Before crushing, the cube is solid water.",
        "After crushing, each piece is still solid water.",
        "Only size and shape changed. This is a physical change."
      ],
      "tutorLine": "Think about the smallest piece you can see."
    },
    {
      "kind": "real-world",
      "title": "Inspect a workshop gate",
      "steps": [
        "A dent changes the shape of an iron gate.",
        "A damp patch on the gate later develops rust.",
        "The dent is physical. The rust formed in a chemical change."
      ],
      "tutorLine": "Separate the two observations."
    },
    {
      "kind": "activity",
      "title": "Explore the City trail",
      "body": "Visit the City trail and return to finish your material-change checks.",
      "activityId": "city",
      "tutorLine": "Watch for materials you could describe before and after a change."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "chemistry-starter-apply",
      "skillId": "physical-and-chemical-change",
      "q": "An iron panel develops rust. What kind of change formed the rust?",
      "options": [
        "Physical change of shape",
        "Chemical change",
        "Physical change of state",
        "Mixing without a reaction"
      ],
      "answer": 1,
      "why": "Rust is a new substance formed when iron reacts with oxygen in the presence of water."
    },
    {
      "type": "mcq",
      "id": "chemistry-starter-recall",
      "skillId": "physical-and-chemical-change",
      "q": "Which example is a physical change?",
      "options": [
        "Melting ice",
        "Burning wood",
        "Rusting iron",
        "Cooking an egg"
      ],
      "answer": 0,
      "why": "The melted water has changed state and is still water."
    },
    {
      "type": "mcq",
      "id": "chemistry-starter-compare",
      "skillId": "physical-and-chemical-change",
      "q": "Which observation most directly establishes a chemical change?",
      "options": [
        "The sample got smaller",
        "The sample changed position",
        "The sample became flat",
        "A new substance was identified"
      ],
      "answer": 3,
      "why": "A chemical change is defined by the formation of a new substance."
    },
    {
      "type": "mcq",
      "id": "chemistry-starter-transfer",
      "skillId": "physical-and-chemical-change",
      "q": "A worker cuts copper wire into short pieces. What remains?",
      "options": [
        "A new metal",
        "Copper turned into gas",
        "Copper in shorter lengths",
        "A chemical product at every cut"
      ],
      "answer": 2,
      "why": "Cutting changes the dimensions of the wire. The material remains copper."
    },
    {
      "type": "mcq",
      "id": "chemistry-starter-mistake",
      "skillId": "physical-and-chemical-change",
      "q": "A learner says boiling water must be a chemical change because bubbles appear. What is in those bubbles during steady boiling?",
      "options": [
        "New oxygen made by boiling",
        "Water vapour",
        "New hydrogen made by boiling",
        "Liquid droplets only"
      ],
      "answer": 1,
      "why": "Boiling turns liquid water into water vapour. Bubbles can appear without a new substance forming."
    },
    {
      "type": "mcq",
      "id": "chemistry-starter-check",
      "skillId": "physical-and-chemical-change",
      "q": "Which pair shows two physical changes?",
      "options": [
        "Rusting iron and bending wire",
        "Burning wood and melting ice",
        "Cooking an egg and rusting iron",
        "Bending wire and freezing water"
      ],
      "answer": 3,
      "why": "Bending changes shape and freezing changes state. Both preserve the substances involved."
    },
    {
      "type": "explain",
      "id": "chemistry-starter-explain",
      "skillId": "physical-and-chemical-change",
      "q": "A ceramic cup breaks and is hard to put back together. Is that enough to call the break a chemical change? Explain.",
      "model": "No. The pieces are still ceramic. Whether a change is easy to reverse does not tell me that a new substance formed.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "A change of state can leave the substance the same.",
      "A chemical change forms a new substance.",
      "Use the identity of the material as evidence."
    ],
    "formula": "New substance formed → chemical change. Same substances throughout → physical change."
  },
  "sandbox": null
};
