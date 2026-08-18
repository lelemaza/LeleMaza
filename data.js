/* =====================================================================
   DATA.JS  —  Yahi file edit karo naya video/series publish karne ke liye
   Ise kabhi bhi index.html, style.css, ya app.js touch karne ki zaroorat
   nahi padegi. Bas neeche VIDEOS array me entry add/remove/edit karo.
   ===================================================================== */

// ---- Website ka naam (navbar me yahi dikhega) ----
const SITE = {
  name: "LeleMaza",
};

/*
  Har video ke liye ek object banao is format me:

  {
    id: "unique-id",          // HAR video ke liye alag / unique honi chahiye (spaces mat use karo)
    title: "Video ka title",  // jo video page pe aur card pe dikhega
    thumbnail: "https://...", // thumbnail image ka direct link
    videoUrl: "https://...",  // video ka link — YouTube link YA direct .mp4 link, dono chalenge
    series: "Series ka naam", // is video ka "main name" — isi naam se sare parts group honge
    part: 1                   // is series ka konsa part hai (1, 2, 3...) — order ke liye
  }

  - Agar video kisi series ka part nahi hai (standalone video hai), to bhi
    "series" me uska naam de do aur "part: 1" rakho — wo apne aap uski
    khud ki "series" ban jayegi.
  - Naya video add karna ho: neeche array me { } ka ek naya block copy-paste
    karke apni details daal do, comma laga ke.
  - Video hatana ho: uska pura { ... } block delete kar do.
*/

const VIDEOS = [
  //  {
  //   id: "",
  //   title: "",
  //   thumbnail: "",
  //   videoUrl:
  //     "",
  //   series: "",
  //   part: 1,
  // },
   {
    id: "shilajituplabdhhai1",
    title: "Shilajit Uplabdh Hai Episode 1",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Shilajit-Uplabdh-Hai-Episode-1-by-Primeshots-2022.webp",
    videoUrl:
      "https://cdn.azmaal.com/PrimeShots/Shilajit%20Uplabdh%20Hai/Shilajit%20Uplabdh%20Hai%20Episode%201.mp4",
    series: "Shilajit Uplabdh Hai",
    part: 1,
   },
   {
    id: "shilajituplabdhhai2",
    title: "Shilajit Uplabdh Hai Episode 2",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Shilajit-Uplabdh-Hai-Episode-2-by-Primeshots-2022.webp",
    videoUrl:
      "https://cdn.azmaal.com/PrimeShots/Shilajit%20Uplabdh%20Hai/Shilajit%20Uplabdh%20Hai%20Episode%202.mp4",
    series: "Shilajit Uplabdh Hai",
    part: 2,
   },
   {
    id: "lsd1",
    title: "LSD Episode 1",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/LSD-Episode-1-by-Primeshots-2022.webp",
    videoUrl:
      "https://cdn.azmaal.com/PrimeShots/LSD/LSD%20Episode%201.mp4",
    series: "LSD",
    part: 1,
  },
  {
    id: "lsd2",
    title: "LSD Episode 2",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/LSD-Episode-2-by-Primeshots-2022.webp",
    videoUrl:
      "https://cdn.azmaal.com/PrimeShots/LSD/LSD%20Episode%202.mp4",
    series: "LSD",
    part: 2,
  },
   {
    id: "lsd3",
    title: "LSD Episode 3",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/LSD-Episode-3-by-Primeshots-2022.webp",
    videoUrl:
      "https://cdn.azmaal.com/PrimeShots/LSD/LSD%20Episode%203.mp4",
    series: "LSD",
    part: 3,
  },
   {
    id: "lsd4",
    title: "LSD Episode 4",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/LSD-Episode-4-by-Primeshots-2022.webp",
    videoUrl:
      "https://cdn.azmaal.com/PrimeShots/LSD/LSD%20Episode%204.mp4",
    series: "LSD",
    part: 4,
  },
  {
    id: "besharam1",
    title: "Besharam Episode 1",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Besharam-Episode-1-by-Ullu.webp",
    videoUrl:
      "https://cdn.azmaal.com/ULLU/Besharam/Besharam%20Episode%201.mp4",
    series: "Besharam (ULLU)",
    part: 1,
  },
  {
    id: "besharam2",
    title: "Besharam Episode 2",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Besharam-Episode-2-by-Ullu.webp",
    videoUrl:
      "https://cdn.azmaal.com/ULLU/Besharam/Besharam%20Episode%202.mp4",
    series: "Besharam (ULLU)",
    part: 2,
  },
  {
    id: "besharam3",
    title: "Besharam Episode 3",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Besharam-Episode-3-by-Ullu.webp",
    videoUrl:
      "https://cdn.azmaal.com/ULLU/Besharam/Besharam%20Episode%203.mp4",
    series: "Besharam (ULLU)",
    part: 3,
  },
  {
    id: "besharam4",
    title: "Besharam Episode 4",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Besharam-Episode-4-by-Ullu.webp",
    videoUrl:
      "https://cdn.azmaal.com/ULLU/Besharam/Besharam%20Episode%204.mp4",
    series: "Besharam (ULLU)",
    part: 4,
  },
  {
    id: "besharam5",
    title: "Besharam Episode 5",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Besharam-Episode-5-by-Ullu-1.webp",
    videoUrl:
      "https://cdn.azmaal.com/ULLU/Besharam/Besharam%20Episode%205.mp4",
    series: "Besharam (ULLU)",
    part: 5,
  },
  {
    id: "besharam6",
    title: "Besharam Episode 6",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Besharam-Episode-6-by-Ullu.webp",
    videoUrl: "https://cdn.azmaal.com/ULLU/Besharam/Besharam%20Episode%206.mp4",
    series: "Besharam (ULLU)",
    part: 6,
  },
   {
    id: "besharam7",
    title: "Besharam Episode 7",
    thumbnail: "https://hotmaza.net/wp-content/uploads/2026/03/Besharam-Episode-7-by-Ullu.webp",
    videoUrl: "https://cdn.azmaal.com/ULLU/Besharam/Besharam%20Episode%207.mp4",
    series: "Besharam (ULLU)",
    part: 7,
  },
];
