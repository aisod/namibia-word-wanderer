# NAMQULA experience review

Current follow-up: [2 November content and learning release](RELEASE-2026-11-02.md). Word browsing, topic practice, saved per-word progress and due reviews now address the earlier learning-depth gaps. Native-speaker recordings/sign-off, a live corpus release API and cloud progress sync remain explicitly unimplemented.

## Corrected issues

- Word Match stacked the entire English list above the translation list below the phone viewport. Both sides now share one two-column board at every width, with native buttons, selection states, matched markers and inline feedback. Rounds stay at four to six pairs rather than expanding to twelve rows.
- A persistent installation banner consumed the first part of every game. Installation and offline preparation now live on the home page, after the learning library. Gameplay is distraction-free and reserves room for the board.
- Language profiles described import sources rather than languages. Six researched profiles now include linguistic context, substantive history, current cultural life and geographic detail. Chokwe includes Namibia. Blank speaker counters, placeholder photographs and empty facts cards are removed.
- The home library exposed direct play but hid the other languages' profiles. Every course now has separate play and history/culture links.
- Game selection was a tall marketing-style background section. It is now a consistent, compact four-choice library with language context nearby.
- Browser Back did not follow game selection because active mode existed only in component state. Game mode now lives in the URL; Back returns to the game library. Phone headers and active navigation reflect that hierarchy.
- Quiz options lacked a clear persistent button surface; answers now have visible boundaries. The results' correct-answer count now measures correct answers rather than the question index.
- Flashcard arrow controls were unnamed and crowded narrow screens. They now have accessible names and wrap at narrow widths.
- Word Search forced horizontal scrolling. The board now fits its container at small widths and retains Unicode letters and click consonants.
- The Community form simulated sending feedback without saving it. It is replaced by an honest, central AISOD Corpus contribution journey. No fake success messages or duplicated vocabulary submission channel.

## Coverage and boundaries

Review covers the public home, language profiles, game selection, four game modes, community journey, offline preparation, navigation, error recovery and missing-language handling. Admin login and existing authorization guards were read; no accounts were created or production data changed to test administration. The corpus website could not be independently reached from this environment, so links use its confirmed root domain rather than invented contribution endpoints. Bundled vocabulary remains the offline delivery mechanism; no new live corpus API or instant synchronization is claimed.

Record phone-width screenshots, run all game and offline tests, and require GitHub's type check and production build before publication. Real-device testing can further refine keyboard, remote and screen-reader behaviour.
