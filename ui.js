function render(){
  const path = hash();
  const app = document.getElementById("app");
  if (!S.session && !["/","/login"].includes(path) && !path.startsWith("/p/")) { go("/login"); return; }

  if (path==="/" ) { app.innerHTML = landing(); return; }
  if (path==="/login") {
    app.innerHTML = loginView();
    document.getElementById("go").onclick = () => {
      const em=document.getElementById("em").value, pw=document.getElementById("pw").value;
      if (pw && pw!==PASS) { toast("Wrong password"); return; }
      if (login(em||"seller@wastly.demo")) { toast("Signed in"); go("/dashboard"); } else toast("Unknown account");
    };
    document.querySelectorAll(".demo").forEach(b => b.onclick = () => { login(b.dataset.e); toast("Demo session started"); go("/dashboard"); });
    return;
  }
  if (path.startsWith("/p/")) {
    const code = path.slice(3);
    const d = S.deals.find(x => x.passport && x.passport.code===code);
    if (!d) { app.innerHTML = `<main class="wrap" style="padding:40px">${logo()}<p class="muted" style="margin-top:20px">Passport not found.</p></main>`; return; }
    const l=listing(d.listing);
    app.innerHTML = `<main class="wrap" style="padding:40px 16px;max-width:640px">
      ${logo()}
      <p class="muted" style="margin-top:24px;font-size:12px;letter-spacing:.16em;text-transform:uppercase">Public material passport</p>
      <div class="card pad grid" style="margin-top:12px">
        <h1>${l.name}</h1>
        <p class="muted">${l.cat} · ${d.qty} ${d.unit} · ${l.city}</p>
        <p>Stage ${d.passport.stage}</p>
        <p class="mono primary">${d.passport.code}</p>
        <p class="muted" style="font-size:13px">Public-safe view — documents and prices withheld. Non-sensitive summary only.</p>
        <p style="font-size:14px">${co(d.seller).name} → ${co(d.buyer).name}</p>
        <div class="qr"></div>
      </div>
      <a class="btn out" style="margin-top:16px" href="#/">Back to Wastly</a>
    </main>`;
    return;
  }

  const c = me();
  let inner = "";
  if (path==="/dashboard") inner = dashboard();
  else if (path==="/waste") inner = wasteIndex();
  else if (path==="/waste/new") inner = wasteNew();
  else if (path.startsWith("/waste/")) {
    const l = listing(path.split("/")[2]);
    inner = l? `<div class="grid"><div class="between"><div><p class="muted">${l.cat}</p><h1 style="font-size:24px">${l.name}</h1><p class="muted">${l.qty} t · ${l.city} · ${inr(l.price)}</p></div><span class="badge">${l.status.toLowerCase()}</span></div>
      ${l.dna? `<div class="card pad grid"><h2>Material DNA · ${l.dna.conf}% · ${l.dna.source}</h2><p>${l.dna.classification}</p><p class="muted">${l.dna.composition}</p><p>Applications: ${l.dna.apps.join(", ")}</p></div>`:`<div class="card pad muted">No Material DNA yet.</div>`}
      ${(c.id===l.seller||c.role==="ADMIN") && (l.status==="DRAFT"||l.status==="ANALYZED")? `<a class="btn" href="#/waste/new">Open editor</a>`: `<a class="btn" href="#/matches">View matches</a>`}
    </div>` : "Not found";
  }
  else if (path==="/marketplace") {
    const lots = S.listings.filter(l => ["PUBLISHED","MATCHED"].includes(l.status));
    inner = `<div class="grid"><h1 style="font-size:24px">Marketplace</h1><p class="muted">Available industrial lots.</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">${lots.map(l=>`<div class="card pad grid"><p class="muted" style="font-size:12px">${l.cat}</p><h2>${l.name}</h2><p class="muted">${l.qty} t · ${l.city}</p><p>${co(l.seller).name} <span class="badge ok">${co(l.seller).v.toLowerCase()}</span></p><p class="mono">${inr(l.price)} / t</p></div>`).join("")}</div></div>`;
  }
  else if (path==="/matches") inner = matchesView();
  else if (path==="/logistics") {
    const can = c.role==="LOGISTICS"||c.role==="ADMIN";
    const trucks = c.role==="LOGISTICS"? S.trucks.filter(t=>t.co===c.id): S.trucks;
    inner = `<div class="grid"><h1 style="font-size:24px">Logistics</h1><p class="muted">Available and returning capacity. Matching prefers empty return routes.</p>
      ${can? `<div class="card pad grid"><h2>Add available truck</h2>
        <label><span>Truck ID</span><input id="tc" placeholder="RJ-14-GH-0000"/></label>
        <button class="btn" id="addTrk">List truck</button></div>` : `<p class="muted">You can view capacity. Listing trucks requires a logistics role.</p>`}
      ${trucks.map(t=>`<div class="card pad between"><div><h2>${t.code}</h2><p class="muted">${t.from} → ${t.to} · ${t.cap} t · ${inr(t.pkm)}/km</p>${t.ret?`<p class="primary" style="font-size:13px">Return route</p>`:""}</div><span class="badge">${t.status.toLowerCase()}</span></div>`).join("")}
    </div>`;
  }
  else if (path==="/deals") {
    const rows = S.deals.filter(d => c.role==="ADMIN" || d.seller===c.id || d.buyer===c.id || (d.truck && S.trucks.find(t=>t.id===d.truck)?.co===c.id));
    inner = `<div class="grid"><h1 style="font-size:24px">Deals</h1><p class="muted">Negotiation through delivery. Nothing is legally binding until both parties approve a contract.</p>
      ${rows.map(d=>`<a class="card pad between" href="#/deals/${d.id}"><div><div style="font-weight:500">${listing(d.listing).name}</div><div class="muted" style="font-size:14px">${co(d.seller).name} → ${co(d.buyer).name} · ${d.qty} t</div></div><div class="row"><span class="mono">${d.unitPrice?inr(d.unitPrice):"—"}</span><span class="badge">${d.status.toLowerCase()}</span></div></a>`).join("")||`<div class="card pad muted">No deals yet. Create one from an AI match.</div>`}</div>`;
  }
  else if (path.startsWith("/deals/")) inner = dealRoom(path.split("/")[2]);
  else if (path==="/contracts") {
    const rows = S.deals.filter(d => d.contract && (c.role==="ADMIN"||d.seller===c.id||d.buyer===c.id));
    inner = `<div class="grid"><h1 style="font-size:24px">Contracts</h1><p class="muted">AI-generated drafts. Review and approve before execution.</p>
      ${rows.map(d=>`<a class="card pad between" href="#/deals/${d.id}"><div><div style="font-weight:500">${listing(d.listing).name}</div><div class="muted">${co(d.seller).name} · ${co(d.buyer).name}</div></div><span class="badge">${d.status.toLowerCase()}</span></a>`).join("")||`<div class="card pad muted">No contracts yet. Accept a deal, then generate a draft.</div>`}</div>`;
  }
  else if (path==="/passport") {
    const rows = S.deals.filter(d => d.passport && (c.role==="ADMIN"||d.seller===c.id||d.buyer===c.id|| (d.truck && S.trucks.find(t=>t.id===d.truck)?.co===c.id)));
    inner = `<div class="grid"><h1 style="font-size:24px">Material passports</h1><p class="muted">Traceability from generation to reuse. QR opens a public-safe page.</p>
      ${rows.map(d=>`<div class="card pad between"><div><p class="mono primary">${d.passport.code}</p><p>${listing(d.listing).name}</p><p class="muted">${d.qty} t · ${d.passport.stage}</p></div><a class="primary" href="#/p/${d.passport.code}">Public view</a></div>`).join("")||`<div class="card pad muted">Passports appear after a contract is approved.</div>`}</div>`;
  }
  else if (path==="/carbon") {
    const mine = S.deals.filter(d => d.carbon && (c.role==="ADMIN"||d.seller===c.id||d.buyer===c.id|| (d.truck && S.trucks.find(t=>t.id===d.truck)?.co===c.id)));
    const totD = mine.reduce((a,d)=>a+d.carbon.diverted,0), totC=mine.reduce((a,d)=>a+d.carbon.net,0), circ=mine.length? Math.round(mine.reduce((a,d)=>a+d.carbon.circ,0)/mine.length):0;
    inner = `<div class="grid"><div class="between"><div><h1 style="font-size:24px">Carbon & ESG</h1><p class="muted">Estimated — methodology dependent. Not live registry data.</p></div></div>
      <div class="stats">${[["Waste diverted", totD+" t"],["Estimated CO₂e", totC.toFixed(1)+" t"],["Circularity", circ+"/100"],["Completed", mine.length]].map(([k,v])=>`<div class="card pad"><p class="muted" style="font-size:12px">${k}</p><p class="mono" style="font-size:22px">${v}</p></div>`).join("")}</div>
      ${mine.map(d=>`<div class="card pad"><b>${listing(d.listing).name}</b><p class="muted">${d.carbon.diverted} t diverted · ${d.carbon.net} tCO₂e · ${d.carbon.credit}</p><p class="muted" style="font-size:12px">${d.carbon.notes}</p></div>`).join("")||`<div class="card pad muted">Complete a deal to populate ESG.</div>`}
    </div>`;
  }
  else if (path==="/resources") {
    inner = `<div class="grid"><h1 style="font-size:24px">Resource exchange</h1><p class="muted">Underused machinery, warehouse space and processing capacity.</p>
      ${S.resources.map(r=>`<div class="card pad"><h2>${r.name}</h2><p class="muted">${r.kind} · ${r.city} · ${co(r.co).name}</p><p class="mono">${inr(r.price)} ${r.unit}</p></div>`).join("")}</div>`;
  }
  else if (path==="/profile") {
    inner = `<div class="grid"><h1 style="font-size:24px">${c.name}</h1>
      <p class="muted">${c.industry} · ${c.city} <span class="badge ok">${c.v.toLowerCase()}</span></p>
      <p>Circular trust score <span class="mono">${c.trust}/100</span></p>
      <p class="muted" style="font-size:12px">Score uses verification, completed deliveries, disputes, documentation and ratings.</p>
      <div class="card pad grid"><p>GST ${c.gst} · ${c.user}</p><p>${c.about}</p></div>
      ${c.role==="BUYER"||c.role==="ADMIN"? `<div class="card pad"><h2>Buyer requirements</h2>${S.reqs.filter(r=>r.buyer===c.id||c.role==="ADMIN").map(r=>`<p>${r.title} · ${r.min}–${r.max} t · max ${inr(r.price)}</p>`).join("")}</div>`:""}
    </div>`;
  }
  else if (path==="/admin") {
    if (c.role!=="ADMIN") inner = `<p style="color:var(--danger)">Admin only</p>`;
    else inner = `<div class="grid"><h1 style="font-size:24px">Admin</h1>
      <div class="stats">${[["Companies", S.companies.length],["Listings", S.listings.filter(l=>l.status!=="WITHDRAWN").length],["Deals", S.deals.length]].map(([k,v])=>`<div class="card pad"><p class="muted" style="font-size:12px">${k}</p><p class="mono" style="font-size:22px">${v}</p></div>`).join("")}</div>
      <div class="card pad"><h2>Matching weights</h2><p class="muted" style="font-size:12px">Must sum to 1.00 — material 0.30, quantity 0.15, distance 0.15, price 0.15, quality 0.10, logistics 0.10, trust 0.05</p></div>
      <div class="card pad grid"><h2>Companies</h2>${S.companies.map(x=>`<div class="between"><div><b>${x.name}</b><div class="muted" style="font-size:12px">${x.role} · ${x.city}</div></div><span class="badge ok">${x.v.toLowerCase()}</span></div>`).join("")}</div>
    </div>`;
  }
  else if (path==="/notifications") inner = `<div class="grid"><h1 style="font-size:24px">Notifications</h1><div class="card pad muted">Deal, match and contract events appear here in the hosted demo as you act in the deal room.</div></div>`;
  else inner = dashboard();

  app.innerHTML = shell(inner);
  document.getElementById("out").onclick = () => { S.session=null; save(S); go("/login"); };

  document.getElementById("ai")?.addEventListener("click", () => {
    const l = { id:uid("wl"), seller:c.id, name:document.getElementById("n").value, cat:document.getElementById("c").value,
      qty:+document.getElementById("q").value, unit:"tonnes", city:document.getElementById("city").value,
      price:+document.getElementById("p").value, quality:document.getElementById("qual").value, status:"DRAFT", desc:document.getElementById("d").value };
    analyzeDNA(l); S.listings.unshift(l); save(S);
    document.getElementById("dnaBox").innerHTML = `<h2>Material DNA</h2><p class="badge ok">${l.dna.conf}% · ${l.dna.source}</p>
      <p style="margin-top:8px">${l.dna.classification}</p><p class="muted">${l.dna.composition}</p>
      <p style="font-size:14px">Applications: ${l.dna.apps.join(", ")}</p>
      <button class="btn" id="pub">Publish listing</button>`;
    document.getElementById("pub").onclick = () => { l.status="PUBLISHED"; runMatch(l); save(S); toast("Wastly AI found buyers"); go("/matches"); };
    toast("Material DNA ready · "+l.dna.conf+"% (DEMO)");
  });
  document.getElementById("addTrk")?.addEventListener("click", () => {
    const code=document.getElementById("tc").value.trim(); if(!code){toast("Truck ID required"); return;}
    S.trucks.unshift({id:uid("trk"), co:c.id, code, cap:10, from:c.city, to:"Delhi", ret:true, pkm:34, status:"AVAILABLE"}); save(S); toast("Truck listed"); render();
  });
  document.querySelectorAll(".deal").forEach(b => b.onclick = () => openDeal(b.dataset.id));

  const dealId = path.startsWith("/deals/") ? path.split("/")[2] : null;
  const d = dealId && S.deals.find(x=>x.id===dealId);
  if (d) {
    document.getElementById("aiNego")?.addEventListener("click", () => {
      const p = d.rec || d.unitPrice || 2900;
      d.messages.push({who:"AI", body:`Based on the current deal parameters, a settlement around ${inr(p)} per tonne may be reasonable. This is a suggestion only — Wastly AI never binds either party.`, suggestion:p});
      save(S); toast("AI suggestion posted"); render();
    });
    document.getElementById("accSug")?.addEventListener("click", (e) => {
      d.unitPrice = +e.target.dataset.p; d.messages.push({who:"SELLER", body:`Accepted AI suggestion of ${inr(d.unitPrice)} / tonne. Still not a binding contract.`});
      save(S); toast("Suggestion accepted"); render();
    });
    document.getElementById("accDeal")?.addEventListener("click", () => {
      d.status="AGREED"; d.events.push({kind:"Deal accepted", at:Date.now()});
      d.messages.push({who:"SYSTEM", body:`${c.name} accepted ${inr(d.unitPrice)}/tonne. ${co(d.buyer).name} has standing instructions to agree at this level (demo counterparty). Not a legal contract until both approve the draft.`});
      save(S); toast("Deal accepted"); render();
    });
    document.getElementById("genCt")?.addEventListener("click", () => {
      d.status="CONTRACT_PENDING";
      d.contract={ title:"Wastly draft — "+listing(d.listing).name, body:"AI-generated draft. Review before execution.", full:contractText(d), sellerOk:false, buyerOk:false, status:"DRAFT" };
      d.events.push({kind:"Contract generated", at:Date.now()}); save(S); toast("Draft generated"); render();
    });
    document.getElementById("appr")?.addEventListener("click", () => {
      d.contract.sellerOk = true; d.contract.buyerOk = true; d.contract.status="APPROVED"; d.status="CONTRACT_APPROVED";
      const code = "WST-COT-"+d.id.slice(-6).toUpperCase();
      d.passport = { code, stage:"Sold" };
      d.events.push({kind:"Contract approved", at:Date.now()}); save(S); toast("Recorded approval"); render();
    });
    document.getElementById("adv")?.addEventListener("click", (e) => {
      const to=e.target.dataset.to; d.status=to;
      const stage = {IN_TRANSIT:"Transported", DELIVERED:"Received", COMPLETED:"Reused"}[to];
      if (d.passport && stage) d.passport.stage=stage;
      if (to==="COMPLETED") { d.carbon = carbonFor(d); listing(d.listing).status="SOLD"; if (d.truck) { const t=S.trucks.find(x=>x.id===d.truck); if(t) t.status="AVAILABLE"; } }
      if (to==="IN_TRANSIT" && d.truck) { const t=S.trucks.find(x=>x.id===d.truck); if(t) t.status="ASSIGNED"; }
      d.events.push({kind:to, at:Date.now()}); save(S); toast("Status updated"); render();
    });
    document.getElementById("rate")?.addEventListener("click", () => { d.rated=true; save(S); toast("Rating saved"); render(); });
  }
}

window.addEventListener("hashchange", render);
render();
