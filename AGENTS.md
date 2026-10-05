# Development notes

- This repository is a static HTML website, not a fullstack app. Vite serves the bind-mounted source with live reload; no database or external credentials are required.
- Start with `docker compose -f docker-compose.base44.yml up -d --build`. Dependencies sync from package-lock.json on container startup into a named volume.
- Verify with `docker compose -f docker-compose.base44.yml ps`, `curl -fsS http://localhost:3000/`, and `curl -fsS http://localhost:3000/images/cleaning.jpg -o /dev/null`. The HTML response should include `/@vite/client`, confirming development source is served.
- The contact form uses mailto (opens the visitor's email client); it does not store or send requests through a backend. The WhatsApp URL currently contains a sample phone number. These are existing limitations, not credential-dependent integrations.
- The original index.html contained four pasted chat prefixes, including one inside CSS; they were removed to restore valid markup and pricing-card styling.
- No automated test suite exists. Check desktop/mobile rendering and anchor navigation in a browser when available.
