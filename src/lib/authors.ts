export interface Author {
  name: string;
  slug: string;
  avatar: string;
  role: string;
  bio: string;
  links: {
    website?: string;
  };
}

export const authors: Record<string, Author> = {
  "nic-demore": {
    name: "Nic DeMore",
    slug: "nic-demore",
    avatar: "/images/nic-demore.jpg",
    role: "Course Creator",
    bio: "Design enthusiast and founder of FOA Course. Engineering background, architecture obsessed. Building in public as part of the GAS Studio 2026 12×12 challenge.",
    links: {
      website: "https://goodatscale.studio",
    },
  },
};

export function getAuthor(slug: string): Author | undefined {
  return authors[slug];
}
