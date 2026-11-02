# V30 — Natural vertical wheel scrolling

- Removed global smooth scrolling from the document, so wheel input is handled by the browser.
- Removed implicit smooth scroll CSS from horizontal rails; carousel buttons still explicitly animate with scrollBy({behavior: "smooth"}).
- Kept vertical overscroll chaining enabled over movie, genre, episode, and provider rails.
- No capture-phase wheel event handlers or manual window.scrollBy for vertical input.

Please test with a physical mouse in your browser; the fix has not been visually validated in a live browser.
