# OtoGez: Car Rental Frontend

Angular 19 single-page application for a car rental business. It has a public vehicle catalogue and booking flow, a Leaflet branch locator, individual and corporate accounts, branch-manager and admin screens, an admin dashboard for dynamic pricing, and a support chat widget.

This repository is the frontend only. All data comes from the [CarProject](https://github.com/kamiltuncok/CarProject) ASP.NET Core API.

![Home page with booking search](docs/screenshots/vehicle-search.png)

---

## Features

- **Booking funnel:** hero search (pickup and return branch, dates and times, return to a different branch) → availability results → vehicle detail with gallery → payment step.
- **Catalogue:** filters by brand, segment, fuel, transmission and maximum daily price, plus a client-side text search.
- **Branch locator:** a Leaflet map with OpenStreetMap tiles, one marker per branch, city filter chips, and deep links (`/branches?location=<name>`) that highlight one branch.
- **Accounts:** separate individual and corporate login and registration flows, a profile page and rental history.
- **Branch managers:** a list of the rentals at their branches, with deposit collection, delivery, return and cancellation actions.
- **Admin:** CRUD screens for cars, brands, colours, car images, branches and branch-manager assignments.
- **Pricing dashboard** (`/admin/pricing`): fleet table with per-car recommendation and repricing, and a fleet-wide batch repricing action.
- **Support assistant:** a floating chat widget and a `/help` knowledge-base page, both backed by the API's grounded FAQ endpoint.

## Technology Stack

| Area | Technology |
|---|---|
| Framework | Angular 19.2: standalone components, signals, functional guards and interceptors |
| Language | TypeScript 5.8, RxJS 7.8 |
| HTTP / auth | `HttpClient` with `withInterceptors`, `@auth0/angular-jwt` for decoding and expiry checks |
| UI | Bootstrap 5, ngx-bootstrap, ngx-toastr, custom CSS |
| Maps | Leaflet 1.9 |
| Tests | Karma + Jasmine |

## Architecture

- **No NgModules.** `main.ts` calls `bootstrapApplication(AppComponent, appConfig)`. `app.config.ts` provides the router, animations, `HttpClient` with the two interceptors, Toastr and `JwtHelperService`.
- **Lazy routes.** Every route in `app.routes.ts` uses `loadComponent`, so each screen is a separate chunk.
- **Session state.** `AuthService` stores the JWT in `localStorage` (key `token`) and exposes it through signals: `currentUser`, `isAuthenticated`, `isAdmin`, `isLocationManager` and `customerType`, all decoded from the token's role claims. The navbar re-renders on login and logout without a page reload.
- **Guards.** `loginGuard` redirects anonymous users to `/login`. `adminGuard` also sends authenticated users without the admin role to `/`. Both are UX checks only, because the API enforces authorization.
- **Interceptors.** `authInterceptor` adds `Authorization: Bearer <token>`. `errorInterceptor` turns HTTP failures into toasts: 401 redirects to `/login`, and 0 shows "server unreachable". Requests that set the `SKIP_GLOBAL_ERROR_TOAST` context token (the chat widget) handle their own errors.
- **API contract.** Services are typed against the backend envelope `{ success, message, data }` (`ResponseModel`, `SingleResponseModel<T>`, `ListResponseModel<T>`).

```
src/app/
├── components/        # one folder per standalone component (home, car, car-list, car-detail,
│                      # payment, branches, pricing-dashboard, support-chat, help, auth, admin CRUD, …)
├── services/          # one injectable per API resource
├── models/            # request / response interfaces
├── guards/            # loginGuard, adminGuard
├── interceptors/      # authInterceptor, errorInterceptor
├── pipes/             # client-side list filters
├── app.config.ts
├── app.routes.ts
└── app.component.*    # shell: navbar, <router-outlet>, footer, support chat
```

## Routes

| Access | Routes |
|---|---|
| Public | `/`, `/cars`, `/cars/brand/:id`, `/cars/color/:id`, `/carDetail/:carId`, `/home/carlist`, `/branches`, `/about`, `/help`, `/login`, `/register`, `/loginforcorporate`, `/registerforcorporate` |
| Signed in (`loginGuard`) | `/carDetail/:carId/payment`, `/profile`, `/rentals`, `/location-rentals`, `/location-manager-profile` |
| Admin (`adminGuard`) | `/admin/pricing`, `/cars/add`, `/brands/add`, `/colors/add`, `/carimages/add`, `/locations/add`, `/location-managers`, `/location-managers/add`, `/location-managers/update/:id` |

![Branch locator](docs/screenshots/branch-locator.png)

*The branch locator with the API offline: the map renders, and markers appear once `/api/locations` returns data.*

## Support Chat

The **Yardım** button (`components/support-chat`) talks only to `POST /api/support/chat`. The browser never contacts the LLM.

- The widget keeps a session id. If that session has expired, it starts a new session and retries.
- 503, 504, 429 and network errors are shown inline with a retry action.
- Cited sources are rendered as in-app links to `/help#<article-id>`, or to `/branches` for branch sources (`branch-*` ids, built by the API from the locations table). The link is derived from the source id; the API's `url` field is never used as an `href`. Example policies get an "örnek" badge and a notice.
- Model output is rendered only through `{{ }}` interpolation, never as HTML.
- The dialog has keyboard support (Enter to send, Shift+Enter for a new line, Escape to close) and ARIA roles (`dialog`, `log` with `aria-live="polite"`).

`/help` lists the knowledge-base articles from `GET /api/support/articles`.

## Getting Started

### Prerequisites

- Node.js `^18.19.1`, `^20.11.1` or `^22`, which Angular 19 requires
- The CarProject API running on `https://localhost:44306`, with its development certificate trusted by the browser

### Install and run

```bash
npm install
npm start            # ng serve → http://localhost:4200
```

The home, branch, about, help and auth pages render without the API, but they show no data. The catalogue, detail, profile and admin screens need the API.

### Backend URL

There are no `environment.ts` files. Each service in `src/app/services/` declares its own `apiUrl`, hardcoded to `https://localhost:44306/api/...`. To target another backend, update those fields. The API's CORS policy allows `http://localhost:4200` only.

## Build and Test

```bash
npm run build        # production build → dist/rentacar/
npm run watch        # development build in watch mode
npm test             # Karma (watch mode)
npx ng test --watch=false --browsers=ChromeHeadless   # single headless run
```

There are 17 unit specs, covering the support chat component, `SupportChatService` and the `AppComponent` shell. Other components have no specs, so only the production build checks them.

## Known Limitations

- The pricing dashboard calls `POST /api/cars/settle-rewards` and `GET /api/cars/pricing/performance`. **CarProject does not currently expose either endpoint**, so the reward-settlement action and the A/B performance cards fail.
- Some routes have no guard: `/cars/update/:id`, `/brands/update/:id`, `/colors/update/:id`, `/cars/carDetail/:carId/payment` and `/home/carlist/payment/:carId`.
- The JWT is kept in `localStorage`, so any script running on the origin can read it.
- The initial bundle (~910 kB) exceeds the 500 kB warning budget in `angular.json`.

## License

[MIT](LICENSE)
