const tyres = [
  { id: 'smooth', name: 'Smooth', grip: 'Low grip', deceleration: 0.8 },
  { id: 'tread', name: 'Treaded', grip: 'Medium grip', deceleration: 1.6 },
  { id: 'grippy', name: 'Soft rubber', grip: 'High grip', deceleration: 2.5 },
];

const approachDistance = 12;
const approachTime = 3;
const brakeSpeed = approachDistance / approachTime;
const markedZone = 6;

export function cartTrial(tyreId) {
  const tyre = tyres.find(item => item.id === tyreId);
  const brakingDistance = brakeSpeed ** 2 / (2 * tyre.deceleration);
  return {
    tyre, approachDistance, approachTime, brakeSpeed, brakingDistance,
    stopsInZone: brakingDistance <= markedZone,
  };
}

export function workshopMarkup() {
  return `<div class="cart-workshop">
    <p class="muted">Fit a set of tyres, predict where the cart will stop, then test a different set. Which tyres leave more room before the end of the stopping zone?</p>
    <dl class="cart-controls-fixed">
      <div><dt>Approach</dt><dd>${approachDistance} m in ${approachTime} s</dd></div>
      <div><dt>Speed at brake line</dt><dd>${brakeSpeed} m/s</dd></div>
      <div><dt>Stopping zone</dt><dd>${markedZone} m</dd></div>
    </dl>
    <div class="cart-track" aria-hidden="true">
      <span class="cart-line cart-line-brake">Brake</span><span class="cart-line cart-line-end">${markedZone} m</span>
      <span class="cart-vehicle"><i></i><i></i></span>
    </div>
    <form class="cart-form">
      <fieldset><legend>Fit tyres</legend><div class="cart-options">${tyres.map(tyre =>
        `<label><input type="radio" name="tyres" value="${tyre.id}" required><span><b>${tyre.name}</b><small>${tyre.grip}</small></span></label>`).join('')}</div></fieldset>
      <fieldset><legend>Will the cart stop inside the zone?</legend><div class="cart-options">
        <label><input type="radio" name="prediction" value="yes" required><span>Yes</span></label>
        <label><input type="radio" name="prediction" value="no" required><span>No</span></label>
      </div></fieldset>
      <button class="btn banana" type="submit">Run trial</button>
    </form>
    <p class="muted cart-feedback" data-cart-feedback role="status"></p>
    <div class="cart-results" data-cart-results></div>
    <div data-cart-explain></div>
    <details class="cart-model"><summary>About this model</summary>
      <p>Each run uses the same cart and track. The cart approaches at a steady speed and braking starts at the marked line. Each tyre has a fixed braking deceleration in this model.</p></details>
    <button type="button" class="textbtn" data-cart-skip>Skip workshop</button>
  </div>`;
}

export function bindWorkshop(root, { onComplete, onSkip, reducedMotion }) {
  const form = root.querySelector('.cart-form');
  const track = root.querySelector('.cart-track');
  const vehicle = track.querySelector('.cart-vehicle');
  const feedback = root.querySelector('[data-cart-feedback]');
  const results = root.querySelector('[data-cart-results]');
  const explain = root.querySelector('[data-cart-explain]');
  const trials = new Map();

  function showTrials() {
    results.innerHTML = `<table>
      <caption>Trial measurements</caption>
      <thead><tr><th scope="col">Tyres</th><th scope="col">Approach distance</th><th scope="col">Approach time</th><th scope="col">Average approach speed</th><th scope="col">Braking distance</th></tr></thead>
      <tbody>${[...trials.values()].map(trial => `<tr><th scope="row">${trial.tyre.name}</th>
        <td>${trial.approachDistance} m</td><td>${trial.approachTime} s</td><td>${trial.brakeSpeed} m/s</td>
        <td>${trial.brakingDistance.toFixed(1)} m</td></tr>`).join('')}</tbody>
    </table>`;
  }

  function showComparison() {
    const sorted = [...trials.values()].sort((a, b) => a.brakingDistance - b.brakingDistance);
    const best = sorted[0];
    const last = sorted.at(-1);
    const bestDistance = best.brakingDistance.toFixed(1);
    const lastDistance = last.brakingDistance.toFixed(1);
    const correct = sorted.length === 2 ? 1 : 0;
    const claims = [
      `${last.tyre.name} stopped sooner because its distance of ${lastDistance} m was larger.`,
      `${best.tyre.name} stopped in ${bestDistance} m compared with ${lastDistance} m on ${last.tyre.name.toLowerCase()} tyres, with both runs braking from ${brakeSpeed} m/s.`,
    ];
    if (correct === 0) claims.reverse();
    explain.innerHTML = `<fieldset class="cart-explanation"><legend>Which conclusion is backed by the measurements?</legend>
      <div class="choices">${claims.map((claim, index) =>
        `<button class="choice" type="button" data-claim="${index}"><b>${claim}</b></button>`).join('')}</div>
      <p class="muted" role="status" data-claim-feedback></p>
      <button class="btn" type="button" data-finish-cart hidden>Finish workshop</button></fieldset>`;
    const finish = explain.querySelector('[data-finish-cart]');
    const claimFeedback = explain.querySelector('[data-claim-feedback]');
    const answers = [...explain.querySelectorAll('[data-claim]')];
    for (const [index, answer] of answers.entries()) {
      answer.onclick = () => {
        if (index === correct) {
          answers.forEach(button => { button.disabled = true; });
          answer.classList.add('right');
          claimFeedback.textContent = 'Correct. You compared the measured braking distances at the same starting speed.';
          finish.hidden = false;
          finish.focus();
        } else {
          claimFeedback.textContent = 'Look for the smaller braking distance and check that the initial speed matched.';
        }
      };
    }
    finish.onclick = onComplete;
  }

  form.addEventListener('change', event => {
    if (event.target.name === 'tyres') form.querySelectorAll('[name="prediction"]').forEach(input => { input.checked = false; });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const trial = cartTrial(data.get('tyres'));
    const predictedInside = data.get('prediction') === 'yes';
    trials.set(trial.tyre.id, trial);
    track.style.setProperty('--cart-stop', `${46 + trial.brakingDistance * 3.5}%`);
    vehicle.classList.remove('cart-ran');
    if (!reducedMotion()) void vehicle.offsetWidth;
    vehicle.classList.add('cart-ran');
    feedback.textContent = `${trial.tyre.name} stopped ${trial.brakingDistance.toFixed(1)} m past the brake line, ${trial.stopsInZone ? 'inside' : 'beyond'} the zone. ${predictedInside === trial.stopsInZone ? 'Your prediction matched.' : 'Compare that with your prediction.'}${trials.size < 2 ? ' Try a different set of tyres.' : ''}`;
    showTrials();
    if (trials.size >= 2) showComparison();
  });

  root.querySelector('[data-cart-skip]').onclick = onSkip;
}
