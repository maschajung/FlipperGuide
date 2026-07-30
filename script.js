let data=[];const q=document.getElementById("q"),l=document.getElementById("list"),c=document.getElementById("card");
fetch("daten.json").then(r=>r.json()).then(d=>{data=d.sort((a,b)=>a.Flipper.localeCompare(b.Flipper));fill("")});
function fill(f){l.innerHTML="";data.filter(x=>x.Flipper.toLowerCase().includes(f.toLowerCase())).forEach(x=>{let o=document.createElement("option");o.value=x.Flipper;o.textContent=x.Flipper;l.appendChild(o)});show()}
function show(){let x=data.find(a=>a.Flipper===l.value)||data[0];if(!x)return;c.innerHTML="<h3>"+x.Flipper+"</h3>"+Object.entries(x).filter(e=>e[0]!="Flipper").map(e=>"<div class=row><div class=k>"+e[0]+"</div><div>"+e[1]+"</div></div>").join("")}
q.oninput=()=>fill(q.value);l.onchange=show;
if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js');}