# Helix | Collaboration Reimagined

Helix is a modern, high-performance collaborative productivity ecosystem designed to streamline task tracking, project milestones, live chat discussions, and event scheduling for engineering and creator teams. Built on a responsive, glassmorphic dark-theme design system.

---

## 🛠 Tech Stack & Architecture

- **Core Framework**: [Next.js](https://nextjs.org) (App Router, Route Groups, API Handlers)
- **Database & ORM**: [Prisma](https://prisma.io) with SQL/PostgreSQL support
- **Real-Time Layer**: [Socket.io](https://socket.io) for live messaging and updates
- **Authentication**: [NextAuth.js](https://next-auth.js.org) for secure session handling
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with CSS Variables customization
- **UI Icons**: [Material UI Icons](https://mui.com/material-ui/material-icons/)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
Create a `.env` file in the root directory and configure:
```env
DATABASE_URL="your-database-connection-url"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database
Generate the Prisma client and push your schema adjustments:
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📖 Page-by-Page Feature Narration

Helix is divided into public onboarding pages and secure, session-locked collaboration dashboards. Here is a breakdown of every page and its functionalities:

### 1. Landing Onboarding (`/`)
The entry point of the application. It outlines the core value proposition of Helix with high-fidelity visuals.
- **Dynamic Typewriter Hero**: Uses animated headings to capture visitor attention.
- **Dashboard Mockup Preview**: Illustrates mock workspaces, chat bubbles, and task boards.
- **Embedded Modals**: Provides popups for **Register** and **Login** flows that validate credentials in real-time.

---

### 2. Interactive Product Tour (`/about`)
A custom-built tour highlighting features through interactive code simulations and step-by-step guides.
- **Bento Grid Breakdown**:
  - **Workspace switcher**: Click to preview project lists across "Helix Team", "Freelance", or "Personal".
  - **Kanban Card simulation**: Advance task cards between "To Do", "In Progress", and "Done" states on click.
  - **Topic Chat simulator**: Swap between channel messages like `#general`, `#design-assets`, and `#sprint-planning`.
  - **Agenda scheduler**: View events tied to specific days of the week.
  - **Alert center**: Click to trigger real-time toast alert mockups.
- **Three-Phase Workflow Stepper**: Guided setups outlining how to initialize organizations, categorize lists, and bridge chat spaces to milestones.

---

### 3. Overview Dashboard (`/dashboard`)
The central workspace home page for authenticated users.
- **Daily Progress Metrics**: Displays remaining tasks due and days-active streak count 🔥.
- **Productivity Score**: Auto-calculated metric measuring task completions.
- **Quick-Stats Widgets**: Grid cards showing counts of Active Projects, Completed Projects, and Tasks Due.
- **Timeline Logs**: A stream of recent actions performed across team projects.

---

### 4. Workspaces & Projects Hub (`/projects`)
The project planning cockpit featuring a resizable, three-pane dashboard:
- **Project Sidebar**: Collapsible drawer list of projects with a creation wizard.
- **Updates Board (Left)**: Logs updates categorized by statuses (`Started`, `Completed`, `Blocked`, `Updated`) with timelines.
- **Objectives Board (Middle)**: Manages specific milestones, dates, status badges, and assignees.
- **Quick Chat Room (Right)**: An embedded panel for project chat channels.
- **Split Resizing**: Interactive divider bars that let users click and drag to resize sections.

---

### 5. Smart Task Management (`/tasks`)
A feature-rich checklist workspace divided into custom category lists.
- **Task List Bar**: Add, edit, clear, or delete list tabs (e.g. `Daily`, `College`, `Freelance`).
- **Quick Tasks Pad**: A scratchpad for rapid, light-weight list item additions.
- **Task Drawer (Left)**: Scrollable task list categorized by completion state.
- **Details Panel (Right)**: Inspects task descriptions, priority tags (High, Medium, Low), deadlines, subtask check-lists, and provides editing modals.

---

### 6. Calendar & Agenda (`/calendar`)
A timeline scheduling interface.
- **Desktop Month Grid**: A clean monthly calendar showing task due dates and custom calendar events marked with color indicators.
- **Day Inspector Panel**: Highlights selected date agendas. Add new meetings or edit existing event metadata.
- **Mobile Month Strip**: Optimized horizontal single-line date selection for mobile screen sizes.

---

### 7. Real-Time Chatrooms (`/projects/[id]/chat`)
Collaborate with teammates inside the context of your projects.
- **Topic Channels Sidebar**: Lists discussion categories (e.g., `#general`, `#bugs`, `#features`).
- **Live Message Stream**: Built on WebSockets for instant message deliveries.
- **Context Sidebars**: Integrates side drawers listing active task lists and project outline states.

---

### 8. User Settings & Styling (`/settings`)
Configure app preferences.
- **Profile details**: View user info.
- **Theme Selector**: Toggle between dark and light modes.
- **Custom Font Sizes**: Scale text layout sizing (Small, Medium, Large) dynamically.
