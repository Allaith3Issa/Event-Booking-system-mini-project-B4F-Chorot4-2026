# Event-Booking-system-mini-project-B4F-Chorot4-2026
Full-stack application featuring a NestJS backend API with robust DTO validation and a responsive frontend interface for managing workspaces and projects."

## Find and manage a booking

Run the frontend with mock data:

```bash
cd client
npm install
npm run dev
```

Copy `client/.env.example` to `client/.env` to use mock mode. The demo search values are:

| Phone | Booking code | Result |
| --- | --- | --- |
| `0933123456` | `EV-2093` | Active booking; can be cancelled |
| `0933123456` | `EV-2094` | Already cancelled |
| `0944123456` | `EV-2095` | Event has started; cannot be cancelled |

Phone numbers ignore spaces and dashes, and booking codes ignore letter case. To use the backend instead, set `VITE_USE_MOCK=false` in `client/.env` and make sure the API is running at `http://localhost:3000`.
