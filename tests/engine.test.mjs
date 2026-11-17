import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COLS, ROWS, TERRAINS, morale, movementCost, movementBudget, attackRange, encirclement, updateMorale, upgradeGame, TYPES, REINFORCEMENTS, MISSIONS, LOCATIONS, createGame, terrain, neighbors, distance, reachable, key, moveUnit, attack, damage, canAttack, canSupport, supportUnit, repair, reinforce, endTurn, checkOutcome, income } from '../engine.js';

test('all three scenarios have valid, distinct deployments and capturable objectives', () => {
  for(let i=0;i<MISSIONS.length;i++) {
    const g=createGame(i);
    assert.equal(new Set(g.units.map(u=>key(u.c,u.r))).size,g.units.length);
    for(const u of g.units) { assert.ok(u.c>=0&&u.c<COLS&&u.r>=0&&u.r<ROWS);assert.notEqual(terrain(u.c,u.r),'water'); }
    for(const id of MISSIONS[i].objectives) { const p=LOCATIONS.find(p=>p.id===id);assert.ok(p);assert.notEqual(terrain(p.c,p.r),'water'); }
  }
});
test('hex distances match adjacent neighbors on both row parities', () => {
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)for(const [x,y] of neighbors(c,r)) {
    assert.equal(distance({c,r},{c:x,r:y}),1);assert.equal(distance({c:x,r:y},{c,r}),1);
  }
});
test('movement uses terrain costs, avoids occupied hexes, and is limited to once per turn', () => {
  const g=createGame(),u=g.units[0], options=reachable(g,u);
  assert.ok(options.size>0);
  for(const v of g.units)assert.equal(options.has(key(v.c,v.r)),false);
  for(const [k,cost] of options){const[c,r]=k.split(',').map(Number);assert.notEqual(terrain(c,r),'water');assert.ok(cost<=TYPES[u.type].move);}
  const[c,r]=options.keys().next().value.split(',').map(Number);
  assert.ok(moveUnit(g,u.id,c,r));assert.equal(reachable(g,u).size,0);assert.equal(moveUnit(g,u.id,0,0),false);
});
test('ground units cannot cross water; aircraft can fly over it', () => {
  const g=createGame();g.units=g.units.filter(u=>u.id==='c0'||u.type==='a10');
  const ground=g.units.find(u=>u.type==='tank'),air=g.units.find(u=>u.type==='a10');ground.c=20;ground.r=7;air.c=20;air.r=5;
  assert.equal(reachable(g,ground).has('21,7'),false);assert.equal(reachable(g,air).has('21,7'),true);
});
test('attacking spends orders, applies deterministic damage and adjacent counterfire', () => {
  const g=createGame(),u=g.units[0],v=g.units.find(v=>v.side==='iraq');v.c=u.c+1;v.r=u.r;
  const before=v.hp,ownBefore=u.hp,expected=damage(u,v);assert.ok(canAttack(g,u,v));assert.equal(attack(g,u.id,v.id),expected);
  assert.equal(v.hp,before-expected);assert.ok(u.hp<ownBefore);assert.equal(u.attacked,true);assert.equal(u.moved,true);assert.equal(attack(g,u.id,v.id),false);
});
test('air strikes cannot capture objectives and draw nearby anti-air fire', () => {
  const g=createGame(),air=g.units.find(u=>u.type==='a10'),aa=g.units.find(u=>u.type==='aa'),p=LOCATIONS.find(p=>p.id==='salman');
  air.c=p.c-1;air.r=p.r;assert.ok(moveUnit(g,air.id,p.c,p.r));assert.equal(g.owners.salman,'iraq');
  aa.c=p.c+1;aa.r=p.r;const before=air.hp;assert.ok(attack(g,air.id,aa.id));assert.ok(air.hp<before);
  const tank=g.units[0];tank.c=4;tank.r=4;assert.equal(canAttack(g,tank,air),false);
});
test('ground capture wins only when every primary objective is held and unlocks progression', () => {
  const g=createGame(),u=g.units[0];g.units=g.units.filter(v=>v===u);
  for(const id of MISSIONS[0].objectives){const p=LOCATIONS.find(p=>p.id===id);u.c=p.c-1;u.r=p.r;u.moved=false;u.attacked=false;assert.ok(moveUnit(g,u.id,p.c,p.r));assert.equal(g.owners[id],'coalition');}
  assert.equal(g.status,'victory');assert.deepEqual(g.completed,[0]);assert.equal(endTurn(g),false);
});
test('resupply charges supply, restores only missing strength, and consumes orders', () => {
  const g=createGame(),u=g.units[0];assert.equal(repair(g,u.id),false);u.hp-=12;
  assert.ok(repair(g,u.id));assert.equal(u.hp,TYPES[u.type].hp);assert.equal(g.supply,155);assert.equal(repair(g,u.id),false);assert.equal(reachable(g,u).size,0);
});
test('reinforcements spawn at the staging area, spend supply, and wait for the next turn', () => {
  const g=createGame(),id=reinforce(g),u=g.units.find(u=>u.id===id);assert.ok(id);assert.equal(g.supply,120);assert.equal(u.c,LOCATIONS.find(p=>p.id==='base').c);assert.equal(u.r,LOCATIONS.find(p=>p.id==='base').r);assert.equal(u.attacked,true);
  g.supply=59;assert.equal(reinforce(g),false);
});
test('enemy turns advance time, add objective income, and reset player orders', () => {
  const g=createGame();g.units=g.units.filter(u=>u.side==='coalition');g.owners.salman='coalition';g.units[0].moved=true;
  const before=g.supply;assert.equal(income(g),45);assert.ok(endTurn(g));assert.equal(g.turn,2);assert.equal(g.supply,before+45);assert.equal(g.phase,'coalition');assert.equal(g.units[0].moved,false);
});
test('AI engages nearby units and cannot overlap formations', () => {
  const g=createGame(),enemy=g.units.find(u=>u.type==='t72'),player=g.units[0];g.units=[player,enemy];enemy.c=5;enemy.r=9;
  const hp=player.hp;endTurn(g);assert.ok(player.hp<hp);assert.notEqual(key(player.c,player.r),key(enemy.c,enemy.r));assert.equal(g.turn,2);
});
test('time limit and losing all ground forces cause defeat', () => {
  const g=createGame();g.turn=MISSIONS[0].limit;endTurn(g);assert.equal(g.status,'defeat');assert.equal(g.turn,MISSIONS[0].limit);
  const h=createGame();h.units=h.units.filter(u=>u.side==='iraq'||TYPES[u.type].branch==='air');checkOutcome(h);assert.equal(h.status,'defeat');
});
test('out-of-turn, friendly-fire and post-victory commands are rejected', () => {
  const g=createGame(),a=g.units[0],b=g.units[1];assert.equal(attack(g,a.id,b.id),false);g.phase='iraq';assert.equal(moveUnit(g,a.id,3,8),false);assert.equal(repair(g,a.id),false);assert.equal(reinforce(g),false);
  g.phase='coalition';g.status='victory';assert.equal(moveUnit(g,a.id,3,8),false);assert.equal(attack(g,a.id,g.units.find(u=>u.side==='iraq').id),false);
});

test('artillery reaches its extended range, rejects targets beyond it, and fires without distant counterfire', () => {
  for(const [mission,type,range] of [[0,'artillery',5],[1,'howitzer',4]]) {
    const g=createGame(mission),gun=g.units.find(u=>u.type===type),target=g.units.find(u=>u.side!==gun.side&&u.type==='tank')||g.units.find(u=>u.side!==gun.side);
    g.units=[gun,target];gun.c=2;gun.r=4;target.c=2+range;target.r=4;
    assert.equal(TYPES[type].range,range);assert.equal(canAttack(g,gun,target),true);
    target.c++;assert.equal(canAttack(g,gun,target),false);target.c--;
    g.phase=gun.side;const before=gun.hp;assert.ok(attack(g,gun.id,target.id,gun.side));assert.equal(gun.hp,before);
  }
});

test('anti-tank teams have ranged vehicle damage and Marines specialize in urban assaults', () => {
  const g=createGame(),at=g.units.find(u=>u.type==='antitank'),target=g.units.find(u=>u.type==='t72'),marine=g.units.find(u=>u.type==='infantry');
  at.c=11;at.r=15;target.c=13;target.r=15;marine.c=11;marine.r=15;
  assert.equal(canAttack(g,at,target),true);assert.equal(damage(at,target),38);
  const foot={...target,type:'iraqi',hp:TYPES.iraqi.hp};assert.equal(damage(at,foot),18);
  target.c=14;assert.equal(canAttack(g,at,target),false);
  foot.c=16;foot.r=9;assert.equal(terrain(foot.c,foot.r),'urban');assert.equal(damage(marine,foot),14);
  foot.c=13;foot.r=15;assert.equal(damage(marine,foot),23);
});

test('recon crosses rough terrain at normal cost while regular infantry slows down', () => {
  const g=createGame(),scout=g.units.find(u=>u.type==='recon'),marine=g.units.find(u=>u.type==='infantry');
  let destination,start;
  for(let r=1;r<9&&!start;r++)for(let c=1;c<9&&!start;c++)if(['dunes','ridge'].includes(terrain(c,r))){destination={c,r};const[x,y]=neighbors(c,r)[0];start={c:x,r:y};}
  Object.assign(scout,start);g.units=[scout];assert.equal(reachable(g,scout).get(key(destination.c,destination.r)),1);
  Object.assign(marine,start);g.units=[marine];assert.equal(reachable(g,marine).get(key(destination.c,destination.r)),2);
  assert.equal(TYPES.recon.move,4);
});

test('engineers repair after moving, spend supply, and leave recipient orders available', () => {
  const g=createGame(),engineer=g.units.find(u=>u.type==='engineer'),tank=g.units[0];g.units=[engineer,tank];
  engineer.c=0;engineer.r=10;tank.c=1;tank.r=10;tank.hp-=45;engineer.moved=true;
  assert.equal(canSupport(g,engineer,tank),true);assert.equal(supportUnit(g,engineer.id,tank.id),30);
  assert.equal(tank.hp,95);assert.equal(g.supply,165);assert.equal(engineer.attacked,true);assert.equal(tank.moved,false);assert.equal(tank.attacked,false);
  assert.equal(supportUnit(g,engineer.id,tank.id),false);assert.equal(reachable(g,engineer).size,0);
});

test('medics heal only missing infantry strength and cannot heal vehicles, enemies, or themselves', () => {
  const g=createGame(),medic=g.units.find(u=>u.type==='medic'),marine=g.units.find(u=>u.type==='infantry'),tank=g.units[0];
  g.units=[medic,marine,tank];medic.c=0;medic.r=10;marine.c=1;marine.r=10;marine.hp-=8;tank.c=0;tank.r=9;tank.hp-=20;medic.hp-=10;
  assert.equal(canSupport(g,medic,tank),false);assert.equal(canSupport(g,medic,medic),false);
  marine.side='iraq';assert.equal(canSupport(g,medic,marine),false);marine.side='coalition';
  assert.equal(supportUnit(g,medic.id,marine.id),8);assert.equal(marine.hp,TYPES.infantry.hp);assert.equal(g.supply,170);assert.equal(medic.attacked,true);
});

test('support rejects invalid range, unit class, supply, phase, and ended operations without side effects', () => {
  const g=createGame(),engineer=g.units.find(u=>u.type==='engineer'),tank=g.units[0];g.units=[engineer,tank];
  engineer.c=0;engineer.r=10;tank.c=3;tank.r=10;tank.hp-=20;
  assert.equal(supportUnit(g,engineer.id,tank.id),false);tank.c=1;
  for(const type of ['infantry','a10']){const old=tank.type;tank.type=type;assert.equal(supportUnit(g,engineer.id,tank.id),false);tank.type=old;}
  g.supply=14;assert.equal(supportUnit(g,engineer.id,tank.id),false);g.supply=180;
  g.phase='iraq';assert.equal(supportUnit(g,engineer.id,tank.id),false);g.phase='coalition';
  g.status='victory';assert.equal(supportUnit(g,engineer.id,tank.id),false);g.status='active';
  assert.equal(supportUnit(g,'missing',tank.id),false);assert.equal(supportUnit(g,engineer.id,'missing'),false);
  assert.equal(g.supply,180);assert.equal(tank.hp,90);assert.equal(engineer.attacked,false);
});

test('each infantry role can be recruited at its own price, including into older formations', () => {
  for(const type of REINFORCEMENTS){
    const g=createGame();g.units=g.units.filter(u=>!u.id.startsWith('s'));const id=reinforce(g,type),u=g.units.find(u=>u.id===id);
    assert.equal(u.type,type);assert.equal(u.hp,TYPES[type].hp);assert.equal(g.supply,180-TYPES[type].cost);assert.equal(u.attacked,true);
    g.supply=TYPES[type].cost-1;const before=JSON.stringify(g);assert.equal(reinforce(g,type),false);assert.equal(JSON.stringify(g),before);
  }
  const g=createGame();for(const type of ['tank','__proto__',null])assert.equal(reinforce(g,type),false);
  const base=LOCATIONS.find(p=>p.id==='base');g.units=[[base.c,base.r],...neighbors(base.c,base.r)].map(([c,r],i)=>({id:`block${i}`,c,r}));
  assert.equal(reinforce(g,'medic'),false);assert.equal(g.supply,180);
});

const formation=(id,type,side,c,r)=>({id,type,side,c,r,name:id,nation:side==='coalition'?'US':'IQ',hp:TYPES[type].hp,morale:100,moved:false,attacked:false});

test('expanded theater contains every terrain and preserves land deployments', () => {
  assert.equal(COLS*ROWS,468);
  const found=new Set();for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)found.add(terrain(c,r));
  assert.deepEqual([...found].sort(),Object.keys(TERRAINS).sort());
  for(let i=0;i<MISSIONS.length;i++)for(const u of createGame(i).units)assert.ok(Number.isFinite(movementCost(u,u.c,u.r)));
});

test('terrain differentiates foot and vehicle movement, roads, rivers, and bridges', () => {
  const foot=formation('foot','infantry','coalition',0,0),tank=formation('tank','tank','coalition',0,0),air=formation('air','a10','coalition',0,0),scout={...foot,type:'recon'};
  const find=type=>{for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(terrain(c,r)===type)return[c,r];};
  assert.equal(movementCost(foot,...find('road')),.5);assert.equal(movementCost(tank,...find('road')),.5);
  assert.equal(movementCost(foot,...find('ridge')),2);assert.equal(movementCost(tank,...find('ridge')),3);assert.equal(movementCost(scout,...find('ridge')),1);
  assert.equal(movementCost(foot,...find('palms')),1);assert.equal(movementCost(tank,...find('palms')),2);
  assert.equal(movementCost(foot,...find('marsh')),2);assert.equal(movementCost(tank,...find('marsh')),3);
  assert.equal(movementCost(tank,19,3),Infinity);assert.equal(movementCost(air,19,3),1);assert.equal(movementCost(tank,18,4),1);
  const g=createGame();g.units=[tank];tank.c=17;tank.r=4;
  assert.equal(reachable(g,tank).has('18,4'),true);assert.equal(reachable(g,tank).has('18,5'),false);
});

test('high ground improves attack and ranged reach while cover and exposure change damage', () => {
  const cells=type=>{for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(terrain(c,r)===type)return {c,r};};
  const gun=formation('gun','artillery','coalition',0,0),target=formation('target','t72','iraq',14,15);
  Object.assign(gun,cells('desert'));const base=damage(gun,target);assert.equal(attackRange(gun),5);
  Object.assign(gun,cells('ridge'));assert.equal(attackRange(gun),6);assert.ok(damage(gun,target)>base);
  Object.assign(gun,cells('marsh'));assert.ok(damage(gun,target)<base);
  Object.assign(gun,cells('desert'));Object.assign(target,cells('salt'));assert.ok(damage(gun,target)>base);
  Object.assign(target,cells('urban'));assert.ok(damage(gun,target)<base);
  const aircraft={...gun,type:'a10'};Object.assign(aircraft,cells('ridge'));const aerial=damage(aircraft,target);
  Object.assign(aircraft,cells('marsh'));assert.equal(damage(aircraft,target),aerial);assert.equal(attackRange(aircraft),2);
});

test('three and four adjacent enemies lower morale; full encirclement has the strongest penalty', () => {
  const g=createGame(),defender=formation('defender','t72','iraq',10,10),ring=neighbors(10,10);
  const attackers=ring.map(([c,r],i)=>formation(`flanker${i}`,'infantry','coalition',c,r));
  g.units=[defender,...attackers.slice(0,2)];assert.equal(encirclement(g,defender).loss,0);
  g.units=[defender,...attackers.slice(0,3)];assert.equal(encirclement(g,defender).loss,10);updateMorale(g,'iraq');assert.equal(defender.morale,90);
  g.units=[defender,...attackers.slice(0,4)];assert.equal(encirclement(g,defender).loss,15);updateMorale(g,'iraq');assert.equal(defender.morale,75);
  g.units=[defender,...attackers];assert.equal(encirclement(g,defender).surrounded,true);assert.equal(encirclement(g,defender).loss,25);updateMorale(g,'iraq');assert.equal(defender.morale,50);
});

test('aircraft and friendly units cannot cause encirclement; terrain can close escape routes', () => {
  const g=createGame(),defender=formation('defender','infantry','coalition',21,4);
  const land=neighbors(defender.c,defender.r).filter(([c,r])=>Number.isFinite(movementCost(defender,c,r)));
  g.units=[defender,...land.map(([c,r],i)=>formation(`enemy${i}`,'iraqi','iraq',c,r))];
  assert.ok(land.length>=3&&land.length<6);assert.equal(encirclement(g,defender).surrounded,true);
  for(const u of g.units.slice(1))u.type='a10';assert.equal(encirclement(g,defender).loss,0);
  for(const u of g.units.slice(1)){u.type='infantry';u.side='coalition';}assert.equal(encirclement(g,defender).loss,0);
  defender.type='f16';defender.morale=10;assert.equal(encirclement(g,defender).loss,0);assert.equal(morale(defender),100);assert.equal(movementBudget(defender),TYPES.f16.move);
});

test('low morale weakens combat, reduces movement when broken, and recovers after relief', () => {
  const g=createGame(),u=formation('unit','tank','coalition',12,15),target=formation('enemy','t72','iraq',13,15);g.units=[u,target];
  const baseline=damage(u,target);u.morale=25;assert.ok(damage(u,target)<baseline);assert.equal(movementBudget(u),2);
  u.morale=100;target.morale=25;assert.ok(damage(u,target)>baseline);
  target.morale=0;updateMorale(g,'iraq');assert.equal(target.morale,5);target.morale=98;updateMorale(g,'iraq');assert.equal(target.morale,100);
  u.morale=50;assert.equal(repair(g,u.id),true);assert.equal(u.morale,65);assert.equal(u.hp,TYPES.tank.hp);assert.equal(g.supply,155);assert.equal(u.attacked,true);
});

test('morale is applied at side turn boundaries and survives save roundtrips', () => {
  const g=createGame(),defender=formation('defender','t72','iraq',10,10);
  g.units=[defender,...neighbors(10,10).map(([c,r],i)=>formation(`ally${i}`,'tank','coalition',c,r))];
  const player=g.units[1];assert.equal(attack(g,player.id,defender.id)>0,true);assert.equal(defender.morale,100);
  endTurn(g);assert.equal(defender.morale,75);assert.ok(g.log.some(l=>l.text.includes('−25 morale')));
  assert.equal(JSON.parse(JSON.stringify(g)).units.find(u=>u.id==='defender').morale,75);
});

test('legacy saves migrate once without losing campaign state or stranding ground formations', () => {
  const g=createGame(1,[0]);g.version=1;g.turn=4;g.supply=77;
  for(const u of g.units){u.c-=4;u.r-=2;delete u.morale;}
  const original={c:g.units[0].c,r:g.units[0].r};g.units[1].c=14;g.units[1].r=3;
  upgradeGame(g);assert.equal(g.version,2);assert.deepEqual([g.mission,g.turn,g.supply,g.completed],[1,4,77,[0]]);
  assert.deepEqual([g.units[0].c,g.units[0].r],[original.c+4,original.r+2]);assert.ok(g.units.every(u=>u.morale===100));
  assert.ok(Number.isFinite(movementCost(g.units[1],g.units[1].c,g.units[1].r)));
  assert.equal(new Set(g.units.map(u=>key(u.c,u.r))).size,g.units.length);
  const saved=JSON.stringify(g);upgradeGame(g);assert.equal(JSON.stringify(g),saved);
});

test('Iraqi RPG teams gain damage against armored vehicles, not infantry or aircraft', () => {
  const g=createGame(),rpg=formation('rpg','iraqi_rpg','iraq',12,15),tank=formation('tank','tank','coalition',13,15);
  g.units=[rpg,tank];g.phase='iraq';
  assert.equal(damage(rpg,tank),35);assert.ok(canAttack(g,rpg,tank));
  const mech={...tank,type:'mech',hp:TYPES.mech.hp};assert.equal(damage(rpg,mech),38);
  const foot={...tank,type:'infantry',hp:TYPES.infantry.hp};assert.equal(damage(rpg,foot),15);
  assert.equal(canAttack(g,rpg,{...tank,type:'a10',hp:TYPES.a10.hp}),false);
  tank.c=14;assert.equal(canAttack(g,rpg,tank),false);tank.c=13;
  assert.equal(attack(g,rpg.id,tank.id,'iraq'),35);assert.equal(tank.hp,75);assert.equal(tank.morale,100);
});

test('machine guns specialize in foot infantry and suppress surviving targets', () => {
  const g=createGame(),mg=formation('mg','iraqi_mg','iraq',11,15),foot=formation('foot','infantry','coalition',13,15);
  g.units=[mg,foot];g.phase='iraq';
  assert.equal(damage(mg,foot),28);assert.equal(attack(g,mg.id,foot.id,'iraq'),28);assert.equal(foot.morale,92);
  updateMorale(g,'coalition');assert.equal(foot.morale,92);updateMorale(g,'coalition');assert.equal(foot.morale,97);
  const h=createGame(),gun=formation('mg','iraqi_mg','iraq',11,15),tank=formation('tank','tank','coalition',13,15);h.units=[gun,tank];h.phase='iraq';
  assert.equal(damage(gun,tank),10);assert.equal(attack(h,gun.id,tank.id,'iraq'),10);assert.equal(tank.morale,100);
});

test('mortars fire at range, suppress armor, and clamp morale at zero', () => {
  const g=createGame(),mortar=formation('mortar','iraqi_mortar','iraq',10,15),tank=formation('tank','tank','coalition',13,15);g.units=[mortar,tank];g.phase='iraq';
  assert.equal(attackRange(mortar),3);assert.ok(canAttack(g,mortar,tank));
  tank.c=14;assert.equal(canAttack(g,mortar,tank),false);tank.c=13;tank.morale=4;
  const before=mortar.hp;assert.ok(attack(g,mortar.id,tank.id,'iraq'));assert.equal(tank.morale,0);assert.equal(mortar.hp,before);
  assert.equal(JSON.parse(JSON.stringify(g)).units.find(u=>u.id==='tank').suppressed,true);
  updateMorale(g,'coalition');assert.equal(tank.morale,0);assert.equal(tank.suppressed,false);
});

test('Republican Guard infantry resist both encirclement and suppression', () => {
  const g=createGame(),guard=formation('guard','iraqi_guard','iraq',10,10);
  g.units=[guard,...neighbors(10,10).map(([c,r],i)=>formation(`ally${i}`,'infantry','coalition',c,r))];
  assert.equal(encirclement(g,guard).loss,13);updateMorale(g,'iraq');assert.equal(guard.morale,87);
  const h=createGame(),mortar=formation('mortar','iraqi_mortar','iraq',10,15),elite=formation('guard','iraqi_guard','coalition',13,15);h.units=[mortar,elite];h.phase='iraq';
  assert.ok(attack(h,mortar.id,elite.id,'iraq'));assert.equal(elite.morale,95);
});

test('Iraqi rifle infantry receive additional cover in towns and palm groves', () => {
  const air=formation('air','a10','coalition',12,15),rifle=formation('rifle','iraqi','iraq',16,9),rpg={...rifle,type:'iraqi_rpg',hp:TYPES.iraqi_rpg.hp};
  assert.equal(damage(air,rifle),21);assert.equal(damage(air,rpg),27);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(terrain(c,r)==='palms'){
    Object.assign(rifle,{c,r});Object.assign(rpg,{c,r});assert.equal(damage(air,rifle),21);assert.equal(damage(air,rpg),27);
  }
});

test('suppression applies to return fire and does not apply to destroyed targets', () => {
  const g=createGame(),marine=formation('marine','infantry','coalition',12,15),mg=formation('mg','iraqi_mg','iraq',13,15);g.units=[marine,mg];
  assert.ok(attack(g,marine.id,mg.id));assert.equal(marine.morale,92);
  const h=createGame(),gun=formation('mg','iraqi_mg','iraq',11,15),target=formation('marine','infantry','coalition',13,15);h.units=[gun,target];h.phase='iraq';target.hp=1;
  assert.ok(attack(h,gun.id,target.id,'iraq'));assert.equal(h.units.includes(target),false);assert.equal(target.morale,100);
});

test('Iraqi AI uses RPGs against armor and machine guns against infantry', () => {
  for(const [type,preferred] of [['iraqi_rpg','tank'],['iraqi_mg','infantry']]){
    const g=createGame(),enemy=formation('specialist',type,'iraq',10,15),tank=formation('tank','tank','coalition',9,15),foot=formation('foot','infantry','coalition',11,15);
    g.units=[enemy,tank,foot];endTurn(g);
    assert.equal(tank.hp<TYPES.tank.hp,preferred==='tank');assert.equal(foot.hp<TYPES.infantry.hp,preferred==='infantry');
    if(preferred==='infantry')assert.equal(foot.morale,92);
  }
});

test('ranged Iraqi troops move into firing range without charging into adjacent combat', () => {
  const g=createGame(),mortar=formation('mortar','iraqi_mortar','iraq',8,15),tank=formation('tank','tank','coalition',12,15);g.units=[mortar,tank];
  endTurn(g);assert.equal(distance(mortar,tank),3);assert.ok(tank.hp<TYPES.tank.hp);assert.equal(tank.morale,90);
});

test('campaign deploys Iraqi specialists without replacing units in saved battlefields', () => {
  const found=new Set();for(let i=0;i<MISSIONS.length;i++)for(const u of createGame(i).units.filter(u=>u.side==='iraq'))found.add(u.type);
  for(const type of ['iraqi','iraqi_rpg','iraqi_mg','iraqi_mortar','iraqi_guard','t72','aa','howitzer'])assert.ok(found.has(type),type);
  const legacy=createGame();legacy.units.find(u=>u.side==='iraq').type='iraqi';const saved=JSON.stringify(legacy);upgradeGame(legacy);assert.equal(JSON.stringify(legacy),saved);
});

test('a combined-arms strategy can complete the entire campaign within the turn limits', () => {
  let completed=[];
  for(let mission=0;mission<MISSIONS.length;mission++) {
    const g=createGame(mission,completed);
    while(g.status==='active') {
      const formations=[...g.units.filter(u=>u.side==='coalition')].sort((a,b)=>(TYPES[b.type].branch==='air')-(TYPES[a.type].branch==='air'));
      for(const u of formations) {
        if(g.status!=='active'||!g.units.includes(u))continue;
        if(u.hp<TYPES[u.type].hp*.5&&repair(g,u.id))continue;
        const targets=()=>g.units.filter(v=>v.side==='iraq'&&canAttack(g,u,v)).sort((a,b)=>(a.hp-damage(u,a))-(b.hp-damage(u,b)));
        let target=targets()[0];
        if(target){attack(g,u.id,target.id);continue;}
        const air=TYPES[u.type].branch==='air';
        const goals=air?g.units.filter(v=>v.side==='iraq'):LOCATIONS.filter(p=>MISSIONS[mission].objectives.includes(p.id)&&g.owners[p.id]!=='coalition');
        const goal=goals.sort((a,b)=>distance(u,a)-distance(u,b))[0];
        if(!goal)continue;
        const positions=[...reachable(g,u).keys()].map(k=>{const[c,r]=k.split(',').map(Number);return {c,r};})
          .filter(p=>!air||!LOCATIONS.some(l=>l.c===p.c&&l.r===p.r))
          .sort((a,b)=>distance(a,goal)-distance(b,goal));
        if(positions[0])moveUnit(g,u.id,positions[0].c,positions[0].r);
        target=targets()[0];if(target)attack(g,u.id,target.id);
      }
      if(g.status==='active')endTurn(g);
      assert.equal(new Set(g.units.map(u=>key(u.c,u.r))).size,g.units.length);
    }
    assert.equal(g.status,'victory',`Mission ${mission+1} must be winnable`);
    assert.ok(g.turn<=MISSIONS[mission].limit);
    completed=g.completed;
  }
  assert.deepEqual(completed,[0,1,2]);
});
