# Roti Xpress website

A plain static site: no Python, Django or build step needed.

```
index.html       the page (banner slides, Our Products, About Us, Who we supply, Gallery, Reviews, Contact Us)
css/styles.css   all styling (mobile-first)
css/fonts.css    the embedded Open Sans and Roboto fonts (no need to edit; licences in font-licenses.txt)
js/main.js       menu, banner slider, gallery photo viewer, pre-filled order emails, Google map
images/          photos (.webp with .jpg fallbacks), logo, wheat footer art, favicons
```

## Preview
Double-click `index.html` to open it in a browser.

## Publish
Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or your current host). On Netlify or Vercel you can drag and drop the folder.

## Common edits
- **Phone / email:** search `index.html` for `647-576-0822`, `+16475760822` and `xpressroti@gmail.com`. Also update `EMAIL` at the top of `js/main.js`.
- **Hours / address:** search `index.html` for `7 AM` and `Great Lakes`.
- **Map:** the Google map link is the `data-src` on `<div class="map" id="map">` in `index.html`.
- **Social links:** the `<div class="socials">` block near the bottom of `index.html` (Facebook, Instagram, YouTube, TikTok, LinkedIn).
- **Colours:** change `--brand` and the other variables at the top of `css/styles.css`.
- **Banner slides:** the three `<div class="slide ...">` blocks at the top of `index.html`.
- **About text:** edit the two paragraphs inside `<div class="about-copy">` in `index.html`.
- **Add a product:** copy one `<li class="product">` block in `index.html` and change the image, name and text. Product images are 900 x 720 with a transparent background.
- **Add a gallery photo:** copy one `<button class="g-item">` block in `index.html`. `data-webp` / `data-jpg` are the full-size photo shown when tapped; the `<picture>` inside is the square thumbnail.
- **Add prices:** add a line such as `<p class="price">$0.50 each</p>` under a product description.

## Search (SEO) setup for rotixpress.ca

Already done in the code: canonical link, og:url, full image addresses, business data `url`, `sitemap.xml`, and the `Sitemap:` line in `robots.txt`. All use https://rotixpress.ca/ (no www).

Still to do after the site is live:
- Make sure https://www.rotixpress.ca redirects to https://rotixpress.ca (set this in your host's domain settings).
- Add the site to Google Search Console (https://search.google.com/search-console) and submit https://rotixpress.ca/sitemap.xml.
- In your Google Business Profile, set the website to https://rotixpress.ca.
- Use the same address on Instagram, Facebook, LinkedIn, YouTube and TikTok profiles.
