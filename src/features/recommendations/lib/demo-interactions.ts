/* ============================================
   Pre-seeded demo users — gives the recommender a working corpus
   before any real multi-user interaction data exists.
   ============================================ */

import type { InteractionsByUser } from '@/shared/types/domain';

export const DEMO_INTERACTIONS: InteractionsByUser = {
  demo_user_1: {
    phys_newton2: { views: 5, calculations: 3, bookmarks: 1 },
    phys_kinetic_energy: { views: 3, calculations: 2, bookmarks: 1 },
    phys_work: { views: 4, calculations: 1, bookmarks: 0 },
    chem_ideal_gas: { views: 2, calculations: 1, bookmarks: 1 },
    phys_momentum: { views: 3, calculations: 2, bookmarks: 0 }
  },
  demo_user_2: {
    chem_ideal_gas: { views: 6, calculations: 4, bookmarks: 1 },
    chem_molarity: { views: 4, calculations: 3, bookmarks: 1 },
    chem_dilution: { views: 3, calculations: 2, bookmarks: 0 },
    phys_newton2: { views: 2, calculations: 1, bookmarks: 0 },
    bio_hardy_weinberg: { views: 1, calculations: 1, bookmarks: 0 }
  },
  demo_user_3: {
    bio_hardy_weinberg: { views: 5, calculations: 3, bookmarks: 1 },
    bio_population_growth: { views: 4, calculations: 2, bookmarks: 1 },
    bio_bmi: { views: 3, calculations: 2, bookmarks: 0 },
    chem_molarity: { views: 2, calculations: 1, bookmarks: 1 },
    phys_kinetic_energy: { views: 1, calculations: 0, bookmarks: 0 }
  },
  demo_user_4: {
    phys_ohm: { views: 5, calculations: 4, bookmarks: 1 },
    phys_power_electric: { views: 4, calculations: 3, bookmarks: 1 },
    phys_newton2: { views: 3, calculations: 1, bookmarks: 0 },
    chem_dilution: { views: 2, calculations: 1, bookmarks: 0 },
    phys_kinetic_energy: { views: 2, calculations: 1, bookmarks: 0 }
  },
  demo_user_5: {
    bio_michaelis_menten: { views: 4, calculations: 3, bookmarks: 1 },
    bio_hardy_weinberg: { views: 3, calculations: 2, bookmarks: 0 },
    chem_ph: { views: 4, calculations: 2, bookmarks: 1 },
    chem_molarity: { views: 2, calculations: 1, bookmarks: 0 },
    bio_population_growth: { views: 2, calculations: 1, bookmarks: 0 }
  }
};
