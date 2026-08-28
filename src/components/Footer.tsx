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
          <p className="footer-head">Make videos like ours</p>
          <p className="footer-muted">
            We turn scripts into whiteboard videos with{" "}
            <a href={SITE.doodleUrl}>DoodleAI</a> — our own AI doodle-video
            studio. See what it can do for your business.
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
          <p className="footer-muted small">
            Every book includes free updates for 12 months — anything added to
            it, emailed to you at no extra cost.*
          </p>
        </div>
      </div>
      <div className="wrap footer-legal">
        <p className="footer-fineprint">
          * Free updates cover material added to a book you bought — audio,
          video, workbooks, revised editions — for twelve months from your
          purchase date. {SITE.updatesFootnote} Licensed video courses are not
          included.
        </p>
        © {new Date().getFullYear()} {SITE.parentBrand}. All rights reserved.{" "}
        · <a href="/brand-kit.html">Brand Kit</a>
      </div>
    </footer>
  );
}
