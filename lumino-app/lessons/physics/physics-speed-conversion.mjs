export default {
  "id": "physics-speed-conversion",
  "subject": "physics",
  "level": "beginner",
  "title": "Convert m/s and km/h",
  "estimatedMinutes": 8,
  "intro": {
    "hook": "A display reads 18 km/h. A second display on the same moving cart reads 5 m/s. Could both be right?",
    "tutorLine": "Build the factor from metres and seconds."
  },
  "goal": [
    "Convert m/s to km/h and back",
    "Compare speeds given in different units"
  ],
  "definitions": [
    {
      "term": "Metre",
      "meaning": "A unit of distance, written m."
    },
    {
      "term": "Kilometre",
      "meaning": "A distance of 1,000 metres, written km."
    },
    {
      "term": "Hour",
      "meaning": "60 minutes or 3,600 seconds."
    },
    {
      "term": "Conversion",
      "meaning": "Writing the same quantity in different units."
    }
  ],
  "concept": [
    {
      "title": "Follow one hour",
      "body": "At 1 m/s you go 3,600 m in an hour. That is 3.6 km, so 1 m/s equals 3.6 km/h.",
      "alt": "Imagine a metre-long tile for every second. A full hour lays 3,600 tiles, enough to make three whole kilometres and a further 600 metres.",
      "tutorLine": "Build the factor from metres and seconds.",
      "math": "5 m/s × 3.6 = 18 km/h"
    },
    {
      "title": "Reverse the change",
      "body": "To express km/h in m/s, undo the multiplication by dividing by 3.6.",
      "alt": "Picture a switch on a speed display. Flick it twice and you should see the starting number again. Multiplying then dividing by the same factor brings it back.",
      "tutorLine": "Check by converting back.",
      "math": "18 km/h ÷ 3.6 = 5 m/s"
    }
  ],
  "examples": [
    {
      "kind": "problem",
      "title": "Convert a steady 8 m/s",
      "steps": [
        "In an hour the cart covers 8 × 3,600 = 28,800 m.",
        "Divide by 1,000 to get 28.8 km.",
        "Its steady speed is 28.8 km/h."
      ],
      "tutorLine": "The cart keeps moving at the same pace."
    },
    {
      "kind": "real-world",
      "title": "Compare two display readings",
      "steps": [
        "A cyclist sees 36 km/h. A runner records 8 m/s.",
        "Convert 36 ÷ 3.6 = 10 m/s.",
        "The cyclist is faster because 10 m/s exceeds 8 m/s."
      ],
      "tutorLine": "Use one set of units for both people."
    }
  ],
  "quiz": [
    {
      "type": "mcq",
      "id": "unit-7",
      "skillId": "speed-units",
      "q": "How many seconds are in one hour?",
      "options": [
        "360",
        "1,000",
        "3,600",
        "60"
      ],
      "answer": 2,
      "why": "Multiply 60 minutes by 60 seconds per minute."
    },
    {
      "type": "mcq",
      "id": "unit-8",
      "skillId": "speed-units",
      "q": "Convert 10 m/s to km/h.",
      "options": [
        "0.36 km/h",
        "3.6 km/h",
        "100 km/h",
        "36 km/h"
      ],
      "answer": 3,
      "why": "Multiply 10 by 3.6."
    },
    {
      "type": "mcq",
      "id": "unit-9",
      "skillId": "speed-units",
      "q": "Convert 72 km/h to m/s.",
      "options": [
        "25.9 m/s",
        "20 m/s",
        "72 m/s",
        "200 m/s"
      ],
      "answer": 1,
      "why": "Divide 72 by 3.6."
    },
    {
      "type": "mcq",
      "id": "unit-10",
      "skillId": "speed-units",
      "q": "Which is faster, 36 km/h or 8 m/s?",
      "options": [
        "8 m/s",
        "They are equal",
        "36 km/h",
        "The units cannot be compared"
      ],
      "answer": 2,
      "why": "36 km/h is 10 m/s, which is faster than 8 m/s."
    },
    {
      "type": "mcq",
      "id": "unit-11",
      "skillId": "speed-units",
      "q": "A cart moves at 2 m/s. What is that in km/h?",
      "options": [
        "0.72 km/h",
        "2 km/h",
        "5.6 km/h",
        "7.2 km/h"
      ],
      "answer": 3,
      "why": "Multiply 2 by 3.6."
    },
    {
      "type": "mcq",
      "id": "unit-12",
      "skillId": "speed-units",
      "q": "What operation converts km/h to m/s?",
      "options": [
        "Multiply by 3.6",
        "Divide by 3.6",
        "Subtract 3.6",
        "Divide by 60"
      ],
      "answer": 1,
      "why": "Dividing by 3.6 reverses the conversion from m/s to km/h."
    },
    {
      "type": "explain",
      "id": "physics-speed-conversion-explain",
      "skillId": "speed-units",
      "q": "A learner changes 10 m/s to 10 km/h by replacing the label. Explain the mistake.",
      "model": "The distance and time units both change. Ten metres each second adds up to 36 kilometres in an hour, so the new number is 36.",
      "input": [
        "type",
        "speech"
      ]
    }
  ],
  "summary": {
    "takeaways": [
      "A kilometre contains 1,000 m.",
      "An hour contains 3,600 s.",
      "Convert both readings to the same unit before comparing."
    ],
    "formula": "m/s → × 3.6 → km/h; km/h → ÷ 3.6 → m/s"
  },
  "sandbox": null
};
