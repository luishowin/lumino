export default {
  "id": "physics-speed-on-the-bridge",
  "subject": "physics",
  "level": "beginner",
  "title": "Speed on the bridge",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "A cart crosses a bridge, slowing near the middle. Can one number describe its pace for the whole crossing?",
    "tutorLine": "Count the whole crossing."
  },
  "goal": [
    "Calculate average speed from distance and time",
    "Compare journeys over the same distance"
  ],
  "definitions": [
    {
      "term": "Total distance",
      "meaning": "The full length of the route travelled."
    },
    {
      "term": "Elapsed time",
      "meaning": "All the time from start to finish."
    },
    {
      "term": "Average speed",
      "meaning": "Total distance divided by elapsed time."
    }
  ],
  "concept": [
    {
      "title": "Share out the distance",
      "body": "Average speed gives the steady pace that would cover the same distance in the same time.",
      "alt": "Imagine twelve one-second boxes. Divide sixty metre markers equally among them. Each box gets five.",
      "tutorLine": "Count the whole crossing.",
      "math": "60 m ÷ 12 s = 5 m/s"
    },
    {
      "title": "Compare two crossings",
      "body": "For the same bridge, the crossing that takes less time has a greater average speed.",
      "alt": "Picture two timers at the finish line. Whoever completes the same course while fewer ticks pass has covered more ground per tick.",
      "tutorLine": "Check that the bridge lengths match.",
      "math": "30 m ÷ 5 s = 6 m/s"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Time a bridge crossing",
      "steps": [
        "Mark the two ends, 60 m apart.",
        "Time the cart from end to end: 12 s.",
        "Divide 60 by 12 to get 5 m/s."
      ],
      "tutorLine": "Keep the units with the numbers."
    },
    {
      "kind": "real-world",
      "title": "A runner slows near the gate",
      "steps": [
        "A runner covers 80 m in 20 s.",
        "The average is 80 ÷ 20 = 4 m/s.",
        "The runner could have been faster early and slower near the gate."
      ],
      "tutorLine": "An average describes the full route."
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
      "id": "bridge-1",
      "skillId": "average-speed",
      "q": "A cart crossing a bridge travels 60 m in 12 s. What is its average speed?",
      "options": [
        "72 m/s",
        "5 m/s",
        "720 m/s",
        "0.2 m/s"
      ],
      "answer": 1,
      "why": "Divide the total distance by the total time: 60 ÷ 12 = 5 m/s."
    },
    {
      "type": "mcq",
      "id": "bridge-2",
      "skillId": "average-speed",
      "q": "Which formula gives average speed?",
      "options": [
        "distance + time",
        "distance × time",
        "time ÷ distance",
        "distance ÷ time"
      ],
      "answer": 3,
      "why": "Average speed tells you how much distance was covered per unit of time."
    },
    {
      "type": "mcq",
      "id": "bridge-3",
      "skillId": "average-speed",
      "q": "A runner travels 24 m in 4 s. What is its average speed?",
      "options": [
        "28 m/s",
        "6 m/s",
        "96 m/s",
        "20 m/s"
      ],
      "answer": 1,
      "why": "Divide the total distance by the total time: 24 ÷ 4 = 6 m/s."
    },
    {
      "type": "mcq",
      "id": "bridge-4",
      "skillId": "average-speed",
      "q": "A cyclist travels 27 m in 9 s. What is its average speed?",
      "options": [
        "36 m/s",
        "3 m/s",
        "243 m/s",
        "18 m/s"
      ],
      "answer": 1,
      "why": "Divide the total distance by the total time: 27 ÷ 9 = 3 m/s."
    },
    {
      "type": "mcq",
      "id": "bridge-5",
      "skillId": "average-speed",
      "q": "Two carts travel 30 m. One takes 5 s and one takes 10 s. Which is faster on average?",
      "options": [
        "The cart that takes 10 s",
        "Both have the same average speed",
        "They must both travel at 30 m/s",
        "The cart that takes 5 s"
      ],
      "answer": 3,
      "why": "For the same distance, a shorter time gives a higher average speed."
    },
    {
      "type": "mcq",
      "id": "bridge-6",
      "skillId": "average-speed",
      "q": "A toy train travels 32 m in 8 s. What is its average speed?",
      "options": [
        "40 m/s",
        "4 m/s",
        "256 m/s",
        "24 m/s"
      ],
      "answer": 1,
      "why": "Divide the total distance by the total time: 32 ÷ 8 = 4 m/s."
    },
    {
      "type": "explain",
      "id": "physics-speed-on-the-bridge-explain",
      "skillId": "average-speed",
      "q": "A timer shows 12 s for 60 m. Someone says the cart did exactly 5 m every second. Does the timer prove that?",
      "model": "The average was 5 m/s. The cart could have travelled different distances in individual seconds and still covered 60 m in 12 s.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "Measure the full distance.",
      "Use the entire crossing time.",
      "An average can hide changes in speed."
    ],
    "formula": "Average speed = total distance ÷ elapsed time"
  },
  "sandbox": null
};
