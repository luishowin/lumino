export default {
  "id": "physics-graph-shapes",
  "subject": "physics",
  "level": "beginner",
  "title": "Read the shape of a journey",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "A journey leaves a line on a screen. Can you find the moment the cart waited without seeing it move?",
    "tutorLine": "Read the labels before following the line."
  },
  "goal": [
    "Read time and total distance from a graph",
    "Identify steady movement and stops"
  ],
  "definitions": [
    {
      "term": "Axis",
      "meaning": "A numbered line used to read a graph."
    },
    {
      "term": "Point",
      "meaning": "A position on a graph giving a pair of values."
    },
    {
      "term": "Segment",
      "meaning": "One part of the plotted line."
    },
    {
      "term": "Stationary",
      "meaning": "Covering no distance as time passes."
    }
  ],
  "concept": [
    {
      "title": "Read across, then up",
      "body": "Find the time along the horizontal axis. Go up to the line, then across to the distance axis to read the total distance.",
      "alt": "Imagine a finger tracking a timer along the bottom. A second finger marks the running distance total directly above it.",
      "tutorLine": "Read the labels before following the line.",
      "math": "At 2 s the cart has travelled 6 m."
    },
    {
      "title": "Look for changes",
      "body": "A straight rising segment adds equal distances in equal times. A flat segment adds no distance. On the same axes a steeper rise means faster motion.",
      "alt": "Think of a distance counter on a wheel. When the wheel rests, the counter freezes while the clock keeps ticking. That makes a flat stretch on the graph.",
      "tutorLine": "Look for the moment the distance stops growing.",
      "math": "From 5 s to 7 s: 18 m → 18 m",
      "visual": "distance-graph"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Find the pause",
      "steps": [
        "At 5 s the line reaches 18 m.",
        "At 7 s the distance is still 18 m.",
        "The cart was stationary along that flat stretch for 2 s."
      ],
      "tutorLine": "Use both ends of the flat stretch."
    },
    {
      "kind": "real-world",
      "title": "A parcel moves along a belt",
      "steps": [
        "A parcel covers 2 m in each second.",
        "Its total distance marks are 0, 2, 4 and 6 m.",
        "Plot these at equal time intervals and join them to show steady movement."
      ],
      "tutorLine": "Equal gains make a straight rise."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "graph-1",
      "skillId": "distance-time-graphs",
      "q": "What goes on the horizontal axis of a distance–time graph?",
      "options": [
        "Time",
        "Distance",
        "Speed",
        "Braking force"
      ],
      "answer": 0,
      "why": "Time runs along the horizontal axis."
    },
    {
      "type": "mcq",
      "id": "graph-2",
      "skillId": "distance-time-graphs",
      "q": "What does a horizontal segment show?",
      "options": [
        "Steady movement",
        "The object is moving backwards",
        "The object is speeding up",
        "The object is stationary"
      ],
      "answer": 3,
      "why": "No additional distance is covered as time passes."
    },
    {
      "type": "mcq",
      "id": "graph-3",
      "skillId": "distance-time-graphs",
      "q": "Two straight segments are drawn on the same axes. Which represents a higher speed?",
      "options": [
        "The flatter segment",
        "The shorter segment",
        "The steeper segment",
        "The segment starting highest"
      ],
      "answer": 2,
      "why": "The steeper segment gains more distance per second."
    },
    {
      "type": "mcq",
      "id": "graph-4",
      "skillId": "distance-time-graphs",
      "q": "Distance rises by 6 m every 2 s. What does the graph look like?",
      "options": [
        "A straight rising line",
        "A flat line",
        "A curve that keeps steepening",
        "A vertical line"
      ],
      "answer": 0,
      "why": "The increase in distance per second stays constant."
    },
    {
      "type": "mcq",
      "id": "graph-5",
      "skillId": "distance-time-graphs",
      "q": "Where can you read the distance travelled after 5 s?",
      "options": [
        "At 5 m on the distance axis",
        "From the angle alone",
        "From how wide the graph is",
        "On the distance axis at the point above 5 s"
      ],
      "answer": 3,
      "why": "Find 5 s on the time axis, trace to the graph and read the vertical value."
    },
    {
      "type": "mcq",
      "id": "graph-6",
      "skillId": "distance-time-graphs",
      "q": "On the same axes, a line starts rising and then becomes flat. What happened?",
      "options": [
        "The object moved and then stopped",
        "The object stopped and then moved",
        "The object moved faster and faster",
        "The object returned to its start"
      ],
      "answer": 0,
      "why": "The flat part means the object covered no additional distance."
    },
    {
      "type": "explain",
      "id": "physics-graph-shapes-explain",
      "skillId": "distance-time-graphs",
      "q": "A learner calls a flat distance–time line a level road. What does the flat part actually tell you?",
      "model": "The graph shows total distance against time. The distance stays unchanged while time passes, so the object is stationary. The graph does not show the road’s shape.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "Time runs horizontally.",
      "Total distance runs vertically.",
      "A rising straight segment shows steady motion; a flat segment shows a stop."
    ],
    "formula": "On the same axes, steeper rise → more distance per second"
  },
  "sandbox": null
};
