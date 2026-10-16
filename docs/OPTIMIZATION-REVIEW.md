# Gezielte Optimierung · 16. Oktober 2026

## Hauptszene

Die vorhandenen transparenten Einzelassets bleiben unverändert. Ihre Positionen beziehen sich nun auf den unteren Fuß-/Bodenanker statt auf die Bildmitte. Die Figurengruppe ist 32 % der Szenenbreite breit (vorher 16 %), ihre sichtbare Höhe beträgt etwa 42 % der Szene. Damit passt sie zum bereits im Hintergrund gemalten erwachsenen Soldaten: Die Gruppe steht etwas näher am Betrachter. Den Soldaten zusätzlich zu vergrößern oder zu übermalen ist nicht erforderlich. Kartentisch 18 %, Abgabentisch 21 %, Schriftrolle 10 % Breite; unterschiedliche Bodentiefen, angepasste Hotspots und Schatten. Alle sechs Torzustände wurden geprüft.

## Zwischenetappe

Normales Gehen: **48 → 72 native Bildpixel/s (+50 %)**. Hocken: **46,8 px/s**, weiterhin 65 % des Gehens. Tastatur und Touch verwenden dieselben unmittelbaren Eingaben; diagonale Bewegung bleibt normiert. Bei maximal 0,05 s Simulationsschritt beträgt die Wegänderung höchstens 3,6 px, deutlich kleiner als die Kollisionskontur.

Patrouillen bleiben bei **42 px/s**, 0,8 s Pause an den Wendepunkten, Sichtweite 185 px bzw. 120 px beim Hocken. Sicht, Deckungen, Alarm und sichere Rücksetzpunkte bleiben erhalten. Eine im Browser mit echten Tastatureingaben gespielte Route mit beobachteter südlicher Patrouille benötigt etwa 35 Spielsekunden ohne Entdeckung. Die bisherige zeitlich festgelegte Testüberquerung musste an das frühere Eintreffen angepasst werden; die Wachen wurden nicht abgeschwächt.

## Puzzleauswahl

Das Originalasset wurde bei 1659×948 Pixeln vermessen. Modus-, Größen- und Motivflächen liegen mit kleinem Innenabstand innerhalb ihrer gemalten Vertiefungen. Native Messrechtecke sind in `ASSET-MAP.md` und im Browser-Abnahmetest dokumentiert. Keine Flex-Verteilung über die gemalten Zwischenstege mehr; sichtbare Auswahlkontur und Hitbox verwenden dieselbe Fläche. Die Motive werden proportional vollständig angezeigt, ihre Beschriftungen liegen innerhalb der Vorschau. Der Startbutton steht unter dem Brett, da das Original keine Startbutton-Vertiefung hat. Mindestens 44×44 CSS-Pixel; bei schmaleren Fenstern darf das Brett im Dialog scrollen.

## Acht Kartenhinweise

| Hinweis | Aufgabe | Auswahl / Anforderung |
|---|---|---|
| 1 | Nördliche Region um Nazareth | Drei Regionen, eine Markierung |
| 2 | Region zwischen Galiläa und Judäa | Drei Regionen, räumliche Zuordnung |
| 3 | Stadt des Tempels in Judäa | Fünf Orte: Jerusalem, Kafarnaum, Nazareth, Jericho, Bethlehem |
| 4 | See in Galiläa, aus dem der Jordan nach Süden weiterfließt | Vier Gewässer: Jordan, See Genezareth, Totes Meer, Mittelmeer |
| 5 | Zwei Orte in Galiläa nach Lage zum See | Fünf Orte; Kafarnaum und Nazareth gemeinsam, Reihenfolge egal |
| 6 | Tempelstadt und zugehörige Region | Acht Marker; zuerst Jerusalem, danach Judäa |
| 7 | Wasserweg ab dem See nach Süden | Vier Gewässer; See Genezareth → Jordan → Totes Meer |
| 8 | Möglicher Weg durch das Landesinnere | Acht Marker; Jerusalem → Judäa → Samaria → Galiläa → Nazareth |

Alle Antworten werden direkt auf der Karte gegeben. Feine Verbindungslinien trennen geografischen Punkt und gut antippbares Label, damit nahe Orte nicht übereinanderliegen. Gewässer, Orte und Regionen sind visuell unterscheidbar. Mehrfachauswahlen lassen sich einzeln zurücknehmen oder ganz löschen; Reihenfolgen werden nummeriert. Jede Aufgabe hat drei eigene Hilfestufen (Denkweg, Lage, lösungsnahe Spur) und kurze fachliche Rückmeldungen bei Fehlern. Ein voller Auswahlweg wird erst durch die Prüfung bestätigt.

Das Reisebuch vermittelt auch die ergänzten Distraktoren Jericho und Bethlehem sowie das Mittelmeer. Die zwei anschließenden Transferfragen, das Siegelsystem und die übrigen Stationen bleiben erhalten. Alte Siegel und erreichte Schritte bleiben gespeichert; überholte Einzelantworten der alten Kartenfragen werden nicht als Lösungen neuer Mehrfachaufgaben übernommen. Neue Mehrfachauswahlen bleiben beim Neuladen erhalten (`mapRevision: 2`, unveränderter Speicher-Schlüssel).

## Fachliche Prüfung

Geprüft wurden Norden/Mitte/Süden, Ort und Region, Jerusalem und Tempel, Nazareth und Kafarnaum in Galiläa, der Jordan zwischen den Seen und die Mündung ins Tote Meer. „See als Quelle des gesamten Jordan“ wird ausdrücklich vermieden: Der Jordan fließt bereits von Norden in den See und von dort weiter. Aufgabe 8 benennt einen möglichen Weg durch das Landesinnere, keine einzig historisch mögliche Reiseroute. Die Illustration bleibt eine vereinfachte Orientierungskarte ohne behauptete maßstäbliche Ortsabstände.

Abgleich: [Israel Nature and Parks Authority: Kafarnaum am nordwestlichen Seeufer](https://en.parks.org.il/reserve-park/kfar-nahum-capernaum-national-park/), [USGS: Jordan zwischen See Genezareth und Totem Meer](https://www.usgs.gov/publications/origin-and-mechanisms-salinization-lower-jordan-river), [NET Bible Dictionary: Samaria zwischen Galiläa und Judäa](https://classic.net.bible.org/dictionary.php?word=samaria). Die Aufgaben erfordern die in der App vermittelten Inhalte; diese Links dienen der fachlichen Nachprüfung.

## Geänderte Dateien

- Darstellung und Integration: `app.js`, `content.js`, `style.css`, `index.html`.
- Bewegung: `interlude.js`.
- Puzzleflächen: `bonus-puzzle.js`, `bonus-puzzle.css`, `ASSET-MAP.md`.
- Kartenaufgaben und Speicher: neu `map-rules.js`, angepasst `logic.js`.
- Tests: angepasst `tests/browser.cjs`, `tests/games-browser.cjs`, `tests/games.test.cjs`; neu `tests/map.test.cjs`, `tests/optimization-browser.cjs`, `tests/movement-browser.cjs`.
- Dieser Abschlussbericht. Keine Bilddatei wurde geändert.

## Testumfang

- 59 Node-Tests: bisherige Spielregeln, alle 30 Puzzlevarianten, Lösbarkeit, Kollisionen, Patrouillen, Alarm/Respawn, neue Kartenlösungen, Distraktoren, Reihenfolgen, Hilfestufen und alte/neue Speicherstände.
- Vollständiger Browserdurchlauf aller fünf Stationen einschließlich falscher Antworten, Siegel, Finale und Speicherwiederherstellung.
- Bonus-/Zwischenetappen-Browsertest: alle 30 Kombinationen, Tausch- und Schiebemechanik, echte Tastaturroute, Touch-Freigabe/Abbruch, Tab-Pause und Fortsetzen, Ergebnis und einmaliger Start.
- Zusätzliche Abnahme: alle sechs Szenenstufen und fünf Hotspots; alle acht Kartenhinweise mit Fehlversuchen, drei Hilfestufen, richtigen Antworten und Wiederaufnahme; vermessene Puzzle-Hitboxen sowie alle Motive, Modi und Größen.
- Bewegungsmessung im Browser: Gehen mit Tastatur und Touch 72 px/s, Hocken 46,8 px/s, sofortiges Stoppen nach Freigabe und Pointer-Abbruch.
- Wiederherstellung nach fehlgeschlagenem Bild-/Metadatenladen ohne Verlust der Siegel.

Die vier angeforderten Ansichten **1024×768, 1180×820, 1194×834, 1366×1024** wurden mit WebKit und Touch-Emulation geprüft. Zusätzliche bestehende Regressionen berücksichtigen 834×1194 und 820×618. Sichtprüfungen der Screenshots ergänzen Messungen von Markerabständen, Touchgrößen und Rahmeninnenflächen. Ein physisches iPad stand nicht zur Verfügung.
