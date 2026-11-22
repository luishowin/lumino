export default {
  "id": "physics-grip",
  "subject": "physics",
  "level": "beginner",
  "title": "Compare grip under braking",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "Two carts begin braking side by side. One rolls past the other before stopping. What could the tyres have changed?",
    "tutorLine": "Start the ruler where braking starts."
  },
  "goal": [
    "Measure braking distance from the brake line",
    "Compare tyre results at the same starting speed"
  ],
  "definitions": [
    {
      "term": "Friction",
      "meaning": "A force that resists surfaces slipping past one another."
    },
    {
      "term": "Grip",
      "meaning": "How well the tyre and track can resist slipping."
    },
    {
      "term": "Braking distance",
      "meaning": "Distance travelled from the start of braking to a stop."
    },
    {
      "term": "Braking force",
      "meaning": "The force used to slow the cart."
    }
  ],
  "concept": [
    {
      "title": "Mark the right interval",
      "body": "Measure from the point where braking starts to the stopped cart. The run-up belongs outside this measurement.",
      "alt": "Place a ribbon on the track only while the brakes are on. Its length marks the braking distance.",
      "tutorLine": "Start the ruler where braking starts.",
      "math": "Stop at 9 m − brake at 4 m = 5 m"
    },
    {
      "title": "Compare grip",
      "body": "With the same cart, surface and braking speed, greater available grip can support more braking force and a shorter stop.",
      "alt": "Imagine pressing a shoe against the ground on a scooter. A slippery contact can slide even as you press down. A grippier contact can exert a larger slowing force.",
      "tutorLine": "Match the starting speed first.",
      "math": "At 4 m/s: compare both distances from one brake line."
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Compare two stops",
      "steps": [
        "Both carts begin braking at 4 m/s.",
        "One stops 5 m beyond the brake line; the other stops 8 m beyond it.",
        "The first braking distance is 3 m shorter."
      ],
      "tutorLine": "Subtract the shorter distance from the longer one."
    },
    {
      "kind": "real-world",
      "title": "A cart approaches a loading bay",
      "steps": [
        "There are 7 m from the brake line to a barrier.",
        "A test at the chosen speed gives a 5 m braking distance.",
        "The cart stops with 2 m left in that test."
      ],
      "tutorLine": "Use the measurement from that run."
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
      "id": "brake-1",
      "skillId": "stopping-distance",
      "q": "What does braking distance measure?",
      "options": [
        "Distance from starting to brake until stopping",
        "The whole length of the track",
        "The time from brake line to stop",
        "Distance from launch until braking"
      ],
      "answer": 0,
      "why": "Measure from where braking begins to where the cart comes to rest."
    },
    {
      "type": "mcq",
      "id": "brake-2",
      "skillId": "stopping-distance",
      "q": "Braking starts at the same speed. Which tyres can allow a shorter stop?",
      "options": [
        "Tyres with less available grip",
        "Tyres on a cart moving faster at the brake line",
        "Tyre grip can never matter",
        "Tyres with more available grip"
      ],
      "answer": 3,
      "why": "Greater available grip can support a greater braking force."
    },
    {
      "type": "mcq",
      "id": "brake-3",
      "skillId": "stopping-distance",
      "q": "Two carts brake from the same speed. Cart A stops in 5 m and cart B in 9 m. Which stopped in less distance?",
      "options": [
        "Cart A",
        "Cart B",
        "Both stopped in the same distance",
        "The distances alone cannot be compared"
      ],
      "answer": 0,
      "why": "Compare the measured distances from the brake line: 5 m is shorter than 9 m."
    },
    {
      "type": "mcq",
      "id": "brake-4",
      "skillId": "stopping-distance",
      "q": "Which speed should match before comparing two tyre setups?",
      "options": [
        "The speed at the brake line",
        "The speed after both carts stop",
        "The wind speed reported yesterday",
        "Average speed after stopping"
      ],
      "answer": 0,
      "why": "Braking distance depends on the speed at which braking begins."
    },
    {
      "type": "mcq",
      "id": "brake-5",
      "skillId": "stopping-distance",
      "q": "Two carts brake from the same speed. Cart A stops in 11 m and cart B in 7 m. Which stopped in less distance?",
      "options": [
        "Cart A",
        "The run with the longer approach",
        "Both stopped in the same distance",
        "Cart B"
      ],
      "answer": 3,
      "why": "Compare the measured distances from the brake line: 7 m is shorter than 11 m."
    },
    {
      "type": "mcq",
      "id": "brake-6",
      "skillId": "stopping-distance",
      "q": "Two identical carts use the same tyres. What happens if one brakes from a higher speed?",
      "options": [
        "It always stops in a shorter distance",
        "It may travel farther before it stops",
        "Its braking distance must be unchanged",
        "It must stop at the same mark"
      ],
      "answer": 1,
      "why": "A higher initial speed can increase braking distance when other conditions match."
    },
    {
      "type": "explain",
      "id": "physics-grip-explain",
      "skillId": "stopping-distance",
      "q": "Two carts use different tyres and enter the brake line at different speeds. Why is it hard to explain their different stops?",
      "model": "Both grip and starting speed can affect braking distance. I would match the speed and change only the tyres.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "Measure from brake application to rest.",
      "Match the speed at the brake line.",
      "Greater grip can allow stronger braking."
    ],
    "formula": "Braking distance = stop position − brake position on a straight forward run"
  },
  "sandbox": null
};
