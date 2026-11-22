export default {
  "id": "physics-speed-and-velocity-intro",
  "subject": "physics",
  "topicId": "speed-and-velocity",
  "kind": "introduction",
  "level": "beginner",
  "title": "Introduction to Motion",
  "estimatedMinutes": 4,
  "intro": {
    "hook": "A walker and a cyclist reach the bridge together. What would you measure to tell who travelled faster?",
    "tutorLine": "Read the result as metres per second."
  },
  "goal": [
    "Describe motion with distance, time and speed",
    "Read a journey graph and compare braking tests"
  ],
  "definitions": [
    {
      "term": "Distance",
      "meaning": "The length of the path travelled."
    },
    {
      "term": "Speed",
      "meaning": "Distance travelled per unit of time."
    },
    {
      "term": "Braking distance",
      "meaning": "Distance travelled between applying the brakes and stopping."
    }
  ],
  "concept": [
    {
      "title": "Measure a journey",
      "body": "Average speed spreads the whole distance over the whole journey time, including stops.",
      "alt": "Imagine travelling at one steady speed and arriving at the same time.",
      "tutorLine": "What would the graph show at a traffic light?"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Cross the bridge",
      "steps": [
        "A walker covers 12 m in 6 s.",
        "12 ÷ 6 gives an average speed of 2 m/s."
      ],
      "tutorLine": "Read the result as metres per second."
    },
    {
      "kind": "real-world",
      "title": "Watch a delivery rider",
      "steps": [
        "A tracker records total distance every minute.",
        "A flat section on its distance–time graph means the total has stopped growing."
      ],
      "tutorLine": "What would the graph show at a traffic light?"
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "physics-speed-and-velocity-intro-term",
      "skillId": "speed-and-velocity",
      "q": "Which term fits this description? Distance travelled per unit of time.",
      "options": [
        "Acceleration",
        "Distance",
        "Braking distance",
        "Speed"
      ],
      "answer": 3,
      "why": "Speed — Distance travelled per unit of time."
    },
    {
      "type": "mcq",
      "id": "physics-speed-and-velocity-intro-apply",
      "skillId": "speed-and-velocity",
      "q": "A cart covers 15 m in 5 s. Its average speed is…",
      "options": [
        "75 m/s",
        "10 m/s",
        "20 m/s",
        "3 m/s"
      ],
      "answer": 3,
      "why": "Divide 15 metres by 5 seconds."
    },
    {
      "type": "mcq",
      "id": "physics-speed-and-velocity-intro-check",
      "skillId": "speed-and-velocity",
      "q": "Which comparison best isolates the effect of tyres on braking distance?",
      "options": [
        "Same cart, track and braking speed",
        "Same time, different slopes",
        "Different carts and speeds",
        "Different tracks and tyres"
      ],
      "answer": 0,
      "why": "Hold the other conditions steady and change the tyres."
    },
    {
      "type": "explain",
      "id": "physics-speed-and-velocity-intro-explain",
      "skillId": "speed-and-velocity",
      "q": "Why time a stop during a journey?",
      "input": [
        "type",
        "speech"
      ],
      "model": "A stop adds to total elapsed time even though the distance stays the same."
    }
  ],
  "summary": {
    "takeaways": [
      "Average speed spreads the whole distance over the whole journey time, including stops.",
      "12 ÷ 6 gives an average speed of 2 m/s.",
      "A flat section on its distance–time graph means the total has stopped growing."
    ],
    "formula": "Average speed = total distance ÷ total time"
  },
  "sandbox": null
};
