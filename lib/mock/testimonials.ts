// TEMPORARY placeholder testimonials for local development/preview only.
//
// These are NOT real customer reviews and must never ship to production as
// if they were. Per the project's existing rule (see Reviews/Google Reviews
// sections of the original brief): never fabricate or present invented text
// as a real customer's words. Before launch, replace this file's usage in
// GoogleReviews.tsx with a live call to getApprovedReviews() (already built
// in lib/services/reviews.ts), sourced from either:
//   1. Customers submitting reviews through the site (moderated in
//      /admin/reviews), or
//   2. Real, attributed Google Reviews pulled via the Google Places API and
//      clearly labeled as such — never rewritten in your own voice.
export interface Testimonial {
  id: string;
  name: string;
  avatarTag: string; // drives a placeholder avatar photo, see placeholderFoodImage-style helper below
  rating: number;
  review: string;
  branch: string;
  timeAgo: string;
  verified: boolean;
}

export const DEV_PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Rakib Hossain",
    avatarTag: "portrait young man",
    rating: 5,
    review:
      "The BBQ Dynamite Burger is unreal — smoky, juicy, and the special sauce ties it all together. Delivery was fast too.",
    branch: "Staff Quarter",
    timeAgo: "2 days ago",
    verified: true,
  },
  {
    id: "t2",
    name: "Nusrat Jahan",
    avatarTag: "portrait young woman",
    rating: 5,
    review:
      "Ordered the crispy wings for a family night in — every piece was hot, crunchy, and perfectly seasoned. Will order again.",
    branch: "Konapara",
    timeAgo: "5 days ago",
    verified: true,
  },
  {
    id: "t3",
    name: "Tanvir Ahmed",
    avatarTag: "portrait man smiling",
    rating: 4,
    review:
      "Big Jack Burger lives up to the name. Huge portion, great value, and the staff at Shonir-Akhra were super friendly.",
    branch: "Shonir-Akhra",
    timeAgo: "1 week ago",
    verified: true,
  },
  {
    id: "t4",
    name: "Farzana Akter",
    avatarTag: "portrait woman",
    rating: 5,
    review:
      "Best naga drums in Dhaka, hands down. Spicy exactly the way it should be, not just hot for the sake of it.",
    branch: "Staff Quarter",
    timeAgo: "2 weeks ago",
    verified: true,
  },
  {
    id: "t5",
    name: "Imran Kabir",
    avatarTag: "portrait man casual",
    rating: 5,
    review:
      "The Oreo shake alone is worth the trip. Thick, cold, and not overly sweet. Paired it with the crispy chicken blast — perfect combo.",
    branch: "Konapara",
    timeAgo: "3 weeks ago",
    verified: true,
  },
  {
    id: "t6",
    name: "Sadia Islam",
    avatarTag: "portrait young woman smiling",
    rating: 5,
    review:
      "Consistently good every time I order. The Chicken Katsu burger is my go-to now — crispy, cheesy, and fresh.",
    branch: "Shonir-Akhra",
    timeAgo: "1 month ago",
    verified: true,
  },
];
