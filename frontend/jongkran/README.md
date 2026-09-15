# JongKran frontend

React 18, Vite, React Router, and Tailwind CSS power the JongKran web client.

## Commands

```bash
npm install
npm run dev
npm run build
```

Set `VITE_API_URL` when the API is not available through Vite's default `/api`
proxy.

## Source structure

```text
src/
  app/          application providers and route definitions
  components/   reusable visual components
  config/       shared UI configuration such as navigation
  features/     domain code grouped by auth, recipes, and future features
  hooks/        compatibility entry points for existing page imports
  lib/          small shared helpers and compatibility exports
  pages/        route-level screens
  services/     API transport, session storage, and browser storage
```

Keep route screens focused on page-specific behavior. Shared state and data
loading belong in a feature context or feature hook, while raw HTTP and browser
storage access belong in `services`.

Recipe lists are cached for five minutes and in-flight requests are shared.
Recipe details are cached by ID, so the overview, ingredient check, and cooking
instruction flow do not download the same recipe repeatedly. Favorites and the
current profile are loaded once at the application level and reused by every
header and recipe card.
