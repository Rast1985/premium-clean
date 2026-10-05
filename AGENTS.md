# Development notes

- This repository began as a standalone HTML page, not a fullstack application. The Lexford site uses native ES modules and a Vite development server; there is no API, database, or external credential requirement.
- Start with `docker compose -f docker-compose.base44.yml up -d`. Dependencies synchronize from the lockfile on startup, and source files are bind-mounted. `docker compose -f docker-compose.base44.yml exec -T web npm run build` checks production compilation.
- Port 3000 must serve `/@vite/client` in the HTML to confirm the live source edit loop. The Compose host allowance comes from the platform-provided `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` variable.
- Forms deliberately prepare a mailto draft and do not send, store personal data, or confirm bookings. Contact information is illustrative. Preserve the visible disclaimer until real firm information and a delivery integration are supplied.
- The initial calendar is May 2025 to match the requested design reference, not real availability. Month navigation and date/time selection are client-side.
- Gold symbols are shared SVG definitions in index.html. Styles and behavior live in styles.css and app.js. Reduced-motion disables decorative cursor and seal animation.
