# react dashboard project

a comprehensive single page application (spa) built with react, typescript, vite, and redux toolkit. this project demonstrates modern web development practices including authentication, global state management, distributed workflows with temporal, and advanced monitoring with sentry.

## features

### 1. authentication system
- **multiple providers**: supports google, github, and email/password login via firebase authentication.
- **guest access**: simulated guest login for quick access.
- **protected routes**: dashboard and admin pages are inaccessible without logging in.
- **admin role**: specialized `/admin` route for system controllers (restricted to admin@talview.com).
- **login tips**: dynamic helpful hints for first-time admin registration.

### 2. resilient checkout with temporal (hitl)
- **grace period**: order workflows include a 5-minute window for user corrections.
- **signal support**: users can update shipping addresses in real-time during the grace period.
- **human-in-the-loop**: admins can override workflow states or force-cancel tasks from the control center.
- **distributed reliability**: managed via a standalone temporal server for high consistency.

### 3. multi-user task engine (rbac)
- **multi-tenant lists**: create independent task lists with role-based access.
- **email sharing**: share lists with up to two external users via email.
- **universal access**: "general tasks" list is globally editable by all users.
- **rich functionality**: support for task editing, deletion, and completion (with strikethrough styling).

### 4. global flagging & monitoring (sentry)
- **persistent feedback**: floating "🚩 flag issue" button available on all pages.
- **user feedback loops**: integrated sentry dialogs for reporting bugs with technical context.
- **advanced tracking**: captures backend exceptions and worker-level transport errors.

### 5. product catalog & dashboard
- **optimized grid**: 4-column layout displaying 12 products per page with rtk query pagination.
- **feature cards**: modern dashboard layout with role-sensitive cards (e.g., admin dashboard link).
- **quick buy**: integrated checkout flow triggering temporal workflows.

## tech stack
- **frontend**: react 19, typescript, vite, redux toolkit, rtk query
- **backend**: node.js, express, temporal sdk, sentry sdk
- **infrastructure**: docker (temporal, cassandra, temporal ui)
- **auth**: firebase v12
- **testing**: vitest (unit & workflow logic)

## setup instructions

### 1. clone & install
```bash
git clone <repository-url>
npm install
cd project-1/backend && npm install
```

### 2. environment variables
- create `.env` in the root for firebase keys.
- create `project-1/backend/.env` for backend port (default 4002) and temporal address.

### 3. run temporal (docker)
```bash
cd project-1/backend
docker compose up -d
# wait ~1 min for cassandra to initialize
```

### 4. run services (multi-terminal)
- **frontend**: `npm run dev`
- **backend api**: `cd backend && npm start`
- **backend worker**: `cd backend && npm run worker`

## project structure
```text
/
├── src/                      # frontend source
│   ├── app/                  # redux store
│   ├── components/           # reusable ui (navbar, flagissue)
│   ├── contexts/             # react contexts (auth, theme)
│   ├── features/             # feature logic (todo, products, admin)
│   ├── pages/                # pages (dashboard, admindashboard)
├── backend/                  # backend source
│   ├── src/
│   │   ├── workflows/        # temporal workflows (order.ts)
│   │   ├── activities/       # temporal activities
│   │   ├── index.ts          # express api
│   │   ├── worker.ts         # temporal worker
│   ├── docker-compose.yml    # independent infrastructure
├── stories/                  # storybook documentation
```
