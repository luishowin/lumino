export default {
  "id": "physics-graph-gradient",
  "subject": "physics",
  "level": "beginner",
  "title": "Calculate speed from a graph",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "You join a cart journey after it starts. Can you find its speed from just two points on one straight part of its graph?",
    "tutorLine": "Use the readings from your own interval."
  },
  "goal": [
    "Calculate changes in distance and time",
    "Use the gradient of a straight segment to find speed"
  ],
  "definitions": [
    {
      "term": "Coordinate pair",
      "meaning": "Two values locating a point, here time and distance."
    },
    {
      "term": "Interval",
      "meaning": "The stretch between two times."
    },
    {
      "term": "Gradient",
      "meaning": "Vertical change divided by horizontal change."
    },
    {
      "term": "Segment",
      "meaning": "One stretch of the graph line."
    }
  ],
  "concept": [
    {
      "title": "Subtract the starting readings",
      "body": "Read both endpoints on one straight segment. Subtract the earlier distance from the later one. Do the same for time.",
      "alt": "Picture a fare counter already showing 6 when you board. Only the extra amount belongs to your ride. A running distance counter works the same way.",
      "tutorLine": "Use the readings from your own interval.",
      "math": "18 m − 6 m = 12 m; 5 s − 2 s = 3 s"
    },
    {
      "title": "Divide rise by run",
      "body": "On a distance–time graph the gradient gives speed. A flat part has zero rise, so its speed is zero.",
      "alt": "Draw a step beneath the sloping segment. Its horizontal edge is the time spent. Its vertical edge is the distance gained in that time.",
      "tutorLine": "Read the two edges of the step.",
      "math": "12 m ÷ 3 s = 4 m/s",
      "visual": "distance-graph"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Measure the middle segment",
      "steps": [
        "Choose (2 s, 6 m) and (5 s, 18 m).",
        "Distance rises by 12 m in 3 s.",
        "The cart travels at 4 m/s along this straight segment."
      ],
      "tutorLine": "Write the units before dividing."
    },
    {
      "kind": "real-world",
      "title": "A runner passes two markers",
      "steps": [
        "The distance graph reads 20 m at 4 s and 32 m at 7 s.",
        "During that interval the runner covers 12 m.",
        "The average for those 3 s is 4 m/s."
      ],
      "tutorLine": "The earlier metres belong to an earlier interval."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "graph-7",
      "skillId": "distance-time-graphs",
      "q": "A distance–time graph rises from 8 m to 24 m in 4 s. What speed does this straight segment show?",
      "options": [
        "24 m/s",
        "16 m/s",
        "4 m/s",
        "8 m/s"
      ],
      "answer": 2,
      "why": "Use the change in distance, 24 − 8 = 16 m, divided by 4 s."
    },
    {
      "type": "mcq",
      "id": "graph-8",
      "skillId": "distance-time-graphs",
      "q": "A distance–time graph rises from 6 m to 21 m in 3 s. What speed does this straight segment show?",
      "options": [
        "21 m/s",
        "15 m/s",
        "7 m/s",
        "5 m/s"
      ],
      "answer": 3,
      "why": "Use the change in distance, 21 − 6 = 15 m, divided by 3 s."
    },
    {
      "type": "mcq",
      "id": "graph-9",
      "skillId": "distance-time-graphs",
      "q": "The line is at 14 m at both 2 s and 7 s. What speed does that interval show?",
      "options": [
        "2 m/s",
        "2.8 m/s",
        "0 m/s",
        "7 m/s"
      ],
      "answer": 2,
      "why": "The change in distance is zero."
    },
    {
      "type": "mcq",
      "id": "graph-10",
      "skillId": "distance-time-graphs",
      "q": "A distance–time graph rises from 10 m to 22 m in 6 s. What speed does this straight segment show?",
      "options": [
        "22 m/s",
        "12 m/s",
        "2 m/s",
        "6 m/s"
      ],
      "answer": 2,
      "why": "Use the change in distance, 22 − 10 = 12 m, divided by 6 s."
    },
    {
      "type": "mcq",
      "id": "graph-11",
      "skillId": "distance-time-graphs",
      "q": "From 3 s to 7 s the distance rises from 9 m to 33 m. Which calculation finds speed?",
      "options": [
        "33 ÷ (7 − 3)",
        "33 ÷ 7",
        "7 ÷ (33 − 9)",
        "(33 − 9) ÷ (7 − 3)"
      ],
      "answer": 3,
      "why": "Use the changes over that segment: 24 m in 4 s."
    },
    {
      "type": "mcq",
      "id": "graph-12",
      "skillId": "distance-time-graphs",
      "q": "A distance–time graph rises from 15 m to 39 m in 3 s. What speed does this straight segment show?",
      "options": [
        "39 m/s",
        "24 m/s",
        "8 m/s",
        "13 m/s"
      ],
      "answer": 2,
      "why": "Use the change in distance, 39 − 15 = 24 m, divided by 3 s."
    },
    {
      "type": "explain",
      "id": "physics-graph-gradient-explain",
      "skillId": "distance-time-graphs",
      "q": "A learner divides the final distance by the final time for every segment. When can that give the wrong result?",
      "model": "If the segment starts after the journey has begun, the final readings include earlier movement. Subtract both starting readings before dividing.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "Choose two points on the same segment.",
      "Calculate both changes.",
      "Distance change divided by time change gives the segment’s average speed."
    ],
    "formula": "Speed = (end distance − start distance) ÷ (end time − start time)"
  },
  "sandbox": null
};
