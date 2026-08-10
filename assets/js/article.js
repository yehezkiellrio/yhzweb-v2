
(function(){
  'use strict';
  const links=[...document.querySelectorAll('.article-toc a')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window && sections.length){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
        }
      });
    },{rootMargin:'-18% 0px -70% 0px',threshold:0});
    sections.forEach(s=>obs.observe(s));
  }
  const copy=document.getElementById('copyArticleLink');
  if(copy){ copy.addEventListener('click',async()=>{ try{await navigator.clipboard.writeText(location.href); const old=copy.textContent; copy.textContent='Copied ✓'; setTimeout(()=>copy.textContent=old,1600);}catch(e){} }); }
})();
