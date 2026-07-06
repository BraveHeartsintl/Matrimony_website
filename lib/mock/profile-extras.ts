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
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Chartered accountant in Leeds with Punjabi Hindu upbringing. I work in audit for a Big Four firm, live near Roundhay, and visit my parents in Bradford most weekends. I enjoy Yorkshire cricket, Diwali at home, and planning for my first home purchase.",
      partnerExpectations:
        "Educated Hindu woman, 25–32, family-oriented. Preferably Punjabi or North Indian background. Must be comfortable living in Yorkshire and involving both families in the matchmaking process.",
      familyBackground:
        "Punjabi Hindu family in Leeds since the 1970s. Father runs a wholesale business; mother is a dinner lady. Large cousin network across Bradford and Leeds.",
      fatherOccupation: "Wholesale Business Owner",
      motherOccupation: "School Catering Assistant",
      siblings: "1 younger sister (married, pharmacist)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Punjabi", "Hindi"],
      community: "Punjabi Hindu",
      willingToRelocate: false,
      hobbies: ["Cricket", "Finance podcasts", "Travel", "Cooking"],
      memberSince: "2024-01-20",
      lastActive: "2026-07-04",
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
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Tamil Hindu NHS physiotherapist in North London. Born in Wembley Central; parents from Jaffna Tamil community. I speak Tamil at home, work in acute rehab, and balance career ambitions with traditional family expectations around marriage.",
      partnerExpectations:
        "Hindu groom, preferably Tamil or South Indian, 28–35, UK-educated and professionally settled. Must respect parents' involvement and be open to London or Home Counties.",
      familyBackground:
        "Tamil Hindu family in Wembley. Father is an Underground engineer, mother works in a sari boutique. Strong ties to Sri Lankan Tamil community in NW London.",
      fatherOccupation: "London Underground Engineer",
      motherOccupation: "Boutique Assistant",
      siblings: "1 younger brother (university)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Tamil"],
      community: "Tamil Hindu",
      willingToRelocate: true,
      hobbies: ["Bharatanatyam", "NHS outreach", "South Indian cooking"],
      memberSince: "2025-01-12",
      lastActive: "2026-07-04",
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
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Hospital pharmacist in Glasgow with British Pakistani heritage. Raised in Pollokshields; parents from Rawalpindi. I balance hijab, NHS shift work, and being the eldest daughter in a traditional but supportive family.",
      partnerExpectations:
        "Practising Muslim man, 26–33, employed, UK-resident. Must respect hijab, involve families appropriately, and be ready for nikah within Scotland or northern England.",
      familyBackground:
        "Pakistani Muslim family in Glasgow since the 1980s. Father owns a convenience store; mother is a community Urdu teacher. Large extended family across Glasgow and Manchester.",
      fatherOccupation: "Convenience Store Owner",
      motherOccupation: "Community Language Teacher",
      siblings: "2 younger brothers (one at university)",
      diet: "Halal",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Urdu", "Punjabi"],
      community: "British Pakistani Muslim",
      willingToRelocate: true,
      hobbies: ["Pharmacy research", "Islamic study circles", "Highland walks"],
      memberSince: "2024-04-18",
      lastActive: "2026-07-03",
    },
  },
  "profile-8": {
    photos: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "GP trainee in Birmingham with Punjabi Sikh roots from Handsworth. Turbaned, NHS-focused, and active in gurdwara youth programmes. I am on the specialist training pathway and want a partner who understands long training hours but values seva and family.",
      partnerExpectations:
        "Sikh bride, 28–34, from a respectful UK family. Amritdhari or strongly practising preferred. Must be comfortable with Anand Karaj and living in the Midlands during training.",
      familyBackground:
        "Punjabi Sikh family in Birmingham. Father is a taxi fleet operator; mother is a NHS healthcare assistant. Sister married in Coventry.",
      fatherOccupation: "Taxi Fleet Operator",
      motherOccupation: "NHS Healthcare Assistant",
      siblings: "1 sister (married, Coventry)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Punjabi"],
      community: "Punjabi Sikh",
      willingToRelocate: true,
      hobbies: ["NHS training", "Gurdwara seva", "Running", "Medical podcasts"],
      memberSince: "2023-09-30",
      lastActive: "2026-07-04",
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
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f2d?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "HMRC civil servant in Cardiff with British Bengali Muslim heritage. Parents from Sylhet; I grew up between Canton masjid, Welsh school, and family trips to Bangladesh. Stable career, homeowner, and ready for marriage with full family involvement.",
      partnerExpectations:
        "Practising Muslim bride, 26–32, educated, UK-based. Prefer Bengali or South Asian background. Must be comfortable with Wales or western England and a traditional nikah.",
      familyBackground:
        "Sylheti Bengali family in Cardiff since the 1980s. Father worked in catering, now runs a restaurant; mother is a homemaker active in Bengali Welfare Association.",
      fatherOccupation: "Restaurant Owner",
      motherOccupation: "Homemaker",
      siblings: "2 sisters (both married in Cardiff)",
      diet: "Halal",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Bengali", "Sylheti"],
      community: "British Bengali Muslim",
      willingToRelocate: false,
      hobbies: ["Community fundraising", "Football", "Bangladesh travel"],
      memberSince: "2024-02-28",
      lastActive: "2026-07-04",
    },
  },
  "profile-11": {
    photos: [
      "https://images.unsplash.com/photo-1583394838336-acd9777362f6?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Bradford-born NHS midwife from a Mirpuri-Punjabi family. I work night shifts at Bradford Royal Infirmary and value deen, honest communication, and family involvement in marriage decisions.",
      partnerExpectations:
        "Practising Muslim man, 27–34, employed, UK-based. Must respect my career and be comfortable with a nikah followed by a simple walima in Yorkshire.",
      familyBackground:
        "Parents from Azad Kashmir, settled in Bradford since the 1970s. Large extended family in West Yorkshire; marriage discussions involve elders with my consent.",
      fatherOccupation: "Post Office Supervisor (retired)",
      motherOccupation: "Homemaker",
      siblings: "2 brothers (both married, Bradford)",
      diet: "Halal",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Punjabi", "Urdu"],
      community: "British Pakistani Muslim",
      willingToRelocate: false,
      hobbies: ["NHS volunteering", "Islamic lectures", "Walking"],
      memberSince: "2025-01-12",
      lastActive: "2026-07-01",
    },
  },
  "profile-12": {
    photos: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Primary teacher in Ealing, raised in Southall. I keep kesh, attend gurdwara regularly, and balance British professional life with Punjabi family expectations.",
      partnerExpectations:
        "Sikh groom, 28–35, preferably UK-born. Must be willing to involve both families in matchmaking and respect Anand Karaj traditions.",
      familyBackground:
        "Punjabi Sikh family; father runs a logistics firm, mother is a dinner lady. Strong ties to Southall and Greenford gurdwaras.",
      fatherOccupation: "Logistics Business Owner",
      motherOccupation: "School Catering Assistant",
      siblings: "1 younger sister (university)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Punjabi"],
      community: "Punjabi Sikh",
      willingToRelocate: true,
      hobbies: ["Teaching", "Kirtan", "Bollywood classics"],
      memberSince: "2024-09-20",
      lastActive: "2026-07-02",
    },
  },
  "profile-13": {
    photos: [
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "ACCA accountant commuting between Luton and Milton Keynes. British Bengali Muslim with Sylheti roots; jummah at local masjid and close to the Bengali Welfare Association.",
      partnerExpectations:
        "Practising Muslim bride, 24–30, educated, willing to live in Beds/Herts. Family must be comfortable with a UK civil marriage process alongside Islamic nikah.",
      familyBackground:
        "Parents arrived in the 1980s; father worked in textiles, now runs a cash-and-carry. Three sisters, all married in the UK.",
      fatherOccupation: "Retail Business Owner",
      motherOccupation: "Homemaker",
      siblings: "3 sisters (all married)",
      diet: "Halal",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Bengali", "Sylheti"],
      community: "British Bengali Muslim",
      willingToRelocate: false,
      hobbies: ["Football", "Charity fundraising", "Travel to Bangladesh"],
      memberSince: "2024-06-03",
      lastActive: "2026-07-01",
    },
  },
  "profile-14": {
    photos: [
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Leicester-born Gujarati dental hygienist. Strict vegetarian, Navratri and Diwali are big in our home. Looking for a UK-settled groom through family introductions.",
      partnerExpectations:
        "Hindu Gujarati groom, 26–32, professionally settled. Vegetarian household preferred; must respect parents' involvement.",
      familyBackground:
        "Parents own a corner shop in Belgrave; brother is a pharmacy dispenser. Typical Leicester Gujarati middle-class family.",
      fatherOccupation: "Shopkeeper",
      motherOccupation: "Shop Assistant",
      siblings: "1 brother (engaged)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Gujarati", "Hindi"],
      community: "Gujarati Hindu",
      willingToRelocate: true,
      hobbies: ["Garba", "Dental volunteering", "Cooking"],
      memberSince: "2025-03-18",
      lastActive: "2026-06-28",
    },
  },
  "profile-15": {
    photos: [
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "IT project manager in Birmingham's financial services sector. Gujarati Hindu, homeowner in Edgbaston, and regular at local mandir events.",
      partnerExpectations:
        "Educated Hindu bride, 26–32, career-oriented but family-focused. Open to living in Birmingham long term.",
      familyBackground:
        "Parents in Wembley; father retired from Heathrow logistics. Two sisters married in London.",
      fatherOccupation: "Retired Logistics Manager",
      motherOccupation: "Homemaker",
      siblings: "2 sisters (married, London)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Occasionally",
      languages: ["English", "Gujarati", "Hindi"],
      community: "Gujarati Hindu",
      willingToRelocate: false,
      hobbies: ["Cricket", "Property investment", "Travel"],
      memberSince: "2023-11-09",
      lastActive: "2026-07-03",
    },
  },
  "profile-16": {
    photos: [
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd9777362f6?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Psychology graduate beginning NHS IAPT counselling training. British Pakistani from Longsight, hijabi, and serious about balancing career with marriage.",
      partnerExpectations:
        "Practising Muslim man, emotionally mature, 24–30. Must support my career and be comfortable with a gradual getting-to-know-you period with families involved.",
      familyBackground:
        "Parents from Lahore; father drives for a ride-hailing app, mother is a teaching assistant. Conservative but supportive of education.",
      fatherOccupation: "Private Hire Driver",
      motherOccupation: "Teaching Assistant",
      siblings: "1 older brother (married)",
      diet: "Halal",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Urdu", "Punjabi"],
      community: "British Pakistani Muslim",
      willingToRelocate: true,
      hobbies: ["Reading", "Mental health advocacy", "Urdu poetry"],
      memberSince: "2025-05-22",
      lastActive: "2026-07-04",
    },
  },
  "profile-17": {
    photos: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Civil engineer on Midlands highway projects with family mini-cab firm. Wolverhampton-born Sikh, turbaned, and active in local gurdwara youth seva.",
      partnerExpectations:
        "Sikh bride from a respectful family, 24–30. Must be comfortable with joint family visits and traditional wedding customs in the West Midlands.",
      familyBackground:
        "Punjabi family in Wolverhampton since the 1960s. Father started with factory work, now owns transport contracts.",
      fatherOccupation: "Transport Business Owner",
      motherOccupation: "Homemaker",
      siblings: "1 sister (married, Coventry)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Punjabi"],
      community: "Punjabi Sikh",
      willingToRelocate: false,
      hobbies: ["Bhangra", "Gurdwara seva", "Engineering podcasts"],
      memberSince: "2024-04-14",
      lastActive: "2026-07-02",
    },
  },
  "profile-18": {
    photos: [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Tamil Hindu biomedical scientist at NHS Greater Glasgow. Parents migrated from Sri Lanka via London; I speak Tamil at home and English at work.",
      partnerExpectations:
        "Hindu groom, preferably Tamil or South Indian, 27–34. Open to UK-wide matches if career allows.",
      familyBackground:
        "Tamil family in Glasgow's south side. Father is an NHS porter, mother works in a sari shop.",
      fatherOccupation: "NHS Porter",
      motherOccupation: "Retail Assistant",
      siblings: "1 younger brother (university)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Tamil"],
      community: "Tamil Hindu",
      willingToRelocate: true,
      hobbies: ["Classical dance", "NHS research", "Hill walking"],
      memberSince: "2024-08-07",
      lastActive: "2026-07-01",
    },
  },
  "profile-19": {
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f2d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Quantity surveyor on Leeds city centre builds. British Pakistani, cricket league on Sundays, and regular at Harehills masjid.",
      partnerExpectations:
        "Modest, educated Muslim bride, 23–29, from a UK-resident family. Prefer Yorkshire/Lancashire so both families can stay connected.",
      familyBackground:
        "Kashmiri-Pakistani heritage; father worked in textile mills, now owns a takeaway. Large cousin network across West Yorkshire.",
      fatherOccupation: "Takeaway Owner",
      motherOccupation: "Homemaker",
      siblings: "2 sisters (one married)",
      diet: "Halal",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Urdu", "Punjabi"],
      community: "British Pakistani Muslim",
      willingToRelocate: false,
      hobbies: ["Cricket", "Construction sites", "Charity cricket"],
      memberSince: "2024-01-30",
      lastActive: "2026-07-03",
    },
  },
  "profile-20": {
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
    ],
    matrimony: {
      aboutMe:
        "Marketing executive in Slough/Reading corridor. Punjabi Hindu, vegetarian, and close to both Berkshire temples and London family events.",
      partnerExpectations:
        "Professional Hindu groom, 27–33, UK citizen or settled status. Vegetarian, respectful of parents, ready for marriage within 18 months.",
      familyBackground:
        "Parents in Slough; father is an IT contractor, mother works in a pharmacy. Typical commuter-belt Punjabi family.",
      fatherOccupation: "IT Contractor",
      motherOccupation: "Pharmacy Dispenser",
      siblings: "1 brother (married, Hounslow)",
      diet: "Vegetarian",
      smoking: "Non-smoker",
      drinking: "Does not drink",
      languages: ["English", "Hindi", "Punjabi"],
      community: "Punjabi Hindu",
      willingToRelocate: true,
      hobbies: ["Marketing", "Bollywood fitness", "Weekend trips to London"],
      memberSince: "2024-10-11",
      lastActive: "2026-07-04",
    },
  },
};
