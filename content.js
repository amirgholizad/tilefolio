/**
 * Tilefolio content
 * =================
 * Everything visible on the page is rendered from this file. Edit, save, refresh.
 * (SEO / social preview tags live in the <head> of index.html.)
 *
 * ICONS
 *   Any free Font Awesome 6 class, e.g. "fa-solid fa-user" or "fa-brands fa-github".
 *   Browse them at https://fontawesome.com/search?o=r&m=free
 *
 * TILES
 *   Each tile either opens an overlay (give it `overlay`) or opens a link
 *   (give it `href`). `id` becomes the deep link: yoursite.com/#projects
 *   The tile's `color` is also the accent color inside its overlay.
 *
 *   `size` sets the tile's shape, measured in grid cells:
 *     "small"  1x1  icon only (the title shows as a tooltip)
 *     "medium" 2x2  the default
 *     "wide"   4x2
 *     "large"  4x4
 *   Your profile (photo, name, tagline, footer) is a 6x2 block at the start of
 *   the grid. Tiles follow in order and pack densely, so groups of four small
 *   tiles fill a medium-sized gap. On desktop and tablets the column count is
 *   picked automatically to fill the screen; phones use 6 columns.
 *   This default set is 60 cells, which fills 10x6 on desktop and 6x10 on
 *   phones with no gaps.
 *   `subtitle` appears when the tile flips (live tile) or is hovered.
 *
 * OVERLAY BLOCKS (rendered top to bottom)
 *   { type: "text",     paragraphs: ["..."], image: { src, alt, caption } }
 *   { type: "cards",    columns: 1-3, items: [{ icon, title, text, link: { label, url } }] }
 *   { type: "badges",   groups: [{ title, items: ["HTML", "CSS"] }] }
 *   { type: "projects", layout: "rows" | "grid",
 *                       items: [{ title, description, tech: ["..."], link: { label, url },
 *                                 image: "path/to/image"  OR
 *                                 video: "https://www.youtube.com/embed/VIDEO_ID" }] }
 *   Every field except `type` and `title` is optional. Use "\n" in card text
 *   or captions for a line break.
 */
window.TILEFOLIO = {
  profile: {
    name: "Your Name",
    tagline: "Designer • Developer",
    avatar: "assets/images/avatar.svg",
    // Optional round icon buttons in the profile block. This template shows social
    // links as small tiles instead (see "github", "linkedin" and "email" below).
    // socials: [
    //   { label: "GitHub", icon: "fa-brands fa-github", url: "https://github.com/your-username" },
    // ],
  },

  // Small text at the bottom of the profile block. "{year}" becomes the current year.
  footer: "© {year} Your Name",

  tiles: [
    {
      id: "about",
      title: "About",
      subtitle: "Learn more about me",
      icon: "fa-solid fa-user",
      color: "#0078d7",
      overlay: {
        title: "About Me",
        blocks: [
          {
            type: "text",
            paragraphs: [
              "Hi! I'm a designer and developer who enjoys turning ideas into fast, accessible and good-looking products.",
              "Use this space for a short introduction: what you do, what you care about, and what you're looking for next.",
              "Keep it to two or three short paragraphs. Visitors skim.",
            ],
            image: {
              src: "assets/images/about.svg",
              alt: "Placeholder photo",
              caption: "Add a photo you like\nand a short caption",
            },
          },
        ],
      },
    },
    {
      id: "projects",
      title: "Projects",
      subtitle: "Things I've built",
      icon: "fa-solid fa-briefcase",
      color: "#7b00d4",
      size: "large",
      overlay: {
        blocks: [
          {
            type: "projects",
            layout: "rows",
            items: [
              {
                title: "Featured Project",
                description:
                  "A one or two sentence summary of the problem, what you built, and the result. Rows are great for your best work.",
                tech: ["HTML", "CSS", "JavaScript"],
                image: "assets/images/project-1.svg",
                // Prefer a demo video? Replace `image` with a YouTube embed URL:
                // video: "https://www.youtube.com/embed/VIDEO_ID",
                link: { label: "View on GitHub →", url: "https://github.com/your-username/featured-project" },
              },
              {
                title: "Data Dashboard",
                description: "Interactive charts on top of a REST API, with filtering and CSV export.",
                tech: ["React", "Node.js", "PostgreSQL"],
                image: "assets/images/project-2.svg",
                link: { label: "Live demo →", url: "https://example.com" },
              },
            ],
          },
          {
            type: "projects",
            layout: "grid",
            items: [
              {
                title: "Mobile App",
                image: "assets/images/project-3.svg",
                link: { label: "View on GitHub →", url: "https://github.com/your-username/mobile-app" },
              },
              {
                title: "CLI Tool",
                image: "assets/images/project-4.svg",
                link: { label: "View on GitHub →", url: "https://github.com/your-username/cli-tool" },
              },
              {
                title: "REST API",
                image: "assets/images/project-5.svg",
                link: { label: "View on GitHub →", url: "https://github.com/your-username/rest-api" },
              },
            ],
          },
        ],
      },
    },
    {
      id: "github",
      title: "GitHub",
      icon: "fa-brands fa-github",
      color: "#444444",
      size: "small",
      href: "https://github.com/your-username",
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      icon: "fa-brands fa-linkedin-in",
      color: "#0a66c2",
      size: "small",
      href: "https://www.linkedin.com/in/your-username/",
    },
    {
      id: "email",
      title: "Email",
      icon: "fa-solid fa-envelope",
      color: "#b3261e",
      size: "small",
      href: "mailto:you@example.com",
    },
    {
      id: "cv",
      title: "CV",
      subtitle: "Download my resume",
      icon: "fa-solid fa-file-lines",
      color: "#0062ad",
      size: "small",
      href: "assets/files/resume.pdf",
    },
    {
      id: "contact",
      title: "Contact",
      subtitle: "Find me online",
      icon: "fa-solid fa-paper-plane",
      color: "#007bb0",
      overlay: {
        title: "Get In Touch",
        blocks: [
          {
            type: "cards",
            items: [
              {
                icon: "fa-solid fa-envelope",
                title: "Email",
                link: { label: "you@example.com", url: "mailto:you@example.com" },
              },
              {
                icon: "fa-brands fa-linkedin",
                title: "LinkedIn",
                link: { label: "Connect with me", url: "https://www.linkedin.com/in/your-username/" },
              },
              {
                icon: "fa-brands fa-github",
                title: "GitHub",
                link: { label: "View my code", url: "https://github.com/your-username" },
              },
            ],
          },
        ],
      },
    },
    {
      id: "experience",
      title: "Experience",
      subtitle: "My journey so far",
      icon: "fa-solid fa-star",
      color: "#4a7c10",
      overlay: {
        blocks: [
          {
            type: "cards",
            columns: 2,
            items: [
              {
                icon: "fa-solid fa-briefcase",
                title: "Professional",
                text: "Job Title, Company\n2023 – Present",
              },
              {
                icon: "fa-solid fa-graduation-cap",
                title: "Education",
                text: "Degree, School\n2019 – 2023",
              },
            ],
          },
        ],
      },
    },
    {
      id: "hobbies",
      title: "Hobbies",
      subtitle: "Things I enjoy",
      icon: "fa-solid fa-camera",
      color: "#d4006b",
      overlay: {
        blocks: [
          {
            type: "cards",
            items: [
              { icon: "fa-solid fa-mountain", title: "Hiking", text: "Exploring nature and outdoor trails" },
              { icon: "fa-solid fa-gamepad", title: "Gaming", text: "Video games and interactive stories" },
              { icon: "fa-solid fa-utensils", title: "Cooking", text: "Trying new recipes and cuisines" },
            ],
          },
        ],
      },
    },
    {
      id: "stack",
      title: "Stack",
      subtitle: "Technologies I use",
      icon: "fa-solid fa-code",
      color: "#b35900",
      overlay: {
        title: "Tech Stack",
        blocks: [
          {
            type: "badges",
            groups: [
              {
                title: "Web Development",
                items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js", "Express", "PostgreSQL"],
              },
              {
                title: "Tools & Other",
                items: ["Git", "Docker", "Linux", "Figma", "AWS", "Agile"],
              },
            ],
          },
        ],
      },
    },
    {
      id: "resources",
      title: "Resources",
      subtitle: "Useful links & things",
      icon: "fa-solid fa-link",
      color: "#006b6b",
      overlay: {
        title: "Resources & Links",
        blocks: [
          {
            type: "cards",
            items: [
              {
                icon: "fa-solid fa-pen-nib",
                title: "Blog",
                text: "Notes on things I've learned",
                link: { label: "Read →", url: "https://example.com/blog" },
              },
              {
                icon: "fa-solid fa-microphone",
                title: "Talks",
                text: "Slides and recordings",
                link: { label: "Watch →", url: "https://example.com/talks" },
              },
              {
                icon: "fa-solid fa-toolbox",
                title: "Uses",
                text: "Hardware and software I use daily",
                link: { label: "See list →", url: "https://example.com/uses" },
              },
            ],
          },
        ],
      },
    },
    {
      id: "certificates",
      title: "Certificates",
      subtitle: "Credentials & achievements",
      icon: "fa-solid fa-certificate",
      color: "#8f6f00",
      overlay: {
        title: "Certifications",
        blocks: [
          {
            type: "cards",
            columns: 1,
            items: [
              {
                icon: "fa-solid fa-certificate",
                title: "Certification Name",
                text: "Issuing Organization",
                link: { label: "View Credential →", url: "https://example.com/credential" },
              },
            ],
          },
        ],
      },
    },
  ],
};
