# Asset-Update 3

20 neue PNGs; nur Bilder und Dokumentation. Keine Änderung der Spiellogik. Basis: main `bd5b9e5dd781852ea4cb861f7562e1a5a3957029`.

## Koordinaten und Einbau

Alle Rechtecke `[x0,y0,x1,y1]` verwenden exklusive rechte/untere Grenzen. Ursprung links oben. Prozent: x/Bildbreite×100, y/Bildhöhe×100. Vollständige maschinenlesbare Werte stehen in `SPRITES.json`; keine Bilddatei beschneiden, bevor die Koordinaten umgerechnet wurden. Touchflächen in der App mindestens44 CSS-px; die sichtbare Grafik darf kleiner sein.

## Dateien

| Datei | Größe | Modus |
|---|---|---|
| `assets/bonus/bonus-selection-panel.png` | 1536×1024 | RGBA |
| `assets/characters/voice-eleasar.png` | 1024×1536 | RGBA |
| `assets/characters/voice-jakob.png` | 1024×1536 | RGBA |
| `assets/characters/voice-marcus.png` | 1024×1536 | RGBA |
| `assets/characters/voice-miriam.png` | 1024×1536 | RGBA |
| `assets/explore/explore-abgabentisch.png` | 1659×948 | RGB |
| `assets/explore/explore-erlassbrett.png` | 1659×948 | RGB |
| `assets/explore/explore-kartentisch.png` | 1659×948 | RGB |
| `assets/explore/explore-reisende.png` | 1659×948 | RGB |
| `assets/interlude/touch-controls.png` | 1536×1024 | RGBA |
| `assets/puzzles/map/map-table-large-v2.png` | 1600×1065 | RGB |
| `assets/scene/control-post-v2-stage-0.png` | 1536×1024 | RGB |
| `assets/scene/control-post-v2-stage-1.png` | 1536×1024 | RGB |
| `assets/scene/control-post-v2-stage-2.png` | 1536×1024 | RGB |
| `assets/scene/control-post-v2-stage-3.png` | 1536×1024 | RGB |
| `assets/scene/control-post-v2-stage-4.png` | 1536×1024 | RGB |
| `assets/scene/control-post-v2-stage-5.png` | 1536×1024 | RGB |
| `assets/ui/discovery-marks.png` | 1024×512 | RGBA |
| `assets/ui/frame-sprechblase.png` | 1254×1254 | RGBA |
| `assets/ui/speech-tails.png` | 512×256 | RGBA |

## Hauptszene

Stage0,1,2 sind identische geschlossene Zustände. Stage3 zeigt einen Spalt,4 ein halb geöffnetes und5 das offene Tor mit wegweisendem Wächter. Alle RGB-Pixel außerhalb der dokumentierten Tor-/Wächtermasken sind bitgleich. Die darüberliegende Kontur Eleasars ist aus der Basis geschützt. Auch Schatten und Kamerabildausschnitt außerhalb dieser Masken sind unverändert. `SCENE-INVARIANTS.json` enthält die Maskenpolygone und den Pixelvergleich. Die Wächtermaske umfasst auch seinen vorherigen Standplatz, der beim Schritt zur Seite sichtbar wird.

Die Stationsrechtecke umfassen teilweise Hintergrund; sie sind keine Freistellmasken. Insbesondere hinter Eleasar öffnet sich das Tor. Die Figurenkontur bleibt gleich. Nummern/Schilder setzt ausschließlich die App. Empfohlene90×90-Markerflächen stehen in JSON; Marker auf Waren/Karte/Truhe überdecken kleine Bilddetails.

### Stationen

| Motiv | Bounding Box px | Marker px | Box % | Marker % |
|---|---|---|---|---|
| erlassbrett | [212, 395, 397, 560] | [302, 465] | [13.802, 38.574, 25.846, 54.688] | [19.661, 45.41] |
| abgabentisch | [0, 548, 405, 860] | [322, 748] | [0.0, 53.516, 26.367, 83.984] | [20.964, 73.047] |
| reisende | [390, 350, 934, 885] | [649, 937] | [25.391, 34.18, 60.807, 86.426] | [42.253, 91.504] |
| kartentisch | [950, 738, 1536, 1024] | [1263, 844] | [61.849, 72.07, 100.0, 100.0] | [82.227, 82.422] |
| pergamentrolle | [808, 829, 1158, 1016] | [987, 933] | [52.604, 80.957, 75.391, 99.219] | [64.258, 91.113] |

### Erkundung erlassbrett

| Motiv | Bounding Box px | Marker px | Box % | Marker % |
|---|---|---|---|---|
| erlass | [145, 42, 658, 635] | [405, 300] | [8.74, 4.43, 39.662, 66.983] | [24.412, 31.646] |
| warenkorb | [680, 370, 1244, 725] | [1020, 445] | [40.989, 39.03, 74.985, 76.477] | [61.483, 46.941] |
| kaiserbueste | [1290, 65, 1600, 720] | [1448, 490] | [77.758, 6.857, 96.444, 75.949] | [87.281, 51.688] |

### Erkundung abgabentisch

| Motiv | Bounding Box px | Marker px | Box % | Marker % |
|---|---|---|---|---|
| urkunde | [15, 140, 574, 694] | [300, 345] | [0.904, 14.768, 34.599, 73.207] | [18.083, 36.392] |
| zwei-familien | [578, 115, 1144, 617] | [1000, 250] | [34.84, 12.131, 68.957, 65.084] | [60.277, 26.371] |
| kaisermuenze | [1146, 76, 1638, 565] | [1445, 475] | [69.078, 8.017, 98.734, 59.599] | [87.101, 50.105] |

### Erkundung kartentisch

| Motiv | Bounding Box px | Marker px | Box % | Marker % |
|---|---|---|---|---|
| orientierung | [15, 210, 453, 588] | [235, 398] | [0.904, 22.152, 27.306, 62.025] | [14.165, 41.983] |
| fischfang | [490, 80, 1136, 660] | [850, 555] | [29.536, 8.439, 68.475, 69.62] | [51.236, 58.544] |
| tempel | [1140, 230, 1659, 640] | [1400, 440] | [68.716, 24.262, 100.0, 67.511] | [84.388, 46.414] |

### Erkundung reisende

| Motiv | Bounding Box px | Marker px | Box % | Marker % |
|---|---|---|---|---|
| marktstand | [30, 198, 550, 665] | [360, 444] | [1.808, 20.886, 33.153, 70.148] | [21.7, 46.835] |
| zwei-maenner | [578, 160, 1053, 665] | [820, 350] | [34.84, 16.878, 63.472, 70.148] | [49.427, 36.92] |
| soldat | [1320, 60, 1544, 665] | [1425, 435] | [79.566, 6.329, 93.068, 70.148] | [85.895, 45.886] |

In allen vier Erkundungsszenen ist `[0,740,1659,948]` (untere21,94%) für Fortschritt und Aktion frei. Empfohlene innere Overlayfläche: `[40,760,1619,924]`. Die Objekte sind für didaktische Erkennbarkeit teilweise vergrößert; die große Münze ist keine Behauptung über historische Münzgröße. Die Orientierungsscheibe ist eine didaktische Windrichtungsdarstellung ohne Magnetnadel. Das Palmzweig-Siegel ist eine plausible Gestaltung, kein belegtes Original-Siegel Antipas.

## Gesprächsfiguren

Alle1024×1536, RGBA; Kopf bis Hüfte, Licht links oben, Blick nach rechts. Sichtbare Kontur wird durch Alphakanal exakt beschrieben; Bounding Box und Kopfmittelpunkt stehen unten und in JSON. Speer/Helmbusch bei Marcus gehören zur Kontur. Für die App an den Kopfmittelpunkten ausrichten; Speerlänge nicht als Größenmaßstab verwenden.

| Figur | Sichtbare Box | Kopfmittelpunkt |
|---|---|---|
| voice-miriam | [110, 189, 939, 1390] | [594, 359] |
| voice-jakob | [106, 179, 923, 1380] | [569, 351] |
| voice-eleasar | [129, 159, 940, 1370] | [494, 338] |
| voice-marcus | [124, 126, 910, 1410] | [531, 435] |

## Bonusauswahl

Zwei gleich große Vorschauflächen560×350 =16:10. Titel20Zeichen; Spielname26; Fortschritt32. Text wird später als HTML gesetzt. Für1536px-Breite: Titel40px, Namen30px, Fortschritt26px; bei1024px-Ansicht proportional skalieren. Breite Zeichenketten mit Schriftmetriken prüfen und gegebenenfalls verkleinern.

| Fläche | Rechteck px | Prozent |
|---|---|---|
| title | [220, 133, 1316, 205] | [14.323, 12.988, 85.677, 20.02] |
| preview-left | [170, 260, 730, 610] | [11.068, 25.391, 47.526, 59.57] |
| preview-right | [806, 260, 1366, 610] | [52.474, 25.391, 88.932, 59.57] |
| name-left | [175, 660, 725, 720] | [11.393, 64.453, 47.201, 70.312] |
| name-right | [812, 660, 1362, 720] | [52.865, 64.453, 88.672, 70.312] |
| progress-left | [175, 757, 725, 818] | [11.393, 73.926, 47.201, 79.883] |
| progress-right | [812, 757, 1362, 818] | [52.865, 73.926, 88.672, 79.883] |

## Sprechblase und Zipfel

Frame1254²:9-Slice oben/rechts/unten/links jeweils190px. Stretch statt Tile verwenden; die geraden Kanten haben konstante Querschnitte. Textfläche `[190,190,1064,1064]`. Das transparente Außenpadding gehört zur Quelle. Kleinste empfohlene Darstellung420×420; bei niedrigerer Höhe Ecken separat verkleinern.

Zipfel512×256, zwei256²-Zellen: links zeigend links, nach unten zeigend rechts. An der offenen Basis12px überlappen, um den Rahmenrand zu verdecken. Nach Größe und Hintergrundfarbe des Frames skalieren.

- left: Ausschnitt[0, 0, 256, 256], Kontur[40, 55, 216, 200], Andockpunkt[214, 127.5].
- down: Ausschnitt[256, 0, 512, 256], Kontur[296, 67, 472, 189], Andockpunkt[384.0, 69].

## Karte und historische Einschränkungen

**Die Forderung nach einem überall maßstabsgetreuen0–50km-Maßstab lässt sich mit der unverändert zu erhaltenden, schematisch verzerrten Ausgangskarte nicht erfüllen.** Die neue Leiste ist eine lokal kalibrierte Näherung:191px≈50km, fünf Abschnitte à10km. Endpunkte `(1309,845)` und `(1500,845)`; Striche bei1309,1347,1385,1424,1462,1500. Keine Ziffern eingebrannt. Die App sollte „ca.“ anzeigen und keine exakten Entfernungsaufgaben daraus ableiten.

Jerusalem/Nazareth source anchors: (1056,649.65)/(1040,255.6), 394.375px. Approximate coordinates (31.773938,35.235632)/(32.7,35.3), great-circle distance about103.15km. Rounded50km=191px.

Küste, Gewässer und Bildausschnitt sind aus dem Original unverändert übernommen; nur Grenzstriche und Maßstabsleiste wurden darüber gezeichnet. Bestehende Ortsanker bleiben gültig. Regionpolygone sind schematische Lernflächen, keine vermessenen Grenzen. Galiläa und Peräa gehören zur Herrschaft Antipas; Samaria, Judäa und Idumäa werden hier als geographische Teilräume der römisch verwalteten Judäa unterschieden. Dekapolis nur als ungefähre Schwerpunktzone markieren: ein Städteverband, keine lückenlose einheitliche Provinz. Besonders westliche Galiläagrenze, Idumäa-Südgrenze und Peräa-Ostgrenze sind unsicher und auf diese Zeichnung vereinfacht übertragen. Küstenstädte und einzelne Stadtterritorien sind nicht separat modelliert.

Quellen zur Orientierung: [USF Maps ETC, historische Übersicht](https://etc.usf.edu/maps/pages/10400/10496/10496.htm) (breiter Zeitraum, keine exakte Grenzrekonstruktion30n.Chr.); [Übersicht Judäa um30](https://www.historyinthebible.com/supplementary_pages/map-of-jesus-judea.html). Kalibrierung: [Getty Nazareth](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=indian&nation=&place=ocean&subjectid=7001410) und [Koordinate Alt-Jerusalem](https://www.pinchaspolonsky.org/en/wp-content/uploads/2021/01/judea-and-samaria.pdf). Moderne Koordinaten dienen ausschließlich zur Entfernungskalibrierung, nicht zur Bestimmung historischer Grenzen.

Polygone in Pixeln; Prozentwerte vollständig in `SPRITES.json`:

- galilaea: `[[875, 90], [1130, 85], [1160, 130], [1148, 210], [1180, 252], [1165, 301], [1040, 330], [920, 315], [800, 295], [838, 220]]`
- samaria: `[[800, 295], [920, 315], [1040, 330], [1165, 301], [1180, 390], [1185, 460], [1100, 480], [950, 495], [820, 475], [730, 450]]`
- judaea: `[[730, 450], [820, 475], [950, 495], [1100, 480], [1185, 460], [1200, 530], [1170, 560], [1160, 670], [1120, 725], [980, 755], [790, 720], [590, 670], [650, 575]]`
- idumaea: `[[590, 670], [790, 720], [980, 755], [1120, 725], [1150, 850], [950, 875], [690, 860], [440, 800]]`
- peraea: `[[1230, 375], [1325, 355], [1375, 430], [1400, 515], [1380, 610], [1300, 650], [1290, 555], [1250, 525], [1250, 465]]`
- decapolis_approx: `[[1245, 235], [1380, 195], [1460, 260], [1450, 380], [1375, 430], [1325, 355], [1230, 375]]`

## Touch und Fundmarken

Touch:3×2-Zellen à512², Reihenfolge joystick-base, joystick-knob, button-hide / button-pause, tap-target, inspect-bubble. Pixel-Art mit4px-Raster; beim Skalieren nearest-neighbor beziehungsweise image-rendering:pixelated verwenden. Sichtbare Boxen und Mitteanker stehen in JSON. Joystickbasis als Ganzes oder mit separater zentraler Deckkraft anzeigen. Vorschau `READABILITY.png` zeigt60%Deckkraft auf Sand.

Fundmarken:2×1-Zellen à512², unread links (goldenes Funkeln), read rechts (rotes Wachssiegel mit Häkchen, ohne Lorbeer). Vor Skalierung auf32–48px anhand visible_bbox ausschneiden; sonst werden die Motive wegen des Quellpaddings zu klein. App-Touchfläche mindestens44px, unabhängig von Icongröße.

## Prüfung und Lieferung

Alle20Dateien wurden visuell geprüft. RGB/RGBA, Maße, SHA-256 und Alphawerte stehen in `QA.json`. Kein vorhandener Repositorypfad wird überschrieben. Rahmen/Symbole/Figuren haben≥24px echte transparente Außenränder. Keine Spiellogik, keine eingebrannten Beschriftungen. Generierung mit dem integrierten Bildwerkzeug; anschließend vom Nutzer genehmigte technische Alpha-, Raster-, Größen- und Kompositionsbearbeitung. `PRODUCTION.json` dokumentiert die verwendeten Generationen und Prompt-Spezifikationen. ZIP direkt im Repository-Root entpacken.
