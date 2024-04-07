export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Shih-Yang-Young Github Issue Blog",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Browse",
      href: "/",
    },
    {
      label: "Management",
      href: "/management",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Browse",
      href: "/",
    },
    {
      label: "Management",
      href: "/management",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/shih-yang-young/issue-blog",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
  login: {
    label: "login",
    href: "/login",
  },
};
