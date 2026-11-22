import { byId } from './lessons/index.mjs';

export const PHYSICS_STARTER = 'physics-speed-on-the-bridge';

const question = (id, q, o, a, why) => ({ id, q, o, a, why });
function speedQuestion(id, distance, time, setting = 'A cart') {
  const speed = distance / time;
  return question(id, `${setting} travels ${distance} m in ${time} s. What is its average speed?`,
    [`${distance + time} m/s`, `${speed} m/s`, `${distance * time} m/s`], 1,
    `Divide the total distance by the total time: ${distance} ÷ ${time} = ${speed} m/s.`);
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
    lessons: [byId.get('physics-speed-units'), byId.get('physics-speed-conversion')],
  },
  {
    id: 'average-speed', title: 'Calculating average speed',
    hints: {
      linda: 'Use all the distance and all the elapsed time. Write the distance unit over the time unit.',
      charles: 'Spread the whole trip over all its seconds, including any time spent waiting.',
    },
    lessons: [byId.get('physics-speed-on-the-bridge'), byId.get('physics-trip-data')],
  },
  {
    id: 'distance-time-graphs', title: 'Reading distance–time graphs',
    hints: {
      linda: 'Check the axes, then divide the change on the vertical axis by the change on the horizontal axis.',
      charles: 'Pick two points. How much farther did the cart go between them, and how much time passed?',
    },
    lessons: [byId.get('physics-graph-shapes'), byId.get('physics-graph-gradient')],
  },
  {
    id: 'stopping-distance', title: 'Friction and stopping distance',
    hints: {
      linda: 'Compare braking distances at the same speed where braking begins, and change only the tested variable.',
      charles: 'Give both carts the same run-up. Watch how far each rolls past the brake line.',
    },
    lessons: [byId.get('physics-grip'), byId.get('physics-fair-cart-test')],
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
