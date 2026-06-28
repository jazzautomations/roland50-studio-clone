// Roland50 Studio clone — audio unlock + tutorial dismiss
// 1. Intercepts "Enter" click to unlock Web Audio (needs real gesture)
// 2. Auto-dismisses the react-joyride tutorial overlay (without breaking app)
// Does NOT remove app DOM elements (that caused "Application error").

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

  // Dismiss the react-joyride tutorial by clicking Close/Skip/Done buttons
  // and removing ONLY the joyride overlay (not app DOM).
  function dismissTutorial() {
    // Click Close/Skip/Done/Finish buttons that belong to joyride
    const btns = document.querySelectorAll("button");
    for (const btn of btns) {
      const t = btn.textContent.trim().toLowerCase();
      if (["close", "skip", "done", "finish", "got it"].includes(t)) {
        // Only click if it's inside a joyride or tutorial container
        const parent = btn.closest("[class*='joyride'], [class*='tutorial'], [class*='coachmark'], .react-joyride");
        if (parent) {
          btn.click();
        }
      }
    }
    // Remove joyride overlays specifically (these are decorative, not app DOM)
    document.querySelectorAll(
      ".react-joyride__overlay, .react-joyride__tooltip, [class*='joyride__'], [class*='coachmark'], #react-joyride-portal"
    ).forEach((el) => el.remove());
  }

  // Intercept Enter button (unlock audio on real click)
  function interceptEnter() {
    const btns = document.querySelectorAll("button");
    for (const btn of btns) {
      const t = btn.textContent.trim().toLowerCase();
      if (t === "enter" && !btn.dataset.rgAudio) {
        btn.dataset.rgAudio = "1";
        btn.addEventListener("click", unlockAudio, { capture: true });
      }
      if ((t.includes("let's do it") || t.includes("lets do it") || t === "got it") && !btn.dataset.rgAudio) {
        btn.dataset.rgAudio = "1";
        btn.addEventListener("click", unlockAudio, { capture: true });
      }
    }
  }

  function check() {
    interceptEnter();
    dismissTutorial();
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
    if (runs > 30) clearInterval(interval);
  }, 300);
})();
