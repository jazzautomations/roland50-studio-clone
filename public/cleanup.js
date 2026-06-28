// Roland50 Studio clone — audio unlock + tutorial auto-skip
// 1. Intercepts Enter/Let's do it clicks to unlock Web Audio (gesture)
// 2. Auto-clicks "Next" buttons inside react-joyride tooltips (tutorial)
//    and the final "X" close button. NEVER clicks app buttons.

(function () {
  "use strict";

  function unlockAudio() {
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      ctx.resume().catch(() => {});
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

  // Intercept Enter / Let's do it / Got it to also unlock audio
  function interceptButtons() {
    const btns = document.querySelectorAll("button");
    for (const btn of btns) {
      if (btn.dataset.rgAudio) continue;
      const t = btn.textContent.trim().toLowerCase();
      if (t === "enter" || t.includes("let's do it") || t.includes("lets do it") || t === "got it") {
        btn.dataset.rgAudio = "1";
        btn.addEventListener("click", unlockAudio, { capture: true });
      }
    }
  }

  // Auto-skip the react-joyride tutorial: click "Next" and "Back" and "Close"
  // ONLY when they're inside a joyride tooltip.
  function skipTutorial() {
    // joyride tooltips live inside [class*="react-joyride"] or [aria-live]
    const joyride = document.querySelector(
      ".react-joyride__tooltip, [class*='react-joyride'], [data-component='joyride'], [aria-live='polite']"
    );
    if (!joyride) return;
    // Find buttons inside the joyride tooltip
    const joyrideBtns = joyride.querySelectorAll("button");
    for (const btn of joyrideBtns) {
      const t = btn.textContent.trim().toLowerCase();
      const ariaLabel = (btn.getAttribute("aria-label") || "").toLowerCase();
      // Click Next to advance, or Close/X/Last to finish
      if (t === "next" || t === "skip" || t === "close" || t === "done" || t === "last" || ariaLabel === "close" || btn.querySelector("svg")) {
        btn.click();
        return;
      }
    }
  }

  function check() {
    interceptButtons();
    skipTutorial();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", check);
  } else {
    check();
  }

  let runs = 0;
  const interval = setInterval(() => {
    check();
    runs++;
    if (runs > 40) clearInterval(interval);
  }, 400);
})();
