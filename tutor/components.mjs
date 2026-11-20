import { tutors } from './dialogue.mjs';

const helpLabels = {
  concept: 'Explain it another way',
  repair: 'Give me a hint',
  recall: 'Give me a hint',
  recap: 'Read the recap',
};

export function storedTutorId(tutor, legacyGuide) {
  if (Object.hasOwn(tutors, tutor)) return tutor;
  return legacyGuide === 'male' ? 'charles' : 'linda';
}

export function tutorProfile(id) {
  return tutors[id];
}

function portrait(id, animated = false) {
  return `<span class="tutor-portrait tutor-portrait--${id}${animated ? ' tutor-portrait--animated' : ''}" aria-hidden="true"></span>`;
}

export function tutorPicker(selectedId) {
  const choices = Object.entries(tutors).map(([id, tutor]) => `
    <label class="tutor-choice">
      <input type="radio" name="tutor" value="${id}" ${id === selectedId ? 'checked' : ''}>
      ${portrait(id)}
      <span class="tutor-choice-copy"><strong>${tutor.name}</strong><span>${tutor.style}</span></span>
    </label>`).join('');

  return `<fieldset class="tutor-picker"><legend class="tutor-visually-hidden">Choose your tutor</legend>${choices}</fieldset>`;
}

export function mountTutorPicker(container, onSelect) {
  container.querySelectorAll('input[name="tutor"]').forEach(input => {
    input.addEventListener('change', () => onSelect(input.value));
  });
}

export function mountTutorPanel(container, { id, subject, stage, onSelect }) {
  const tutor = tutorProfile(id);
  const script = tutor.lessons[subject]?.[stage];

  container.innerHTML = `
    <div class="tutor-identity">
      ${portrait(id, true)}
      <div><p class="tutor-name">${tutor.name}</p><p class="tutor-style">${tutor.style}</p></div>
    </div>
    ${onSelect ? `<details class="tutor-switch">
      <summary>Switch tutor</summary>
      ${tutorPicker(id)}
    </details>` : ''}
    ${script ? `<div>
      <button type="button" class="secondary-button tutor-help" aria-controls="tutor-reply" aria-expanded="false">${helpLabels[stage]}</button>
      <p class="tutor-reply" id="tutor-reply" role="status"></p>
    </div>` : ''}
    <span class="tutor-visually-hidden tutor-announcement" role="status"></span>`;

  if (onSelect) {
    mountTutorPicker(container, nextId => {
      onSelect(nextId);
      mountTutorPanel(container, { id: nextId, subject, stage, onSelect });
      container.querySelector('summary').focus();
      container.querySelector('.tutor-announcement').textContent = `${tutorProfile(nextId).name} is now your tutor.`;
    });
  }

  if (script) {
    const button = container.querySelector('.tutor-help');
    const reply = container.querySelector('.tutor-reply');
    const sprite = container.querySelector('.tutor-portrait');
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'false';
      button.setAttribute('aria-expanded', String(expanded));
      reply.textContent = expanded ? script : '';
      sprite.classList.toggle('tutor-portrait--explaining', expanded);
    });
    sprite.addEventListener('animationend', event => {
      if (event.animationName === 'tutor-explain') sprite.classList.remove('tutor-portrait--explaining');
    });
  }
}
