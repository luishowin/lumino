import { landscape, trails } from './levels.mjs';
import { cellTiles, drawRelay, explorer, makeTerrain, openTile, relayTile, sameTile } from './art.mjs';

const HEIGHT = 360;
const WORLD_WIDTH = 1760;
const BRIDGE = [[432, 298, 64], [496, 298, 64], [560, 298, 64]];
const ROPE = { x: 548, y: 85, length: 190 };
const DIRECTIONS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
const KEY_BINDINGS = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  Space: 'jump', ShiftLeft: 'run', ShiftRight: 'run', KeyE: 'action',
};
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function adventureMarkup(trailId, backLabel = 'Back to map') {
  const trail = trails.find(item => item.id === trailId);
  return `<section class="adventure">
    <div class="adventure-top">
      <button type="button" class="text-button" data-trail-back>← ${backLabel}</button>
      <div data-trail-picker></div>
    </div>
    <div class="adventure-heading">
      <div>
        <p class="eyebrow" data-trail-biome>${trail.name}</p>
        <h1 tabindex="-1" data-trail-title>${trail.title}</h1>
      </div>
      <p data-trail-goal>${trail.goal}</p>
    </div>
    <div class="adventure-stage" tabindex="0" role="region" aria-label="Playable terrain" aria-describedby="trail-help">
      <canvas data-trail-canvas width="800" height="360" aria-label="${trail.name}"></canvas>
      <div class="adventure-progress" aria-hidden="true"><span></span></div>
      <div class="adventure-overlay" hidden>
        <p>Trail complete</p>
        <button type="button" class="primary-button" data-trail-next></button>
      </div>
    </div>
    <div class="adventure-controls">
      <div class="adventure-move">
        <button type="button" data-control="left" aria-label="Move left">←</button>
        <button type="button" data-control="up" aria-label="Move up" hidden>↑</button>
        <button type="button" data-control="down" aria-label="Move down" hidden>↓</button>
        <button type="button" data-control="right" aria-label="Move right">→</button>
      </div>
      <p id="trail-help"></p>
      <div class="adventure-actions">
        <button type="button" data-control="run">Run</button>
        <button type="button" data-control="jump">Jump</button>
        <button type="button" data-control="action" hidden>Interact</button>
      </div>
    </div>
    <div class="adventure-footer">
      <p data-trail-status role="status"></p>
      <button type="button" class="text-button" data-trail-skip hidden>Go to the workshop</button>
    </div>
  </section>`;
}

export function mountAdventure(root, firstId, { onBack, onWorkshop }) {
  const select = selector => root.querySelector(selector);
  const stage = select('.adventure-stage');
  const canvas = select('canvas');
  const ctx = canvas.getContext('2d');
  const progress = select('.adventure-progress span');
  const overlay = select('.adventure-overlay');
  const next = select('[data-trail-next]');
  const status = select('[data-trail-status]');
  const actionButton = select('[data-control="action"]');
  const controls = [...root.querySelectorAll('[data-control]')];
  const listeners = new AbortController();
  const pressed = new Map();
  const effects = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let trail, backdrop, terrain, player, checkpoint, room;
  let frameId, previous, accumulator = 0;
  let ticks, swing, panels, activated, camera, finished, cooldown, actionFrame;
  let viewWidth = 800;
  let meter = -1;

  const isHeld = control => [...pressed.values()].includes(control);
  const tell = message => { status.textContent = message; };
  const groundAtExit = () => trail.platforms.at(-1)[1];

  function listen(element, type, handler) {
    element.addEventListener(type, handler, { signal: listeners.signal });
  }

  function resize() {
    const width = stage.clientWidth;
    viewWidth = clamp(Math.round(width), 500, 800);
    canvas.width = viewWidth;
    ctx.imageSmoothingEnabled = false;
  }

  function updateControls() {
    for (const button of controls) {
      const control = button.dataset.control;
      if (control === 'up' || control === 'down') button.hidden = !room;
      if (control === 'jump' || control === 'run') button.hidden = Boolean(room);
    }
    actionButton.hidden = !trail.action && !room;
    actionButton.textContent = room ? 'Power relay' : (trail.action || 'Interact');
    select('#trail-help').textContent = room
      ? 'Arrow keys or WASD move along the tile grid. Press E at the relay.'
      : `← → Move · Shift Run · Space Jump${trail.action ? ` · E ${trail.action}` : ''}`;
  }

  function spawn() {
    player = { x: checkpoint.x, y: checkpoint.y, vy: 0, grounded: true, facing: 1 };
    swing = null;
    effects.length = 0;
  }

  function load(id) {
    trail = trails.find(item => item.id === id);
    backdrop = new Image();
    backdrop.src = landscape(trail);
    terrain = makeTerrain(trail);
    checkpoint = { x: 118, y: trail.platforms[0][1] };
    room = null;
    ticks = panels = camera = cooldown = actionFrame = 0;
    meter = -1;
    activated = finished = false;
    pressed.clear();
    spawn();
    overlay.hidden = true;
    select('[data-trail-biome]').textContent = trail.name;
    select('[data-trail-title]').textContent = trail.title;
    select('[data-trail-goal]').textContent = trail.goal;
    canvas.setAttribute('aria-label', trail.name);
    if (picker) picker.value = id;
    tell('');
    updateControls();
  }

  function finish() {
    if (finished) return;
    finished = true;
    pressed.clear();
    overlay.hidden = false;
    const following = trails[trails.indexOf(trail) + 1];
    next.textContent = onWorkshop ? 'Continue to the workshop' : following ? `Next trail · ${following.name}` : 'Return to the map';
    next.onclick = () => {
      if (onWorkshop) onWorkshop();
      else if (following) {
        load(following.id);
        stage.focus({ preventScroll: true });
      } else onBack();
    };
    next.focus({ preventScroll: true });
  }

  function enterRelay() {
    room = { position: [1, 5], from: [1, 5], facing: 1, collected: new Set(), pause: 0, walk: 0, total: 0 };
    pressed.clear();
    select('[data-trail-goal]').textContent = 'Collect both groups of power cells, then take them to the relay.';
    canvas.setAttribute('aria-label', 'Isometric desert relay with two groups of power cells');
    tell('Power cells collected: 0 of 7.');
    updateControls();
  }

  function moveInRoom(control) {
    const [dx, dy] = DIRECTIONS[control];
    const tile = [room.position[0] + dx, room.position[1] + dy];
    if (!openTile(tile)) return;
    room.from = room.position;
    room.position = tile;
    room.facing = dx - dy > 0 ? 1 : -1;
    room.walk = reducedMotion ? 0 : 8;
    const index = cellTiles.findIndex(cell => sameTile(tile, cell));
    if (index === -1 || room.collected.has(index)) return;
    room.collected.add(index);
    const count = cellTiles[index][2];
    room.total += count;
    tell(room.total === 7 ? '3 + 4 = 7 cells. Find the relay with the green light.' : `Collected ${count} cells. Look for the other group.`);
  }

  function useAction() {
    if (room) {
      if (!sameTile(room.position, relayTile)) tell('Stand on the relay tile to use the power cells.');
      else if (room.collected.size < cellTiles.length) tell(`The relay needs 7 cells. You have ${room.total}.`);
      else {
        tell('Seven cells powered the relay.');
        finish();
      }
      return;
    }
    if (!trail.action || activated || swing) return;
    if (!player.grounded || Math.abs(player.x - trail.station) > 33) {
      tell('Stand beside the lit trail marker to use this action.');
      return;
    }
    if (trail.id === 'rice') {
      panels++;
      activated = panels === BRIDGE.length;
      actionFrame = 14;
      tell(activated ? '2 + 2 + 2 = 6 metres. The bridge is ready.' : `${panels * 2} of 6 metres built. Place another panel.`);
      return;
    }
    if (trail.id === 'mountains') {
      swing = { age: 0, attached: true };
      player.grounded = false;
      tell('Gravity speeds you up on the way down and slows you on the way up.');
      return;
    }
    if (cooldown) return;
    const seed = trail.id === 'rainforest';
    player.facing = 1;
    actionFrame = 18;
    cooldown = seed ? 46 : 23;
    effects.push({ x: trail.station, y: player.y - 24, vx: seed ? 3.8 : 12, vy: seed ? -8 : 0, seed, life: seed ? 56 : 19 });
  }

  function trigger(control) {
    if (finished) return;
    if (control === 'action') useAction();
    else if (room && DIRECTIONS[control]) {
      moveInRoom(control);
      room.pause = 13;
    } else if (control === 'jump' && player.grounded) {
      player.vy = -10.55;
      player.grounded = false;
    }
  }

  function updateEffects() {
    for (let index = effects.length - 1; index >= 0; index--) {
      const shot = effects[index];
      const [tx, ty] = trail.target;
      shot.x += shot.vx;
      shot.y += shot.vy;
      if (shot.seed) shot.vy += .44;
      if (Math.abs(shot.x - tx) < 15 && Math.abs(shot.y - ty) < 12 && (!shot.seed || shot.vy > 0)) {
        effects.splice(index, 1);
        activated = true;
        tell(shot.seed ? 'The seed reached the planter. Its leaves will use sunlight as they grow.' : 'The ice melted into liquid water and freed the switch.');
      } else if (--shot.life === 0) {
        effects.splice(index, 1);
        tell('Try again from the lit marker.');
      }
    }
  }

  function advanceSwing() {
    if (swing?.attached) {
      const angle = -.92 * Math.cos(++swing.age * Math.PI / 46);
      player.x = ROPE.x + ROPE.length * Math.sin(angle);
      player.y = ROPE.y + ROPE.length * Math.cos(angle) + 26;
      if (swing.age === 46) {
        swing.attached = false;
        player.vy = -2.5;
      }
      return true;
    }
    return false;
  }

  function updateSideView() {
    const dx = Number(isHeld('right')) - Number(isHeld('left'));
    const speed = isHeld('run') ? 5.6 : 3.65;
    if (dx) player.facing = dx;
    if (cooldown) cooldown--;
    if (actionFrame) actionFrame--;
    updateEffects();
    if (advanceSwing()) return;

    const airSwing = swing && !player.grounded;
    player.x = clamp(player.x + (airSwing ? 3.6 : dx * speed), 12, WORLD_WIDTH - 12);
    if (trail.target && !activated) player.x = Math.min(player.x, 580);
    player.vy += .48;
    const nextY = player.y + player.vy;
    const platforms = trail.id === 'rice' ? [...trail.platforms, ...BRIDGE.slice(0, panels)] : trail.platforms;
    const landing = platforms.find(([x, y, width]) => player.x >= x && player.x <= x + width
      && player.y <= y && nextY >= y && player.vy >= 0);
    player.grounded = Boolean(landing);
    if (landing) {
      player.y = landing[1];
      player.vy = 0;
      if (airSwing && player.x >= 668) {
        swing = null;
        activated = true;
      }
      if (trail.platforms.includes(landing) && landing[0] > checkpoint.x && (!trail.action || activated)) {
        checkpoint = { x: landing[0] + 28, y: landing[1] };
      }
    } else {
      player.y = nextY;
    }

    if (player.y > HEIGHT + 85) {
      spawn();
      tell('Back at the last safe ledge.');
    }
    if (player.x >= trail.exit - 12 && player.grounded && (!trail.action || activated)) {
      if (trail.id === 'desert') enterRelay();
      else finish();
    }
  }

  function step() {
    if (finished) return;
    ticks++;
    if (!room) {
      updateSideView();
      return;
    }
    if (room.walk) room.walk--;
    if (room.pause) room.pause--;
    const direction = Object.keys(DIRECTIONS).find(isHeld);
    if (direction && !room.pause) {
      moveInRoom(direction);
      room.pause = 9;
    }
  }

  function drawBackground(pan, dim) {
    ctx.fillStyle = trail.sky;
    ctx.fillRect(0, 0, viewWidth, HEIGHT);
    if (backdrop.complete && backdrop.naturalWidth) {
      const width = Math.max(viewWidth + 245, (HEIGHT + 15) * backdrop.width / backdrop.height);
      const height = width * backdrop.height / backdrop.width;
      ctx.drawImage(backdrop, Math.round(-pan * (width - viewWidth)), 0, Math.ceil(width), Math.ceil(height));
    }
    if (dim) {
      ctx.fillStyle = '#111c2b82';
      ctx.fillRect(0, 0, viewWidth, HEIGHT);
    }
  }

  function marker(x, ground, color, active) {
    ctx.fillStyle = '#142228';
    ctx.fillRect(x - 2, ground - 51, 4, 51);
    ctx.fillRect(x - 9, ground - 49, 18, 16);
    ctx.fillStyle = color;
    ctx.fillRect(x - 6, ground - 46, 12, 10);
    ctx.fillStyle = active ? '#fff4bf' : '#173432';
    ctx.fillRect(x - 3, ground - 43, 6, 4);
  }

  function drawTools() {
    if (trail.station) marker(trail.station, trail.platforms[0][1], trail.highlight, !activated);
    if (trail.id === 'rice') {
      for (const [x, y, width] of BRIDGE.slice(0, panels)) {
        ctx.fillStyle = '#233b35';
        ctx.fillRect(x, y, width - 1, 11);
        ctx.fillStyle = '#d0ab69';
        ctx.fillRect(x + 1, y, width - 3, 3);
        ctx.fillStyle = '#72563e';
        ctx.fillRect(x + 5, y + 11, 5, 24);
        ctx.fillRect(x + width - 9, y + 11, 5, 23);
      }
    }
    if (trail.id === 'mountains') {
      const attached = swing?.attached;
      const x = attached ? player.x : 397;
      const y = attached ? player.y - 23 : 203;
      ctx.strokeStyle = '#182732';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ROPE.x, ROPE.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.fillStyle = '#efd9a4';
      ctx.fillRect(ROPE.x - 7, ROPE.y - 5, 14, 10);
      ctx.fillRect(x - 5, y - 2, 10, 4);
    }
    if (trail.target) {
      const [x, y] = trail.target;
      const seed = trail.id === 'rainforest';
      ctx.fillStyle = seed ? '#51362b' : '#172c37';
      ctx.fillRect(x - 14, y + 4, 28, seed ? 13 : 15);
      ctx.fillStyle = activated ? '#9ee197' : seed ? '#c5ab70' : '#a2e9ff';
      ctx.fillRect(x - 9, y - (seed && !activated ? 0 : 8), 18, seed && !activated ? 5 : 14);
      if (seed && activated) {
        ctx.fillRect(x - 1, y - 14, 3, 21);
        ctx.fillRect(x + 1, y - 14, 9, 4);
      }
      if (!activated) {
        marker(580, trail.platforms[seed ? 1 : 0][1], '#f6a992', true);
        ctx.fillStyle = '#26303b';
        ctx.fillRect(586, seed ? 256 : 254, 7, 36);
        ctx.fillRect(568, seed ? 254 : 252, 26, 4);
      }
    }
    for (const shot of effects) {
      ctx.fillStyle = shot.seed ? '#ecf4a8' : '#fff7b6';
      ctx.fillRect(Math.round(shot.x), Math.round(shot.y), shot.seed ? 5 : 13, 4);
    }
  }

  function draw() {
    const desired = clamp(player.x - viewWidth * .36, 0, WORLD_WIDTH - viewWidth);
    camera = reducedMotion ? desired : camera + (desired - camera) * .16;
    if (room) {
      drawBackground(.75, true);
      drawRelay(ctx, viewWidth, room, room.walk && !reducedMotion ? 1 + Math.floor(room.walk / 4) % 3 : 0);
    } else {
      drawBackground(camera / (WORLD_WIDTH - viewWidth), false);
      ctx.save();
      ctx.translate(-Math.round(camera), 0);
      ctx.drawImage(terrain, 0, 0);
      drawTools();
      marker(trail.exit, groundAtExit(), '#9fedb1', true);
      marker(trail.exit + 29, groundAtExit(), '#9fedb1', true);
      ctx.fillStyle = '#172a29';
      ctx.fillRect(trail.exit - 7, groundAtExit() - 61, 43, 9);
      const walking = isHeld('left') || isHeld('right');
      const frame = swing?.attached ? 5 : !player.grounded ? 4 : actionFrame ? 6
        : walking && !reducedMotion ? 1 + Math.floor(ticks / (isHeld('run') ? 5 : 7)) % 3 : 0;
      explorer(ctx, player.x, player.y, frame, player.facing);
      ctx.restore();
    }
    const percent = finished ? 100 : room ? 79 + room.total * 2 : Math.min(99, Math.round(player.x / trail.exit * (trail.id === 'desert' ? 78 : 100)));
    if (meter !== percent) {
      progress.style.width = `${percent}%`;
      meter = percent;
    }
  }

  function animate(time) {
    accumulator += Math.min(60, time - (previous ?? time));
    previous = time;
    while (accumulator >= 1000 / 60) {
      step();
      accumulator -= 1000 / 60;
    }
    draw();
    frameId = requestAnimationFrame(animate);
  }

  const pickerHost = select('[data-trail-picker]');
  if (!onWorkshop) {
    pickerHost.innerHTML = `<label for="adventure-biome">Landscape</label>
      <select id="adventure-biome" aria-label="Landscape">${trails.map(item => `<option value="${item.id}">${item.name}</option>`).join('')}</select>`;
  }
  const picker = pickerHost.querySelector('select');
  if (picker) listen(picker, 'change', () => {
    load(picker.value);
    stage.focus({ preventScroll: true });
  });
  listen(select('[data-trail-back]'), 'click', onBack);
  const skip = select('[data-trail-skip]');
  if (onWorkshop) {
    skip.hidden = false;
    listen(skip, 'click', onWorkshop);
  }

  listen(stage, 'keydown', event => {
    const control = KEY_BINDINGS[event.code];
    if (!control || event.target !== stage || finished) return;
    event.preventDefault();
    if (!pressed.has(event.code)) {
      pressed.set(event.code, control);
      trigger(control);
    }
  });
  listen(window, 'keyup', event => pressed.delete(event.code));
  listen(stage, 'blur', () => {
    for (const key of pressed.keys()) {
      if (typeof key === 'string') pressed.delete(key);
    }
  });
  listen(window, 'blur', () => pressed.clear());
  listen(stage, 'pointerdown', event => {
    if (event.target === canvas) stage.focus({ preventScroll: true });
  });
  for (const button of controls) {
    const control = button.dataset.control;
    listen(button, 'pointerdown', event => {
      if (event.button !== 0 || finished) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      pressed.set(event.pointerId, control);
      trigger(control);
    });
    listen(button, 'lostpointercapture', event => pressed.delete(event.pointerId));
    listen(button, 'pointerup', event => pressed.delete(event.pointerId));
    listen(button, 'pointercancel', event => pressed.delete(event.pointerId));
    listen(button, 'keydown', event => {
      if (!['Space', 'Enter'].includes(event.code)) return;
      event.preventDefault();
      if (!pressed.has(event.code)) {
        pressed.set(event.code, control);
        trigger(control);
      }
    });
    listen(button, 'click', event => {
      if (event.detail === 0) trigger(control);
    });
  }
  load(firstId);
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  resize();
  frameId = requestAnimationFrame(animate);
  stage.focus({ preventScroll: true });

  return () => {
    listeners.abort();
    observer.disconnect();
    cancelAnimationFrame(frameId);
  };
}
