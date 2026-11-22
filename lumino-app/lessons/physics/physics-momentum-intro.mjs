export default {
  "id": "physics-momentum-intro",
  "subject": "physics",
  "topicId": "momentum",
  "kind": "introduction",
  "level": "advanced",
  "title": "Introduction to Momentum",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "Two loaded trolleys roll at the same speed. Which would need a larger push to stop in the same time?",
    "tutorLine": "Write the direction beside the value."
  },
  "goal": [
    "Calculate momentum with a direction",
    "Use a system total to analyse a collision"
  ],
  "definitions": [
    {
      "term": "Velocity",
      "meaning": "Speed in a stated direction."
    },
    {
      "term": "Momentum",
      "meaning": "Mass multiplied by velocity."
    },
    {
      "term": "Impulse",
      "meaning": "Change in momentum caused by a force acting over time."
    }
  ],
  "concept": [
    {
      "title": "Choose a positive direction",
      "body": "Momentum has direction. Add signed momenta before comparing totals.",
      "alt": "Two equal trolleys moving in opposite directions can have zero total momentum.",
      "tutorLine": "Count both trolleys before and after."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Count a trolley’s momentum",
      "steps": [
        "Take right as positive. A 2 kg trolley moves right at 3 m/s.",
        "Its momentum is +6 kg m/s."
      ],
      "tutorLine": "Write the direction beside the value."
    },
    {
      "kind": "real-world",
      "title": "Couple two trolleys",
      "steps": [
        "The moving trolley joins a stationary 1 kg trolley with negligible external impulse.",
        "The 3 kg pair shares +6 kg m/s and moves right at 2 m/s."
      ],
      "tutorLine": "Count both trolleys before and after."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "physics-momentum-intro-term",
      "skillId": "momentum",
      "q": "Which term fits this description? Mass multiplied by velocity.",
      "options": [
        "Impulse",
        "Momentum",
        "Force",
        "Velocity"
      ],
      "answer": 1,
      "why": "Momentum — Mass multiplied by velocity."
    },
    {
      "type": "mcq",
      "id": "physics-momentum-intro-apply",
      "skillId": "momentum",
      "q": "A 4 kg cart moves left at 2 m/s. Right is positive. Its momentum is…",
      "options": [
        "+8 kg m/s",
        "−2 kg m/s",
        "+2 kg m/s",
        "−8 kg m/s"
      ],
      "answer": 3,
      "why": "Use a velocity of −2 m/s."
    },
    {
      "type": "mcq",
      "id": "physics-momentum-intro-check",
      "skillId": "momentum",
      "q": "When does total momentum stay constant?",
      "options": [
        "Whenever speeds match",
        "When net external impulse is zero",
        "Only if objects stick",
        "Only for one object"
      ],
      "answer": 1,
      "why": "Only a net external impulse changes the total."
    },
    {
      "type": "explain",
      "id": "physics-momentum-intro-explain",
      "skillId": "momentum",
      "q": "How can total momentum be zero while both trolleys move?",
      "input": [
        "type",
        "speech"
      ],
      "model": "Equal momenta in opposite directions cancel in the signed sum."
    }
  ],
  "summary": {
    "takeaways": [
      "Momentum has direction. Add signed momenta before comparing totals.",
      "Its momentum is +6 kg m/s.",
      "The 3 kg pair shares +6 kg m/s and moves right at 2 m/s."
    ],
    "formula": "Momentum = mass × velocity"
  },
  "sandbox": null
};
