export const PHYSICS_STARTER = 'physics-speed-on-the-bridge';

const question = (id, q, o, a, why) => ({ id, q, o, a, why });
const lesson = (id, title, learn, ex, questions) => ({ id, title, learn, ex, questions });

function speedQuestion(id, distance, time, setting = 'A cart') {
  const speed = distance / time;
  return question(id, `${setting} travels ${distance} m in ${time} s. What is its average speed?`,
    [`${distance + time} m/s`, `${speed} m/s`, `${distance * time} m/s`], 1,
    `Divide the total distance by the total time: ${distance} ÷ ${time} = ${speed} m/s.`);
}

function distanceQuestion(id, speed, time) {
  return question(id, `A trolley holds a speed of ${speed} m/s for ${time} s. How far does it go?`,
    [`${speed * time} m`, `${time} m`, `${speed + time} m`], 0,
    `It covers ${speed} metres every second, so multiply ${speed} × ${time}.`);
}

function graphQuestion(id, start, end, duration) {
  return question(id, `A distance–time graph rises from ${start} m to ${end} m in ${duration} s. What speed does this straight segment show?`,
    [`${end} m/s`, `${end - start} m/s`, `${(end - start) / duration} m/s`], 2,
    `Use the change in distance, ${end} − ${start} = ${end - start} m, divided by ${duration} s.`);
}

function stoppingQuestion(id, first, second) {
  return question(id, `Two carts brake from the same speed. Cart A stops in ${first} m and cart B in ${second} m. Which stopped in less distance?`,
    ['Cart A', 'Cart B', 'Both stopped in the same distance'], first < second ? 0 : 1,
    `Compare the measured distances from the brake line: ${Math.min(first, second)} m is shorter than ${Math.max(first, second)} m.`);
}

export const MOTION_SKILLS = [
  {
    id: 'speed-units', title: 'What speed means',
    hints: {
      linda: 'Read the unit as distance per unit of time. For kilometres per hour, use kilometres and hours.',
      charles: 'Ask how far you go in one second or one hour if you keep that pace.',
    },
    lessons: [
      lesson('physics-speed-units', 'Read a speed and its units',
        'Speed tells you how much distance something covers per unit of time. Metres per second (m/s) and kilometres per hour (km/h) describe the same kind of quantity.',
        'At a constant 4 m/s, a cart covers 4 metres every second.', [
          question('unit-1', 'What does a speed of 3 m/s describe?', ['3 metres every second', '3 seconds every metre', '3 metres in total'], 0, 'The slash means “per”, so m/s means metres per second.'),
          question('unit-2', 'Which unit measures speed?', ['s', 'm/s', 'm'], 1, 'Speed has a distance unit divided by a time unit.'),
          question('unit-3', 'What does 60 km/h mean at a steady speed?', ['60 kilometres each minute', '60 minutes per kilometre', '60 kilometres each hour'], 2, 'Read km/h as kilometres per hour.'),
          question('unit-4', 'Two runners hold 4 m/s and 6 m/s. Who covers more ground in one second?', ['The runner at 4 m/s', 'The runner at 6 m/s', 'They cover equal distances'], 1, 'With the same time and units, 6 m is farther than 4 m.'),
          question('unit-5', 'Which measurement is a distance rather than a speed?', ['12 m', '12 m/s', '12 km/h'], 0, 'Metres measure a length. A speed also tells you the time unit.'),
          question('unit-6', 'A cart covers the same distance in each second. How is it moving?', ['Its speed is falling', 'It is stopped', 'Its speed is steady'], 2, 'Equal distances in equal times mean the speed is steady.'),
        ]),
      lesson('physics-speed-conversion', 'Convert m/s and km/h',
        'One kilometre is 1,000 metres and one hour is 3,600 seconds. Multiply a speed in m/s by 3.6 to express it in km/h. Divide by 3.6 for the reverse.',
        '5 m/s = 5 × 3.6 = 18 km/h.', [
          question('unit-7', 'How many seconds are in one hour?', ['360', '1,000', '3,600'], 2, 'Multiply 60 minutes by 60 seconds per minute.'),
          question('unit-8', 'Convert 10 m/s to km/h.', ['36 km/h', '3.6 km/h', '100 km/h'], 0, 'Multiply 10 by 3.6.'),
          question('unit-9', 'Convert 72 km/h to m/s.', ['25.9 m/s', '20 m/s', '72 m/s'], 1, 'Divide 72 by 3.6.'),
          question('unit-10', 'Which is faster, 36 km/h or 8 m/s?', ['8 m/s', 'They are equal', '36 km/h'], 2, '36 km/h is 10 m/s, which is faster than 8 m/s.'),
          question('unit-11', 'A cart moves at 2 m/s. What is that in km/h?', ['7.2 km/h', '2 km/h', '5.6 km/h'], 0, 'Multiply 2 by 3.6.'),
          question('unit-12', 'What operation converts km/h to m/s?', ['Multiply by 3.6', 'Divide by 3.6', 'Subtract 3.6'], 1, 'Dividing by 3.6 reverses the conversion from m/s to km/h.'),
        ]),
    ],
  },
  {
    id: 'average-speed', title: 'Calculating average speed',
    hints: {
      linda: 'Use all the distance and all the elapsed time. Write the distance unit over the time unit.',
      charles: 'Spread the whole trip over all its seconds, including any time spent waiting.',
    },
    lessons: [
      lesson(PHYSICS_STARTER, 'Speed on the bridge',
        'Average speed is the total distance travelled divided by the total time taken.',
        '60 m in 12 s → 60 ÷ 12 = 5 m/s.', [
          speedQuestion('bridge-1', 60, 12, 'A cart crossing a bridge'),
          question('bridge-2', 'Which formula gives average speed?', ['distance ÷ time', 'distance × time', 'time ÷ distance'], 0, 'Average speed tells you how much distance was covered per unit of time.'),
          speedQuestion('bridge-3', 24, 4, 'A runner'),
          speedQuestion('bridge-4', 27, 9, 'A cyclist'),
          question('bridge-5', 'Two carts travel 30 m. One takes 5 s and one takes 10 s. Which is faster on average?', ['The cart that takes 10 s', 'Both have the same average speed', 'The cart that takes 5 s'], 2, 'For the same distance, a shorter time gives a higher average speed.'),
          speedQuestion('bridge-6', 32, 8, 'A toy train'),
        ]),
      lesson('physics-trip-data', 'Work with journeys in parts',
        'Work out total distance and total elapsed time before calculating a trip average. If a cart is stationary for part of the trip, that time still counts.',
        '20 m in 4 s, followed by 6 s waiting → 20 ÷ (4 + 6) = 2 m/s.', [
          distanceQuestion('trip-1', 3, 8),
          question('trip-2', 'A cart travels 20 m in 4 s and waits 6 s. What is its average speed for the whole 10 s?', ['5 m/s', '2 m/s', '10 m/s'], 1, 'Use 20 m and the total time, 10 s.'),
          question('trip-3', 'A cart covers 12 m in 2 s and then 18 m in 8 s. What is its average speed?', ['6 m/s', '4.1 m/s', '3 m/s'], 2, 'Add the distances and times: 30 m ÷ 10 s.'),
          question('trip-4', 'A cyclist travels 90 m at a steady 6 m/s. How long does the journey take?', ['15 s', '540 s', '84 s'], 0, 'Divide distance by speed: 90 ÷ 6 = 15 s.'),
          distanceQuestion('trip-5', 7, 5),
          question('trip-6', 'Why should you add the journey distances and times before finding average speed?', ['Each part of the journey always lasts the same time', 'The average must account for the full journey, including stops', 'Speed is independent of time'], 1, 'A whole-trip average uses every metre and every second.'),
        ]),
    ],
  },
  {
    id: 'distance-time-graphs', title: 'Reading distance–time graphs',
    hints: {
      linda: 'Check the axes, then divide the change on the vertical axis by the change on the horizontal axis.',
      charles: 'Pick two points. How much farther did the cart go between them, and how much time passed?',
    },
    lessons: [
      lesson('physics-graph-shapes', 'Read the shape of a journey',
        'A distance–time graph shows time on the horizontal axis and total distance on the vertical axis. A straight, rising segment shows steady speed. A flat segment shows the object is stationary.',
        'A cart stops for a signal → time keeps increasing while distance stays the same.', [
          question('graph-1', 'What goes on the horizontal axis of a distance–time graph?', ['Time', 'Distance', 'Speed'], 0, 'Time runs along the horizontal axis.'),
          question('graph-2', 'What does a horizontal segment show?', ['Steady movement', 'The object is stationary', 'The object is speeding up'], 1, 'No additional distance is covered as time passes.'),
          question('graph-3', 'Two straight segments are drawn on the same axes. Which represents a higher speed?', ['The flatter segment', 'The shorter segment', 'The steeper segment'], 2, 'The steeper segment gains more distance per second.'),
          question('graph-4', 'Distance rises by 6 m every 2 s. What does the graph look like?', ['A straight rising line', 'A flat line', 'A curve that keeps steepening'], 0, 'The increase in distance per second stays constant.'),
          question('graph-5', 'Where can you read the distance travelled after 5 s?', ['At 5 m on the distance axis', 'On the distance axis at the point above 5 s', 'From how wide the graph is'], 1, 'Find 5 s on the time axis, trace to the graph and read the vertical value.'),
          question('graph-6', 'On the same axes, a line starts rising and then becomes flat. What happened?', ['The object moved and then stopped', 'The object stopped and then moved', 'The object moved faster and faster'], 0, 'The flat part means the object covered no additional distance.'),
        ]),
      lesson('physics-graph-gradient', 'Calculate speed from a graph',
        'Choose two points on the same straight segment. Subtract the starting distance and time from their ending values, then divide the change in distance by the change in time.',
        'From (2 s, 6 m) to (5 s, 18 m) → (18 − 6) ÷ (5 − 2) = 4 m/s.', [
          graphQuestion('graph-7', 8, 24, 4),
          graphQuestion('graph-8', 6, 21, 3),
          question('graph-9', 'The line is at 14 m at both 2 s and 7 s. What speed does that interval show?', ['2 m/s', '2.8 m/s', '0 m/s'], 2, 'The change in distance is zero.'),
          graphQuestion('graph-10', 10, 22, 6),
          question('graph-11', 'From 3 s to 7 s the distance rises from 9 m to 33 m. Which calculation finds speed?', ['(33 − 9) ÷ (7 − 3)', '33 ÷ 7', '7 ÷ (33 − 9)'], 0, 'Use the changes over that segment: 24 m in 4 s.'),
          graphQuestion('graph-12', 15, 39, 3),
        ]),
    ],
  },
  {
    id: 'stopping-distance', title: 'Friction and stopping distance',
    hints: {
      linda: 'Compare braking distances at the same speed where braking begins, and change only the tested variable.',
      charles: 'Give both carts the same run-up. Watch how far each rolls past the brake line.',
    },
    lessons: [
      lesson('physics-grip', 'Compare grip under braking',
        'Friction acts where the tyres meet the track. More available grip can allow a greater braking force. On the same track with the same braking speed, that can shorten how far the cart travels before it stops.',
        'Two carts reach the brake line at 4 m/s. The one with greater grip can slow down more quickly.', [
          question('brake-1', 'What does braking distance measure?', ['Distance from starting to brake until stopping', 'The whole length of the track', 'The time from brake line to stop'], 0, 'Measure from where braking begins to where the cart comes to rest.'),
          question('brake-2', 'Braking starts at the same speed. Which tyres can allow a shorter stop?', ['Tyres with less available grip', 'Tyres with more available grip', 'Tyre grip can never matter'], 1, 'Greater available grip can support a greater braking force.'),
          stoppingQuestion('brake-3', 5, 9),
          question('brake-4', 'Which speed should match before comparing two tyre setups?', ['The speed at the brake line', 'The speed after both carts stop', 'The wind speed reported yesterday'], 0, 'Braking distance depends on the speed at which braking begins.'),
          stoppingQuestion('brake-5', 11, 7),
          question('brake-6', 'Two identical carts use the same tyres. What happens if one brakes from a higher speed?', ['It always stops in a shorter distance', 'It may travel farther before it stops', 'Its braking distance must be unchanged'], 1, 'A higher initial speed can increase braking distance when other conditions match.'),
        ]),
      lesson('physics-fair-cart-test', 'Plan a fair cart test',
        'Change one thing at a time. To compare tyres, use the same cart, track and speed at the brake line, then measure each run from that line.',
        'Change the tyres → hold the approach and track constant → measure braking distance.', [
          question('brake-7', 'What should you change to test the effect of tyre type?', ['Tyres and track surface', 'Tyres only', 'Cart mass and braking speed'], 1, 'Changing one variable lets you connect the result to that change.'),
          question('brake-8', 'A tyre trial changes both the surface and the tyres. Why is the result hard to interpret?', ['Either change could affect the result', 'Braking distance cannot be measured', 'The cart has to stop outside the track'], 0, 'The test cannot tell you which of the two changes caused the difference.'),
          question('brake-9', 'A track has 6 m between the brake line and the barrier. Which result gives more room before the barrier?', ['A stop at 5 m', 'A stop at 3 m', 'They leave equal room'], 1, 'A 3 m stop leaves 3 m of space before the barrier.'),
          stoppingQuestion('brake-10', 4, 8),
          question('brake-11', 'What measurements best support a comparison of braking distance?', ['The carts’ colours and the track length', 'The day and the tyre price', 'Both braking distances and the speed at the brake line'], 2, 'Report the result and check that the starting speed matched.'),
          question('brake-12', 'One tyre stops shorter on a dry test track. What can you conclude?', ['It stopped shorter under those test conditions', 'It stops shorter on every possible surface', 'It stops shorter at any speed'], 0, 'The evidence supports the comparison under the conditions you tested.'),
        ]),
    ],
  },
];

export const MOTION_LESSONS = [
  MOTION_SKILLS[0].lessons[0],
  MOTION_SKILLS[1].lessons[0],
  MOTION_SKILLS[0].lessons[1],
  MOTION_SKILLS[1].lessons[1],
  ...MOTION_SKILLS.slice(2).flatMap(skill => skill.lessons),
];

export function motionSkillFor(lessonId) {
  return MOTION_SKILLS.find(skill => skill.lessons.some(item => item.id === lessonId));
}

function practiceQuestion(skillId, serial, index) {
  const id = `practice-${skillId}-${serial * 3 + index}`;
  const n = serial * 3 + index;
  const value = 2 + n % 17;
  const time = 3 + n % 11;
  if (skillId === 'average-speed') return speedQuestion(id, value * time, time, ['A courier bike', 'A robot', 'A train'][index]);
  if (skillId === 'distance-time-graphs') return graphQuestion(id, n + 3, n + 3 + value * time, time);
  if (skillId === 'stopping-distance') {
    const first = 2 + n % 9;
    const second = first + 1 + n % 4;
    return stoppingQuestion(id, ...(n % 2 ? [second, first] : [first, second]));
  }
  const kmh = (value * 3.6).toFixed(1);
  if (index === 0) return question(id, `A cart holds ${value} m/s. How far does it go in one second?`,
    [`${value + 1} m`, `${value} m`, `${value - 1} m`], 1, `${value} m/s means ${value} metres every second.`);
  if (index === 1) return question(id, `What is ${kmh} km/h in m/s?`,
    [`${value} m/s`, `${value + 2} m/s`, `${kmh} m/s`], 0, `Divide ${kmh} by 3.6 to get ${value} m/s.`);
  return question(id, `A machine moves at ${value} m/s. Which is the same speed in km/h?`,
    [`${value} km/h`, `${value + 3.6} km/h`, `${kmh} km/h`], 2, `Multiply ${value} by 3.6 to convert to km/h.`);
}

export function getPracticeSession(skill, serial) {
  const [starter] = skill.lessons;
  return {
    ...starter,
    id: `practice-${skill.id}`,
    title: skill.title,
    questions: Array.from({ length: 3 }, (_, index) => practiceQuestion(skill.id, serial, index)),
  };
}

export function drawDistanceGraph(canvas) {
  const ctx = canvas.getContext('2d');
  const origin = { x: 56, y: 170 };
  const x = time => origin.x + time * 42;
  const y = distance => origin.y - distance * 7;
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillStyle = '#9DB3BD';
  ctx.fillText('Distance (m)', 10, 18);
  ctx.fillText('Time (s)', 320, 206);
  ctx.strokeStyle = '#2A4152';
  ctx.beginPath();
  for (const time of [0, 2, 5, 7]) {
    ctx.fillText(String(time), x(time) - 4, origin.y + 20);
    ctx.moveTo(x(time), origin.y);
    ctx.lineTo(x(time), 35);
  }
  for (const distance of [0, 6, 12, 18]) {
    ctx.fillText(String(distance), 26, y(distance) + 5);
    ctx.moveTo(origin.x, y(distance));
    ctx.lineTo(x(7) + 10, y(distance));
  }
  ctx.stroke();
  ctx.strokeStyle = '#6AF4BF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x(0), y(0));
  ctx.lineTo(x(2), y(6));
  ctx.lineTo(x(5), y(18));
  ctx.lineTo(x(7), y(18));
  ctx.stroke();
}
