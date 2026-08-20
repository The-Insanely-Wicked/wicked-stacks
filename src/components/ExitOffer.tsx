import { useEffect, useState } from "react";

// Exit-intent offer: when the cursor leaves the top of the viewport
// (desktop back-button/close motion), show a one-time discount modal.
// Shows once per browser session. The code itself must exist as a
// promotion code in Stripe (create it there; enable "allow promotion
// codes" on every Payment Link so buyers can enter it at checkout).
const CODE = "STACK10";
const OFFER_TEXT = "10% off anything in the store";
const SEEN_KEY = "ws-exit-offer-seen";

export default function ExitOffer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        sessionStorage.setItem(SEEN_KEY, "1");
        setOpen(true);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  if (!open) return null;

  return (
    <div
      className="exit-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="exit-modal">
        <button
          className="exit-close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <h2 id="exit-title">Hold up — take {OFFER_TEXT}</h2>
        <p>
          Leaving empty-handed? Use this code at checkout and keep a little
          extra in your pocket:
        </p>
        <p className="exit-code">{CODE}</p>
        <button className="buy-btn" onClick={() => setOpen(false)}>
          Keep browsing with my code
        </button>
        <p className="exit-fine">One use per customer. Applies at checkout.</p>
      </div>
    </div>
  );
}
