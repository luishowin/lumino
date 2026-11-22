export default {
  "id": "math-quadratics-intro",
  "subject": "math",
  "topicId": "quadratics",
  "kind": "introduction",
  "level": "advanced",
  "title": "Introduction to Quadratics",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "A rectangle has area 12 m². Its length is one metre more than its width. Where does a squared term enter?",
    "tutorLine": "Look for a pair with product −12 and sum 1."
  },
  "goal": [
    "Recognise a quadratic relationship",
    "Find roots and decide which fit a measurement"
  ],
  "definitions": [
    {
      "term": "Quadratic",
      "meaning": "A polynomial whose highest power is two."
    },
    {
      "term": "Root",
      "meaning": "A value that makes a polynomial equal to zero."
    },
    {
      "term": "Factor",
      "meaning": "An expression multiplied by another to form a product."
    }
  ],
  "concept": [
    {
      "title": "Make one side zero",
      "body": "Factorising a quadratic can turn one equation into two possible linear equations.",
      "alt": "If two numbers multiply to zero, at least one of them must be zero.",
      "tutorLine": "Check both the units and the original area."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Find a width",
      "steps": [
        "Write w(w + 1) = 12 and rearrange to w² + w − 12 = 0.",
        "(w + 4)(w − 3) = 0 gives w = −4 or 3."
      ],
      "tutorLine": "Look for a pair with product −12 and sum 1."
    },
    {
      "kind": "real-world",
      "title": "Interpret the roots",
      "steps": [
        "A physical width must be positive.",
        "Use 3 m for the width and 4 m for the length. Their product is 12 m²."
      ],
      "tutorLine": "Check both the units and the original area."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "math-quadratics-intro-term",
      "skillId": "quadratics",
      "q": "Which term fits this description? A value that makes a polynomial equal to zero.",
      "options": [
        "Root",
        "Coefficient",
        "Quadratic",
        "Factor"
      ],
      "answer": 0,
      "why": "Root — A value that makes a polynomial equal to zero."
    },
    {
      "type": "mcq",
      "id": "math-quadratics-intro-apply",
      "skillId": "quadratics",
      "q": "Which expression is quadratic?",
      "options": [
        "2x + 3",
        "x³ + x",
        "5x",
        "x² − 4"
      ],
      "answer": 3,
      "why": "Its highest power of x is two."
    },
    {
      "type": "mcq",
      "id": "math-quadratics-intro-check",
      "skillId": "quadratics",
      "q": "Which pair solves (x − 2)(x + 5) = 0?",
      "options": [
        "−2 and 5",
        "2 and −5",
        "2 and 5",
        "−2 and −5"
      ],
      "answer": 1,
      "why": "Set each factor equal to zero."
    },
    {
      "type": "explain",
      "id": "math-quadratics-intro-explain",
      "skillId": "quadratics",
      "q": "Why reject a negative width that solves the equation?",
      "input": [
        "type",
        "speech"
      ],
      "model": "It satisfies the algebra but a physical rectangle cannot have a negative width."
    }
  ],
  "summary": {
    "takeaways": [
      "Factorising a quadratic can turn one equation into two possible linear equations.",
      "(w + 4)(w − 3) = 0 gives w = −4 or 3.",
      "Use 3 m for the width and 4 m for the length. Their product is 12 m²."
    ],
    "formula": "If ab = 0, then a = 0 or b = 0."
  },
  "sandbox": null
};
