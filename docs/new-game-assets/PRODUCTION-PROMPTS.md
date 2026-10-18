# Produktionsvorgaben

Werkzeug: integriertes `image_gen`, kein CLI-/API-Fallback. Ein Bild je Auftrag. Die folgenden normalisierten Vorgaben dokumentieren den verwendeten Prompt-Satz; tatsächliche native Maße siehe ASSET-MAP.md.

## Gemeinsame Vorgaben

Römisches Palästina im 1. Jahrhundert, warme Sand-, Ocker-, Terrakotta-, Braun- und Olivtöne. Keine Texte, Labels, modernen Gegenstände, christlichen Zeichen oder Fantasy-Verzierungen. Top-Down-Grafiken: klare Pixel-Art und die erhöhte RPG-Perspektive des vorhandenen Kontrollpostenspiels. Transparente Blätter: echter Alphakanal, vollständige isolierte Objekte, freie Zwischenräume. HTML-Flächen bleiben leer. Referenzen wurden vor der Verwendung geöffnet und visuell geprüft.

## Block 1 – Startpanel

- **checkpoint-run-start-panel-v2.png:** Referenz `assets/interlude/checkpoint-run-start-panel.png` ausschließlich für den Stil. 1536 × 1024, warme Pixel-Art aus Holz und hellem Pergament. Schmales äußeres Holzgerüst, große freie obere Pergamentfläche mit getrennten logischen Titel- und Beschreibungsbereichen; darunter drei getrennte leere Itemfelder, unten breiter freier Pergamentstreifen für einen HTML-Button. Viel Abstand; keinerlei Dekoration innerhalb der Textflächen.

## Block 2 – Reisewelt

- **report-route-bg.webp:** Referenz `assets/interlude/checkpoint-run-bg.webp` für Pixeltechnik und Kamera. Ziel etwa 1664 × 960. Zusammenhängende Außenwelt mit breitem Rundweg und Querwegen. Südwestlicher Eingang, nordwestliche Kontrolle mit Tisch und durchlässiger Sperre, nordöstlicher Abgabenmarkt mit Säcken und Amphoren, südöstlicher römischer Wachposten mit Soldaten und unbeschriftetem roten Schild, Gesprächsgruppe am Olivenbaum im südwestlichen Mittelteil. Kleine Personen, freie Vorflächen, keine Sackgassen, keine HUD-Elemente oder Bildtexte.
- **report-foreground.png:** Transparentes 1536 × 1024-Blatt, vier Spalten und zwei Reihen. Lesereihenfolge: Marktstand mit rotem Stoff, Abgabensäcke, Amphoren, Kontrolltisch mit leerer Tafel, niedrige Sandsteinmauer, unbeschrifteter Wegweiser, Kisten, Stoffbahnen auf Gestell. Gleiche erhöhte Kamera, warme Pixel-Art, keine Personen oder Bodenplatten.
- **report-markers.png:** Vier transparente subtile Pixel-Marker in 2 × 2 Anordnung: Kontroll-Wachstafel, Abgabensack, roter römischer Schild, zwei einander zugewandte Profile für Gespräch/Hoffnung. Klare Silhouetten bei kleiner Anzeige, kein Leuchten und keine abstrakten Fragezeichen.

## Block 3 – Figuren und Belege

- **report-player.png:** Referenz `assets/interlude/checkpoint-run-player.png` für Figur, Kleidung und Pixelstil. 1536 × 1024, vier Spalten, zwei Reihen, acht vollständige Figuren. Oben: Norden Stand, Norden Schritt, Süden Stand, Süden Schritt. Unten: Westen Stand, Westen Schritt, Osten Stand, Osten Schritt. Jugendlicher Reisender mit braunen Haaren, cremefarbener Tunika, olivfarbenem Umhang, Ledertasche und Sandalen. Einheitlicher Maßstab und Identität, keine zusätzlichen Zustände, echter Alphakanal.
- **report-npcs.png:** Dieselbe Figurenreferenz und Kamera. Transparentes 2 × 2-Blatt: römischer Soldat mit Helm, Kettenhemd, roter Tunika und Schild; Händler/Abgabeneinnehmer mit leerer Tafel; Bauer mit Getreide; Reisende mit olivfarbenem Mantel und Gesprächsgeste. Historisch plausible Kleidung, keine Karikaturen, vollständige Ausrüstung.
- **report-evidence.png:** Vier große transparente HUD-Objekte in 2 × 2: leere rote Wachstafel mit Griffel, Getreidesack mit Ähren, römischer roter Schild mit Schildbuckel, verbundene Hände mit Olivenzweig für gemeinsame Hoffnung. Deutlich unterschiedliche Silhouetten, warme Pixel-Art, keine Schrift.
- **report-result-panel.png:** 1536 × 1024, flache Pixel-Art-Auswertungstafel. Oben Titelstreifen, darunter vier leere Belegfelder, direkt darunter vier schmale leere Zuordnungsfelder; unten großer freier Pergamentbereich für Erklärung und Satzbausteine. Schmaler Holzrahmen, keine Objekte oder Beschriftungen.

## Block 4 – Argumentation

- **report-category-board.png:** 1536 × 1024, vier gleich große leere Pergamentfelder in 2 × 2. Holzrahmen mit klaren Zwischenräumen. In jedem Feld eine dezente waagerechte Teilung für einen HTML-Kategorienamen und einen großen darunterliegenden Ablagebereich. Keine Symbole oder Bildtexte.
- **report-argument-tiles.png:** Transparentes 1536 × 1024-Blatt mit sechs horizontalen leeren Pergamentstreifen in zwei Spalten und drei Reihen. Oben kurz, mittig mittel, unten lang. Helle unmarkierte Zentren, dezente seitliche Rollen, dünne gestufte Konturen. Keine Texte oder Hintergrundflächen.
- **report-evidence-frame.png:** Ein quadratischer Pixel-Art-Rahmen aus Holz mit zurückhaltenden Bronzeecken. Sowohl Außenbereich als auch Mitte echt transparent. Vollständiger symmetrischer Rahmen, kein Pergament im Inneren, keine Symbole oder Edelsteine.

## Block 5 – Der Weg des Boten

- **bote-board.png:** Quadratisches historisches Holz-/Wachstafelbrett, genau vier große rotbraune leere Felder in 2 × 2. Breite Holzstege und schlichter Außenrahmen mit kleinen Bronzenieten. Frontale Ansicht, für iPad-Touch, ohne Titel oder Symbole. Handgemalte Materialoptik innerhalb der für das Boten-Modul erlaubten UI-Variante.
- **bote-symbols.png:** Vier transparente historische Gegenstände in 2 × 2: gebundene Schriftrolle, zweihenklige Terrakotta-Amphore, Ledersandale in Aufsicht, bronzener Siegelstempel mit leerem Tonabdruck. Vergleichbare visuelle Größe, klare Silhouetten, keine Buchstaben oder christlichen Zeichen. Warmes handgemaltes Material passend zum Brett.
- **bote-active.png:** Ein einzelner quadratischer wiederverwendbarer Aktivrahmen mit transparenter Mitte und transparentem Außenbereich. Gealtertes Messing, warme bernsteinfarbene Kantenreflexe, abgerundete Ecken. Sichtbar heller als das dunkle Holz, keine Neonoptik, Funken, Sterne, Symbole oder gefüllte Mitte.

## Block 6 und 7

Keine neuen Bildaufträge. Begründung und konkrete Wiederverwendung vorhandener UI siehe ASSET-MAP.md.
