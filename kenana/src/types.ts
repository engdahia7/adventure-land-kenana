export type GameLocationId = 'cairo' | 'alexandria' | 'luxor' | 'kings_valley' | 'aswan' | 'giza' | 'secret_chamber';

export type PlayerSkillType = 'negotiation' | 'exploration' | 'defense';

export interface PlayerCustomization {
  name: string;
  title: string;
  gender: 'male' | 'female';
  headwear: 'nemes' | 'lotus_crown' | 'priest_linen' | 'anubis_mask' | 'pharaoh_scarf' | 'explorer_hat' | 'shemagh' | 'turban' | 'egyptian_hair' | 'scarf_wrap' | string;
  outfit: 'pharaoh_shendyt' | 'linen_tunic' | 'warrior_armor' | 'high_priest' | 'desert_linen' | 'saidi_jalabiya' | 'nubian_vest' | 'royal_researcher' | string;
  accessory: 'was_sceptre' | 'horus_eye' | 'scarab_amulet' | 'thoth_papyrus' | 'ankh_pendant' | 'silk_sash' | string;
  accentColor: string;
}

export interface PlayerSkills {
  negotiation: number; // 0 - 100: التفاوض والدبلوماسية والتجارة في الأسواق
  exploration: number; // 0 - 100: الاستكشاف الأثري، فك الرموز والمعمار
  defense: number;     // 0 - 100: الدفاع والقتال البسيط والرشاقة الحركية
  skillHistory: Array<{
    skill: PlayerSkillType;
    amount: number;
    reason: string;
    timestamp: string;
  }>;
}

export interface DialogueOption {
  id: string;
  text: string;
  response: string;
  gainItem?: InventoryItem;
  gainClue?: string;
  nextStepId?: string;
  trustChange?: number;
  triggerPuzzle?: string;
  skillRequirement?: {
    skill: PlayerSkillType;
    minLevel: number;
  };
  skillReward?: {
    skill: PlayerSkillType;
    amount: number;
    label: string;
  };
  storyImpact?: string;
}

export interface DialogueNode {
  id: string;
  speakerName: string;
  text: string;
  options: DialogueOption[];
}

export interface Character {
  id: string;
  name: string;
  title: string;
  avatar: string;
  locationId: GameLocationId;
  locationName: string;
  description: string;
  initialGreeting: string;
  voiceStyle: string;
  dialogueTree: Record<string, DialogueNode>;
  quickQuestions: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'وثيقة' | 'أثر ذهبي' | 'معدات' | 'رمز سري';
  icon: string;
  description: string;
  historicalFact: string;
  discoveredAt: string;
  imageUrl?: string;
}

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  iconName: string;
  x: number; // percentage from left
  y: number; // percentage from top
  actionType: 'dialogue' | 'inspect' | 'puzzle' | 'travel' | 'evidence' | 'trap';
  targetId?: string;
  clueReward?: string;
  requiredItem?: string;
}

export interface EvidenceCard {
  id: string;
  title: string;
  type: 'artifact' | 'testimony' | 'clue' | 'suspect';
  description: string;
  locationName: string;
  iconName: string;
  relatedCaseId: string;
  source: string;
}

export interface DeductionRecipe {
  id: string;
  caseId: string;
  caseTitle: string;
  cardAId: string;
  cardBId: string;
  title: string;
  breakthroughText: string;
  unlockedClue: string;
  skillBonus: {
    skill: PlayerSkillType;
    amount: number;
  };
}

export interface InvestigationCase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  solved: boolean;
  requiredDeductions: string[];
  rewardBadge: string;
}

export interface GameLocation {
  id: GameLocationId;
  title: string;
  subtitle: string;
  region: string;
  imageSrc: string;
  ambientSound: 'bazaar' | 'temple' | 'nile' | 'desert' | 'crypt';
  description: string;
  historicalEra: string;
  architecturalStyle?: string;
  characters: Character[];
  hotspots: Hotspot[];
  evidenceLeads?: string[];
  requiredItemsToUnlock?: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  content: string;
  category: 'سر تاريخي' | 'نقش هيروغليفي' | 'ملاحظة شخصية' | 'استنتاج جنائي' | 'مغامرة استكشافية';
}

export interface SkillReward {
  skill: PlayerSkillType;
  amount: number;
  description: string;
}

export interface PuzzleDefinition {
  id: string;
  title: string;
  location: string;
  instruction: string;
  historicalContext: string;
  type: 'hieroglyph_cipher' | 'sun_dial' | 'scarab_align' | 'papyrus_assembly' | 'maat_scales' | 'pyramid_builder';
  solution: string[];
  options?: string[];
  hints?: string[];
  difficulty?: 'سهل' | 'متوسط' | 'صعب' | 'أسطوري';
  puzzleCategory: 'هيروغليفي' | 'فلكي' | 'آلهة وأساطير' | 'عمارة وهندسة الأهرامات';
  skillReward: SkillReward;
  rewardItem: InventoryItem;
  rewardClue: string;
}

export type WeatherType = 'sandstorm' | 'blazing_sun' | 'golden_dusk' | 'nile_breeze' | 'night_stars' | 'mystic_glow';

export interface WeatherCondition {
  id: WeatherType;
  name: string;
  arabicName: string;
  iconName: string;
  description: string;
  temperature: string;
  windSpeed: string;
  overlayClass: string;
  filterStyle: string;
  particleType: 'sand' | 'dust' | 'heat_waves' | 'nile_motes' | 'night_embers' | 'mystic_runes';
}

export interface AdventureEventChoice {
  id: string;
  text: string;
  skillType?: PlayerSkillType;
  minSkillLevel?: number;
  outcomeText: string;
  gainItem?: InventoryItem;
  gainClue?: string;
  skillReward?: {
    skill: PlayerSkillType;
    amount: number;
    reason: string;
  };
  trustChange?: {
    characterId: string;
    amount: number;
  };
}

export interface AdventureEvent {
  id: string;
  title: string;
  locationId: GameLocationId;
  locationName: string;
  category: 'خطر صحراوي' | 'كمين مهربين' | 'اكتشاف أثري' | 'ظاهرة فلكية' | 'لقاء شعبي';
  narrative: string;
  choices: AdventureEventChoice[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'character' | 'system';
  speakerName: string;
  content: string;
  timestamp: string;
}

export interface SuspenseTrapOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  skillUsed?: PlayerSkillType;
}

export interface SuspenseTrapStep {
  prompt: string;
  options: SuspenseTrapOption[];
}

export interface SuspenseTrapEvent {
  id: string;
  locationId?: GameLocationId;
  title: string;
  subtitle: string;
  locationName: string;
  scenario: string;
  timeLimitSeconds: number;
  dangerType: 'falling_rocks' | 'pursuit' | 'poison_darts' | 'rising_water' | 'sand_quicksand';
  steps: SuspenseTrapStep[];
  rewardClue?: string;
  rewardItem?: InventoryItem;
  dangerReduction: number;
}

export interface SecretTelegram {
  id: string;
  sender: string;
  title: string;
  message: string;
  urgency: 'عاجل جداً' | 'سري للغاية' | 'تحذير أمني';
  timestamp: string;
  revealsSecret: string;
}

export interface GameState {
  player: PlayerCustomization;
  skills: PlayerSkills;
  currentLocationId: GameLocationId;
  unlockedLocations: GameLocationId[];
  inventory: InventoryItem[];
  journal: JournalEntry[];
  discoveredClues: string[];
  solvedPuzzles: string[];
  solvedDeductions: string[];
  characterTrust: Record<string, number>;
  activeCharacter: Character | null;
  activePuzzle: PuzzleDefinition | null;
  chapter: number;
  totalChapters: number;
  gameCompleted: boolean;
  dailyProgress?: DailyProgressState;
  threatLevel?: number; // 0 to 100
  secretTelegrams?: SecretTelegram[];
  unreadTelegramsCount?: number;
}

export type MissionStageType = 'inspect' | 'dialogue' | 'puzzle' | 'evidence';

export interface DailyMissionStage {
  id: string;
  stageNumber: number;
  title: string;
  shortDesc: string;
  detailedInstruction: string;
  actionType: MissionStageType;
  targetId?: string;
  targetLocationId: GameLocationId;
  locationName: string;
  isCompleted?: boolean;
  objectiveSummary: string;
  historicalContext: string;
}

export interface DailyCliffhanger {
  dayNumber: number;
  title: string;
  subtitle: string;
  dramaticNarrative: string[];
  cliffhangerQuestion: string;
  tomorrowPreviewTitle: string;
  tomorrowPreviewTeaser: string;
  characterQuote: {
    speakerName: string;
    speakerTitle: string;
    avatar: string;
    quoteText: string;
  };
  audioMood: 'suspense' | 'mystery' | 'ancient_curse' | 'sandstorm' | 'revelation';
}

export interface DailyMission {
  dayNumber: number;
  title: string;
  subtitle: string;
  era: string;
  locationId: GameLocationId;
  locationName: string;
  mentorName: string;
  mentorAvatar: string;
  associatedPuzzleId: string;
  estimatedMinutes: number;
  stages: DailyMissionStage[];
  cliffhanger: DailyCliffhanger;
  completionBadge: string;
  culturalWisdom: string;
}

export interface DayProgressItem {
  dayNumber: number;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  completedStages: number[]; // [1, 2, 3]
  completedAtTimestamp?: number;
  completedDateString?: string; // YYYY-MM-DD
  cliffhangerSeen: boolean;
}

export interface DailyProgressState {
  startDate: string; // e.g. "2026-09-06"
  lastPlayedDate: string;
  simulatedDayOffset: number; // For testing simulation (0 = actual real date)
  activeDay: number; // 1 to 5
  days: Record<number, DayProgressItem>;
  timeRemainingSeconds?: number;
}

export interface RadioFrequencyChannel {
  frequency: number; // e.g. 88.4 MHz
  title: string;
  sender: string;
  category: 'smugglers' | 'police' | 'radio_cairo' | 'ancient_morse';
  badge: string;
  transcript: string;
  decodedClue?: string;
  dangerLevelDelta: number;
  rewardItem?: InventoryItem;
  audioEffectType: 'morse' | 'voice_chatter' | 'siren' | 'classic_arabic';
}

export interface PursuitOption {
  id: string;
  text: string;
  description: string;
  skillType?: PlayerSkillType;
  minSkillLevel?: number;
  successRate: number;
  successOutcome: string;
  failureOutcome: string;
  threatDeltaSuccess: number;
  threatDeltaFailure: number;
  xpReward: number;
}

export interface PursuitEvent {
  id: string;
  title: string;
  subtitle: string;
  locationName: string;
  dangerAlert: string;
  narrative: string;
  options: PursuitOption[];
}

// 1. Forensic Lab Artifact Types
export interface ForensicArtifact {
  id: string;
  name: string;
  category: string;
  era: string;
  description: string;
  examinedWithUV: boolean;
  dustedForFingerprints: boolean;
  chemicallyCleaned: boolean;
  microscopeAnalyzed: boolean;
  revealedSecretText?: string;
  revealedFingerprint?: string;
  authenticityStatus?: 'genuine' | 'counterfeit_smuggler' | 'unknown';
  associatedClue: string;
}

// 2. Safe Cracking Types
export interface SafeLockPuzzle {
  id: string;
  title: string;
  targetCombination: [number, number, number];
  currentDial: number;
  unlockedStages: boolean[];
  lootItem: InventoryItem;
  secretDocument: string;
}

// 3. Suspect Interrogation Types
export interface SuspectDialogueOption {
  id: string;
  tactic: 'pressure' | 'bargain' | 'present_evidence' | 'bluff';
  label: string;
  requiredClueId?: string;
  minSkill?: { type: PlayerSkillType; value: number };
  response: string;
  confessionBreakthrough: boolean;
  unlockedClue?: string;
  tensionChange: number;
}

export interface SuspectProfile {
  id: string;
  name: string;
  alias: string;
  role: string;
  location: string;
  suspicionLevel: number; // 0 to 100
  confessed: boolean;
  alibi: string;
  contradiction: string;
  dialogueOptions: SuspectDialogueOption[];
}

// 4. Stealth & Infiltration Types
export interface StealthAction {
  id: string;
  title: string;
  description: string;
  noiseLevel: number; // 0 to 100
  detectionChance: number; // 0 to 100
  rewardDescription: string;
  skillType: PlayerSkillType;
}

// 5. Curse of Pharaohs Trial Types
export interface CursePuzzleStep {
  id: string;
  hieroglyphPrompt: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

