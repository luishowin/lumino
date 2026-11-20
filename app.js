const quests = [
  { id: "gravity", number: "01", symbol: "↓", title: "The Falling Garden", skill: "Gravity", objective: "Use gravity to restore a broken seed lift.", lesson: "Gravity is a pulling force. Near Earth, it draws objects toward the ground. A heavier object has more mass, but without air resistance objects fall with the same acceleration.", blueprint: "Anchor boots", challenge: "Jump through the collapsed garden and reach the Lumen relay.", question: "Near Earth, which way does gravity pull?", answers: ["Toward the ground", "Toward the Sun", "Away from every object"], correct: 0 },
  { id: "friction", number: "02", symbol: "≋", title: "The Glassway", skill: "Friction", objective: "Give the transit track enough grip to carry power.", lesson: "Friction is a force that resists surfaces sliding past each other. Rougher surfaces usually create more friction than smooth ones.", blueprint: "Grip treads", challenge: "Cross the slick glassway using carefully placed grip pads.", question: "Which surface usually creates the most friction?", answers: ["Rough rubber", "Polished ice", "Oiled glass"], correct: 0 },
  { id: "mass", number: "03", symbol: "◆", title: "The Loadworks", skill: "Mass & force", objective: "Calibrate a cargo crane for a heavy power cell.", lesson: "Mass is the amount of matter in an object. The more mass an object has, the more force is needed to change its motion by the same amount.", blueprint: "Pulse hauler", challenge: "Use the crane route to guide a power cell to its socket.", question: "Which needs more force to accelerate equally?", answers: ["A heavier cargo cell", "A lighter cargo cell", "They need the same"], correct: 0 },
  { id: "balance", number: "04", symbol: "↔", title: "The Quiet Bridge", skill: "Balanced forces", objective: "Steady the bridge before the wind machine wakes.", lesson: "Balanced forces are equal in size and opposite in direction. They create no change in an object's motion. Unbalanced forces change speed or direction.", blueprint: "Stability field", challenge: "Balance the bridge relays and open the observatory route.", question: "What happens when forces are balanced?", answers: ["Motion does not change", "The object must speed up", "The object must turn"], correct: 0 },
  { id: "machines", number: "05", symbol: "⚙", title: "The First Machine", skill: "Momentum & machines", objective: "Rebuild the final relay using motion and mechanical advantage.", lesson: "Momentum depends on mass and velocity. Simple machines, such as levers and pulleys, can change the size or direction of a force to make work easier.", blueprint: "Lumen lever", challenge: "Restore the central relay and bring the workshop back online.", question: "Which is a simple machine?", answers: ["A lever", "A battery", "A lamp"], correct: 0 }
];

const state = JSON.parse(localStorage.getItem("lumino-progress") || "{\"unlocked\":1,\"complete\":[]}");
let selectedQuest = quests[0];
const $ = (selector) => document.querySelector(selector);
const views = ["home-view", "lesson-view", "game-view"];

function save() { localStorage.setItem("lumino-progress", JSON.stringify(state)); }
function showView(id) { views.forEach((view) => $("#" + view).classList.toggle("active", view === id)); window.scrollTo({ top: 0, behavior: "smooth" }); }
function toast(message) { const element = $("#toast"); element.textContent = message; element.classList.add("show"); window.setTimeout(() => element.classList.remove("show"), 2800); }
function updateProgress() { const finished = state.complete.length; $("#progress-label").textContent = `${Math.min(finished + 1, 5)} / 5 quests restored`; }

function renderQuests() {
  $("#quest-grid").innerHTML = quests.map((quest, index) => {
    const complete = state.complete.includes(quest.id);
    const unlocked = index < state.unlocked;
    return `<button class="quest-card" data-quest="${quest.id}" ${unlocked ? "" : "disabled"}><span class="quest-index">QUEST ${quest.number}</span><span class="quest-symbol">${complete ? "✦" : quest.symbol}</span><h3>${quest.title}</h3><p>${quest.skill}</p><span class="quest-state">${complete ? "RESTORED" : unlocked ? "READY TO REPAIR" : "SIGNAL LOCKED"}</span></button>`;
  }).join("");
  document.querySelectorAll("[data-quest]").forEach((button) => button.addEventListener("click", () => openLesson(quests.find((quest) => quest.id === button.dataset.quest))));
}

function openLesson(quest) {
  selectedQuest = quest;
  $("#lesson-view").innerHTML = `<div class="lesson-shell"><div class="lesson-top"><button class="text-button" id="back-home">← Workshop map</button><span>QUEST ${quest.number} · ${quest.skill.toUpperCase()}</span></div><div class="lesson-grid"><div><p class="eyebrow">REPAIR BRIEF</p><h1 class="lesson-title">${quest.title}</h1><p class="lesson-copy">${quest.objective}</p><p class="lesson-copy">${quest.lesson}</p><div class="blueprint"><strong>Blueprint reward:</strong> ${quest.blueprint}. Complete the expedition and check your understanding to add it to the workshop.</div><div class="lesson-actions"><button class="primary-button" id="start-challenge">Start repair expedition</button><button class="secondary-button" id="home-button">Save for later</button></div></div><aside class="concept-panel"><p class="eyebrow">FORCE FIELD TEST</p><h3>Change the input</h3><p>Move the dial to see how a stronger force changes the workshop readout.</p><input id="force-slider" type="range" min="1" max="10" value="4" aria-label="Force input"/><div class="concept-value"><span id="force-value">4</span> N</div><div class="formula">force input → brighter relay</div></aside></div></div>`;
  $("#back-home").onclick = () => showView("home-view"); $("#home-button").onclick = () => showView("home-view");
  $("#force-slider").oninput = (event) => $("#force-value").textContent = event.target.value;
  $("#start-challenge").onclick = startGame;
  showView("lesson-view");
}

let animationFrame; let keys = { left:false, right:false, jump:false };
function startGame() { $("#game-title").textContent = `QUEST ${selectedQuest.number}: ${selectedQuest.title}`; showView("game-view"); cancelAnimationFrame(animationFrame); runGame(); }
function runGame() {
  const canvas = $("#game-canvas"), ctx = canvas.getContext("2d");
  const platforms = [{x:0,y:465,w:270,h:75},{x:350,y:390,w:150,h:18},{x:580,y:320,w:150,h:18},{x:790,y:245,w:110,h:18}];
  const player = {x:70,y:410,w:25,h:34,vx:0,vy:0,onGround:false}; const target = {x:835,y:190,w:28,h:55}; let complete = false;
  function rect(a,b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
  function draw() {
    ctx.clearRect(0,0,960,540); const sky = ctx.createLinearGradient(0,0,0,540); sky.addColorStop(0,"#6ac4bf"); sky.addColorStop(.55,"#245969"); sky.addColorStop(1,"#0b202c"); ctx.fillStyle=sky; ctx.fillRect(0,0,960,540);
    ctx.fillStyle="rgba(255,240,150,.9)"; ctx.beginPath();ctx.arc(700,92,56,0,Math.PI*2);ctx.fill(); ctx.fillStyle="rgba(255,246,176,.17)";ctx.fillRect(0,110,960,2);
    ctx.fillStyle="#163846"; [100,210,510,740].forEach((x,i)=>ctx.fillRect(x,210+i%2*35,55,260)); ctx.fillStyle="#0b1d28"; ctx.fillRect(0,480,960,60);
    platforms.forEach((platform)=>{ctx.fillStyle="#102c35";ctx.fillRect(platform.x,platform.y,platform.w,platform.h);ctx.fillStyle="#65f6c1";ctx.fillRect(platform.x,platform.y,platform.w,4);});
    ctx.fillStyle="#ffd45b";ctx.fillRect(target.x,target.y,target.w,target.h);ctx.fillStyle="#fff3ad";ctx.fillRect(target.x+7,target.y+8,14,35); ctx.fillStyle="#ff7165";ctx.fillRect(player.x,player.y,player.w,player.h);ctx.fillStyle="#ffe8b2";ctx.fillRect(player.x+3,player.y-10,20,14);
    ctx.fillStyle="#e8f4e9";ctx.font="bold 15px system-ui";ctx.fillText("LUMEN RELAY", target.x-22,target.y-12);
  }
  function tick() {
    if (complete) return; player.vx = keys.left ? -4.4 : keys.right ? 4.4 : 0; if (keys.jump && player.onGround) { player.vy=-11; player.onGround=false; } keys.jump=false; player.vy+=.52; player.x+=player.vx; player.y+=player.vy; player.x=Math.max(0,Math.min(935,player.x)); player.onGround=false;
    platforms.forEach((platform)=>{ if (rect(player,platform) && player.vy>=0 && player.y+player.h-player.vy<=platform.y+4) { player.y=platform.y-player.h;player.vy=0;player.onGround=true; } });
    if (player.y>560) { player.x=70;player.y=410;player.vy=0; }
    draw(); if (rect(player,target)) { complete=true; cancelAnimationFrame(animationFrame); openCheck(); return; } animationFrame=requestAnimationFrame(tick);
  } tick();
}
function openCheck() {
  const quest=selectedQuest; $("#lesson-view").innerHTML=`<div class="lesson-shell"><div class="lesson-top"><span>RELAY ONLINE</span><span>QUEST ${quest.number}</span></div><div class="lesson-grid"><div><p class="eyebrow">REPAIR COMPLETE</p><h1 class="lesson-title">You reached the relay.</h1><p class="lesson-copy">Now make the idea yours. Answer one quick recall question to add <strong>${quest.blueprint}</strong> to your workshop.</p><div class="lesson-actions" id="answers">${quest.answers.map((answer,index)=>`<button class="secondary-button" data-answer="${index}">${answer}</button>`).join("")}</div></div><aside class="concept-panel"><p class="eyebrow">YOUR NEW BLUEPRINT</p><h3>${quest.blueprint}</h3><p>Knowledge made practical: this repair tool will become part of the world you restore.</p></aside></div></div>`; document.querySelectorAll("[data-answer]").forEach(button=>button.onclick=()=>checkAnswer(Number(button.dataset.answer))); showView("lesson-view"); }
function checkAnswer(answer) { if(answer !== selectedQuest.correct) { toast("Not quite — revisit the repair brief and try again."); return; } if(!state.complete.includes(selectedQuest.id)) state.complete.push(selectedQuest.id); const index=quests.indexOf(selectedQuest); state.unlocked=Math.max(state.unlocked,Math.min(index+2,quests.length)); save(); updateProgress(); renderQuests(); toast(`${selectedQuest.blueprint} added to the workshop!`); window.setTimeout(()=>showView("home-view"),900); }

$("#continue-button").onclick=()=>openLesson(quests[Math.min(state.unlocked-1,quests.length-1)]); $("#back-to-lesson").onclick=()=>{cancelAnimationFrame(animationFrame);openLesson(selectedQuest);}; $("#reset-progress").onclick=()=>{if(confirm("Reset all Lumino progress stored on this device?")){state.unlocked=1;state.complete=[];save();updateProgress();renderQuests();toast("Workshop progress reset.");}};
window.addEventListener("keydown",(event)=>{if(["ArrowLeft","ArrowRight","ArrowUp"," "].includes(event.key))event.preventDefault(); if(event.key==="ArrowLeft")keys.left=true;if(event.key==="ArrowRight")keys.right=true;if(event.key==="ArrowUp"||event.key===" ")keys.jump=true;}); window.addEventListener("keyup",(event)=>{if(event.key==="ArrowLeft")keys.left=false;if(event.key==="ArrowRight")keys.right=false;}); document.querySelectorAll("[data-key]").forEach(button=>{const key=button.dataset.key;button.addEventListener("pointerdown",()=>{keys[key]=true;});button.addEventListener("pointerup",()=>{if(key!=="jump")keys[key]=false;});button.addEventListener("pointerleave",()=>{if(key!=="jump")keys[key]=false;});});
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js")); updateProgress(); renderQuests();
