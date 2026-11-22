export default {
  "id": "physics-simple-circuits-intro",
  "subject": "physics",
  "topicId": "simple-circuits",
  "kind": "introduction",
  "level": "beginner-plus",
  "title": "Introduction to Simple circuits",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "Why does opening a single switch put out a lamp across the room?",
    "tutorLine": "Try tracing the return path."
  },
  "goal": [
    "Trace a complete conducting path",
    "Distinguish current from potential difference"
  ],
  "definitions": [
    {
      "term": "Circuit",
      "meaning": "A network of connected electrical components."
    },
    {
      "term": "Current",
      "meaning": "Charge passing a point per unit time."
    },
    {
      "term": "Potential difference",
      "meaning": "Energy transferred per unit charge between two points."
    }
  ],
  "concept": [
    {
      "title": "Follow the loop",
      "body": "A cell can drive a steady current around a closed conducting loop.",
      "alt": "Trace a wire from one terminal through the lamp and back to the other terminal.",
      "tutorLine": "Look for a connection at both ends of the cell."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Find the break",
      "steps": [
        "Trace a series loop from the cell to the lamp and switch.",
        "An open switch breaks the loop so the current stops."
      ],
      "tutorLine": "Try tracing the return path."
    },
    {
      "kind": "real-world",
      "title": "A torch flickers",
      "steps": [
        "A loose battery contact interrupts the path.",
        "Restoring contact completes the loop and lets the lamp light."
      ],
      "tutorLine": "Look for a connection at both ends of the cell."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "physics-simple-circuits-intro-term",
      "skillId": "simple-circuits",
      "q": "Which term fits this description? Charge passing a point per unit time.",
      "options": [
        "Current",
        "Resistance",
        "Circuit",
        "Potential difference"
      ],
      "answer": 0,
      "why": "Current — Charge passing a point per unit time."
    },
    {
      "type": "mcq",
      "id": "physics-simple-circuits-intro-apply",
      "skillId": "simple-circuits",
      "q": "What closes the gap in a simple lamp circuit?",
      "options": [
        "An open switch",
        "A closed conducting switch",
        "A plastic strip",
        "An air gap"
      ],
      "answer": 1,
      "why": "A closed switch connects the conducting contacts."
    },
    {
      "type": "mcq",
      "id": "physics-simple-circuits-intro-check",
      "skillId": "simple-circuits",
      "q": "In a steady single-loop circuit, current just after the lamp is…",
      "options": [
        "Zero",
        "Larger than before",
        "Equal to current just before it",
        "Always half"
      ],
      "answer": 2,
      "why": "Charge flows at the same rate throughout a steady series loop."
    },
    {
      "type": "explain",
      "id": "physics-simple-circuits-intro-explain",
      "skillId": "simple-circuits",
      "q": "Why does the lamp need two connections?",
      "input": [
        "type",
        "speech"
      ],
      "model": "They form part of a complete path between the cell terminals."
    }
  ],
  "summary": {
    "takeaways": [
      "A cell can drive a steady current around a closed conducting loop.",
      "An open switch breaks the loop so the current stops.",
      "Restoring contact completes the loop and lets the lamp light."
    ],
    "formula": "Trace the complete loop."
  },
  "sandbox": null
};
