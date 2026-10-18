'use strict';
const MapRules=(()=>{
 // Revision 3: a "silent" map. Markers carry numbers, not names; a name appears once the place has been found.
 // [name, x%, y%, sprite, kind, labelX%, labelY%, feedback] on the full 1600×1065 map (positions checked against the painted map).
 const places=[
 ['Galiläa',62,19,'galilaea','Region',45,24,'Galiläa liegt im Norden, westlich des Sees Genezareth.'],
 ['Samaria',61,42,'samaria','Region',45,40,'Samaria liegt in der Mitte zwischen Galiläa und Judäa.'],
 ['Judäa',59,70,'judaea','Region',47,72,'Judäa liegt im Süden, westlich des Toten Meeres.'],
 ['Jordan',75,40,null,'Fluss',85,26,'Der Jordan ist der Fluss zwischen dem See Genezareth und dem Toten Meer.'],
 ['See Genezareth',75,17,null,'See',92,12,'Der See Genezareth liegt im Nordosten in Galiläa.'],
 ['Jerusalem',66,61,'jerusalem','Ort',55,62,'Jerusalem liegt im Bergland von Judäa, westlich des Toten Meeres.'],
 ['Kafarnaum',75,12,'kafarnaum','Ort',84,5,'Kafarnaum liegt am Nordufer des Sees Genezareth.'],
 ['Nazareth',65,24,'nazareth','Ort',58,31,'Nazareth liegt im Bergland Galiläas, gut 20 km westlich bis südwestlich des Sees.'],
 ['Totes Meer',76,65,null,'See',88,72,'Das Tote Meer liegt im Südosten; dort mündet der Jordan.'],
 ['Mittelmeer',32,35,null,'Meer',28,36,'Das Mittelmeer liegt im Westen.'],
 ['Jericho',72,49,null,'Ort',81,55,'Jericho liegt in Judäa nahe dem Jordan, nördlich des Toten Meeres.'],
 ['Bethlehem',65,66,null,'Ort',58,78,'Bethlehem liegt südlich von Jerusalem in Judäa.'],
 ['Peräa',84,40,null,'Region',93,45,'Peräa liegt östlich des Jordan. Es gehörte zum Herrschaftsgebiet des Herodes Antipas.'],
 ['Idumäa',58,84,null,'Region',46,86,'Idumäa liegt ganz im Süden, südlich von Judäa.'],
 ['Sepphoris',64,22,null,'Ort',55,13,'Sepphoris lag etwa 6 km nordwestlich von Nazareth.'],
 ['Tiberias',72.6,16.5,null,'Ort',84,20,'Tiberias liegt am Westufer des Sees, südlich von Magdala.'],
 ['Magdala',72.2,13.5,null,'Ort',66,4,'Magdala liegt am Westufer des Sees, nördlich von Tiberias.'],
 ['Kaisareia',47.3,44,null,'Ort',40,50,'Kaisareia liegt an der Mittelmeerküste. Dort residierte der römische Präfekt.'],
 ['Sebaste',62.5,44,null,'Ort',55,49,'Sebaste war die wichtigste Stadt in Samaria.']
 ];
 const regions=[0,1,2,12,13],waters=[3,4,8,9],galilee=[6,7,14,15,16],towns=[5,6,7,10,11,14,15,16,17,18];
 // Stable marker numbers (top to bottom, then left to right), so a place keeps its number in every task.
 const order=places.map((p,i)=>i).sort((a,b)=>places[a][6]-places[b][6]||places[a][5]-places[b][5]);
 const number=i=>order.indexOf(i)+1;
 // Scale: 50 km on this simplified map (north–south calibration against Kafarnaum, Nazareth, Jericho, Jerusalem, Bethlehem).
 const scale={km:50,heightPercent:16.1};
 const tasks=[
 {question:'Norden ist oben. Tippt die drei Regionen westlich des Jordan von Norden nach Süden an.',candidates:regions,answer:[0,1,2],hints:['Zwei der fünf Gebiete liegen nicht westlich des Jordan: eines östlich des Flusses, eines ganz im Süden.','Beginnt beim Gebiet neben dem See Genezareth und geht nach Süden.','Galiläa im Norden – Samaria in der Mitte – Judäa im Süden. Peräa liegt östlich des Jordan, Idumäa noch weiter südlich.'],why:'Galiläa, Samaria und Judäa liegen westlich des Jordan von Norden nach Süden.'},
 {question:'Verfolgt den Wasserweg: Tippt zuerst den See, aus dem der Jordan nach Süden fließt, dann den Fluss und zuletzt das Gewässer, in das er mündet.',candidates:waters,answer:[4,3,8],hints:['Ordnet drei Gewässer: Ausgangssee → Fluss → Mündung. Eines der vier Gewässer gehört nicht dazu.','Folgt dem Wasser auf der Karte von Norden nach Süden.','Der Weg beginnt am See im Nordosten. Das große Gewässer im Westen liegt nicht auf diesem Weg.'],why:'See Genezareth → Jordan → Totes Meer.'},
 {question:'Am See Genezareth liegen drei Orte. Kafarnaum liegt am Nordufer. Tiberias, um 20 n. Chr. von Herodes Antipas gegründet, ist der südlichere der beiden Orte am Westufer. Tippt zuerst Kafarnaum, dann Tiberias.',candidates:galilee,answer:[6,15],hints:['Sucht nur Orte, die direkt am See liegen.','Ein Ort liegt oberhalb des Sees, zwei liegen links am Ufer.','Kafarnaum: oben am See. Tiberias: der untere der beiden Orte am linken Ufer.'],why:'Kafarnaum liegt am Nordufer, Tiberias am Westufer südlich von Magdala.'},
 {question:'Nazareth liegt im Bergland gut 20 km westlich bis südwestlich des Sees. Nur etwa 6 km nordwestlich davon lag Sepphoris, bis 20 n. Chr. Residenz des Herodes Antipas. Tippt zuerst Nazareth, dann Sepphoris.',candidates:galilee,answer:[7,14],hints:['Beide Orte liegen nicht am See, sondern weiter westlich.','Die beiden gesuchten Punkte liegen dicht beieinander.','Nazareth ist der untere der beiden Punkte, Sepphoris liegt links darüber (nordwestlich).'],why:'Nazareth und Sepphoris lagen nur wenige Kilometer auseinander; Sepphoris liegt nordwestlich.'},
 {type:'choice',show:[7,5],question:'Nazareth und Jerusalem sind markiert. Schätzt mit der Maßstabsleiste: Wie weit ist es in der Luftlinie von Nazareth nach Jerusalem?',options:['etwa 30 km','etwa 100 km','etwa 250 km','etwa 500 km'],answer:1,hints:['Die Maßstabsleiste zeigt 50 km. Wie oft passt sie zwischen die beiden Orte?','Legt die Leiste gedanklich senkrecht zwischen Nazareth und Jerusalem.','Die Strecke ist ungefähr zweimal so lang wie die Maßstabsleiste.'],why:'Die Luftlinie beträgt rund 100 km. Der tatsächliche Weg war länger, weil er Bergen und Tälern folgte.'},
 {type:'choice',show:[7,5],question:'Der Geschichtsschreiber Josephus berichtet: Durch Samaria kam man in drei Tagen von Galiläa nach Jerusalem. Der Weg war etwa 120 km lang. Wie viele Kilometer musste man ungefähr an einem Tag zu Fuß gehen?',options:['etwa 10 km','etwa 40 km','etwa 120 km'],answer:1,hints:['Teilt die ganze Strecke auf die Reisetage auf.','Rechnet: Wegstrecke geteilt durch die Zahl der Tage.','120 km geteilt durch 3 Tage ergibt die Tagesstrecke.'],why:'120 km : 3 Tage = 40 km pro Tag. Das sind sehr lange Tagesmärsche zu Fuß.'},
 {question:'Um 30 n. Chr. verwaltete ein römischer Präfekt – damals Pontius Pilatus – drei Gebiete: Samaria, Judäa und Idumäa im äußersten Süden. Tippt alle drei an. Die Reihenfolge ist egal.',candidates:regions,answer:[1,2,13],unordered:true,hints:['Zwei der fünf Gebiete regierte nicht der Präfekt, sondern Herodes Antipas.','Antipas regierte Galiläa im Norden und Peräa östlich des Jordan.','Gesucht sind das mittlere Gebiet, das südliche Gebiet und das Gebiet noch weiter im Süden.'],why:'Samaria, Judäa und Idumäa unterstanden direkt einem römischen Präfekten. Galiläa und Peräa regierte Herodes Antipas mit Roms Zustimmung.'},
 {question:'Ein Pilger aus Nazareth will zum Tempel, ohne durch Samaria zu gehen. Er wandert zum Jordan hinab und folgt dem Fluss durch Peräa, ein Gebiet des Antipas östlich des Jordan. Dann überquert er den Fluss zur Stadt nördlich des Toten Meeres und steigt hinauf zur Tempelstadt. Tippt: Startort → Gebiet östlich des Jordan → Stadt am Jordan → Tempelstadt.',candidates:[...regions,...towns],answer:[7,12,10,5],hints:['Vier Stationen: ein Ort, ein Gebiet, eine Stadt, eine Stadt.','Der Weg führt erst nach Osten zum Fluss, dann auf der anderen Seite nach Süden und zuletzt nach Westen hinauf ins Bergland.','Nazareth → Peräa → Jericho → Jerusalem.'],why:'Nazareth → Peräa → Jericho → Jerusalem. Dieser Weg mied Samaria, war aber länger als der Weg durch Samaria.'}
 ];
 const isChoice=r=>tasks[r].type==='choice';
 function chosen(a,r){if(isChoice(r))return [];const v=a['mapStep'+r];return Array.isArray(v)?v.filter((n,i)=>tasks[r].candidates.includes(n)&&v.indexOf(n)===i).slice(0,tasks[r].answer.length):[];}
 function correct(r,values){const t=tasks[r];if(isChoice(r))return values===t.answer;return values.length===t.answer.length&&(t.unordered?t.answer.every(n=>values.includes(n)):t.answer.every((n,i)=>values[i]===n));}
 function select(a,r,n){const t=tasks[r];if(isChoice(r)||!t.candidates.includes(n))return;const v=chosen(a,r);a['mapStep'+r]=t.answer.length===1?[n]:v.includes(n)?v.filter(x=>x!==n):v.length<t.answer.length?[...v,n]:v;}
 // Names shown on the map: places found in completed steps, plus places a choice step marks explicitly.
 function known(stage,r){const s=new Set();tasks.slice(0,Math.min(stage,tasks.length)).forEach(t=>(t.answer instanceof Array?t.answer:[]).forEach(n=>s.add(n)));if(tasks[r]?.show)tasks[r].show.forEach(n=>s.add(n));return s;}
 function feedback(r,values){
  const t=tasks[r];
  if(isChoice(r))return values===undefined?'Wählt eine Antwort aus.':t.hints[1];
  if(!values.length)return 'Markiert zuerst auf der Karte. '+(t.answer.length>1?'Die Reihenfolge steht im Reisehinweis.':'Vergleicht die Lage der Marker.');
  const wrong=values.find((n,i)=>t.unordered?!t.answer.includes(n):t.answer[i]!==n);
  if(wrong!==undefined){const p=places[wrong];return `Marker ${number(wrong)} ist ${p[0]}. ${p[7]} `+(t.answer.length>1?'Prüft Lage und Reihenfolge im Reisehinweis.':'Vergleicht diese Lage mit dem Reisehinweis.');}
  return 'Eure bisherigen Markierungen passen. Ergänzt noch '+(t.answer.length-values.length)+' '+(t.answer.length-values.length===1?'Markierung.':'Markierungen.');
 }
 return {places,regions,waters,towns,tasks,number,scale,isChoice,chosen,correct,select,known,feedback};
})();
if(typeof module!=='undefined')module.exports=MapRules;
if(typeof window!=='undefined')window.MapRules=MapRules;
