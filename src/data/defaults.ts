import { SalonService, TeamMember } from '../types';

export const INITIAL_SERVICES: SalonService[] = [
  {
    id: 'srv-1',
    name: 'Royal Bridal Signature Package',
    price: 'Rs. 45,000',
    description: 'Comprehensive bridal transformation including bespoke hair styling, luxury HD bridal makeup, dupatta setting, jewelry placement, and pre-event touchup kit.',
    category: 'Bridal Studio',
    createdAt: 1700000001000,
  },
  {
    id: 'srv-2',
    name: 'Engagement & Reception Glamour',
    price: 'Rs. 28,000',
    description: 'Soft-glam makeup with custom individual lashes, elegant hair updo or soft mermaid waves, and wardrobe styling consultation for your celebration night.',
    category: 'Hair & Makeup',
    createdAt: 1700000002000,
  },
  {
    id: 'srv-3',
    name: 'Bridal Radiance Skin Ritual',
    price: 'Rs. 12,500',
    description: 'Deep oxygenating facial, gentle enzymatic exfoliation, 24k gold glow mask, and relaxing neck & shoulder massage designed 3 days prior to your big day.',
    category: 'Skin & Self-Care',
    createdAt: 1700000003000,
  },
  {
    id: 'srv-4',
    name: 'Signature Hair Cut & Blowout',
    price: 'Rs. 6,500',
    description: 'Tailored consultation, clarifying wash, nourishing treatment, custom precision haircut, and bouncy volume blowout for effortless confidence.',
    category: "Women's Salon",
    createdAt: 1700000004000,
  },
  {
    id: 'srv-5',
    name: "Groom's Special Day Grooming",
    price: 'Rs. 9,500',
    description: 'Precision scissor haircut, beard sculpting, refreshing facial cleanse, brow neatening, and camera-ready subtle styling for grooms.',
    category: "Men's Grooming",
    createdAt: 1700000005000,
  },
  {
    id: 'srv-6',
    name: 'Deluxe Manicure & Pedicure Spa',
    price: 'Rs. 5,000',
    description: 'Rose petal aromatic soak, cuticles care, relaxing massage, gentle botanical scrub, and long-lasting polish for bridal hands and feet.',
    category: "Women's Salon",
    createdAt: 1700000006000,
  },
  {
    id: 'srv-7',
    name: 'Bridesmaids & Family Styling',
    price: 'Rs. 14,000',
    description: 'Festive party makeup with false lashes and celebratory hair styling for mothers, sisters, and bridal party guests.',
    category: 'Event Packages',
    createdAt: 1700000007000,
  },
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Ayesha Khan',
    role: 'Master Bridal Stylist & Creative Director',
    bio: 'Over 8 years crafting bespoke bridal hairstyles, traditional draping, and contemporary celebration looks with effortless elegance and grace.',
    createdAt: 1700000001000,
  },
  {
    id: 'tm-2',
    name: 'Zara Malik',
    role: 'Lead Makeup Artist & Glow Specialist',
    bio: 'Specializing in radiant HD and airbrush bridal makeup that accentuates natural beauty, photographs flawlessly, and lasts from dawn to dusk.',
    createdAt: 1700000002000,
  },
  {
    id: 'tm-3',
    name: 'Sana Tariq',
    role: 'Senior Aesthetician & Skincare Expert',
    bio: 'Passionate about restorative skin therapies, soothing herbal facials, and custom pre-wedding glow regimes tailored to your skin type.',
    createdAt: 1700000003000,
  },
  {
    id: 'tm-4',
    name: 'Bilal Ahmed',
    role: "Gentlemen's Master Stylist",
    bio: 'Expert in precision fade cuts, classic beard shaping, hot towel treatments, and wedding day polish for grooms and attendants.',
    createdAt: 1700000004000,
  },
];
