import biologyStarter from './biology/biology-starter.mjs';
import chemistryStarter from './chemistry/chemistry-starter.mjs';
import englishStarter from './english/english-starter.mjs';
import mathStarter from './math/math-starter.mjs';
import physicsFairCartTest from './physics/physics-fair-cart-test.mjs';
import physicsGraphGradient from './physics/physics-graph-gradient.mjs';
import physicsGraphShapes from './physics/physics-graph-shapes.mjs';
import physicsGrip from './physics/physics-grip.mjs';
import physicsSpeedConversion from './physics/physics-speed-conversion.mjs';
import physicsSpeedOnTheBridge from './physics/physics-speed-on-the-bridge.mjs';
import physicsSpeedUnits from './physics/physics-speed-units.mjs';
import physicsTripData from './physics/physics-trip-data.mjs';

export const stories = [
  biologyStarter,
  chemistryStarter,
  englishStarter,
  mathStarter,
  physicsFairCartTest,
  physicsGraphGradient,
  physicsGraphShapes,
  physicsGrip,
  physicsSpeedConversion,
  physicsSpeedOnTheBridge,
  physicsSpeedUnits,
  physicsTripData,
];

export const byId = new Map(stories.map(story => [story.id, story]));
export const starters = {
  math: mathStarter, physics: physicsSpeedOnTheBridge, chemistry: chemistryStarter,
  biology: biologyStarter, english: englishStarter,
};
