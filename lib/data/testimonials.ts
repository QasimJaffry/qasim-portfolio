export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  source?: string;
};

/** Real quotes from LinkedIn recommendations. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "From day one, you stood out. Not just for your technical strength, but for your integrity, ownership, and the standards you set for the team. You played an important role in shaping both the team and the products we built.",
    name: "Hasnain Raza Jaffery",
    role: "Leadership, StackUp Solutions",
    source: "LinkedIn",
  },
];
