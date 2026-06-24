import type { MatrimonyDetails } from "../types";

type ProfileExtras = {
  photos: string[];
  matrimony: MatrimonyDetails;
};

export const PROFILE_EXTRAS: Record<string, ProfileExtras> = {
  "profile-1": {
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "I am a London-born software engineer with Gujarati roots. I value honesty, ambition, and family bonds equally. I enjoy travelling across Europe, cooking traditional dishes with a modern twist, and attending classical music concerts. I am looking for a partner who is career-driven yet family-oriented, and who appreciates both British culture and Indian traditions.",
      partnerExpectations:
        "Seeking a well-educated, kind-hearted partner aged 27–35, preferably Hindu, based in London or willing to relocate. Someone who respects family values, has a positive outlook on life, and is ready for a committed matrimonial relationship.",
      familyBackground:
        "Middle-class Gujarati family settled in North London for over 30 years. We are closely knit, celebrate festivals together, and maintain strong ties with our extended family in India.",
      fatherOccupation: "Retired Bank Manager",
      motherOccupation: "Homemaker",
      siblings: "1 younger brother (married, IT professional)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Hindi", "Gujarati"],
      community: "Gujarati Hindu",
      willingToRelocate: false,
      hobbies: ["Travel", "Cooking", "Classical Music", "Yoga"],
      memberSince: "2024-03-15",
      lastActive: "2026-06-17",
    },
  },
  "profile-2": {
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Born and raised in Manchester, I am a chartered accountant who believes in living a balanced life. Football fan, active church member, and volunteer at a local food bank. I am ready to build a home founded on faith, laughter, and mutual respect.",
      partnerExpectations:
        "Looking for a Christian woman aged 25–34 who shares my faith and values. Ideally based in the North West, with a warm personality and a desire to start a family.",
      familyBackground:
        "Traditional British Christian family from Greater Manchester. Parents married for 38 years, strong community involvement through church and local charities.",
      fatherOccupation: "Electrician (self-employed)",
      motherOccupation: "NHS Administrator",
      siblings: "1 older sister (married, teacher)",
      diet: "Non-vegetarian",
      smoking: "Non-smoker",
      drinking: "Occasionally",
      languages: ["English"],
      community: "British Christian",
      willingToRelocate: true,
      hobbies: ["Football", "Volunteering", "Hiking", "Reading"],
      memberSince: "2024-01-20",
      lastActive: "2026-06-16",
    },
  },
  "profile-3": {
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "A Birmingham-born teacher with Pakistani heritage. I am passionate about education, my faith, and spending quality time with family. I enjoy baking, reading Islamic literature, and exploring the Midlands with friends.",
      partnerExpectations:
        "Seeking a practising Muslim man, aged 26–33, with good character (akhlaaq), stable career, and family values. Must be respectful of hijab and willing to involve families in the process.",
      familyBackground:
        "Respectable Pakistani Muslim family in Birmingham. Father is a community elder; we prioritise halal living, prayer, and maintaining strong family ties.",
      fatherOccupation: "Business Owner (retail)",
      motherOccupation: "Homemaker",
      siblings: "2 younger sisters (both studying)",
      diet: "Halal",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Urdu", "Punjabi"],
      community: "Pakistani Muslim",
      willingToRelocate: false,
      hobbies: ["Baking", "Reading", "Charity Work", "Gardening"],
      memberSince: "2024-06-10",
      lastActive: "2026-06-18",
    },
  },
  "profile-4": {
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Pharmacist based in Leicester with deep roots in the Gujarati community. I balance professional ambition with cultural traditions — from garba nights to Sunday family dinners. Seeking a life partner who values both.",
      partnerExpectations:
        "Hindu woman, 24–30, educated and family-oriented. Preferably from a Gujarati or similar background. Should be willing to live in Leicester or the Midlands.",
      familyBackground:
        "Well-established Patel family in Leicester. Own a pharmacy business; active in the local Hindu community and temple events.",
      fatherOccupation: "Pharmacist (business owner)",
      motherOccupation: "Homemaker",
      siblings: "1 younger sister (engaged)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Hindi", "Gujarati"],
      community: "Gujarati Hindu",
      willingToRelocate: false,
      hobbies: ["Cricket", "Temple Volunteering", "Cooking", "Travel"],
      memberSince: "2023-11-05",
      lastActive: "2026-06-15",
    },
  },
  "profile-5": {
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Marketing professional from Bristol. After a difficult divorce, I have grown stronger and clearer about what I want — a genuine, supportive partnership built on trust and open communication.",
      partnerExpectations:
        "Mature, emotionally intelligent man aged 28–38. Christian or no religion. Must be accepting of my past and ready to embrace a fresh start together.",
      familyBackground:
        "Close-knit English family in the South West. Parents are supportive and welcoming; I have one son who lives with his father.",
      fatherOccupation: "Retired Engineer",
      motherOccupation: "Part-time Florist",
      siblings: "1 brother (married, Bristol)",
      diet: "Non-vegetarian",
      smoking: "Non-smoker",
      drinking: "Occasionally",
      languages: ["English"],
      community: "British Christian",
      willingToRelocate: true,
      hobbies: ["Yoga", "Painting", "Coastal Walks", "Cooking"],
      memberSince: "2025-01-12",
      lastActive: "2026-06-14",
    },
  },
  "profile-6": {
    photos: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Punjabi Sikh professional in Leeds. I take pride in my heritage — from gurdwara seva to bhangra nights — while building a successful career in finance. Looking for my life partner to share this journey.",
      partnerExpectations:
        "Sikh woman, 25–32, amritdhari or willing to follow Sikh values. Family must be comfortable with traditional Anand Karaj ceremony. Based in Yorkshire preferred.",
      familyBackground:
        "Traditional Punjabi Sikh family in Leeds. Father runs a transport business; we are active in the local gurdwara and community events.",
      fatherOccupation: "Transport Business Owner",
      motherOccupation: "Homemaker",
      siblings: "1 older brother (married, accountant)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Punjabi", "Hindi"],
      community: "Punjabi Sikh",
      willingToRelocate: false,
      hobbies: ["Hiking", "Punjabi Cuisine", "Gym", "Gurdwara Seva"],
      memberSince: "2024-08-22",
      lastActive: "2026-06-17",
    },
  },
  "profile-7": {
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "NHS nurse from Glasgow with Irish-Scottish roots. Compassionate, adventurous, and grounded. I love the Scottish Highlands, live acoustic music, and cosy nights in with good company.",
      partnerExpectations:
        "Kind, honest man aged 26–35. Christian background preferred but open-minded. Must appreciate Scottish culture and be ready for a committed relationship.",
      familyBackground:
        "Irish Catholic family settled in Glasgow for two generations. Large extended family; Sunday roasts and ceilidh nights are a tradition.",
      fatherOccupation: "Firefighter (retired)",
      motherOccupation: "NHS Ward Sister",
      siblings: "2 younger brothers (both single)",
      diet: "Non-vegetarian",
      smoking: "Non-smoker",
      drinking: "Occasionally",
      languages: ["English"],
      community: "Scottish Christian",
      willingToRelocate: true,
      hobbies: ["Hill Walking", "Live Music", "Nursing", "Baking"],
      memberSince: "2024-04-18",
      lastActive: "2026-06-16",
    },
  },
  "profile-8": {
    photos: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Research scientist at a London university with Chinese-British heritage. I find balance through meditation, hiking, and intellectual conversations. Seeking a thoughtful partner who values personal growth.",
      partnerExpectations:
        "Educated woman aged 28–36, open to Buddhist or secular worldview. Intellectual curiosity and emotional maturity are more important than background.",
      familyBackground:
        "Chinese-British family in London. Parents are academics; emphasis on education, mindfulness, and respecting both Eastern and Western traditions.",
      fatherOccupation: "University Professor",
      motherOccupation: "Medical Researcher",
      siblings: "Only child",
      diet: "Mostly vegetarian",
      smoking: "Non-smoker",
      drinking: "Rarely",
      languages: ["English", "Mandarin", "Cantonese"],
      community: "Chinese-British Buddhist",
      willingToRelocate: false,
      hobbies: ["Meditation", "Science", "Hiking", "Photography"],
      memberSince: "2023-09-30",
      lastActive: "2026-06-18",
    },
  },
  "profile-9": {
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Creative graphic designer from Cardiff with Somali-Welsh heritage. I blend my multicultural background into my art and life. Family, faith, and creativity are the pillars of who I am.",
      partnerExpectations:
        "Practising Muslim man, 25–32, respectful and ambitious. Must value creativity and be comfortable with a British-born Muslim woman pursuing her career.",
      familyBackground:
        "Somali Muslim family in Cardiff. Parents immigrated in the 1990s; strong emphasis on education, faith, and maintaining Somali culture while embracing Welsh identity.",
      fatherOccupation: "Taxi Firm Owner",
      motherOccupation: "Community Worker",
      siblings: "1 older brother (married), 1 younger sister",
      diet: "Halal",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Somali", "Arabic (basic)"],
      community: "Somali Muslim",
      willingToRelocate: true,
      hobbies: ["Graphic Design", "Art Exhibitions", "Nature Walks", "Calligraphy"],
      memberSince: "2024-11-08",
      lastActive: "2026-06-17",
    },
  },
  "profile-10": {
    photos: [
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Architect in Edinburgh with a passion for heritage buildings and modern design. Divorced with no children; I have learned what matters most — honesty, humour, and a partner who is my best friend.",
      partnerExpectations:
        "Woman aged 30–40, independent and kind. No strong religious requirements. Must appreciate Scottish culture and be open to blending families if children are involved.",
      familyBackground:
        "Scottish family in Edinburgh. Father was a builder; mother a librarian. Warm, no-nonsense family who welcome everyone to the table.",
      fatherOccupation: "Builder (retired)",
      motherOccupation: "Retired Librarian",
      siblings: "1 sister (married, Aberdeen)",
      diet: "Non-vegetarian",
      smoking: "Non-smoker",
      drinking: "Occasionally",
      languages: ["English"],
      community: "Scottish",
      willingToRelocate: false,
      hobbies: ["Architecture", "Whisky Tasting", "Cycling", "History"],
      memberSince: "2024-02-28",
      lastActive: "2026-06-15",
    },
  },
};
