import { SITE } from "../products";

// Email signup. Point SITE.emailFormAction at a MailerLite (or any ESP)
// embedded-form action URL to collect subscribers; until then it falls back
// to a mailto link so early visitors can still reach out.
export default function EmailCapture() {
  return (
    <section className="email-capture">
      <div className="wrap">
        <h2>Get the free Video Marketing Quickstart</h2>
        <p>
          Join the list and get our free guide to making marketing videos with
          AI — plus early access and subscriber-only Stack deals. No spam,
          unsubscribe anytime.
        </p>
        {SITE.emailFormAction ? (
          <form
            className="email-form"
            action={SITE.emailFormAction}
            method="post"
            target="_blank"
          >
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="fields[email]"
              placeholder="you@example.com"
              required
            />
            <button type="submit">Send me the guide</button>
          </form>
        ) : (
          <a
            className="buy-btn"
            href={`mailto:${SITE.contactEmail}?subject=Send%20me%20the%20free%20guide`}
          >
            Email us for the free guide
          </a>
        )}
      </div>
    </section>
  );
}
