# Helix | API Reference & Architecture Guide

Helix uses Next.js API Routes (App Router) to perform CRUD operations against a PostgreSQL database via Prisma, managed with Redis caching, Socket.io WebSockets, and Google Gemini AI task generation. 

---

## 🏛 General API Architecture

- **Session Handling**: Routes check user sessions using `getServerSession(authOptions)` from `next-auth`. If unauthorized, they return a `401 Unauthorized` response.
- **Data Caching**: Real-time communication routes (channels and channel messages) use a Redis caching layer to offload the database. Cache values are invalidated upon mutative requests (e.g., adding messages or channel topics).
- **Service Handlers**: To keep routes modular, major operations (like login, registration, task creation, update logging, and objective creation) delegate logic to dedicated handlers in `src/handlers`.

---

## 📖 API Endpoints Reference

### 🔐 Authentication & Session

#### 1. NextAuth Endpoint
- **API Path**: [`/api/auth/[...nextauth]`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/auth/%5B...nextauth%5D/route.js)
- **HTTP Methods**: `GET` | `POST`
- **Imports/Exports**: Exports `GET` and `POST` handlers initialized from `NextAuth(authOptions)` using [`authOptions`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/lib/auth.js).
- **Description**: Handles sign-in, sign-out, session tracking, and user token callbacks.
- **Client Callers**: Called implicitly by `next-auth/react` hooks (`useSession`, `signIn`, `signOut`) in [`layout.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/layout.js) and other protected views.

#### 2. User Sign In
- **API Path**: [`/api/auth/login`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/auth/login/route.js)
- **HTTP Method**: `POST`
- **Imports/Exports**: Imports [`loginHandler`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/handlers/auth/loginHandler.js).
- **Description**: Authenticates user credentials (username/email and password).
- **Client Callers**: Triggered inside [`LoginForm.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/landing/LoginForm.jsx).

#### 3. User Registration
- **API Path**: [`/api/auth/register`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/auth/register/route.js)
- **HTTP Method**: `POST`
- **Imports/Exports**: Imports [`registerHandler`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/handlers/auth/registerHandler.js).
- **Description**: Validates email format, checks for duplicates, hashes the password using bcrypt, and provisions a new `User` database record.
- **Client Callers**: Triggered inside [`RegisterForm.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/landing/RegisterForm.jsx).

---

### 📊 Dashboard & Metrics

#### 4. Dashboard Feed
- **API Path**: [`/api/dashboard`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/dashboard/route.js)
- **HTTP Method**: `GET`
- **Imports/Exports**: Imports `prisma`, `recalculateProductivityScore`.
- **Description**: 
  - Tracks user streaks by comparing `lastActive` midnight timestamps. If a new day has started, the streak is incremented; if a day was skipped, the streak is reset to 1.
  - Aggregates quick statistics: active/completed project counts, uncompleted task counts, and today's task completion progress percentage.
  - Returns the task with the nearest deadline, the top 3 upcoming calendar events, and the 10 most recent team activity logs.
- **Client Callers**: Called inside [`dashboard/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/dashboard/page.js).

---

### 📂 Workspace & Projects

#### 5. Project List and Creation
- **API Path**: [`/api/projects`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/projects/route.js)
- **HTTP Methods**: `GET` | `POST`
- **Imports/Exports**: Local implementation.
- **Description**:
  - `GET`: Returns all projects where the authenticated user is either the creator or a member, including connected `members`, `admins`, and `managers`.
  - `POST`: Creates a new project with a default `#general` channel. Connects added teammates and marks the creator as an administrator.
- **Client Callers**: Called in [`projects/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/projects/page.js).

#### 6. Project Details and Member Roles
- **API Path**: [`/api/projects/[id]`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/projects/%5Bid%5D/route.js)
- **HTTP Methods**: `GET` | `PATCH` | `DELETE`
- **Imports/Exports**: Local implementation.
- **Description**:
  - `GET`: Returns details of a specific project (members, admins, managers) after verifying user membership.
  - `PATCH`: Modifies general project settings (name, description, status) OR performs collaborator operations (adding a user by username, disconnecting a user by ID, changing collaborator roles between `admin`, `manager`, and `member`).
  - `DELETE`: Permanently deletes the project. Only the project creator has delete permissions.
- **Client Callers**: Called in [`settings/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/projects/%5Bid%5D/settings/page.js) and [`AddObjectiveModal.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/projects/AddObjectiveModal.jsx).

#### 7. Project Updates Feed
- **API Path**: [`/api/projects/[id]/updates`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/projects/%5Bid%5D/updates/route.js)
- **HTTP Methods**: `GET` | `POST`
- **Imports/Exports**: Imports [`createUpdateHandler`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/handlers/create/createUpdateHandler.js).
- **Description**:
  - `GET`: Lists historical status updates (e.g. "started", "completed", "blocked") with content and author profiles for a given project.
  - `POST`: Adds a new status update and logs a corresponding project activity trigger.
- **Client Callers**: Called in [`projects/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/projects/page.js) and [`AddUpdateModal.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/projects/AddUpdateModal.jsx).

#### 8. Project Channels List
- **API Path**: [`/api/projects/[id]/channels`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/projects/%5Bid%5D/channels/route.js)
- **HTTP Methods**: `GET` | `POST`
- **Imports/Exports**: Imports `redisClient`.
- **Description**:
  - `GET`: Lists discussion topics/channels for the project (e.g., `#general`, `#bugs`). Caches results in Redis with a 1-hour expiration.
  - `POST`: Registers a new channel topic and invalidates the project channels Redis cache key.
- **Client Callers**: Called in chat sidebar layouts [`TopicsSidebar.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/chatRoom/TopicsSidebar.jsx).

#### 9. Project Objectives list
- **API Path**: [`/api/projects/[id]/objectives`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/projects/%5Bid%5D/objectives/route.js)
- **HTTP Methods**: `GET` | `POST`
- **Imports/Exports**: Imports [`createObjectiveHandler`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/handlers/create/createObjectiveHandler.js).
- **Description**:
  - `GET`: Returns all team objectives and milestones defined for a project.
  - `POST`: Creates a new objective with a default pending state.
- **Client Callers**: Called in [`projects/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/projects/page.js) and [`AddObjectiveModal.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/projects/AddObjectiveModal.jsx).

#### 10. Project Objective Management
- **API Path**: [`/api/projects/[id]/objectives/[objectiveId]`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/projects/%5Bid%5D/objectives/%5BobjectiveId%5D/route.js)
- **HTTP Methods**: `PATCH` | `DELETE`
- **Imports/Exports**: Local implementation.
- **Description**:
  - `PATCH`: Updates objective status (pending, progress, completed, blocked), deadlines, and assigned member mappings. Access is restricted to project creators and administrators.
  - `DELETE`: Removes the objective record. Access restricted to project admins.
- **Client Callers**: Called inside [`Card4.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/ui/Card4.jsx) for inline modifications.

---

### 📝 Task Tracking

#### 11. Tasks CRUD operations
- **API Path**: [`/api/tasks`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/tasks/route.js)
- **HTTP Methods**: `GET` | `POST` | `PATCH` | `DELETE`
- **Imports/Exports**: Imports [`createTaskHandler`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/handlers/create/createTaskHandler.js), `recalculateProductivityScore`.
- **Description**:
  - `GET`: Retrieves task cards for the session user. Can be filtered by a specific `list` search parameter (e.g. `College`, `Freelance`).
  - `POST`: Creates a new task with tags and subtask checklist values.
  - `PATCH`: Modifies subtask checklist completions OR general task metadata (status, details, priority, due date). Triggers a productivity score refresh.
  - `DELETE`: Clears a single task (if an `id` query parameter is provided) or purges an entire task list (if a `list` parameter is provided).
- **Client Callers**: Called in [`tasks/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/tasks/page.js) and [`calendar/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/calendar/page.js).

#### 12. Smart AI Task Generation
- **API Path**: [`/api/tasks/generate`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/tasks/generate/route.js)
- **HTTP Method**: `POST`
- **Imports/Exports**: Imports `aiCooldowns`.
- **Description**: 
  - Integrates with the Google Gemini API to analyze task titles and auto-generate structured descriptions, priority levels, duration estimates, subtasks, and relevant tags.
  - Enforces a 2-minute cooldown per user to prevent API limit issues.
- **Client Callers**: Called inside [`AddTaskModal.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/tasks/AddTaskModal.jsx).

---

### 📅 Calendar

#### 13. Event Scheduler
- **API Path**: [`/api/events`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/events/route.js)
- **HTTP Methods**: `GET` | `POST` | `PATCH` | `DELETE`
- **Imports/Exports**: Local implementation.
- **Description**:
  - `GET`: Retrieves all calendar events for the active user. Auto-updates and returns status badges ("completed", "pending", "in-progress") by comparing current time with start/end times.
  - `POST`: Registers a new event. Supports recurrence patterns (daily, weekly, monthly, yearly) and schedules repeated events automatically (daily/weekly for 2 years, monthly for 5 years, yearly for 10 years).
  - `PATCH`: Modifies scheduled event details.
  - `DELETE`: Deletes scheduled events. Supports deleting a single occurrence (`single`), all future instances (`following`), or all instances in a recurring group (`all`).
- **Client Callers**: Called in [`calendar/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/calendar/page.js) and [`dashboard/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/dashboard/page.js).

---

### 🔔 Notifications

#### 14. Notifications Feed
- **API Path**: [`/api/notifications`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/notifications/route.js)
- **HTTP Method**: `GET`
- **Imports/Exports**: Local implementation.
- **Description**:
  - Pulls upcoming task deadlines (due within 24 hours).
  - Pulls calendar events starting within 10 minutes.
  - Retrieves recent team activities from all projects the user is a member of.
  - Combines and sorts these into a unified notification feed.
- **Client Callers**: Called in [`notifications/page.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/%28app%29/notifications/page.js).

---

### 👤 Profile & Users Directory

#### 15. Active User Profile Settings
- **API Path**: [`/api/user`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/user/route.js)
- **HTTP Methods**: `GET` | `PATCH`
- **Imports/Exports**: Local implementation.
- **Description**:
  - `GET`: Returns the logged-in user profile, streak stats, and productivity scores.
  - `PATCH`: Updates username, email, and password (after current password verification).
- **Client Callers**: Called inside settings tab layouts [`Profile.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/settings/Profile.jsx).

#### 16. Global Users Directory
- **API Path**: [`/api/users`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/users/route.js)
- **HTTP Method**: `GET`
- **Imports/Exports**: Local implementation.
- **Description**: Retrieves a list of all registered users (IDs, usernames, and emails) sorted alphabetically.
- **Client Callers**: Used during project and team setup utilities.

#### 17. API Health Test
- **API Path**: [`/api/test`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/test/route.js)
- **HTTP Method**: `GET`
- **Description**: A basic endpoint checking that server routing operates. Returns `{ works: true }`.

---

### 💬 Real-Time Communications & Messaging

#### 18. Channel Message Stream
- **API Path**: [`/api/channels/[channelId]/messages`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/app/api/channels/%5BchannelId%5D/messages/route.js)
- **HTTP Method**: `GET`
- **Imports/Exports**: Imports `redisClient`.
- **Description**: Fetches message logs for a channel topic, parse JSON reaction details, and caches the logs in Redis.
- **Client Callers**: Called inside the active chat window component [`ChatArea.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/chatRoom/ChatArea.jsx).

#### 19. WebSocket Gateway (Socket.io)
- **API Path**: `/api/socket` (Pages Router endpoint: [`src/pages/api/socket.js`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/pages/api/socket.js))
- **Protocol**: WebSocket (Socket.io Server)
- **Imports/Exports**: Exports config enabling custom routing streams and disabling the default Next.js bodyParser.
- **Description**:
  - Sets up client connection listeners and room management (`join-room`, `leave-room`).
  - Implements real-time events:
    - `send-message`: Creates a message in the DB, deletes the Redis cache, and emits the message to the room.
    - `typing`: Relays active typing state indicator to other users in the channel.
    - `add-reaction`: Toggles emojis, saves stringified JSON arrays in SQLite/Postgres, deletes Redis caches, and broadcasts updates.
    - `update-message-flags`: Toggles system highlights (`pinned`, `important`, `decision`), updates the DB, clears Redis, and broadcasts state changes.
- **Client Callers**: Connected and emitted inside [`ChatArea.jsx`](file:///c:/Users/rajes/Baby%20Moniter/web%20dev/Helix/Helix-Next/src/components/chatRoom/ChatArea.jsx).
