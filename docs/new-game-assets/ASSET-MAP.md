# Neue Spielassets – Asset-Map

Repository: https://github.com/SimFischer/Unter-fremder-Herrschaft
Referenzstand: `43e6ac4d95330ba5ffc24ab8d8a3d9efbc0f4394`. Produktion: 18.10.2026.

## Lieferumfang und Einbindung

14 neue Bilddateien. ZIP direkt im Repository-Root entpacken. Alle Pfade sind relativ zum Root. Vorhandene Dateien werden nicht mitgeliefert oder ersetzt; das Startpanel trägt ausdrücklich `-v2`. Keine Spielmechanik und keine App-Dateien geändert. Die neuen Pfade müssen in einer späteren App-Überarbeitung eingebunden werden.

Top-Down: warme Pixel-Art nach den vorhandenen Kontrollposten-Assets. Boten-Modul: handgemalte Holz-/Wachstafel-UI, wie für dieses kleine Modul erlaubt. Hauptspielgrafiken bleiben unverändert.

## Dateien

| Datei | Native Größe | Transparenz | Verwendung |
|---|---:|---|---|
| `assets/interlude/checkpoint-run-start-panel-v2.png` | 1536 × 1024 | Deckend | Startpanel V2; Titel, Beschreibung, drei Sammelobjekte und HTML-Startbutton. |
| `assets/puzzles/report-topdown/report-route-bg.webp` | 1651 × 953 | Deckend | Zusammenhängende Erkundungskarte; dekorative NPCs sind bereits im Hintergrund. |
| `assets/puzzles/report-topdown/report-foreground.png` | 1536 × 1024 | Echtes RGBA | Acht optional vor Figuren sortierbare Objekte. |
| `assets/puzzles/report-topdown/report-markers.png` | 1254 × 1254 | Echtes RGBA | Vier zurückhaltende Fundstellenmarker; 24–32 Kartenpixel breit anzeigen. |
| `assets/puzzles/report-topdown/report-player.png` | 1536 × 1024 | Echtes RGBA | Reisefigur; vier Richtungen mit Stand und einem Schrittbild. |
| `assets/puzzles/report-topdown/report-npcs.png` | 1536 × 1024 | Echtes RGBA | Vier zusätzliche Gesprächsfiguren; bei Bedarf statt weiterer Hintergrundfiguren einsetzen. |
| `assets/puzzles/report-topdown/report-evidence.png` | 1254 × 1254 | Echtes RGBA | Vier nach Entdeckung sichtbare HUD-Belege; 48–64 CSS-Pixel. |
| `assets/puzzles/report-topdown/report-result-panel.png` | 1536 × 1024 | Deckend | Belege, Zuordnung und Erklärung nach der Erkundung. |
| `assets/puzzles/report-topdown/report-category-board.png` | 1536 × 1024 | Deckend | Vier Kategorien mit HTML-Labels und Ablageflächen. |
| `assets/puzzles/report-topdown/report-argument-tiles.png` | 1536 × 1024 | Echtes RGBA | Sechs leere Satzbausteinflächen in drei Breiten. |
| `assets/puzzles/report-topdown/report-evidence-frame.png` | 1254 × 1254 | Echtes RGBA | Transparenter Rahmen für gesicherte Belege. |
| `assets/bonus/bote/bote-board.png` | 1254 × 1254 | Deckend | Vier große Symbolfelder für das Gedächtnis-/Reaktionsspiel. |
| `assets/bonus/bote/bote-symbols.png` | 1254 × 1254 | Echtes RGBA | Schriftrolle, Amphore, Sandale und Kontrollstempel. |
| `assets/bonus/bote/bote-active.png` | 1254 × 1254 | Echtes RGBA | Wiederverwendbarer Aktivrahmen für jeweils eines der vier Felder. |

Die tatsächliche Kartengröße ist 1651 × 953 px (nahe der gewünschten Zielgröße). Quadratische Assets sind nativ 1254 × 1254 px. Keine künstliche Skalierung der Lieferdateien; die Karte wurde ausschließlich verlustfrei nach WebP konvertiert.

## Koordinaten und Rendering

Alle Rechtecke verwenden `[x0, y0, x1, y1]`, Ursprung links oben, rechte/untere Grenze exklusiv. `SPRITES.json` enthält vollständige Quellausschnitte, sichtbare Objektgrenzen und Fußanker im Gesamtbild sowie relativ zum Ausschnitt. Die sichtbare Grenze wurde mit Alpha > 16 gemessen; der Quellausschnitt bewahrt sämtliche Alpha-Werte. Bei UI-Sprites bedeutet Fußanker nur geometrischer Basisanker.

Zeichnen: Ausschnitt bei `(worldX - anchorCropX * scale, worldY - anchorCropY * scale)` platzieren. Figuren nach ihrem Welt-Fußpunkt Y sortieren. `imageSmoothingEnabled=false` für Top-Down-Pixel-Art. Player einheitlich Faktor 0,21: ca. 74–79 Kartenpixel Höhe. NPCs Faktor 0,17: ca. 76–81 Pixel einschließlich Ausrüstung. Der bestehende Player wurde bei Faktor 0,29 aus kleineren Quellfiguren gezeichnet; diesen Faktor nicht unverändert auf die neuen Blätter übernehmen. Stand/Schritt benutzen dieselbe Skalierung, aber die jeweiligen dokumentierten Anker.

Der Hintergrund enthält bereits kleine stationäre Personen. Zusätzliche NPC-Sprites sind optional; nicht deckungsgleich darüberzeichnen. Vordergrundobjekte sind ebenfalls optionale Ergänzungen, nicht als zweite vollständige Lage über die eingebauten Objekte zu legen.

## Sprite-Ausschnitte und Fußanker

Die folgenden Werte entsprechen exakt `SPRITES.json`.

### `assets/puzzles/report-topdown/report-foreground.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| market-stall | `[0, 0, 420, 512]` | `[219.5, 490]` |
| tax-sacks | `[420, 0, 768, 512]` | `[601.0, 480]` |
| amphorae | `[768, 0, 1152, 512]` | `[960.5, 481]` |
| inspection-table | `[1152, 0, 1536, 512]` | `[1335.5, 481]` |
| low-wall | `[0, 512, 420, 1024]` | `[212.5, 944]` |
| signpost | `[420, 512, 768, 1024]` | `[585.5, 947]` |
| crates | `[768, 512, 1152, 1024]` | `[952.5, 942]` |
| linen-rack | `[1152, 512, 1536, 1024]` | `[1334.5, 958]` |

### `assets/puzzles/report-topdown/report-markers.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| control | `[0, 0, 627, 627]` | `[353.5, 544]` |
| tax-burden | `[627, 0, 1254, 627]` | `[915.0, 562]` |
| roman-power | `[0, 627, 627, 1254]` | `[353.5, 1110]` |
| hope-dialogue | `[627, 627, 1254, 1254]` | `[923.5, 1076]` |

### `assets/puzzles/report-topdown/report-player.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| north-idle | `[0, 0, 384, 512]` | `[192, 440]` |
| north-step | `[384, 0, 768, 512]` | `[572, 447]` |
| south-idle | `[768, 0, 1152, 512]` | `[960, 434]` |
| south-step | `[1152, 0, 1536, 512]` | `[1340, 448]` |
| west-idle | `[0, 512, 384, 1024]` | `[186, 925]` |
| west-step | `[384, 512, 768, 1024]` | `[596, 925]` |
| east-idle | `[768, 512, 1152, 1024]` | `[949, 925]` |
| east-step | `[1152, 512, 1536, 1024]` | `[1330, 925]` |

### `assets/puzzles/report-topdown/report-npcs.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| soldier | `[0, 0, 768, 512]` | `[510, 486]` |
| tax-collector | `[768, 0, 1536, 512]` | `[1010, 495]` |
| farmer | `[0, 512, 768, 1024]` | `[510, 988]` |
| traveler | `[768, 512, 1536, 1024]` | `[1010, 984]` |

### `assets/puzzles/report-topdown/report-evidence.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| control-tablet | `[0, 0, 627, 627]` | `[326.0, 589]` |
| tax-sack | `[627, 0, 1254, 627]` | `[941.0, 610]` |
| roman-shield | `[0, 627, 627, 1254]` | `[315.5, 1207]` |
| shared-hope | `[627, 627, 1254, 1254]` | `[940.0, 1131]` |

### `assets/puzzles/report-topdown/report-argument-tiles.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| short-a | `[0, 0, 768, 341]` | `[384.0, 306]` |
| short-b | `[768, 0, 1536, 341]` | `[1152.0, 305]` |
| medium-a | `[0, 341, 768, 683]` | `[384.0, 611]` |
| medium-b | `[768, 341, 1536, 683]` | `[1151.5, 611]` |
| long-a | `[0, 683, 768, 1024]` | `[384.0, 905]` |
| long-b | `[768, 683, 1536, 1024]` | `[1152.0, 905]` |

### `assets/bonus/bote/bote-symbols.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| scroll | `[0, 0, 627, 627]` | `[345.5, 567]` |
| amphora | `[627, 0, 1254, 627]` | `[949.5, 611]` |
| sandal | `[0, 627, 627, 1254]` | `[338.5, 1207]` |
| seal | `[627, 627, 1254, 1254]` | `[972.5, 1170]` |

### `assets/puzzles/report-topdown/report-evidence-frame.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| evidence-slot | `[0, 0, 1254, 1254]` | `[627.0, 1155]` |

### `assets/bonus/bote/bote-active.png`

| Sprite | Crop xyxy | Fußanker im Blatt |
|---|---|---|
| active-field | `[0, 0, 1254, 1254]` | `[627.0, 1205]` |

## Sichere HTML-Overlay-Flächen

Die Prozentwerte beziehen sich auf die gesamte native Bildfläche, nicht auf den sichtbaren Rahmen. Die Pixelwerte sind die verbindlichen Rechtecke; Prozentwerte sind auf vier Stellen gerundet. Titel und Beschreibung des Startpanels sind separate logische Bereiche innerhalb derselben großen Pergamentfläche. Alle hier genannten Flächen liegen mit Sicherheitsabstand innerhalb der Rahmen.

| Asset / Bereich | Pixel xyxy | Prozent xyxy |
|---|---|---|
| `checkpoint-run-start-panel-v2.png` / title | `[216, 134, 1320, 230]` | `[14.0625, 13.0859, 85.9375, 22.4609]` |
| `checkpoint-run-start-panel-v2.png` / description | `[216, 276, 1320, 410]` | `[14.0625, 26.9531, 85.9375, 40.0391]` |
| `checkpoint-run-start-panel-v2.png` / item-1 | `[184, 542, 496, 700]` | `[11.9792, 52.9297, 32.2917, 68.3594]` |
| `checkpoint-run-start-panel-v2.png` / item-2 | `[596, 542, 936, 700]` | `[38.8021, 52.9297, 60.9375, 68.3594]` |
| `checkpoint-run-start-panel-v2.png` / item-3 | `[1040, 542, 1352, 700]` | `[67.7083, 52.9297, 88.0208, 68.3594]` |
| `checkpoint-run-start-panel-v2.png` / start-button | `[400, 820, 1136, 892]` | `[26.0417, 80.0781, 73.9583, 87.1094]` |
| `report-result-panel.png` / title | `[160, 85, 1376, 145]` | `[10.4167, 8.3008, 89.5833, 14.1602]` |
| `report-result-panel.png` / explanation | `[150, 685, 1386, 914]` | `[9.7656, 66.8945, 90.2344, 89.2578]` |
| `report-result-panel.png` / evidence-1 | `[110, 235, 370, 470]` | `[7.1615, 22.9492, 24.0885, 45.8984]` |
| `report-result-panel.png` / category-1 | `[110, 548, 370, 598]` | `[7.1615, 53.5156, 24.0885, 58.3984]` |
| `report-result-panel.png` / evidence-2 | `[466, 235, 720, 470]` | `[30.3385, 22.9492, 46.875, 45.8984]` |
| `report-result-panel.png` / category-2 | `[466, 548, 720, 598]` | `[30.3385, 53.5156, 46.875, 58.3984]` |
| `report-result-panel.png` / evidence-3 | `[820, 235, 1070, 470]` | `[53.3854, 22.9492, 69.6615, 45.8984]` |
| `report-result-panel.png` / category-3 | `[820, 548, 1070, 598]` | `[53.3854, 53.5156, 69.6615, 58.3984]` |
| `report-result-panel.png` / evidence-4 | `[1176, 235, 1426, 470]` | `[76.5625, 22.9492, 92.8385, 45.8984]` |
| `report-result-panel.png` / category-4 | `[1176, 548, 1426, 598]` | `[76.5625, 53.5156, 92.8385, 58.3984]` |
| `report-category-board.png` / label-1 | `[60, 50, 718, 112]` | `[3.9062, 4.8828, 46.7448, 10.9375]` |
| `report-category-board.png` / content-1 | `[60, 150, 718, 465]` | `[3.9062, 14.6484, 46.7448, 45.4102]` |
| `report-category-board.png` / label-2 | `[816, 50, 1470, 112]` | `[53.125, 4.8828, 95.7031, 10.9375]` |
| `report-category-board.png` / content-2 | `[816, 150, 1470, 465]` | `[53.125, 14.6484, 95.7031, 45.4102]` |
| `report-category-board.png` / label-3 | `[60, 550, 718, 612]` | `[3.9062, 53.7109, 46.7448, 59.7656]` |
| `report-category-board.png` / content-3 | `[60, 650, 718, 970]` | `[3.9062, 63.4766, 46.7448, 94.7266]` |
| `report-category-board.png` / label-4 | `[816, 550, 1470, 612]` | `[53.125, 53.7109, 95.7031, 59.7656]` |
| `report-category-board.png` / content-4 | `[816, 650, 1470, 970]` | `[53.125, 63.4766, 95.7031, 94.7266]` |
| `bote-board.png` / field-1 | `[112, 112, 566, 566]` | `[8.9314, 8.9314, 45.1356, 45.1356]` |
| `bote-board.png` / field-2 | `[688, 112, 1142, 566]` | `[54.8644, 8.9314, 91.0686, 45.1356]` |
| `bote-board.png` / field-3 | `[112, 688, 566, 1142]` | `[8.9314, 54.8644, 45.1356, 91.0686]` |
| `bote-board.png` / field-4 | `[688, 688, 1142, 1142]` | `[54.8644, 54.8644, 91.0686, 91.0686]` |
| `report-evidence-frame.png` / transparent-content | `[220, 220, 1030, 1010]` | `[17.5439, 17.5439, 82.1372, 80.5423]` |
| `bote-active.png` / transparent-content | `[150, 150, 1100, 1100]` | `[11.9617, 11.9617, 87.7193, 87.7193]` |

Für Satzbausteine stehen zusätzliche exakte Innenrechtecke als `html_overlay_source_xyxy` in SPRITES.json. Diese liegen zwischen den seitlichen Rollen. Bei langen deutschen Sätzen mehrere Bausteine bzw. mehrere Zeilen verwenden; Text nicht über die Rolle laufen lassen.

## Reisekarte: Start, Ziel und Interaktionen

Alle Werte in nativen Kartenpixeln (1651 × 953). Dies sind visuell festgelegte Einbindungsvorschläge; keine implementierte Kollisions- oder Spiellogik. Interaktionsrechtecke liegen auf erreichbaren Vorflächen, nicht auf den Möbeln.

| Bereich | Rechteck xyxy | Fußpunkt / Markerpunkt |
|---|---|---|
| Start / südwestlicher Eingang | `[210, 835, 300, 935]` | `[250, 890]` |
| Kontrolle – Vorfläche südlich der Schranke | `[375, 310, 600, 365]` | `[490, 340]` |
| Abgaben – Vorfläche südlich des Markts | `[1080, 355, 1350, 420]` | `[1200, 390]` |
| Römische Macht – Vorfläche südlich des Wachpostens | `[1180, 765, 1370, 815]` | `[1280, 790]` |
| Hoffnung – Vorfläche südlich der Gesprächsgruppe | `[565, 685, 700, 735]` | `[635, 710]` |
| Ziel / Abschlussbereich nach vier Beobachtungen | `[210, 835, 300, 935]` | `[250, 890]` |

Start und Ziel verwenden denselben Eingang; die Auswertung kann nach vier Belegen als Overlay geöffnet werden. Kein zusätzlicher Zielgegenstand erforderlich. Hauptverbindungen: Eingang nach Norden auf dem linken Weg; Kontrollstelle und Markt über den breiten oberen Querweg; Wachposten über den rechten und unteren Weg; Gesprächsort über den unteren Weg südlich des Olivenbaums. Der zentrale Olivenbaum und die Beete sind Hindernisse, keine begehbaren Flächen. Die Wege ergeben Schleifen statt Sackgassen. Keine vollständige Navigationsmaske enthalten; die spätere Implementierung muss Kollisionen und Touch-Steuerung im Spiel testen.

## Boten-Modul und iPad

Vier Felder: Reihenfolge links oben, rechts oben, links unten, rechts unten. Die Symbole aus ihren Quellzellen extrahieren, anhand ihrer sichtbaren Grenzen proportional auf gleiche maximale Kantenlänge (empfohlen 65–70 % der Feldbreite) skalieren und im Feld zentrieren. Den einzelnen Aktivrahmen auf das gewählte Feld legen; die anderen Felder bleiben unverändert. Kein separates Aktivbild pro Symbol nötig.

Bei 640 CSS-Pixel Brettbreite sind die sicheren Felder jeweils etwa 232 CSS-Pixel groß. Auch bei 360 Pixel Brettbreite bleiben sie etwa 130 Pixel groß. HTML-Touchziele mindestens 44 × 44 CSS-Pixel; Label/Status außerhalb des Spielbretts. Für Startpanel und Auswertung empfiehlt sich auf iPad eine Breite von mindestens 768 CSS-Pixel, mindestens 18px Text und ein separater normaler HTML-Button bei sehr schmalen Ansichten. Keine Schriftgröße aus dem Bild ableiten.

## Bewusst nicht neu erstellt

Block 6: `bote-result.png` und `bote-record-panel.png` entfallen. Vorhandene HTML-Dialog-/Button-Stile und das bestehende `assets/interlude/checkpoint-run-result.png` reichen für Serie, persönliche Bestleistung und Wiederholung. Bei Wiederverwendung: Titel innerhalb x28–72 %, y14–21 %; Serie x24–85 %, y30–37 %; Rekord x24–85 %, y44–51 %. Wiederholen als normaler HTML-Button unterhalb des Bilds platzieren. Die übrigen Zeilen können für kurze Hinweise genutzt werden. Das vorhandene Bild ist nicht im ZIP dupliziert.

Block 7: Auswahlpanel, fünf Motive, Puzzle-Rahmen, Modus-Icons und Erfolgstafel wurden im Repository geprüft. `puzzle-preview-button.png` und `puzzle-solved-mark.png` entfallen: „Vorlage zeigen“ kann die vorhandene HTML-Button-Gestaltung verwenden; ein gelöstes Motiv kann eine textliche HTML-Markierung erhalten. Der bestehende Auswahlhaken bedeutet aktuell Auswahl, nicht gelöst; diese Zustände in einer späteren Umsetzung getrennt behandeln. Hier wurden keine neuen Funktionen implementiert.

## Qualität und Grenzen

Alle Lieferbilder wurden visuell geprüft. Figuren, Ausrüstung und Objekte sind vollständig; für das Vordergrundblatt ist die erste Spaltengrenze absichtlich x=420 statt x=384. Richtungen und Schrittbilder sind korrekt angeordnet. Transparente Blätter besitzen echte Alphakanäle, Rahmen auch transparente Innenflächen. Keine eingebrannten Beschriftungen; kleine Kerben auf dem Kontrollmarker sind Bilddetails, keine Labels. Keine modernen Gegenstände oder christlichen Zeichen vorgesehen. Historische Darstellung ist stilisiert, keine archäologische Rekonstruktion.

Technisch geprüft: 14 Bilder decodierbar, Alpha vorhanden wo benötigt, Ausschnitte innerhalb der Bildgrenzen, nichtleere Sprites, dokumentierte Overlay-Flächen, verlustfreies WebP, unverändertes Referenzrepository, ZIP-Pfade und CRC. `QA.json` hält native Größen, Alpha-Anteile und SHA-256 fest. Die Lesbarkeit wurde anhand verkleinerter Ansichten beurteilt; ein Test in der späteren App auf einem echten iPad ist noch erforderlich.

## Produktion

Erzeugt mit dem integrierten image_gen-Werkzeug, jeweils ein Bild je Auftrag, in den Blöcken 1 (1), 2 (3), 3 (4), 4 (3), 5 (3). Block 4 wurde nach einer Unterbrechung anhand vorhandener Dateien fortgesetzt. Keine Bildbearbeitung der gelieferten PNGs; allein die Karte wurde verlustfrei ins angeforderte WebP-Format übertragen. Die normalisierten Produktionsvorgaben stehen in PRODUCTION-PROMPTS.md.
