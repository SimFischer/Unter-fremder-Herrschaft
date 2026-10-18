# Asset-Update 2

## Umfang und Referenz

Repository: https://github.com/SimFischer/Unter-fremder-Herrschaft
Branch `neue-spielassets`, Referenzcommit `93afd6764334ff7c7697d2aac3c359e13a9db55f` (vom Nutzer PR #3 zugeordnet).

12 neue PNG-Dateien plus ausschließlich `docs/asset-update-2/`. ZIP im Repository-Root entpacken. Keine bestehenden Dateien enthalten oder überschrieben; keine Spielmechanik, HTML- oder CSS-Dateien verändert. Die Assets sind noch nicht in der App eingebunden.

## Prüfung des vorhandenen Spiels

Die lokale Kopie des aktuellen Branches wurde auf Asset-Nutzung und Gestaltung geprüft: `index.html`, `app.js`, `content.js`, `report-walk.css`, `interlude.js`, `bote.js`, `bote.css`, `bonus-puzzle.js` und zugehörige Stile. Die Referenzgrafiken und die erzeugten Grafiken wurden visuell geprüft. Das ist eine Quellcode-/Asset- und Layoutprüfung, kein vollständiger interaktiver Spieldurchlauf oder Test auf einem echten iPad.

| Bereich | Befund / Entscheidung |
|---|---|
| Siegel 1 | Zuordnungen und Erklärungsketten benutzen CSS-Karten; neuer skalierbarer Erlassrahmen. |
| Siegel 2 | Akte und Notizen benutzen CSS-Flächen; zwei skalierbare Pergamentrahmen. |
| Siegel 3 | Bestehende gemalte Porträts und Gesprächsszene bleiben erhalten. |
| Siegel 4 | Bestehende gemalte Karte, Routen und Marker bleiben erhalten. |
| Siegel 5, Erkundung | Pixel-Art-Karte, Figuren und HUD bleiben erhalten. |
| Siegel 5, Dialogauswertung | Neue handgemalte Kategorie-, Ergebnis- und Satzbaustein-Assets. |
| Kontrollposten | Start-v2 hat keinen Alphakanal; Ergebnis braucht eigenen Buttonstreifen. Beide Fälle behoben. |
| Boten-Modul | Spielbrett bleibt erhalten; Ergebnis und Rekordauszeichnung werden ergänzt. |
| Endpuzzle | Motive, Auswahl, Rahmen und Erfolgstafel bleiben; zwei kleine Bild-UI-Ergänzungen. |
| Allgemeine Dialoge, Reisebuch, Hinweise | Vorhandene Grafiken dienen als Material-/Stilreferenz; keine Neugenerierung. |

## Dateien

| Pfad | Native Größe | Modus / Transparenz | Verwendung |
|---|---:|---|---|
| `assets/interlude/checkpoint-run-start-panel-v3.png` | 1536 × 1024 | RGBA, außen Alpha 0 | Startpanel v3: nur Alpha geändert, Original-RGB unverändert. |
| `assets/interlude/checkpoint-run-result-v2.png` | 1536 × 1024 | RGBA, außen Alpha 0 | Pixel-Art-Ergebnis mit vier Zeilen und eigenem Buttonstreifen. |
| `assets/puzzles/report-topdown/report-category-board-v2.png` | 1536 × 1024 | RGBA, außen Alpha 0 | Handgemaltes Kategorie-Tableau für Siegel 5. |
| `assets/puzzles/report-topdown/report-result-panel-v2.png` | 1536 × 1024 | RGBA, außen Alpha 0 | Handgemalte Ergebnistafel mit vier Beleg- und Kategoriefeldern. |
| `assets/puzzles/report-topdown/report-argument-tiles-v2.png` | 1536 × 1024 | RGBA, außen Alpha 0 | Sechs handgemalte Satzbausteine, drei Breiten. |
| `assets/bonus/bote/bote-result.png` | 1536 × 1024 | RGBA, außen Alpha 0 | Handgemalte Boten-Ergebnistafel mit drei Werten, Hinweis und zwei Buttons. |
| `assets/bonus/bote/bote-record-seal.png` | 512 × 512 | RGBA, außen Alpha 0 | Rekordauszeichnung: roter Lorbeerkranz. |
| `assets/bonus/puzzle-ui/puzzle-preview-icon.png` | 512 × 512 | RGBA, außen Alpha 0 | Vorschau-Icon: gerahmte Olivenbaum-Landschaft. |
| `assets/bonus/puzzle-ui/puzzle-solved-mark.png` | 512 × 512 | RGBA, außen Alpha 0 | Gelöst-Markierung: schräges rotes Siegel mit einzelnem Olivenzweig. |
| `assets/ui/frame-erlassbrett.png` | 1254 × 1254 | RGBA, außen Alpha 0 | 9-Slice-Anschlagbrett für Siegel 1. |
| `assets/ui/frame-akte.png` | 1254 × 1254 | RGBA, außen Alpha 0 | 9-Slice-Amtsakte für Siegel 2. |
| `assets/ui/frame-notiz.png` | 1254 × 1254 | RGBA, außen Alpha 0 | 9-Slice-Fundnotiz, auch für 60 px hohe Zeilen. |

## Koordinatenkonvention

Alle Rechtecke: `[x0, y0, x1, y1]`, Ursprung links oben, rechte/untere Grenzen exklusiv. Prozentwerte beziehen sich auf die gesamte PNG-Datei, nicht auf die sichtbare Kontur. Pixelwerte sind verbindlich, Prozentwerte auf vier Nachkommastellen gerundet. `SPRITES.json` verwendet dasselbe Pfad→Liste-Format wie die bisherige Datei. Für UI-Objekte bezeichnet `foot_anchor_source_xy` lediglich den geometrischen unteren Mittelpunkt; keine Figur wird hier animiert.

## Overlay-Flächen

Alle Flächen sind für HTML reserviert. Die PNGs selbst enthalten keine Beschriftungen. Bei Icons und Siegeln sind keine HTML-Textflächen vorgesehen.

| Datei / Fläche | Pixel xyxy | Prozent xyxy |
|---|---|---|
| `checkpoint-run-start-panel-v3.png` / title | `[216, 134, 1320, 230]` | `[14.0625, 13.0859, 85.9375, 22.4609]` |
| `checkpoint-run-start-panel-v3.png` / description | `[216, 276, 1320, 410]` | `[14.0625, 26.9531, 85.9375, 40.0391]` |
| `checkpoint-run-start-panel-v3.png` / item-1 | `[184, 542, 496, 700]` | `[11.9792, 52.9297, 32.2917, 68.3594]` |
| `checkpoint-run-start-panel-v3.png` / item-2 | `[596, 542, 936, 700]` | `[38.8021, 52.9297, 60.9375, 68.3594]` |
| `checkpoint-run-start-panel-v3.png` / item-3 | `[1040, 542, 1352, 700]` | `[67.7083, 52.9297, 88.0208, 68.3594]` |
| `checkpoint-run-start-panel-v3.png` / button | `[400, 820, 1136, 900]` | `[26.0417, 80.0781, 73.9583, 87.8906]` |
| `checkpoint-run-result-v2.png` / title | `[420, 135, 1116, 202]` | `[27.3438, 13.1836, 72.6562, 19.7266]` |
| `checkpoint-run-result-v2.png` / button | `[405, 841, 1131, 925]` | `[26.3672, 82.1289, 73.6328, 90.332]` |
| `checkpoint-run-result-v2.png` / icon-1 | `[218, 297, 298, 377]` | `[14.1927, 29.0039, 19.401, 36.8164]` |
| `checkpoint-run-result-v2.png` / row-1 | `[370, 305, 1240, 371]` | `[24.0885, 29.7852, 80.7292, 36.2305]` |
| `checkpoint-run-result-v2.png` / check-1 | `[1250, 305, 1316, 371]` | `[81.3802, 29.7852, 85.6771, 36.2305]` |
| `checkpoint-run-result-v2.png` / icon-2 | `[218, 434, 298, 514]` | `[14.1927, 42.3828, 19.401, 50.1953]` |
| `checkpoint-run-result-v2.png` / row-2 | `[370, 442, 1240, 508]` | `[24.0885, 43.1641, 80.7292, 49.6094]` |
| `checkpoint-run-result-v2.png` / check-2 | `[1250, 442, 1316, 508]` | `[81.3802, 43.1641, 85.6771, 49.6094]` |
| `checkpoint-run-result-v2.png` / icon-3 | `[218, 571, 298, 651]` | `[14.1927, 55.7617, 19.401, 63.5742]` |
| `checkpoint-run-result-v2.png` / row-3 | `[370, 579, 1240, 645]` | `[24.0885, 56.543, 80.7292, 62.9883]` |
| `checkpoint-run-result-v2.png` / check-3 | `[1250, 579, 1316, 645]` | `[81.3802, 56.543, 85.6771, 62.9883]` |
| `checkpoint-run-result-v2.png` / icon-4 | `[218, 708, 298, 788]` | `[14.1927, 69.1406, 19.401, 76.9531]` |
| `checkpoint-run-result-v2.png` / row-4 | `[370, 716, 1240, 782]` | `[24.0885, 69.9219, 80.7292, 76.3672]` |
| `checkpoint-run-result-v2.png` / check-4 | `[1250, 716, 1316, 782]` | `[81.3802, 69.9219, 85.6771, 76.3672]` |
| `report-category-board-v2.png` / label-1 | `[60, 50, 718, 112]` | `[3.9062, 4.8828, 46.7448, 10.9375]` |
| `report-category-board-v2.png` / content-1 | `[60, 150, 718, 465]` | `[3.9062, 14.6484, 46.7448, 45.4102]` |
| `report-category-board-v2.png` / label-2 | `[816, 50, 1470, 112]` | `[53.125, 4.8828, 95.7031, 10.9375]` |
| `report-category-board-v2.png` / content-2 | `[816, 150, 1470, 465]` | `[53.125, 14.6484, 95.7031, 45.4102]` |
| `report-category-board-v2.png` / label-3 | `[60, 550, 718, 612]` | `[3.9062, 53.7109, 46.7448, 59.7656]` |
| `report-category-board-v2.png` / content-3 | `[60, 650, 718, 970]` | `[3.9062, 63.4766, 46.7448, 94.7266]` |
| `report-category-board-v2.png` / label-4 | `[816, 550, 1470, 612]` | `[53.125, 53.7109, 95.7031, 59.7656]` |
| `report-category-board-v2.png` / content-4 | `[816, 650, 1470, 970]` | `[53.125, 63.4766, 95.7031, 94.7266]` |
| `report-result-panel-v2.png` / title | `[160, 85, 1376, 145]` | `[10.4167, 8.3008, 89.5833, 14.1602]` |
| `report-result-panel-v2.png` / explanation | `[150, 685, 1386, 914]` | `[9.7656, 66.8945, 90.2344, 89.2578]` |
| `report-result-panel-v2.png` / evidence-1 | `[110, 235, 370, 470]` | `[7.1615, 22.9492, 24.0885, 45.8984]` |
| `report-result-panel-v2.png` / category-1 | `[110, 540, 370, 606]` | `[7.1615, 52.7344, 24.0885, 59.1797]` |
| `report-result-panel-v2.png` / evidence-2 | `[466, 235, 720, 470]` | `[30.3385, 22.9492, 46.875, 45.8984]` |
| `report-result-panel-v2.png` / category-2 | `[466, 540, 720, 606]` | `[30.3385, 52.7344, 46.875, 59.1797]` |
| `report-result-panel-v2.png` / evidence-3 | `[820, 235, 1070, 470]` | `[53.3854, 22.9492, 69.6615, 45.8984]` |
| `report-result-panel-v2.png` / category-3 | `[820, 540, 1070, 606]` | `[53.3854, 52.7344, 69.6615, 59.1797]` |
| `report-result-panel-v2.png` / evidence-4 | `[1176, 235, 1426, 470]` | `[76.5625, 22.9492, 92.8385, 45.8984]` |
| `report-result-panel-v2.png` / category-4 | `[1176, 540, 1426, 606]` | `[76.5625, 52.7344, 92.8385, 59.1797]` |
| `report-argument-tiles-v2.png` / short-a | `[186, 76, 582, 266]` | `[12.1094, 7.4219, 37.8906, 25.9766]` |
| `report-argument-tiles-v2.png` / short-b | `[954, 76, 1350, 266]` | `[62.1094, 7.4219, 87.8906, 25.9766]` |
| `report-argument-tiles-v2.png` / medium-a | `[140, 417, 628, 607]` | `[9.1146, 40.7227, 40.8854, 59.2773]` |
| `report-argument-tiles-v2.png` / medium-b | `[908, 417, 1396, 607]` | `[59.1146, 40.7227, 90.8854, 59.2773]` |
| `report-argument-tiles-v2.png` / long-a | `[113, 758, 655, 948]` | `[7.3568, 74.0234, 42.6432, 92.5781]` |
| `report-argument-tiles-v2.png` / long-b | `[881, 758, 1423, 948]` | `[57.3568, 74.0234, 92.6432, 92.5781]` |
| `bote-result.png` / title | `[180, 158, 1210, 224]` | `[11.7188, 15.4297, 78.776, 21.875]` |
| `bote-result.png` / value-1 | `[180, 284, 1360, 344]` | `[11.7188, 27.7344, 88.5417, 33.5938]` |
| `bote-result.png` / value-2 | `[180, 396, 1360, 456]` | `[11.7188, 38.6719, 88.5417, 44.5312]` |
| `bote-result.png` / value-3 | `[180, 505, 1360, 565]` | `[11.7188, 49.3164, 88.5417, 55.1758]` |
| `bote-result.png` / hint | `[180, 616, 1360, 734]` | `[11.7188, 60.1562, 88.5417, 71.6797]` |
| `bote-result.png` / button-retry | `[180, 790, 724, 884]` | `[11.7188, 77.1484, 47.1354, 86.3281]` |
| `bote-result.png` / button-back | `[818, 790, 1362, 884]` | `[53.2552, 77.1484, 88.6719, 86.3281]` |
| `bote-result.png` / record-seal | `[1294, 143, 1390, 239]` | `[84.2448, 13.9648, 90.4948, 23.3398]` |
| `frame-erlassbrett.png` / content | `[160, 160, 1094, 1094]` | `[12.7592, 12.7592, 87.2408, 87.2408]` |
| `frame-akte.png` / content | `[200, 200, 1054, 1054]` | `[15.949, 15.949, 84.051, 84.051]` |
| `frame-notiz.png` / content | `[100, 100, 1154, 1154]` | `[7.9745, 7.9745, 92.0255, 92.0255]` |

### Startpanel v3 – unveränderte Geometrie

Alle fünf vorgegebenen Titel-, Beschreibungs- und Itemrechtecke bleiben exakt unverändert. Der Pergament-Buttonstreifen bleibt bei y=790–912; das dokumentierte Buttonrechteck liegt mit Sicherheitsabstand darin. Ein byteweiser Vergleich der gesamten RGB-Ebene mit v2 ist identisch. Ausschließlich Alpha wurde aus der Freistellung übernommen und binär bereinigt. Alle Innenflächen sind deckend.

Die Originalkontur beginnt oben bei y=14. Deshalb ist nur dieses Asset von der allgemeinen 24-px-Randregel ausgenommen: Eine Verschiebung würde die ausdrücklich geforderte Originalgeometrie verletzen. Sämtliche übrigen neuen Assets halten mindestens 24 px transparenten Rand ein.

### Kontrollposten-Ergebnis

Vier Textzeilen gleicher Höhe (66 native px), vier quadratische Iconflächen (80 × 80), separate Häkchenflächen. Der Buttonbereich misst 726 × 84 native px = 47,2656 % × 8,2031 % der Bildfläche; bei 1024 px Anzeige ist er 484 × 56 CSS-px groß. Das Titelband nimmt den vorgegebenen Satz einzeilig auf. Die leeren Innenflächen enthalten keine Kontrollposten-spezifischen Symbole.

### Boten-Ergebnis

Drei gleich breite Wertflächen, ein großes Hinweisfeld, ein separates rundes Siegelreservat. Beide Buttons sind 544 × 94 native px = 35,4167 % × 9,1797 %. Bei 1024 px Bildbreite sind sie ca. 362,7 × 62,7 CSS-px groß. Das Rekordsiegel wird im reservierten Quadrat angezeigt; sein sichtbares Motiv ist der Lorbeerkranz.

## Block 4 – Geometriebestätigung und Abweichungen

- **Kategorie-Tableau:** Alle acht vorgegebenen `label`- und `content`-Rechtecke sind exakt beibehalten. Rahmen und Pergament wurden innerhalb dieser Vorgaben technisch ausgerichtet. Keine Änderung der HTML-Positionen nötig.
- **Ergebnistafel:** Titel, vier Belegrechtecke und Erklärung exakt beibehalten. Die vier Kategorien behalten ihre bisherigen X-Grenzen; die Y-Grenzen wurden wie erlaubt von `[548,598]` auf `[540,606]` erweitert. Neue Top-Position 52,7344 %, Höhe 6,4453 %. Die alten kleineren Rechtecke liegen vollständig innerhalb der neuen freien Fläche.
- **Satzbausteine:** Blattgröße 1536 × 1024 und die zwei Spalten / drei Quellzeilen `[0,341]`, `[341,683]`, `[683,1024]` bleiben erhalten. Sichtbare Karten sind bewusst höher und breiter als bisher, um bis zu 75 Zeichen in 2–3 Zeilen aufzunehmen. Neue sichtbare Rechtecke und Textflächen stehen unten und in SPRITES.json. Hier genügt ein Dateinamentausch **nicht**: Die festen Sprite-Ausschnitte in content.js sowie das Karten-Seitenverhältnis und Text-Inset müssen in einer späteren App-Änderung übernommen werden.

| Kachel | sichtbares Rechteck | HTML-Innenrechteck |
|---|---|---|
| short-a | `[124, 36, 644, 306]` | `[186, 76, 582, 266]` |
| short-b | `[892, 36, 1412, 306]` | `[954, 76, 1350, 266]` |
| medium-a | `[64, 377, 704, 647]` | `[140, 417, 628, 607]` |
| medium-b | `[832, 377, 1472, 647]` | `[908, 417, 1396, 607]` |
| long-a | `[28, 718, 740, 988]` | `[113, 758, 655, 948]` |
| long-b | `[796, 718, 1508, 988]` | `[881, 758, 1423, 948]` |

Die sichtbaren Kacheln messen 520/640/712 × 270 px. Die Innenfläche ist je mindestens 76 % der Breite und 70,37 % der Höhe. Gewählt-Zustand bleibt eine CSS-Umrandung; keine zweite Bildvariante.

## Textpassung bei 1024 px Bildbreite

Getestet mit Schriftmetriken und gerenderten Layoutproben: 1536 native px → 1024 CSS-px, daher 24 native Schriftpixel → 16 CSS-px. Standard ist Georgia Regular mit 20 CSS-px Zeilenhöhe. Titel, längstes Kategorienlabel, 45-Zeichen-Frage, 75-Zeichen-Baustein, Ergebniswerte, Hinweis und 205-Zeichen-Erklärung wurden geprüft. Messungen stehen in TEXT-FIT.json.

**Wichtige Schriftanforderung:** „Sichtbare römische Macht“ ist bei 16 CSS-px in Georgia ca. 184,7 CSS-px breit; das schmalste vorhandene Feld ist nur 166,7 CSS-px breit. Die Y-Erhöhung allein löst das nicht. Mit **Arial Narrow Regular, 16 CSS-px** ist der Text ca. 150,7 CSS-px breit und passt einzeilig. Für diese vier Labels ist daher eine tatsächlich verfügbare schmale Schrift mit vergleichbaren Metriken erforderlich; auf dem iPad darf nicht ungeprüft auf eine breitere Ersatzschrift zurückgefallen werden. Alternativ müsste später die Feldgeometrie oder die Einzeiligkeitsvorgabe geändert werden. Keine Schriftdatei wird mitgeliefert.

Die bestehenden App-Stile erzwingen bei den Report-Dialogbildern noch `image-rendering:pixelated` und teils 11–15 px Text. Für die neuen gemalten Dialogbilder später normale Bilddarstellung verwenden und die geprüften Schriftgrößen übernehmen; Pixel-Darstellung für die Canvas-Spiele beibehalten. Bei schmaleren Ansichten Text nicht beliebig verkleinern, sondern das Layout umbrechen oder scrollen.

Touch-Flächen: Die neuen Ergebnisbuttons übersteigen 44 CSS-px Höhe bei 1024 px Bildbreite. Kategorie-Tableau-Felder sind große zusammenhängende Ziele. Die 32–48 px großen Puzzle-Icons/Siegel sind grafische Bestandteile, keine ausreichend großen alleinigen Touchziele; der umgebende Vorschau-Button muss mindestens 44 × 44 CSS-px bleiben.

## 9-Slice-Rahmen

Slice-Reihenfolge: **oben, rechts, unten, links**, bezogen auf das vollständige 1254 × 1254-PNG einschließlich transparentem Außenrand. Die Ecken bleiben unverzerrt; Kanten und Mitte werden gestreckt. Mittlere Kantenabschnitte wurden aus gleichmäßigen Materialquerschnitten aufgebaut und enthalten keine Einzelornamente.

| Datei | Slice-Pixel O/R/U/L | Beispiel-Randbreite in CSS-px | empfohlener Text-Innenabstand |
|---|---|---|
| `frame-erlassbrett.png` | `[160, 160, 160, 160]` | 28 | mindestens 36 px |
| `frame-akte.png` | `[200, 200, 200, 200]` | 28 | mindestens 36 px |
| `frame-notiz.png` | `[100, 100, 100, 100]` | 8 | 12 px; bei 60 px Höhe eine Textzeile |

Mit `border-image-slice: <Wert> fill` und `border-image-repeat: stretch` verwenden oder entsprechend neun Quellrechtecke zeichnen. CSS-Randbreite ausdrücklich setzen; die native Slice-Breite darf nicht zur CSS-Randbreite werden. `frame-notiz.png` wurde auf 960 × 60 px mit 8-px-Rändern geprüft. Die beiden großen Rahmen wurden auf 960 × 240 px mit 28-px-Rändern geprüft. Das Siegelrest-Motiv der Akte liegt in der linken oberen Ecke; die übrigen Kanten sind schmucklos.

## Qualität, Transparenz und Herstellungsweise

Erzeugung mit integriertem image_gen in einzelnen Bildaufträgen. Produktionsreihenfolge gemäß Priorisierung: Block 1, 4 (3 Bilder), 3 (2), 2 (1), 5 (2), 6 (3). Nach ausdrücklicher Freigabe des Nutzers erfolgte technische Bildnachbearbeitung: Original-RGB-Erhalt für v3, Freistellung und Entfernung vereinzelter Alphapixel, Export auf exakte Maße, Feldanpassung, saubere Sprite-Anordnung und gleichmäßige 9-Slice-Kanten.

Alle PNGs sind RGBA mit Alpha-Extrema `[0,255]`. Außenbereiche besitzen Alpha 0; keine farbigen Hintergrundkästen oder Restschimmer. Die Masken haben deckende Innenflächen; abgelöste Pixel wurden entfernt. Die sichtbaren Motive wurden auf Schriftfreiheit und vollständige Konturen geprüft. Neue handgemalte Textflächen sind hell und ruhig; die bewusst unveränderte v3 behält ihre bestehende Pixel-Pergamenttextur.

Geprüft: Bilddecodierung, Maße, Alpha, Randabstände, Original-RGB-Vergleich, Sprite-Grenzen, Textflächenverhältnisse, Textmetriken, verkleinerte Icons, 9-Slice-Proben, Dateikollisionen mit Referenzbranch, SHA-256 und ZIP-CRC. `QA.json` enthält die Messdaten pro Asset. Ein echter iPad-/Browser-Integrationstest bleibt Teil der späteren Einbindung; insbesondere muss dort die schmale Labelschrift sichergestellt werden.

## Nicht verändert

Alle bisherigen Dateien, beide Top-Down-Karten, Figuren, HUD-Assets, Porträts, Hauptspielszene, Landkarte, Puzzle-Motive und Spielregeln bleiben unverändert. Keine Veröffentlichung, kein Commit und keine Änderung am Pull Request vorgenommen.
