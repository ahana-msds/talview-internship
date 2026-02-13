# temporal subscription management with frontend dashboard

a visual demonstration of temporal workflow orchestration with real-time frontend monitoring and actual email delivery.

## what's new

- **real-time dashboard**: watch workflows execute in real-time
- **actual emails**: emails sent via ethereal.email (test email service)
- **visual workflow state**: see trial period, billing cycles, and cancellation
- **activity timeline**: complete log of all events with timestamps
- **email preview links**: click to view sent emails in browser

## architecture

```
temporal-subscription-demo/
├── src/                          # backend
│   ├── activities.ts            # email & payment activities (with real email)
│   ├── workflows.ts             # subscription workflow logic
│   ├── worker.ts                # workflow executor
│   ├── api-server.ts            # rest api + sse (port 3002)
│   ├── email-config.ts          # ethereal email setup
│   └── event-store.ts           # real-time event tracking
├── frontend/                     # react dashboard (port 3001)
│   └── src/
│       ├── App.tsx              # main app with ethereal info
│       └── components/
│           ├── WorkflowDashboard.tsx    # control panel
│           ├── ActivityLog.tsx          # event timeline
│           └── WorkflowVisualizer.tsx   # state visualization
└── docker-compose.yml           # temporal + postgresql
```

## quick start

### 1. start infrastructure

```bash
docker-compose up -d
```

### 2. start worker (terminal 1)

```bash
npm run start:worker
```

wait for:
```
📧 ethereal email account created:
   user: [email]
   pass: [password]
   view emails at: https://ethereal.email/messages
worker started. listening on subscription-queue
```

**important**: copy the ethereal.email url and credentials - you'll use this to view emails!

### 3. start api server (terminal 2)

```bash
npm run start:api
```

wait for:
```
🚀 api server running on http://localhost:3002
```

### 4. start frontend (terminal 3)

```bash
cd frontend
npm run dev
```

wait for:
```
  ➜  local:   http://localhost:3001/
```

### 5. open dashboard

open http://localhost:3001 in your browser

## using the dashboard

### starting a subscription

1. the dashboard shows ethereal email credentials at the top
2. configure subscription settings:
   - **email**: any email address (doesn't need to be real)
   - **trial period**: e.g., `10s`, `1m`, `5m`
   - **billing period**: e.g., `15s`, `1m`, `10m`
3. click **start subscription**
4. watch events appear in real-time!

### what you'll see

**left panel - control & state:**
- workflow id
- current state (trial/billing/cancelling/completed)
- trial period status
- billing cycles counter
- cancellation status

**right panel - activity log:**
- ⚙️ workflow events (started, cancelled)
- 📧 emails sent (with preview links)
- 💳 customer charges
- timestamps for everything

### viewing emails

1. each email event has a "view email" button
2. click it to open the email in ethereal.email
3. or use the ethereal credentials shown at the top to log in and see all emails

### cancelling a subscription

1. click **cancel subscription** button
2. watch the cancellation process:
   - cancellation signal sent
   - current billing cycle completes
   - cancellation email sent
   - workflow completes

## example workflow timeline

```
00:00 - workflow started
00:01 - welcome email sent
00:10 - trial period ends
00:11 - customer charged $100
00:12 - invoice email sent (cycle 1)
00:27 - customer charged $100
00:28 - invoice email sent (cycle 2)
00:35 - [user clicks cancel]
00:36 - cancellation signal received
00:37 - cancellation email sent
00:38 - workflow completed
```

## understanding temporal concepts

### workflows (src/workflows.ts)
- long-running subscription lifecycle
- survives worker restarts
- deterministic execution
- handles signals for cancellation

### activities (src/activities.ts)
- **chargecustomer**: payment processing
- **sendemail**: actual email via ethereal
- both log events to event store
- automatic retries on failure

### signals
- **cancelsubscription**: external event to stop billing
- sent from frontend via api
- workflow responds immediately

### event history
- every action is recorded
- complete audit trail
- enables replay and debugging
- visible in both frontend and temporal web ui

## ports

- **3001**: frontend dashboard
- **3002**: api server
- **5434**: postgresql
- **7233**: temporal server
- **8088**: temporal web ui

## troubleshooting

### emails not sending

check worker terminal for ethereal credentials. if worker restarted, new credentials are generated.

### frontend not updating

1. check api server is running on port 3002
2. check browser console for errors
3. verify worker is running

### workflow not starting

1. ensure temporal is running: `docker-compose ps`
2. check worker is connected
3. verify api server can connect to temporal

## advanced usage

### custom durations

use temporal duration format:
- seconds: `10s`, `30s`
- minutes: `1m`, `5m`, `30m`
- hours: `1h`, `2h`
- days: `1d`, `7d`
- combinations: `1h30m`, `2d12h`

### testing worker resilience

1. start a subscription with long periods (trial: `30s`, billing: `1m`)
2. wait for first billing cycle
3. kill worker (ctrl+c in terminal 1)
4. wait 10 seconds
5. restart worker: `npm run start:worker`
6. observe: workflow resumes exactly where it stopped!
7. frontend continues showing updates

### viewing in temporal web ui

1. open http://localhost:8088
2. find your workflow by id (shown in dashboard)
3. see complete event history
4. compare with frontend timeline

## what you're learning

- **distributed workflow orchestration**: temporal manages state across services
- **durable execution**: workflows survive failures
- **event sourcing**: complete history of all events
- **real-time updates**: server-sent events for live data
- **activity patterns**: separating business logic from orchestration
- **signal handling**: external events modifying workflow state
- **retry policies**: automatic failure recovery
- **email integration**: nodemailer with test smtp

## cleanup

stop all services:
```bash
# stop frontend (ctrl+c in terminal 3)
# stop api server (ctrl+c in terminal 2)
# stop worker (ctrl+c in terminal 1)

# stop docker
docker-compose down -v
```

## next steps

try modifying:
1. add more subscription tiers (basic, premium, enterprise)
2. implement upgrade/downgrade signals
3. add queries to get billing history
4. create a payment failure scenario
5. add webhook notifications
6. implement prorated billing
7. add subscription analytics dashboard

## email service details

**ethereal.email** is a fake smtp service for testing:
- creates temporary email accounts
- stores emails for 24 hours
- provides web interface to view emails
- perfect for development and testing
- no real emails sent
- no configuration needed

each time the worker starts, a new ethereal account is created. credentials are shown in the worker terminal and in the frontend dashboard.
