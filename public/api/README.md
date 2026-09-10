# Better Pagbilao API Data

This folder contains static JSON data for future Better Pagbilao features. Files are served by Vite from `/api/...` during development and from the same path after build.

## Groups

- `core/` - site metadata, official links, governance, public offices, emergency contacts, downloadable forms, and transparency records.
- `geography/` - barangays, PSGC barangay data, nearby places, boundaries, and transportation notes.
- `demographics/` - 2020 demographic data and historical population data.
- `tourism/` - tourism site data, destinations, events, categories, media URLs, and filters.

## Catalog

Use `/api/index.json` as the endpoint catalog. It lists every grouped file and gives each endpoint a stable key.

## Notes

- All 13 JSON files were validated after organizing.
- Original source metadata remains inside the JSON files where it was provided.
- Keep filenames lowercase and hyphenated so future fetch paths stay predictable.
