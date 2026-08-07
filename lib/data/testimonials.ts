export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  source?: string;
};

/** Real quotes from LinkedIn / public recommendations — replace or extend with client Upwork reviews when you have permission. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "From day one, you stood out. Not just for your technical strength, but for your integrity, ownership, and the standards you set for the team. You played an important role in shaping both the team and the products we built.",
    name: "Hasnain Raza Jaffery",
    role: "Leadership · Stackup Solutions",
    source: "LinkedIn",
  },
  {
    quote:
      "Looking back, the time we worked together was one of the most important phases of my growth. You set high standards, pushed us to improve, and led by example.",
    name: "Former teammate",
    role: "Engineering · Stackup Solutions",
    source: "LinkedIn",
  },
  {
    quote:
      "A huge part of my own growth as an engineer came from working alongside you. From React Native and full-stack development to problem-solving and ownership, I learned lessons that still help me every day.",
    name: "Engineer mentored",
    role: "Former direct report",
    source: "LinkedIn",
  },
];
