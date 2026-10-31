"""Local fallback catalog when Nest API is unavailable."""

from typing import Any

LOCAL_CATALOG: list[dict[str, Any]] = [
    {
        "slug": "nova-h1",
        "title": "NOVA H1",
        "name": "NOVA H1",
        "tagline": "Flagship wireless headphones",
        "description": (
            "Over-ear wireless headphones with planar drivers, "
            "memory-foam cushions, and all-day battery."
        ),
        "embedText": """
NOVA H1 — flagship over-ear wireless headphones.

Materials. Aircraft-grade magnesium frame with soft-touch polymer yokes.
Lambskin-feel protein leather headband. Memory-foam ear cushions wrapped
in breathable knit that stays cool after hours of wear. Matte Black, Sand,
Midnight, and Silver finishes.

Drivers. Custom 40mm planar magnetic drivers deliver airy highs and
controlled bass without mud. Adaptive EQ profiles for Studio, Live, and
Night modes. Spatial audio with head tracking for cinematic mixes.

Battery. Up to 42 hours with ANC on; quick charge adds 8 hours in 15 minutes.
USB-C and lossless Bluetooth LE Audio. Multipoint for laptop and phone.

Comfort. Clamping force tuned for long listening sessions. Fold-flat hinges
for travel. Passive isolation when batteries are empty. Cite slug: nova-h1.

FAQ. ANC is hybrid feedforward/feedback. Ear cushions are replaceable.
Supports aptX Adaptive and LC3. Weight: 285g.
""".strip(),
    },
    {
        "slug": "nova-s1",
        "title": "NOVA S1",
        "name": "NOVA S1",
        "tagline": "Room-filling portable speaker",
        "description": (
            "Portable Bluetooth speaker with dual passive radiators "
            "and IP67 weather sealing."
        ),
        "embedText": """
NOVA S1 — portable Bluetooth speaker for rooms and decks.

Materials. Die-cast aluminum grille over textile wrap. Silicone bumper ring
absorbs drops. IP67 dust and water resistance for showers and shoreline.
Powder-coated finishes in Matte Black, Sand, Midnight, and Silver.

Drivers. Dual full-range drivers plus opposing passive radiators for
punchy low end without boom. Stereo pair mode links two S1 units.
Party Mode syncs up to eight speakers over Bluetooth mesh.

Battery. 24-hour playback at mid volume. USB-C PD in and out — charge
phones from the speaker. Sleep timer and auto-standby.

Comfort & presence. Soft-touch carry handle. One-button pairing.
Voice-assistant wake works at arm's length. Cite slug: nova-s1.

FAQ. Max SPL ~92dB. Aux 3.5mm input. Dimensions 210×75×75mm. Weight 780g.
""".strip(),
    },
    {
        "slug": "nova-buds",
        "title": "NOVA Buds",
        "name": "NOVA Buds",
        "tagline": "True wireless earbuds",
        "description": (
            "Compact true wireless earbuds with adaptive ANC "
            "and a pocket-size charging case."
        ),
        "embedText": """
NOVA Buds — true wireless earbuds built for commute and focus.

Materials. Gloss-ceramic shells with matte stems. Medical-grade silicone
tips in four sizes (XS–L). Sweat-resistant IP54 rating. Case in the same
Matte Black, Sand, Midnight, and Silver palette as the H1 and S1.

Drivers. 11mm dynamic drivers with graphene diaphragms. Adaptive ANC
samples wind and cabin noise 2000×/second. Transparency mode lets voices
through without removing buds. Low-latency game mode under 45ms.

Battery. 7 hours per charge with ANC; case adds 28 more hours. Wireless
Qi charging on the case lid. Find My compatible beacons.

Comfort. Ergonomic stem angle reduces ear fatigue. Pressure-relief vents
prevent occlusion boom. Touch controls for volume, ANC, and calls.
Cite slug: nova-buds.

FAQ. Multipoint Bluetooth 5.3. Multipoint two devices. Weight 5.2g per bud.
""".strip(),
    },
]


def get_seed_products() -> list[dict[str, Any]]:
    """Return a deep-ish copy of the local catalog for ingest."""
    return [dict(item) for item in LOCAL_CATALOG]
