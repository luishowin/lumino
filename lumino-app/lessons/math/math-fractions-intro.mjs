export default {
  "id": "math-fractions-intro",
  "subject": "math",
  "topicId": "fractions",
  "kind": "introduction",
  "level": "beginner-plus",
  "title": "Introduction to Fractions",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "Half a tray and two quarters of the same tray can feed the same group. How can different numbers describe the same share?",
    "tutorLine": "Name the size of the pieces before adding."
  },
  "goal": [
    "Identify the whole and its equal parts",
    "Compare and combine fractions using a common denominator"
  ],
  "definitions": [
    {
      "term": "Numerator",
      "meaning": "The top number counting selected parts."
    },
    {
      "term": "Denominator",
      "meaning": "The bottom number counting equal parts in one whole."
    },
    {
      "term": "Equivalent fractions",
      "meaning": "Different fractions with the same value."
    }
  ],
  "concept": [
    {
      "title": "Use equal-sized pieces",
      "body": "A fraction compares selected equal parts with all the equal parts in one whole.",
      "alt": "Fold each half of a strip in two and the same strip now has four quarters.",
      "tutorLine": "Keep the whole litre in view."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Add equal parts",
      "steps": [
        "Write one half as two quarters.",
        "Two quarters plus one quarter makes three quarters."
      ],
      "tutorLine": "Name the size of the pieces before adding."
    },
    {
      "kind": "real-world",
      "title": "Share a litre",
      "steps": [
        "A jug holds a litre and each cup holds one quarter of a litre.",
        "Filling three cups uses three quarters of the jug."
      ],
      "tutorLine": "Keep the whole litre in view."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "math-fractions-intro-term",
      "skillId": "fractions",
      "q": "Which term fits this description? The bottom number counting equal parts in one whole.",
      "options": [
        "Numerator",
        "Equivalent fractions",
        "Denominator",
        "Reciprocal"
      ],
      "answer": 2,
      "why": "Denominator — The bottom number counting equal parts in one whole."
    },
    {
      "type": "mcq",
      "id": "math-fractions-intro-apply",
      "skillId": "fractions",
      "q": "Which is equivalent to 2/3?",
      "options": [
        "3/4",
        "4/6",
        "2/6",
        "4/3"
      ],
      "answer": 1,
      "why": "Multiply numerator and denominator by 2."
    },
    {
      "type": "mcq",
      "id": "math-fractions-intro-check",
      "skillId": "fractions",
      "q": "What is 1/4 + 1/2?",
      "options": [
        "2/6",
        "1/6",
        "3/4",
        "2/4"
      ],
      "answer": 2,
      "why": "Convert the half into two quarters before adding."
    },
    {
      "type": "explain",
      "id": "math-fractions-intro-explain",
      "skillId": "fractions",
      "q": "Why can half of one cake be larger than half of another?",
      "input": [
        "type",
        "speech"
      ],
      "model": "A half describes a proportion, so the actual amount depends on the size of the whole."
    }
  ],
  "summary": {
    "takeaways": [
      "A fraction compares selected equal parts with all the equal parts in one whole.",
      "Two quarters plus one quarter makes three quarters.",
      "Filling three cups uses three quarters of the jug."
    ],
    "formula": "Use the same whole and equal-sized parts."
  },
  "sandbox": null
};
