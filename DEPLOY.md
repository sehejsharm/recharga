# Deploying to Hostinger

The site is a **static export**. `npm run build` writes a folder called `out/`
that contains the entire website as plain files. Upload the *contents* of `out/`
into `public_html` and the site is live — there is nothing to install, no Node
process to keep running, and no build step on the server.

> "Static" describes the hosting, not the site. All the JavaScript still runs in
> the visitor's browser: the hero flux canvas, the cursor-reactive dot fields,
> the morphing flux diagram, the pinned scroll scene, smooth scrolling and the
> page transitions are all unaffected. Only two *server* features changed —
> the contact form now posts to PHP, and images are compressed at build time
> instead of on demand.

---

## 1. Build

```bash
npm ci
npm run build      # optimises portraits, then exports to out/
```

Verify locally before uploading:

```bash
npm run preview    # serves out/ at http://localhost:4500
```

## 2. Upload

Upload **the contents of `out/`** (not the folder itself) into `public_html`.

Two files are easy to lose and both matter:

| File | Why it matters |
| --- | --- |
| `.htaccess` | Clean URLs, HTTPS redirect, caching, security headers. Hidden file — enable "show hidden files" in File Manager, or it will be skipped. |
| `api/contact.php` | The contact form. Without it the form cannot send. |

`public_html` should end up looking like:

```
public_html/
  .htaccess
  index.html
  about.html  technology.html  team.html  contact.html  404.html
  team/sehej-sharma.html  team/ali-electricwala.html
  api/contact.php
  _next/…            (hashed JS and CSS)
  team/*.webp        (portraits)
  sitemap.xml  robots.txt  manifest.webmanifest  icon.svg
```

## 3. Domain and SSL

- Point `rechargachargine.com` at the hosting. If the domain is registered with
  Hostinger this is automatic; otherwise set the registrar's nameservers to
  Hostinger's (`ns1.dns-parking.com`, `ns2.dns-parking.com`), or point an
  `A` record at the server IP shown in hPanel.
- Add both `rechargachargine.com` and `www.rechargachargine.com`.
- Issue the free SSL certificate in hPanel → Security → SSL, then turn on
  "Force HTTPS".
- DNS changes can take up to 24 hours to propagate, though it is usually far
  quicker. An SSL certificate cannot be issued until DNS resolves to the host —
  if issuing fails, that is almost always the reason. Wait and retry.

The `.htaccess` redirects `www` → apex and `http` → `https` in a single hop. To
serve `www` as the canonical host instead, swap that rule and set
`NEXT_PUBLIC_SITE_URL` to match.

## 4. Email — this must be done or the form cannot deliver

Every enquiry is delivered to **admin@rechargachargine.com**.

In hPanel → Emails → create these two mailboxes on the domain:

| Address | Purpose |
| --- | --- |
| `admin@rechargachargine.com` | Receives every enquiry. **Required.** |
| `website@rechargachargine.com` | The envelope sender. **Required** — mail servers reject or spam-file mail claiming to be from a domain with no such mailbox. An alias pointing at `admin@` is fine. |

Both addresses are set at the top of `public_html/api/contact.php`
(`MAIL_TO` and `MAIL_FROM`) and in `lib/site.ts`. Change them in both places if
they ever move.

While you are in DNS, confirm an **SPF** record exists for the domain —
Hostinger adds one automatically, but if it is missing, outgoing mail will land
in spam:

```
v=spf1 include:_spf.mail.hostinger.com ~all
```

## 5. Verify after going live

```bash
curl -sI https://rechargachargine.com | head -1          # 200
curl -sI http://rechargachargine.com | head -2           # 301 -> https
curl -sI https://www.rechargachargine.com | head -2      # 301 -> apex
curl -sI https://rechargachargine.com/about | head -1    # 200, clean URL
curl -s  https://rechargachargine.com/sitemap.xml | head -3
curl -sI https://rechargachargine.com/nothing-here | head -1   # 404
```

Then in a browser:

1. Every nav link loads and the URL has no `.html`.
2. The hero animates, and the dot grids react to the cursor.
3. The flux diagram on `/technology` switches when you click Radial/Axial/Hybrid.
4. **Send a real message through `/contact`, and confirm it arrives at
   admin@rechargachargine.com.** Check spam on the first send.

## 6. Search Console

Add the property in Google Search Console, verify (the DNS TXT method is
easiest on Hostinger), and submit `https://rechargachargine.com/sitemap.xml`.
Nothing ranks before it is indexed — this is the highest-value remaining step.

---

## Troubleshooting

**Every page except the homepage 404s.**
`.htaccess` did not upload. It is a hidden file. Enable hidden files in File
Manager and upload it into `public_html`.

**Pages redirect endlessly, or `/about` shows a directory listing.**
`DirectorySlash Off` is missing from `.htaccess`. The export contains both
`about.html` and an `about/` directory (which holds that page's share image);
without that line Apache redirects `/about` to `/about/`, which has no index.

**The contact form says it could not send.**
Check, in order: `api/contact.php` exists in `public_html/api/`; both mailboxes
exist; PHP is enabled for the domain (hPanel → Advanced → PHP Configuration).
The endpoint returns JSON — open
`https://rechargachargine.com/api/contact.php` directly and you should see
`{"status":"error","message":"Method not allowed."}`, which confirms PHP is
running.

**Enquiries land in spam.**
Confirm the SPF record above, and that `website@rechargachargine.com` exists.

**Old content keeps showing after a re-upload.**
`.htaccess` tells browsers never to cache HTML, so this is normally Hostinger's
own cache — purge it in hPanel, then hard-reload.

**Social previews show no image.**
The share cards are extensionless files. The `ForceType image/png` block in
`.htaccess` handles it, so this means `.htaccess` is missing or was overwritten.
