(()=>{
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.words span').forEach((s,i)=>s.style.setProperty('--i',i));
const nav=document.querySelector('.site-nav'),hero=document.querySelector('.hero');
const onS=()=>{const y=scrollY;if(nav){nav.classList.toggle('solid',y>40);const max=document.documentElement.scrollHeight-innerHeight;nav.style.setProperty('--p',(y/max).toFixed(4))}if(hero)hero.style.setProperty('--sy',Math.min(y,900))};
onS();addEventListener('scroll',onS,{passive:true});
// optional hero image cycle: .hero .bg img (2+) with [data-cycle] on .bg
const bg=document.querySelector('.hero .bg[data-cycle]');
if(bg&&!rm){const imgs=[...bg.querySelectorAll('img')];let i=0;imgs[0].classList.add('on');setInterval(()=>{i=(i+1)%imgs.length;imgs.forEach((im,k)=>im.classList.toggle('on',k===i))},+bg.dataset.cycle||6000)}
// tilt cards
if(matchMedia('(pointer:fine)').matches&&!rm)document.querySelectorAll('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1200px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
})();
