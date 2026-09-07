function landing(){
  const diverted = S.deals.filter(d=>d.carbon).reduce((a,d)=>a+d.carbon.diverted,0);
  const co2 = S.deals.filter(d=>d.carbon).reduce((a,d)=>a+d.carbon.net,0);
  const featured = S.listings.filter(l=>l.status==="PUBLISHED"||l.status==="MATCHED");
  return `<div>
    <header class="wrap" style="display:flex;justify-content:space-between;align-items:center;padding:20px 16px">
      ${logo()}
      <div class="row">
        <a class="btn ghost" href="#/login">Sign in</a>
        <a class="btn" href="#/login">Create account</a>
      </div>
    </header>
    <section class="wrap" style="display:grid;gap:40px;padding:24px 16px 64px;grid-template-columns:1fr;">
      <div>
        <p class="muted" style="font-size:12px;letter-spacing:.2em;text-transform:uppercase">Industrial circular marketplace</p>
        <h1 style="font-size:clamp(32px,5vw,48px);max-width:640px;margin-top:16px">Waste isn’t waste when someone needs it.</h1>
        <p class="muted" style="max-width:520px;margin-top:16px">Wastly AI connects industrial waste with the companies, logistics and resources that can turn it into value.</p>
        <div class="row" style="margin-top:28px">
          <a class="btn" href="#/login">Sell waste →</a>
          <a class="btn sec" href="#/login">Find resources</a>
          <a class="btn out" href="#/login">Explore marketplace</a>
        </div>
      </div>
      <div class="card pad" style="background:var(--ink);color:var(--ink-fg)">
        <p style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-muted)">Demo marketplace data</p>
        ${[["Waste diverted", diverted+" t"],["Active companies", String(S.companies.length)],["Successful matches", String(S.matches.length)],["Estimated CO₂e impact", co2.toFixed(1)+" t"]].map(([k,v])=>`<div style="margin-top:14px"><div style="font-size:12px;color:var(--ink-muted)">${k}</div><div class="mono" style="font-size:22px">${v}</div></div>`).join("")}
        <p style="font-size:11px;color:var(--ink-muted);margin-top:8px">Estimated — methodology dependent.</p>
      </div>
    </section>
    <section style="border-block:1px solid var(--border);background:var(--surface)">
      <div class="wrap" style="display:grid;gap:24px;padding:48px 16px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
        ${[["Material DNA","Classify waste into a structured, editable industrial profile."],["Hybrid matching","Compatibility, quantity, distance, price, quality, logistics, trust."],["Return-route logistics","Fill empty trucks instead of dispatching new miles."],["Traceable impact","Passports, contracts and estimated carbon — never auto-issued credits."]].map(([t,d])=>`<div><h2 style="font-size:14px">${t}</h2><p class="muted" style="font-size:14px;margin-top:6px">${d}</p></div>`).join("")}
      </div>
    </section>
    <section class="wrap" style="padding:56px 16px">
      <div class="between"><div><h2 style="font-size:24px">Live demo lots</h2><p class="muted" style="font-size:14px">Seeded industrial materials. Not a claim of real-world users.</p></div>
      <a class="btn out" href="#/login">Open marketplace</a></div>
      <div class="grid" style="margin-top:20px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        ${featured.map(l=>`<div class="card pad"><p class="muted" style="font-size:12px">${l.cat}</p><h3 style="margin-top:4px">${l.name}</h3><p class="muted" style="margin-top:8px;font-size:14px">${l.qty} ${l.unit} · ${l.city}</p><p class="mono" style="margin-top:4px;font-size:14px">${inr(l.price)} / tonne</p></div>`).join("")}
      </div>
    </section>
    <footer style="border-top:1px solid var(--border);padding:32px;text-align:center;font-size:12px;color:var(--muted)">Wastly AI — demo prototype. Environmental figures are estimates. Contracts are drafts, not automatically binding. Hosted on GitHub Pages.</footer>
  </div>`;
}

function loginView(){
  return `<main style="min-height:100dvh;display:grid;place-items:center;padding:40px 16px">
    <div style="width:min(440px,100%)" class="grid">
      <a href="#/">${logo()}</a>
      <div class="card pad grid">
        <h1 style="font-size:22px">Sign in</h1>
        <p class="muted" style="font-size:14px">Email/password or a demo role. This GitHub Pages demo stores data on this device.</p>
        <label><span>Business email</span><input id="em" type="email" placeholder="you@company.com"/></label>
        <label><span>Password</span><input id="pw" type="password" placeholder="••••••••"/></label>
        <button class="btn" id="go">Sign in</button>
        <p class="muted" style="font-size:12px;letter-spacing:.12em;text-transform:uppercase">Demo accounts</p>
        ${[["seller@wastly.demo","seller"],["buyer@wastly.demo","buyer"],["logistics@wastly.demo","logistics"],["admin@wastly.demo","admin"]].map(([e,r])=>`<button class="btn out demo" data-e="${e}">Continue as ${r}</button>`).join("")}
      </div>
    </div>
  </main>`;
}

function shell(inner){
  const c = me();
  const items = c.role==="ADMIN" ? NAV.concat([["admin","Admin"]]) : NAV;
  return `<div class="shell">
    <aside class="side">
      <div style="padding:20px 16px"><a href="#/">${logo(true)}</a></div>
      <nav style="flex:1;overflow:auto;padding-bottom:16px">${items.map(([k,l])=>`<a href="#/${k}" class="${hash().startsWith("/"+k)?"on":""}">${l}</a>`).join("")}</nav>
      <div style="border-top:1px solid rgba(255,255,255,.1);padding:16px">
        <div style="font-size:14px">${c.name}</div>
        <div class="row" style="margin-top:6px"><span class="badge ink">${c.role.toLowerCase()}</span><span class="badge ok">${c.v.toLowerCase()}</span></div>
        <div style="font-size:12px;color:var(--ink-muted);margin-top:8px">Circular trust <span style="color:#fff">${c.trust}/100</span></div>
      </div>
    </aside>
    <div>
      <header class="top">
        <div style="flex:1;font-size:14px;color:var(--muted)">${S.session.name} · ${c.city}</div>
        <a href="#/notifications" class="btn ghost sm">Alerts</a>
        <button class="btn ghost sm" id="out">Sign out</button>
      </header>
      <main class="main">${inner}</main>
    </div>
  </div>`;
}

function dashboard(){
  const c = me();
  const myList = S.listings.filter(l => l.seller===c.id && ["PUBLISHED","MATCHED","DRAFT","ANALYZED"].includes(l.status));
  const m = S.matches.filter(x => x.status==="OPEN" && (listing(x.listing)?.seller===c.id || x.buyer===c.id || c.role==="ADMIN"));
  const deals = S.deals.filter(d => d.seller===c.id || d.buyer===c.id || c.role==="ADMIN");
  const active = deals.filter(d => !["COMPLETED","CANCELLED"].includes(d.status));
  const value = deals.filter(d=>d.status==="COMPLETED").reduce((a,d)=>a+(d.unitPrice||0)*d.qty,0);
  const co2 = deals.filter(d=>d.carbon).reduce((a,d)=>a+d.carbon.net,0);
  return `<div class="grid">
    <div class="between"><div><p class="muted" style="font-size:12px;letter-spacing:.16em;text-transform:uppercase">Workspace</p>
      <h1 style="font-size:26px;margin-top:4px">Good to see you, ${c.name}</h1>
      <p class="muted" style="font-size:14px">Role ${c.role.toLowerCase()} · trust ${c.trust}/100</p></div>
      ${c.role==="SELLER"||c.role==="ADMIN"?`<a class="btn" href="#/waste/new">List waste</a>`:""}
    </div>
    <div class="stats">
      ${[["Active waste", myList.length],["Recommended matches", m.length],["Active deals", active.length],["Estimated value", inr(value)],["Estimated CO₂e", co2.toFixed(1)+" t"]].map(([k,v])=>`<div class="card pad"><p class="muted" style="font-size:12px">${k}</p><p class="mono" style="font-size:22px;margin-top:4px">${v}</p></div>`).join("")}
    </div>
    <div class="card pad"><h2>Recommended matches</h2>
      ${m.length? m.slice(0,5).map(x=>{ const l=listing(x.listing); return `<a href="#/matches" class="between" style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-top:10px"><div><div style="font-size:14px;font-weight:500">${l.name}</div><div class="muted" style="font-size:12px">${co(x.buyer).name} · ${l.qty} t · ${l.city}</div></div><div class="mono primary" style="font-size:22px">${x.scores.overall}%</div></a>`; }).join("") : `<p class="muted" style="margin-top:8px;font-size:14px">No open matches yet. Publish a listing or add a buyer requirement.</p>`}
    </div>
  </div>`;
}

function wasteIndex(){
  const c = me();
  const list = c.role==="ADMIN"? S.listings : S.listings.filter(l => l.seller===c.id);
  return `<div class="grid"><div class="between"><div><h1 style="font-size:24px">Waste listings</h1><p class="muted" style="font-size:14px">Draft, analyse, publish. Matching runs on publish.</p></div>
    ${c.role==="SELLER"||c.role==="ADMIN"?`<a class="btn" href="#/waste/new">New listing</a>`:`<p class="muted" style="font-size:14px">Switch to a seller demo account to list waste.</p>`}</div>
    ${list.map(l=>`<a class="card pad between" href="#/waste/${l.id}"><div><div style="font-weight:500">${l.name}</div><div class="muted" style="font-size:14px">${l.cat} · ${l.qty} ${l.unit} · ${l.city}</div></div><div class="row"><span class="mono" style="font-size:14px">${inr(l.price)}</span><span class="badge">${l.status.toLowerCase()}</span></div></a>`).join("")||`<div class="card pad muted">No listings yet.</div>`}
  </div>`;
}

function wasteNew(){
  const c = me();
  if (c.role!=="SELLER" && c.role!=="ADMIN") return `<div class="card pad">Listing waste requires a seller role. Use Continue as seller.</div>`;
  return `<div class="grid" style="grid-template-columns:1.1fr .9fr">
    <div class="grid"><h1 style="font-size:24px">New waste listing</h1>
      <div class="card pad grid">
        <label><span>Material name</span><input id="n" value="Textile cotton waste"/></label>
        <label><span>Category</span><select id="c"><option>Cotton waste</option><option>Textile waste</option><option>Aluminium scrap</option><option>Fly ash</option><option>Plastic scrap</option></select></label>
        <label><span>Description</span><textarea id="d">Post-industrial cotton garment cuttings, colour-mixed, needle-detected.</textarea></label>
        <div class="grid" style="grid-template-columns:1fr 1fr">
          <label><span>Quantity</span><input id="q" type="number" value="8"/></label>
          <label><span>Location</span><select id="city">${Object.keys(CITIES).map(x=>`<option ${x==="Jaipur"?"selected":""}>${x}</option>`).join("")}</select></label>
          <label><span>Expected price (₹ / t)</span><input id="p" type="number" value="3000"/></label>
          <label><span>Quality</span><input id="qual" value="A / sorted"/></label>
        </div>
        <div class="row"><button class="btn" id="ai">Analyze with Wastly AI</button></div>
      </div>
    </div>
    <div class="card pad" id="dnaBox"><h2>Material DNA</h2><p class="muted" style="margin-top:8px;font-size:14px">Run analysis to generate an editable Material DNA. Demo mode uses a deterministic catalogue.</p></div>
  </div>`;
}
