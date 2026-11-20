var P={'.':null,h:'#1B1311',s:'#8A5230',b:'#2A1C16',g:'#D8E8E4',o:'#E8782F',d:'#FFD25E',p:'#2B3F52',k:'#0C1217',e:'#1B1311',t:'#2FB88A',m:'#6AF4BF',y:'#FFE135',r:'#FF7A5C',w:'#EAF4EE'};
var IC={'.':null,m:'#6AF4BF',w:'#EAF4EE',g:'#6AF4BF',y:'#FFE135',r:'#FF7A5C',k:'#0C1217',Y:'#C9AC00'};
var SP={
 charles:{pal:P,rows:['...hhhhhh...','..hhhhhhhh..','..hssssssh..','..sggssggs..','..ssssssss..','..sbbbbbbs..','...bbbbbb...','....bbbb....','..oooooooo..','.soodooodos.','.soooooooos.','.soodooodos.','..oooooooo..','..pppppppp..','..ppp..ppp..','..kkk..kkk..']},
 linda:{pal:P,rows:['...hhhhhh...','..hhhhhhhh..','.hhsssssshh.','.hhsessesshh','.hhssssssshh','.hhsssrrsshh','.hhh.ss.hhh.','..tttttttt..','.stttddtttts.','.stttttttts.','.stttttttts.','..tttttttt..','..pppppppp..','..ppp..ppp..','..ppp..ppp..','..kkk..kkk..']},
 hero:{pal:P,rows:['..hhhhhh..','.hhhhhhhh.','.hssssssh.','.hsessesh.','.hssssssh.','..mmmmmm..','.smmmmmms.','.smyyyyms.','.smmmmmms.','..pppppp..','..pp..pp..','..kk..kk..']},
 lantern:{pal:IC,rows:['..kk..','.kkkk.','kyyyyk','kyYYyk','kyyyyk','kyYYyk','kyyyyk','.kkkk.','..kk..']},
 flame:{pal:IC,tones:{off:{r:'#2A4152',y:'#3A566A'}},rows:['...r....','..rr.r..','..rrrr..','.rryyrr.','.rryyyr.','.rryyyr.','.rrryrr.','..rrrr..']},
 bolt:{pal:IC,tones:{off:{y:'#3A566A'}},rows:['....yy..','...yy...','..yy....','.yyyyyy.','...yy...','..yy....','.yy.....','yy......']},
 star:{pal:IC,tones:{off:{y:'#2A4152'}},rows:['...yy...','...yy...','yyyyyyyy','.yyyyyy.','..yyyy..','.yyyyyy.','.yy..yy.','yy....yy']},
 trophy:{pal:{'.':null,y:'#FFD25E',Y:'#C9962B'},tones:{bronze:{y:'#CD7F32',Y:'#8A5A2B'},silver:{y:'#C9D3DA',Y:'#8A97A1'},gold:{y:'#FFD25E',Y:'#C9962B'},diamond:{y:'#8BD3FF',Y:'#4A9ED4'},off:{y:'#2A4152',Y:'#1E3140'}},
  rows:['.yyyyyyyy.','yyyyyyyyyy','y.yyyyyy.y','y.yyyyyy.y','.yyyyyyyy.','..yyyyyy..','...yyyy...','....yy....','...YYYY...','..YYYYYY..']},
 'ic-math':{pal:IC,rows:['...mm...','...mm...','...mm...','mmmmmmmm','mmmmmmmm','...mm...','...mm...','...mm...']},
 'ic-chem':{pal:IC,rows:['..wwww..','...ww...','...ww...','..gggg..','.gggggg.','gggggggg','gggggggg','.wwwwww.']},
 'ic-bio':{pal:IC,rows:['......gg','....gggg','..gggggg','.ggggggg','.gggggg.','gggggg..','gg.gg...','g.......']},
 'ic-eng':{pal:IC,rows:['......yy','.....yyy','....yyy.','...yyy..','..yyy...','.ryy....','rrw.....','rr......']}
};
function drawSprite(rows,pal,scale){
  var h=rows.length,w=Math.max.apply(null,rows.map(function(r){return r.length}));
  var c=document.createElement('canvas');c.width=w;c.height=h;c.className='px';
  c.style.width=w*scale+'px';c.style.height=h*scale+'px';
  var x=c.getContext('2d');
  rows.forEach(function(r,y){for(var i=0;i<r.length;i++){var col=pal[r[i]];if(col){x.fillStyle=col;x.fillRect(i,y,1,1)}}});
  return c;
}
export function hydrate(root){
  root.querySelectorAll('[data-sprite]:not([data-done])').forEach(function(n){
    var name=n.dataset.sprite,sc=+n.dataset.scale||4,tone=n.dataset.tone,sp=SP[name];
    if(!sp)return;
    if(name==='linda'||name==='charles'){
      n.classList.add('tutor-sprite', 'tutor-sprite--'+name);
      n.style.setProperty('--tutor-size', sc*sp.rows.length+'px');
      n.setAttribute('aria-hidden','true');
      n.dataset.done='1';
      return;
    }
    var pal=tone&&sp.tones&&sp.tones[tone]?Object.assign({},sp.pal,sp.tones[tone]):sp.pal;
    var node=drawSprite(sp.rows,pal,sc);
    n.replaceChildren(node);n.dataset.done='1';n.setAttribute('aria-hidden','true');
  });
}
export function spr(name,scale,tone,cls){return '<span class="sprite '+(cls||'')+'" data-sprite="'+name+'" data-scale="'+scale+'"'+(tone?' data-tone="'+tone+'"':'')+'></span>'}

export function drawSky(){
  var c=document.getElementById('sky'),W=320,H=180;c.width=W;c.height=H;
  var x=c.getContext('2d');
  ['#08111A','#0A1620','#0C1B27','#0F2230','#12293A','#163244'].forEach(function(b,i){x.fillStyle=b;x.fillRect(0,Math.floor(i*H/6),W,Math.ceil(H/6)+1)});
  var s=7;function rnd(){s=(s*16807)%2147483647;return s/2147483647}
  for(var i=0;i<90;i++){x.globalAlpha=.3+rnd()*.6;x.fillStyle=rnd()>.85?'#FFE135':'#CFE9FF';x.fillRect(Math.floor(rnd()*W),Math.floor(rnd()*H*.55),1,1)}
  x.globalAlpha=1;
  // small round moon, drawn as a pixel disc
  x.fillStyle='#DCEBE6';
  [[2,0,4],[1,1,6],[0,2,8],[0,3,8],[0,4,8],[0,5,8],[1,6,6],[2,7,4]].forEach(function(r){x.fillRect(262+r[0],22+r[1],r[2],1)});
  x.fillStyle='#B9CFC9';x.fillRect(265,25,2,2);x.fillRect(263,28,1,1);
  [['#0E2430',122,.03,12],['#0B1B26',144,.045,9]].forEach(function(l,li){x.fillStyle=l[0];for(var i=0;i<W;i++){var y=Math.floor(l[1]+Math.sin(i*l[2]+li*2)*l[3]+Math.sin(i*l[2]*2.3)*l[3]*.4);x.fillRect(i,y,1,H-y)}});
}
export function drawGround(){
  var c=document.createElement('canvas');c.width=16;c.height=32;var x=c.getContext('2d');
  x.fillStyle='#1C3442';x.fillRect(0,0,16,32);
  x.fillStyle='#6AF4BF';x.fillRect(0,0,16,2);x.fillStyle='#2FB88A';x.fillRect(0,2,16,2);
  x.fillStyle='#27465A';[[2,8],[9,6],[13,12],[5,16],[11,20],[3,25],[8,28]].forEach(function(p){x.fillRect(p[0],p[1],2,2)});
  x.fillStyle='#142836';x.fillRect(0,30,16,2);
  document.documentElement.style.setProperty('--ground','url('+c.toDataURL()+')');
}
