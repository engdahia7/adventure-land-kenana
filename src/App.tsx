import React, { useState, useEffect } from 'react';
import {
  GameLocationId,
  GameState,
  Hotspot,
  DialogueOption,
  InventoryItem,
  JournalEntry,
  DeductionRecipe,
  PlayerCustomization,
  SkillReward,
} from './types';
import {
  gameLocations,
  initialInventory,
  initialJournalEntries,
  puzzlesData,
  initialPlayerCustomization,
  initialPlayerSkills,
} from './data/gameData';
import { soundManager } from './audio/soundManager';
import { NavigationHeader } from './components/NavigationHeader';
import { SceneViewer } from './components/SceneViewer';
import { DialogueBox } from './components/DialogueBox';
import { EgyptMapModal } from './components/EgyptMapModal';
import { InventoryModal } from './components/InventoryModal';
import { JournalModal } from './components/JournalModal';
import { PuzzleModal } from './components/PuzzleModal';
import { VictoryModal } from './components/VictoryModal';
import { CharacterCustomizerModal } from './components/CharacterCustomizerModal';
import { EvidenceBoardModal } from './components/EvidenceBoardModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { CliffhangerModal } from './components/CliffhangerModal';
import {
  dailyMissions,
  loadDailyProgress,
  saveDailyProgress,
  syncProgressWithCalendar,
  createInitialDailyProgress,
  getTodayDateString,
} from './data/dailyMissionsData';
import { DailyProgressState, SuspenseTrapEvent, SecretTelegram } from './types';
import { AdventureEventModal } from './components/AdventureEventModal';
import { adventureEventsData } from './data/adventureEventsData';
import { SuspenseTrapModal } from './components/SuspenseTrapModal';
import { SecretTelegramsModal } from './components/SecretTelegramsModal';
import { SpyRadioScannerModal } from './components/SpyRadioScannerModal';
import { PursuitEncounterModal } from './components/PursuitEncounterModal';
import { suspenseTrapsData } from './data/suspenseTrapsData';
import { secretTelegramsData } from './data/secretTelegramsData';
import { pursuitEventsData } from './data/pursuitEventsData';
import {
  initialForensicArtifacts,
  suspectsData,
  defaultSafePuzzle,
} from './data/newGameplaySystemsData';
import { ForensicArtifactLabModal } from './components/ForensicArtifactLabModal';
import { SafeCrackingModal } from './components/SafeCrackingModal';
import { SuspectInterrogationModal } from './components/SuspectInterrogationModal';
import { StealthInfiltrationModal } from './components/StealthInfiltrationModal';
import { NileTrainChaseModal } from './components/NileTrainChaseModal';
import { CurseTrialModal } from './components/CurseTrialModal';
import {
  AdventureEvent,
  AdventureEventChoice,
  PursuitEvent,
  ForensicArtifact,
  SuspectProfile,
  SafeLockPuzzle,
} from './types';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      currentLocationId: 'cairo',
      unlockedLocations: ['cairo'],
      inventory: initialInventory,
      journal: initialJournalEntries,
      discoveredClues: [
        'أول خيط: فك شفرة حجر البازلت في خان الخليلي لاستخراج جزء البردية الأول.',
      ],
      solvedPuzzles: [],
      solvedDeductions: [],
      characterTrust: {
        radwan: 65,
        laila: 60,
        salama: 60,
        mansour: 55,
        spirit_thoth: 70,
      },
      activeCharacter: null,
      activePuzzle: null,
      chapter: 1,
      totalChapters: 5,
      gameCompleted: false,
      player: initialPlayerCustomization,
      skills: initialPlayerSkills,
      dailyProgress: loadDailyProgress(),
      threatLevel: 45,
      secretTelegrams: secretTelegramsData,
      unreadTelegramsCount: 1,
    };
  });

  const [dailyProgress, setDailyProgress] = useState<DailyProgressState>(() => loadDailyProgress());
  const [isDailyMissionsOpen, setIsDailyMissionsOpen] = useState<boolean>(false);
  const [activeCliffhangerDay, setActiveCliffhangerDay] = useState<number | null>(null);

  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isCharacterCustomizerOpen, setIsCharacterCustomizerOpen] = useState<boolean>(false);
  const [isEvidenceBoardOpen, setIsEvidenceBoardOpen] = useState<boolean>(false);
  const [activeAdventureEvent, setActiveAdventureEvent] = useState<AdventureEvent | null>(null);
  const [completedAdventureEvents, setCompletedAdventureEvents] = useState<string[]>([]);
  const [activeTrap, setActiveTrap] = useState<SuspenseTrapEvent | null>(null);
  const [isTelegramsOpen, setIsTelegramsOpen] = useState<boolean>(false);
  const [isRadioScannerOpen, setIsRadioScannerOpen] = useState<boolean>(false);
  const [activePursuitEvent, setActivePursuitEvent] = useState<PursuitEvent | null>(null);
  const [isForensicLabOpen, setIsForensicLabOpen] = useState<boolean>(false);
  const [isSafeCrackingOpen, setIsSafeCrackingOpen] = useState<boolean>(false);
  const [isSuspectsOpen, setIsSuspectsOpen] = useState<boolean>(false);
  const [isStealthOpen, setIsStealthOpen] = useState<boolean>(false);
  const [isNileTrainOpen, setIsNileTrainOpen] = useState<boolean>(false);
  const [isCurseTrialOpen, setIsCurseTrialOpen] = useState<boolean>(false);
  const [forensicArtifacts, setForensicArtifacts] = useState<ForensicArtifact[]>(initialForensicArtifacts);
  const [suspectsList, setSuspectsList] = useState<SuspectProfile[]>(suspectsData);
  const [safePuzzleData, setSafePuzzleData] = useState<SafeLockPuzzle>(defaultSafePuzzle);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; sub?: string } | null>(null);

  // Sync daily missions with real-world calendar on mount & every minute
  useEffect(() => {
    setDailyProgress((prev) => {
      const synced = syncProgressWithCalendar(prev);
      saveDailyProgress(synced);
      return synced;
    });

    const timer = setInterval(() => {
      setDailyProgress((prev) => {
        const synced = syncProgressWithCalendar(prev);
        saveDailyProgress(synced);
        return synced;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Complete a stage for a specific day and check for cliffhanger condition
  const completeDailyStage = (dayNum: number, stageNum: number) => {
    setDailyProgress((prev) => {
      const dayData = prev.days[dayNum] || {
        dayNumber: dayNum,
        status: 'in_progress',
        completedStages: [],
        cliffhangerSeen: false,
      };

      if (dayData.completedStages.includes(stageNum)) {
        return prev;
      }

      const updatedStages = [...dayData.completedStages, stageNum].sort();
      const isDayNowFinished = updatedStages.length >= 3;

      let newStatus = dayData.status;
      let completedAtTimestamp = dayData.completedAtTimestamp;
      let completedDateString = dayData.completedDateString;

      if (isDayNowFinished) {
        newStatus = 'completed';
        completedAtTimestamp = Date.now();
        completedDateString = getTodayDateString(prev.simulatedDayOffset);
      } else if (newStatus === 'locked' || newStatus === 'unlocked') {
        newStatus = 'in_progress';
      }

      const updated: DailyProgressState = {
        ...prev,
        days: {
          ...prev.days,
          [dayNum]: {
            ...dayData,
            status: newStatus,
            completedStages: updatedStages,
            completedAtTimestamp,
            completedDateString,
          },
        },
      };

      saveDailyProgress(updated);

      if (isDayNowFinished) {
        setTimeout(() => {
          setActiveCliffhangerDay(dayNum);
        }, 900);
      } else {
        soundManager.playStageCompleteSFX();
        showToast(`أنجزت المرحلة ${stageNum} من اليوم ${dayNum}!`);
      }

      return updated;
    });
  };

  // Fast forward / simulated day advance
  const handleAdvanceSimulatedDay = () => {
    setDailyProgress((prev) => {
      const newOffset = (prev.simulatedDayOffset || 0) + 1;
      const updated = syncProgressWithCalendar({
        ...prev,
        simulatedDayOffset: newOffset,
      });
      saveDailyProgress(updated);
      showToast('تمت محاكاة حلول فجر الغد بنجاح!', 'اليوم التالي أصبح متاحاً الآن للاستكمال.');
      return updated;
    });
  };

  const handleResetDailyProgress = () => {
    const initial = createInitialDailyProgress();
    setDailyProgress(initial);
    saveDailyProgress(initial);
    showToast('تمت إعادة ضبط سجل الأيام إلى اليوم الأول.');
  };

  const handleNavigateToDailyStage = (
    locationId: GameLocationId,
    actionType: string,
    targetId?: string
  ) => {
    setGameState((prev) => {
      const isUnlocked = prev.unlockedLocations.includes(locationId);
      return {
        ...prev,
        currentLocationId: locationId,
        unlockedLocations: isUnlocked ? prev.unlockedLocations : [...prev.unlockedLocations, locationId],
      };
    });

    if (actionType === 'puzzle' && targetId) {
      setTimeout(() => {
        handleOpenPuzzle(targetId);
      }, 350);
    } else if (actionType === 'dialogue' && targetId) {
      setTimeout(() => {
        handleOpenDialogue(targetId);
      }, 350);
    } else if (actionType === 'evidence') {
      setTimeout(() => {
        setIsEvidenceBoardOpen(true);
      }, 350);
    }
  };

  const currentLocation =
    gameLocations.find((loc) => loc.id === gameState.currentLocationId) || gameLocations[0];

  // Update background ambient audio on location change
  useEffect(() => {
    soundManager.playLocationAmbient(currentLocation.ambientSound);
  }, [currentLocation.id]);

  // Show transient toast notifications
  const showToast = (message: string, sub?: string) => {
    setNotification({ message, sub });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleOpenDialogue = (characterId: string) => {
    const char = currentLocation.characters.find((c) => c.id === characterId);
    if (char) {
      setGameState((prev) => ({ ...prev, activeCharacter: char }));

      // Complete daily mission dialogue stage
      if (characterId === 'radwan') completeDailyStage(1, 2);
      else if (characterId === 'laila') completeDailyStage(2, 2);
      else if (characterId === 'salama') completeDailyStage(3, 2);
      else if (characterId === 'mansour') completeDailyStage(4, 2);
      else if (characterId === 'spirit_thoth') completeDailyStage(5, 2);
    }
  };

  const handleOpenPuzzle = (puzzleId: string) => {
    const pz = puzzlesData[puzzleId];
    if (pz) {
      setGameState((prev) => ({ ...prev, activePuzzle: pz }));
    }
  };

  const handleHotspotSelect = (hotspot: Hotspot) => {
    switch (hotspot.actionType) {
      case 'dialogue':
        if (hotspot.targetId) {
          handleOpenDialogue(hotspot.targetId);
        }
        break;

      case 'puzzle':
        if (hotspot.targetId) {
          handleOpenPuzzle(hotspot.targetId);
        }
        break;

      case 'evidence':
        setIsEvidenceBoardOpen(true);
        if (currentLocation.id === 'luxor') {
          completeDailyStage(2, 1);
        }
        break;

      case 'inspect':
        soundManager.playDiscoverySFX();
        if (hotspot.id === 'hotspot_cairo_basalt') completeDailyStage(1, 1);
        else if (hotspot.id === 'hotspot_nilometer') completeDailyStage(3, 1);
        else if (hotspot.id === 'hotspot_sphinx_paws') completeDailyStage(4, 1);
        else if (hotspot.id === 'hotspot_golden_altar') completeDailyStage(5, 3);

        if (hotspot.clueReward) {
          setGameState((prev) => {
            const hasClue = prev.discoveredClues.includes(hotspot.clueReward!);
            const updatedClues = hasClue
              ? prev.discoveredClues
              : [...prev.discoveredClues, hotspot.clueReward!];

            const newEntry: JournalEntry = {
              id: `inspect_${Date.now()}`,
              title: `فحص أثري: ${hotspot.title}`,
              location: currentLocation.title,
              timestamp: 'أثناء الاستكشاف',
              content: hotspot.clueReward!,
              category: 'نقش هيروغليفي',
            };

            return {
              ...prev,
              discoveredClues: updatedClues,
              journal: [newEntry, ...prev.journal],
            };
          });

          showToast(`تم فحص: ${hotspot.title}`, hotspot.clueReward);
        }
        break;

      case 'travel':
        setIsMapOpen(true);
        break;

      case 'trap':
        handleTriggerEmergencyTrap(hotspot.targetId);
        break;
    }
  };

  const handleDialogueOption = (option: DialogueOption) => {
    if (option.gainClue) {
      setGameState((prev) => {
        const hasClue = prev.discoveredClues.includes(option.gainClue!);
        return {
          ...prev,
          discoveredClues: hasClue
            ? prev.discoveredClues
            : [...prev.discoveredClues, option.gainClue!],
        };
      });
      showToast('قرينة جديدة سُجلت بالمفكرة', option.gainClue);
    }

    // Trust Update
    if (option.trustChange && gameState.activeCharacter) {
      const charId = gameState.activeCharacter.id;
      setGameState((prev) => ({
        ...prev,
        characterTrust: {
          ...prev.characterTrust,
          [charId]: (prev.characterTrust[charId] || 60) + option.trustChange!,
        },
      }));
    }

    // Skill Reward Update from interactive dialogue choices
    if (option.skillReward) {
      const { skill, amount, label } = option.skillReward;
      setGameState((prev) => {
        const currentSkills = prev.skills || initialPlayerSkills;
        const newScore = Math.min(100, currentSkills[skill] + amount);
        const historyEntry = {
          skill,
          amount,
          reason: label || option.storyImpact || 'خيار حواري ذكي ومؤثر',
          timestamp: currentLocation.title.split(' ')[0],
        };

        return {
          ...prev,
          skills: {
            ...currentSkills,
            [skill]: newScore,
            skillHistory: [historyEntry, ...currentSkills.skillHistory],
          },
        };
      });

      const skillNameArabic =
        option.skillReward.skill === 'negotiation'
          ? 'التفاوض'
          : option.skillReward.skill === 'exploration'
          ? 'الاستكشاف'
          : 'الدفاع';

      showToast(
        `تطور المهارة: +${option.skillReward.amount} في ${skillNameArabic}`,
        option.storyImpact || option.skillReward.label
      );
    }
  };

  const handlePuzzleSolve = (
    rewardItem: InventoryItem,
    rewardClue: string,
    skillReward?: SkillReward
  ) => {
    soundManager.playTriumphSFX();

    let nextLocationToUnlock: GameLocationId | null = null;
    let nextChapter = gameState.chapter;

    if (gameState.activePuzzle?.id === 'cairo_cipher' || gameState.activePuzzle?.id === 'cleopatra_cartouche_cipher') {
      nextLocationToUnlock = 'luxor';
      nextChapter = 2;
    } else if (
      gameState.activePuzzle?.id === 'luxor_sun_dial' ||
      gameState.activePuzzle?.id === 'maat_scales' ||
      gameState.activePuzzle?.id === 'tutankhamun_canopic_chest' ||
      gameState.activePuzzle?.id === 'dendera_astronomy_zodiac'
    ) {
      nextLocationToUnlock = 'aswan';
      nextChapter = 3;
    } else if (
      gameState.activePuzzle?.id === 'aswan_stargazer' ||
      gameState.activePuzzle?.id === 'alexandria_lighthouse_cipher'
    ) {
      nextLocationToUnlock = 'giza';
      nextChapter = 4;
    } else if (
      gameState.activePuzzle?.id === 'giza_seal' ||
      gameState.activePuzzle?.id === 'pyramid_builder' ||
      gameState.activePuzzle?.id === 'khufu_hydraulic_secret' ||
      gameState.activePuzzle?.id === 'sphinx_eternal_riddle'
    ) {
      nextLocationToUnlock = 'secret_chamber';
      nextChapter = 5;
    }

    setGameState((prev) => {
      const isAlreadyInInv = prev.inventory.some((i) => i.id === rewardItem.id);
      const newInventory = isAlreadyInInv ? prev.inventory : [...prev.inventory, rewardItem];

      const newUnlockedLocations =
        nextLocationToUnlock && !prev.unlockedLocations.includes(nextLocationToUnlock)
          ? [...prev.unlockedLocations, nextLocationToUnlock]
          : prev.unlockedLocations;

      const newSolvedPuzzles = prev.activePuzzle
        ? [...prev.solvedPuzzles, prev.activePuzzle.id]
        : prev.solvedPuzzles;

      const newEntry: JournalEntry = {
        id: `solve_${Date.now()}`,
        title: `إنجاز لغز: ${prev.activePuzzle?.title}`,
        location: currentLocation.title,
        timestamp: 'تم بنجاح',
        content: `حصلت على ${rewardItem.name}. ${rewardClue}`,
        category: 'سر تاريخي',
      };

      const isCompleted = prev.activePuzzle?.id === 'giza_seal';

      // Apply skill reward if provided
      let updatedSkills = prev.skills || initialPlayerSkills;
      if (skillReward) {
        const { skill, amount, description } = skillReward;
        const newScore = Math.min(100, updatedSkills[skill] + amount);
        const historyEntry = {
          skill,
          amount,
          reason: description || `حل ${prev.activePuzzle?.title}`,
          timestamp: currentLocation.title.split(' ')[0],
        };
        updatedSkills = {
          ...updatedSkills,
          [skill]: newScore,
          skillHistory: [historyEntry, ...updatedSkills.skillHistory],
        };
      }

      return {
        ...prev,
        inventory: newInventory,
        unlockedLocations: newUnlockedLocations,
        solvedPuzzles: newSolvedPuzzles,
        discoveredClues: [...prev.discoveredClues, rewardClue],
        journal: [newEntry, ...prev.journal],
        chapter: Math.max(prev.chapter, nextChapter),
        currentLocationId: nextLocationToUnlock || prev.currentLocationId,
        gameCompleted: isCompleted,
        skills: updatedSkills,
      };
    });

    showToast(`حصلت على: ${rewardItem.name}`, rewardClue);

    // Daily missions puzzle stage completion
    if (gameState.activePuzzle?.id === 'cairo_cipher') {
      completeDailyStage(1, 3);
    } else if (gameState.activePuzzle?.id === 'luxor_sun_dial' || gameState.activePuzzle?.id === 'maat_scales') {
      completeDailyStage(2, 3);
    } else if (gameState.activePuzzle?.id === 'aswan_stargazer') {
      completeDailyStage(3, 3);
    } else if (gameState.activePuzzle?.id === 'pyramid_builder') {
      completeDailyStage(4, 3);
    } else if (gameState.activePuzzle?.id === 'giza_seal') {
      completeDailyStage(5, 1);
    }

    if (gameState.activePuzzle?.id === 'giza_seal') {
      setTimeout(() => {
        setIsVictoryOpen(true);
      }, 1200);
    }
  };

  const handleSolveDeduction = (recipe: DeductionRecipe) => {
    setGameState((prev) => {
      const alreadySolved = prev.solvedDeductions?.includes(recipe.id);
      if (alreadySolved) return prev;

      const newSolved = [...(prev.solvedDeductions || []), recipe.id];
      const currentSkills = prev.skills || initialPlayerSkills;
      const amount = recipe.skillBonus.amount;
      const skillName = recipe.skillBonus.skill;
      const newScore = Math.min(100, (currentSkills[skillName] || 50) + amount);

      const historyEntry = {
        skill: skillName,
        amount,
        reason: `استنتاج جنائي: ${recipe.title}`,
        timestamp: recipe.caseTitle,
      };

      const journalEntry: JournalEntry = {
        id: `deduction_${Date.now()}`,
        title: `استنتاج جنائي: ${recipe.title}`,
        location: recipe.caseTitle,
        timestamp: 'لوحة الأدلة والقرائن',
        content: `${recipe.breakthroughText} - الخيط المستنتج: ${recipe.unlockedClue}`,
        category: 'استنتاج جنائي',
      };

      return {
        ...prev,
        solvedDeductions: newSolved,
        discoveredClues: prev.discoveredClues.includes(recipe.unlockedClue)
          ? prev.discoveredClues
          : [...prev.discoveredClues, recipe.unlockedClue],
        journal: [journalEntry, ...prev.journal],
        skills: {
          ...currentSkills,
          [skillName]: newScore,
          skillHistory: [historyEntry, ...currentSkills.skillHistory],
        },
      };
    });

    showToast(
      `تم إثبات استنتاج: ${recipe.title}`,
      `+${recipe.skillBonus.amount} في مهارة ${recipe.skillBonus.skill === 'exploration' ? 'الاستكشاف' : recipe.skillBonus.skill === 'negotiation' ? 'التفاوض' : 'الدفاع'} • ${recipe.unlockedClue}`
    );
  };

  const handleUpdatePlayer = (customization: Partial<PlayerCustomization>) => {
    setGameState((prev) => ({
      ...prev,
      player: {
        ...(prev.player || initialPlayerCustomization),
        ...customization,
      },
    }));
    showToast('تم تحديث ملف المستكشف والمظهر بنجاح');
  };

  const handleTriggerAdventureEvent = (eventId?: string) => {
    soundManager.playDiscoverySFX();
    if (eventId && adventureEventsData[eventId]) {
      setActiveAdventureEvent(adventureEventsData[eventId]);
      return;
    }

    const availableEvents = Object.values(adventureEventsData).filter(
      (ev) => ev.locationId === currentLocation.id && !completedAdventureEvents.includes(ev.id)
    );

    if (availableEvents.length > 0) {
      setActiveAdventureEvent(availableEvents[0]);
    } else {
      const locationEvents = Object.values(adventureEventsData).filter(
        (ev) => ev.locationId === currentLocation.id
      );
      if (locationEvents.length > 0) {
        setActiveAdventureEvent(locationEvents[Math.floor(Math.random() * locationEvents.length)]);
      } else {
        const allEv = Object.values(adventureEventsData);
        setActiveAdventureEvent(allEv[Math.floor(Math.random() * allEv.length)]);
      }
    }
  };

  const handleResolveAdventureEvent = (
    choice: AdventureEventChoice,
    outcomeClue?: string,
    outcomeItem?: InventoryItem,
    skillReward?: SkillReward,
    trustChange?: { characterId: string; amount: number }
  ) => {
    if (activeAdventureEvent) {
      setCompletedAdventureEvents((prev) =>
        prev.includes(activeAdventureEvent.id) ? prev : [...prev, activeAdventureEvent.id]
      );
    }

    if (outcomeClue) {
      setGameState((prev) => {
        const hasClue = prev.discoveredClues.includes(outcomeClue);
        const updatedClues = hasClue ? prev.discoveredClues : [...prev.discoveredClues, outcomeClue];
        const newEntry: JournalEntry = {
          id: `adventure_${Date.now()}`,
          title: `مغامرة أثرية: ${activeAdventureEvent?.title || 'تحدي استكشافي'}`,
          location: currentLocation.title,
          timestamp: 'قرار ميداني',
          content: `${choice.text} ⟵ ${outcomeClue}`,
          category: 'مغامرة استكشافية',
        };
        return {
          ...prev,
          discoveredClues: updatedClues,
          journal: [newEntry, ...prev.journal],
        };
      });
      showToast('قرينة أثرية جديدة سُجلت بمفكرتك', outcomeClue);
    }

    if (outcomeItem) {
      setGameState((prev) => {
        const exists = prev.inventory.some((i) => i.id === outcomeItem.id);
        if (exists) return prev;
        return {
          ...prev,
          inventory: [...prev.inventory, outcomeItem],
        };
      });
      showToast(`عثرت على أثر نادر: ${outcomeItem.name}`, outcomeItem.description);
    }

    if (skillReward) {
      const { skill, amount, description } = skillReward;
      setGameState((prev) => {
        const currentSkills = prev.skills || initialPlayerSkills;
        const newScore = Math.min(100, currentSkills[skill] + amount);
        const historyEntry = {
          skill,
          amount,
          reason: description || 'قرار استكشافي شجاع',
          timestamp: currentLocation.title.split(' ')[0],
        };
        return {
          ...prev,
          skills: {
            ...currentSkills,
            [skill]: newScore,
            skillHistory: [historyEntry, ...currentSkills.skillHistory],
          },
        };
      });

      const skillName =
        skillReward.skill === 'negotiation'
          ? 'التفاوض'
          : skillReward.skill === 'exploration'
          ? 'الاستكشاف'
          : 'الدفاع';
      showToast(`+${skillReward.amount} في مهارة ${skillName}`, skillReward.description);
    }

    if (trustChange) {
      setGameState((prev) => ({
        ...prev,
        characterTrust: {
          ...prev.characterTrust,
          [trustChange.characterId]:
            (prev.characterTrust[trustChange.characterId] || 60) + trustChange.amount,
        },
      }));
    }
  };

  const handleRestartGame = () => {
    setGameState({
      currentLocationId: 'cairo',
      unlockedLocations: ['cairo'],
      inventory: initialInventory,
      journal: initialJournalEntries,
      discoveredClues: [
        'أول خيط: فك شفرة حجر البازلت في خان الخليلي لاستخراج جزء البردية الأول.',
      ],
      solvedPuzzles: [],
      solvedDeductions: [],
      characterTrust: {
        radwan: 65,
        laila: 60,
        salama: 60,
        mansour: 55,
        spirit_thoth: 70,
      },
      activeCharacter: null,
      activePuzzle: null,
      chapter: 1,
      totalChapters: 5,
      gameCompleted: false,
      player: initialPlayerCustomization,
      skills: initialPlayerSkills,
    });
    setIsVictoryOpen(false);
    showToast('بدأت مغامرة جديدة من خان الخليلي');
  };

  const handleTriggerEmergencyTrap = (trapId?: string) => {
    let chosenTrap: SuspenseTrapEvent | undefined;
    const allTraps = Object.values(suspenseTrapsData);
    if (trapId) {
      chosenTrap = suspenseTrapsData[trapId] || allTraps.find((t) => t.id === trapId);
    }
    if (!chosenTrap) {
      chosenTrap =
        allTraps.find((t) => t.locationId === gameState.currentLocationId) ||
        allTraps[Math.floor(Math.random() * allTraps.length)];
    }
    if (chosenTrap) {
      soundManager.playTrapWarningSFX();
      setActiveTrap(chosenTrap);
    }
  };

  const handleResolveTrap = (result: {
    success: boolean;
    escapedStepId: string;
    rewardItem?: InventoryItem;
    clueReward?: string;
    xpGain?: number;
    threatLevelChange?: number;
  }) => {
    setGameState((prev) => {
      let updatedInventory = prev.inventory;
      let updatedClues = prev.discoveredClues;
      let updatedJournal = prev.journal;

      if (result.rewardItem && !prev.inventory.some((i) => i.id === result.rewardItem!.id)) {
        updatedInventory = [...prev.inventory, result.rewardItem];
      }

      if (result.clueReward && !prev.discoveredClues.includes(result.clueReward)) {
        updatedClues = [...prev.discoveredClues, result.clueReward];
        const newEntry: JournalEntry = {
          id: `trap_${Date.now()}`,
          title: `وثيقة من موقع الفخ: ${activeTrap?.title || 'هروب بطولي'}`,
          location: currentLocation.title,
          timestamp: 'أثناء تفادي الفخ المميت',
          content: result.clueReward,
          category: 'استنتاج جنائي',
        };
        updatedJournal = [newEntry, ...prev.journal];
      }

      const currentDefense = prev.skills?.defense || 25;
      const currentExploration = prev.skills?.exploration || 25;
      const updatedSkills = {
        ...(prev.skills || initialPlayerSkills),
        defense: Math.min(100, currentDefense + (result.success ? 8 : 2)),
        exploration: Math.min(100, currentExploration + (result.success ? 8 : 3)),
        skillHistory: [
          {
            skill: 'defense' as const,
            amount: result.success ? 8 : 2,
            reason: result.success ? 'تفادي فخاخ المهربين بنجاح خاطف' : 'مقاومة كمين المهربين',
            timestamp: 'الآن',
          },
          ...(prev.skills?.skillHistory || []),
        ],
      };

      const newThreat = Math.max(
        10,
        Math.min(
          100,
          (prev.threatLevel ?? 45) + (result.threatLevelChange ?? (result.success ? -25 : 20))
        )
      );

      return {
        ...prev,
        inventory: updatedInventory,
        discoveredClues: updatedClues,
        journal: updatedJournal,
        skills: updatedSkills,
        threatLevel: newThreat,
      };
    });

    if (result.success) {
      soundManager.playActionSuccessSFX();
      showToast('هروب بطولي وتفادي الفخ بنجاح!', result.clueReward || 'كسبت مهارات دفاعية وأثرية جديدة');
    } else {
      soundManager.playActionFailureSFX();
      showToast('نجوت بصعوبة بالغة!', 'كادت مصيدة المهربين تفتك بك؛ تزايد خطر مطاردة شبكة العقرب!');
    }

    setActiveTrap(null);
  };

  const handleOpenTelegrams = () => {
    soundManager.playDiscoverySFX();
    setIsTelegramsOpen(true);
    setGameState((prev) => ({
      ...prev,
      unreadTelegramsCount: 0,
    }));
  };

  const handleTriggerPursuit = (pursuitId?: string) => {
    let chosen: PursuitEvent;
    if (pursuitId) {
      chosen = pursuitEventsData.find((p) => p.id === pursuitId) || pursuitEventsData[0];
    } else {
      const locId = gameState.currentLocationId;
      const matched = pursuitEventsData.find((p) => p.id.includes(locId));
      chosen = matched || pursuitEventsData[Math.floor(Math.random() * pursuitEventsData.length)];
    }
    setActivePursuitEvent(chosen);
  };

  const handleResolvePursuit = (result: {
    success: boolean;
    threatChange: number;
    xpGain: number;
    skillUsed?: string;
  }) => {
    setGameState((prev) => {
      const newThreat = Math.min(100, Math.max(10, (prev.threatLevel ?? 45) + result.threatChange));
      let updatedSkills = prev.skills;
      if (result.skillUsed && updatedSkills) {
        const sKey = result.skillUsed as 'defense' | 'exploration' | 'negotiation';
        if (updatedSkills[sKey] !== undefined) {
          updatedSkills = {
            ...updatedSkills,
            [sKey]: Math.min(100, updatedSkills[sKey] + (result.success ? 6 : 2)),
          };
        }
      }
      return {
        ...prev,
        threatLevel: newThreat,
        skills: updatedSkills,
      };
    });

    showToast(
      result.success ? 'تم الإفلات من كمين المهربين بنجاح!' : 'نجوت من المطاردة بعد اشتباك ساخن!',
      `تغير مستوى المطاردة (${result.threatChange > 0 ? '+' : ''}${result.threatChange}%) واكتساب +${result.xpGain} نقطة خبرة`
    );
  };

  const handleClueDiscoveredFromRadio = (clue: string) => {
    setGameState((prev) => {
      if (prev.discoveredClues.includes(clue)) return prev;
      return {
        ...prev,
        discoveredClues: [...prev.discoveredClues, clue],
      };
    });
    showToast('تم فك تشفير إشارة لاسلكية واعتراض قرينة سرية!', clue);
  };

  const handleItemAcquiredFromRadio = (item: InventoryItem) => {
    setGameState((prev) => {
      if (prev.inventory.some((i) => i.id === item.id)) return prev;
      return {
        ...prev,
        inventory: [...prev.inventory, item],
      };
    });
    showToast('حصلت على أداة استخباراتية جديدة!', item.name);
  };

  const handleThreatChange = (delta: number) => {
    setGameState((prev) => ({
      ...prev,
      threatLevel: Math.min(100, Math.max(10, (prev.threatLevel ?? 45) + delta)),
    }));
  };

  const currentDailyMission =
    dailyMissions.find((m) => m.dayNumber === dailyProgress.activeDay) || dailyMissions[0];
  const currentDayProgress = dailyProgress.days[currentDailyMission.dayNumber];
  const isCurrentDayDone = currentDayProgress?.status === 'completed';
  const nextUnfinishedStage =
    currentDailyMission.stages.find(
      (s) => !currentDayProgress?.completedStages.includes(s.stageNumber)
    ) || currentDailyMission.stages[currentDailyMission.stages.length - 1];

  const dailyMissionSummary = {
    dayNumber: currentDailyMission.dayNumber,
    dayTitle: currentDailyMission.title,
    stageNumber: nextUnfinishedStage.stageNumber,
    stageTitle: nextUnfinishedStage.shortDesc,
    isDayCompleted: isCurrentDayDone,
  };

  return (
    <div className="min-h-screen bg-[#0F0D0C] text-[#E6D2A8] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Navigation Bar */}
      <NavigationHeader
        currentLocation={currentLocation}
        gameState={{ ...gameState, dailyProgress }}
        onOpenDailyMissions={() => setIsDailyMissionsOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenCharacterCustomizer={() => setIsCharacterCustomizerOpen(true)}
        onOpenEvidenceBoard={() => setIsEvidenceBoardOpen(true)}
        onOpenTelegrams={handleOpenTelegrams}
        onOpenRadioScanner={() => setIsRadioScannerOpen(true)}
        onOpenForensicLab={() => setIsForensicLabOpen(true)}
        onOpenSafeCracking={() => setIsSafeCrackingOpen(true)}
        onOpenSuspects={() => setIsSuspectsOpen(true)}
        onOpenStealth={() => setIsStealthOpen(true)}
        onOpenNileTrain={() => setIsNileTrainOpen(true)}
        onOpenCurseTrial={() => setIsCurseTrialOpen(true)}
        onTriggerEmergencyTrap={() => handleTriggerEmergencyTrap()}
        onRestartGame={handleRestartGame}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Adventure Cinematic Viewport */}
      <main className="flex-1 relative flex flex-col">
        <SceneViewer
          location={currentLocation}
          threatLevel={gameState.threatLevel ?? 45}
          unreadTelegramsCount={gameState.unreadTelegramsCount ?? 0}
          onSelectHotspot={handleHotspotSelect}
          onOpenDialogue={handleOpenDialogue}
          onOpenPuzzle={handleOpenPuzzle}
          onOpenEvidenceBoard={() => setIsEvidenceBoardOpen(true)}
          onTriggerAdventureEvent={handleTriggerAdventureEvent}
          onTriggerEmergencyTrap={handleTriggerEmergencyTrap}
          onOpenTelegrams={handleOpenTelegrams}
          onOpenRadioScanner={() => setIsRadioScannerOpen(true)}
          onTriggerPursuit={() => handleTriggerPursuit()}
          dailyMissionSummary={dailyMissionSummary}
          onOpenDailyMissions={() => setIsDailyMissionsOpen(true)}
        />
      </main>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F0D0C]/95 border border-[#D4AF37] rounded-sm px-5 py-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3 text-right animate-scaleUp max-w-md w-[90%]">
          <div className="w-9 h-9 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs md:text-sm font-bold text-[#F3E5AB] font-cairo leading-tight">
              {notification.message}
            </h5>
            {notification.sub && (
              <p className="text-[11px] md:text-xs text-[#E6D2A8]/75 font-amiri mt-0.5 line-clamp-2">
                {notification.sub}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Character Customization & Egyptian Skills System Modal */}
      {isCharacterCustomizerOpen && (
        <CharacterCustomizerModal
          player={gameState.player || initialPlayerCustomization}
          skills={gameState.skills || initialPlayerSkills}
          onUpdatePlayer={handleUpdatePlayer}
          onClose={() => setIsCharacterCustomizerOpen(false)}
        />
      )}

      {/* Investigation Cases & Evidence Board Modal */}
      {isEvidenceBoardOpen && (
        <EvidenceBoardModal
          discoveredClues={gameState.discoveredClues}
          solvedDeductions={gameState.solvedDeductions || []}
          onSolveDeduction={handleSolveDeduction}
          onClose={() => setIsEvidenceBoardOpen(false)}
        />
      )}

      {/* Character Dialogue Modal */}
      {gameState.activeCharacter && (
        <DialogueBox
          character={gameState.activeCharacter}
          gameState={gameState}
          onClose={() => setGameState((prev) => ({ ...prev, activeCharacter: null }))}
          onSelectOption={handleDialogueOption}
          onOpenPuzzle={handleOpenPuzzle}
        />
      )}

      {/* Egypt Map Modal */}
      {isMapOpen && (
        <EgyptMapModal
          currentLocationId={gameState.currentLocationId}
          gameState={gameState}
          onClose={() => setIsMapOpen(false)}
          onSelectLocation={(locId) =>
            setGameState((prev) => ({ ...prev, currentLocationId: locId }))
          }
        />
      )}

      {/* Inventory Modal */}
      {isInventoryOpen && (
        <InventoryModal
          items={gameState.inventory}
          onClose={() => setIsInventoryOpen(false)}
        />
      )}

      {/* Detective Journal Modal */}
      {isJournalOpen && (
        <JournalModal
          entries={gameState.journal}
          clues={gameState.discoveredClues}
          onClose={() => setIsJournalOpen(false)}
        />
      )}

      {/* Interactive Archaeological Puzzle Modal */}
      {gameState.activePuzzle && (
        <PuzzleModal
          puzzle={gameState.activePuzzle}
          onClose={() => setGameState((prev) => ({ ...prev, activePuzzle: null }))}
          onSolve={handlePuzzleSolve}
        />
      )}

      {/* Dynamic Archaeological Adventure Event Modal */}
      {activeAdventureEvent && (
        <AdventureEventModal
          event={activeAdventureEvent}
          playerSkills={gameState.skills || initialPlayerSkills}
          onClose={() => setActiveAdventureEvent(null)}
          onResolve={handleResolveAdventureEvent}
        />
      )}

      {/* High-Stakes Suspense Trap Modal */}
      {activeTrap && (
        <SuspenseTrapModal
          trap={activeTrap}
          playerSkills={gameState.skills || initialPlayerSkills}
          onClose={() => setActiveTrap(null)}
          onResolve={handleResolveTrap}
          onSuccess={(clue, item, dangerReduction) => {
            handleResolveTrap({
              success: true,
              escapedStepId: 'escaped',
              rewardItem: item,
              clueReward: clue,
              threatLevelChange: -(dangerReduction || 25),
            });
          }}
        />
      )}

      {/* Intercepted Secret Telegrams Archive Modal */}
      {isTelegramsOpen && (
        <SecretTelegramsModal
          telegrams={gameState.secretTelegrams || secretTelegramsData}
          onClose={() => setIsTelegramsOpen(false)}
        />
      )}

      {/* Tactical Spy Radio Scanner Modal */}
      {isRadioScannerOpen && (
        <SpyRadioScannerModal
          onClose={() => setIsRadioScannerOpen(false)}
          onClueDiscovered={handleClueDiscoveredFromRadio}
          onItemAcquired={handleItemAcquiredFromRadio}
          onThreatChange={handleThreatChange}
        />
      )}

      {/* Smuggler Ambush & Pursuit Encounter Modal */}
      {activePursuitEvent && (
        <PursuitEncounterModal
          encounter={activePursuitEvent}
          playerSkills={gameState.skills || initialPlayerSkills}
          onClose={() => setActivePursuitEvent(null)}
          onResolve={handleResolvePursuit}
        />
      )}

      {/* 1. Forensic Artifact Lab Modal */}
      {isForensicLabOpen && (
        <ForensicArtifactLabModal
          artifacts={forensicArtifacts}
          onClose={() => setIsForensicLabOpen(false)}
          onClueDiscovered={(clue) => {
            handleClueDiscoveredFromRadio(clue);
          }}
          onArtifactExamined={(id, tool) => {
            setForensicArtifacts((prev) =>
              prev.map((art) => {
                if (art.id !== id) return art;
                return {
                  ...art,
                  examinedWithUV: tool === 'uv' ? true : art.examinedWithUV,
                  dustedForFingerprints: tool === 'fingerprint' ? true : art.dustedForFingerprints,
                  chemicallyCleaned: tool === 'chemical' ? true : art.chemicallyCleaned,
                  microscopeAnalyzed: tool === 'microscope' ? true : art.microscopeAnalyzed,
                };
              })
            );
          }}
        />
      )}

      {/* 2. Safe Cracking Lockpicking Modal */}
      {isSafeCrackingOpen && (
        <SafeCrackingModal
          puzzle={safePuzzleData}
          onClose={() => setIsSafeCrackingOpen(false)}
          onUnlocked={(loot, secretDoc) => {
            handleItemAcquiredFromRadio(loot);
            handleClueDiscoveredFromRadio(`وثيقة الخزينة: ${secretDoc}`);
            showToast('تم فتح خزينة الباشا بنجاح ومصادرة الصولجان والوثائق!');
          }}
        />
      )}

      {/* 3. Suspects & Interrogation Chamber Modal */}
      {isSuspectsOpen && (
        <SuspectInterrogationModal
          suspects={suspectsList}
          discoveredClues={gameState.discoveredClues}
          onClose={() => setIsSuspectsOpen(false)}
          onClueDiscovered={(clue) => {
            handleClueDiscoveredFromRadio(clue);
          }}
          onConfessionObtained={(suspectId) => {
            setSuspectsList((prev) =>
              prev.map((s) => (s.id === suspectId ? { ...s, confessed: true, suspicionLevel: 100 } : s))
            );
            handleThreatChange(-20);
            showToast('تم انتزاع اعتراف جنائي قاطع من المشتبه به!');
          }}
        />
      )}

      {/* 4. Stealth & Infiltration Modal */}
      {isStealthOpen && (
        <StealthInfiltrationModal
          onClose={() => setIsStealthOpen(false)}
          onSuccess={(xp, clue) => {
            setIsStealthOpen(false);
            handleClueDiscoveredFromRadio(clue);
            showToast('نجحت عملية التسلل في الظلال!', `+${xp} نقطة خبرة استكشاف`);
          }}
          onDetected={(threatInc) => {
            setIsStealthOpen(false);
            handleThreatChange(threatInc);
            showToast('رصدتك دورية الحراس!', `ارتفع مؤشر الخطر بمقدار +${threatInc}%`);
          }}
        />
      )}

      {/* 5. Nile Train Roof Chase Modal */}
      {isNileTrainOpen && (
        <NileTrainChaseModal
          onClose={() => setIsNileTrainOpen(false)}
          onVictory={() => {
            setIsNileTrainOpen(false);
            handleClueDiscoveredFromRadio('تم تأمين تابوت الفرعون الذهبي وإيقاف قطار الصعيد السريع!');
            showToast('انتصار ملحمي فوق قطار الصعيد!', 'تم إيقاف عملية التهريب الكبرى بنجاح');
          }}
          onThreatDelta={handleThreatChange}
        />
      )}

      {/* 6. Pharaoh Curse Escape Trial Modal */}
      {isCurseTrialOpen && (
        <CurseTrialModal
          onClose={() => setIsCurseTrialOpen(false)}
          onVictory={() => {
            setIsCurseTrialOpen(false);
            handleClueDiscoveredFromRadio('تغلبت على أختام مقبرة الفراعنة ونجوت من فخ الغاز السام!');
            handleThreatChange(-25);
            showToast('نجوت من لعنة الفراعنة!', 'انفتحت البوابة الجرانيتية وخرجت بحياتك والأثر النادر');
          }}
          onDefeat={() => {
            setIsCurseTrialOpen(false);
            handleThreatChange(30);
            showToast('كاد الغاز السام أن يقضي عليك!', 'نجوت بصعوبة وارتفع مؤشر الخطر');
          }}
        />
      )}

      {/* Grand Victory Modal */}
      {isVictoryOpen && (
        <VictoryModal
          gameState={gameState}
          onRestart={handleRestartGame}
          onClose={() => setIsVictoryOpen(false)}
        />
      )}

      {/* 5-Day Real-Time Daily Missions Modal */}
      {isDailyMissionsOpen && (
        <DailyMissionsModal
          progress={dailyProgress}
          onClose={() => setIsDailyMissionsOpen(false)}
          onNavigateToStage={handleNavigateToDailyStage}
          onShowCliffhanger={(dayNum) => {
            setActiveCliffhangerDay(dayNum);
          }}
          onAdvanceSimulatedDay={handleAdvanceSimulatedDay}
          onResetDailyProgress={handleResetDailyProgress}
        />
      )}

      {/* Dramatic Cliffhanger Modal */}
      {activeCliffhangerDay !== null && (
        <CliffhangerModal
          cliffhanger={
            dailyMissions.find((m) => m.dayNumber === activeCliffhangerDay)?.cliffhanger ||
            dailyMissions[0].cliffhanger
          }
          currentDayNumber={activeCliffhangerDay}
          nextDayNumber={Math.min(5, activeCliffhangerDay + 1)}
          isNextDayUnlocked={
            dailyProgress.days[Math.min(5, activeCliffhangerDay + 1)]?.status !== 'locked'
          }
          onAdvanceSimulatedDay={handleAdvanceSimulatedDay}
          onClose={() => setActiveCliffhangerDay(null)}
          onStartNextDay={() => {
            const nextDay = Math.min(5, activeCliffhangerDay + 1);
            setActiveCliffhangerDay(null);
            setIsDailyMissionsOpen(false);
            const nextMission = dailyMissions.find((m) => m.dayNumber === nextDay);
            if (nextMission) {
              handleNavigateToDailyStage(nextMission.locationId, 'explore');
            }
          }}
        />
      )}
    </div>
  );
}
