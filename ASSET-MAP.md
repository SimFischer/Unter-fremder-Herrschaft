# Asset-Karte – Unter fremder Herrschaft

Stand: 16. Oktober 2026. Alle 16 Dateien des Vier-Block-Auftrags wurden nacheinander mit dem eingebauten Imagegen-Werkzeug erzeugt, nach jedem Block gespeichert und geprüft. Keine vorhandene Bilddatei wurde ersetzt oder gelöscht. Die bisherigen Karten/Manifeste sind unter `docs/previous-*` erhalten.

Der visuelle Abgleich erfolgte mit den tatsächlich geladenen Repository-Bildern, insbesondere `assets/objects/map-table.webp`, `assets/objects/report-scroll.webp` und `assets/scene/control-post.webp`. Warmes handgemaltes 2D-Adventure, römisches Palästina, Sand/Ocker/Terrakotta/Olive, Holz/Stein/Pergament/Bronze. Illustrative Spielobjekte, keine archäologisch exakten Rekonstruktionen.

## Neue Assets

| Dateiname | Pfad | Zweck | Transparenz | Native Liefergröße | Empfohlene Verwendung | Anzeigegröße |
|---|---|---|---|---|---|---|
| bonus-ui.png | `assets/bonus/bonus-ui.png` | Acht Kontroll- und Entscheidungselemente | Ja | 1536×1024 | Individuelle Ausschnitte mit HTML-Beschriftung | Symbole 64–100 px; Schilder 170–280 px |
| checkpoint-bg.png | `assets/bonus/checkpoint-bg.png` | Bühne für freiwilliges Kontrollpostenspiel | Nein | 1600×1067 | Hintergrund mit separat platzierten Reisenden | 900–1100 px breit |
| goods-sheet.png | `assets/bonus/goods-sheet.png` | Sechs kontrollierbare Waren | Ja | 1536×1024 | Individuelle Ausschnitte aus 3×2-Anordnung | 90–150 px je Objekt |
| travellers-sheet.png | `assets/bonus/travellers-sheet.png` | Fünf Reisenden-Einträge einschließlich Familie | Ja | 2073×758 | Individuelle Ausschnitte, gemeinsame Bodenlinie | Erwachsene etwa 350–470 px hoch |
| map-compass.png | `assets/puzzles/map/map-compass.png` | Antike Orientierungsscheibe | Ja | 1254×1254 | Einzelobjekt neben Karte | 88–140 px |
| map-marker-set.png | `assets/puzzles/map/map-marker-set.png` | Sechs Orts-/Regionsmarker | Ja | 1536×1024 | Einzelsprites aus 3×2-Bogen, zeilenweise | 56–100 px je Marker |
| map-route-strip.png | `assets/puzzles/map/map-route-strip.png` | Sechs Reisespurvarianten | Ja | 1536×1024 | Einzelne Streifen aus 2×3-Bogen, nicht gesamten Bogen als Route nutzen | 160–360 px je Streifen |
| map-table-large.png | `assets/puzzles/map/map-table-large.png` | Kartentisch Palästina | Nein | 1600×1065 | Hintergrund, vollständig mit contain anzeigen | 900–1100 px breit |
| argument-tiles.png | `assets/puzzles/report/argument-tiles.png` | Sechs Satzbausteinträger | Ja | 1536×1024 | Individuell zuschneiden; breite Varianten unten | 280–460 px je Baustein |
| evidence-marker.png | `assets/puzzles/report/evidence-marker.png` | Acht Belegmarkierungen | Ja | 1774×887 | Einzelsprites aus 4×2-Bogen | 36–64 px; Touchziel mindestens 44 px |
| report-scroll-large.png | `assets/puzzles/report/report-scroll-large.png` | Vier gegliederte Berichtsabschnitte | Ja | 1024×1536 | Hochformatiges Lesedokument, intern scrollbar | 560–700 px breit |
| report-table.png | `assets/puzzles/report/report-table.png` | Arbeitsfläche für Zacharias’ Bericht | Nein | 1600×1067 | Hintergrund mit separatem Pergament darüber | 900–1100 px breit |
| finale-road-galilee.webp | `assets/scenes/finale-road-galilee.webp` | Aufbruch nach Galiläa | Nein | 1600×1067 | Abschluss-Hintergrund als echtes WebP | 900–1100 px breit |
| finale-travel-permit.png | `assets/ui/finale-travel-permit.png` | Reisegenehmigung mit fünf Siegelflächen | Ja | 1536×1024 | Abschlussdokument mit Titel, Text und fünf Siegeloverlays | 800–1000 px breit |
| hint-tablet.png | `assets/ui/hint-tablet.png` | Römische Hinweistafel | Ja | 1536×1024 | Einzelobjekt mit HTML-Hinweis | 400–640 px breit |
| notebook-open.png | `assets/ui/notebook-open.png` | Zweiseitiges Reisebuch | Ja | 1536×1024 | Gesamtes Buch, zwei HTML-Textspalten | 900–1100 px breit |

## Hotspots und HTML-Overlay-Flächen

Alle Koordinaten unten sind Prozentwerte des vollständig angezeigten Bildes. Sie sind visuell geschätzt und müssen bei der Einbindung geprüft werden. `ASSET-SPRITES.json` enthält konkrete native Pixel-Ausschnitte für die sieben Sprite-Bögen. Für Sprite-Objekte nicht pauschal CSS-Raster annehmen. Bildgröße proportional erhalten; Text über HTML setzen, nicht ins Bild schreiben.

- **map-table-large**: Landfläche x=43–88%, y=8–85%; Galiläa oben, Samaria mittig, Judäa unten. See Genezareth etwa (75,17), Totes Meer (77,63). Ortsanker vor Integration fachlich präzisieren.
- **map-marker-set**: Reihenfolge: Nazareth, Kafarnaum, Jerusalem; Galiläa, Samaria, Judäa. Piktogramme sind Spielsymbole, keine historischen Stadtsiegel.
- **map-route-strip**: Punkte, Sandalenspuren; gebrochener Pfad, Richtungszeichen; Steinmännchen, Weggabelung. Dekorativ, pointer-events: none.
- **map-compass**: Richtungsrose ohne Magnetnadel; dekorativ oder zugänglich benannte Orientierungshilfe.
- **report-table**: Freie Holzfläche x=24–82%, y=25–87%; Randrequisiten aussparen.
- **report-scroll-large**: Text x=12–88%; Abschnittsflächen y=11–28%, 32–49%, 53–67%, 72–88%. Keine Schrift über Trennlinien legen.
- **evidence-marker**: Wachs rot, Zweigsiegel, Wachs ocker, Bronzedisc; Stoff grün, Stoff rot, Pergamentfalz, Etikett. Neben Text statt über Text setzen.
- **argument-tiles**: Helle Innenflächen mit etwa 12% horizontalem und 20% vertikalem Abstand zum sichtbaren Trägerrand; Layout passt sich Textlänge an.
- **notebook-open**: Links x=7–45%, rechts x=55–92%, jeweils y=20–77%; Bindung in Mitte freihalten. Außenrand schmal, contain verwenden.
- **hint-tablet**: Text x=16–85%, y=23–73%; Griffel und Holzrand freihalten.
- **finale-road-galilee**: Weg etwa x=28–76%, y=57–100%; oberen Himmel für kurze Overlaytitel nutzen; keine Personen/Jesusdarstellung.
- **finale-travel-permit**: Text x=12–88%, y=14–61%; fünf Siegelzentren x≈16,33,50,67,83%, y≈78%, Durchmesser≈13% Bildbreite.
- **checkpoint-bg**: Figuren in freier Mitte x=28–75%; Fußbaseline y=82–90%. Tisch links x=0–23%, y=37–58%; Tor rechts x=73–94%, y=19–50%.
- **travellers-sheet**: Händler, Bauernfamilie, Pilger, Warenträger, römischer Bote. Kein gleichmäßiges Raster! Familie breiter. Native Maßstäbe bewahren; Füße auf gemeinsame Baseline setzen.
- **goods-sheet**: Amphore, Getreidesack, Stoffballen; Münzbeutel, Wachstafel, Korb. Keine zu engen Standardraster: Amphore reicht unter y=512. Ausschnitte siehe ASSET-SPRITES.json.
- **bonus-ui**: Oben Siegel, Amtsstempel, Passierzeichen, Prüfband; unten Pergamentschild, Holzplakette, Wachstafel, Anhänger. Raster ungleich; konkrete Ausschnitte verwenden.

## Responsive Einbindung

Große Hintergründe und Kartentisch sind 1600 px breit, ungefähr 3:2. Sie wurden von den generierten 1536/1537 px geringfügig hochskaliert; dadurch entsteht kein zusätzlicher Bilddetailgrad. Finale wurde als echtes WebP mit Qualität 95 exportiert. Andere Lieferbilder sind echte PNGs.

Für 1024×768 und 820×618 als vollständig sichtbare Bühne mit `object-fit: contain` einbinden; Brief-/Notizbuchtexte intern scrollen. Bei `cover` ändern Beschnitt und Offsets die Hotspotkoordinaten. Transparente Objekte haben vollständige Außenkonturen; einige Bögen besitzen schmale Außenränder, diese nicht zusätzlich abschneiden. Richtwert: mindestens 44×44 CSS-Pixel pro interaktivem Ziel, sichtbarer Fokus und HTML-Label. Die Responsive-Hinweise sind Empfehlungen für die spätere Integration, kein Nachweis eines durchgespielten Browser- oder iPad-Tests.

## Vollständiger Bildbestand

Die ZIP enthält den vollständigen tatsächlichen Bildbestand einschließlich unveränderter Altdateien und vorhandener Kopien. Alle folgenden Pfade existieren. Frühere Dokumentationspfade wie `assets/seals/…` und `assets/scenes/control-post-stage-….png` waren nicht vorhanden; die betreffenden Altbilder liegen derzeit im Repository-Stamm. Kein stilles Verschieben oder Umbenennen.

| Pfad | Zweck | Transparenz | Pixelgröße | Empfohlene Verwendung / Anzeige / Overlays |
|---|---|---|---|---|
| `assets/bonus/bonus-ui.png` | Acht Kontroll- und Entscheidungselemente | Ja | 1536×1024 | Neue Lieferung; Details oben |
| `assets/bonus/checkpoint-bg.png` | Bühne für freiwilliges Kontrollpostenspiel | Nein | 1600×1067 | Neue Lieferung; Details oben |
| `assets/bonus/goods-sheet.png` | Sechs kontrollierbare Waren | Ja | 1536×1024 | Neue Lieferung; Details oben |
| `assets/bonus/travellers-sheet.png` | Fünf Reisenden-Einträge einschließlich Familie | Ja | 2073×758 | Neue Lieferung; Details oben |
| `assets/characters/group-people.webp` | Bestehende Figur / Figurengruppe | Ja | 1341×1173 | 280–450 px hoch; Konturen und Füße freihalten |
| `assets/characters/roman-guard.webp` | Bestehende Figur / Figurengruppe | Ja | 1024×1536 | 280–450 px hoch; Konturen und Füße freihalten |
| `assets/objects/coin-table.webp` | Bestehendes Interaktionsobjekt | Ja | 1536×1024 | 300–700 px breit; nach bestehender App; keine neuen Overlay-Anker festgelegt |
| `assets/objects/edict-board.webp` | Bestehendes Interaktionsobjekt | Ja | 1261×1247 | 300–700 px breit; nach bestehender App; keine neuen Overlay-Anker festgelegt |
| `assets/objects/map-table.webp` | Bestehendes Kartenobjekt | Ja | 1536×1024 | 600–1000 px breit; Text/Ortsmarker als HTML |
| `assets/objects/palestine-map.webp` | Bestehendes Kartenobjekt | Nein | 1086×1448 | 600–1000 px breit; Text/Ortsmarker als HTML |
| `assets/objects/report-scroll.webp` | Bestehendes Interaktionsobjekt | Ja | 1484×1060 | 300–700 px breit; nach bestehender App; keine neuen Overlay-Anker festgelegt |
| `assets/puzzles/map/map-compass.png` | Antike Orientierungsscheibe | Ja | 1254×1254 | Neue Lieferung; Details oben |
| `assets/puzzles/map/map-marker-set.png` | Sechs Orts-/Regionsmarker | Ja | 1536×1024 | Neue Lieferung; Details oben |
| `assets/puzzles/map/map-route-strip.png` | Sechs Reisespurvarianten | Ja | 1536×1024 | Neue Lieferung; Details oben |
| `assets/puzzles/map/map-table-large.png` | Kartentisch Palästina | Nein | 1600×1065 | Neue Lieferung; Details oben |
| `assets/puzzles/report/argument-tiles.png` | Sechs Satzbausteinträger | Ja | 1536×1024 | Neue Lieferung; Details oben |
| `assets/puzzles/report/evidence-marker.png` | Acht Belegmarkierungen | Ja | 1774×887 | Neue Lieferung; Details oben |
| `assets/puzzles/report/report-scroll-large.png` | Vier gegliederte Berichtsabschnitte | Ja | 1024×1536 | Neue Lieferung; Details oben |
| `assets/puzzles/report/report-table.png` | Arbeitsfläche für Zacharias’ Bericht | Nein | 1600×1067 | Neue Lieferung; Details oben |
| `assets/scene/control-post-open.webp` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `assets/scene/control-post.webp` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `assets/scenes/finale-road-galilee.webp` | Aufbruch nach Galiläa | Nein | 1600×1067 | Neue Lieferung; Details oben |
| `assets/ui/finale-travel-permit.png` | Reisegenehmigung mit fünf Siegelflächen | Ja | 1536×1024 | Neue Lieferung; Details oben |
| `assets/ui/hint-tablet.png` | Römische Hinweistafel | Ja | 1536×1024 | Neue Lieferung; Details oben |
| `assets/ui/notebook-open.png` | Zweiseitiges Reisebuch | Ja | 1536×1024 | Neue Lieferung; Details oben |
| `assets/ui/seal-closed.webp` | Bestehendes Siegel / Siegelträger | Ja | 1254×1254 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `assets/ui/seal-open.webp` | Bestehendes Siegel / Siegelträger | Ja | 1536×1024 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `coin-table.webp` | Bestehendes Interaktionsobjekt | Ja | 1536×1024 | 300–700 px breit; nach bestehender App; keine neuen Overlay-Anker festgelegt |
| `control-post-open.webp` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `control-post-stage-0.png` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `control-post-stage-1.png` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `control-post-stage-2.png` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `control-post-stage-3.png` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `control-post-stage-4.png` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `control-post-stage-5.png` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `control-post.webp` | Bestehende Kontrollpostenszene / Torzustand | Nein | 1536×1024 | Hintergrund 900–1100 px; contain; Interaktionen nach bestehender App |
| `edict-board.webp` | Bestehendes Interaktionsobjekt | Ja | 1261×1247 | 300–700 px breit; nach bestehender App; keine neuen Overlay-Anker festgelegt |
| `group-people.webp` | Bestehende Figur / Figurengruppe | Ja | 1341×1173 | 280–450 px hoch; Konturen und Füße freihalten |
| `map-table.webp` | Bestehendes Kartenobjekt | Ja | 1536×1024 | 600–1000 px breit; Text/Ortsmarker als HTML |
| `palestine-map.webp` | Bestehendes Kartenobjekt | Nein | 1086×1448 | 600–1000 px breit; Text/Ortsmarker als HTML |
| `report-scroll.webp` | Bestehendes Interaktionsobjekt | Ja | 1484×1060 | 300–700 px breit; nach bestehender App; keine neuen Overlay-Anker festgelegt |
| `roman-guard.webp` | Bestehende Figur / Figurengruppe | Ja | 1024×1536 | 280–450 px hoch; Konturen und Füße freihalten |
| `seal-authority.png` | Bestehendes Siegel / Siegelträger | Ja | 512×512 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-board.png` | Bestehendes Siegel / Siegelträger | Ja | 768×320 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-burden.png` | Bestehendes Siegel / Siegelträger | Ja | 512×512 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-closed.webp` | Bestehendes Siegel / Siegelträger | Ja | 1254×1254 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-evidence.png` | Bestehendes Siegel / Siegelträger | Ja | 512×512 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-land.png` | Bestehendes Siegel / Siegelträger | Ja | 512×512 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-open.webp` | Bestehendes Siegel / Siegelträger | Ja | 1536×1024 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-reward-frame.png` | Bestehendes Siegel / Siegelträger | Ja | 512×512 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-slot-empty.png` | Bestehendes Siegel / Siegelträger | Ja | 512×512 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |
| `seal-voices.png` | Bestehendes Siegel / Siegelträger | Ja | 512×512 | Siegel 64–128 px, Brett 500–760 px; Labels als HTML |

## Doppelte Dateien

11 bereits vorhandene Gruppen sind bytegleich (SHA-256). Alle wurden beibehalten; die 16 neuen Bilder sind untereinander und gegenüber dem Altbestand eindeutig.

- `assets/characters/group-people.webp` = `group-people.webp`
- `assets/characters/roman-guard.webp` = `roman-guard.webp`
- `assets/objects/coin-table.webp` = `coin-table.webp`
- `assets/objects/edict-board.webp` = `edict-board.webp`
- `assets/objects/map-table.webp` = `map-table.webp`
- `assets/objects/palestine-map.webp` = `palestine-map.webp`
- `assets/objects/report-scroll.webp` = `report-scroll.webp`
- `assets/scene/control-post-open.webp` = `control-post-open.webp`
- `assets/scene/control-post.webp` = `control-post.webp`
- `assets/ui/seal-closed.webp` = `seal-closed.webp`
- `assets/ui/seal-open.webp` = `seal-open.webp`

## Prüfung und Auslieferung

Bilddateien vollständig dekodiert, exakte Namen und Formate geprüft, Alphakanäle aller Sprite-Bögen verifiziert, Außenränder geprüft und visuell auf Beschnitt kontrolliert. Fünf Siegelflächen bestätigt; fünf Reisenden-Einträge einschließlich Familie und sechs Waren vorhanden. Vier Blöcke getrennt abgeschlossen. Die Orientierungsrose ist keine Darstellung eines antiken Magnetkompasses. Kartenregionen und Ortsnamen erscheinen später dynamisch, nicht als eingebrannter Text.

ZIP im Repository-Stamm entpacken. Es enthält direkt `assets/`, bestehende Root-Bilder und Dokumentation, ohne zusätzlichen übergeordneten Ordner und ohne App-Code oder Git-Verzeichnis. Bestehende Bilddateien sind bytegleich zum Ausgangscommit. `ASSET-MANIFEST.txt` führt exakt alle Dateien innerhalb der ZIP auf. `ASSET-QA.json` enthält Maße, Transparenz, Prüfsummen und Dubletten. Andere im alten Plan genannte Assets außerhalb dieses 16-Dateien-Auftrags sind nicht Bestandteil der aktuellen Produktion.
