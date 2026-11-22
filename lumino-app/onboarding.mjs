export function mountOnboarding(host, preferences, { onTutor, onSubject, onLevel, onFinish }) {
  const controller = new AbortController();
  const { signal } = controller;
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<link rel="stylesheet" href="./onboarding.css?v=44">
<div class="story" id="story" role="region" aria-label="Welcome to Lumino">
  <div class="specks" aria-hidden="true"></div>
  <div class="top"><div class="bars" id="bars" aria-hidden="true"></div></div>
  <div class="col" id="col">
    <div class="slide" id="slide"></div>
    <p class="hint" id="hint"></p>
  </div>
  <div class="ground" aria-hidden="true"></div>
</div>
<section class="flow" id="flow" hidden aria-label="Set up your learning">
  <div class="specks" aria-hidden="true"></div>
  <div class="fl-top"><button class="back" id="flback" type="button" aria-label="Back">←</button></div>
  <div class="fl-body" id="flbody"></div>
  <div class="fl-foot" id="flfoot"></div>
</section>
<div class="sr" id="live" aria-live="polite"></div>`;

  var ICONS={flame:"../assets/ui-icons/flame.webp",star:"../assets/ui-icons/star.webp",trophy:"../assets/ui-icons/trophy.webp"};
  var SUBJECTS=[
    {id:"math",name:"Mathematics",img:"../assets/ui-icons/math.webp"},{id:"physics",name:"Physics",img:"../assets/ui-icons/physics.webp"},
    {id:"chemistry",name:"Chemistry",img:"../assets/ui-icons/chemistry.webp"},{id:"biology",name:"Biology",img:"../assets/ui-icons/biology.webp"},{id:"english",name:"English",img:"../assets/ui-icons/english.webp"}];
  var LEVELS=[{id:"beginner",name:"Absolute beginner"},{id:"beginner-plus",name:"Beginner plus"},{id:"intermediate",name:"Intermediate"},{id:"advanced",name:"Senior"}];
  var EXPECT={
    math:["Counting, place value and the four operations.","Fractions, decimals, percentages and simple equations.","Algebra, graphs, geometry and ratio.","Functions, trigonometry and exam-style problems."],
    physics:["Everyday forces, energy and simple measurement.","Speed, motion graphs, density and pressure.","Forces and motion, energy, waves and basic electricity.","Exam-style problems on mechanics, circuits and heat."],
    chemistry:["States of matter, mixtures and the particle model.","Atoms, elements, compounds and simple reactions.","Bonding, the periodic table, acids and bases.","Reaction rates, energy changes, organic chemistry and calculations."],
    biology:["Living things, cells and what plants and animals need.","Organs, nutrition and how ecosystems work.","Enzymes, transport, respiration and inheritance.","Exam-style problems on genetics, homeostasis and experiments."],
    english:["Reading short texts and writing clear sentences.","Paragraphs, spelling, punctuation and comprehension.","Summaries, descriptive and argument writing, language effects.","Exam-style reading and writing: analysis, evidence and persuasion."]
  };
  var TUTORS={
    charles:{name:'Charles',tag:'Relaxed and practical',stay:'Glad to stay. I like to keep things relaxed and practical.',end:'Build a streak, earn trophies and see how your XP compares in the sample league. I’ll keep it relaxed and practical.'},
    linda:{name:'Linda',tag:'Clear and structured',stay:'Happy to take over. I like things clear and in order.',end:'Build a streak, earn trophies and see how your XP compares in the sample league. I’ll keep everything clear and in order.'}
  };
  var P={'.':null,h:'#1B1311',s:'#8A5230',b:'#2A1C16',m:'#6AF4BF',y:'#FFE135',p:'#2B3F52',k:'#0C1217',Y:'#C9AC00',e:'#1B1311'};
  var SP={
    hero:['..hhhhhh..','.hhhhhhhh.','.hssssssh.','.hsessesh.','.hssssssh.','..mmmmmm..','.smmmmmms.','.smyyyyms.','.smmmmmms.','..pppppp..','..pp..pp..','..kk..kk..'],
    lantern:['..kk..','.kkkk.','kyyyyk','kyYYyk','kyyyyk','kyYYyk','kyyyyk','.kkkk.','..kk..']
  };
  function sprite(name,scale){
    var rows=SP[name],w=Math.max.apply(null,rows.map(function(r){return r.length}));
    var c=document.createElement('canvas');c.width=w;c.height=rows.length;c.className='px';
    c.style.width=w*scale+'px';c.style.height=rows.length*scale+'px';c.setAttribute('aria-hidden','true');
    var x=c.getContext('2d');
    rows.forEach(function(r,y){for(var i=0;i<r.length;i++){var col=P[r[i]];if(col){x.fillStyle=col;x.fillRect(i,y,1,1)}}});
    return c;
  }
  function img(n,w,h){return '<img src="'+ICONS[n]+'" alt="" width="'+w+'" height="'+h+'">'}

  var steps='<ol class="steps">'+
    '<li><span class="num" aria-hidden="true">1</span><div><h2>Learn the idea</h2><p>A short, clear explanation from your tutor.</p></div></li>'+
    '<li><span class="num" aria-hidden="true">2</span><div><h2>Put it to work</h2><p>Apply what you learned to a challenge in your subject.</p></div></li>'+
    '<li><span class="num" aria-hidden="true">3</span><div><h2>Lock it in</h2><p>A quick recall check so it sticks.</p></div></li></ol>';

  // Charles introduces Lumino. The selected tutor delivers the final story.
  var slides=[
    {head:'Hi, I’m Charles.',pose:'greeting',dur:6000,say:'I’ll be right next to you while you learn. Give me a minute and I’ll show you how Lumino works.'},
    {head:'Build your way through this.',pose:'explaining',dur:6500,visual:'<div class="cast"><span data-sprite="hero" class="bob"></span><span data-sprite="lantern"></span></div>',
      say:'Learn an idea with me, then put it to work. Try a lesson, or explore a trail and build a way across.'},
    {head:'How you learn here',pose:'thinking',dur:7500,visual:steps,say:'Same three steps every time. Simple on purpose.'},
    {head:'I explain ideas step by step.',pose:'explaining',dur:5500,visual:'<div class="ex"><span>3x + 5 = 20</span><span>3x = 15</span><span>x = 5</span></div>',
      say:'Short and clear. If a step doesn’t land, say so and I’ll try another way.'},
    {head:'We try ideas together.',pose:'thinking',dur:5500,visual:'<div class="blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>',
      say:'We start with a small challenge. I’ll nudge, you do the thinking.'},
    {head:'Then you play it out.',pose:'explaining',dur:6500,
      visual:'<div class="sandbox" aria-hidden="true"><div class="land a"></div><div class="land b"></div><i class="plank"></i><i class="plank"></i><i class="plank"></i><i class="plank"></i><span class="hero" data-sprite="hero" data-scale="4"></span><span class="goal" data-sprite="lantern" data-scale="4"></span></div>',
      say:'Take what you just learned into a sandbox game and use it to solve a problem. Build it, test it, fix it.'},
    {head:'Then I check what stuck.',pose:'encouraging',dur:5500,visual:'<div class="icons">'+img('star',60,56)+img('star',60,56)+img('star',60,56)+'</div>',
      say:'A quick recall check locks it in. After that, we go further.'},
    {gate:true,kind:'choose',head:'Pick your tutor',pose:'explaining'},
    {gate:true,kind:'final',head:'A little every day',pose:'encouraging',
      visual:'<div class="icons">'+img('flame',48,58)+img('trophy',60,52)+img('star',56,52)+'</div>'}
  ];

  var $=function(s){return root.querySelector(s)};
  var story=$('#story'),col=$('#col'),slideEl=$('#slide'),hintEl=$('#hint'),barsEl=$('#bars'),live=$('#live');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  var S={idx:0,elapsed:0,held:false,kpause:false,tutor:'charles',touched:false,flow:false,step:'subject',subject:null,level:null};
  var flow=$('#flow'),flBody=$('#flbody'),flFoot=$('#flfoot'),flBack=$('#flback'),timers=[];

  barsEl.innerHTML=slides.map(function(){return '<i><b></b></i>'}).join('');
  var fills=[].slice.call(barsEl.querySelectorAll('b'));

  function portrait(who,pose){return '<span class="portrait '+who+' pose-'+pose+'" aria-hidden="true"></span>'}
  function dialogue(who,pose,say,cta){
    return '<div class="dialogue">'+portrait(who,pose)+'<div class="panel"><span class="who">'+TUTORS[who].name+'</span><p>'+say+'</p></div></div>';
  }
  function chooseTop(){
    var rows=['charles','linda'].map(function(id){
      return '<button type="button" class="pick" data-tutor="'+id+'" aria-pressed="'+(S.tutor===id)+'"><span class="thumb '+id+'" aria-hidden="true"></span>'+
        '<span><b>'+TUTORS[id].name+'</b><small>'+TUTORS[id].tag+'</small></span></button>';
    }).join('');
    return '<div class="choices" role="group" aria-label="Tutor">'+rows+'</div>'+
      '<button type="button" class="cta" id="cta" data-act="continue">Continue with '+TUTORS[S.tutor].name+'</button>';
  }

  function render(){
    var s=slides[S.idx],who='charles',say,top='';
    if(s.kind==='choose'){
      who=S.touched?S.tutor:'charles';
      say=S.touched?TUTORS[S.tutor].stay:'Before we start, do you want to keep going with me, or switch to Linda? You can switch any time during a lesson.';
      top=chooseTop();
    }else if(s.kind==='final'){
      who=S.tutor;say=TUTORS[who].end;
      top=s.visual+'<button type="button" class="cta" id="cta" data-act="finish">Let’s go</button>';
    }else{say=s.say;top=s.visual||''}
    slideEl.className='slide'+(!s.visual&&!s.gate?' solo':'');
    slideEl.innerHTML='<div class="slide-top"><h1 class="hd">'+s.head+'</h1>'+top+'</div>'+dialogue(who,s.pose,say);
    [].forEach.call(slideEl.querySelectorAll('[data-sprite]'),function(n){n.replaceChildren(sprite(n.dataset.sprite,+n.dataset.scale||9))});
    live.textContent='Story '+(S.idx+1)+' of '+slides.length+': '+s.head+' '+say;
    paintHint();paint();
  }

  function hintText(){
    var s=slides[S.idx];
    if(S.held||S.kpause)return 'Paused';
    if(s.kind==='choose')return 'Pick a tutor to continue. Tap the left edge to go back.';
    if(s.kind==='final')return 'Tap the left edge to go back.';
    return 'Tap right for next, left for back. Hold to pause.';
  }
  function paintHint(){hintEl.textContent=hintText();story.classList.toggle('is-held',S.held||S.kpause)}

  function paint(){
    var s=slides[S.idx];
    fills.forEach(function(b,i){
      var v=i<S.idx?1:i>S.idx?0:(!s.dur||reduce.matches||preferences.reduceMotion)?1:S.elapsed/s.dur;
      b.style.transform='scaleX('+Math.min(1,v)+')';
    });
  }

  function go(i){
    if(i>=slides.length){startFlow();return}
    S.idx=Math.max(0,i);S.elapsed=0;render();
  }
  function nudge(){
    var c=$('#cta');if(!c)return;c.classList.remove('nudge');void c.offsetWidth;c.classList.add('nudge');
  }
  function next(){if(slides[S.idx].gate)nudge();else go(S.idx+1)}
  function prev(){go(S.idx-1)}
  function clearTimers(){timers.forEach(clearTimeout);timers=[]}
  function later(fn,ms){timers.push(setTimeout(fn,ms))}
  function startFlow(){S.flow=true;S.step='subject';story.hidden=true;flow.hidden=false;flowRender()}
  function backToStories(){clearTimers();S.flow=false;flow.hidden=true;story.hidden=false;S.idx=slides.length-1;S.elapsed=0;render()}
  function subj(){return SUBJECTS.filter(function(x){return x.id===S.subject})[0]}
  function lvl(){return LEVELS.filter(function(x){return x.id===S.level})[0]}
  var CHECK='<svg viewBox="0 0 7 6" shape-rendering="crispEdges" aria-hidden="true"><path fill="#06131A" d="M0 3h1v1h1v1h1V4h1V3h1V2h1V1h1v1H6v1H5v1H4v1H3v1H2V5H1V4H0z"/></svg>';

  function flowRender(){
    clearTimers();
    var t=TUTORS[S.tutor],body='',foot='',title='';
    flBack.hidden=!(S.step==='subject'||S.step==='level');
    if(S.step==='subject'){
      title='What would you like to learn first?';
      body='<h1 class="hd">'+title+'</h1><p class="fine">You can add the other subjects later.</p><div class="choices" role="group" aria-label="Subject">'+
        SUBJECTS.map(function(x,i){return '<button type="button" class="pick" style="--i:'+i+'" data-subject="'+x.id+'" aria-pressed="'+(S.subject===x.id)+'"><img class="sub-ic" src="'+x.img+'" alt=""><b>'+x.name+'</b></button>'}).join('')+'</div>';
    }else if(S.step==='level'){
      title='What’s your level in '+subj().name+'?';
      body='<h1 class="hd">'+title+'</h1><div class="choices" role="group" aria-label="Level">'+
        LEVELS.map(function(x,i){return '<button type="button" class="pick level" style="--i:'+i+'" data-level="'+x.id+'" aria-pressed="'+(S.level===x.id)+'"><span><b>'+x.name+'</b><small class="muted">'+EXPECT[S.subject][i]+'</small></span></button>'}).join('')+'</div>';
      foot='<p class="fine">Not sure? Pick the closest one. You can change it any time.</p>';
    }else if(S.step==='prep'){
      title='Preparing your lessons';
      var items=['Mapping '+subj().name+' topics','Matching them to your level','Lining up your first lesson'];
      body='<h1 class="hd">'+title+'</h1><ul class="checks" id="checks">'+items.map(function(x){return '<li><span class="tick">'+CHECK+'</span>'+x+'</li>'}).join('')+'</ul>'+
        '<div class="seg" id="seg" aria-hidden="true">'+new Array(11).join('<i></i>')+'</div>'+
        dialogue(S.tutor,'thinking','Give me a moment. I’m putting your first lessons together.');
    }else{
      title='Plan is set';
      body='<h1 class="hd">'+title+'</h1><div class="plan"><div class="plan-head"><img class="sub-ic" src="'+subj().img+'" alt=""><div><b>'+subj().name+'</b><small>'+lvl().name+'</small></div></div>'+
        '<ul><li>Your first lesson is ready.</li><li>Learn the idea, put it to work, then a quick recall check.</li><li>Finish a lesson to start your streak.</li></ul>'+
        '<div class="plan-tutor"><span class="thumb '+S.tutor+'" aria-hidden="true"></span>With '+t.name+'</div></div>';
      foot='<button type="button" class="cta banana" data-act="start"><img src="'+ICONS.flame+'" alt="">Start now and get a free streak recharge</button><button type="button" class="textbtn" data-act="skip">Skip to home screen</button>';
    }
    flBody.innerHTML=body;flFoot.innerHTML=foot;flBody.scrollTop=0;
    live.textContent=title;
    if(S.step==='prep')runPrep();
  }

  function runPrep(){
    var lis=[].slice.call(flBody.querySelectorAll('#checks li')),segs=[].slice.call(flBody.querySelectorAll('#seg i'));
    segs.forEach(function(el,i){later(function(){el.classList.add('on')},350+i*400)});
    lis.forEach(function(el,i){later(function(){el.classList.add('on')},1300+i*1400)});
    later(function(){S.step='plan';flowRender()},350+segs.length*400+700);
  }

  function mark(sel,on){[].forEach.call(flBody.querySelectorAll(sel),function(n){n.setAttribute('aria-pressed',String(n===on))})}
  flBack.addEventListener('click',function(){
    if(S.step==='level'){S.step='subject';flowRender()}else if(S.step==='subject')backToStories();
  });
  flBody.addEventListener('click',function(e){
    var a=e.target.closest('[data-subject]'),b=e.target.closest('[data-level]');
    if(a){S.subject=a.dataset.subject;onSubject(S.subject);S.level=null;mark('[data-subject]',a);later(function(){S.step='level';flowRender()},260)}
    else if(b){S.level=b.dataset.level;onLevel(S.level);mark('[data-level]',b);later(function(){S.step='prep';flowRender()},260)}
  });
  flFoot.addEventListener('click',function(e){const button=e.target.closest('[data-act]');
    if(button)onFinish(button.dataset.act)});

  /* In-slide buttons */
  slideEl.addEventListener('click',function(e){
    var t=e.target.closest('[data-tutor]');
    if(t){S.tutor=t.dataset.tutor;S.touched=true;render();return}
    var a=e.target.closest('[data-act]');
    if(!a)return;
    if(a.dataset.act==='continue'){onTutor(S.tutor);go(S.idx+1)}
    if(a.dataset.act==='finish')startFlow();
  });

  /* Gestures: tap left third = back, tap the rest = next, press and hold = pause. */
  var g=null,lastNav=0;
  /* The click that trails a navigation tap would land on whatever new button is under the finger. Swallow it. */
  story.addEventListener('click',function(e){if(performance.now()-lastNav<350){e.stopPropagation();e.preventDefault()}},true);
  story.addEventListener('contextmenu',function(e){e.preventDefault()});
  story.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    if(e.target.closest('button,a'))return;
    g={id:e.pointerId,x:e.clientX,y:e.clientY,held:false,moved:false};
    g.timer=setTimeout(function(){if(g&&!g.moved){g.held=true;S.held=true;paintHint()}},220);
  });
  window.addEventListener('pointermove',function(e){
    if(!g||e.pointerId!==g.id)return;
    if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>10){g.moved=true;clearTimeout(g.timer)}
  },{signal});
  function release(e){
    if(!g||e.pointerId!==g.id)return;
    var gg=g;g=null;clearTimeout(gg.timer);
    if(gg.held){S.held=false;lastNav=performance.now();paintHint();return}
    if(e.type!=='pointerup'||gg.moved)return;
    var r=col.getBoundingClientRect();
    lastNav=performance.now();
    if((e.clientX-r.left)/r.width<0.33)prev();else next();
  }
  window.addEventListener('pointerup',release,{signal});
  window.addEventListener('pointercancel',release,{signal});

  document.addEventListener('keydown',function(e){
    if(S.flow||e.repeat||e.altKey||e.ctrlKey||e.metaKey)return;
    if(e.key==='ArrowRight'){e.preventDefault();next()}
    else if(e.key==='ArrowLeft'){e.preventDefault();prev()}
    else if(e.key===' '&&!root.activeElement?.closest('button')){e.preventDefault();S.kpause=!S.kpause;paintHint()}
  },{signal});

  let animation;
  var last;
  function tick(t){
    var dt=last==null?0:Math.min(100,t-last);last=t;
    var s=slides[S.idx];
    if(!S.flow&&s.dur&&!S.held&&!S.kpause&&!document.hidden&&!reduce.matches&&!preferences.reduceMotion){
      S.elapsed+=dt;
      if(S.elapsed>=s.dur)go(S.idx+1);else paint();
    }
    animation=requestAnimationFrame(tick);
  }
  S.tutor = preferences.tutor || 'charles';
  S.subject = preferences.subject;
  S.level = preferences.level;
  if (S.subject || preferences.tutor) {
    S.flow = true;
    S.step = S.level ? 'plan' : S.subject ? 'level' : 'subject';
    story.hidden = true;
    flow.hidden = false;
    flowRender();
  } else {
    render();
  }
  animation=requestAnimationFrame(tick);
  return () => {
    controller.abort();
    clearTimeout(g?.timer);
    clearTimers();
    cancelAnimationFrame(animation);
  };

}
