import { LEVELS, topicById } from './curriculum.mjs?v=34';
import { LESSONS } from './content.mjs?v=24';
import { uiIcon } from './pixel-art.mjs?v=31';

export const CART_ID = 'cart-workshop';

const routes = {
  math: {
    scenes: ['terraced-valley', 'sunset-valley'],
    topics: ['simple-equations', 'fractions', 'patterns-and-rules', 'quadratics'],
    previews: ['Parts of a whole', 'Finding the nth term', 'Solving real-world quadratics'],
    games: [['trail-rice', 'Rice Fields crossing'], ['fraction-workshop', 'Fraction workshop'], ['math-playground', 'Math Playground'], ['quadratic-lab', 'Quadratic lab']],
  },
  physics: {
    scenes: ['jungle-canyon', 'mountain-forest'],
    topics: ['speed-and-velocity', 'simple-circuits', 'conservation-of-energy', 'momentum'],
    previews: ['Circuit symbols and components', 'Energy stores and transfers', 'Momentum in collisions'],
    games: [[CART_ID, 'Cart Workshop'], ['circuit-workshop', 'Circuit workshop'], ['energy-workshop', 'Energy workshop'], ['momentum-lab', 'Momentum lab']],
  },
  chemistry: {
    scenes: ['temple-ruins', 'jungle-canyon'],
    topics: ['physical-and-chemical-change', 'the-periodic-table', 'acids-and-bases', 'rates-of-reaction'],
    previews: ['Groups and periods', 'Neutralisation', 'Interpreting rate graphs'],
    games: [['trail-city', 'City trail'], ['elements-workshop', 'Elements workshop'], ['reaction-workshop', 'Reaction workshop'], ['rates-lab', 'Rates lab']],
  },
  biology: {
    scenes: ['mountain-forest', 'terraced-valley'],
    topics: ['photosynthesis', 'cell-structure', 'digestion', 'dna-and-inheritance'],
    previews: ['Plant and animal cells', 'Enzymes and absorption', 'Genetic crosses and pedigrees'],
    games: [['trail-rainforest', 'Rainforest trail'], ['cell-workshop', 'Cell workshop'], ['digestion-lab', 'Digestion lab'], ['inheritance-lab', 'Inheritance lab']],
  },
  english: {
    scenes: ['sunset-temple', 'temple-ruins'],
    topics: ['paragraph-structure', 'making-inferences', 'persuasive-writing', 'analysing-an-authors-choices'],
    previews: ['Reading for clues', 'Supporting a viewpoint', 'Language and its effects'],
    games: [['trail-wheat', 'Wheat Fields trail'], ['clue-workshop', 'Clue workshop'], ['editor-workshop', 'Editor’s workshop'], ['writer-workshop', 'Writer’s workshop']],
  },
};

const starterTitles = {
  math: 'Linear equations', physics: 'Motion: speed, distance and time',
  chemistry: 'Physical and chemical change', biology: 'Photosynthesis',
  english: 'Paragraphs and opening sentences',
};

export function roadmapBands(subject, starterSubtopic = LESSONS[subject.id].title) {
  const route = routes[subject.id];
  return LEVELS.map((level, index) => {
    const topic = topicById(subject, route.topics[index]);
    const title = index === 0 ? starterTitles[subject.id] : topic.name;
    const [gameId, gameTitle] = route.games[index];
    return {
      level: level.name, index,
      topic: title.split(':', 1)[0], subtopic: index === 0 ? starterSubtopic : route.previews[index - 1],
      nodes: [
        { id: topic.id, title,
          type: 'topic', available: index === 0, detail: topic.goals[level.id] },
        { id: gameId, title: gameTitle, type: 'game', available: index === 0,
          detail: index ? `A workshop for practising ${topic.name.toLowerCase()}.` : '' },
      ],
    };
  });
}

const placementIndex = placement => LEVELS.findIndex(level => level.id === placement);

export function mapMarkup(subject, bands, { placement, finished, gameResults }) {
  const marker = placementIndex(placement);
  return `<div class="roadmap" aria-label="${subject.name} roadmap">
    <svg class="roadmap-route" aria-hidden="true"><path vector-effect="non-scaling-stroke"/></svg>
    <div class="map-scenery" aria-hidden="true">${routes[subject.id].scenes.map((scene, index) =>
      `<img src="../assets/roadmaps/${scene}.webp" alt="" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">`).join('')}${
      routes[subject.id].scenes.slice(1).map(() => '<span class="map-seam"></span>').join('')}</div>
    <div class="roadmap-bands">${bands.map(band => `
      <section class="map-band map-band-${band.index}" aria-label="${band.level}"${marker === band.index ? ' data-placement' : ''}>
        <header class="map-band-heading">
          <span class="chapter-level" aria-hidden="true"><i></i><span>${band.level}</span><i></i></span>
          <h3>${band.topic}</h3>
          <p><span>${band.subtopic}</span> ${marker === band.index ? '<span class="placement-chip">Your level</span>' : ''}</p>
        </header>
        <ol class="map-nodes">${band.nodes.map(item => {
          const status = item.type === 'game' ? gameResults[item.id] : finished ? 'completed' : 'current';
          let label = 'Available soon';
          if (item.available) {
            label = item.type === 'topic' ? (finished ? 'Completed' : 'Current topic')
              : status === 'completed' ? 'Completed · Replay' : status === 'skipped' ? 'Skipped · Play' : 'Optional game';
          }
          return `<li><button type="button" class="map-node" data-map-node="${item.id}" data-node-state="${item.available ? status || 'live' : 'preview'}"
              ${item.available && status === 'current' && item.type === 'topic' ? 'aria-current="step"' : ''}>
            <span class="map-node-icon">${uiIcon(item.type === 'game' ? 'star' : subject.id)}</span>
            <span class="map-node-text"><b>${item.title}</b><small>${label}</small></span>
          </button></li>`;
        }).join('')}</ol>
      </section>`).join('')}</div>
  </div>`;
}

export function mapPlacementNote(placement) {
  const index = placementIndex(placement);
  return index > 0 ? `Your level is ${LEVELS[index].name}. Those lessons are coming. Start with the live topic below.` : '';
}

function windingDetour(start, end, heading, width, right) {
  const edge = right ? width - 12 : 12;
  const pass = right ? Math.min(edge, Math.max(heading.right + 14, width * .73))
    : Math.max(edge, Math.min(heading.left - 14, width * .27));
  const bow = pass + (edge - pass) * .8;
  const below = heading.bottom + 9;
  const above = heading.top - 9;
  const approach = (start.y - below) * .65;
  const depart = (above - end.y) * .65;
  const span = below - above;
  return ` C ${start.x} ${start.y - approach} ${pass} ${below + approach} ${pass} ${below}
    C ${bow} ${below - span * .35} ${bow} ${above + span * .35} ${pass} ${above}
    C ${pass} ${above - depart} ${end.x} ${end.y + depart} ${end.x} ${end.y}`;
}

export function drawRoadmap(root) {
  const svg = root.querySelector('.roadmap-route');
  const path = svg.querySelector('path');
  const bands = [...root.querySelectorAll('.map-band')].map(band => ({
    heading: band.querySelector('.map-band-heading'),
    buttons: [...band.querySelectorAll('.map-node')],
  }));
  const clearance = 7;

  const paint = () => {
    const base = svg.getBoundingClientRect();
    const points = bands.flatMap(({ heading, buttons }, index) => {
      const marker = heading.getBoundingClientRect();
      const obstacle = { left: marker.left - base.left, right: marker.right - base.left,
        top: marker.top - base.top, bottom: marker.bottom - base.top };
      return buttons.map((button, offset) => {
        const bounds = button.getBoundingClientRect();
        const icon = button.querySelector('.map-node-icon').getBoundingClientRect();
        return {
          x: icon.left + icon.width / 2 - base.left,
          top: bounds.top - base.top - clearance,
          bottom: bounds.bottom - base.top + clearance,
          detour: offset === buttons.length - 1 ? obstacle : null,
          right: index % 2 === 0,
        };
      });
    });
    const first = points[0];
    let line = `M ${first.x + 9} ${first.bottom + 27} Q ${first.x - 5} ${first.bottom + 14} ${first.x} ${first.bottom}`;
    for (let index = 1; index < points.length; index++) {
      const previous = points[index - 1];
      const next = points[index];
      const start = { x: previous.x, y: previous.top };
      const end = { x: next.x, y: next.bottom };
      line += ` M ${start.x} ${start.y}`;
      if (previous.detour) {
        line += windingDetour(start, end, previous.detour, base.width, previous.right);
      } else {
        const bend = (start.y - end.y) * .85;
        line += ` C ${start.x} ${start.y - bend} ${end.x} ${end.y + bend} ${end.x} ${end.y}`;
      }
    }
    const last = points.at(-1);
    path.setAttribute('d', `${line} M ${last.x} ${last.top} Q ${last.x + 16} ${last.top - 13} ${last.x + 10} ${last.top - 25}`);
  };

  paint();
  if (!('ResizeObserver' in window)) {
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }
  const observer = new ResizeObserver(paint);
  observer.observe(root);
  for (const { heading, buttons } of bands) {
    observer.observe(heading);
    for (const button of buttons) observer.observe(button);
  }
  return () => observer.disconnect();
}
