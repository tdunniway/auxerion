/* Auxerion family bar — one strip on every page. Edit LINKS to change destinations everywhere. */
(()=>{
const LINKS=[
 {id:'aux',name:'Auxerion',sub:'The company',href:'/',color:'#3B7BFF',color2:'#A855F7',img:null,mark:'/assets/logos/auxerion-mark-2026.png'},
 {id:'c8',name:'Creativ8',sub:'Game development',href:'/creativ8',color:'#F5A524',color2:'#E85B4B',img:'/assets/bar/creativ8.jpg',mark:'/assets/logos/creativ8-mark-2026.png'},
 {id:'mo',name:'MOOSE',sub:'Medical offices',href:'/moose',color:'#1FA7A0',color2:'#1B3A6B',img:'/assets/bar/moose-bg.jpg',mark:'/assets/logos/moose-mark-2026.png'},
 {id:'ha',name:'Kept',sub:'Hospitality',href:'/kept',color:'#0F5C52',color2:'#C9642F',img:'/assets/bar/kept.jpg',mark:'/assets/logos/kept-mark-reverse-2026.png'},
 {id:'wo',name:'WorkOS',sub:'The shared core',href:'/workos',color:'#6D28D9',color2:'#E879F9',color3:'#150826',img:null,mark:'/assets/logos/workos-mark-2026.svg'}
];
const cur=document.body.dataset.brand||'aux';
const bar=document.createElement('div');bar.className='fambar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Auxerion family');
bar.innerHTML=LINKS.map(l=>`<a class="ft${l.id===cur?' on':''}" href="${l.href}" style="--c:${l.color};--c2:${l.color2}${l.color3?`;--c3:${l.color3}`:``}"${l.id===cur?' aria-current="page"':''}>${l.img?`<img class="bg" src="${l.img}" alt="" loading="eager" decoding="async">`:`<span class="ax"><i></i><i></i><i></i></span>`}<img class="mk" src="${l.mark}" alt="" loading="eager" decoding="async"><span class="tx"><b>${l.name}</b><small>${l.sub}</small></span></a>`).join('');
document.body.insertBefore(bar,document.body.querySelector('.site-nav')||document.body.firstChild);
})();
