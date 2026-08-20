import { useState } from "react";
import { SITE } from "../products";

// Email signup wired to the MailerLite form endpoint. Submits in the
// background and shows an inline thank-you — no page reload, no ugly
// JSON response tab. Falls back to mailto if no endpoint is configured.
export default function EmailCapture() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      await fetch(SITE.emailFormAction, {
        method: "POST",
        body: new FormData(form),
        mode: "no-cors",
      });
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="email-capture">
      <div className="wrap">
        <h2>Get the free Video Marketing Quickstart</h2>
        <p>
          Join the list and get our free guide to making marketing videos with
          AI — plus early access and subscriber-only Stack deals. No spam,
          unsubscribe anytime.
        </p>
        {!SITE.emailFormAction ? (
          <a
            className="buy-btn"
            href={`mailto:${SITE.contactEmail}?subject=Send%20me%20the%20free%20guide`}
          >
            Email us for the free guide
          </a>
        ) : status === "done" ? (
          <p className="email-done">
            🎉 You're in! Check your inbox for the guide (peek in spam if it
            plays hide and seek).
          </p>
        ) : (
          <form className="email-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="fields[email]"
              placeholder="you@example.com"
              required
              disabled={status === "sending"}
            />
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send me the guide"}
            </button>
            {status === "error" && (
              <p className="email-error">
                Hmm, that didn't go through — try once more, or email{" "}
                <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
