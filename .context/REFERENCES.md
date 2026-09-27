# Reference Analysis

Seven owner-supplied references (1456×840, AI-generated concept art). Files in `references/`.
They define the target look; rebuild them as real, accessible UI.

## Shared chrome (all seven)

- **Top navigation:** floating, centered, pill-shaped cream/white bar (~52px tall, ~55% viewport width). Logo mark far left. Items in uppercase, heavy, small (~13px), navy. **Active item** varies between references — blue underline (Airport, About, Milestones), filled blue pill (Skills, Projects), light-blue pill + underline (Journey). → Standardise on: light-blue pill + 3px blue underline, with filled-blue reserved for hover/pressed. Last item shows a mountain icon + **"PEAK" → must render "Summit"**.
- **Expedition sidebar:** left rail, ~160–200px. Vertical dashed route line; 7 circular checkpoint badges (~36px) with white icons on dark grey; label to the right, uppercase heavy ~13px. **Active:** larger (~44px) solid blue circle, glow, blue label. Line is solid blue for completed segments above the active point in some refs (Airport, About). Icons: plane, mountain, wrench, briefcase/pack, map, flag, mountain.
- **Heading lockup:** optional blue uppercase tracked eyebrow with mountain icon → giant heavy rounded navy title in caps → three short blue "spark" strokes off the top-right of the last word → handwritten subtitle (navy, slight tilt) with a blue brush swoosh underline.
- **Mascot:** a backpacker character (orange/brown, blue pack with the mountain logo) in every scene, bottom-left, facing the scenery. It is part of the background artwork, not UI.
- **Mountain logo:** twin peaks with a zig-zag snowline, blue. Appears on flags, crates, badges.
- **Scenery:** full-bleed painterly 3D environment; content sits on the left 40–60% over the sky; right side carries the thematic "board" (departure board, notice board, gear board, cards, route, badges).

## Per page

| # | Page | Palette of scene | Key foreground elements |
|---|---|---|---|
| 1 | Airport | bright sky blue, white terminal, tropical green | Passport photo card (tape strip, "YOUR PHOTO", postmark stamp, airmail wavy lines, slight tilt); WELCOME ABOARD eyebrow with plane; name in 2 lines; roles line with bullets; handwritten tagline + swoosh; primary blue "START THE CLIMB" (mountain icon, arrow, 3D bottom edge) + cream "VIEW PROJECTS" (folder icon); navy **departure board** (Destination / Status / Next stop; READY green, UP NEXT blue, PLANNED grey; "Same ideas. Higher places."); GATE 01 blue sign; "Next stop: SHORE" sandwich board; "Scroll down to continue the journey" floor marking |
| 2 | About | golden hour beach, turquoise sea, ruins | Title + subtitle; passport photo card; paper intro card ("Hello! I'm" handwritten, name heavy, two paragraphs split by a rule); wood-framed notice board with 5 pinned paper cards (Education, Interests, Development Focus, Location, Current Goals — checkbox list); "Next stop: Bigger things" sign. Ref text "BST" is a typo → "BS". Ref ends "closer to the peak" → use "summit". |
| 3 | Skills | lush jungle, waterfalls, cyan-green | EXPEDITION GEAR eyebrow; wooden plank board holding 6 paper category panels in 2 columns (icon + heavy title; skill tiles with logo + name, small corner triangle marks, pushpin dots); "Higher skills, brighter ideas" wood sign; navy gear crates with logo. |
| 4 | Projects | warm canyon, blue sky | PROJECTS eyebrow with flag; EXPEDITIONS title; 2×2 horizontal paper cards: blue flag tab with plane + number tag, screenshot thumbnail left, title, status pill (Completed green / In progress blue / Planned grey / Idea blue-outline + bulb), description, TECH STACK icons, ROLE, GITHUB (outlined) + LIVE DEMO (blue) buttons. Wood arrow signs "Bigger things / New skills / Higher ideas"; "Next expedition" sign. Project names are placeholders — never present as Kyle's work. |
| 5 | Journey | dusk, purple-blue clouds, lava | MY JOURNEY eyebrow; title; handwritten 3-line note; glowing orange dotted trail zig-zagging up-right; 6 paper cards on posts, each with a blue year tab, blue line icon, heavy title, subtitle, small description; blue pennant flags at nodes; summit flag with sparks; "A higher me awaits" wood sign. |
| 6 | Milestones | sunset gold, cream castle | REACHING NEW HEIGHTS eyebrow; title; two lines of uppercase categories separated by bullets; handwritten note; 3×2 grid of square paper cards with hexagonal/round enamel badges (navy, red, gold, blue, green, purple), title, 2-line description, blue circular arrow button; wood signpost "Final ascent / New heights / Bigger things / Last push"; stone "The journey matters". |
| 7 | Summit | peach/orange sunset, sea of clouds | Very minimal: logo mark, THE SUMMIT, handwritten "Every project was another step upward.", mascot beside a planted navy flag. Actions (Contact, Projects, GitHub, LinkedIn) must be added without crowding — the brief wants it clean and emotional. |

## Implications for implementation

1. **Background plates needed.** Each scene needs a clean, text-free, UI-free artwork plate (desktop ~2560w and a portrait/mobile crop ~1080w). The references cannot be reused because UI and text are baked in. See *Open questions* in `CURRENT_STATE.md`.
2. Readability: left-side cream scrim (`scrim-left`) behind headings on busy scenes; all body copy on paper surfaces.
3. Mobile: scenery becomes a shorter hero band; boards stack as cards below; mascot may be cropped or dropped.
