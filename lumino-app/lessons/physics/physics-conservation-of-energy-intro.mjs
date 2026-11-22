export default {
  "id": "physics-conservation-of-energy-intro",
  "subject": "physics",
  "topicId": "conservation-of-energy",
  "kind": "introduction",
  "level": "intermediate",
  "title": "Introduction to Conservation of energy",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "A freewheeling bicycle slows to a stop. Where did its energy go?",
    "tutorLine": "Track the full 60 J."
  },
  "goal": [
    "Identify energy stores before and after a change",
    "Account for energy transferred to the surroundings"
  ],
  "definitions": [
    {
      "term": "Kinetic energy",
      "meaning": "Energy stored by a moving object."
    },
    {
      "term": "Thermal energy",
      "meaning": "Energy associated with the disordered motion and interactions of particles."
    },
    {
      "term": "System",
      "meaning": "The objects chosen for an energy account."
    }
  ],
  "concept": [
    {
      "title": "Keep an energy account",
      "body": "Energy is conserved when every transfer into and out of the system is included.",
      "alt": "Draw a boundary and label energy stores on either side of it.",
      "tutorLine": "Include the air and the bicycle."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Balance the numbers",
      "steps": [
        "A falling object loses 60 J from its gravitational store and gains 50 J in kinetic energy.",
        "The remaining 10 J has been transferred elsewhere, for example by air resistance."
      ],
      "tutorLine": "Track the full 60 J."
    },
    {
      "kind": "real-world",
      "title": "Feel the brakes warm",
      "steps": [
        "Brake pads rub against a moving wheel.",
        "Energy from the moving bicycle increases thermal energy in the brakes and surroundings."
      ],
      "tutorLine": "Include the air and the bicycle."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "physics-conservation-of-energy-intro-term",
      "skillId": "conservation-of-energy",
      "q": "Which term fits this description? Energy associated with the disordered motion and interactions of particles.",
      "options": [
        "Kinetic energy",
        "System",
        "Thermal energy",
        "Gravitational potential energy"
      ],
      "answer": 2,
      "why": "Thermal energy — Energy associated with the disordered motion and interactions of particles."
    },
    {
      "type": "mcq",
      "id": "physics-conservation-of-energy-intro-apply",
      "skillId": "conservation-of-energy",
      "q": "A motor receives 100 J and lifts a weight by 70 J. How much remains to account for?",
      "options": [
        "170 J",
        "70 J",
        "30 J",
        "0 J"
      ],
      "answer": 2,
      "why": "Subtract the useful transfer from the input."
    },
    {
      "type": "mcq",
      "id": "physics-conservation-of-energy-intro-check",
      "skillId": "conservation-of-energy",
      "q": "Which store increases as a stationary load is lifted higher?",
      "options": [
        "Kinetic only",
        "Gravitational potential",
        "Chemical in the load",
        "Elastic in the ground"
      ],
      "answer": 1,
      "why": "The raised load and Earth have a larger gravitational potential energy store."
    },
    {
      "type": "explain",
      "id": "physics-conservation-of-energy-intro-explain",
      "skillId": "conservation-of-energy",
      "q": "Why can a machine be inefficient even though energy is conserved?",
      "input": [
        "type",
        "speech"
      ],
      "model": "Some input energy reaches stores other than those useful for the intended task."
    }
  ],
  "summary": {
    "takeaways": [
      "Energy is conserved when every transfer into and out of the system is included.",
      "The remaining 10 J has been transferred elsewhere, for example by air resistance.",
      "Energy from the moving bicycle increases thermal energy in the brakes and surroundings."
    ],
    "formula": "Total energy before + transfers in = total energy after + transfers out"
  },
  "sandbox": null
};
