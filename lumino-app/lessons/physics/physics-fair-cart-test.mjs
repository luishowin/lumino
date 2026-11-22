export default {
  "id": "physics-fair-cart-test",
  "subject": "physics",
  "level": "beginner",
  "title": "Plan a fair cart test",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "A team changes the tyres and the track together. Their cart stops sooner. Which change deserves the credit?",
    "tutorLine": "Name what you will keep the same."
  },
  "goal": [
    "Plan a fair comparison of tyres",
    "Use measured distances to support a conclusion"
  ],
  "definitions": [
    {
      "term": "Variable",
      "meaning": "Something that can change in a test."
    },
    {
      "term": "Fair test",
      "meaning": "A comparison that changes one chosen factor and keeps other relevant conditions alike."
    },
    {
      "term": "Trial",
      "meaning": "One run of the test."
    },
    {
      "term": "Braking distance",
      "meaning": "Distance covered from starting to brake until stopping."
    }
  ],
  "concept": [
    {
      "title": "Change one factor",
      "body": "To compare tyres, change the tyre type. Keep the cart, track, speed at the brake line and braking method the same.",
      "alt": "Think of tasting two bowls of soup. If both salt and spice change, you cannot tell which caused a difference in taste. Leave just one difference in the cart test.",
      "tutorLine": "Name what you will keep the same.",
      "math": "Change: tyres. Measure: braking distance."
    },
    {
      "title": "Match claims to measurements",
      "body": "Measure each run from the same brake line. Repeat trials to see whether the pattern holds. Describe the conditions when reporting your result.",
      "alt": "Imagine writing the test conditions on the label of each result. Keeping that label attached helps you avoid making a claim about a different surface.",
      "tutorLine": "Keep the conditions beside the numbers.",
      "math": "At the same speed on this track: A stopped in 4 m; B in 6 m."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Leave space before a barrier",
      "steps": [
        "Place the barrier 8 m beyond the brake line.",
        "Tyre A stops in 5 m; tyre B stops in 3 m.",
        "Their remaining spaces are 3 m and 5 m. Tyre B leaves more room in these trials."
      ],
      "tutorLine": "Compare the space left after each stop."
    },
    {
      "kind": "real-world",
      "title": "Check a new wheel set",
      "steps": [
        "A workshop compares two tyre types on the same cart.",
        "The team keeps the track and braking speed fixed and repeats each run.",
        "They report the distances for each tyre under those conditions."
      ],
      "tutorLine": "Record each result, even an unexpected one."
    },
    {
      "kind": "activity",
      "title": "Try the Cart Workshop",
      "body": "Choose tyres, predict where the cart will stop and compare two runs.",
      "activityId": "cart-workshop",
      "tutorLine": "Measure from the brake line each time."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "brake-7",
      "skillId": "stopping-distance",
      "q": "What should you change to test the effect of tyre type?",
      "options": [
        "Tyres and track surface",
        "Tyres only",
        "Cart mass and braking speed",
        "Track surface only"
      ],
      "answer": 1,
      "why": "Changing one variable lets you connect the result to that change."
    },
    {
      "type": "mcq",
      "id": "brake-8",
      "skillId": "stopping-distance",
      "q": "A tyre trial changes both the surface and the tyres. Why is the result hard to interpret?",
      "options": [
        "The result must always be identical",
        "Braking distance cannot be measured",
        "The cart has to stop outside the track",
        "Either change could affect the result"
      ],
      "answer": 3,
      "why": "The test cannot tell you which of the two changes caused the difference."
    },
    {
      "type": "mcq",
      "id": "brake-9",
      "skillId": "stopping-distance",
      "q": "A track has 6 m between the brake line and the barrier. Which result gives more room before the barrier?",
      "options": [
        "A stop at 5 m",
        "A stop at 3 m",
        "They leave equal room",
        "Both runs hit the barrier"
      ],
      "answer": 1,
      "why": "A 3 m stop leaves 3 m of space before the barrier."
    },
    {
      "type": "mcq",
      "id": "brake-10",
      "skillId": "stopping-distance",
      "q": "Two carts brake from the same speed. Cart A stops in 4 m and cart B in 8 m. Which stopped in less distance?",
      "options": [
        "Cart A",
        "Cart B",
        "Both stopped in the same distance",
        "The cart that started first"
      ],
      "answer": 0,
      "why": "Compare the measured distances from the brake line: 4 m is shorter than 8 m."
    },
    {
      "type": "mcq",
      "id": "brake-11",
      "skillId": "stopping-distance",
      "q": "What measurements best support a comparison of braking distance?",
      "options": [
        "The carts’ colours and the track length",
        "The day and the tyre price",
        "Only the total track length",
        "Both braking distances and the speed at the brake line"
      ],
      "answer": 3,
      "why": "Report the result and check that the starting speed matched."
    },
    {
      "type": "mcq",
      "id": "brake-12",
      "skillId": "stopping-distance",
      "q": "One tyre stops shorter on a dry test track. What can you conclude?",
      "options": [
        "It stopped shorter under those test conditions",
        "It stops shorter on every possible surface",
        "It stops shorter at any speed",
        "It always takes less time to stop"
      ],
      "answer": 0,
      "why": "The evidence supports the comparison under the conditions you tested."
    },
    {
      "type": "explain",
      "id": "physics-fair-cart-test-explain",
      "skillId": "stopping-distance",
      "q": "A team reports “these tyres are best everywhere” after trials on one dry track. Write a claim their evidence can support.",
      "model": "These tyres gave the shorter measured braking distance on this dry track at the tested speed. More tests would be needed for other surfaces or speeds.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "Change only tyre type for a tyre comparison.",
      "Measure all stops from the same brake line.",
      "Limit the conclusion to the conditions tested."
    ],
    "formula": "Fair comparison: change one factor, hold other conditions steady, measure the same outcome."
  },
  "sandbox": null
};
