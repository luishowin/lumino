export default {
  "id": "physics-trip-data",
  "subject": "physics",
  "level": "beginner",
  "title": "Work with journeys in parts",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "A delivery cart rolls, waits at a gate, then rolls again. Should the wait appear in its journey time?",
    "tutorLine": "Work through one part at a time."
  },
  "goal": [
    "Calculate distance for a steady part of a journey",
    "Find average speed across moving and waiting times"
  ],
  "definitions": [
    {
      "term": "Journey part",
      "meaning": "One interval of the trip."
    },
    {
      "term": "Steady speed",
      "meaning": "The same distance covered in each equal time interval."
    },
    {
      "term": "Elapsed time",
      "meaning": "All the time between departure and arrival."
    },
    {
      "term": "Stationary",
      "meaning": "Staying in the same place."
    }
  ],
  "concept": [
    {
      "title": "Find the missing distance",
      "body": "At steady speed, multiply the speed by the duration of the part.",
      "alt": "Lay four strips of paper in a row. Each three-metre strip represents one second of travel. Their combined length represents the distance.",
      "tutorLine": "Work through one part at a time.",
      "math": "3 m/s × 4 s = 12 m"
    },
    {
      "title": "Keep the clock running",
      "body": "Add all distances and all times separately. A wait adds time and zero distance.",
      "alt": "Imagine watching a delivery from your window. The package still takes ten seconds to arrive even if the wheels turn for only four of them.",
      "tutorLine": "Start and finish with the same clock.",
      "math": "20 m ÷ (4 s + 6 s) = 2 m/s"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Combine two parts",
      "steps": [
        "The cart goes 12 m in 2 s and 18 m in 8 s.",
        "Total distance is 30 m. Total time is 10 s.",
        "Average speed is 30 ÷ 10 = 3 m/s."
      ],
      "tutorLine": "Add the distances before dividing."
    },
    {
      "kind": "real-world",
      "title": "Find a delivery time",
      "steps": [
        "A carrier moves 60 m at a steady 5 m/s.",
        "Travel takes 60 ÷ 5 = 12 s.",
        "A 3 s wait makes the full delivery take 15 s."
      ],
      "tutorLine": "Distinguish moving time from delivery time."
    },
    {
      "kind": "activity",
      "title": "Try the canyon relay",
      "body": "Explore the Desert trail. Think about how moving and waiting each contribute to the time for a whole journey.",
      "activityId": "desert",
      "tutorLine": "Keep the whole journey in view."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "trip-1",
      "skillId": "average-speed",
      "q": "A trolley holds a speed of 3 m/s for 8 s. How far does it go?",
      "options": [
        "24 m",
        "8 m",
        "11 m",
        "2.7 m"
      ],
      "answer": 0,
      "why": "It covers 3 metres every second, so multiply 3 × 8."
    },
    {
      "type": "mcq",
      "id": "trip-2",
      "skillId": "average-speed",
      "q": "A cart travels 20 m in 4 s and waits 6 s. What is its average speed for the whole 10 s?",
      "options": [
        "5 m/s",
        "4 m/s",
        "10 m/s",
        "2 m/s"
      ],
      "answer": 3,
      "why": "Use 20 m and the total time, 10 s."
    },
    {
      "type": "mcq",
      "id": "trip-3",
      "skillId": "average-speed",
      "q": "A cart covers 12 m in 2 s and then 18 m in 8 s. What is its average speed?",
      "options": [
        "6 m/s",
        "4.1 m/s",
        "3 m/s",
        "7.5 m/s"
      ],
      "answer": 2,
      "why": "Add the distances and times: 30 m ÷ 10 s."
    },
    {
      "type": "mcq",
      "id": "trip-4",
      "skillId": "average-speed",
      "q": "A cyclist travels 90 m at a steady 6 m/s. How long does the journey take?",
      "options": [
        "15 s",
        "540 s",
        "84 s",
        "96 s"
      ],
      "answer": 0,
      "why": "Divide distance by speed: 90 ÷ 6 = 15 s."
    },
    {
      "type": "mcq",
      "id": "trip-5",
      "skillId": "average-speed",
      "q": "A trolley holds a speed of 7 m/s for 5 s. How far does it go?",
      "options": [
        "12.5 m",
        "5 m",
        "12 m",
        "35 m"
      ],
      "answer": 3,
      "why": "It covers 7 metres every second, so multiply 7 × 5."
    },
    {
      "type": "mcq",
      "id": "trip-6",
      "skillId": "average-speed",
      "q": "Why should you add the journey distances and times before finding average speed?",
      "options": [
        "Each part of the journey always lasts the same time",
        "The average must account for the full journey, including stops",
        "Speed is independent of time",
        "The longest part always determines the average"
      ],
      "answer": 1,
      "why": "A whole-trip average uses every metre and every second."
    },
    {
      "type": "explain",
      "id": "physics-trip-data-explain",
      "skillId": "average-speed",
      "q": "Someone averages the speeds of two parts that lasted very different times. What would you calculate instead?",
      "model": "I would add the two distances and divide by the total time. The longer part accounts for more of the journey time.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "At steady speed, multiply speed by time for distance.",
      "Add the time spent waiting.",
      "Use totals to find a whole-trip average."
    ],
    "formula": "Trip average = sum of distances ÷ sum of times"
  },
  "sandbox": null
};
