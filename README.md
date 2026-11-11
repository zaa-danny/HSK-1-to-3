# HSK 1–3 Flashcards

Open `index.html` in any browser (double-click). It works offline; no server or install needed.
Progress, level, font choice and learned characters are saved in the browser (localStorage).

## Structure
```
index.html            page layout (tabs, controls) and the list of scripts
css/
  fonts.css           Song / Sans / Kai font families used for Chinese text
  styles.css          layout, colours (light and dark), components
js/
  data/
    hsk1.js hsk2.js hsk3.js   the word lists (one row per word)
    books.js                  textbook names and lesson titles
    char-glosses.js           meanings of reused characters that are not words on their own
  cards.js            builds card objects and the decks (HSK 1, 2, 3, All)
  state.js            saved progress and small helpers
  audio.js            text-to-speech
  filters.js          category and lesson filters
  study.js            flashcard study mode with spaced repetition
  quiz.js             quiz modes and the feedback table
  wordlist.js         searchable word list
  characters.js       Characters tab (reused characters and the words they appear in)
  font.js             font switcher
  main.js             wiring, tab switching, start-up
```
Scripts are loaded in this order by `index.html` (data first, `main.js` last).

## Adding or fixing a word
Edit the row in `js/data/hsk1.js`, `hsk2.js` or `hsk3.js`. The row format is described at the top of each file.
