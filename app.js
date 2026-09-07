const PASS = "WastlyDemo!26";
const KEY = "wastly-pages-v1";
const NAV = [
  ["dashboard","Dashboard"],["waste","Waste"],["marketplace","Marketplace"],["matches","AI Matches"],
  ["logistics","Logistics"],["deals","Deals"],["contracts","Contracts"],["passport","Material Passport"],
  ["carbon","Carbon & ESG"],["resources","Resources"],["profile","Company Profile"]
];

const CITIES = {
  Jaipur:[26.9124,75.7873], Delhi:[28.6139,77.209], Ahmedabad:[23.0225,72.5714], Mumbai:[19.076,72.8777],
  Vadodara:[22.3072,73.1812], Kota:[25.2138,75.8648], Ludhiana:[30.901,75.8573], Surat:[21.1702,72.8311], Chennai:[13.0827,80.2707]
};

function inr(n){ return "₹" + Math.round(n).toLocaleString("en-IN"); }
function uid(p){ return p + "_" + Math.random().toString(16).slice(2,10); }
function toast(t){ const el=document.getElementById("toast"); el.textContent=t; el.classList.remove("hidden"); setTimeout(()=>el.classList.add("hidden"), 2200); }
function hash(){ return (location.hash.replace(/^#/, "") || "/"); }
function go(p){ location.hash = p.startsWith("/") ? p : "/" + p; }
function km(a,b){ const R=6371, to=d=>d*Math.PI/180; const dLat=to(b[0]-a[0]), dLon=to(b[1]-a[1]);
  const x=Math.sin(dLat/2)**2 + Math.cos(to(a[0]))*Math.cos(to(b[0]))*Math.sin(dLon/2)**2;
  return Math.round(R*2*Math.atan2(Math.sqrt(x), Math.sqrt(1-x))); }

function seed() {
  const companies = [
    {id:"co_rt", user:"seller@wastly.demo", name:"Rajasthan Textiles Pvt Ltd", city:"Jaipur", role:"SELLER", v:"VERIFIED", trust:88, auto:true, gst:"08AABCR1234M1Z5", about:"Integrated spinning mill. Generates sorted cotton and mixed garment cutting waste.", industry:"Textiles"},
    {id:"co_cy", user:"buyer@wastly.demo", name:"CircuYarn Recyclers", city:"Delhi", role:"BUYER", v:"VERIFIED", trust:91, auto:true, gst:"07AADCC8890Q1Z2", about:"Open-end recycled yarn from post-industrial cotton.", industry:"Recycling"},
    {id:"co_gh", user:"logistics@wastly.demo", name:"GreenHaul Logistics", city:"Jaipur", role:"LOGISTICS", v:"VERIFIED", trust:86, auto:true, gst:"08AAGCG4411P1Z8", about:"North India corridor. Return-load Jaipur–Delhi.", industry:"Logistics"},
    {id:"co_ops", user:"admin@wastly.demo", name:"Wastly Operations", city:"Delhi", role:"ADMIN", v:"VERIFIED", trust:99, auto:false, gst:"07AAACW0000A1Z0", about:"Platform operator.", industry:"Other"},
    {id:"co_alu", user:"seed:alu", name:"Aravalli Aluminium Extrusions", city:"Ahmedabad", role:"SELLER", v:"VERIFIED", trust:84, auto:true, gst:"24AABCA1111B1Z3", about:"6xxx process scrap.", industry:"Metals"},
    {id:"co_mc", user:"seed:mc", name:"MetalCycle India", city:"Mumbai", role:"BUYER", v:"VERIFIED", trust:90, auto:true, gst:"27AADCM2222C1Z6", about:"Secondary aluminium buyer.", industry:"Metals"},
  ];
  const listings = [
    {id:"wl_cotton", seller:"co_rt", name:"Sorted cotton cutting waste", cat:"Cotton waste", qty:8, unit:"tonnes", city:"Jaipur", price:3000, quality:"A / sorted", moisture:"7%", purity:"96% cotton", status:"MATCHED", desc:"Post-industrial cotton garment cuttings, colour-mixed, needle-detected.", dna:{ classification:"Textile Cotton Waste", composition:"Cotton fibre with mixed garment offcuts. Declared purity: 96% cotton.", condition:"A / sorted · moisture 7%", processing:"Sorting + shredding", apps:["Recycled yarn","Insulation","Industrial wiping cloth"], industries:["Textiles","Recycling"], risks:["Composition verification recommended"], conf:86, source:"DEMO" }},
    {id:"wl_alu", seller:"co_alu", name:"6063 process aluminium scrap", cat:"Aluminium scrap", qty:14, unit:"tonnes", city:"Ahmedabad", price:142000, quality:"A+", status:"SOLD", desc:"Dry extrusion press scrap.", dna:{ classification:"Non-ferrous / aluminium process scrap", composition:"Aluminium-dominant 6063", condition:"A+", processing:"Baling", apps:["Secondary ingot"], industries:["Metals"], risks:[], conf:93, source:"DEMO" }},
  ];
  listings.push(
    {id:"wl_ash", seller:"co_alu", name:"Dry fly ash — ESP hoppers", cat:"Fly ash", qty:240, unit:"tonnes", city:"Kota", price:720, quality:"Class F", status:"PUBLISHED", desc:"Dry fly ash from ESP hoppers.", dna:{classification:"Coal fly ash / pozzolanic by-product", composition:"Silica-alumina glass", condition:"Class F", processing:"Moisture control", apps:["PPC blending"], industries:["Cement"], risks:["LOI screening recommended"], conf:81, source:"DEMO"}}
  );
  const reqs = [
    {id:"req_yarn", buyer:"co_cy", title:"Cotton waste for recycled OE yarn", cat:"Cotton waste", min:5, max:12, price:2800, city:"Delhi", keywords:"textile cotton cuttings garment"},
    {id:"req_metal", buyer:"co_mc", title:"6063 / 6061 process scrap", cat:"Aluminium scrap", min:8, max:40, price:148000, city:"Mumbai", keywords:"aluminium extrusion"},
  ];
  const trucks = [
    {id:"trk1", co:"co_gh", code:"RJ-14-GH-2208", cap:10, from:"Jaipur", to:"Delhi", ret:true, pkm:34, status:"AVAILABLE"},
    {id:"trk2", co:"co_gh", code:"RJ-14-GH-1184", cap:16, from:"Jaipur", to:"Delhi", ret:false, pkm:52, status:"AVAILABLE"},
    {id:"trk3", co:"co_gh", code:"GJ-01-GH-4401", cap:18, from:"Ahmedabad", to:"Mumbai", ret:true, pkm:38, status:"AVAILABLE"},
  ];
  const matches = [
    {id:"mt_cotton", listing:"wl_cotton", buyer:"co_cy", req:"req_yarn", truck:"trk1", scores:{material:98,quantity:92,distance:78,price:88,quality:90,logistics:96,trust:90,overall:92}, km: km(CITIES.Jaipur,CITIES.Delhi), why:["Cotton family match for recycled OE yarn","8 t sits inside 5–12 t requirement","Perfect Jaipur→Delhi return route (RJ-14-GH-2208)"], status:"OPEN", explanation:"Strong material fit plus a returning 10 t closed container. Price band is close enough to negotiate."},
  ];
  const deals = [{
    id:"deal_alu", listing:"wl_alu", seller:"co_alu", buyer:"co_mc", truck:"trk3", qty:14, unit:"tonnes",
    unitPrice:140500, ask:142000, offer:138000, recL:139000, recH:141000, rec:140500,
    tcost:18600, alt:27400, pickup:"Ahmedabad, Gujarat", drop:"Mumbai, Maharashtra",
    status:"COMPLETED", messages:[{who:"SYSTEM", body:"Completed seed transaction for ESG demo."}],
    events:[{kind:"COMPLETED", at: Date.now()-86400000*4}],
    contract:{ title:"Wastly draft — aluminium scrap", body:"AI-generated draft. Review before execution — not a legally binding instrument until both parties approve.", sellerOk:true, buyerOk:true, status:"APPROVED" },
    passport:{ code:"WST-ALU-SEED01", stage:"Reused" },
    carbon:{ diverted:14, reused:12.9, virgin:11.6, transport:0.77, net:96.6, circ:86, credit:"HIGH POTENTIAL", notes:"Estimated — methodology dependent. Virgin displacement factor 8.4 tCO₂e/t (demo coefficient)." }
  }];
  const resources = [
    {id:"res1", co:"co_cy", kind:"MACHINERY", name:"Textile shredder line", city:"Delhi", cap:"2 t/hour", price:8500, unit:"₹/hour"},
    {id:"res2", co:"co_gh", kind:"WAREHOUSE", name:"Sitapura bonded bay", city:"Jaipur", cap:"240 sqm", price:18, unit:"₹/sqft/day"},
  ];
  return { companies, listings, reqs, trucks, matches, deals, resources, notes:[], activity:[
    {co:"co_rt", title:"Waste listed", at: Date.now()-3600e3},
    {co:"co_rt", title:"Buyer matched", at: Date.now()-1800e3},
  ], session:null };
}

function load(){ try { const r = JSON.parse(localStorage.getItem(KEY)); if (r && r.companies) return r; } catch {}
  const s = seed(); save(s); return s; }
function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
let S = load();

function co(id){ return S.companies.find(c => c.id===id); }
function listing(id){ return S.listings.find(l => l.id===id); }
function me(){ return S.session ? co(S.session.companyId) : null; }
function login(email){
  const c = S.companies.find(x => x.user===email);
  if (!c) return false;
  S.session = { email, companyId:c.id, name: c.role==="SELLER"?"Kavita Sharma": c.role==="BUYER"?"Arjun Mehta": c.role==="LOGISTICS"?"Imran Qureshi":"Wastly Ops" };
  save(S); return true;
}

function analyzeDNA(l){
  const fam = /cotton|textile/i.test(l.cat+l.name) ? "textile" : /alum|metal/i.test(l.cat+l.name) ? "metal" : /ash|cement/i.test(l.cat) ? "cement" : "other";
  const cat = {
    textile:{ classification:"Textile Cotton Waste", composition:"Cotton fibre with mixed garment offcuts", apps:["Recycled yarn","Insulation","Industrial wiping cloth"], industries:["Textiles","Recycling"], processing:"Sorting + shredding", risks:["Composition verification recommended"] },
    metal:{ classification:"Non-ferrous / aluminium process scrap", composition:"Aluminium-dominant mixed with trace ferrous", apps:["Secondary aluminium ingot"], industries:["Metals"], processing:"Magnetic separation + baling", risks:["Alloy grade should be confirmed"] },
    cement:{ classification:"Coal fly ash / pozzolanic by-product", composition:"Silica-alumina glass", apps:["PPC cement blending"], industries:["Cement"], processing:"Fineness classification", risks:["LOI screening recommended"] },
    other:{ classification:"Industrial by-product", composition:"To be confirmed", apps:["TBD"], industries:["Recycling"], processing:"Characterisation", risks:["Thin data"] },
  }[fam];
  l.dna = { ...cat, condition: [l.quality, l.moisture?("moisture "+l.moisture):null].filter(Boolean).join(" · ") || "As generated", conf: fam==="other"?62:86, source:"DEMO", composition: l.purity ? cat.composition+". Declared purity: "+l.purity+"." : cat.composition };
  l.name = l.dna.classification;
  l.status = l.status==="DRAFT" ? "ANALYZED" : l.status;
}

function runMatch(l){
  S.matches = S.matches.filter(m => !(m.listing===l.id && m.status==="OPEN"));
  for (const r of S.reqs){
    if (r.buyer === l.seller) continue;
    const buyer = co(r.buyer);
    const same = /cotton|textile/i.test(l.cat) && /cotton|textile/i.test(r.cat) || /alum|metal/i.test(l.cat) && /alum|metal/i.test(r.cat) || l.cat===r.cat;
    if (!same) continue;
    const dkm = km(CITIES[l.city]||CITIES.Delhi, CITIES[buyer.city]||CITIES.Delhi);
    const truck = S.trucks.find(t => t.status==="AVAILABLE" && t.from===l.city && t.to===buyer.city && t.ret) || S.trucks.find(t => t.status==="AVAILABLE" && t.from===l.city);
    const scores = { material: same?96:40, quantity: (l.qty>=r.min && l.qty<=r.max)?92:70, distance: Math.max(40, 100-dkm/15), price: 85, quality: 88, logistics: truck?.ret?96:70, trust: 88 };
    scores.overall = Math.round(scores.material*.3 + scores.quantity*.15 + scores.distance*.15 + scores.price*.15 + scores.quality*.1 + scores.logistics*.1 + scores.trust*.05);
    if (scores.overall < 45) continue;
    S.matches.unshift({ id:uid("mt"), listing:l.id, buyer:r.buyer, req:r.id, truck:truck?.id||null, scores, km:dkm, why:[
      scores.material>80?"Material family match":"Partial material fit",
      l.qty+" t vs requirement "+r.min+"–"+r.max+" t",
      truck?.ret ? "Perfect return-route match ("+truck.code+")" : (truck? "Truck "+truck.code : "No dedicated truck yet")
    ], status:"OPEN", explanation:"Hybrid score across material, quantity, distance, price, quality, logistics and trust." });
  }
  if (S.matches.some(m => m.listing===l.id)) l.status = "MATCHED";
}

function openDeal(matchId){
  const m = S.matches.find(x => x.id===matchId);
  if (!m) return;
  const exist = S.deals.find(d => d.matchId===matchId);
  if (exist) { go("/deals/"+exist.id); return; }
  const l = listing(m.listing); const buyer = co(m.buyer); const seller = co(l.seller);
  const truck = S.trucks.find(t => t.id===m.truck);
  const dist = m.km || 240;
  const tcost = truck ? Math.round(dist * (truck.ret? truck.pkm*0.55 : truck.pkm) * Math.min(l.qty, truck.cap)/10) : 12220;
  const alt = 12220;
  const rec = Math.round(((l.price||3000)+(S.reqs.find(r=>r.id===m.req)?.price||2800))/2);
  const id = uid("dl");
  S.deals.unshift({
    id, matchId, listing:l.id, seller:l.seller, buyer:m.buyer, truck:truck?.id||null, qty:l.qty, unit:l.unit,
    unitPrice: rec, ask:l.price, offer: S.reqs.find(r=>r.id===m.req)?.price||null, recL: rec-100, recH: rec+200, rec,
    tcost, alt, pickup: l.city+", India", drop: buyer.city+", India", status:"NEGOTIATING",
    messages:[
      {who:"SYSTEM", body:"Deal room opened. Neither party is legally bound until both approve a contract."},
      {who:"AI", body:"Recommended settlement "+inr(rec)+" / tonne. Demo estimate — not live market data.", suggestion: rec}
    ],
    events:[{kind:"Deal created", at: Date.now()}],
    contract:null, passport:null, carbon:null, rated:false
  });
  m.status = "DEAL_CREATED";
  save(S); go("/deals/"+id);
}

function carbonFor(d){
  const l = listing(d.listing); const dist = km(CITIES[l.city]||CITIES.Jaipur, CITIES[co(d.buyer).city]||CITIES.Delhi);
  const factor = /cotton|textile/i.test(l.cat)?2.1:/alum|metal/i.test(l.cat)?8.4:0.8;
  const reused = d.qty * 0.92; const transport = d.qty * dist * 0.000105; const net = Math.max(0, reused*0.9*factor - transport);
  return { diverted:d.qty, reused:+reused.toFixed(1), virgin:+(reused*0.9).toFixed(1), transport:+transport.toFixed(2), net:+net.toFixed(1), circ:86, credit: net>=8?"HIGH POTENTIAL":"MEDIUM POTENTIAL", notes:"Estimated — methodology dependent. Virgin displacement factor "+factor+" tCO₂e/t (demo coefficient, not a registered methodology). Wastly does not automatically create carbon credits." };
}

function logo(light){
  return `<div class="wordmark">
    <svg width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#13211A"/><circle cx="16" cy="16" r="10.5" fill="none" stroke="#D7F26E" stroke-width="1.6"/><path d="M8.5 11.2h4.2l3.3 8.2 3.3-8.2h4.2L18.6 22h-5.2L8.5 11.2z" fill="#F4F1EA"/></svg>
    <div><div style="font-size:15px;font-weight:600;${light?'color:#d7e3db':''}">Wastly AI</div><small ${light?'style="color:#8aa193"':''}>Turning waste into worth</small></div>
  </div>`;
}
