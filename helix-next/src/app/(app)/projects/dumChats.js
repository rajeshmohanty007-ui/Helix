export const dummyChats = {
  channels: [
    {
      id: 1,
      name: "General",
      unread: 2,
    },
    {
      id: 2,
      name: "Backend",
      unread: 0,
    },
    {
      id: 3,
      name: "UI/UX",
      unread: 5,
    },
  ],

  dms: [
    {
      id: 1,
      name: "Rajesh",
      online: true,
    },
    {
      id: 2,
      name: "Aman",
      online: true,
    },
    {
      id: 3,
      name: "Sarah",
      online: false,
    },
  ],

  activeChat: {
    id: 1,
    type: "channel",
    name: "General",

    messages: [
      {
        id: 1,
        sender: "Rajesh",
        text: "Authentication module is finished.",
        time: "2m",
      },
      {
        id: 2,
        sender: "Aman",
        text: "Starting Socket.IO integration.",
        time: "5m",
      },
      {
        id: 3,
        sender: "Sarah",
        text: "Waiting for database approval.",
        time: "10m",
      },
      {
        id: 4,
        sender: "John",
        text: "UI mockups are ready.",
        time: "12m",
      },
    ],
  },
};