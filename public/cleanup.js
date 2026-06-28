// Roland50 Studio clone — cleanup script
// Removes all "pollution": intro overlay, "Let's do it" popup, login walls,
// paywall, cookie banners, and any modal that blocks the main app.
(function () {
  "use strict";
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
  function removeByText(texts) {
    const all = document.querySelectorAll("div, section, aside, dialog, [role='dialog'], [class*='modal'], [class*='popup'], [class*='overlay'], [class*='intro']");
    for (const el of all) {
      const t = el.textContent?.trim()?.toLowerCase() ?? "";
      for (const text of texts) {
        if (t.includes(text.toLowerCase()) && t.length < 500) {
          el.remove();
          break;
        }
      }
    }
  }
  function cleanup() {
    clickByText("Enter");
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
      ".intro", "[class*='intro']", "[class*='welcome']", "[class*='onboard']",
      "[class*='popup']", "[class*='modal']",
      "[class*='overlay']:not([class*='canvas'])",
      "[class*='paywall']", "[class*='login']", "[class*='signup']",
      "[class*='sign-in']", "[class*='auth']", "[class*='cookie']",
      "[class*='banner']", "[class*='gdpr']", "[class*='consent']",
      "dialog", "[role='dialog']", "[aria-modal='true']",
    ]);
    removeByText([
      "Sign in", "Sign up", "Log in", "Login", "Create account",
      "Register", "Subscribe", "Upgrade to Pro", "Unlock Pro",
      "Premium", "Paywall", "Cookie", "We use cookies", "Your privacy",
    ]);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cleanup);
  } else {
    cleanup();
  }
  let runs = 0;
  const interval = setInterval(() => {
    cleanup();
    runs++;
    if (runs > 20) clearInterval(interval);
  }, 500);
  const observer = new MutationObserver(() => {
    clickByText("Enter");
    clickByText("Let's do it");
    clickByText("Got it");
    clickByText("Continue");
    clickByText("Skip");
    clickByText("Close");
    removeBySelector([
      "[class*='popup']", "[class*='modal']",
      "[role='dialog']", "[aria-modal='true']", "[class*='paywall']",
    ]);
  });
  function startObserver() {
    if (!document.body) {
      setTimeout(startObserver, 10);
      return;
    }
    observer.observe(document.body, { childList: true, subtree: true });
  }
  startObserver();
})();
