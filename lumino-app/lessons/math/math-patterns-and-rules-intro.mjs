export default {
  "id": "math-patterns-and-rules-intro",
  "subject": "math",
  "topicId": "patterns-and-rules",
  "kind": "introduction",
  "level": "intermediate",
  "title": "Introduction to Patterns and rules",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "A tile border needs 5 tiles, then 8, then 11. Can you order enough tiles for the twentieth border?",
    "tutorLine": "Count the jumps, not the labels."
  },
  "goal": [
    "Compare successive differences",
    "Use a position rule to predict a term"
  ],
  "definitions": [
    {
      "term": "Term",
      "meaning": "One value in a sequence."
    },
    {
      "term": "Common difference",
      "meaning": "The constant change between consecutive terms of an arithmetic sequence."
    },
    {
      "term": "Position",
      "meaning": "The term number, starting here at one."
    }
  ],
  "concept": [
    {
      "title": "Connect position and value",
      "body": "For a constant step, start at the first value and add one step for each later position.",
      "alt": "The fifth term is four jumps from the first term.",
      "tutorLine": "Check the rule against a small row."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Predict a border",
      "steps": [
        "Start at 5 tiles with a step of 3.",
        "At position 20 there are 19 steps, giving 5 + 19 × 3 = 62 tiles."
      ],
      "tutorLine": "Count the jumps, not the labels."
    },
    {
      "kind": "real-world",
      "title": "Plan stacked seats",
      "steps": [
        "Rows contain 10, 14, 18 seats and continue increasing by four.",
        "The sixth row has 10 + 5 × 4 = 30 seats."
      ],
      "tutorLine": "Check the rule against a small row."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "math-patterns-and-rules-intro-term",
      "skillId": "patterns-and-rules",
      "q": "Which term fits this description? The constant change between consecutive terms of an arithmetic sequence.",
      "options": [
        "Position",
        "Common difference",
        "Term-to-term rule",
        "Term"
      ],
      "answer": 1,
      "why": "Common difference — The constant change between consecutive terms of an arithmetic sequence."
    },
    {
      "type": "mcq",
      "id": "math-patterns-and-rules-intro-apply",
      "skillId": "patterns-and-rules",
      "q": "Which sequence has a constant difference?",
      "options": [
        "2, 4, 8, 16",
        "1, 4, 9, 16",
        "3, 7, 11, 15",
        "1, 1, 2, 3"
      ],
      "answer": 2,
      "why": "Each term increases by four."
    },
    {
      "type": "mcq",
      "id": "math-patterns-and-rules-intro-check",
      "skillId": "patterns-and-rules",
      "q": "A sequence starts at 7 and adds 2. Its fourth term is…",
      "options": [
        "9",
        "11",
        "15",
        "13"
      ],
      "answer": 3,
      "why": "Add 2 three times to 7."
    },
    {
      "type": "explain",
      "id": "math-patterns-and-rules-intro-explain",
      "skillId": "patterns-and-rules",
      "q": "How could you test a proposed nth-term rule?",
      "input": [
        "type",
        "speech"
      ],
      "model": "Substitute several known positions and compare the predicted terms with the sequence."
    }
  ],
  "summary": {
    "takeaways": [
      "For a constant step, start at the first value and add one step for each later position.",
      "At position 20 there are 19 steps, giving 5 + 19 × 3 = 62 tiles.",
      "The sixth row has 10 + 5 × 4 = 30 seats."
    ],
    "formula": "Term n = first term + (n − 1) × common difference"
  },
  "sandbox": null
};
