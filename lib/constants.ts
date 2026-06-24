export const SITE_NAME = "UK Matrimony";

export const SITE_TAGLINE =
  "The UK's trusted matchmaking service for Brit Asian singles";

export const SITE_DESCRIPTION =
  "Join thousands of verified Brit Asian singles across England, Scotland, Wales & Northern Ireland. Register free, connect with compatible matches, and find your life partner on the UK's dedicated matrimony platform.";

export const SITE_STATS = {
  members: "50,000+",
  matches: "8,000+",
  verified: "98%",
  cities: "15+",
} as const;

export const SOCIAL_LINKS = {
  email: "mailto:hello@ukmatrimony.co.uk",
  whatsapp: "https://wa.me/447000000000",
  linkedin: "https://linkedin.com/company/ukmatrimony",
};

export const COMMUNITIES = [
  {
    name: "Hindu Matrimony",
    description: "Connect with verified Hindu singles across the UK",
    religion: "Hindu",
  },
  {
    name: "Sikh Matrimony",
    description: "Find your Anand Karaj partner within the UK Sikh community",
    religion: "Sikh",
  },
  {
    name: "Muslim Matrimony",
    description: "Halal matchmaking for British Muslim singles",
    religion: "Muslim",
  },
  {
    name: "Christian Matrimony",
    description: "Faith-centred matchmaking for UK Christians",
    religion: "Christian",
  },
  {
    name: "Punjabi Matrimony",
    description: "Cultural matchmaking for Punjabi families in Britain",
    religion: "Sikh",
  },
  {
    name: "Gujarati Matrimony",
    description: "Community-focused matches for Gujarati Britons",
    religion: "Hindu",
  },
] as const;

export const UK_REGIONS = [
  { city: "London", members: "18,000+" },
  { city: "Birmingham", members: "6,500+" },
  { city: "Manchester", members: "5,200+" },
  { city: "Leicester", members: "4,800+" },
  { city: "Bradford", members: "3,900+" },
  { city: "Glasgow", members: "2,400+" },
  { city: "Leeds", members: "2,100+" },
  { city: "Edinburgh", members: "1,800+" },
] as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export const APP_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/search", label: "Search", icon: "Search" },
  { href: "/profile", label: "Profile", icon: "User" },
  { href: "/messages", label: "Messages", icon: "MessageCircle" },
  { href: "/subscription", label: "Subscription", icon: "Crown" },
];

export const UK_LOCATIONS = [
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Glasgow",
  "Liverpool",
  "Bristol",
  "Edinburgh",
  "Sheffield",
  "Leicester",
  "Coventry",
  "Bradford",
  "Cardiff",
  "Belfast",
  "Nottingham",
];

export const RELIGIONS = [
  "Christian",
  "Hindu",
  "Muslim",
  "Sikh",
  "Jewish",
  "Buddhist",
  "No Religion",
  "Other",
];

export const EDUCATION_LEVELS = [
  "High School",
  "A-Levels",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Professional Qualification",
  "Other",
];

export const MARITAL_STATUSES = [
  { value: "never_married", label: "Single" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "separated", label: "Separated" },
];

export const BODY_TYPES = [
  { value: "slim", label: "Slim" },
  { value: "average", label: "Average" },
  { value: "athletic", label: "Athletic" },
  { value: "plus_size", label: "Plus Size" },
];

export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const LOOKING_FOR_OPTIONS = [
  { value: "bride", label: "Bride" },
  { value: "groom", label: "Groom" },
] as const;

export const BIRTH_MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const ID_DOCUMENT_TYPES = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "voter_id", label: "Voter ID" },
] as const;

export const FAMILY_TYPES = ["Nuclear", "Joint", "Extended"] as const;

export const FAMILY_VALUES = [
  "Traditional",
  "Moderate",
  "Liberal",
  "Religious",
  "Cosmopolitan",
] as const;

export const FOOD_PREFERENCES = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Eggetarian",
  "Jain",
] as const;

export const SMOKING_DRINKING_OPTIONS = ["No", "Occasionally", "Yes", "Socially"] as const;

export const MOTHER_TONGUES = [
  "English",
  "Hindi",
  "Punjabi",
  "Gujarati",
  "Urdu",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Other",
] as const;

export const UK_COUNTRIES = ["England", "Scotland", "Wales", "Northern Ireland"] as const;

export const ANNUAL_INCOME_RANGES = [
  "Under £25,000",
  "£25,000 – £40,000",
  "£40,000 – £60,000",
  "£60,000 – £80,000",
  "£80,000 – £100,000",
  "Over £100,000",
  "Prefer not to say",
] as const;

export const FITNESS_INTERESTS = [
  "Gym",
  "Yoga",
  "Running",
  "Swimming",
  "Cycling",
  "Team Sports",
  "Walking",
  "None",
] as const;

export const ONBOARDING_PHASES = [
  { id: 1, label: "Quick Sign Up", route: "/register" },
  { id: 2, label: "Complete Profile", route: "/onboarding/profile" },
  { id: 3, label: "Verify Identity", route: "/onboarding/verify" },
] as const;

export const MOCK_OTP_CODE = "123456";
