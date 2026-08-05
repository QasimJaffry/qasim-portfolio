#!/usr/bin/env bash
# Stage .tmp-monkr-shots/<slug>/ with flat names expected by monkr-plates.mjs
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHOTS="$ROOT/.tmp-shots"
DESK="$HOME/Desktop/Screenshots"
OUT="$ROOT/.tmp-monkr-shots"

stage() {
  local slug="$1"; shift
  mkdir -p "$OUT/$slug"
  echo "→ $slug"
  while (( $# >= 2 )); do
    local src="$1" dest="$2"
    shift 2
    if [[ ! -f "$src" ]]; then
      echo "  MISSING: $src" >&2
      exit 1
    fi
    cp "$src" "$OUT/$slug/$dest"
  done
}

# --- agenticly: web + mobile ---
stage agenticly \
  "$SHOTS/agenticly/web-home.png" web.png \
  "$SHOTS/agenticly/01-home.jpg" home.jpg \
  "$SHOTS/agenticly/02-chat.jpg" chat.jpg \
  "$SHOTS/agenticly/03-charts.jpg" charts.jpg \
  "$SHOTS/agenticly/04-analysis.jpg" analysis.jpg

# --- snapwork: web + mobile ---
stage snapwork \
  "$SHOTS/snapwork/03-campaigns-web.png" campaigns-web.png \
  "$SHOTS/snapwork/04-dashboard.png" dashboard.png \
  "$SHOTS/snapwork/01-listing.png" listing.png \
  "$SHOTS/snapwork/02-connect.png" connect.png \
  "$SHOTS/snapwork/05-portfolio.png" portfolio.png \
  "$SHOTS/snapwork/06-interests.png" interests.png \
  "$SHOTS/snapwork/07-publish.png" publish.png

# --- catchat: web + mobile ---
stage catchat \
  "$SHOTS/catchat/01-home-desktop.png" web.png \
  "$SHOTS/catchat/02c-home-loggedin.png" web-loggedin.png \
  "$SHOTS/catchat/02-cat-modal.png" web-modal.png \
  "$SHOTS/catchat/05-home-mobile.png" home.png \
  "$SHOTS/catchat/06-cat-modal-mobile.png" modal.png \
  "$SHOTS/catchat/07-chat-mobile.png" chat.png \
  "$SHOTS/catchat/08-chat-list-mobile.png" list.png

# --- cpas: web + mobile ---
stage cpas-huddle-up \
  "$SHOTS/cpas-huddle-up/05-my-rooms-web.png" web.png \
  "$SHOTS/cpas-huddle-up/01-home.jpg" home.png \
  "$SHOTS/cpas-huddle-up/02-room.jpg" room.png \
  "$SHOTS/cpas-huddle-up/03-podcast.jpg" podcast.png \
  "$SHOTS/cpas-huddle-up/04-splash.jpg" splash.png

# --- decidr: web + mobile ---
stage decidr \
  "$SHOTS/decidr/01-landing-desktop.png" landing.png \
  "$SHOTS/decidr/02-dashboard-desktop.png" dashboard.png \
  "$SHOTS/decidr/03-detail-desktop.png" detail.png \
  "$SHOTS/decidr/06-dashboard-mobile.png" dashboard-mobile.png \
  "$SHOTS/decidr/07-detail-mobile.png" detail-mobile.png \
  "$SHOTS/decidr/08-compare-mobile.png" compare-mobile.png

# --- dealflow: web + mobile from Desktop (unicode NBSP in macOS screenshot names) ---
mkdir -p "$OUT/dealflow-ai"
python3 <<'PY'
from pathlib import Path
import shutil
src = Path.home() / "Desktop" / "Screenshots" / "DealFlow"
dst = Path("/Users/qasimhassan/Desktop/qasim-portfolio/.tmp-monkr-shots/dealflow-ai")
webs = sorted(src.glob("Screenshot 2026-05-12*.png"))
phones = sorted(src.glob("Screenshot_*.png"))
mapping = [
  (webs[0], "web.png"),
  (webs[1], "web-2.png"),
  (phones[0], "home.png"),
  (phones[1], "pipeline.png"),
  (phones[2], "deal.png"),
]
for s, name in mapping:
  shutil.copy(s, dst / name)
  print("  dealflow", name, "←", s.name)
PY

# --- qubio: web + tablet-ish + mobile ---
stage qubio \
  "$DESK/Qubio/Web/WebDesktop.png" web.png \
  "$DESK/Qubio/Web/Screenshot 2025-11-16 at 3.50.58 PM.png" tablet.png \
  "$DESK/Qubio/App/Home.png" home.png \
  "$DESK/Qubio/App/ExamplePageEditor.png" editor.png \
  "$DESK/Qubio/App/QrBody.png" qr.png \
  "$DESK/Qubio/App/ShareQrMulti.png" share.png

# --- bugmapper: web + mobile (bm-best has real captures; best/ was black) ---
stage bugmapper \
  "$SHOTS/bugmapper-web-desktop.png" web.png \
  "$SHOTS/bm-best/01-home.png" home.png \
  "$SHOTS/bm-best/02-trapinfo.png" trap.png \
  "$SHOTS/bm-best/06-pim.png" scan.png \
  "$SHOTS/bm-best/07-sync.png" sync.png \
  "$SHOTS/bm-best/06-pim.png" pim.png

# --- safedeal: mobile (+ web if present) ---
if [[ -f "$SHOTS/safedeal-ref/web-raw.png" ]]; then
  stage safedeal \
    "$SHOTS/safedeal-ref/web-raw.png" web.png \
    "$DESK/SafeDeal/Home.png" home.png \
    "$DESK/SafeDeal/Product (Aliexpress) Product insgihts.png" insights.png \
    "$DESK/SafeDeal/Product (Aliexpress) AI insights.png" ai.png \
    "$DESK/SafeDeal/Product (Aliexpress).png" product.png \
    "$DESK/SafeDeal/Home (Aliexpress).png" browse.png
else
  stage safedeal \
    "$DESK/SafeDeal/Home.png" home.png \
    "$DESK/SafeDeal/Product (Aliexpress) Product insgihts.png" insights.png \
    "$DESK/SafeDeal/Product (Aliexpress) AI insights.png" ai.png \
    "$DESK/SafeDeal/Product (Aliexpress).png" product.png \
    "$DESK/SafeDeal/Home (Aliexpress).png" browse.png
fi

# --- sextherapypro: mobile only ---
stage sextherapypro \
  "$SHOTS/sextherapypro/01-plan.png" plan.png \
  "$SHOTS/sextherapypro/02-chat.png" chat.png \
  "$SHOTS/sextherapypro/03-goals.png" goals.png \
  "$SHOTS/sextherapypro/04-game.png" game.png \
  "$SHOTS/sextherapypro/05-map.png" map.png \
  "$SHOTS/sextherapypro/06-topics.png" topics.png \
  "$SHOTS/sextherapypro/07-chats.png" chats.png

# --- realtag: mobile only ---
stage realtag \
  "$SHOTS/realtag/01-detect-good.png" detect.png \
  "$SHOTS/realtag/02-manual-keep.png" manual.png \
  "$SHOTS/realtag/03-tagged.png" tagged.png \
  "$SHOTS/realtag/03-tag-form.png" form.png \
  "$SHOTS/realtag/04-tag-list.png" list.png

# --- innerverse: mobile ---
stage innerverse \
  "$DESK/Innerverse/screenshot-1.png" s1.png \
  "$DESK/Innerverse/screenshot-2.png" s2.png \
  "$DESK/Innerverse/screenshot-3.png" s3.png \
  "$DESK/Innerverse/screenshot-4.png" s4.png \
  "$DESK/Innerverse/screenshot-5.png" s5.png \
  "$DESK/Innerverse/screenshot-6.png" s6.png \
  "$DESK/Innerverse/screenshot-7.png" s7.png \
  "$DESK/Innerverse/screenshot-8.png" s8.png

# --- kitty-nip: mobile ---
stage kitty-nip \
  "$SHOTS/kittynip/01-swipe.png" swipe.png \
  "$SHOTS/kittynip/as-welcome.png" welcome.png \
  "$SHOTS/kittynip/02-profile.png" profile.png \
  "$SHOTS/kittynip/03-chat.png" chat.png \
  "$SHOTS/kittynip/as-match.png" match.png

# --- meet-and-greet: mobile ---
stage meet-and-greet \
  "$SHOTS/meet-and-greet/01-online.png" online.png \
  "$SHOTS/meet-and-greet/02-dial.png" dial.png \
  "$SHOTS/meet-and-greet/03-call-1to1.png" call.png \
  "$SHOTS/meet-and-greet/04-group.png" group.png

# --- interio: mobile ---
stage interio \
  "$SHOTS/interio/01-home.png" home.png \
  "$SHOTS/interio/04-camera-detected.png" camera.png \
  "$SHOTS/interio/05-post-scan.png" post-scan.png \
  "$SHOTS/interio/06-ar.png" ar.png

# --- bschedule: mobile ---
stage bschedule \
  "$DESK/Bschedule/Screenshot_1773516904.png" m1.png \
  "$DESK/Bschedule/Screenshot_1773516922.png" m2.png \
  "$DESK/Bschedule/Screenshot_1773516937.png" m3.png \
  "$DESK/Bschedule/Screenshot_1773516942.png" m4.png \
  "$DESK/Bschedule/Screenshot_1773516945.png" m5.png \
  "$DESK/Bschedule/Screenshot_1773516975.png" m6.png

echo "Staged all projects into $OUT"
ls "$OUT"
