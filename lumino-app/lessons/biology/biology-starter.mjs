export default {
  "id": "biology-starter",
  "subject": "biology",
  "level": "beginner",
  "title": "Power from light",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "A plant near a window grows new leaves. Where does it get the materials and energy to make sugar?",
    "tutorLine": "Separate what goes in from what is made."
  },
  "goal": [
    "Identify the materials and energy source for photosynthesis",
    "Predict how darkness affects sugar production by photosynthesis"
  ],
  "definitions": [
    {
      "term": "Photosynthesis",
      "meaning": "The process plants use to make sugars using light energy."
    },
    {
      "term": "Glucose",
      "meaning": "A sugar plants make during photosynthesis."
    },
    {
      "term": "Carbon dioxide",
      "meaning": "A gas in the air that supplies carbon for making sugar."
    },
    {
      "term": "Chlorophyll",
      "meaning": "The green substance in plants that absorbs light energy."
    },
    {
      "term": "Oxygen",
      "meaning": "A gas released during photosynthesis."
    }
  ],
  "concept": [
    {
      "title": "Trace the materials",
      "body": "A leaf takes in carbon dioxide from the air. Water absorbed by the roots reaches the leaves. The plant uses both materials to make glucose and releases oxygen.",
      "alt": "Imagine sorting four labels at the leaf door. Carbon dioxide and water go on the “in” side. Glucose and oxygen go on the “made here” side.",
      "tutorLine": "Separate what goes in from what is made.",
      "math": "carbon dioxide + water → glucose + oxygen"
    },
    {
      "title": "Find the energy source",
      "body": "Chlorophyll absorbs light. This energy drives photosynthesis. In darkness the plant can use stored food, but photosynthesis stops.",
      "alt": "Think of a workshop with supplies on the shelf. The materials can still be there when the power goes off, even though production stops.",
      "tutorLine": "Keep the energy source separate from the materials.",
      "math": "Light energy drives sugar production."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Predict the effect of shade and darkness",
      "steps": [
        "A green leaf has water and carbon dioxide available.",
        "The leaf is moved into complete darkness.",
        "It lacks light energy, so it stops making new glucose by photosynthesis."
      ],
      "tutorLine": "Which requirement has changed?"
    },
    {
      "kind": "real-world",
      "title": "Explain a windowsill display",
      "steps": [
        "A gardener places a watered plant where light reaches its leaves.",
        "Its roots supply water. Its leaves take in carbon dioxide.",
        "With light energy the plant can use both to make sugar."
      ],
      "tutorLine": "Trace each input to its source."
    },
    {
      "kind": "activity",
      "title": "Explore the Rainforest trail",
      "body": "Visit the Rainforest trail, then return to trace what plants need.",
      "activityId": "rainforest",
      "tutorLine": "Look for places where light reaches the leaves."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "biology-starter-apply",
      "skillId": "photosynthesis",
      "q": "A garden stays in complete darkness. Which process stops?",
      "options": [
        "Water remaining in the soil",
        "Making glucose by photosynthesis",
        "The plant using stored sugar",
        "Carbon dioxide being present in the air"
      ],
      "answer": 1,
      "why": "Photosynthesis requires light energy. Stored sugar can still be used in the dark."
    },
    {
      "type": "mcq",
      "id": "biology-starter-recall",
      "skillId": "photosynthesis",
      "q": "Which gas do plants take in for photosynthesis?",
      "options": [
        "Carbon dioxide",
        "Oxygen",
        "Nitrogen",
        "Hydrogen"
      ],
      "answer": 0,
      "why": "Carbon dioxide supplies carbon used to make sugar."
    },
    {
      "type": "mcq",
      "id": "biology-starter-compare",
      "skillId": "photosynthesis",
      "q": "Which pair gives the two raw materials for photosynthesis?",
      "options": [
        "Glucose and oxygen",
        "Light and glucose",
        "Water and chlorophyll",
        "Water and carbon dioxide"
      ],
      "answer": 3,
      "why": "Water and carbon dioxide supply matter. Chlorophyll absorbs the light energy used in the process."
    },
    {
      "type": "mcq",
      "id": "biology-starter-transfer",
      "skillId": "photosynthesis",
      "q": "A watered plant has light but no carbon dioxide available. Why can it no longer make glucose by photosynthesis?",
      "options": [
        "Its leaves have no water",
        "Its chlorophyll disappears immediately",
        "It lacks a source of carbon for the sugar",
        "Light has become a raw material"
      ],
      "answer": 2,
      "why": "Carbon dioxide supplies the carbon in the sugar. Light provides energy."
    },
    {
      "type": "mcq",
      "id": "biology-starter-mistake",
      "skillId": "photosynthesis",
      "q": "A learner lists sunlight as a substance that becomes part of a sugar molecule. What should change?",
      "options": [
        "List light as the source of carbon",
        "List light as the energy source",
        "Replace water with light",
        "List light as a gas released"
      ],
      "answer": 1,
      "why": "Light supplies energy. The materials for making glucose come from carbon dioxide and water."
    },
    {
      "type": "mcq",
      "id": "biology-starter-check",
      "skillId": "photosynthesis",
      "q": "Which pair is produced during photosynthesis?",
      "options": [
        "Water and light",
        "Oxygen and chlorophyll",
        "Carbon dioxide and glucose",
        "Glucose and oxygen"
      ],
      "answer": 3,
      "why": "The word equation puts glucose and oxygen on the product side."
    },
    {
      "type": "explain",
      "id": "biology-starter-explain",
      "skillId": "photosynthesis",
      "q": "Explain why watering a plant cannot replace light for photosynthesis.",
      "model": "Water supplies material. Light supplies energy absorbed by chlorophyll. A plant needs both roles filled to make sugar by photosynthesis.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "Water and carbon dioxide supply materials.",
      "Chlorophyll absorbs light energy.",
      "Glucose and oxygen are products."
    ],
    "formula": "Carbon dioxide + water → glucose + oxygen (using light energy)"
  },
  "sandbox": null
};
