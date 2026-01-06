# Lee-Tee_Book1_Episode1
interactive reading 

## Translation system

Episode 1 now supports English (`en`), Spanish (`es`), French (`fr`), and Haitian Creole (`ht`) using JSON dictionaries in `locales/` plus story sentence data in `locales/story.<lang>.json`.

- Add UI strings by creating a key in `locales/en.json` (and other language files) and applying it via `data-i18n="key.path"` in the HTML or `translator.t('key.path')` in JS.
- For runtime or modal text, prefer grouping related strings (for example, `messages.*`, `header.*`, `global_badges.*`) so the `translator.t` calls in JS can fall back to English if a key is missing.
- Story text renders from sentence data on elements with `data-story-section="<id>"`. Each section uses an array of `{ id, text }` sentences. For bilingual rendering, roughly every other sentence is replaced with the target language while the rest stay in English. Adjust the mix rule in `translations/translation-engine.js` (`mixConfig`) if you need a different ratio or strategy.
- Language choice persists in `localStorage` (`preferred-language`) and is applied on load. Missing translations fall back to English safely.
