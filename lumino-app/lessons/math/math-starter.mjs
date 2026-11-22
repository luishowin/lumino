export default {
  "id": "math-starter",
  "subject": "math",
  "level": "beginner",
  "title": "Balancing equations",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "A friend triples a secret number and adds five. The result is twenty. How could you recover the number without guessing?",
    "tutorLine": "Treat the two sides alike."
  },
  "goal": [
    "Keep an equation balanced while changing it",
    "Solve a two-step equation",
    "Check a solution in the original equation"
  ],
  "definitions": [
    {
      "term": "Equation",
      "meaning": "A statement that two expressions have equal value."
    },
    {
      "term": "Variable",
      "meaning": "A letter that stands for a number."
    },
    {
      "term": "Coefficient",
      "meaning": "The number multiplying a variable. In 3x it is 3."
    },
    {
      "term": "Inverse operation",
      "meaning": "An operation that undoes another, such as subtraction undoing addition."
    }
  ],
  "concept": [
    {
      "title": "Keep the balance",
      "body": "Subtracting the same amount from both sides of an equation keeps their values equal.",
      "alt": "Picture two level pans. Remove three identical counters from each pan. The remaining loads still balance.",
      "tutorLine": "Treat the two sides alike.",
      "math": "x + 3 = 8 → x = 5"
    },
    {
      "title": "Undo the last operation first",
      "body": "In 3x + 5, the number is tripled before five is added. Subtract five first, then divide both sides by three.",
      "alt": "Think of putting socks on before shoes. To reverse the sequence, the shoes come off first.",
      "tutorLine": "Work backwards from the result.",
      "math": "3x + 5 = 20 → 3x = 15 → x = 5"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Check a lantern setting",
      "steps": [
        "The setting satisfies 2x + 4 = 12.",
        "Subtract 4 from both sides to get 2x = 8. Divide by 2 to get x = 4.",
        "Check in the original: 2 × 4 + 4 = 12."
      ],
      "tutorLine": "Use the original equation for the check."
    },
    {
      "kind": "real-world",
      "title": "Pack equal bags",
      "steps": [
        "A crate holds three equal bags and two loose stones. There are 17 stones in all.",
        "Remove the two loose stones: 15 remain.",
        "Share 15 among three bags: each contains five stones."
      ],
      "tutorLine": "Which part is shared equally?"
    },
    {
      "kind": "activity",
      "title": "Explore Rice Fields",
      "body": "Try the bridge-building challenge on the Rice Fields trail.",
      "activityId": "rice",
      "tutorLine": "Return here after exploring the crossing."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "math-starter-apply",
      "skillId": "simple-equations",
      "q": "A lantern setting satisfies 2x + 4 = 12. What is x?",
      "options": [
        "3",
        "4",
        "6",
        "8"
      ],
      "answer": 1,
      "why": "Subtract 4 from both sides, then divide the remaining 8 by 2."
    },
    {
      "type": "mcq",
      "id": "math-starter-recall",
      "skillId": "simple-equations",
      "q": "Which first step leaves just 2x on the left of 2x + 4 = 12?",
      "options": [
        "Subtract 4 from both sides",
        "Add 4 to both sides",
        "Divide both sides by 4",
        "Subtract 4 from the left only"
      ],
      "answer": 0,
      "why": "Subtracting 4 cancels the added 4 and keeps the two sides equal."
    },
    {
      "type": "mcq",
      "id": "math-starter-compare",
      "skillId": "simple-equations",
      "q": "Which equation has the solution x = 3?",
      "options": [
        "4x − 1 = 13",
        "3x + 1 = 13",
        "x + 4 = 13",
        "4x + 1 = 13"
      ],
      "answer": 3,
      "why": "Putting 3 in place of x gives 4 × 3 + 1 = 13."
    },
    {
      "type": "mcq",
      "id": "math-starter-transfer",
      "skillId": "simple-equations",
      "q": "Two equal boxes and one loose pencil contain 15 pencils. How many are in each box?",
      "options": [
        "8",
        "14",
        "7",
        "6"
      ],
      "answer": 2,
      "why": "Remove the loose pencil and divide the remaining 14 equally between two boxes."
    },
    {
      "type": "mcq",
      "id": "math-starter-mistake",
      "skillId": "simple-equations",
      "q": "A learner writes x + 6 = 10, so x = 16. Which correction works?",
      "options": [
        "Subtract 6 from the left only",
        "Subtract 6 from both sides",
        "Multiply both sides by 6",
        "Add 6 to both sides to leave x alone"
      ],
      "answer": 1,
      "why": "Subtraction undoes the addition. Ten minus six gives four."
    },
    {
      "type": "mcq",
      "id": "math-starter-check",
      "skillId": "simple-equations",
      "q": "Solve 4x − 3 = 21.",
      "options": [
        "4.5",
        "18",
        "24",
        "6"
      ],
      "answer": 3,
      "why": "Add 3 to both sides to get 4x = 24. Divide by 4 to get 6."
    },
    {
      "type": "explain",
      "id": "math-starter-explain",
      "skillId": "simple-equations",
      "q": "Why does subtracting five from just one side of an equation break the balance?",
      "model": "The two sides started equal. Taking five from only one makes that side smaller. Taking five from both keeps them equal.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "Apply the same operation to both sides.",
      "Undo the last operation first.",
      "Check by replacing the variable with your answer."
    ],
    "formula": "3x + 5 = 20 → 3x = 15 → x = 5"
  },
  "sandbox": null
};
