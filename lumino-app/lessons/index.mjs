import physicsSpeedAndVelocityIntro from './physics/physics-speed-and-velocity-intro.mjs';
import physicsSimpleCircuitsIntro from './physics/physics-simple-circuits-intro.mjs';
import physicsConservationOfEnergyIntro from './physics/physics-conservation-of-energy-intro.mjs';
import physicsMomentumIntro from './physics/physics-momentum-intro.mjs';
import mathSimpleEquationsIntro from './math/math-simple-equations-intro.mjs';
import mathFractionsIntro from './math/math-fractions-intro.mjs';
import mathPatternsAndRulesIntro from './math/math-patterns-and-rules-intro.mjs';
import mathQuadraticsIntro from './math/math-quadratics-intro.mjs';
import chemistryPhysicalAndChemicalChangeIntro from './chemistry/chemistry-physical-and-chemical-change-intro.mjs';
import chemistryThePeriodicTableIntro from './chemistry/chemistry-the-periodic-table-intro.mjs';
import chemistryAcidsAndBasesIntro from './chemistry/chemistry-acids-and-bases-intro.mjs';
import chemistryRatesOfReactionIntro from './chemistry/chemistry-rates-of-reaction-intro.mjs';
import biologyPhotosynthesisIntro from './biology/biology-photosynthesis-intro.mjs';
import biologyCellStructureIntro from './biology/biology-cell-structure-intro.mjs';
import biologyDigestionIntro from './biology/biology-digestion-intro.mjs';
import biologyDnaAndInheritanceIntro from './biology/biology-dna-and-inheritance-intro.mjs';
import englishParagraphStructureIntro from './english/english-paragraph-structure-intro.mjs';
import englishMakingInferencesIntro from './english/english-making-inferences-intro.mjs';
import englishPersuasiveWritingIntro from './english/english-persuasive-writing-intro.mjs';
import englishAnalysingAnAuthorsChoicesIntro from './english/english-analysing-an-authors-choices-intro.mjs';
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
  physicsSpeedAndVelocityIntro,
  physicsSimpleCircuitsIntro,
  physicsConservationOfEnergyIntro,
  physicsMomentumIntro,
  mathSimpleEquationsIntro,
  mathFractionsIntro,
  mathPatternsAndRulesIntro,
  mathQuadraticsIntro,
  chemistryPhysicalAndChemicalChangeIntro,
  chemistryThePeriodicTableIntro,
  chemistryAcidsAndBasesIntro,
  chemistryRatesOfReactionIntro,
  biologyPhotosynthesisIntro,
  biologyCellStructureIntro,
  biologyDigestionIntro,
  biologyDnaAndInheritanceIntro,
  englishParagraphStructureIntro,
  englishMakingInferencesIntro,
  englishPersuasiveWritingIntro,
  englishAnalysingAnAuthorsChoicesIntro,
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
