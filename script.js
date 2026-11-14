
"use strict";

// ========================================
// ZES HOOD CENTRAL - CONFIGURATION
// ========================================

const CONFIG = {
  roblox: "https://www.roblox.com/games/116359755332687/Des-Hood",
  discord: "https://discord.gg/gxAMa2vgG",
  shopDiscord: "https://discord.gg/8eWqQ7rz",
  leaderboardDiscord: "https://discord.gg/t3Xt32cPu"
};

// ========================================
// LEADERBOARD DATA
// ========================================

// Example data until real Roblox stats are connected.

const players = [
  { name: "DemoPlayer01", wins: 245, kills: 1890, streak: 18 },
  { name: "DemoPlayer02", wins: 210, kills: 2210, streak: 12 },
  { name: "DemoPlayer03", wins: 189, kills: 1540, streak: 24 },
  { name: "DemoPlayer04", wins: 175, kills: 1670, streak: 9 },
  { name: "DemoPlayer05", wins: 143, kills: 1290, streak: 15 },
  { name: "DemoPlayer06", wins: 120, kills: 1120, streak: 7 }
];

// ========================================
// STAFF RANKS
// ========================================

const ranks = [
  {
    id: "founder",
    title: "Founder",
    color: "#f5c65a",
    icon: "♛"
  },
  {
    id: "coowner",
    title: "Co-Owner",
    color: "#7bd4ff",
    icon: "◆"
  },
  {
    id: "management",
    title: "Management",
    color: "#bd85ff",
    icon: "✦"
  },
  {
    id: "overseer",
    title: "Overseer",
    color: "#ef90f6",
    icon: "◈"
  },
  {
    id: "headmanager",
    title: "Head Manager",
    color: "#ffad72",
    icon: "★"
  },
  {
    id: "manager",
    title: "Managers",
    color: "#ff8dc1",
    icon: "✧"
  },
  {
    id: "hr",
    title: "HRs",
    color: "#ff906b",
    icon: "✹"
  },
  {
    id: "admin",
    title: "Administrators",
    color: "#72bcff",
    icon: "⬡"
  },
  {
    id: "mod",
    title: "In-Game Mods",
    color: "#74e6b5",
    icon: "⚔"
  }
];

// ========================================
// STAFF MEMBERS
// ========================================

const staff = [
  {
    name: "w1r",
    rank: "founder",
    initials: "W",
    subtitle: "Founder of Zes Hood"
  },
  {
    name: "summer2008",
    rank: "coowner",
    initials: "S",
    subtitle: "Co-Owner of Zes Hood"
  },
  {
    name: "z",
    rank: "management",
    initials: "Z",
    subtitle: "Management team"
  },
  {
    name: "Zephyros",
    rank: "overseer",
    initials: "ZP",
    subtitle: "Overseer"
  },
  {
    name: "richoffsalah",
    rank: "headmanager",
    initials: "R",
    subtitle: "Head Manager"
  },
  {
    name: "ily risky",
    rank: "manager",
    initials: "IR",
    subtitle: "Manager"
  },
  {
    name: "saintsimo",
    rank: "manager",
    initials: "SS",
    subtitle: "Manager"
  }
];

// ========================================
// HELPERS
// ========================================

const $ = id => document.getElementById(id);

let toastTimer;

// ========================================
// NOTIFICATIONS
// ========================================

function toast(message) {
  const element = $("toast");

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 3500);
}

// ========================================
// PAGE NAVIGATION
// ========================================

function navigate(pageId, updateHash = true) {
  const page = $(pageId);

  if (!page || !page.classList.contains("page")) {
    return;
  }

  document.querySelectorAll(".page").forEach(section => {
    section.classList.remove("active");
  });

  page.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.page === pageId
    );
  });

  $("navigation").classList.remove("open");

  $("menuToggle").setAttribute(
    "aria-expanded",
    "false"
  );

  if (
    updateHash &&
    location.hash !== "#" + pageId
  ) {
    location.hash = pageId;
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ========================================
// COMMUNITY LINKS
// ========================================

function openCommunity(type) {
  const url = CONFIG[type];

  if (!url) {
    toast("This community link hasn't been configured yet.");
    return;
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:") {
      throw new Error("Invalid link");
    }

    window.open(
      parsed.href,
      "_blank",
      "noopener,noreferrer"
    );
  } catch {
    toast("Please configure a valid HTTPS link.");
  }
}

// ========================================
// LEADERBOARD SYSTEM
// ========================================

function renderLeaderboard() {
  const search = $("playerSearch")
    .value
    .toLowerCase()
    .trim();

  const sort = $("sortPlayers").value;

  const results = players
    .filter(player =>
      player.name.toLowerCase().includes(search)
    )
    .sort((a, b) => b[sort] - a[sort]);

  const body = $("leaderboardBody");

  body.replaceChildren();

  if (!results.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.textContent = "No players found.";

    row.appendChild(cell);
    body.appendChild(row);

    return;
  }

  results.forEach((player, index) => {
    const row = document.createElement("tr");

    const values = [
      "#" + (index + 1),
      player.name,
      player.wins.toLocaleString(),
      player.kills.toLocaleString(),
      player.streak
    ];

    values.forEach((value, column) => {
      const cell = document.createElement("td");

      cell.textContent = value;

      if (column === 0) {
        cell.className = "rank-cell";
      }

      if (column === 1) {
        cell.className = "player-cell";
      }

      row.appendChild(cell);
    });

    body.appendChild(row);
  });
}

// ========================================
// STAFF DIRECTORY
// ========================================

function renderStaff() {
  const search = $("staffSearch")
    .value
    .toLowerCase()
    .trim();

  const filter = $("staffFilter").value;

  const grid = $("staffGrid");

  grid.replaceChildren();

  let displayed = 0;

  ranks.forEach(rank => {
    if (
      filter !== "all" &&
      filter !== rank.id
    ) {
      return;
    }

    const members = staff.filter(member =>
      member.rank === rank.id &&
      member.name.toLowerCase().includes(search)
    );

    const isFutureRank = [
      "hr",
      "admin",
      "mod"
    ].includes(rank.id);

    if (
      !members.length &&
      (
        search ||
        (filter === "all" && !isFutureRank)
      )
    ) {
      return;
    }

    const section = document.createElement("section");

    section.className = "staff-section";

    section.style.setProperty(
      "--rank-color",
      rank.color
    );

    // Rank heading

    const header = document.createElement("div");

    header.className = "staff-section-header";

    const heading = document.createElement("h2");

    heading.textContent =
      rank.icon + "  " + rank.title;

    heading.style.color = rank.color;

    const count = document.createElement("span");

    count.className = "count";

    count.textContent =
      members.length +
      (members.length === 1
        ? " MEMBER"
        : " MEMBERS");

    header.append(heading, count);

    section.appendChild(header);

    // Empty future rank

    if (!members.length) {
      const empty = document.createElement("div");

      empty.className = "empty-rank";

      empty.textContent =
        "Staff profiles coming soon.";

      section.appendChild(empty);
    } else {
      const cards = document.createElement("div");

      cards.className = "staff-card-grid";

      members.forEach(member => {
        const card = document.createElement("article");

        card.className = "staff-card";

        const inner = document.createElement("div");

        inner.className = "staff-card-inner";

        // Avatar

        const avatar = document.createElement("div");

        avatar.className = "staff-avatar";

        avatar.textContent = member.initials;

        avatar.setAttribute(
          "aria-label",
          "Avatar placeholder for " + member.name
        );

        // Username

        const name = document.createElement("h3");

        name.className = "staff-name";

        name.textContent = member.name;

        // Rank badge

        const badge = document.createElement("span");

        badge.className = "staff-rank";

        badge.textContent =
          rank.icon + "  " + rank.title;

        // Description

        const subtitle = document.createElement("p");

        subtitle.className = "staff-subtitle";

        subtitle.textContent = member.subtitle;

        inner.append(
          avatar,
          name,
          badge,
          subtitle
        );

        card.appendChild(inner);

        cards.appendChild(card);

        displayed++;
      });

      section.appendChild(cards);
    }

    grid.appendChild(section);
  });

  // No search results

  if (!grid.children.length) {
    const message = document.createElement("div");

    message.className = "no-results";

    message.textContent =
      "No staff members found. Try another search or rank.";

    grid.appendChild(message);
  }

  $("staffCount").textContent =
    String(displayed).padStart(2, "0");
}

// ========================================
// BACKGROUND PARTICLES
// ========================================

function createParticles() {
  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  const container = $("particles");

  for (let i = 0; i < 24; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";

    particle.style.left =
      Math.random() * 100 + "%";

    particle.style.top =
      Math.random() * 100 + "%";

    particle.style.animationDuration =
      (5 + Math.random() * 9) + "s";

    particle.style.animationDelay =
      (-Math.random() * 10) + "s";

    container.appendChild(particle);
  }
}

// ========================================
// NAVIGATION EVENTS
// ========================================

window.addEventListener("hashchange", () => {
  navigate(
    location.hash.slice(1) || "home",
    false
  );
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    navigate(link.dataset.page);
  });
});

// Mobile menu

$("menuToggle").addEventListener("click", () => {
  const isOpen = $("navigation").classList.toggle("open");

  $("menuToggle").setAttribute(
    "aria-expanded",
    String(isOpen)
  );
});

// ========================================
// BUTTON EVENTS
// ========================================

// Roblox game buttons

$("playButton").addEventListener("click", () => {
  openCommunity("roblox");
});

$("bottomPlay").addEventListener("click", () => {
  openCommunity("roblox");
});

// Main Zes Hood Discord buttons

$("discordButton").addEventListener("click", () => {
  openCommunity("discord");
});

$("heroDiscord").addEventListener("click", () => {
  openCommunity("discord");
});

$("bannerDiscord").addEventListener("click", () => {
  openCommunity("discord");
});

// Shop Discord

$("shopDiscordButton").addEventListener("click", () => {
  openCommunity("shopDiscord");
});

// Leaderboard Discord

$("leaderboardDiscordButton").addEventListener("click", () => {
  openCommunity("leaderboardDiscord");
});

// ========================================
// SEARCH & FILTER EVENTS
// ========================================

// Leaderboards

$("playerSearch").addEventListener(
  "input",
  renderLeaderboard
);

$("sortPlayers").addEventListener(
  "change",
  renderLeaderboard
);

// Staff

$("staffSearch").addEventListener(
  "input",
  renderStaff
);

$("staffFilter").addEventListener(
  "change",
  renderStaff
);

// Add rank options automatically

ranks.forEach(rank => {
  const option = document.createElement("option");

  option.value = rank.id;
  option.textContent = rank.title;

  $("staffFilter").appendChild(option);
});

// ========================================
// INITIALIZE WEBSITE
// ========================================

$("year").textContent = new Date().getFullYear();

renderLeaderboard();
renderStaff();
createParticles();

navigate(
  location.hash.slice(1) || "home",
  false
);