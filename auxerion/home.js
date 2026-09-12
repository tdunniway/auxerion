(()=>{
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
// hero word stagger
document.querySelectorAll('.words span').forEach((s,i)=>s.style.setProperty('--i',i));
// hero image cycle + tabs
const imgs=[...document.querySelectorAll('.hero .bg img')],tabs=[...document.querySelectorAll('.strip button')];let i=0,t;
function go(n){i=n%imgs.length;imgs.forEach((im,k)=>im.classList.toggle('on',k===i));tabs.forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-selected',k===i);const bar=b.querySelector('.bar i');if(bar){bar.style.animation='none';void bar.offsetWidth;bar.style.animation=''}})}
function loop(){clearInterval(t);if(!rm)t=setInterval(()=>go(i+1),6000)}
tabs.forEach(b=>b.addEventListener('click',()=>{go(+b.dataset.i);loop()}));loop();
// nav + parallax + progress
const nav=document.querySelector('.site-nav'),hero=document.querySelector('.hero');
const onS=()=>{const y=scrollY;nav.classList.toggle('solid',y>40);hero.style.setProperty('--sy',Math.min(y,900));const max=document.documentElement.scrollHeight-innerHeight;nav.style.setProperty('--p',(y/max).toFixed(4))};
onS();addEventListener('scroll',onS,{passive:true});
// cursor light
if(matchMedia('(pointer:fine)').matches&&!rm)hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px')});
// converge diagram
const cv=document.querySelector('.converge');
if(cv){const chips=[...cv.querySelectorAll('.chip')],g=cv.querySelector('.lines g');
chips.forEach(c=>{const a=(+c.style.getPropertyValue('--a')-90)*Math.PI/180,cx=Math.cos(a),cy=Math.sin(a);c.style.setProperty('--cx',cx.toFixed(3));c.style.setProperty('--cy',cy.toFixed(3));c.style.setProperty('--j',(Math.random()*10-5).toFixed(1));
const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',50);l.setAttribute('y1',50);l.setAttribute('x2',(50+38*cx).toFixed(2));l.setAttribute('y2',(50+38*cy).toFixed(2));g.appendChild(l)});
if(rm)cv.classList.add('whole');else{let w=false;const tick=()=>{w=!w;cv.classList.toggle('whole',w);setTimeout(tick,w?5200:3400)};new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){setTimeout(tick,900);o.disconnect()}},{threshold:.4}).observe(cv)}}
})();
