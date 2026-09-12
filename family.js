(()=>{
const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}},{rootMargin:'0px 0px -8% 0px',threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const b=document.querySelector('.menu-btn'),l=document.querySelector('.links');
if(b&&l)b.addEventListener('click',()=>{const o=l.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'Close':'Menu'});
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>{l.classList.remove('open');if(b){b.setAttribute('aria-expanded','false');b.textContent='Menu'}}));
})();
