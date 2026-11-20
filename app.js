import {
  mountTutorPanel,
  mountTutorPicker,
  storedTutorId,
  tutorPicker,
  tutorProfile,
} from './tutor/components.mjs';

const subjects = {
 mathematics:{name:'Mathematics',icon:'✳',color:'#ffd45b',levels:['Basic arithmetic','Basic algebra','Algebra','Calculus'],checks:['add and subtract whole numbers','work with fractions','solve a simple equation'],topic:'Power the lanterns',concept:'Addition combines quantities. The total stays the same even when the groups are rearranged.',mission:'A workshop has 3 charged cells and finds 4 more. How many cells can power its lanterns?',options:['7 cells','6 cells','8 cells'],recall:'What does addition do?',recallOptions:['Combines quantities','Splits a quantity','Changes a unit'],future:['Fractions','Algebra','Functions']},
 physics:{name:'Physics',icon:'ϟ',color:'#65f6c1',levels:['Getting started','Foundations','Forces and motion','Advanced physics'],checks:['describe a force','identify gravity’s direction','explain balanced forces'],topic:'The falling garden',concept:'Gravity pulls objects toward Earth. Without air resistance, objects fall with the same acceleration regardless of mass.',mission:'A seed pod is released above the garden. Which way will gravity pull it?',options:['Down toward Earth','Up into the sky','Sideways'],recall:'What does gravity do near Earth?',recallOptions:['Pulls objects toward Earth','Pushes objects upward','Only acts on heavy objects'],future:['Friction','Balanced forces','Simple machines']},
 chemistry:{name:'Chemistry',icon:'⬡',color:'#ff8d7a',levels:['Getting started','Matter basics','Atoms and reactions','Advanced chemistry'],checks:['recognise solids, liquids and gases','describe an atom','identify a chemical change'],topic:'The water workshop',concept:'Matter can exist as a solid, liquid, or gas. Heating ice can melt it into liquid water; the water is still the same substance.',mission:'The workshop needs liquid water. What should you do to a block of ice?',options:['Warm it until it melts','Freeze it further','Crush it without warming it'],recall:'What is ice after it melts?',recallOptions:['Liquid water','A new element','Water vapour'],future:['Atoms','Elements','Reactions']},
 biology:{name:'Biology',icon:'✿',color:'#a8ed8e',levels:['Getting started','Living things','Cells and systems','Advanced biology'],checks:['identify living things','describe a cell','explain photosynthesis'],topic:'Wake the greenhouse',concept:'Plants use light, water, and carbon dioxide to make sugars through photosynthesis. Light provides energy for this process.',mission:'A healthy plant is kept in a dark cupboard. What should you provide to help it photosynthesise?',options:['Light','A heavier pot','A stone'],recall:'What supplies energy for photosynthesis?',recallOptions:['Light','Soil alone','Darkness'],future:['Cells','Body systems','Ecosystems']},
 english:{name:'English',icon:'✎',color:'#a9bdff',levels:['Getting started','Sentence basics','Reading and writing','Advanced English'],checks:['identify a complete sentence','find the main idea','support a claim with evidence'],topic:'The signal message',concept:'A complete sentence expresses a full thought and normally includes a subject and a verb.',mission:'Choose the complete message to send to the workshop.',options:['The lantern glows.','Under the lantern.','A bright green lantern.'],recall:'What does a complete sentence express?',recallOptions:['A full thought','Only a list of objects','A sound without meaning'],future:['Main ideas','Evidence','Creative writing']}
};

const $ = selector => document.querySelector(selector);
const progressKey = 'lumino-v2';
let stored;
try {
  stored = JSON.parse(localStorage.getItem(progressKey) || '{}') || {};
} catch {
  stored = {};
}
const { guide: legacyGuide, ...savedProgress } = stored;
const state = {
  intro: false,
  subject: 'mathematics',
  level: 0,
  confidence: [],
  complete: [],
  ...savedProgress,
  tutor: storedTutorId(savedProgress.tutor, legacyGuide),
};
let step = 0;
let question = 0;
let activity = 0;

function save() {
  try {
    localStorage.setItem(progressKey, JSON.stringify(state));
  } catch {
    notice('Progress could not be saved on this device.');
  }
}

function selectTutor(id) {
  state.tutor = id;
  save();
}

function notice(text) {
  const toast = $('#toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function render(html) {
  $('#app').innerHTML = html;
  window.scrollTo(0, 0);
}

function renderStory(content, stage) {
  render(`<div class="story-layout">
    <aside class="guide-panel" aria-label="Your tutor"><div class="tutor-panel"></div></aside>
    <section class="story-content">${content}</section>
  </div>`);
  mountTutorPanel($('.tutor-panel'), {
    id: state.tutor,
    subject: state.subject,
    stage,
    onSelect: stage ? selectTutor : undefined,
  });
}

function buttons(items, attribute) {
  return `<div class="choice-grid">${items.map((item, index) =>
    `<button class="choice" ${attribute}="${index}">${item}</button>`).join('')}</div>`;
}

function bind(attribute, onSelect) {
  document.querySelectorAll(`[${attribute}]`).forEach(button => {
    button.onclick = () => onSelect(Number(button.getAttribute(attribute)));
  });
}

function intro() {
  const skip = '<button class="text-button skip" id="skip">Skip introduction</button>';
  const subject = subjects[state.subject];

  if (step === 0) renderStory(`${skip}
    <p class="eyebrow">WELCOME TO LUMINO</p>
    <h1>Meet your <em>tutors.</em></h1>
    <p class="lede">Linda and Charles will help you explore ideas and put them to work.</p>
    <button class="primary-button" id="next">Choose your tutor</button>`);

  if (step === 1) {
    renderStory(`${skip}
      <h1>Choose your tutor.</h1>
      <p class="lede">You can switch whenever you like during a lesson.</p>
      ${tutorPicker(state.tutor)}
      <button class="primary-button" id="next">Continue</button>`);
    mountTutorPicker($('.story-content'), id => {
      selectTutor(id);
      mountTutorPanel($('.tutor-panel'), { id });
    });
  }

  if (step === 2) renderStory(`${skip}
    <p class="eyebrow">LEARN BY DOING</p>
    <h1>Ideas become <em>tools.</em></h1>
    <p class="lede">${tutorProfile(state.tutor).welcome}</p>
    <div class="mini-flow"><span>LEARN</span><span>✦</span><span>TRY</span><span>✦</span><span>RESTORE</span></div>
    <button class="primary-button" id="next">Let’s find your path</button>`);

  if (step === 3) renderStory(`${skip}
    <p class="eyebrow">YOUR FIRST ADVENTURE</p>
    <h1>What would you like to learn?</h1>
    ${buttons(Object.values(subjects).map(item => `${item.icon}  ${item.name}`), 'data-subject')}`);

  if (step === 4) renderStory(`${skip}
    <p class="eyebrow">${subject.name.toUpperCase()}</p>
    <h1>Where are you starting?</h1>
    <p class="lede">Choose the level that feels closest. You can change this later.</p>
    ${buttons(subject.levels, 'data-level')}`);

  if (step === 5) renderStory(`${skip}
    <p class="eyebrow">CONFIDENCE CHECK · ${question + 1} / ${subject.checks.length}</p>
    <h1>Do you know how to ${subject.checks[question]}?</h1>
    <p class="lede">Your answer tells me how confident you feel; it isn’t a test.</p>
    ${buttons(['Yes', 'Maybe', 'No'], 'data-confidence')}`);

  if (step === 6) {
    const recommended = state.confidence.filter(answer => answer === 2).length >= 2 ? 0 : state.level;
    renderStory(`
      <p class="eyebrow">YOUR LEARNING PLAN</p>
      <h1>Let’s build your <em>path.</em></h1>
      <p class="lede">Based on your choices, I suggest <strong>${subject.levels[recommended]}</strong>. Your confidence answers help guide this suggestion, and you’re free to choose another starting point.</p>
      <label for="plan-level">Your starting level</label>
      <select id="plan-level">${subject.levels.map((level, index) =>
        `<option value="${index}" ${index === recommended ? 'selected' : ''}>${level}</option>`).join('')}</select>
      <div class="blueprint">Start with <strong>${subject.topic}</strong>, then explore new topics as they arrive.</div>
      <button class="primary-button" id="finish">Open my learning map</button>`);
  }

  if ($('#skip')) $('#skip').onclick = () => {
    state.intro = true;
    save();
    home();
  };
  if ($('#next')) $('#next').onclick = () => {
    step++;
    intro();
  };
  bind('data-subject', index => {
    state.subject = Object.keys(subjects)[index];
    state.confidence = [];
    step = 4;
    intro();
  });
  bind('data-level', index => {
    state.level = index;
    question = 0;
    step = 5;
    intro();
  });
  bind('data-confidence', index => {
    state.confidence[question] = index;
    question++;
    if (question >= subject.checks.length) step = 6;
    intro();
  });
  if ($('#finish')) $('#finish').onclick = () => {
    state.level = Number($('#plan-level').value);
    state.intro = true;
    save();
    home();
  };
}

function home() {
  const subject = subjects[state.subject];
  const completed = state.complete.includes(state.subject);
  render(`<div class="map-shell">
    <div class="map-heading">
      <div>
        <p class="eyebrow">YOUR LEARNING WORLD</p>
        <h1>Make knowledge <em>move.</em></h1>
        <p class="lede">Choose a subject and follow its path with your tutor.</p>
      </div>
      <aside class="tutor-panel" aria-label="Your tutor"></aside>
    </div>
    <nav class="subject-tabs" aria-label="Choose a subject">${Object.entries(subjects).map(([id, item]) =>
      `<button class="subject-tab ${id === state.subject ? 'selected' : ''}" data-map="${id}">${item.icon} ${item.name}</button>`).join('')}</nav>
    <div class="map-title">
      <div>
        <p class="eyebrow">YOUR SUBJECT MAP</p>
        <h2>${subject.name}</h2>
        <p>Starting point: ${subject.levels[state.level] || subject.levels[0]}</p>
      </div>
      <button class="secondary-button" id="edit-plan">Edit learning plan</button>
    </div>
    <div class="map-path">
      <div class="map-node">
        <span class="node-icon" style="--node-color:${subject.color}">${subject.icon}</span>
        <div>
          <p class="eyebrow">${completed ? 'COMPLETED' : 'READY TO EXPLORE'}</p>
          <h3>${subject.topic}</h3>
          <p>Learn the idea, solve a repair, and check your understanding.</p>
          <button class="primary-button" id="start">${completed ? 'Play again' : 'Begin starter topic'}</button>
        </div>
      </div>
      ${subject.future.map((topic, index) => `<div class="map-node locked">
        <span class="node-icon">${index + 2}</span>
        <div><p class="eyebrow">COMING SOON</p><h3>${topic}</h3><p>A new adventure is on its way.</p></div>
      </div>`).join('')}
    </div>
    <p class="map-footer">Your progress is saved on this device. <a href="../about.html">About Lumino</a></p>
  </div>`);

  mountTutorPanel($('.tutor-panel'), { id: state.tutor, onSelect: selectTutor });
  document.querySelectorAll('[data-map]').forEach(button => {
    button.onclick = () => {
      state.subject = button.dataset.map;
      state.level = 0;
      save();
      home();
    };
  });
  $('#start').onclick = () => {
    activity = 0;
    lesson();
  };
  $('#edit-plan').onclick = () => {
    step = 4;
    state.confidence = [];
    intro();
  };
}

function lesson() {
  const subject = subjects[state.subject];
  if (activity === 0) {
    renderStory(`
      <button class="text-button" id="back">Back to map</button>
      <p class="eyebrow">${subject.name.toUpperCase()} · STARTER TOPIC</p>
      <h1>${subject.topic}</h1>
      <p class="lesson-copy">${subject.concept}</p>
      <div class="blueprint">Read the idea, then use it to solve a workshop problem.</div>
      <button class="primary-button" id="next">Try the repair</button>`, 'concept');
    $('#back').onclick = home;
    $('#next').onclick = () => {
      activity = 1;
      lesson();
    };
    return;
  }

  const recall = activity === 2;
  renderStory(`
    <button class="text-button" id="back">Back to map</button>
    <p class="eyebrow">${recall ? 'QUICK RECALL' : 'WORKSHOP REPAIR'}</p>
    <h1>${recall ? 'Make it stick.' : 'Put it to work.'}</h1>
    <p class="lesson-copy">${recall ? subject.recall : subject.mission}</p>
    ${buttons(recall ? subject.recallOptions : subject.options, 'data-answer')}
    <p id="feedback" role="status"></p>`, recall ? 'recall' : 'repair');
  $('#back').onclick = home;
  bind('data-answer', index => {
    if (index !== 0) {
      $('#feedback').textContent = 'Not quite. Think back to the idea and try again.';
      return;
    }
    if (!recall) {
      activity = 2;
      lesson();
      return;
    }
    if (!state.complete.includes(state.subject)) state.complete.push(state.subject);
    save();
    renderStory(`
      <p class="eyebrow">REPAIR COMPLETE</p>
      <h1>Well done, <em>explorer.</em></h1>
      <p class="lede">You used what you learned and restored a little more light to the workshop.</p>
      <button class="primary-button" id="done">Return to the map</button>`, 'recap');
    $('#done').onclick = home;
  });
}

$('#reset').onclick = () => {
  if (confirm('Reset all Lumino progress on this device?')) {
    localStorage.removeItem(progressKey);
    location.reload();
  }
};

window.addEventListener('load', () => {
  $('#splash').classList.add('hidden');
  if (legacyGuide !== undefined) save();
  if (state.intro) home();
  else intro();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js').catch(() => {});
});
