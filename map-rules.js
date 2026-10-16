'use strict';
const MapRules=(()=>{
 // Anchors on the full, uncropped 1600×1065 map; label anchors avoid the river and nearby towns.
 const places=[
 ['Galiläa',62,19,'galilaea','Region',47,19,'Galiläa liegt im Norden.'],
 ['Samaria',61,42,'samaria','Region',47,42,'Samaria liegt zwischen Galiläa und Judäa.'],
 ['Judäa',59,70,'judaea','Region',47,72,'Judäa liegt im Süden.'],
 ['Jordan',75,40,null,'Fluss',87,42,'Der Jordan ist ein Fluss; er fließt vom See Genezareth nach Süden weiter.'],
 ['See Genezareth',75,17,null,'See',87,25,'Der See Genezareth liegt im Norden in Galiläa.'],
 ['Jerusalem',66,61,'jerusalem','Ort',62,58,'Jerusalem liegt in Judäa. Dort stand der Tempel.'],
 ['Kafarnaum',75,12,'kafarnaum','Ort',83,9,'Kafarnaum liegt am Nordufer des Sees Genezareth in Galiläa.'],
 ['Nazareth',65,24,'nazareth','Ort',62,31,'Nazareth liegt in Galiläa, westlich des Sees.'],
 ['Totes Meer',76,65,null,'See',87,70,'Das Tote Meer liegt im Süden; der Jordan mündet dort.'],
 ['Mittelmeer',32,35,null,'Meer',28,36,'Das Mittelmeer liegt westlich der drei Regionen.'],
 ['Jericho',72,49,null,'Ort',82,51,'Jericho liegt in Judäa nahe dem Jordan, nördlich des Toten Meeres.'],
 ['Bethlehem',65,66,null,'Ort',62,79,'Bethlehem liegt südlich von Jerusalem in Judäa.']
 ];
 const regions=[0,1,2],towns=[5,6,7,10,11],waters=[3,4,8,9];
 const tasks=[
 {question:'Tippt auf die nördliche Region, in der Nazareth liegt.',candidates:regions,answer:[0],hints:['Gesucht ist ein größeres Gebiet, kein einzelner Ort.','Vergleicht Norden, Mitte und Süden.','Sucht die Region rund um Nazareth und den See Genezareth.'],why:'Galiläa liegt im Norden; Nazareth gehört zu dieser Region.'},
 {question:'Welche Region liegt zwischen Galiläa und Judäa?',candidates:regions,answer:[1],hints:['Vergleicht die Lage aller drei Regionen.','Gesucht ist die mittlere Region.','Sie liegt südlich von Galiläa und nördlich von Judäa.'],why:'Samaria liegt zwischen Galiläa im Norden und Judäa im Süden.'},
 {question:'Ein Reisender möchte zum Tempel in Judäa. Markiert die passende Stadt.',candidates:towns,answer:[5],hints:['Alle Marker dieser Aufgabe sind Orte. Welche Stadt hat im Reisebuch eine besondere religiöse Bedeutung?','Sucht in Judäa, westlich des Toten Meeres.','Dort stand der Tempel; Bethlehem liegt etwas weiter südlich.'],why:'Jerusalem liegt in Judäa und war der Standort des Tempels.'},
 {question:'Markiert das Gewässer in Galiläa, aus dem der Jordan nach Süden weiterfließt.',candidates:waters,answer:[4],hints:['Vergleicht See, Fluss und Meer. Gesucht ist kein Fluss.','Schaut in den Nordosten der Karte.','Gesucht ist der See in Galiläa.'],why:'Aus dem See Genezareth fließt der Jordan nach Süden weiter; er mündet ins Tote Meer.'},
 {question:'Wählt genau zwei Orte in Galiläa: einen am Nordufer des Sees und einen westlich davon. Die Reihenfolge ist egal.',candidates:towns,answer:[6,7],unordered:true,hints:['Verbindet zwei Informationen: Beide Orte müssen in Galiläa liegen.','Sucht im Norden: einen Ort direkt am See und einen weiter westlich.','Einer ist der Fischerort am Nordufer, der andere steckt im Namen „Jesus von …“.'],why:'Kafarnaum liegt am Nordufer; Nazareth liegt westlich des Sees. Beide gehören zu Galiläa.'},
 {question:'Markiert zuerst die Stadt mit dem Tempel und danach die Region, zu der sie gehört.',candidates:[...regions,...towns],answer:[5,2],hints:['Zuerst ist ein Ort gesucht, danach ein größeres Gebiet.','Beide Markierungen gehören in den Süden der Karte.','Sucht erst die Tempelstadt und dann die sie umgebende südliche Region.'],why:'Jerusalem ist die Stadt; Judäa ist die Region, in der sie liegt.'},
 {question:'Verfolgt den Wasserweg ab dem See in Galiläa nach Süden: Markiert zuerst den See, dann den Fluss und zuletzt das Gewässer, in das er mündet.',candidates:waters,answer:[4,3,8],hints:['Ordnet drei Gewässer: Ausgangssee → Fluss → Mündungssee.','Folgt auf der Karte dem Wasser von Norden nach Süden.','Beginnt am See Genezareth; das Mittelmeer liegt nicht auf diesem Wasserweg.'],why:'See Genezareth → Jordan → Totes Meer. Der Jordan fließt auch schon von Norden in den See Genezareth hinein.'},
 {question:'Plant einen Weg durch das Landesinnere von der Tempelstadt nach Nazareth: Stadt → Startregion → mittlere Region → Zielregion → Zielort. Tippt die fünf Stationen in dieser Reihenfolge an.',candidates:[...regions,...towns],answer:[5,2,1,0,7],hints:['Verbindet die Orte mit ihren Regionen. Es geht ausdrücklich um einen Weg durch das Landesinnere.','Beginnt im Süden und ordnet die Regionen bis in den Norden.','Die Tempelstadt liegt in Judäa; zwischen Judäa und Galiläa liegt Samaria.'],why:'Jerusalem → Judäa → Samaria → Galiläa → Nazareth ist die gesuchte räumliche Reihenfolge. Das ist ein möglicher Weg, keine Behauptung über alle damaligen Reiserouten.'}
 ];
 function chosen(a,r){const v=a['mapStep'+r];return Array.isArray(v)?v.filter((n,i)=>tasks[r].candidates.includes(n)&&v.indexOf(n)===i).slice(0,tasks[r].answer.length):[];}
 function correct(r,values){const t=tasks[r];return values.length===t.answer.length&&(t.unordered?t.answer.every(n=>values.includes(n)):t.answer.every((n,i)=>values[i]===n));}
 function select(a,r,n){const t=tasks[r];if(!t.candidates.includes(n))return;const v=chosen(a,r);a['mapStep'+r]=t.answer.length===1?[n]:v.includes(n)?v.filter(x=>x!==n):v.length<t.answer.length?[...v,n]:v;}
 function feedback(r,values){
  const t=tasks[r];if(!values.length)return 'Markiert zuerst auf der Karte. '+(t.answer.length>1?'Die Auswahlfolge steht im Reisehinweis.':'Vergleicht die sichtbaren Marker.');
  const wrong=values.find((n,i)=>t.unordered?!t.answer.includes(n):t.answer[i]!==n);
  if(wrong!==undefined){const p=places[wrong];if(r===3&&wrong===3)return 'Der Jordan ist der Fluss selbst. Gesucht ist das Gewässer in Galiläa, aus dem er weiterfließt.';if(r===4)return p[0]+' gehört zu Judäa. Gesucht sind zwei Orte in Galiläa.';return p[7]===undefined?'Prüft die räumliche Reihenfolge.':p[7]+' '+(t.answer.length>1?'Prüft Kategorie und Reihenfolge im Reisehinweis.':'Vergleicht diese Lage mit dem Reisehinweis.');}
  return 'Eure bisherigen Markierungen passen. Ergänzt noch '+(t.answer.length-values.length)+' '+(t.answer.length-values.length===1?'Markierung.':'Markierungen.');
 }
 return {places,tasks,chosen,correct,select,feedback};
})();
if(typeof module!=='undefined')module.exports=MapRules;
if(typeof window!=='undefined')window.MapRules=MapRules;
