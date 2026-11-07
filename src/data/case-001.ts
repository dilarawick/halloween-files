import clockImg from "@/assets/mystery/evidence-clock.jpg";
import phoneImg from "@/assets/mystery/evidence-phone.jpg";
import footprintsImg from "@/assets/mystery/evidence-footprints.jpg";
import noteImg from "@/assets/mystery/evidence-note.jpg";
import studySceneImg from "@/assets/mystery/scene-study.jpg";
import sophiaImg from "@/assets/mystery/suspect-sophia.jpg";
import danielImg from "@/assets/mystery/suspect-daniel.jpg";
import evelynImg from "@/assets/mystery/suspect-evelyn.svg";
import charlotteImg from "@/assets/mystery/suspect-charlotte.svg";

export { studySceneImg, clockImg, phoneImg, footprintsImg, noteImg, sophiaImg, danielImg, evelynImg, charlotteImg };

export type SuspectId = "sophia" | "daniel" | "evelyn" | "charlotte";
export type EvidenceId = "E-01" | "E-02" | "E-03" | "E-04";

export type Evidence = {
  id: EvidenceId;
  name: string;
  summary: string;
  description: string;
  inspection: string[];
  discoveredAt: string;
  relatedSuspects: SuspectId[];
  image: string;
  tag: string;
};

export type Suspect = {
  id: SuspectId;
  name: string;
  role: string;
  claim: string;
  image: string;
  status: string;
  alibiTime: string;
  contradictionHint?: string;
  questions: { q: string; a: string }[];
  evidenceResponses: Partial<Record<EvidenceId, { prompt: string; response: string }>>;
};


export type TimelineEvent = {
  time: string;
  minutes: number;
  event: string;
  source: string;
  note: string;
};

export type AccusationInput = {
  suspectId: SuspectId | "";
  clockExplanation: string;
  noteInterpretation: string;
  disappearanceExplanation: string;
};

export type CaseSolution = {
  responsibleId: SuspectId;
  responsibleName: string;
  motive: string;
  whatHappened: string;
  whyClockStopped: string;
  whyMessageToCharlotte: string;
  hiddenNoteMeaning: string;
  whoLeftFootprints: string;
  suspectFits: Record<SuspectId, string>;
  keyClueChecks: { label: string; met: (a: AccusationInput) => boolean; detail: string }[];
};

export const CASE = {
  id: "CASE 001",
  title: "THE LAST MESSAGE",
  location: "Blackwood House",
  date: "31 October",
  intro:
    'On 31 October at Blackwood House, 24-year-old Oliver Reed mysteriously disappears from his locked study during a Halloween party. Before disappearing, he sends a message: "If anything happens tonight, check the clock."',
  discovery: [
    "Oliver is missing.",
    "His phone is on the desk.",
    "The window is locked.",
    "The grandfather clock is five minutes behind.",
  ],
  objective:
    "Investigate the case, examine evidence, question suspects, compare the timeline, and submit your final accusation.",
};

export const SUSPECTS: Suspect[] = [
  {
    id: "sophia",
    name: "Sophia Miller",
    role: "Oliver's girlfriend",
    claim: "Claims she was in the kitchen. Says she never went near the study.",
    image: sophiaImg,
    status: "Witness · Inconsistent Alibi",
    alibiTime: "10:45 PM in Manor Kitchen",
    contradictionHint: "Claims she heard clock chime at 10:45 PM — impossible if clock halted at 10:40 PM.",
    questions: [
      {
        q: "Where were you at 10:45 PM?",
        a: "In the kitchen, helping with drinks. I heard the grandfather clock chime around then, so I remember the time.",
      },
      {
        q: "Did you speak with Oliver after 10:30 PM?",
        a: "No. He seemed stressed and went back toward the study after the argument earlier.",
      },
      {
        q: "Did you notice anyone heading toward the library?",
        a: "I wasn't near the hall for long, but I did hear hurried steps while the music was low.",
      },
    ],
    evidenceResponses: {
      "E-01": {
        prompt: "The clock stopped at 10:40 PM.",
        response:
          "Stopped? That can't be. I could swear I heard it chime at 10:45. Maybe I mixed up the sound with another clock in the house.",
      },
      "E-02": {
        prompt: "Oliver texted Charlotte at 10:55 PM.",
        response:
          "To Charlotte? After their argument? He must have been trying to warn her — or accuse her. He wouldn't message her for no reason.",
      },
    },
  },
  {
    id: "daniel",
    name: "Daniel Carter",
    role: "Oliver's best friend",
    claim: "Claims he was outside. Says he saw someone walking towards the library.",
    image: danielImg,
    status: "Witness · Corroborates Footprints",
    alibiTime: "10:40–11:00 PM Outside Grounds",
    contradictionHint: "Saw someone heading into library corridor in darkness, matching E-03 trail.",
    questions: [
      {
        q: "What were you doing outside?",
        a: "Getting air after the party got loud. I stayed near the side path for a few minutes.",
      },
      {
        q: "Who did you see walking toward the library?",
        a: "I couldn't make out the face clearly in the dark, but I saw someone moving quickly from the study side toward the library corridor.",
      },
      {
        q: "Did Oliver seem afraid of anyone?",
        a: "He was tense all night. He kept checking his phone and said he might have to deal with a family problem.",
      },
    ],
    evidenceResponses: {
      "E-03": {
        prompt: "Muddy footprints lead from the study to the library.",
        response:
          "That fits what I saw. The person I noticed was moving with purpose, like they didn't want to be stopped.",
      },
      "E-02": {
        prompt: "Oliver sent his last message at 10:55 PM.",
        response:
          "Then he was still able to act after the clock issue. If he messaged Charlotte, maybe he wanted her to find something near the clock.",
      },
    },
  },
  {
    id: "evelyn",
    name: "Mrs. Evelyn",
    role: "Housekeeper",
    claim: "Claims she was cleaning upstairs. Says the grandfather clock was working perfectly earlier.",
    image: evelynImg,
    status: "Key Witness · Estate Caretaker",
    alibiTime: "10:00–11:00 PM Upper Floor",
    contradictionHint: "Confirmed clock was in perfect mechanical condition — confirming deliberate human sabotage.",
    questions: [
      {
        q: "When did you last check the grandfather clock?",
        a: "Before the main party rush. It was keeping time perfectly, as it always does when it's wound properly.",
      },
      {
        q: "Could someone stop the clock without tools?",
        a: "Yes. If you know the mechanism, you can interrupt the pendulum or stop the hands deliberately. It wouldn't take long.",
      },
      {
        q: "Did you see Charlotte or Oliver arguing?",
        a: "I heard raised voices earlier. Charlotte looked upset when she left that part of the house.",
      },
    ],
    evidenceResponses: {
      "E-01": {
        prompt: "The clock stopped at 10:40 PM.",
        response:
          "Then someone interfered with it. That clock doesn't simply fail at a convenient moment, especially not tonight.",
      },
      "E-04": {
        prompt: 'A note behind the clock reads "You promised you would never tell."',
        response:
          "Behind the clock? Someone hid that deliberately. Oliver asking people to check the clock suddenly makes sense.",
      },
    },
  },
  {
    id: "charlotte",
    name: "Charlotte Reed",
    role: "Oliver's sister",
    claim: "Admits she argued with Oliver. Claims she did not see him after 10:30 PM.",
    image: charlotteImg,
    status: "Prime Suspect · Motive & Opportunity",
    alibiTime: "Unaccounted after 10:30 PM",
    contradictionHint: "Received Oliver's 10:55 PM warning. Direct party to the hidden note promise.",
    questions: [
      {
        q: "What was the argument about?",
        a: "Family matters. Oliver was pushing me about something private. I left because I didn't want to make a scene.",
      },
      {
        q: "Did you receive Oliver's 10:55 PM message?",
        a: "I saw it later, when everyone was panicking. I didn't understand why he sent it to me.",
      },
      {
        q: "Why would Oliver tell people to check the clock?",
        a: "I don't know. He liked being dramatic when he was upset.",
      },
    ],
    evidenceResponses: {
      "E-02": {
        prompt: "Oliver sent you the message at 10:55 PM.",
        response:
          "That doesn't prove I was with him. He could have sent it to anyone. Maybe he wanted me to feel guilty.",
      },
      "E-03": {
        prompt: "Footprints lead from the study toward the library.",
        response:
          "Plenty of people walked through the house tonight. It's Halloween — shoes get muddy outside.",
      },
      "E-04": {
        prompt: 'The hidden note says "You promised you would never tell."',
        response:
          "That's not... it could mean anything. Oliver collected old notes and papers. You can't pin that on me.",
      },
      "E-01": {
        prompt: "The clock was deliberately stopped at 10:40 PM.",
        response:
          "I wasn't near that clock at 10:40. I told you, I didn't see him after 10:30.",
      },
    },
  },
];

export const EVIDENCE: Evidence[] = [
  {
    id: "E-01",
    name: "The Broken Clock",
    summary: "The grandfather clock stopped at 10:40 PM.",
    description: "The grandfather clock stopped at 10:40 PM. Its mechanism was deliberately interrupted.",
    image: clockImg,
    tag: "Physical Evidence · Clock Mechanism",
    inspection: [
      "The hands are frozen at 10:40 PM.",
      "The pendulum shows signs of deliberate interference rather than natural failure.",
      "The clock is about five minutes behind the expected time when discovered.",
      "Oliver's message told others to check the clock — making it a key reference point, not a coincidence.",
    ],
    discoveredAt: "Study",
    relatedSuspects: ["evelyn", "charlotte", "sophia"],
  },
  {
    id: "E-02",
    name: "The Phone",
    summary: "Oliver's final message was sent at 10:55 PM to Charlotte.",
    description: "Oliver's final message was sent at 10:55 PM to Charlotte.",
    image: phoneImg,
    tag: "Digital Record · Sent Message",
    inspection: [
      'Message content: "If anything happens tonight, check the clock."',
      "Sent at 10:55 PM to Charlotte Reed.",
      "The phone was left on the desk in the study, but the message timestamp is after the clock stopped.",
      "The recipient matters: Oliver chose to point Charlotte to the clock.",
    ],
    discoveredAt: "Study desk",
    relatedSuspects: ["charlotte", "sophia", "daniel"],
  },
  {
    id: "E-03",
    name: "The Footprints",
    summary: "Muddy footprints lead from the study towards the library.",
    description: "Muddy footprints lead from the study towards the library.",
    image: footprintsImg,
    tag: "Forensic Trail · Movement Path",
    inspection: [
      "The prints begin near the study doorway.",
      "They continue along the corridor toward the library.",
      "The mud suggests someone stepped outside earlier, then moved through the house.",
      "Daniel reported seeing someone walking toward the library; the prints support movement in that direction.",
    ],
    discoveredAt: "Hallway to library",
    relatedSuspects: ["daniel", "charlotte"],
  },
  {
    id: "E-04",
    name: "The Hidden Note",
    summary: "A note behind the grandfather clock.",
    description: 'A note discovered behind the grandfather clock reads: "You promised you would never tell."',
    image: noteImg,
    tag: "Motive · Concealed Manuscript",
    inspection: [
      'Handwritten message: "You promised you would never tell."',
      "Hidden behind the grandfather clock, not visible during a casual search.",
      "The hiding place connects the note to Oliver's warning to check the clock.",
      "The message implies a secret between Oliver and someone who feared exposure.",
    ],
    discoveredAt: "Behind the grandfather clock",
    relatedSuspects: ["charlotte", "oliver" as unknown as SuspectId],
  },
];

export const TIMELINE: TimelineEvent[] = [
  {
    time: "10:30 PM",
    minutes: 630,
    event: "Charlotte claims she last saw Oliver.",
    source: "Charlotte Reed",
    note: "She admits they argued. This is the last time she places herself with Oliver, but other clues suggest later contact.",
  },
  {
    time: "10:40 PM",
    minutes: 640,
    event: "The grandfather clock stopped.",
    source: "E-01",
    note: "The mechanism was deliberately interrupted, making this a staged or manipulated time marker.",
  },
  {
    time: "10:45 PM",
    minutes: 645,
    event: "Sophia claims she heard the clock chime.",
    source: "Sophia Miller",
    note: "This conflicts with E-01. If the clock stopped at 10:40 PM, it could not reliably chime at 10:45 PM.",
  },
  {
    time: "10:55 PM",
    minutes: 655,
    event: "Oliver's final message was sent.",
    source: "E-02",
    note: "Oliver texted Charlotte: \"If anything happens tonight, check the clock.\" He was still able to act after 10:40 PM.",
  },
  {
    time: "11:15 PM",
    minutes: 675,
    event: "Oliver's disappearance was discovered.",
    source: "Case report",
    note: "Guests entered the locked study and found Oliver missing, phone on desk, window locked, and clock behind time.",
  },
];

export const SOLUTION: CaseSolution = {
  responsibleId: "charlotte",
  responsibleName: "Charlotte Reed",
  motive:
    "Charlotte feared Oliver would expose a serious family secret after their argument. The hidden note — \"You promised you would never tell\" — was Charlotte's plea to Oliver, showing she had something damaging to hide and a reason to silence him before the truth came out.",
  whatHappened:
    "After arguing with Oliver around 10:30 PM, Charlotte returned to the study. At 10:40 PM she deliberately stopped the grandfather clock to confuse the timeline and draw suspicion away from the real sequence of events. She confronted Oliver about the secret and forced or lured him out of the study toward the library. Oliver left his phone behind but managed to send Charlotte a warning at 10:55 PM: \"If anything happens tonight, check the clock.\" He was trying to direct investigators to the tampered clock and the hidden note. Charlotte moved him into a concealed area off the library corridor, causing his disappearance to be discovered at 11:15 PM when guests finally entered the study.",
  whyClockStopped:
    "Charlotte deliberately interrupted the clock's mechanism at 10:40 PM. She wanted to create confusion around the timing of events and make later witness statements harder to trust. The stopped clock also became the clue Oliver pointed to in his final message.",
  whyMessageToCharlotte:
    "Oliver sent the message to Charlotte because she was the person threatening to keep the secret buried. The message was a breadcrumb for investigators and a warning to Charlotte: checking the clock would expose the tampering and lead to the hidden note behind it.",
  hiddenNoteMeaning:
    "The note, \"You promised you would never tell,\" was connected to Charlotte's secret. It shows Oliver knew something Charlotte desperately wanted concealed, giving Charlotte motive and explaining why Oliver's final clue centered on the clock where the note was hidden.",
  whoLeftFootprints:
    "Charlotte left the muddy footprints. After stepping outside earlier, she moved Oliver from the study toward the library, leaving a trail that matched Daniel's sighting of someone walking quickly toward the library corridor.",
  suspectFits: {
    sophia:
      "Sophia's kitchen alibi may be broadly true, but her claim that she heard the clock chime at 10:45 PM conflicts with E-01. The clock stopped at 10:40 PM, so her statement is unreliable — likely a mistaken assumption or an attempt to sound certain.",
    daniel:
      "Daniel's account fits the physical evidence. He was outside and saw someone moving toward the library. He did not identify Charlotte in the dark, but his observation supports the footprint trail in E-03.",
    evelyn:
      "Mrs. Evelyn's statement helps establish the clock's condition. By saying the grandfather clock was working perfectly earlier, she supports the conclusion that it was deliberately stopped at 10:40 PM rather than failing on its own.",
    charlotte:
      "Charlotte had motive, opportunity, and the strongest connection to the evidence. She admits the argument, lies by omission about not seeing Oliver after 10:30 PM, is the recipient of the 10:55 PM message, is tied to the hidden note's meaning, and her movement explains the footprints toward the library.",
  },
  keyClueChecks: [
    {
      label: "Identified Charlotte as responsible",
      met: (a) => a.suspectId === "charlotte",
      detail: "Charlotte is the only suspect whose motive, opportunity, and contradictions fit all four evidence items.",
    },
    {
      label: "Explained the broken clock",
      met: (a) => /10:40|tamper|deliber|stop|interrupt|clock/i.test(a.clockExplanation),
      detail: "The clock was deliberately stopped at 10:40 PM to confuse the timeline and became the focus of Oliver's warning.",
    },
    {
      label: "Interpreted the hidden note",
      met: (a) => /secret|promise|tell|blackmail|expos|hide/i.test(a.noteInterpretation),
      detail: "The note points to a secret Charlotte begged Oliver not to reveal, establishing motive.",
    },
    {
      label: "Explained the disappearance",
      met: (a) => /library|move|forc|lure|hid|conceal|footprint|10:55/i.test(a.disappearanceExplanation),
      detail: "Oliver was moved from the study toward the library after 10:40 PM; he sent the 10:55 PM message before being concealed, leading to the 11:15 PM discovery.",
    },
  ],
};

export const INITIAL_ACCUSATION: AccusationInput = {
  suspectId: "",
  clockExplanation: "",
  noteInterpretation: "",
  disappearanceExplanation: "",
};

export const CASE_STORAGE_KEY = "halloween-files-case-001-v1";
