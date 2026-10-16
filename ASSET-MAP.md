# Asset-Karte – Zwischen-Minispiel und Bonuspuzzle

Stand: 16. Oktober 2026. 23 Bilddateien in sieben getrennten Produktionsblöcken; nach jedem Block gespeichert und geprüft. Keine Spielmechanik programmiert. Basisbestand geprüft am Repository-Commit `8bacf9a6cfd7b6cc121669bdd031c9dc1c60446e`.

## Verbindliche Stiländerung

Auf ausdrücklichen Wunsch des Nutzers nutzt **nur das Schleich-Minispiel Pixelgrafik aus der Vogelperspektive**, angelehnt an seine Bildreferenz. Warme historische Materialien bleiben erhalten. Die Bonuspuzzles behalten den fein handgemalten Hauptstil. Diese zwei Bildsprachen sind beabsichtigt. Die verworfenen gemalten Minispielentwürfe gehören nicht zur Lieferung.

## Lieferung und Bestand

Alle 23 Zielpfade waren im geprüften Repository noch nicht vorhanden. Vorhandene gute Hauptassets wurden als Stilreferenzen erhalten, nicht überschrieben oder neu exportiert. Die geprüften früheren Szenen besitzen andere Aufgaben: breite freie Spielflächen, eine ruhige beschriftungsfreie Karte und eine personenlose Abschlusslandschaft. Die neuen Puzzlemotive ergänzen unterscheidbare Details, Reisezubehör beziehungsweise Reisende. Es gibt keine bytegleichen Bildduplikate im Paket.

Die ZIP wird im Repository-Root entpackt. Sie enthält `assets/...`, diese Karte, das neue Manifest und ergänzende Dokumentation. Die beiden bisherigen Root-Dokumente sind unter `docs/asset-history/before-interlude-puzzle-*` gesichert; bestehende Bilddateien werden nicht ersetzt. Es wurde nichts zu GitHub hochgeladen.

## Dateien

Anzeigegrößen sind CSS-Pixel und Empfehlungen, keine auf einem realen iPad getesteten Layoutwerte. Native Größe und Transparenz wurden aus den Dateien gelesen.

| Dateiname | Pfad | Zweck | Transparenz | Native Größe | Empfohlene Anzeigegröße | Verwendung |
|---|---|---|---|---|---|---|
| checkpoint-run-bg.webp | `assets/interlude/checkpoint-run-bg.webp` | Pixel-Spielfläche des Kontrollpostens | Nein | 1659×948 | 900–1100 px breit | Vollständig mit contain anzeigen; keine zusätzlichen Verstecke pauschal über die bereits gemalten Deckungen legen. |
| checkpoint-run-foreground.png | `assets/interlude/checkpoint-run-foreground.png` | Acht Pixel-Vordergrundobjekte | Ja | 1536×1024 | 40–170 px je Objekt | Einzelne Ausschnitte; dekorative Ebene vor Figuren, pointer-events:none. |
| checkpoint-run-hideouts.png | `assets/interlude/checkpoint-run-hideouts.png` | Sechs zusätzliche Pixel-Deckungsobjekte | Ja | 1536×1024 | 110–240 px je Versteck | Varianten für spätere Levelgestaltung; Spritegröße und Kollisionsfläche getrennt behandeln. |
| checkpoint-run-route-markers.png | `assets/interlude/checkpoint-run-route-markers.png` | Sechs Pixel-Weg-/Zielhilfen | Ja | 1536×1024 | 24–120 px je Marker | Bodenebene unter Figuren; Sichtbarkeit auf hellem Sand prüfen. |
| checkpoint-run-player.png | `assets/interlude/checkpoint-run-player.png` | Neun Pixel-Zustände einer Reisefigur | Ja | 1536×1024 | 42–54 px sichtbare Körperhöhe | Vier Richtungen mit Stand/Schritt plus Hocke; individuelle Ausschnitte und Fußanker verwenden. |
| checkpoint-run-guards.png | `assets/interlude/checkpoint-run-guards.png` | Neun Pixel-Zustände einer Patrouille | Ja | 1536×1024 | 46–60 px inkl. Helm | Gleiche Körperhöhe wie Spieler, Helm zusätzlich; vier Richtungen mit Stand/Schritt plus Alarm. |
| checkpoint-run-collectibles.png | `assets/interlude/checkpoint-run-collectibles.png` | Karte, Proviant, Genehmigung, Wasserflasche, Schnurbeutel | Ja | 1536×1024 | 40–64 px je Gegenstand | Drei Hauptziele zeilenweise oben; Touchziel mindestens 44 CSS-Pixel. |
| checkpoint-run-alert-effects.png | `assets/interlude/checkpoint-run-alert-effects.png` | Aufmerksamkeit, Alarm, Sichtkeil, Entdeckt-Effekt | Ja | 1536×1024 | 24–48 px Tuch; 90–180 px Sichtkeil | Sichtkeil ist dekorativer Hinweis, keine berechnete Sicht-/Kollisionsgeometrie. |
| checkpoint-run-ui.png | `assets/interlude/checkpoint-run-ui.png` | Fünf Pixel-UI-Bausteine | Ja | 1536×1024 | Status 210–320 px; Symbole 40–56 px | Status, Dreifachhalter, Unentdeckt, Ziel, Fortschritt getrennt zuschneiden. |
| checkpoint-run-result.png | `assets/interlude/checkpoint-run-result.png` | Pixel-Ergebnistafel | Ja | 1536×1024 | 700–960 px breit | Titel und vier Ergebniszeilen als HTML-Text darüberlegen. |
| checkpoint-run-start-panel.png | `assets/interlude/checkpoint-run-start-panel.png` | Pixel-Starttafel mit drei Zielplätzen | Ja | 1536×1024 | 600–800 px breit | Anleitung oben, drei Gegenstands-Overlays mittig, Startbeschriftung unten. |
| motif-control-post.webp | `assets/bonus/puzzle-motifs/motif-control-post.webp` | Puzzlemotiv Kontrollposten | Nein | 1658×949 | 800–1100 px breit | Ein Original für beide Modi und 3×3/4×4/5×5; proportional teilen. |
| motif-map-palestine.webp | `assets/bonus/puzzle-motifs/motif-map-palestine.webp` | Puzzlemotiv historischer Kartentisch | Nein | 1659×948 | 800–1100 px breit | Bildhafte Karte ohne Beschriftung; keine vermessene oder quellenkritische Karte. |
| motif-taxes-market.webp | `assets/bonus/puzzle-motifs/motif-taxes-market.webp` | Puzzlemotiv Abgaben und Markt | Nein | 1660×948 | 800–1100 px breit | Tisch, Waage, Getreide und Amtsperson bieten unterscheidbare Bildbereiche. |
| motif-people-under-rome.webp | `assets/bonus/puzzle-motifs/motif-people-under-rome.webp` | Puzzlemotiv unterschiedliche Menschen | Nein | 1659×948 | 800–1100 px breit | Korrigierte Endfassung mit vollständig sichtbaren Sandalen der Hauptfigur. |
| motif-road-galilee.webp | `assets/bonus/puzzle-motifs/motif-road-galilee.webp` | Puzzlemotiv Weiterreise nach Galiläa | Nein | 1659×948 | 800–1100 px breit | Abschlussmotiv mit Reisenden; ohne religiöse Ikonographie. |
| puzzle-frame.png | `assets/bonus/puzzle-ui/puzzle-frame.png` | Handgemalter Puzzle-Rahmen mit transparenter Mitte | Ja | 1659×948 | 900–1100 px breit | Bild hinter der transparenten Öffnung positionieren; Öffnung siehe unten. |
| puzzle-selection-panel.png | `assets/bonus/puzzle-ui/puzzle-selection-panel.png` | Handgemalte Motivauswahl mit Modus-/Größenflächen | Ja | 1659×948 | 900–1100 px breit | Fünf Vorschaubilder und echte HTML-Bedienelemente darüberlegen. |
| puzzle-complete.png | `assets/bonus/puzzle-ui/puzzle-complete.png` | Handgemalte Erfolgstafel | Ja | 1536×1024 | 700–960 px breit | Erfolgstext und zwei Schaltflächen als HTML-Overlays. |
| tile-selected.png | `assets/bonus/puzzle-ui/tile-selected.png` | Bronzene Auswahlkontur | Ja | 1254×1254 | Größe des Puzzleteils | Mitte transparent; für rechteckige Teile Randsegmente/9-slice verwenden oder Verzerrung prüfen. |
| tile-swap-hint.png | `assets/bonus/puzzle-ui/tile-swap-hint.png` | Offene Bronzeecken mit Tuch als Tauschhinweis | Ja | 1254×1254 | Größe des Puzzleteils | Mitte transparent; vier Ecken einzeln verankern, Tuch nicht abschneiden. |
| empty-tile.png | `assets/bonus/puzzle-ui/empty-tile.png` | Dunkle Holzvertiefung für die Schiebelücke | Ja | 1254×1254 | Größe des Puzzleteils | Außen transparent, Innenfläche bewusst dunkel gefüllt. |
| mode-icons.png | `assets/bonus/puzzle-ui/mode-icons.png` | Zwei handgemalte Modussymbole | Ja | 1536×1024 | 80–120 px je Symbol | Links Tausch, rechts Schieben; immer mit HTML-Label Einfach/Klassisch ergänzen. |

## Sprite-Ausschnitte und Animation

`docs/interlude-puzzle/SPRITES.json` enthält pro Einzelsprite ein geprüftes Quellrechteck `[x0,y0,x1,y1]` (rechte/untere Kante exklusiv), die sichtbare Kontur und einen unteren Basisanker. Kein pauschales gleichmäßiges Raster annehmen: insbesondere Wagen, UI-Teile und Figuren sind unterschiedlich angeordnet. Pixelkoordinaten beziehen sich auf native Bilder, nicht auf CSS-Größen.

Figurenreihenfolge: Süden Stand, Süden Schritt, Hocke/Alarm; Westen Stand, Westen Schritt, Osten Stand; Osten Schritt, Norden Stand, Norden Schritt. Stand und Schritt bilden eine **einfache Zustandsfolge**, keinen durchgetesteten nahtlosen Laufzyklus. Beim Wechsel Quellausschnitte auf dieselbe Fußposition setzen und dieselbe Körperhöhe erhalten; Wachenhelme stehen über den Spieler hinaus. Nicht jeden Ausschnitt unabhängig auf identische Gesamtgröße strecken. Schatten oder Speere sind keine Kollisionsflächen.

Pixelbilder mit scharfer Skalierung (`image-rendering: pixelated`) anzeigen. Die gelieferten Bilder sind KI-erzeugte Pixelillustrationen; sie bilden kein mathematisch einheitliches Tile-Set und keine garantiert identische logische Pixelgröße ab. Eine spätere Implementierung sollte Wege und Kollisionen ausdrücklich definieren. Die Asset-Produktion enthält keinen Spielcode.

## Spielfläche und Ebenen

Alle folgenden Werte sind visuell geschätzte Prozente des vollständig sichtbaren Bildes; bei Einbindung verifizieren. Die Szene vollständig proportional anzeigen, nicht mit cover abschneiden. Eingang ungefähr x=10–20%, y=85–98%; Zielbereich vor dem Tor x=79–86%, y=15–24%. Das gemalte Tor ist geschlossen; der Zielbereich liegt davor, eine spätere Toröffnung müsste separat umgesetzt werden.

Vier Deckungsinseln ungefähr: Wagen x=20–41%, y=30–53%; obere Stein-/Oliveninsel x=42–55%, y=17–39%; Markt-/Sackinsel x=58–79%, y=29–53%; unterer Holzverschlag x=25–56%, y=54–81%. Niedrige Mauer unten rechts x=64–81%, y=59–77%. Das sind Orientierungsbereiche, keine fertig getesteten Kollisionspolygone.

Hintergrund → Bodenspuren und Sichtkeil → Figuren/Gegenstände → gezielt platzierte Vordergrundobjekte → UI. Vorhandene gemalte Hindernisse und zusätzliche Verstecksprites sind Alternativen für die Levelgestaltung; nicht ohne Abgleich doppelt übereinanderlegen. Sichtkeil und Alarmring haben Teiltransparenz. Sichere Zone hat eine freie Mitte.

## Text- und Overlayflächen

Alle Prozentangaben beziehen sich auf die volle jeweilige Bildfläche. Die Flächen sind visuell geprüft und bewusst etwas kleiner als die gezeichneten Innenfelder gewählt. Keine Texte in Bilddateien eingebrannt.

- **Minispiel-Ergebnis:** Titel x=27–72%, y=13–22%; Textzeilen x=24–85%, y=30–37%, 44–51%, 58–65%, 71–78%. Badgeplätze etwa x=14–20% in denselben Zeilen. Fußaktion x=40–60%, y=83–88%.
- **Minispiel-Start:** Anleitung x=27–73%, y=19–44%; drei Zielsockel x=27–39%, 44–56%, 61–73%, y=54–70%; Startbereich x=38–62%, y=79–85%.
- **Puzzle-Rahmen:** transparente Innenöffnung ungefähr x=11.6–88.6%, y=15.2–80.7%. Rand frei lassen und Motiv entsprechend dahinter ausrichten. Die Öffnung hat etwa 2.06:1, die Motive etwa 1.75:1: Für unverzerrte Motive seitliche Innenränder im Rahmen zulassen oder den Rahmen mit Randsegmenten anpassen; das Motiv nicht unbemerkt beschneiden.
- **Puzzle-Auswahl:** Titel x=17–83%, y=12–17%; Vorschauen oben x=12–35%, 39–61%, 66–88%, y=24–41%; unten x=24–48%, 53–76%, y=48–64%. Modusflächen x=12–32%, 36–57%, y=74–81%; Größenflächen x=63–69%, 73–79%, 83–89%, y=74–81%. Moduslabels: Einfach/Klassisch; Größenlabels: 3×3/4×4/5×5, immer als echte App-Texte.
- **Puzzle-Erfolg:** Haupttext x=18–82%, y=22–56%; Aktionen links x=16–46%, rechts x=54–84%, jeweils y=65–74%.
- **Auswahlkontur/Tauschhinweis:** in Rechteckgröße des tatsächlichen Puzzleteils einpassen. Sichtbare Quellkontur vor dem Skalieren berücksichtigen, da transparente Außenränder mitgeliefert werden. Bei schmalen Teilen Ecken getrennt verankern; keine Kontur über mehrere Kacheln ziehen.

## Puzzlegrößen und Lesbarkeit

Die fünf Motive werden im Originalseitenverhältnis in N×N gleich große **rechteckige** Stücke geteilt. 3×3, 4×4 und 5×5 brauchen keine eigenen Bilder. Exakte Grenzpixel durch proportional berechnete Grenzen verwenden, damit auch Breiten von 1659 px ohne Reststreifen funktionieren. Für quadratische Stücke wäre ein ausdrücklich festgelegter Beschnitt nötig; dadurch können Bildbestandteile entfallen.

Die 3×3-/4×4-/5×5-Aufteilungen wurden als statische Vorschau geprüft. Ein Gesicht oder Objekt kann bei mehreren unterschiedlichen Rastern zwangsläufig eine Trennlinie berühren; die Motive bieten visuelle Anschlüsse über solche Linien. Bei 900 px Bildbreite sind 5×5-Teile etwa180 px breit und103 px hoch. Mindestens44×44 CSS-Pixel Touchfläche und HTML-Labels/Fokuszustände bei der späteren Einbindung vorsehen.

## Qualität und Grenzen

Alle Bilder wurden nach ihrem Produktionsblock visuell geprüft, PNGs zusätzlich auf hellem und dunklem Grund. Alle PNGs besitzen echte Alpha-Transparenz; WebPs sind echte opake WebP-Dateien mit mindestens1600 px Breite. Figurenkonturen sind vollständig; beim Menschen-Puzzlemotiv wurde ein Fußbeschnitt gezielt korrigiert. Transparente Mittelpunkte von Rahmen und Auswahlmarkierungen sind numerisch geprüft. Die Schiebelücke hat absichtlich eine dunkle Innenfläche.

Eine statische iPad-ähnliche Vorschau prüft Figuren-/Objektlesbarkeit; es gab keinen realen iPad-Test, keinen Browser-Spieltest und keinen geprüften Animationsablauf. Die historischen Bilder sind illustrative Darstellungen, keine archäologisch exakten Rekonstruktionen. Pixel-Sprites dürfen im Minispiel kompaktere Proportionen haben als die gemalten Hauptfiguren.

Werkzeug und finaler Prompt-Satz: `docs/interlude-puzzle/PRODUCTION-PROMPTS.md`. Dateimaße, Alpha-Anteil, Randabstände, Hashes und Dateigrößen: `docs/interlude-puzzle/QA.json`. Die Produktion verwendete das eingebaute Imagegen; Python diente ausschließlich Dateiexport, Analyse, Prüfvorschauen und Verpackung.
