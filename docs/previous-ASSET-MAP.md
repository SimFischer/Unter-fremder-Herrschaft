# Asset-Paket – Flucht aus dem römischen Palästina

## Umfang und Status

Teillieferung vom 15.10.2026: 14 Bilddateien, Prioritäten 1 und 2. Kein vollständiges Asset-Paket und noch kein exakt mit dem Bestand abgeglichener Produktionsstand.

Die Existenz der Referenzdateien im GitHub-Repository wurde geprüft. Ihre Bildinhalte konnten technisch nicht geladen werden. Der Stil folgt deshalb der schriftlichen Vorgabe; die Übereinstimmung mit den bisherigen Assets ist nicht verifiziert.

Die sechs Szenen sind echte PNG-Dateien, keine umbenannten WebP-Dateien. Der WebP-Export stand nicht zur Verfügung. Für die Integration die nachstehenden PNG-Pfade verwenden. Native Szenengröße: 1536 × 1024 (3:2), nicht künstlich hochskaliert. Sie liegt knapp unter der Zielbreite von etwa 1600 Pixeln.

## Szenen

Alle Szenen sind deckend und für eine Hintergrundfläche mit Seitenverhältnis 3:2 vorgesehen. Bei iPad-Ansichten `object-fit: contain` verwenden; bei `cover` verschieben sich sichtbare Hotspotpositionen durch Beschnitt. Die Bilder beruhen auf aufeinanderfolgenden Bildbearbeitungen. Bildaufbau und Perspektive sind weitgehend konsistent, aber Texturen und einzelne Details verändern sich leicht. Nicht als pixelgenaue Animation oder als unveränderte Ebenen eines Compositings behandeln. Ein kurzer Übergang zwischen vollständigen Bildern ist möglich. Historisch inspirierte Illustration, keine archäologische Rekonstruktion eines bestimmten Ortes.

| Dateiname | Zweck / Zustand | Verwendung | Transparenz | Größe |
|---|---|---|---|---|
| assets/scenes/control-post-stage-0.png | Tor geschlossen, beide Verriegelungen geschlossen | Startzustand | Nein | 1536 × 1024 |
| assets/scenes/control-post-stage-1.png | Kleine untere Verriegelung gelöst | Erstes Siegel erworben | Nein | 1536 × 1024 |
| assets/scenes/control-post-stage-2.png | Querbalken nach links zurückgezogen, Tor geschlossen | Zweites Siegel erworben | Nein | 1536 × 1024 |
| assets/scenes/control-post-stage-3.png | Tor teilweise geöffnet, Weg sichtbar | Drittes Siegel erworben | Nein | 1536 × 1024 |
| assets/scenes/control-post-stage-4.png | Tor fast vollständig geöffnet | Viertes Siegel erworben | Nein | 1536 × 1024 |
| assets/scenes/control-post-stage-5.png | Durchgang frei, Wache gestattet Durchgang | Fünftes Siegel erworben | Nein | 1536 × 1024 |

### Hotspots der Szenen

Koordinaten sind Prozentwerte relativ zum vollständigen Bild: x, y, Breite, Höhe. Sie sind visuell geschätzte Integrationsvorschläge, keine im Browser getesteten Trefferflächen. Jede aktive Fläche sollte mindestens 44 CSS-Pixel groß sein und ein zugängliches HTML-Label erhalten.

| Objekt | x | y | Breite | Höhe | Hinweis |
|---|---:|---:|---:|---:|---|
| Erlassbrett | 14 | 39 | 12 | 16 | Freie Holzfläche für Interaktion; Texte außerhalb des Bildes rendern |
| Verwaltungstisch | 3 | 57 | 24 | 18 | Akten-/Abgabeninteraktion |
| Tor | 49 | 24 | 29 | 48 | Fortschritt; ab Stage 5 Ausgang |
| Querbalken | 49 | 44 | 23 | 5 | Zustandsanzeige, nur Stage 0–2 |
| Untere Verriegelung | 62 | 53 | 6 | 8 | Zustandsanzeige, nur Stage 0–2 |
| Wache | 82 | 38 | 16 | 40 | Dialog; Fläche umfasst finale Handbewegung |

Die Wache steht nahe am rechten Rand. Bei responsiver Einbindung nicht seitlich abschneiden. In den Bildern sind keine dynamischen Texte enthalten.

## Siegelsystem

Alle PNGs besitzen echte Alpha-Transparenz und zusätzlichen transparenten Außenrand. Die Symbole sind Illustrationen und keine Schriftzeichen. Einzelobjekte wurden aus einem gemeinsam erzeugten Bogen zugeschnitten; Größen wurden für die Einbindung vereinheitlicht.

| Datei | Zweck / Symbol | Verwendung / Szene | Transparenz | Größe | Hotspot |
|---|---|---|---|---|---|
| assets/seals/seal-authority.png | Amtsstab und Lorbeer | Herrschaftsnetz / Siegelübersicht | Ja | 512 × 512 | Mittiger Kreis; HTML-Label „Herrschaft“ |
| assets/seals/seal-burden.png | Getreidesack und Münze | Manipulierte Akte / Siegelübersicht | Ja | 512 × 512 | Mittiger Kreis; Label „Abgaben“ |
| assets/seals/seal-voices.png | Drei Profilköpfe | Stimmen / Siegelübersicht | Ja | 512 × 512 | Mittiger Kreis; Label „Stimmen“ |
| assets/seals/seal-land.png | Fluss und Weg | Karte / Siegelübersicht | Ja | 512 × 512 | Mittiger Kreis; Label „Land“ |
| assets/seals/seal-evidence.png | Papyrusrolle mit Siegel | Bericht / Siegelübersicht | Ja | 512 × 512 | Mittiger Kreis; Label „Belege“ |
| assets/seals/seal-slot-empty.png | Leere bronzene Vertiefung | Noch nicht erworbenes Siegel | Ja | 512 × 512 | Mittiger Kreis |
| assets/seals/seal-reward-frame.png | Bronzener Rahmen, Mitte transparent | Belohnungsdarstellung | Ja | 512 × 512 | Kein eigener Hotspot nötig |
| assets/seals/seal-board.png | Holzbrett mit fünf leeren Fassungen | Siegelübersicht | Ja | 768 × 320 | Fünf Fassungen, siehe unten |

Empfohlene Siegeldarstellung: 64–128 CSS-Pixel; Belohnung 180–240 CSS-Pixel. Beim Brett liegen die Mittelpunkte ungefähr bei x = 24%, 37%, 50%, 64%, 77%, jeweils y = 50%. Fassungsdurchmesser etwa 12% der Brettbreite. Zum Einpassen der Siegel den transparenten Bildrand berücksichtigen; CSS-Overlay anhand der sichtbaren Wachsfläche testen. Text und Status müssen zusätzlich in HTML vorliegen.

## Noch offen

Alle folgenden Bereiche fehlen in dieser Teillieferung. Keine Platzhalter oder anderen Bilder werden als diese Assets ausgegeben:

- assets/puzzles/authority/: authority-board.png, authority-tags.png, authority-connectors.png, authority-result.png
- assets/puzzles/dossier/: dossier-table.png, dossier-sheet.png, dossier-stamp.png, dossier-correction-tab.png
- assets/puzzles/voices/: voices-scene.png
- assets/characters/: merchant-woman.png, farmer.png, freedom-seeker.png, roman-soldier.png; optional scribe.png
- assets/puzzles/map/: map-table-large.png, map-marker-set.png, map-route-strip.png, map-compass.png
- assets/puzzles/report/: report-table.png, report-scroll-large.png, evidence-marker.png, evidence-stamp.png, argument-tiles.png
- assets/ui/: seal-reward-bg.png, seal-glow.png, seal-imprint.png, notebook-open.png, notebook-tab.png, knowledge-icon.png, hint-tablet.png, finale-travel-permit.png, button-parchment.png, button-bronze.png, panel-parchment.png, panel-stone.png, hotspot-pin.png, hotspot-pin-done.png
- assets/scenes/: finale-road-galilee.webp
- assets/bonus/: checkpoint-bg.png, travellers-sheet.png, goods-sheet.png, check-stamp.png, pass-stamp.png, question-stamp.png, bonus-ui.png
- WebP-Fassungen der sechs Kontrollposten-Szenen und visueller Abgleich mit den vorhandenen Repository-Bildern.

Die Karteninhalte sind noch nicht erstellt. Eine spätere Kartenillustration muss separat geografisch geprüft werden. Ein moderner Magnetkompass wäre für diese historische Umgebung unpassend; die vorgesehene Datei sollte nur eine abstrahierte Orientierungshilfe zeigen.

## Einbindung

ZIP im Repository-Stamm entpacken. Es enthält direkt `assets/`, diese Datei und `ASSET-MANIFEST.txt`. Keine App-Dateien sind enthalten oder verändert. Vor dem Entpacken gleichnamige vorhandene Dateien prüfen. Die Szenen mit den PNG-Pfaden laden. Spiellogik, responsive Darstellung, Touch-Trefferflächen und Vorladen der sechs Szenen müssen in der App umgesetzt und auf dem iPad geprüft werden.
