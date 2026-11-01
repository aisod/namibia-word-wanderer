# Namqula: findings and next product steps

Inspected upstream commit 3bc2edf and the public Lovable game on 1 November 2026. Static findings are distinguished below from measured results. No controlled before/after browser benchmark or production database trace has been completed.

## Assessment

The four games are a useful vocabulary-practice foundation. The present product is not yet a structured language course: it offers recognition games and self-marked flashcards, but has no observed model for retained mastery, spaced review, listening or sentence production. More games alone would not solve this.

The first experience involves scrolling to languages, opening a long language introduction and selecting a game before practice. Put a direct “Start a five-minute lesson” action near the top. Keep cultural information available alongside the learning path.

## Corrected in this change

- Wrong-variety and unverified fallback vocabulary is replaced with an explicitly labelled Oshindonga starter pack sourced from local records. Oshikwanyama is retained as a distinct course with 111 entries adapted from the openly licensed Hai ti! guide. Otjiherero and Khoekhoegowab receive small attributed starter packs. Chokwe and Rukwangali are listed as in preparation, with games disabled until suitable vocabulary is ready. These are not complete or native-speaker-approved courses.
- Public starter games fetch one static pack, without waiting for Supabase or making a second vocabulary request for category counts. Packs are cached for the browser session. Database-backed administration remains available for other content, but changes to these versioned packs must be reviewed in source.
- Pages and individual games load on demand; admin code is no longer an eager home-page dependency.
- The 500-element word progress indicator becomes one accessible bar. The automatically earned achievement is removed.
- The shared hero, logo and sponsor images are converted to bounded-size WebP assets. Before: 6,181,836 bytes; after: 364,898 bytes (94.1% smaller). Four game-card PNG requests totalling 10,734,478 bytes are replaced by existing vector icons. These are asset-byte reductions, not measured latency or whole-page transfer claims.
- Word Match resolves a selection once rather than rerunning a scoring effect when its own state changes. Its pending reset timer is cancelled on restart/unmount.
- Quiz options are distinct and exclude the correct answer from distractors; duplicate native/English pairs are filtered for game use.
- Word Search preserves clicks and accented letters. Found-word crossings remain selectable, and a selection must follow the word’s cells in a straight contiguous sequence. Small or failed datasets show a recovery action instead of silently falling back or rendering nothing.
- Basic keyboard access is added to language cards, game cards, match choices and card flips.

## Highest-value next improvements

1. **Editorial accuracy:** a speaker-review workflow with variety, part of speech, singular/plural, example sentence, recording, source and approval state. A correction button on each word should submit feedback for review, not silently publish a replacement.
2. **A learning path:** introduce 5–8 related words, practise recognition, then recall them without answer choices. Revisit mistakes before adding new material. Unlock difficulty based on recall, rather than simply increasing the round number and number of questions.
3. **Durable mastery:** save progress per language and word locally, with optional account sync. Use spaced review with due dates; a card marked “Got it” once should not be labelled permanently mastered. Award badges from recorded events.
4. **Authentic listening:** native-speaker audio and simple contextual sentences. Avoid claiming grammar or pronunciation instruction until there are exercises and reviewed material for them.
5. **Low-bandwidth experience:** cache the application shell and chosen packs with an explicit offline/download workflow, pause decorative animation for reduced-motion and hidden tabs, then benchmark on a low-end Android device and constrained network. This change does not claim full offline support.

## Hosting and loading diagnosis

The code shows concrete client-side problems; it does not establish Lovable Cloud as the bottleneck. Capture a resource waterfall, cold/warm route timing, transferred bytes and query timings before changing hosting. Keep public vocabulary on the static CDN; use Supabase for accounts, review submissions and progress sync. Add server-side aggregate counts and bounded/paginated vocabulary endpoints before exposing large database-backed courses.

The observed domain namqula.aisod.tech serves a separate promotional site. Lovable’s project settings identify namibia-word-wanderer.lovable.app as the game address. play.aisod.tech and namqula.online were still shown as setting up DNS/certificates. These settings were read only; no DNS changes were made.

## Deployment and validation limits

The full dependency installation failed because the local C: drive ran out of space. Only temporary dependency files created for this task were removed. TypeScript syntax and the data/game checks in the validation record can run using the smaller validation harness. A full production build, browser check of the changed app, native-speaker approval, database migration and live deployment must not be inferred from those checks.

The change is suitable for a draft review. Do not replace a production database or publish it as a complete language course merely because the vocabulary import succeeds.

## User corrections incorporated

Oshikwanyama remains its own Oshiwambo course and keeps `/language/oshikwanyama`. The former draft alias to Oshindonga was removed. Oshindonga remains separate at `/language/oshindonga`. Six languages are now listed: four playable starter packs and Chokwe/Rukwangali in preparation. No absent course is padded with another language’s words.

The game’s current Lovable address is https://namibia-word-wanderer.lovable.app and the permanent address specified by the user is https://play.aisod.tech. The user’s browser is now displaying play.aisod.tech, so the earlier “setting up” observation is historical; no claim is made here about present DNS readiness. No domain settings were changed by this task.

## Final publication scope

The latest user instruction authorizes committing, pushing and publishing these changes. The current implementation enables all six courses: Oshikwanyama 111, Oshindonga 96, Otjiherero 12, Khoekhoegowab 44, Chokwe 24 and Rukwangali 24 starter entries. This supersedes earlier in-preparation notes. All retain source/rights metadata; native-speaker editorial approval remains a separate task.

The home screen now presents the language library directly, with a continue-playing action that remembers only the last selected language. Phone layouts have safe-area-aware bottom navigation; desktop layouts have a side menu. TV mode is explicitly selectable, increases text/control size and supports directional navigation plus Enter/OK. Keyboard controls retain visible focus. Reduced-motion preferences are respected. The word-search board scrolls within its own region instead of forcing the whole phone page to overflow.

A web-app manifest and home-screen icon request standalone presentation when added to a home screen. No offline capability is claimed. Saved mastery, spaced repetition and audio remain future work.
