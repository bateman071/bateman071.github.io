function matchesView(){
  const c = me();
  const rows = S.matches.filter(m => m.status==="OPEN" && (c.role==="ADMIN" || listing(m.listing)?.seller===c.id || m.buyer===c.id));
  return `<div class="grid"><div><h1 style="font-size:24px">AI matches</h1><p class="muted" style="font-size:14px">Hybrid score — material, quantity, distance, price, quality, logistics, trust.</p></div>
    ${rows.map(m=>{ const l=listing(m.listing); const b=co(m.buyer); const t=S.trucks.find(x=>x.id===m.truck);
      return `<div class="card pad" style="display:grid;gap:16px;grid-template-columns:1fr">
        <div class="between"><div><p class="muted" style="font-size:12px">${co(l.seller).name} → ${b.name}</p><h2>${l.name}</h2>
          <p class="muted" style="font-size:14px">${l.qty} t · ${l.city} → ${b.city} · ${m.km} km</p></div>
          <div style="text-align:right"><div class="mono primary" style="font-size:32px">${m.scores.overall}%</div><div class="muted" style="font-size:12px">match</div></div></div>
        <p style="font-size:14px">${m.explanation}</p>
        <ul class="muted" style="font-size:14px">${m.why.map(w=>`<li>— ${w}</li>`).join("")}</ul>
        ${Object.entries(m.scores).filter(([k])=>k!=="overall").map(([k,v])=>`<div style="display:grid;grid-template-columns:90px 1fr 36px;gap:8px;align-items:center;font-size:12px"><span class="muted">${k}</span><div class="bar"><i style="width:${v}%"></i></div><span class="mono">${v}</span></div>`).join("")}
        <div class="row"><span class="badge ok">${b.v.toLowerCase()}</span><span class="muted" style="font-size:12px">${t? "Truck "+t.code+(t.ret?" · return route":""):"No dedicated truck yet"}</span></div>
        <button class="btn deal" data-id="${m.id}">Create deal</button>
      </div>`; }).join("") || `<div class="card pad muted">No compatible buyers yet. Publish a listing.</div>`}
  </div>`;
}

function dealRoom(id){
  const d = S.deals.find(x=>x.id===id); if (!d) return `<p class="muted">Deal not found</p>`;
  const l = listing(d.listing); const s=co(d.seller); const b=co(d.buyer); const t=S.trucks.find(x=>x.id===d.truck);
  const lastSug = [...d.messages].reverse().find(m=>m.suggestion);
  const next = {CONTRACT_APPROVED:"IN_TRANSIT", IN_TRANSIT:"DELIVERED", DELIVERED:"COMPLETED"}[d.status];
  const nextL = {IN_TRANSIT:"Mark picked up / in transit", DELIVERED:"Mark delivered", COMPLETED:"Complete transaction"}[next];
  return `<div class="grid">
    <div class="between"><div><p class="muted" style="font-size:12px">Deal room</p><h1 style="font-size:24px">${l.name}</h1>
      <p class="muted" style="font-size:14px">${s.name} → ${b.name} · ${d.qty} ${d.unit}</p></div>
      <span class="badge ${d.status==="COMPLETED"?"ok":""}">${d.status.toLowerCase()}</span></div>
    <div class="stats">
      ${[["Seller ask", inr(d.ask||0)],["Buyer offer", d.offer?inr(d.offer):"—"],["Recommended", inr(d.recL)+"–"+inr(d.recH)],["Working price", inr(d.unitPrice||d.rec)]].map(([k,v])=>`<div class="card pad"><p class="muted" style="font-size:12px">${k}</p><p class="mono" style="font-size:18px;margin-top:4px">${v}</p><p class="muted" style="font-size:11px;margin-top:4px">${k==="Recommended"?"Demo estimate — not live market data.":""}</p></div>`).join("")}
    </div>
    <div class="card pad" style="display:grid;gap:12px;grid-template-columns:1fr">
      <h2>Logistics</h2>
      <p class="primary" style="font-size:14px">${t?.ret?"Perfect return-route match":"Assigned truck"}</p>
      <p style="font-size:14px">Estimated transport cost ${inr(d.tcost)} · alternative ${inr(d.alt)} · estimated saving ${inr(d.alt-d.tcost)}</p>
      <p class="muted" style="font-size:12px">${t? t.code+" · "+t.cap+" t · "+t.from+" → "+t.to : ""}</p>
      <div class="map"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M12 28 C 40 8, 60 8, 88 12" fill="none" stroke="#147a4b" stroke-width="1.4"/><circle cx="12" cy="28" r="2.2" fill="#147a4b"/><circle cx="88" cy="12" r="2.2" fill="#13211a"/></svg>
        <span style="position:absolute;left:8px;bottom:8px;font-size:11px">${l.city}</span>
        <span style="position:absolute;right:8px;top:8px;font-size:11px">${b.city}</span></div>
    </div>
    <div class="grid" style="grid-template-columns:1.2fr .8fr">
      <div class="card pad grid">
        <h2>Negotiation</h2>
        <div class="grid" style="max-height:280px;overflow:auto">${d.messages.map(m=>`<div class="msg"><div class="muted" style="font-size:11px;letter-spacing:.08em">${m.who}</div><div>${m.body}</div></div>`).join("")}</div>
        <div class="row">
          <button class="btn out" id="aiNego">Ask Wastly AI</button>
          ${lastSug && d.unitPrice!==lastSug.suggestion ? `<button class="btn sm" id="accSug" data-p="${lastSug.suggestion}">Accept suggestion</button>`: lastSug? `<p class="muted" style="font-size:13px">Working price is the AI suggestion (${inr(lastSug.suggestion)} / t) — not legally binding.</p>`:""}
        </div>
        ${d.status==="NEGOTIATING"||d.status==="DRAFT"?`<button class="btn" id="accDeal">Accept deal at ${inr(d.unitPrice||d.rec)}</button>`:""}
      </div>
      <div class="card pad grid">
        <h2>Timeline</h2>
        ${d.events.map(e=>`<div style="font-size:13px"><b>${e.kind}</b><div class="muted">${new Date(e.at).toLocaleString()}</div></div>`).join("")}
        <p style="font-size:13px">Pickup ${d.pickup}<br>Delivery ${d.drop}</p>
        ${d.status==="AGREED"?`<button class="btn" id="genCt">Generate contract</button>`:""}
        ${next?`<button class="btn sec" id="adv" data-to="${next}">${nextL}</button>`:""}
      </div>
    </div>
    ${d.contract? `<div class="card pad grid"><div class="between"><h2>${d.contract.title}</h2><p class="muted" style="font-size:12px;color:var(--warn)">${d.contract.body.split(".")[0]}. Review before execution — not a legally binding instrument until both parties approve.</p></div>
      <pre>${d.contract.full}</pre>
      <div class="row"><button class="btn" id="appr" ${d.contract.status==="APPROVED"?"disabled":""}>Approve</button></div>
      <p class="muted" style="font-size:12px">Seller ${d.contract.sellerOk?"approved":"pending"} · Buyer ${d.contract.buyerOk?"approved":"pending"}</p></div>`:""}
    ${d.passport? `<div class="card pad between"><div><h2>Material passport ${d.passport.code}</h2><p class="muted">Stage ${d.passport.stage}</p><a class="primary" href="#/p/${d.passport.code}">Public view</a></div><div class="qr" title="QR"></div></div>`:""}
    ${d.carbon? `<div class="card pad grid"><h2>Carbon assessment</h2><p>Waste diverted ${d.carbon.diverted} t</p><p>Net estimated CO₂e ${d.carbon.net} t</p><p>Credit potential ${d.carbon.credit}</p><p class="muted" style="font-size:12px">${d.carbon.notes}</p></div>`:""}
    ${d.status==="COMPLETED" && !d.rated? `<div class="card pad row"><span>Rate counterparty</span><button class="btn sec" id="rate">Submit 5★ rating</button></div>`: d.rated? `<p class="muted">Rating saved.</p>`:""}
  </div>`;
}

function contractText(d){
  const l=listing(d.listing); const s=co(d.seller); const b=co(d.buyer);
  return `WASTLY AI — DRAFT TRANSACTION TERMS
(AI-generated. Not a legally binding instrument until both parties approve.)

Parties
Seller: ${s.name} (${s.gst}), ${s.city}
Buyer: ${b.name} (${b.gst}), ${b.city}

Material
${l.name} / ${l.cat}
Quantity: ${d.qty} ${d.unit}
Quality: ${l.quality||"—"}

Commercial
Unit price: ${inr(d.unitPrice)} per tonne
Goods value: ${inr(d.unitPrice*d.qty)}
Estimated transport: ${inr(d.tcost)} (return-route optimisation where applicable)

Logistics
Pickup: ${d.pickup}
Delivery: ${d.drop}
${S.trucks.find(t=>t.id===d.truck)? "Vehicle "+S.trucks.find(t=>t.id===d.truck).code : ""}

Disclaimer
Wastly AI generated this draft from deal-room inputs. It is a suggestion only. Environmental claims are estimated — methodology dependent. Wastly does not issue carbon credits and does not execute contracts on behalf of either party.`;
}
