# Produktionsvorgaben – vier getrennte Blöcke

Werkzeug: eingebautes Imagegen, je Datei ein eigener Generierungsaufruf, keine Varianten. Stilreferenzen und Lieferentscheidungen siehe ASSET-MAP.md. Die folgenden normalisierten Motivvorgaben dokumentieren das Prompt-Set.

Gemeinsame Vorgabe: warm hand-painted historical 2D adventure, first-century Roman Palestine, sand/ochre/terracotta/walnut/olive, fine drawn forms, no photorealism, no 3D render, no modern UI, no embedded text. Transparent objects complete with alpha gutters; backgrounds landscape with quiet overlay space.


## Block 1

- `assets/puzzles/map/map-table-large.png`: Kartentisch Palästina. Hintergrund, vollständig mit contain anzeigen. Landfläche x=43–88%, y=8–85%; Galiläa oben, Samaria mittig, Judäa unten. See Genezareth etwa (75,17), Totes Meer (77,63). Ortsanker vor Integration fachlich präzisieren.
- `assets/puzzles/map/map-marker-set.png`: Sechs Orts-/Regionsmarker. Einzelsprites aus 3×2-Bogen, zeilenweise. Reihenfolge: Nazareth, Kafarnaum, Jerusalem; Galiläa, Samaria, Judäa. Piktogramme sind Spielsymbole, keine historischen Stadtsiegel.
- `assets/puzzles/map/map-route-strip.png`: Sechs Reisespurvarianten. Einzelne Streifen aus 2×3-Bogen, nicht gesamten Bogen als Route nutzen. Punkte, Sandalenspuren; gebrochener Pfad, Richtungszeichen; Steinmännchen, Weggabelung. Dekorativ, pointer-events: none.
- `assets/puzzles/map/map-compass.png`: Antike Orientierungsscheibe. Einzelobjekt neben Karte. Richtungsrose ohne Magnetnadel; dekorativ oder zugänglich benannte Orientierungshilfe.

## Block 2

- `assets/puzzles/report/report-table.png`: Arbeitsfläche für Zacharias’ Bericht. Hintergrund mit separatem Pergament darüber. Freie Holzfläche x=24–82%, y=25–87%; Randrequisiten aussparen.
- `assets/puzzles/report/report-scroll-large.png`: Vier gegliederte Berichtsabschnitte. Hochformatiges Lesedokument, intern scrollbar. Text x=12–88%; Abschnittsflächen y=11–28%, 32–49%, 53–67%, 72–88%. Keine Schrift über Trennlinien legen.
- `assets/puzzles/report/evidence-marker.png`: Acht Belegmarkierungen. Einzelsprites aus 4×2-Bogen. Wachs rot, Zweigsiegel, Wachs ocker, Bronzedisc; Stoff grün, Stoff rot, Pergamentfalz, Etikett. Neben Text statt über Text setzen.
- `assets/puzzles/report/argument-tiles.png`: Sechs Satzbausteinträger. Individuell zuschneiden; breite Varianten unten. Helle Innenflächen mit etwa 12% horizontalem und 20% vertikalem Abstand zum sichtbaren Trägerrand; Layout passt sich Textlänge an.

## Block 3

- `assets/ui/notebook-open.png`: Zweiseitiges Reisebuch. Gesamtes Buch, zwei HTML-Textspalten. Links x=7–45%, rechts x=55–92%, jeweils y=20–77%; Bindung in Mitte freihalten. Außenrand schmal, contain verwenden.
- `assets/ui/hint-tablet.png`: Römische Hinweistafel. Einzelobjekt mit HTML-Hinweis. Text x=16–85%, y=23–73%; Griffel und Holzrand freihalten.
- `assets/scenes/finale-road-galilee.webp`: Aufbruch nach Galiläa. Abschluss-Hintergrund als echtes WebP. Weg etwa x=28–76%, y=57–100%; oberen Himmel für kurze Overlaytitel nutzen; keine Personen/Jesusdarstellung.
- `assets/ui/finale-travel-permit.png`: Reisegenehmigung mit fünf Siegelflächen. Abschlussdokument mit Titel, Text und fünf Siegeloverlays. Text x=12–88%, y=14–61%; fünf Siegelzentren x≈16,33,50,67,83%, y≈78%, Durchmesser≈13% Bildbreite.

## Block 4

- `assets/bonus/checkpoint-bg.png`: Bühne für freiwilliges Kontrollpostenspiel. Hintergrund mit separat platzierten Reisenden. Figuren in freier Mitte x=28–75%; Fußbaseline y=82–90%. Tisch links x=0–23%, y=37–58%; Tor rechts x=73–94%, y=19–50%.
- `assets/bonus/travellers-sheet.png`: Fünf Reisenden-Einträge einschließlich Familie. Individuelle Ausschnitte, gemeinsame Bodenlinie. Händler, Bauernfamilie, Pilger, Warenträger, römischer Bote. Kein gleichmäßiges Raster! Familie breiter. Native Maßstäbe bewahren; Füße auf gemeinsame Baseline setzen.
- `assets/bonus/goods-sheet.png`: Sechs kontrollierbare Waren. Individuelle Ausschnitte aus 3×2-Anordnung. Amphore, Getreidesack, Stoffballen; Münzbeutel, Wachstafel, Korb. Keine zu engen Standardraster: Amphore reicht unter y=512. Ausschnitte siehe ASSET-SPRITES.json.
- `assets/bonus/bonus-ui.png`: Acht Kontroll- und Entscheidungselemente. Individuelle Ausschnitte mit HTML-Beschriftung. Oben Siegel, Amtsstempel, Passierzeichen, Prüfband; unten Pergamentschild, Holzplakette, Wachstafel, Anhänger. Raster ungleich; konkrete Ausschnitte verwenden.
