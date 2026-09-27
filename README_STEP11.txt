TF FITNESS ROTA - STEP 11 INSTALLABLE PWA

UPLOAD THESE FILES TO THE ROOT OF A GITHUB PAGES REPOSITORY:

index.html
config.js
manifest.webmanifest
service-worker.js
offline.html
tf-fitness-logo.png
icon-192.png
icon-512.png

BEFORE USING THE PWA:

1. In Google Apps Script replace AppBackend.gs with the supplied
   STEP 11 AppBackend replacement file.
2. Deploy a NEW VERSION of the existing Apps Script web app.
3. Copy the same Apps Script /exec URL you already use for the rota.
4. In GitHub edit config.js.
5. Replace:
   PASTE_YOUR_EXISTING_ROTA_WEB_APP_URL_HERE
   with that /exec URL.
6. Commit the change.
7. Enable GitHub Pages from the main branch / root.

SECURITY:
- Do not put PINs, session tokens or staff data in this repository.
- config.js contains only the public web-app address.
- Staff still have to sign in with their TF Rota Staff ID and PIN.
- Live rota data remains in Google Sheets / Apps Script, not GitHub.

INTERNET:
The installed shell can load offline, but the actual rota requires an
internet connection because the data is live.
