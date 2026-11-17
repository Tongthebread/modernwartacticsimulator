export const COLS = 26, ROWS = 18;
export const TERRAINS = {
  desert: { name: 'Open desert', color: '#dfd1ab', foot: 1, vehicle: 1, cover: 0, attack: 0, effect: 'Open ground; normal movement and no cover.' },
  dunes: { name: 'Sand dunes', color: '#e4cda0', foot: 2, vehicle: 2, cover: 2, attack: -4, effect: 'Slow movement; −4 ground attack. Recon crosses at normal cost.' },
  ridge: { name: 'Rocky ridge', color: '#c8bc98', foot: 2, vehicle: 3, cover: 5, infantryCover: 9, attack: 6, effect: 'Strong cover; +6 ground attack and +1 range for ranged ground units. Vehicles climb slowly.' },
  urban: { name: 'Urban area', color: '#d0c6ab', foot: 1, vehicle: 2, cover: 7, infantryCover: 12, attack: 0, effect: 'Infantry gains 12 cover; vehicles gain 7 cover and move slowly. Marines gain +8 assault attack.' },
  road: { name: 'Highway', color: '#d8d0b5', foot: .5, vehicle: .5, cover: 0, attack: 0, effect: 'Half a movement point per hex; rapid advances without cover.' },
  bridge: { name: 'River bridge', color: '#bdbca6', foot: 1, vehicle: 1, cover: -3, attack: 0, effect: 'Ground crossing over the river; exposed chokepoint with −3 cover.' },
  marsh: { name: 'Marshland', color: '#9eac86', foot: 2, vehicle: 3, cover: 0, infantryCover: 5, attack: -8, effect: 'Vehicles bog down; −8 ground attack. Infantry gains light cover.' },
  palms: { name: 'Palm grove', color: '#b5bd91', foot: 1, vehicle: 2, cover: 5, infantryCover: 12, attack: 0, effect: 'Infantry moves freely with 12 cover; vehicles slow down.' },
  wadi: { name: 'Dry wadi', color: '#c6b794', foot: 2, vehicle: 2, cover: 5, attack: -2, effect: 'A sheltered dry channel; 5 cover, slow movement, and −2 ground attack.' },
  salt: { name: 'Salt flats', color: '#e8e0c5', foot: 1, vehicle: 1, cover: -4, attack: 0, effect: 'Easy to cross but exposed: −4 cover increases incoming damage.' },
  river: { name: 'River', color: '#87aaa3', foot: Infinity, vehicle: Infinity, cover: 0, attack: 0, effect: 'Ground units must find a bridge. Aircraft can cross.' },
  water: { name: 'Persian Gulf', color: '#acc0b6', foot: Infinity, vehicle: Infinity, cover: 0, attack: 0, effect: 'Impassable to ground formations; aircraft can cross.' }
};
export const TYPES = {
  tank: { name: 'M1A1 Abrams', role: 'Main battle tank', move: 3, range: 1, attack: 39, defense: 10, hp: 110, branch: 'ground' },
  mech: { name: 'M2 Bradley', role: 'Mechanized infantry', move: 3, range: 1, attack: 31, defense: 7, hp: 95, branch: 'ground' },
  infantry: { name: 'Marine infantry', role: 'Urban assault infantry', move: 2, range: 1, attack: 28, defense: 6, hp: 90, branch: 'ground', infantry: true, cost: 60, specialty: '+8 attack against ground units in urban terrain.' },
  antitank: { name: 'Anti-tank team', role: 'Infantry with guided missiles', move: 2, range: 2, attack: 23, defense: 4, hp: 75, branch: 'ground', infantry: true, armorBonus: 23, cost: 80, specialty: 'Attacks from 2 hexes; +23 attack against armored vehicles.' },
  recon: { name: 'Recon infantry', role: 'Fast reconnaissance patrol', move: 4, range: 1, attack: 20, defense: 4, hp: 70, branch: 'ground', infantry: true, cost: 75, specialty: 'Moves 4 hexes; dunes, ridges, and wadis cost only 1 movement.' },
  engineer: { name: 'Combat engineers', role: 'Vehicle repair specialists', move: 2, range: 1, attack: 18, defense: 5, hp: 85, branch: 'ground', infantry: true, cost: 80, specialty: 'Repair an adjacent allied ground vehicle by up to 30 strength for 15 supply.', support: { label: 'Repair vehicle', amount: 30, cost: 15 } },
  medic: { name: 'Combat medics', role: 'Infantry medical support', move: 3, range: 1, attack: 12, defense: 3, hp: 70, branch: 'ground', infantry: true, cost: 70, specialty: 'Heal adjacent allied foot infantry by up to 30 strength for 10 supply.', support: { label: 'Heal infantry', amount: 30, cost: 10 } },
  artillery: { name: 'M109A2 Howitzer', role: 'Long-range self-propelled artillery', move: 2, range: 5, attack: 36, defense: 4, hp: 80, branch: 'ground' },
  a10: { name: 'A-10 Thunderbolt II', role: 'Close air support', move: 5, range: 2, attack: 43, defense: 8, hp: 90, branch: 'air' },
  f16: { name: 'F-16 Fighting Falcon', role: 'Multirole fighter', move: 6, range: 3, attack: 34, defense: 8, hp: 85, branch: 'air' },
  t72: { name: 'T-72', role: 'Iraqi armored battalion', move: 2, range: 1, attack: 30, defense: 8, hp: 95, branch: 'ground' },
  iraqi: { name: 'Iraqi infantry', role: 'Defensive rifle infantry', move: 2, range: 1, attack: 24, defense: 5, hp: 75, branch: 'ground', infantry: true, terrainDefense: { urban: 5, palms: 5 }, specialty: '+5 additional cover in urban areas and palm groves.' },
  iraqi_rpg: { name: 'Iraqi RPG team', role: 'Close-range anti-armor infantry', move: 2, range: 1, attack: 21, defense: 4, hp: 70, branch: 'ground', infantry: true, armorBonus: 24, specialty: '+24 attack against armored ground vehicles. No bonus against foot infantry or aircraft.' },
  iraqi_mg: { name: 'Iraqi machine-gun team', role: 'Infantry suppression team', move: 2, range: 2, attack: 18, defense: 6, hp: 80, branch: 'ground', infantry: true, infantryBonus: 16, suppression: 8, suppressInfantryOnly: true, specialty: '2-hex range; +16 attack and −8 morale on surviving foot infantry hit.' },
  iraqi_mortar: { name: 'Iraqi mortar team', role: 'Indirect fire and suppression', move: 1, range: 3, attack: 27, defense: 2, hp: 65, branch: 'ground', infantry: true, suppression: 10, specialty: '3-hex ranged fire; surviving ground targets lose 10 morale. Slow and lightly protected.' },
  iraqi_guard: { name: 'Republican Guard infantry', role: 'Elite assault infantry', move: 2, range: 1, attack: 30, defense: 8, hp: 100, branch: 'ground', infantry: true, moraleResistance: .5, specialty: 'Higher strength and defense; halves encirclement and suppression morale losses, rounded up.' },
  aa: { name: 'ZSU-23-4 Shilka', role: 'Self-propelled anti-aircraft', move: 2, range: 2, attack: 23, defense: 5, hp: 75, branch: 'ground' },
  howitzer: { name: '2S1 Gvozdika', role: 'Iraqi field artillery', move: 1, range: 4, attack: 29, defense: 3, hp: 75, branch: 'ground' }
};
export const REINFORCEMENTS = ['infantry', 'antitank', 'recon', 'engineer', 'medic'];
export const MISSIONS = [
  { title: 'The Left Hook', subtitle: 'Flank the defensive line', date: '24 February 1991', limit: 18, description: 'Secure the western flank.', briefing: 'Coalition ground forces are crossing the border. Lead an armored thrust through the western desert, seize As Salman, and secure the approach to Al Jahra. RPG teams cover the airfield approaches, machine guns threaten your infantry, and mortars provide ranged support. Use aircraft and artillery to soften defenses before committing ground forces.', objectives: ['salman', 'airfield', 'jahra'], enemy: [[5,5,'t72'],[6,3,'iraqi'],[8,4,'iraqi_mortar'],[9,6,'iraqi_rpg'],[10,5,'iraqi_mg'],[11,3,'aa'],[12,7,'t72']] },
  { title: 'Breaking the Line', subtitle: 'Open the road to Kuwait', date: '25 February 1991', limit: 16, description: 'Break through the Iraqi defenses.', briefing: 'The western maneuver has opened the front. Push toward Safwan and Al Jahra while securing Ali Al Salem airfield. Iraqi artillery, RPG teams, and anti-aircraft units cover the approaches. Republican Guard infantry resist morale pressure, supported by machine-gun and mortar teams. Coordinate your armor and air support.', objectives: ['safwan', 'airfield', 'jahra'], enemy: [[7,5,'t72'],[8,3,'howitzer'],[10,5,'t72'],[11,3,'aa'],[9,6,'iraqi_rpg'],[11,7,'iraqi_mg'],[12,5,'iraqi_guard'],[12,2,'iraqi_mortar']] },
  { title: 'Kuwait Liberated', subtitle: 'Complete the final advance', date: '26 February 1991', limit: 16, description: 'Secure Kuwait and its approaches.', briefing: 'The final advance is underway. Secure Al Wafra and Al Jahra, then enter Kuwait City with a ground unit. Republican Guard infantry hold the northern approach, RPG teams threaten armor near Al Wafra, and mortars and machine guns support the defense. All three objectives must be held at once.', objectives: ['jahra', 'wafra', 'kuwait'], enemy: [[8,6,'t72'],[10,5,'iraqi_guard'],[12,7,'t72'],[11,6,'aa'],[10,9,'iraqi_rpg'],[12,5,'iraqi_mortar'],[11,8,'iraqi_mg'],[13,4,'iraqi_guard']] }
];
// The wider theater retains the original objectives and relative deployment geometry.
for (const mission of MISSIONS) { mission.limit+=4; mission.enemy=mission.enemy.map(([c,r,type])=>[c+4,r+2,type]); }
export const LOCATIONS = [
  { id: 'salman', name: 'As Salman', c: 4, r: 3, kind: 'city' },
  { id: 'safwan', name: 'Safwan', c: 11, r: 3, kind: 'city' },
  { id: 'jahra', name: 'Al Jahra', c: 10, r: 5, kind: 'city' },
  { id: 'airfield', name: 'Ali Al Salem airfield', c: 9, r: 6, kind: 'airfield' },
  { id: 'kuwait', name: 'Kuwait City', c: 12, r: 7, kind: 'city' },
  { id: 'wafra', name: 'Al Wafra', c: 10, r: 9, kind: 'city' },
  { id: 'basra', name: 'Basra', c: 13, r: 1, kind: 'city' },
  { id: 'khafji', name: 'Khafji', c: 12, r: 10, kind: 'city' },
  { id: 'base', name: 'Coalition staging area', c: 5, r: 10, kind: 'base' }
];
for (const location of LOCATIONS) { location.c+=4; location.r+=2; }
export const key = (c, r) => `${c},${r}`;
export const ROAD_ROUTES = [
  [[1,15],[5,14],[9,12],[13,8],[14,7],[15,5],[17,4],[18,4],[20,4]],
  [[2,6],[8,5],[10,6],[14,7],[16,9],[16,12],[17,15]],
  [[14,7],[14,11],[16,12]],
  [[17,3],[17,4]],
  [[20,4],[20,5],[20,6],[20,7],[18,8],[16,9]]
];
export function hexLine(a,b) {
  const line=[a];
  while(distance(line.at(-1),b)>0) {
    const current=line.at(-1);
    const [c,r]=neighbors(current.c,current.r).sort(([ac,ar],[bc,br])=>distance({c:ac,r:ar},b)-distance({c:bc,r:br},b))[0];
    line.push({c,r});
  }
  return line;
}
const roadHexes=new Set(ROAD_ROUTES.flatMap(route=>route.slice(1).flatMap(([c,r],i)=>hexLine({c:route[i][0],r:route[i][1]},{c,r}).map(p=>key(p.c,p.r)))));
const riverHexes=new Set([[19,0],[19,1],[19,2],[19,3],[18,4],[18,5],[19,6],[20,6],[21,6]].map(([c,r])=>key(c,r)));
export function terrain(c, r) {
  if (c>=22 || (c===21&&r>5) || (c===20&&r>10) || (c===19&&r>14) || (c===20&&[8,9].includes(r))) return 'water';
  if (LOCATIONS.some(p => p.c === c && p.r === r)) return 'urban';
  if ((c===18&&r===4)||(c===20&&r===6)) return 'bridge';
  if (riverHexes.has(key(c,r))) return 'river';
  if (roadHexes.has(key(c,r))) return 'road';
  if (c>=16&&c<=20&&r<=6&&(c+r)%3!==0) return r<=2||r===6?'marsh':'palms';
  if (c>=17&&r>=10&&r<=14) return 'salt';
  if (c>=4&&c<=12&&r>=2&&r<=6&&(c+2*r)%5<3) return 'ridge';
  if (r>=7&&r<=12&&c===11-Math.floor((r-7)/2)) return 'wadi';
  if ((c*7+r*3)%13<4&&c<16) return 'dunes';
  return 'desert';
}
export function movementCost(u,c,r) {
  if(TYPES[u.type].branch==='air')return 1;
  const t=terrain(c,r);
  if(u.type==='recon'&&['dunes','ridge','wadi'].includes(t))return 1;
  return TERRAINS[t][TYPES[u.type].infantry?'foot':'vehicle'];
}
export const morale = u => TYPES[u.type].branch==='air'?100:(u.morale ?? 100);
export const movementBudget = u => Math.max(1,TYPES[u.type].move-(morale(u)<=25?1:0));
export const attackRange = u => TYPES[u.type].range+(TYPES[u.type].branch==='ground'&&TYPES[u.type].range>1&&terrain(u.c,u.r)==='ridge'?1:0);
export function encirclement(g,u) {
  if(TYPES[u.type].branch==='air')return {enemies:0,exits:6,surrounded:false,loss:0};
  const enemyHexes=new Set(g.units.filter(v=>v.side!==u.side&&v.hp>0&&TYPES[v.type].branch==='ground').map(v=>key(v.c,v.r)));
  const adjacent=neighbors(u.c,u.r),enemies=adjacent.filter(([c,r])=>enemyHexes.has(key(c,r))).length;
  const exits=adjacent.filter(([c,r])=>Number.isFinite(movementCost(u,c,r))&&!enemyHexes.has(key(c,r))).length;
  const surrounded=enemies>=3&&exits===0;
  const loss=surrounded?25:enemies>=4?15:enemies>=3?10:0;
  return {enemies,exits,surrounded,loss:Math.ceil(loss*(1-(TYPES[u.type].moraleResistance??0)))};
}
export function updateMorale(g,side) {
  const changes=g.units.filter(u=>u.side===side&&TYPES[u.type].branch==='ground').map(u=>({u,pressure:encirclement(g,u)}));
  for(const {u,pressure} of changes) {
    const before=morale(u);u.morale=Math.max(0,Math.min(100,before+(pressure.loss?-pressure.loss:u.suppressed?0:5)));u.suppressed=false;
    if(pressure.loss&&before!==u.morale)record(g,`${u.name}: −${before-u.morale} morale (${pressure.surrounded?'surrounded':'flanked by '+pressure.enemies+' ground units'}).`,side==='coalition'?'danger':'success');
  }
}
export function upgradeGame(g) {
  if(g.version===1){
    for(const u of g.units){u.c+=4;u.r+=2;}
    // New rivers must not strand formations from a legacy battlefield.
    for(const u of g.units)if(!Number.isFinite(movementCost(u,u.c,u.r))){
      const queue=neighbors(u.c,u.r),seen=new Set([key(u.c,u.r)]);
      while(queue.length){const[c,r]=queue.shift();if(seen.has(key(c,r)))continue;seen.add(key(c,r));if(Number.isFinite(movementCost(u,c,r))&&!at(g,c,r)){u.c=c;u.r=r;break;}queue.push(...neighbors(c,r));}
    }
    g.version=2;
  }
  for(const u of g.units)u.morale??=100;
  return g;
}
export function neighbors(c, r) {
  const shift = r % 2;
  return [[c-1,r],[c+1,r],[c-1+shift,r-1],[c+shift,r-1],[c-1+shift,r+1],[c+shift,r+1]].filter(([x,y]) => x>=0 && x<COLS && y>=0 && y<ROWS);
}
export function distance(a,b) {
  const ax = a.c - (a.r - (a.r & 1))/2, bx = b.c - (b.r - (b.r & 1))/2;
  return (Math.abs(ax-bx)+Math.abs(a.r-b.r)+Math.abs(ax+a.r-bx-b.r))/2;
}
export function createGame(mission=0, completed=[]) {
  const units = [[3,9,'tank','1st Armored','US'],[5,9,'tank','1st Armoured','UK'],[6,10,'mech','24th Mechanized','US'],[8,10,'infantry','1st Marine Division','US'],[2,10,'artillery','VII Corps Artillery','US'],[4,11,'a10','354th Tactical Fighter','US'],[7,11,'f16','388th Tactical Fighter','US']].map(([c,r,type,name,nation],i)=>({id:`c${i}`,c,r,type,name,nation,side:'coalition',hp:TYPES[type].hp,moved:false,attacked:false}));
  [[9,10,'antitank','Task Force Anti-Tank'],[1,9,'recon','Forward Recon Patrol'],[4,10,'engineer','Combat Engineer Company'],[7,10,'medic','Forward Medical Section']].forEach(([c,r,type,name],i)=>units.push({id:`s${i}`,c,r,type,name,nation:'US',side:'coalition',hp:TYPES[type].hp,moved:false,attacked:false}));
  MISSIONS[mission].enemy.forEach(([c,r,type],i)=>units.push({id:`i${i}`,c,r,type,name:TYPES[type].name,nation:'IQ',side:'iraq',hp:TYPES[type].hp,moved:false,attacked:false}));
  for(const u of units){if(u.side==='coalition'){u.c+=4;u.r+=2;}u.morale=100;}
  return { version:2, mission, turn:1, phase:'coalition', supply:180, completed:[...completed], units, owners:Object.fromEntries(LOCATIONS.map(p=>[p.id,p.id==='base'?'coalition':'iraq'])), log:[{turn:1,text:'Ground offensive underway. All units report ready.',kind:'info'}], status:'active', nextId:0 };
}
export const at = (g,c,r) => g.units.find(u=>u.c===c && u.r===r);
export function reachable(g,u) {
  const result = new Map();
  if (!u || u.moved || u.attacked || g.status!=='active') return result;
  const costs = new Map([[key(u.c,u.r),0]]), queue=[[u.c,u.r]];
  while(queue.length) {
    const [c,r]=queue.shift();
    for(const [x,y] of neighbors(c,r)) {
      if(at(g,x,y)) continue;
      const cost=costs.get(key(c,r))+movementCost(u,x,y);
      if(cost>movementBudget(u) || (costs.has(key(x,y)) && costs.get(key(x,y))<=cost)) continue;
      costs.set(key(x,y),cost); result.set(key(x,y),cost); queue.push([x,y]);
    }
  }
  return result;
}
export function canAttack(g,u,target) {
  if(!u || !target || u.side===target.side || u.attacked || g.status!=='active') return false;
  if(TYPES[target.type].branch==='air' && !['aa','f16'].includes(u.type)) return false;
  return distance(u,target)<=attackRange(u);
}
export function damage(u,target) {
  const t=TYPES[u.type], d=TYPES[target.type], groundTarget=d.branch==='ground',groundAttacker=t.branch==='ground',defenderTerrain=TERRAINS[terrain(target.c,target.r)],attackerTerrain=TERRAINS[terrain(u.c,u.r)];
  const cover=groundTarget?((d.infantry?(defenderTerrain.infantryCover??defenderTerrain.cover):defenderTerrain.cover)+(d.terrainDefense?.[terrain(target.c,target.r)]??0)):0;
  let bonus=u.type==='aa' && d.branch==='air'?21:u.type==='a10' && ['tank','t72'].includes(target.type)?10:0;
  if(groundTarget&&!d.infantry)bonus+=t.armorBonus??0;
  if(groundTarget&&d.infantry)bonus+=t.infantryBonus??0;
  if(u.type==='infantry' && d.branch==='ground' && terrain(target.c,target.r)==='urban')bonus+=8;
  const terrainAttack=groundAttacker&&groundTarget?attackerTerrain.attack:0;
  return Math.max(10,Math.round((t.attack+bonus+terrainAttack)*(0.65+0.35*u.hp/t.hp)*(.55+.45*morale(u)/100)-d.defense*(.6+.4*morale(target)/100)-cover));
}
function record(g,text,kind='info') { g.log.unshift({turn:g.turn,text,kind}); g.log=g.log.slice(0,40); }
function suppress(g,u,target) {
  const t=TYPES[u.type];
  if(!t.suppression||target.hp<=0||TYPES[target.type].branch==='air'||(t.suppressInfantryOnly&&!TYPES[target.type].infantry))return;
  const loss=Math.min(morale(target),Math.ceil(t.suppression*(1-(TYPES[target.type].moraleResistance??0))));
  if(loss){target.morale=morale(target)-loss;target.suppressed=true;record(g,`${u.name} suppressed ${target.name}: −${loss} morale.`,u.side==='coalition'?'success':'danger');}
}
export function checkOutcome(g) {
  if(g.status!=='active') return;
  if(MISSIONS[g.mission].objectives.every(id=>g.owners[id]==='coalition')) {
    g.status='victory'; if(!g.completed.includes(g.mission))g.completed.push(g.mission);
    record(g,'Operation complete. All primary objectives secured.','success');
  } else if(!g.units.some(u=>u.side==='coalition' && TYPES[u.type].branch==='ground')) {
    g.status='defeat'; record(g,'Ground forces lost. The operation cannot continue.','danger');
  }
}
function capture(g,u) {
  if(TYPES[u.type].branch==='air') return;
  const p=LOCATIONS.find(p=>p.c===u.c&&p.r===u.r);
  if(p && g.owners[p.id]!==u.side) { g.owners[p.id]=u.side; record(g,`${p.name} ${u.side==='coalition'?'secured':'lost'}.`,u.side==='coalition'?'success':'danger'); }
}
export function moveUnit(g,id,c,r,side='coalition') {
  const u=g.units.find(u=>u.id===id);
  if(!u || g.phase!==side || u.side!==side || !reachable(g,u).has(key(c,r))) return false;
  u.c=c;u.r=r;u.moved=true;capture(g,u);checkOutcome(g);return true;
}
export function attack(g,id,targetId,side='coalition') {
  const u=g.units.find(u=>u.id===id),target=g.units.find(u=>u.id===targetId);
  if(!u || g.phase!==side || u.side!==side || !canAttack(g,u,target))return false;
  const hit=damage(u,target);target.hp-=hit;u.attacked=true;u.moved=true;
  record(g,`${u.name} → ${target.name}: −${hit} strength.`,side==='coalition'?'success':'danger');
  suppress(g,u,target);
  // Counterfire is limited to adjacent ground combat; aircraft draw fire from nearby AA.
  const counter=TYPES[u.type].branch==='air'?g.units.find(v=>v.side!==side&&v.type==='aa'&&distance(v,u)<=2&&v.hp>0):target.hp>0&&TYPES[target.type].branch==='ground'&&distance(u,target)===1?target:null;
  if(counter){const retaliation=Math.round(damage(counter,u)*0.45);u.hp-=retaliation;record(g,`Return fire: ${u.name} −${retaliation} strength.`,'danger');suppress(g,counter,u);}
  for(const dead of g.units.filter(v=>v.hp<=0))record(g,`${dead.name} destroyed.`,dead.side==='coalition'?'danger':'success');
  g.units=g.units.filter(v=>v.hp>0);checkOutcome(g);return hit;
}
export function repair(g,id) {
  const u=g.units.find(u=>u.id===id);
  if(!u || u.side!=='coalition'||g.phase!=='coalition'||g.status!=='active'||u.moved||u.attacked||g.supply<25||(u.hp===TYPES[u.type].hp&&morale(u)===100))return false;
  const amount=Math.min(30,TYPES[u.type].hp-u.hp),rally=Math.min(15,100-morale(u));u.hp+=amount;u.morale=morale(u)+rally;u.moved=true;u.attacked=true;g.supply-=25;record(g,`${u.name} resupplied: +${amount} strength${rally?', +'+rally+' morale':''}.`,'success');return true;
}
export function canSupport(g,u,target) {
  const ability=u&&TYPES[u.type]?.support;
  if(!ability||!target||u.id===target.id||u.side!=='coalition'||target.side!==u.side||g.phase!==u.side||g.status!=='active'||u.attacked||g.supply<ability.cost||distance(u,target)>1||target.hp>=TYPES[target.type].hp)return false;
  return u.type==='medic'?!!TYPES[target.type].infantry:TYPES[target.type].branch==='ground'&&!TYPES[target.type].infantry;
}
export function supportUnit(g,id,targetId) {
  const u=g.units.find(v=>v.id===id),target=g.units.find(v=>v.id===targetId);
  if(!canSupport(g,u,target))return false;
  const ability=TYPES[u.type].support,amount=Math.min(ability.amount,TYPES[target.type].hp-target.hp);
  target.hp+=amount;g.supply-=ability.cost;u.moved=true;u.attacked=true;
  record(g,`${u.name} ${u.type==='medic'?'healed':'repaired'} ${target.name}: +${amount} strength.`,'success');
  return amount;
}
export function reinforce(g,type='infantry') {
  if(!REINFORCEMENTS.includes(type)||g.phase!=='coalition'||g.status!=='active'||g.supply<TYPES[type].cost)return false;
  const base=LOCATIONS.find(p=>p.id==='base');
  if(g.owners.base!=='coalition')return false;
  const pos=[[base.c,base.r],...neighbors(base.c,base.r)].find(([c,r])=>!at(g,c,r)&&Number.isFinite(movementCost({type},c,r)));
  if(!pos)return false;
  g.supply-=TYPES[type].cost;const id=`r${g.nextId++}`;
  g.units.push({id,c:pos[0],r:pos[1],type,name:`Reserve ${TYPES[type].name.toLowerCase()} ${g.nextId}`,nation:'US',side:'coalition',hp:TYPES[type].hp,morale:100,moved:true,attacked:true});
  record(g,`${TYPES[type].name} reinforcements arrived at the staging area. Ready next turn.`,'success');return id;
}
export const income = g => 35+MISSIONS[g.mission].objectives.filter(id=>g.owners[id]==='coalition').length*10;
export function endTurn(g) {
  if(g.phase!=='coalition'||g.status!=='active')return false;
  g.phase='iraq';
  updateMorale(g,'iraq');
  for(const enemy of [...g.units.filter(u=>u.side==='iraq')]) {
    if(g.status!=='active')break;
    enemy.moved=false;enemy.attacked=false;
    let targets=g.units.filter(u=>u.side==='coalition');
    const attackScore=t=>damage(enemy,t)+(damage(enemy,t)>=t.hp?35:0);
    const choose=()=>targets.filter(t=>canAttack(g,enemy,t)).sort((a,b)=>attackScore(b)-attackScore(a))[0];
    let target=choose();
    if(!target) {
      const nearest=targets.filter(t=>TYPES[t.type].branch==='ground').sort((a,b)=>distance(enemy,a)-distance(enemy,b))[0];
      const held=LOCATIONS.filter(p=>MISSIONS[g.mission].objectives.includes(p.id)&&g.owners[p.id]==='coalition').sort((a,b)=>distance(enemy,a)-distance(enemy,b))[0];
      const goal=held&&(!nearest||distance(enemy,held)<distance(enemy,nearest))?held:nearest;
      // Defenders hold their sector until Coalition ground forces approach.
      if(goal && (distance(enemy,goal)<=6||held)) {
        const advanceScore=p=>Math.abs(distance(p,goal)-attackRange({...enemy,...p}));
        const options=[...reachable(g,enemy).keys()].map(k=>{const[c,r]=k.split(',').map(Number);return {c,r};}).sort((a,b)=>advanceScore(a)-advanceScore(b));
        const dest=options[0];if(dest&&distance(dest,goal)<distance(enemy,goal))moveUnit(g,enemy.id,dest.c,dest.r,'iraq');
      }
      target=choose();
    }
    if(target)attack(g,enemy.id,target.id,'iraq');
  }
  if(g.status==='active' && g.turn>=MISSIONS[g.mission].limit){g.status='defeat';record(g,'Time limit reached. Primary objectives remain contested.','danger');}
  if(g.status==='active'){updateMorale(g,'coalition');const gain=income(g);g.supply+=gain;g.turn++;record(g,`Coalition turn ${g.turn}. +${gain} supply received.`);}
  g.phase='coalition';g.units.forEach(u=>{u.moved=false;u.attacked=false;});return true;
}
