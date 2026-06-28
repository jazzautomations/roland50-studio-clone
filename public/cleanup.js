// Roland50 Studio clone — audio unlock ONLY
// Does NOT remove any DOM elements (that broke the app).
// Just intercepts the original "Enter" button click to unlock Web Audio.

(function () {
  "use strict";

  function unlockAudio() {
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      ctx.resume().catch(() => {});
      // Silent oscillator — iOS requires an actual sound to unlock
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
      setTimeout(() => ctx.close().catch(() => {}), 1000);
    } catch (e) {}
  }

  // Wait for the original "Enter" button to appear, then intercept its click
  // to also unlock audio. The original click handler still runs (dismisses
  // the intro), but our unlockAudio() runs first (real user gesture).
  function interceptEnter() {
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      const text = btn.textContent.trim().toLowerCase();
      if (text === "enter") {
        if (btn.dataset.rgIntercepted) return;
        btn.dataset.rgIntercepted = "1";
        btn.addEventListener("click", unlockAudio, { capture: true });
        return;
      }
    }
  }

  // Also intercept "Let's do it" popup button (welcome popup after Enter)
  function interceptWelcome() {
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      const text = btn.textContent.trim().toLowerCase();
      if ((text.includes("let's do it") || text.includes("lets do it") || text.includes("got it")) && !btn.dataset.rgIntercepted) {
        btn.dataset.rgIntercepted = "1";
        btn.addEventListener("click", unlockAudio, { capture: true });
      }
    }
  }

  // Run on DOMContentLoaded + periodically until buttons are found
  function check() {
    interceptEnter();
    interceptWelcome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", check);
  } else {
    check();
  }

  // Check every 200ms for 5 seconds (catches lazy-rendered buttons)
  let runs = 0;
  const interval = setInterval(() => {
    check();
    runs++;
    if (runs > 25) clearInterval(interval);
  }, 200);
})();
