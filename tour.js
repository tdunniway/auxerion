/* Product screens tour — pairs with tour.css. Desktop: the step nearest the viewport centre drives the sticky frame; clicking a step scrolls to it. Mobile: each figure moves into its own step. */
(()=>{
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,mq=matchMedia('(max-width:860px)');
document.querySelectorAll('.tour').forEach(sec=>{
const frame=sec.querySelector('.tour-frame'),steps=[...sec.querySelectorAll('.tour-step')],cap=sec.querySelector('.tour-cap b');
if(!frame)return;const figs=[...frame.querySelectorAll('figure')];if(!steps.length||figs.length!==steps.length)return;
let cur=-1,lock=0;
const set=i=>{if(i===cur||i<0)return;cur=i;steps.forEach((s,k)=>s.classList.toggle('on',k===i));figs.forEach((f,k)=>{f.classList.toggle('on',k===i);f.setAttribute('aria-hidden',k!==i)});if(cap)cap.textContent=steps[i].dataset.cap||''};
set(0);
const layout=()=>{if(mq.matches)steps.forEach((s,k)=>{if(figs[k].parentNode!==s)s.prepend(figs[k])});else figs.forEach(f=>{if(f.parentNode!==frame)frame.appendChild(f)})};
layout();mq.addEventListener('change',layout);
const io=new IntersectionObserver(es=>{if(mq.matches||Date.now()<lock)return;for(const e of es)if(e.isIntersecting)set(steps.indexOf(e.target))},{rootMargin:'-42% 0px -48% 0px',threshold:0});
steps.forEach(s=>io.observe(s));
steps.forEach((s,k)=>{const b=s.querySelector('button');if(b)b.addEventListener('click',()=>{set(k);if(!mq.matches){lock=Date.now()+1400;s.scrollIntoView({behavior:rm?'auto':'smooth',block:'center'})}})});
});
})();
