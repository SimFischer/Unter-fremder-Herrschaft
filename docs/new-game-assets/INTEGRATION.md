# Einbindung der neuen Spielassets

Diese Notiz ergänzt `ASSET-MAP.md` (Lieferung vom 18.10.2026). Dort stehen die Zuschnitte und freien Flächen der Bilder, hier steht, wie die App sie nutzt.

## Startpanel „Unruhe am Kontrollposten“

- `interlude.js` nutzt `checkpoint-run-start-panel-v2.png`. Das alte Panel bleibt im Repository.
- Titel, Beschreibung, die drei Sammelobjekte und der Startbutton liegen exakt in den dokumentierten Overlay-Flächen (`interlude.css`).
- Der Startbutton ist auf dem unteren Pergamentstreifen (y 790–912) mittig ausgerichtet. Auf kleinen Bildschirmen braucht er 44 px Mindesthöhe und darf dann über die konservative Sicherheitsfläche hinausgehen, aber nie über den Streifen.

## Siegel 5 „Spuren im Reisebericht“ (3 statt 6 Schritte)

1. **Erkundung** (`report-walk.js`, `report-walk.css`): Die Spielfigur startet am Tor unten links und erreicht vier Stationen. An jeder Station gibt es eine Beobachtung aus Zacharias’ Bericht und einen Beleg für die Leiste oben.
2. **Einordnen**: Die vier Belege werden auf `report-category-board.png` gelegt (Kontrolle, Belastung, sichtbare Macht, Hoffnung).
3. **Argumentationswerkstatt**: `report-result-panel.png` zeigt die Belege mit ihren Kategorien. Darunter entsteht die Erklärung aus drei Bausteinen (`report-argument-tiles.png`).

| Station | Standpunkt (Fuß) | Radius | Beleg |
|---|---|---|---|
| Straßensperre | 490, 335 | 90 | control-tablet |
| Markt | 1200, 392 | 95 | tax-sack |
| Wachposten | 1266, 706 | 95 | roman-shield |
| Gespräch unter dem Olivenbaum | 650, 690 (Marker 650, 682) | 205 | shared-hope |
| Wegweiser (kein Beleg) | 300, 640 | 70 | – |

- Das Gespräch findet in einem eingezäunten Olivenhain statt. Man hört es deshalb vom Weg östlich des Hains aus.
- Die begehbaren Flächen stehen als 8-px-Raster in `report-walk.js` (`ROWS`). Abgeleitet wurde das Raster aus `report-route-bg.webp`: helle, ruhige Sandflächen, die vom Tor aus zusammenhängen. Die zentrale Olivenbaum-Insel, Gebäude, Stände und die gemalten Figuren sind gesperrt.
- `tests/report-walk.test.cjs` prüft, dass alle Stationen zu Fuß erreichbar sind, dass es keine abgeschnittenen Inseln gibt und dass ein vollständiger Weg mit normaler Richtungseingabe funktioniert.
- Spielerfaktor 0,21, wie in `ASSET-MAP.md` empfohlen. Marker sind 30 px breit, also bewusst dezent.
- Nicht eingebaut sind `report-npcs.png` und, bis auf den Wegweiser, die Objekte aus `report-foreground.png`. Der Hintergrund enthält die Figuren und Objekte bereits. Die Sprites bleiben für Erweiterungen verfügbar.
- Spielstand: `answers[4].found` (gesicherte Stationen) und `category0…3` (Zuordnung). Alte Spielstände ohne `reportRevision:2` behalten ein erworbenes Siegel 5. Ein unvollständiger alter Versuch beginnt neu auf dem Reiseweg.

## „Der Weg des Boten“ (freiwillig)

- `bote.js` und `bote.css`, Regeln wie „Das geheime Zeichen“ (im-zeichen-der-wende): Nach jeder Runde kommt ein Zeichen hinzu, dasselbe Zeichen erscheint höchstens zweimal hintereinander, ein Fehler beendet den Durchlauf.
- Die Felder liegen auf `bote-board.png` an den dokumentierten Rechtecken. Die Symbole sind auf 68 % der Feldbreite skaliert. `bote-active.png` dient als Rahmen für das gerade gezeigte Feld.
- Freigeschaltet wird das Spiel wie das Bildpuzzle nach allen fünf Siegeln (Menü und Finale). Die Bestleistung steht im Spielstand als `boteBest`.
- `bote-result.png` und `bote-record-panel.png` wurden nicht geliefert. Serie, Zeit, Bestleistung und „Noch einmal“ sind als HTML umgesetzt.

## Bildpuzzle

- „Vorlage zeigen“ blendet das fertige Motiv über das Brett, ohne die Teile zu verändern. Ein Tippen auf die Vorlage blendet sie wieder aus.
- Gelöste Motive tragen im Auswahlbrett die Markierung „Gelöst“. Sie ist unabhängig vom Auswahlhaken ✓.

## Asset-Update 2 (`docs/asset-update-2/`)

- **Zwischenetappe:**
  - `checkpoint-run-start-panel-v3.png`: gleiche Geometrie wie v2, außen transparent.
  - `checkpoint-run-result-v2.png`: Für Icon, Wort und Häkchen gibt es pro Zeile eigene Felder, dazu einen eigenen Buttonstreifen. Der Titel steht einzeilig.
- **Siegel 5, Auswertung im handgemalten Stil:**
  - `report-category-board-v2.png` und `report-result-panel-v2.png`, gleiche Felder wie zuvor.
  - Die Kategoriefelder der Ergebnistafel sind auf y 540–606 erweitert. Dort stehen Kurzformen (`CATEGORY_SHORT`: Kontrolle, Belastung, Machtzeichen, Hoffnung), weil „Sichtbare römische Macht“ in Georgia nicht einzeilig passt. Der volle Name steht im Tableau und im `title`.
  - `report-argument-tiles-v2.png` nutzt die Kachel `medium` (640 × 270). Die Textfläche umfasst 11,9 % / 14,8 % / 76,2 % / 70,4 % (links, oben, Breite, Höhe), die Schrift ist mindestens 14 px groß.
- **Der Weg des Boten:**
  - Nach einem Fehler bleibt das falsche Feld 1,3 s sichtbar. Danach erscheint `bote-result.png` mit Serie, Zeit, Bestleistung, Hinweis und zwei Buttons.
  - `bote-record-seal.png` steht bei einer neuen Bestleistung im runden Siegelfeld.
  - Der Startbildschirm zeigt das Brett mit den vier Zeichen.
- **Bildpuzzle:**
  - `puzzle-preview-icon.png` steht im Button „Vorlage zeigen“.
  - `puzzle-solved-mark.png` sitzt oben links auf gelösten Motiven, gegenüber dem Auswahlhaken oben rechts.
- **Siegel 1 und 2** (`frames.css`): 9-Slice-Rahmen.
  - `frame-erlassbrett.png` (Slice 160, Rand 28 px) für Zuordnung und Ketten.
  - `frame-akte.png` (Slice 200, Rand 28 px) für Kontrollakte und Berichtigung.
  - `frame-notiz.png` (Slice 100, Rand 10 px) für Fund- und Belegnotizen.
- Nicht mehr genutzt, aber im Repository belassen: `checkpoint-run-start-panel(-v2).png`, `checkpoint-run-result.png`, `report-category-board.png`, `report-result-panel.png`, `report-argument-tiles.png`.
