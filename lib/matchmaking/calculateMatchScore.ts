import { EDUCATION_LEVELS } from "@/lib/constants";
import type { FullProfile, MatrimonyDetails, Profile, SearchProfile } from "@/lib/types";

export type MatchLabel = "Excellent Match" | "Good Match" | "Average Match" | "Low Match";

export interface MatchScoreResult {
  score: number;
  label: MatchLabel;
  strengths: string[];
  concerns: string[];
  explanation: string;
}

interface CriterionResult {
  key: string;
  score: number;
  strength?: string;
  concern?: string;
}

interface MatchableProfile {
  age: number;
  education: string;
  occupation: string;
  religion: string;
  location: string;
  bio: string;
  preferences: Profile["preferences"];
  community?: string;
  diet?: string;
  smoking?: string;
  drinking?: string;
  hobbies: string[];
  familyBackground?: string;
  partnerExpectations?: string;
  willingToRelocate?: boolean;
}

const UK_REGIONS: Record<string, string> = {
  London: "south",
  Manchester: "north",
  Birmingham: "midlands",
  Leeds: "north",
  Glasgow: "scotland",
  Liverpool: "north",
  Bristol: "south",
  Edinburgh: "scotland",
  Sheffield: "north",
  Leicester: "midlands",
  Coventry: "midlands",
  Bradford: "north",
  Cardiff: "wales",
  Belfast: "ni",
  Nottingham: "midlands",
};

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do",
  "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall",
  "can", "i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "they",
  "them", "their", "this", "that", "who", "whom", "which", "what", "am", "as", "by",
  "from", "up", "about", "into", "through", "during", "before", "after", "above",
  "below", "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each", "few",
  "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own",
  "same", "so", "than", "too", "very", "just", "also", "both", "looking", "seeking",
]);

function resolveMatrimony(
  profile: Profile | SearchProfile | FullProfile
): Partial<MatrimonyDetails> {
  if ("matrimony" in profile && profile.matrimony && Object.keys(profile.matrimony).length > 0) {
    return profile.matrimony;
  }
  return {};
}

function toMatchable(
  profile: Profile | SearchProfile | FullProfile
): MatchableProfile {
  const extras = resolveMatrimony(profile);
  return {
    age: profile.age,
    education: profile.education,
    occupation: profile.occupation,
    religion: profile.religion,
    location: profile.location,
    bio: profile.bio,
    preferences: profile.preferences,
    community: extras.community,
    diet: extras.diet,
    smoking: extras.smoking,
    drinking: extras.drinking,
    hobbies: extras.hobbies ?? [],
    familyBackground: extras.familyBackground,
    partnerExpectations: extras.partnerExpectations,
    willingToRelocate: extras.willingToRelocate,
  };
}

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = tokenize(a);
  const setB = tokenize(b);
  if (setA.size === 0 && setB.size === 0) return 50;
  if (setA.size === 0 || setB.size === 0) return 30;
  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return Math.round((intersection / union) * 100);
}

function scoreAge(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  const { ageMin, ageMax } = viewer.preferences;
  let score: number;

  if (target.age >= ageMin && target.age <= ageMax) {
    score = 100;
  } else {
    const distance =
      target.age < ageMin ? ageMin - target.age : target.age - ageMax;
    score = Math.max(20, 100 - distance * 8);
  }

  const reciprocal =
    viewer.age >= target.preferences.ageMin && viewer.age <= target.preferences.ageMax;
  if (reciprocal && score < 100) {
    score = Math.min(100, score + 10);
  }

  const result: CriterionResult = { key: "age", score };
  if (score >= 60) {
    result.strength = `Age ${target.age} fits your preferred range (${ageMin}–${ageMax})`;
  } else if (score < 50) {
    result.concern = `Age ${target.age} is outside your preferred range (${ageMin}–${ageMax})`;
  }
  return result;
}

function scoreEducation(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  const viewerIdx = EDUCATION_LEVELS.indexOf(viewer.education);
  const targetIdx = EDUCATION_LEVELS.indexOf(target.education);

  let score: number;
  if (viewerIdx === -1 || targetIdx === -1) {
    score = normalizeText(viewer.education) === normalizeText(target.education) ? 100 : 40;
  } else {
    const diff = Math.abs(viewerIdx - targetIdx);
    if (diff === 0) score = 100;
    else if (diff === 1) score = 75;
    else if (diff === 2) score = 50;
    else score = 25;
  }

  const result: CriterionResult = { key: "education", score };
  if (score >= 60) {
    result.strength = `Similar education background (${target.education})`;
  } else if (score < 50) {
    result.concern = `Different education levels (${viewer.education} vs ${target.education})`;
  }
  return result;
}

function scoreProfession(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  const v = normalizeText(viewer.occupation);
  const t = normalizeText(target.occupation);

  let score: number;
  if (v === t) {
    score = 100;
  } else {
    const vWords = tokenize(viewer.occupation);
    const tWords = tokenize(target.occupation);
    let shared = 0;
    for (const word of vWords) {
      if (tWords.has(word)) shared++;
    }
    score = shared > 0 ? 70 : 30;
  }

  const result: CriterionResult = { key: "profession", score };
  if (score >= 60) {
    result.strength = `Profession alignment (${target.occupation})`;
  } else if (score < 50) {
    result.concern = `Different professional backgrounds`;
  }
  return result;
}

function scoreReligion(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  let score: number;
  if (normalizeText(viewer.religion) === normalizeText(target.religion)) {
    score = 100;
  } else if (
    viewer.preferences.religions.some(
      (r) => normalizeText(r) === normalizeText(target.religion)
    )
  ) {
    score = 85;
  } else {
    score = 20;
  }

  const result: CriterionResult = { key: "religion", score };
  if (score >= 60) {
    result.strength = `Shared ${target.religion} faith`;
  } else if (score < 50) {
    result.concern = `Different religious backgrounds (${viewer.religion} vs ${target.religion})`;
  }
  return result;
}

function scoreCommunity(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  if (!viewer.community || !target.community) {
    return { key: "community", score: 50 };
  }

  const v = normalizeText(viewer.community);
  const t = normalizeText(target.community);

  let score: number;
  if (v === t) {
    score = 100;
  } else {
    const vTokens = tokenize(viewer.community);
    const tTokens = tokenize(target.community);
    let overlap = 0;
    for (const word of vTokens) {
      if (tTokens.has(word)) overlap++;
    }
    score = overlap > 0 ? 60 : 25;
  }

  const result: CriterionResult = { key: "community", score };
  if (score >= 60) {
    result.strength = `Community alignment (${target.community})`;
  } else if (score < 50) {
    result.concern = `Different community backgrounds`;
  }
  return result;
}

function scoreLocation(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  const vLoc = normalizeText(viewer.location);
  const tLoc = normalizeText(target.location);

  let score: number;
  if (vLoc === tLoc) {
    score = 100;
  } else if (
    viewer.preferences.locations.some((l) => normalizeText(l) === tLoc)
  ) {
    score = 90;
  } else if (UK_REGIONS[viewer.location] === UK_REGIONS[target.location]) {
    score = 60;
  } else {
    score = 25;
  }

  const result: CriterionResult = { key: "location", score };
  if (score >= 60) {
    result.strength = `Location compatible (${target.location})`;
  } else if (score < 50) {
    result.concern = `Different locations (${viewer.location} vs ${target.location})`;
  }
  return result;
}

function compareLifestyleField(a?: string, b?: string): number {
  if (!a || !b) return 50;
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (na === nb) return 100;
  if (na.includes(nb) || nb.includes(na)) return 70;
  return 30;
}

function scoreLifestyle(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  const diet = compareLifestyleField(viewer.diet, target.diet);
  const smoking = compareLifestyleField(viewer.smoking, target.smoking);
  const drinking = compareLifestyleField(viewer.drinking, target.drinking);
  const score = Math.round((diet + smoking + drinking) / 3);

  const result: CriterionResult = { key: "lifestyle", score };
  if (score >= 60) {
    result.strength = "Compatible lifestyle habits";
  } else if (score < 50) {
    const parts: string[] = [];
    if (diet < 50 && viewer.diet && target.diet) parts.push("diet");
    if (smoking < 50 && viewer.smoking && target.smoking) parts.push("smoking");
    if (drinking < 50 && viewer.drinking && target.drinking) parts.push("drinking");
    result.concern =
      parts.length > 0
        ? `Different ${parts.join(" and ")} preferences`
        : "Lifestyle habits may differ";
  }
  return result;
}

function scoreFamilyValues(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  const viewerText = [viewer.bio, viewer.familyBackground].filter(Boolean).join(" ");
  const targetText = [target.bio, target.familyBackground].filter(Boolean).join(" ");
  const score = jaccardSimilarity(viewerText, targetText);

  const result: CriterionResult = { key: "familyValues", score };
  if (score >= 60) {
    result.strength = "Aligned family values and outlook";
  } else if (score < 50) {
    result.concern = "Family values and outlook may differ";
  }
  return result;
}

function scoreHobbies(viewer: MatchableProfile, target: MatchableProfile): CriterionResult {
  const vSet = new Set(viewer.hobbies.map((h) => normalizeText(h)));
  const tSet = new Set(target.hobbies.map((h) => normalizeText(h)));

  if (vSet.size === 0 && tSet.size === 0) {
    return { key: "hobbies", score: 50 };
  }

  let intersection = 0;
  for (const hobby of vSet) {
    if (tSet.has(hobby)) intersection++;
  }
  const union = vSet.size + tSet.size - intersection;
  const score = union === 0 ? 50 : Math.round((intersection / union) * 100);

  const shared = viewer.hobbies.filter((h) =>
    target.hobbies.some((t) => normalizeText(t) === normalizeText(h))
  );

  const result: CriterionResult = { key: "hobbies", score };
  if (score >= 60 && shared.length > 0) {
    result.strength = `Shared interests: ${shared.slice(0, 3).join(", ")}`;
  } else if (score < 50) {
    result.concern = "Few shared hobbies or interests";
  }
  return result;
}

function scoreMarriagePreferences(
  viewer: MatchableProfile,
  target: MatchableProfile
): CriterionResult {
  const ageFit =
    target.age >= viewer.preferences.ageMin && target.age <= viewer.preferences.ageMax
      ? 100
      : 40;
  const religionFit = viewer.preferences.religions.some(
    (r) => normalizeText(r) === normalizeText(target.religion)
  )
    ? 100
    : 30;
  const locationFit = viewer.preferences.locations.some(
    (l) => normalizeText(l) === normalizeText(target.location)
  )
    ? 100
    : 40;

  const reciprocalAge =
    viewer.age >= target.preferences.ageMin && viewer.age <= target.preferences.ageMax
      ? 100
      : 40;
  const reciprocalReligion = target.preferences.religions.some(
    (r) => normalizeText(r) === normalizeText(viewer.religion)
  )
    ? 100
    : 30;

  let relocateScore = 50;
  if (viewer.willingToRelocate !== undefined && target.willingToRelocate !== undefined) {
    if (viewer.location === target.location) {
      relocateScore = 100;
    } else if (viewer.willingToRelocate || target.willingToRelocate) {
      relocateScore = 80;
    } else {
      relocateScore = 30;
    }
  }

  const expectationsOverlap = jaccardSimilarity(
    viewer.partnerExpectations ?? viewer.bio,
    target.partnerExpectations ?? target.bio
  );

  const score = Math.round(
    (ageFit + religionFit + locationFit + reciprocalAge + reciprocalReligion + relocateScore + expectationsOverlap) / 7
  );

  const result: CriterionResult = { key: "marriagePreferences", score };
  if (score >= 60) {
    result.strength = "Marriage preferences align well";
  } else if (score < 50) {
    result.concern = "Marriage preferences may not fully align";
  }
  return result;
}

function getLabel(score: number): MatchLabel {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Average Match";
  return "Low Match";
}

function buildNarrative(
  score: number,
  label: MatchLabel,
  criteria: CriterionResult[]
): Pick<MatchScoreResult, "strengths" | "concerns" | "explanation"> {
  const sorted = [...criteria].sort((a, b) => b.score - a.score);

  const strengths = sorted
    .filter((c) => c.score >= 60 && c.strength)
    .map((c) => c.strength!)
    .slice(0, 3);

  if (strengths.length < 3) {
    const fillers = sorted
      .filter((c) => c.strength && !strengths.includes(c.strength))
      .map((c) => c.strength!)
      .slice(0, 3 - strengths.length);
    strengths.push(...fillers);
  }

  const concerns = criteria
    .filter((c) => c.score < 50 && c.concern)
    .sort((a, b) => a.score - b.score)
    .map((c) => c.concern!)
    .slice(0, 2);

  const explanation = `You have a ${score}% compatibility score — an ${label.toLowerCase()} based on age, education, lifestyle, and partner preferences.`;

  return { strengths: strengths.slice(0, 3), concerns, explanation };
}

export function calculateMatchScore(
  viewer: Profile,
  target: SearchProfile | FullProfile
): MatchScoreResult {
  const viewerMatchable = toMatchable(viewer);
  const targetMatchable = toMatchable(target);

  const criteria: CriterionResult[] = [
    scoreAge(viewerMatchable, targetMatchable),
    scoreEducation(viewerMatchable, targetMatchable),
    scoreProfession(viewerMatchable, targetMatchable),
    scoreReligion(viewerMatchable, targetMatchable),
    scoreCommunity(viewerMatchable, targetMatchable),
    scoreLocation(viewerMatchable, targetMatchable),
    scoreLifestyle(viewerMatchable, targetMatchable),
    scoreFamilyValues(viewerMatchable, targetMatchable),
    scoreHobbies(viewerMatchable, targetMatchable),
    scoreMarriagePreferences(viewerMatchable, targetMatchable),
  ];

  const score = Math.round(
    criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length
  );
  const label = getLabel(score);
  const narrative = buildNarrative(score, label, criteria);

  return { score, label, ...narrative };
}
