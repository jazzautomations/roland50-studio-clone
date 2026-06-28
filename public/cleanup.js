// Roland50 Studio clone — cleanup + audio unlock
// Removes intro/popups/login/paywall AND unlocks Web Audio (which requires
// a real user gesture on Chrome/Safari/iOS).
(function () {
  "use strict";

  // ─── 1) AUDIO UNLOCK ─────────────────────────────────────────────────
  // Web Audio API requires a real user gesture to start. We show a full-screen
  // "Enter" overlay; when the user clicks it, we resume the AudioContext and
  // play a silent oscillator (iOS needs this). After that, the app's own
  // audio works.

  function unlockAudio() {
    try {
      // Find any existing AudioContext the app created, or make a new one
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      // Resume any existing suspended contexts (the app creates one)
      // We can't access the app's ctx directly, but resuming on a new ctx
      // sometimes unlocks the global audio session. The real unlock is the
      // silent oscillator below.
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
      // Keep ctx alive briefly so the unlock sticks
      setTimeout(() => ctx.close().catch(() => {}), 1000);
    } catch (e) {
      // ignore
    }
  }

  // ─── 2) ENTER OVERLAY (replaces the original intro) ──────────────────
  // We REMOVE the original intro (which doesn't unlock audio) and show our
  // own minimal overlay that does unlock audio on click.

  function showEnterOverlay() {
    // Remove original intro first
    document.querySelectorAll(".intro, [class*='intro'], [class*='welcome']").forEach((el) => el.remove());

    const overlay = document.createElement("div");
    overlay.id = "__rg_enter";
    overlay.style.cssText = [
      "position:fixed", "inset:0", "z-index:99999",
      "display:flex", "align-items:center", "justify-content:center",
      "background:#000", "color:#fff",
      "font-family:-apple-system,system-ui,sans-serif",
    ].join(";");

    const btn = document.createElement("button");
    btn.textContent = "▶ ENTRAR";
    btn.style.cssText = [
      "padding:20px 60px", "font-size:24px", "font-weight:700",
      "letter-spacing:0.1em", "background:#ff5a00", "color:#fff",
      "border:none", "border-radius:8px", "cursor:pointer",
      "box-shadow:0 0 40px rgba(255,90,0,0.6)",
    ].join(";");

    btn.addEventListener("click", () => {
      unlockAudio();
      overlay.remove();
      // Auto-dismiss any subsequent popups
      dismissPopups();
    });

    overlay.appendChild(btn);
    document.body.appendChild(overlay);
  }

  // ─── 3) AUTO-DISMISS POPUPS ──────────────────────────────────────────
  function clickByText(text) {
    const els = document.querySelectorAll("button, a, [role='button']");
    for (const el of els) {
      if (el.textContent.trim().toLowerCase().includes(text.toLowerCase())) {
        el.click();
        return true;
      }
    }
    return false;
  }
  function removeBySelector(selectors) {
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    }
  }
  function dismissPopups() {
    clickByText("Let's do it");
    clickByText("Lets do it");
    clickByText("Got it");
    clickByText("OK");
    clickByText("Continue");
    clickByText("Skip");
    clickByText("Close");
    clickByText("Dismiss");
    clickByText("Accept");
    removeBySelector([
      "[class*='welcome']", "[class*='onboard']",
      "[class*='popup']", "[class*='modal']",
      "[class*='paywall']", "[class*='login']", "[class*='signup']",
      "[class*='auth']", "[class*='cookie']", "[class*='banner']",
      "[class*='gdpr']", "[class*='consent']",
      "dialog", "[role='dialog']", "[aria-modal='true']",
    ]);
  }

  // ─── 4) BOOT ─────────────────────────────────────────────────────────
  function boot() {
    if (!document.body) {
      setTimeout(boot, 10);
      return;
    }
    showEnterOverlay();
    // MutationObserver: auto-dismiss any new popups after Enter
    const observer = new MutationObserver(() => {
      dismissPopups();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
