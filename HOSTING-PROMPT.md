# Prompt for Claude in Chrome

Copy everything inside the box below and paste it into Claude in Chrome as a
single message. It assumes no prior context — it names the repository, the
company, the domain and every value needed.

Before pasting, make sure you are logged into **GitHub** and **Hostinger
hPanel** in that browser.

---

```
You are deploying a website for me. You have Chrome and I am already logged
into both GitHub and Hostinger (hPanel) in this browser. Work through this
end to end and only come back to me when the site is live, or when you hit
something you genuinely cannot resolve yourself.

CONTEXT — you have none, so here are all the facts you need:

- Company: Recharga Chargine Pvt. Ltd., a deep-tech clean-energy company in
  Jaipur, India. Its product is called the RADAX Generator.
- GitHub repository: https://github.com/sehejsharm/recharga
- Branch with the finished site: claude/recharga-brand-strategy-h189v6
- Domain to host it on: rechargachargine.com
- Hosting: Hostinger (hPanel), a normal web-hosting plan serving files with
  Apache/LiteSpeed and PHP. There is no Node.js on it, and none is needed.
- The site is a static export: a folder of plain HTML, CSS, JS and images.
  Nothing needs to be installed or run on the server.
- The contact form posts to a small PHP file included in the build.
  All enquiries must arrive at admin@rechargachargine.com.

There is a file in the repository called DEPLOY.md with the same instructions
in more detail. Read it if anything below is ambiguous.

STEP 1 — GET THE BUILT SITE

The repository has a GitHub Action that builds the site and pushes the result
to a branch called "deploy".

a. Go to https://github.com/sehejsharm/recharga/actions
b. Find the workflow "Build deployable site". If it has never run, or its most
   recent run is older than the latest commit on
   claude/recharga-brand-strategy-h189v6, run it manually: open the workflow,
   click "Run workflow", choose that branch, and run it.
   If Actions are disabled, enable them when GitHub offers.
c. Wait for it to finish green. It takes a few minutes. If it fails, open the
   failed step, read the error, and tell me exactly what it said — do not
   guess at a fix in the workflow file.
d. Once green, download the built site as a ZIP from:
   https://github.com/sehejsharm/recharga/archive/refs/heads/deploy.zip

That ZIP contains the complete website at its top level (inside a single
wrapper folder named something like "recharga-deploy").

STEP 2 — UPLOAD TO HOSTINGER

a. In hPanel, open File Manager for rechargachargine.com and go to public_html.
b. If public_html contains a default Hostinger placeholder page (commonly
   default.php, index.php or an "index.html" welcome page), delete those
   files first. Do not delete anything that looks like real prior content
   without asking me.
c. Upload the ZIP into public_html and use "Extract" to unpack it there.
d. The extracted files will be inside a wrapper folder. Move the CONTENTS of
   that folder up into public_html directly, then delete the now-empty wrapper
   folder and the ZIP.

   public_html must end up with index.html at its top level — NOT
   public_html/recharga-deploy/index.html.

e. CRITICAL — two files are easy to lose, and the site is broken without them:

   - .htaccess  — a hidden file. In File Manager, turn on "show hidden files"
     and confirm .htaccess exists directly inside public_html. Without it,
     every page except the homepage returns 404.
   - api/contact.php — confirm the folder "api" exists in public_html and
     contains contact.php. Without it the contact form cannot send.

   If either is missing after extraction, get it from the deploy branch on
   GitHub and upload it manually.

STEP 3 — DOMAIN, DNS AND SSL

Point rechargachargine.com at this hosting and make https work.

- In hPanel, make sure the domain rechargachargine.com is attached to this
  hosting plan, and that www.rechargachargine.com also resolves.
- If the domain is registered with Hostinger, this is usually automatic. If it
  is registered elsewhere, set the registrar's nameservers to Hostinger's
  (ns1.dns-parking.com and ns2.dns-parking.com), or point an A record at the
  server IP shown in hPanel.
- Issue the free SSL certificate: hPanel > Security > SSL. Then enable
  "Force HTTPS".

I have been seeing a problem with the domain. Diagnose and fix it yourself
rather than reporting it back to me. Work through these in order:

- Check what the domain currently resolves to and whether it is even pointed
  at this hosting account.
- If nameservers are wrong or still at the registrar's defaults, correct them.
- If the domain is listed as "parked", or is attached to a different website
  or plan inside hPanel, re-point it at the plan holding this site.
- If SSL will not issue, it is almost always because DNS has not propagated to
  the host yet. Confirm DNS resolves correctly first, then retry SSL. DNS can
  take a few hours; if it is clearly still propagating, say so and retry later
  rather than changing settings repeatedly.
- If a "domain already in use / already exists" error appears, remove the
  stale entry pointing at the old or empty site, then add it again.

Only escalate to me if fixing it needs something I alone can do — a registrar
login you do not have, a payment, or a plan upgrade. In that case tell me the
exact screen and the exact error.

STEP 4 — EMAIL (the site cannot deliver enquiries without this)

In hPanel > Emails, on the domain rechargachargine.com, create BOTH:

  1. admin@rechargachargine.com     — receives every enquiry from the website.
  2. website@rechargachargine.com   — the address the site sends AS. An alias
                                      forwarding to admin@ is fine.

Both are required. The second one matters because mail servers reject or
spam-file messages claiming to come from a domain with no such mailbox.

Then check DNS for an SPF record on the domain. Hostinger normally adds one.
If it is missing, add a TXT record on the root of the domain:

  v=spf1 include:_spf.mail.hostinger.com ~all

STEP 5 — VERIFY, AND DO NOT SKIP THIS

Open each of these in the browser and confirm it loads correctly over https:

  https://rechargachargine.com/
  https://rechargachargine.com/technology
  https://rechargachargine.com/about
  https://rechargachargine.com/team
  https://rechargachargine.com/team/sehej-sharma
  https://rechargachargine.com/team/ali-electricwala
  https://rechargachargine.com/contact
  https://rechargachargine.com/sitemap.xml
  https://rechargachargine.com/robots.txt

Also confirm:

  - http://rechargachargine.com redirects to https
  - www.rechargachargine.com redirects to the version without www
  - a made-up URL such as https://rechargachargine.com/does-not-exist shows
    the site's own dark 404 page, not a Hostinger error page
  - URLs have no ".html" on the end
  - https://rechargachargine.com/api/contact.php opens and shows the text
    {"status":"error","message":"Method not allowed."}
    That exact response is correct — it proves PHP is running.

Check the site looks and behaves right:

  - the homepage has a dark background with an animated green particle effect
    behind the headline
  - moving the mouse around the page makes grids of small dots light up green
    and shift away from the cursor
  - on /technology, clicking the "Radial", "Axial" and "RADAX hybrid" buttons
    changes the diagram next to them
  - both founder pages show a photo of a person
  - scrolling is smooth and sections fade in as they arrive

If any of that is missing or the page looks like unstyled plain text, the
_next folder did not upload completely. Re-upload it.

FINALLY — send a real test message through the form at
https://rechargachargine.com/contact and confirm it arrives at
admin@rechargachargine.com. Check the spam folder if it is not in the inbox.
This is the single most important check: it is how customers reach the company.

STEP 6 — SEARCH CONSOLE

Add https://rechargachargine.com to Google Search Console, verify ownership
(the DNS TXT record method is easiest on Hostinger), and submit the sitemap at
https://rechargachargine.com/sitemap.xml

REPORT BACK

When you are done, tell me:
  - the live URL and that https is working
  - the result of every check in Step 5
  - whether the test email arrived
  - anything you changed to fix the domain
  - anything still outstanding and what you need from me
```

---

## If Claude in Chrome cannot run the GitHub Action

Some accounts have Actions disabled and the setting is not always changeable
from the UI. In that case build locally instead and hand over the folder:

```bash
git clone https://github.com/sehejsharm/recharga.git
cd recharga
git checkout claude/recharga-brand-strategy-h189v6
npm ci
NEXT_PUBLIC_SITE_URL=https://rechargachargine.com npm run build
cd out && zip -r ../site.zip . -x '.DS_Store' && cd ..
```

`site.zip` is then the file to upload and extract in `public_html`, and Step 1
of the prompt can be replaced with "upload the ZIP I am giving you".

Note the `-r` with a leading `.` — it includes `.htaccess`, which a plain
`zip -r site.zip *` would silently skip.
