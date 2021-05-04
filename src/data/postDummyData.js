export const dummyPosts = [
  {
    _id: "foo",
    owner: [
      {
        $oid: "5f8537bb48bb5c021b8f68cd",
      },
    ],
    followers: [],
    votes: 100,
    tags: [],
    title: "Bottom Right",
    type: "Topic",
    public: true,
    anon: false,
    body: "This is sample post 1",
    poll: [],
    qa: [],
    tasks: [],
    comments: [],
    createdAt: {
      $date: {
        $numberLong: "1602598493431",
      },
    },
    updatedAt: {
      $date: {
        $numberLong: "1603216450342",
      },
    },
    __v: {
      $numberInt: "32",
    },
    edited: true,
  },
  {
    _id: "5f85b65d48bb5c021b8f68a8",
    owner: [
      {
        $oid: "5f8537bb48bb5c021b8f68cd",
      },
    ],
    followers: [],
    votes: 30,
    tags: [],
    title: "Right Child",
    type: "Topic",
    public: true,
    anon: false,
    body: "This is sample post 1",
    poll: [],
    qa: [],
    tasks: [],
    comments: [],
    createdAt: {
      $date: {
        $numberLong: "1602598493431",
      },
    },
    updatedAt: {
      $date: {
        $numberLong: "1603216450342",
      },
    },
    __v: {
      $numberInt: "32",
    },
    edited: true,
  },
  {
    _id: "5f85b65d48bb5c021b8f68a2",
    owner: [
      {
        $oid: "5f8537bb48bb5c021b8f68cd",
      },
    ],
    followers: [],
    votes: 200,
    tags: [],
    title: "Right Parent",
    type: "Topic",
    public: true,
    anon: false,
    body: "This is sample post 1",
    poll: [],
    qa: [],
    tasks: [],
    comments: [],
    createdAt: {
      $date: {
        $numberLong: "1602598493431",
      },
    },
    updatedAt: {
      $date: {
        $numberLong: "1603216450342",
      },
    },
    __v: {
      $numberInt: "32",
    },
    edited: true,
  },
  {
    _id: "5f85b65d48bb5c021b8f68d8",
    owner: [
      {
        $oid: "5f8537bb48bb5c021b8f68cd",
      },
    ],
    followers: [],
    votes: 10,
    tags: [],
    title: "Main Parent",
    type: "Topic",
    public: true,
    anon: false,
    body: "This is sample post 1",
    poll: [],
    qa: [],
    tasks: [],
    comments: [],
    createdAt: {
      $date: {
        $numberLong: "1602598493431",
      },
    },
    updatedAt: {
      $date: {
        $numberLong: "1603216450342",
      },
    },
    __v: {
      $numberInt: "32",
    },
    edited: true,
  },
  {
    _id: "5f85b65d48bb5c021b8f68d6",
    owner: [
      {
        $oid: "5f8537bb48bb5c021b8f68cd",
      },
    ],
    followers: [],
    votes: 35,
    tags: [],
    title: "Main Right Child",
    type: "Topic",
    public: true,
    anon: false,
    body: "This is sample post 2",
    poll: [],
    qa: [],
    tasks: [],
    comments: [],
    createdAt: {
      $date: {
        $numberLong: "1602598493431",
      },
    },
    updatedAt: {
      $date: {
        $numberLong: "1603216450342",
      },
    },
    __v: {
      $numberInt: "32",
    },
    edited: true,
  },

  {
    _id: "5f85b65d48bb5c021b8f68d9",
    owner: [
      {
        $oid: "5f8537bb48bb5c021b8f68cd",
      },
    ],
    followers: [],
    votes: 89,
    tags: [],
    title: "Main Left Child",
    type: "Idea",
    public: true,
    anon: false,
    body: "This is sample post 3",
    poll: [],
    qa: [],
    tasks: [],
    comments: [],
    createdAt: {
      $date: {
        $numberLong: "1602598493431",
      },
    },
    updatedAt: {
      $date: {
        $numberLong: "1603216450342",
      },
    },
    __v: {
      $numberInt: "32",
    },
    edited: true,
  },

  {
    _id: "5f85b65d48bb5c021b8f68d2",
    owner: [
      {
        $oid: "5f8537bb48bb5c021b8f68cd",
      },
    ],
    followers: [],
    votes: 129,
    tags: [],
    title: "Main Leaf 2",
    type: "Topic",
    public: true,
    anon: false,
    body: "This is sample post 3",
    poll: [],
    qa: [],
    tasks: [],
    comments: [],
    createdAt: {
      $date: {
        $numberLong: "1602598493431",
      },
    },
    updatedAt: {
      $date: {
        $numberLong: "1603216450342",
      },
    },
    __v: {
      $numberInt: "32",
    },
    edited: true,
  },

  {
    _id: "5f85b65d48bb5c021b8f68d3",
    owner: [
      {
        $oid: "5f8537bb48bb5c021b8f68cd",
      },
    ],
    followers: [],
    votes: 14,
    tags: [],
    title: "Main Leaf 1",
    type: "Idea",
    public: true,
    anon: false,
    body: "This is sample post 3",
    poll: [],
    qa: [],
    tasks: [],
    comments: [],
    createdAt: {
      $date: {
        $numberLong: "1602598493431",
      },
    },
    updatedAt: {
      $date: {
        $numberLong: "1603216450342",
      },
    },
    __v: {
      $numberInt: "32",
    },
    edited: true,
  },
];

export const dummyRelations = [
  {
    _id: {
      $oid: "5f85c73748bb5c021b8f68e7",
    },
    post2: "5f85b65d48bb5c021b8f68a8",
    type: "parent-child",
    post1: "5f85b65d48bb5c021b8f68a2",
    owner: {
      $oid: "5f85bde948bb5c021b8f68e0",
    },
    __v: {
      $numberInt: "0",
    },
  },

  {
    _id: {
      $oid: "5f85c73748bb5c021b8f68e7",
    },
    post2: "5f85b65d48bb5c021b8f68d6",
    type: "parent-child",
    post1: "5f85b65d48bb5c021b8f68d8",
    owner: {
      $oid: "5f85bde948bb5c021b8f68e0",
    },
    __v: {
      $numberInt: "0",
    },
  },

  {
    _id: {
      $oid: "5f85c73748bb5c021b8f68e",
    },
    post2: "5f85b65d48bb5c021b8f68d9",
    type: "parent-child",
    post1: "5f85b65d48bb5c021b8f68d8",
    owner: {
      $oid: "5f85bde948bb5c021b8f68e0",
    },
    __v: {
      $numberInt: "0",
    },
  },

  {
    _id: {
      $oid: "5f85c73748bb5c021b8f68e",
    },
    post2: "5f85b65d48bb5c021b8f68d3",
    type: "parent-child",
    post1: "5f85b65d48bb5c021b8f68d9",
    owner: {
      $oid: "5f85bde948bb5c021b8f68e0",
    },
    __v: {
      $numberInt: "0",
    },
  },

  {
    _id: {
      $oid: "5f85c73748bb5c021b8f68e",
    },
    post2: "5f85b65d48bb5c021b8f68d2",
    type: "parent-child",
    post1: "5f85b65d48bb5c021b8f68d9",
    owner: {
      $oid: "5f85bde948bb5c021b8f68e0",
    },
    __v: {
      $numberInt: "0",
    },
  },
];
