// Roland50 Studio clone — audio unlock ONLY.
// Does NOT touch any DOM elements. Does NOT click any buttons except
// intercepting the original Enter/Let's-do-it to unlock Web Audio.
// (Previous versions that removed DOM caused "Application error".)

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

  function check() {
    interceptButtons();
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
