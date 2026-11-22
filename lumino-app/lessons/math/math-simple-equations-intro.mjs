export default {
  "id": "math-simple-equations-intro",
  "subject": "math",
  "topicId": "simple-equations",
  "kind": "introduction",
  "level": "beginner",
  "title": "Introduction to Linear equations",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "Three identical tickets and a 2-shilling fee cost 17 shillings. How can you recover one ticket’s price?",
    "tutorLine": "Undo the fixed fee first."
  },
  "goal": [
    "Represent an unknown with a letter",
    "Solve a linear equation and check it in context"
  ],
  "definitions": [
    {
      "term": "Variable",
      "meaning": "A symbol standing for a number."
    },
    {
      "term": "Equation",
      "meaning": "A statement that two expressions are equal."
    },
    {
      "term": "Inverse operation",
      "meaning": "An operation that undoes another."
    }
  ],
  "concept": [
    {
      "title": "Keep both sides equal",
      "body": "Doing the same reversible operation to both sides preserves the solutions.",
      "alt": "Picture taking equal weights off both sides of balanced scales.",
      "tutorLine": "Check the original total."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Undo the fee",
      "steps": [
        "Write 3x + 2 = 17. Subtract 2 from both sides.",
        "3x = 15, so each ticket costs 5 shillings."
      ],
      "tutorLine": "Undo the fixed fee first."
    },
    {
      "kind": "real-world",
      "title": "Check a receipt",
      "steps": [
        "Replace x by 5 in the original bill.",
        "Three lots of 5 plus 2 gives 17, matching the receipt."
      ],
      "tutorLine": "Check the original total."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "math-simple-equations-intro-term",
      "skillId": "simple-equations",
      "q": "Which term fits this description? A statement that two expressions are equal.",
      "options": [
        "Expression",
        "Variable",
        "Inverse operation",
        "Equation"
      ],
      "answer": 3,
      "why": "Equation — A statement that two expressions are equal."
    },
    {
      "type": "mcq",
      "id": "math-simple-equations-intro-apply",
      "skillId": "simple-equations",
      "q": "Which value solves x + 7 = 12?",
      "options": [
        "5",
        "7",
        "12",
        "19"
      ],
      "answer": 0,
      "why": "Subtract 7 from both sides."
    },
    {
      "type": "mcq",
      "id": "math-simple-equations-intro-check",
      "skillId": "simple-equations",
      "q": "What should you do to both sides of 4x = 20 to find x?",
      "options": [
        "Add 4",
        "Multiply by 4",
        "Divide by 4",
        "Subtract 20"
      ],
      "answer": 2,
      "why": "Division undoes multiplication by 4."
    },
    {
      "type": "explain",
      "id": "math-simple-equations-intro-explain",
      "skillId": "simple-equations",
      "q": "Why check in the original equation?",
      "input": [
        "type",
        "speech"
      ],
      "model": "Substitution tests whether the proposed value makes the original sides equal."
    }
  ],
  "summary": {
    "takeaways": [
      "Doing the same reversible operation to both sides preserves the solutions.",
      "3x = 15, so each ticket costs 5 shillings.",
      "Three lots of 5 plus 2 gives 17, matching the receipt."
    ],
    "formula": "Keep equality at every step."
  },
  "sandbox": null
};
