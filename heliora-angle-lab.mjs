export const ASPECTS = Object.freeze([{angle:0,name:'Conjunction'},{angle:60,name:'Sextile'},{angle:90,name:'Square'},{angle:120,name:'Trine'},{angle:180,name:'Opposition'}]);
export function normalize(angle) { return ((angle % 360) + 360) % 360; }
export function describeAngle(a,b,orb) {
  if (![a,b,orb].every(Number.isFinite) || orb < 0 || orb > 10) throw new RangeError('Use finite angles and an orb from 0 to 10 degrees.');
  const difference=normalize(b-a);
  const separation=Math.min(difference,360-difference);
  const nearest=ASPECTS.reduce((best,item)=>Math.abs(item.angle-separation)<Math.abs(best.angle-separation)?item:best);
  const deviation=Math.abs(nearest.angle-separation);
  return {separation,nearest,deviation,withinOrb:deviation<=orb+1e-9,clockwise:difference<=180};
}
export function point(angle,radius=154) {
  const radians=normalize(angle)*Math.PI/180;
  return {x:220+radius*Math.sin(radians),y:220-radius*Math.cos(radians)};
}
if (typeof document !== 'undefined') {
  const $=id=>document.getElementById(id);
  const set=(el,attrs)=>Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,String(value)));
  const a=$('position-a'),b=$('position-b'),orb=$('orb');
  for(let angle=0;angle<360;angle+=10){
    const tick=document.createElementNS('http://www.w3.org/2000/svg','line');
    const start=point(angle,angle%30===0?162:166),end=point(angle,172);
    set(tick,{x1:start.x,y1:start.y,x2:end.x,y2:end.y,stroke:'#756383','stroke-width':angle%30===0?2:1});$('ticks').append(tick);
  }
  function update(){
    const av=Number(a.value),bv=Number(b.value),ov=Number(orb.value),result=describeAngle(av,bv,ov);
    $('value-a').textContent=av.toFixed(1)+'°';$('value-b').textContent=bv.toFixed(1)+'°';$('value-orb').textContent=ov.toFixed(1)+'°';
    for(const [name,value] of [['a',av],['b',bv]]){
      const p=point(value),label=point(value,name==='a'?133:176);
      set($('marker-'+name),{cx:p.x,cy:p.y});set($('ray-'+name),{x2:p.x,y2:p.y});set($('label-'+name),{x:label.x,y:label.y+5});
    }
    const start=point(av,110),end=point(bv,110);
    set($('separation-arc'),{d:result.separation<1e-9?'':`M ${start.x} ${start.y} A 110 110 0 0 ${result.clockwise?1:0} ${end.x} ${end.y}`});
    $('separation').textContent=result.separation.toFixed(1)+'°';
    $('aspect').textContent=result.withinOrb?`${result.nearest.name} · ${result.deviation<1e-9?'exact':'within selected orb'}`:'No major aspect within the selected orb.';
    $('deviation').textContent=`${result.deviation.toFixed(1)}° from the exact ${result.nearest.angle}° angle${result.withinOrb?'.':` (${result.nearest.name.toLowerCase()}).`}`;
    $('svg-desc').textContent=`Marker A at ${av.toFixed(1)} degrees; marker B at ${bv.toFixed(1)} degrees. Shortest separation ${result.separation.toFixed(1)} degrees. ${$('aspect').textContent}`;
    document.querySelectorAll('[data-angle]').forEach(button=>button.setAttribute('aria-pressed',String(Math.abs(result.separation-Number(button.dataset.angle))<1e-9)));
  }
  [a,b,orb].forEach(input=>input.addEventListener('input',update));
  document.querySelectorAll('[data-angle]').forEach(button=>button.addEventListener('click',()=>{b.value=normalize(Number(a.value)+Number(button.dataset.angle)).toFixed(1);update();}));
  update();
}
