function makeExplorerFrames() {
  const poses = [
    [[7, 17, 6, 22], [12, 17, 13, 22], [5, 12, 5, 17], [14, 12, 15, 17]],
    [[7, 17, 4, 21], [12, 17, 16, 21], [5, 12, 3, 14], [14, 12, 16, 16]],
    [[7, 17, 9, 21], [12, 17, 10, 22], [5, 12, 5, 16], [14, 12, 14, 16]],
    [[7, 17, 4, 22], [12, 17, 16, 20], [5, 12, 3, 16], [14, 12, 17, 13]],
    [[7, 17, 5, 20], [12, 17, 16, 18], [5, 12, 3, 10], [14, 12, 16, 9]],
    [[7, 17, 5, 22], [12, 17, 15, 21], [5, 12, 6, 5], [14, 12, 12, 5]],
    [[7, 17, 5, 22], [12, 17, 14, 22], [5, 12, 6, 16], [14, 12, 18, 12]],
  ];
  return poses.map(pose => {
    const sprite = document.createElement('canvas');
    sprite.width = 20;
    sprite.height = 24;
    const ctx = sprite.getContext('2d');

    function limb([x, y, ex, ey], color, thickness) {
      const steps = Math.max(Math.abs(ex - x), Math.abs(ey - y));
      ctx.fillStyle = color;
      for (let step = 0; step <= steps; step++) {
        ctx.fillRect(Math.round(x + (ex - x) * step / steps) - 1,
          Math.round(y + (ey - y) * step / steps), thickness, 2);
      }
    }

    ctx.fillStyle = '#15232a';
    ctx.fillRect(4, 9, 12, 9);
    ctx.fillRect(6, 3, 9, 8);
    ctx.fillRect(4, 2, 12, 3);
    ctx.fillRect(3, 5, 14, 2);
    ctx.fillStyle = '#974036';
    ctx.fillRect(4, 11, 4, 7);
    ctx.fillStyle = '#245153';
    ctx.fillRect(8, 12, 6, 5);
    ctx.fillStyle = '#ffad63';
    ctx.fillRect(6, 3, 8, 2);
    ctx.fillRect(4, 5, 12, 2);
    ctx.fillStyle = '#f0bb8a';
    ctx.fillRect(10, 7, 4, 3);
    ctx.fillStyle = '#172626';
    ctx.fillRect(13, 7, 1, 1);
    ctx.fillStyle = '#f36550';
    ctx.fillRect(6, 10, 8, 2);
    ctx.fillRect(4, 11, 4, 1);
    pose.forEach((part, index) => limb(part, index < 2 ? '#182934' : '#24494b', 3));
    ctx.fillStyle = '#ffd184';
    ctx.fillRect(pose[3][2], pose[3][3], 2, 2);
    return sprite;
  });
}

let explorerFrames;
export function explorer(ctx, x, y, frame, facing, scale = 1.5) {
  explorerFrames ||= makeExplorerFrames();
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(facing, 1);
  ctx.drawImage(explorerFrames[frame], -10 * scale, -24 * scale, 20 * scale, 24 * scale);
  ctx.restore();
}

function noise(seed) {
  const value = Math.sin(seed * 294.37) * 49785.78;
  return value - Math.floor(value);
}

function bank(ctx, x, y, width, depth, hue, city) {
  ctx.fillStyle = '#0a151b';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  if (city) {
    ctx.lineTo(x + width, y + depth);
    ctx.lineTo(x, y + depth);
  } else {
    const ledge = Math.min(23, width * .16);
    ctx.lineTo(x + width - 4, y + 12);
    ctx.lineTo(x + width - 4, y + 19);
    ctx.lineTo(x + width - ledge, y + 30);
    ctx.lineTo(x + width - ledge - 8, y + depth);
    ctx.lineTo(x + ledge + 8, y + depth);
    ctx.lineTo(x + ledge, y + 32);
    ctx.lineTo(x + 5, y + 18);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#15232b';
  ctx.fillRect(x + 2, y + 4, width - 4, 4);
  for (let offset = 4; offset < width - 3; offset += 5) {
    const seed = x + offset;
    const height = Math.round(noise(seed) * 7);
    ctx.fillStyle = hue;
    ctx.globalAlpha = .40 + .48 * noise(seed + .8);
    ctx.fillRect(x + offset, y - (city ? 0 : height), 2 + height % 3, 2);
    ctx.globalAlpha = 1;
    if (offset > 30 && offset < width - 32) {
      ctx.fillStyle = noise(seed + 3) > .5 ? '#13262d' : '#101f26';
      ctx.fillRect(x + offset, y + 8 + height * 3, 5, Math.min(depth - 10, 4 + height * 2));
    }
  }
}

function foliage(ctx, x, y, size, tint) {
  ctx.fillStyle = '#0b191b';
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x + 2, y - size * .72);
  ctx.lineTo(x - size * .27, y - size);
  ctx.lineTo(x + 12, y - size * .78);
  ctx.lineTo(x + size * .3, y - size);
  ctx.lineTo(x + 12, y - size * .63);
  ctx.lineTo(x + 5, y);
  ctx.fill();
  for (const [dx, dy, spread] of [[-.23, -.96, .3], [.02, -.9, .31], [.22, -.96, .28], [.34, -1.01, .26]]) {
    const crownX = x + dx * size;
    const crownY = y + dy * size;
    for (let patch = 0; patch < 22; patch++) {
      const seed = crownX + patch;
      const cx = crownX + (noise(seed) - .5) * size * spread;
      const cy = crownY + (noise(seed + 102) - .5) * size * .2;
      ctx.fillStyle = patch % 7 === 0 ? tint : '#0b191b';
      if (patch % 7 === 0) ctx.globalAlpha = .6;
      ctx.fillRect(Math.round(cx), Math.round(cy), patch % 7 === 0 ? 5 : 17, patch % 7 === 0 ? 2 : 10);
      ctx.globalAlpha = 1;
    }
  }
}

export function makeTerrain(trail) {
  const layer = document.createElement('canvas');
  layer.width = 1800;
  layer.height = 421;
  const ctx = layer.getContext('2d');
  for (const [x, y, width] of trail.platforms) {
    const city = trail.id === 'city';
    bank(ctx, x, y, width, layer.height - y, trail.highlight, city);
    for (let offset = 22; offset < width - 18; offset += 24) {
      const seed = x + offset;
      if (city) {
        ctx.fillStyle = '#1b303b';
        ctx.fillRect(seed, y - 12, 2, 12);
        ctx.fillRect(seed - 9, y - 12, Math.min(24, width - offset + 9), 2);
        if (noise(seed) > .6) {
          ctx.fillStyle = '#f2a46d';
          ctx.fillRect(seed + 2, y + 15, 7, 5);
        }
      } else if (trail.id === 'mountains' || trail.id === 'desert') {
        const radius = 3 + Math.floor(noise(seed) * 10);
        ctx.fillStyle = '#17282d';
        ctx.fillRect(seed - radius, y - 3, radius * 2, 4);
        ctx.fillRect(seed - radius + 2, y - 6, radius + 2, 4);
        ctx.fillStyle = trail.highlight;
        ctx.fillRect(seed - radius + 2, y - 6, radius, 1);
      } else {
        ctx.fillStyle = '#14271f';
        for (let blade = 0; blade < 4; blade++) {
          const height = 4 + Math.floor(noise(seed + blade) * 8);
          ctx.fillRect(seed + blade * 3, y - height, 2, height);
          ctx.fillRect(seed + blade * 3 - 2, y - height, 2, 2);
        }
      }
    }
  }
  const ground = trail.platforms[0][1];
  if (['wheat', 'rice', 'rainforest'].includes(trail.id)) {
    foliage(ctx, 7, ground, trail.id === 'rainforest' ? 196 : 151, trail.highlight);
    foliage(ctx, 1680, 308, 140, trail.highlight);
  }
  if (trail.id === 'desert' || trail.id === 'mountains') {
    ctx.fillStyle = '#101c26';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(225, 0);
    ctx.lineTo(178, 19);
    ctx.lineTo(131, 21);
    ctx.lineTo(108, 42);
    ctx.lineTo(64, 49);
    ctx.lineTo(49, 83);
    ctx.lineTo(0, 112);
    ctx.fill();
  }
  return layer;
}

const GRID = 7;
export const relayTile = [5, 1];
export const cellTiles = [[1, 2, 3], [4, 4, 4]];
export const rockTiles = [[0, 0], [2, 0], [6, 0], [0, 5], [5, 5], [6, 3], [3, 2], [2, 5]];
export const sameTile = ([x, y], [a, b]) => x === a && y === b;
export const openTile = tile => tile.every(value => value >= 0 && value < GRID)
  && !rockTiles.some(rock => sameTile(tile, rock));

function diamond(ctx, x, y, sx, sy, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - sy);
  ctx.lineTo(x + sx, y);
  ctx.lineTo(x, y + sy);
  ctx.lineTo(x - sx, y);
  ctx.closePath();
  ctx.fill();
}

export function drawRelay(ctx, viewWidth, room, frame) {
  const sx = viewWidth < 600 ? 24 : 29;
  const sy = sx / 2;
  const project = (x, y) => [viewWidth / 2 + (x - y) * sx, 79 + (x + y) * sy];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const [px, py] = project(x, y);
      if (x === GRID - 1 || y === GRID - 1) {
        diamond(ctx, px, py + 18, sx, sy + 1, '#8c432e');
        diamond(ctx, px, py + 11, sx, sy + 1, x === GRID - 1 ? '#c27043' : '#a8583c');
      }
      diamond(ctx, px, py, sx, sy + 1, ['#ffc776', '#f7b667', '#ffcb82'][(x + 2 * y) % 3]);
      for (let pebble = 0; pebble < 4; pebble++) {
        ctx.fillStyle = '#e69d56';
        ctx.fillRect(px - 10 + noise(x * 7 + pebble) * 20, py - 4 + noise(y * 9 + pebble) * 9, 2, 1);
      }
    }
  }

  const objects = [
    ...rockTiles.map(tile => ({ tile, kind: 'rock' })),
    ...cellTiles.filter((_, index) => !room.collected.has(index)).map(tile => ({ tile, kind: 'cell' })),
    { tile: relayTile, kind: 'relay' },
    { tile: room.position.map((coordinate, index) => coordinate
      + (room.from[index] - coordinate) * room.walk / 8), kind: 'explorer' },
  ].sort((a, b) => a.tile[0] + a.tile[1] - b.tile[0] - b.tile[1]);

  for (const { tile, kind } of objects) {
    const [x, y] = project(...tile);
    diamond(ctx, x, y + 2, 12, 6, '#ad673d');
    if (kind === 'explorer') {
      explorer(ctx, x, y + 3, frame, room.facing, 1.45);
    } else if (kind === 'rock') {
      ctx.fillStyle = '#50643c';
      ctx.fillRect(x - 7, y - 25, 14, 26);
      ctx.fillRect(x - 13, y - 17, 6, 9);
      ctx.fillRect(x + 7, y - 13, 7, 7);
      ctx.fillStyle = '#8b9a50';
      ctx.fillRect(x - 4, y - 27, 4, 26);
      ctx.fillRect(x + 2, y - 24, 2, 20);
    } else if (kind === 'cell') {
      ctx.fillStyle = '#183d40';
      ctx.fillRect(x - 10, y - 13, 20, 14);
      ctx.fillStyle = '#ffe99b';
      const count = tile[2];
      for (let cell = 0; cell < count; cell++) ctx.fillRect(x - 7 + cell * 4, y - 10, 2, 8);
    } else {
      ctx.fillStyle = '#4f3b48';
      ctx.fillRect(x - 13, y - 11, 26, 13);
      ctx.fillStyle = '#534757';
      ctx.fillRect(x - 7, y - 39, 14, 29);
      ctx.fillRect(x - 12, y - 43, 24, 9);
      ctx.fillStyle = room.collected.size === cellTiles.length ? '#9aefac' : '#e4ab72';
      ctx.fillRect(x - 8, y - 40, 16, 3);
    }
  }
}
