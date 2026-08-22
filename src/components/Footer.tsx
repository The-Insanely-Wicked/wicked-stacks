import { SITE } from "../products";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-brand">Wicked Stacks</p>
          <p className="footer-muted">
            The digital bookshop from{" "}
            <a href={SITE.parentUrl}>{SITE.parentBrand}</a>. Real books, written
            by a real person, priced like they should be.
          </p>
        </div>
        <div>
          <p className="footer-head">Video courses</p>
          <p className="footer-muted">
            Seventeen professionally produced courses on project management,
            communication, focus, and career growth. Stream or download —
            yours forever, no subscription.
          </p>
        </div>
        <div>
          <p className="footer-head">Questions?</p>
          <p className="footer-muted">
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </p>
          <p className="footer-muted small">
            Instant delivery after checkout. 30-day money-back guarantee on
            everything.
          </p>
        </div>
      </div>
      <div className="wrap footer-legal">
        © {new Date().getFullYear()} {SITE.parentBrand}. All rights reserved.{" "}
        · <a href="/brand-kit.html">Brand Kit</a>
      </div>
    </footer>
  );
}
