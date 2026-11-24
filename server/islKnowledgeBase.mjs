/**
 * ISL Knowledge Base for SignBridge MCP Server.
 * Source: Indian Sign Language Research and Training Centre (ISLRTC),
 * Ministry of Social Justice and Empowerment, Government of India.
 */

export const VERIFIED_ISL_SIGNS = [
  {
    id: 'namaste',
    name: 'Namaste / Hello',
    category: 'Greetings',
    meaning: 'Traditional respectful greeting in Indian Sign Language.',
    instructions: 'Bring both hands together in front of the chest with open flat palms pressed together, accompanied by a polite nod.',
    poseTip: 'Keep both forearms angled naturally, palms touching at chest height with fingers pointing upward (~45°).',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Official Dictionary Vol 1',
    isVerified: true,
    classifierSupported: true,
    handshapeType: 'two-handed',
    mediaReference: {
      type: 'illustration',
      description: 'Two flat palms pressed together at mid-chest in namaste pose with slight head tilt.',
      url: 'https://islrtc.nic.in/vocabulary/greetings/namaste'
    },
    synonyms: ['hello', 'hi', 'namaste', 'greetings', 'vanakkam', 'namaskaram', 'aadaab']
  },
  {
    id: 'thank-you',
    name: 'Thank You',
    category: 'Common Phrases',
    meaning: 'Expressing gratitude in Indian Sign Language.',
    instructions: 'Place the fingertips of the dominant flat hand lightly against the lips/chin, then move the hand outward towards the person with a gentle nod.',
    poseTip: 'Start with dominant flat hand fingertips touching the chin/lower lip, palm facing inward; move smoothly outward and down slightly towards your conversational partner.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Official Dictionary Vol 1',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'one-handed',
    mediaReference: {
      type: 'illustration',
      description: 'Dominant flat hand touching chin then moving outward towards listener.',
      url: 'https://islrtc.nic.in/vocabulary/phrases/thank-you'
    },
    synonyms: ['thank you', 'thanks', 'gratitude', 'dhanyavaad', 'shukriya', 'thank']
  },
  {
    id: 'help',
    name: 'Help / Assistance',
    category: 'Help',
    meaning: 'Requesting or offering assistance.',
    instructions: 'Rest a closed dominant fist (thumb extended upright) onto the open palm of the non-dominant hand; lift both hands upwards slightly.',
    poseTip: 'Non-dominant palm faces up horizontally. Dominant fist with thumbs-up rests firmly on the open palm, and both hands make a gentle upward lifting movement.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Official Dictionary Vol 2',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'two-handed',
    mediaReference: {
      type: 'illustration',
      description: 'Dominant "A" fist resting on open non-dominant flat palm, lifted upwards.',
      url: 'https://islrtc.nic.in/vocabulary/help/assistance'
    },
    synonyms: ['help', 'assist', 'assistance', 'support', 'aid', 'emergency', 'help me']
  },
  {
    id: 'please-wait',
    name: 'Please Wait',
    category: 'Common Phrases',
    meaning: 'Asking the conversational partner to pause or hold on.',
    instructions: 'Hold dominant hand open with palm facing forward, fingers together, and make a gentle downward pressing pulse.',
    poseTip: 'Dominant hand held at chest level with open palm facing forward towards the person. Pulse gently downward once or twice.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Official Dictionary Vol 1',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'one-handed',
    mediaReference: {
      type: 'illustration',
      description: 'Open dominant palm facing outward with gentle downward pulse.',
      url: 'https://islrtc.nic.in/vocabulary/phrases/please-wait'
    },
    synonyms: ['wait', 'please wait', 'hold on', 'pause', 'one moment']
  },
  {
    id: 'where-room',
    name: 'Where is Room / Classroom?',
    category: 'Directions',
    meaning: 'Inquiring about room location on campus.',
    instructions: 'Point index finger forward in inquiry, then outline the vertical corners of a room with both hands while displaying an inquiring facial expression.',
    poseTip: 'Use both flat hands with palms facing each other to designate walls, followed by pointing or outward question gesture.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Campus Signs Collection',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'compound',
    mediaReference: {
      type: 'illustration',
      description: 'Two hands framing rectangular room space followed by open palms inquiry.',
      url: 'https://islrtc.nic.in/vocabulary/campus/room'
    },
    synonyms: ['room', 'classroom', 'where is room', 'where room', 'class', 'hall']
  },
  {
    id: 'fee-counter',
    name: 'Fee Counter / Accounts',
    category: 'Campus',
    meaning: 'Locating the student fee payment counter or accounts section.',
    instructions: 'Rub dominant thumb and index finger together (sign for money), followed by a flat hand designating a counter surface.',
    poseTip: 'Dominant thumb and index rub together twice, then dominant flat hand moves horizontally across to indicate counter/desk.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Institutional Glossary',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'compound',
    mediaReference: {
      type: 'illustration',
      description: 'Money rub sign followed by flat surface indicating counter.',
      url: 'https://islrtc.nic.in/vocabulary/campus/fee-counter'
    },
    synonyms: ['fee', 'fees', 'fee counter', 'accounts', 'payment', 'cash counter', 'admission fee']
  },
  {
    id: 'library',
    name: 'Library',
    category: 'Campus',
    meaning: 'Campus book repository, study hall, and reference desk.',
    instructions: 'Hold both palms facing inward and sweep outward as if opening a large textbook.',
    poseTip: 'Both flat hands touch pinky edges together, then open outward with palms facing up like an open book.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Education Vocabulary',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'two-handed',
    mediaReference: {
      type: 'illustration',
      description: 'Two hands opening outward from pinky contact imitating open book pages.',
      url: 'https://islrtc.nic.in/vocabulary/campus/library'
    },
    synonyms: ['library', 'books', 'book bank', 'reading room', 'study hall']
  },
  {
    id: 'yes',
    name: 'Yes / Agree',
    category: 'Common Phrases',
    meaning: 'Affirmative response or agreement.',
    instructions: 'Form a loose fist and nod it vertically up and down from the wrist like a nodding head.',
    poseTip: 'Dominant fist held at shoulder height, pivoting up and down at the wrist twice.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Official Dictionary Vol 1',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'one-handed',
    mediaReference: {
      type: 'illustration',
      description: 'Single fist pivoting up and down at wrist in agreement.',
      url: 'https://islrtc.nic.in/vocabulary/phrases/yes'
    },
    synonyms: ['yes', 'agree', 'correct', 'right', 'ok', 'okay', 'sure']
  },
  {
    id: 'no',
    name: 'No / Disagree',
    category: 'Common Phrases',
    meaning: 'Negative response or disagreement.',
    instructions: 'Extend index finger and wave it gently side-to-side with a slight head shake.',
    poseTip: 'Index finger pointing upward, sweeping left and right from the wrist.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Official Dictionary Vol 1',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'one-handed',
    mediaReference: {
      type: 'illustration',
      description: 'Index finger extended upright and moving side-to-side.',
      url: 'https://islrtc.nic.in/vocabulary/phrases/no'
    },
    synonyms: ['no', 'disagree', 'incorrect', 'not', 'never', 'refuse']
  },
  {
    id: 'medical-assistance',
    name: 'Medical Assistance / Clinic',
    category: 'Help',
    meaning: 'Requesting first aid, doctor, or health clinic support.',
    instructions: 'Touch middle two fingers of dominant hand to the inner wrist of non-dominant arm (taking pulse sign), then lift both hands in open inquiry.',
    poseTip: 'Place dominant index and middle fingertips gently on non-dominant wrist pulse point.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Healthcare Vocabulary',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'two-handed',
    mediaReference: {
      type: 'illustration',
      description: 'Two fingers placed on wrist pulse followed by help sign.',
      url: 'https://islrtc.nic.in/vocabulary/health/medical'
    },
    synonyms: ['medical', 'doctor', 'clinic', 'first aid', 'hospital', 'nurse', 'medicine', 'sick', 'emergency medical']
  },
  {
    id: 'reception-desk',
    name: 'Reception / Information Desk',
    category: 'Campus',
    meaning: 'Information desk or front visitor counter.',
    instructions: 'Point index finger to ear and mouth (sign for inquire/speak) followed by flat hand indicating front desk.',
    poseTip: 'Touch ear/chin area gently and sweep flat open palm forward horizontally.',
    sourceUrl: 'https://islrtc.nic.in',
    sourceName: 'ISLRTC Campus Signs Collection',
    isVerified: true,
    classifierSupported: false,
    handshapeType: 'compound',
    mediaReference: {
      type: 'illustration',
      description: 'Information sign followed by horizontal counter sign.',
      url: 'https://islrtc.nic.in/vocabulary/campus/reception'
    },
    synonyms: ['reception', 'receptionist', 'front desk', 'information', 'enquiry', 'help desk', 'counter']
  }
];

// Numerals 0 to 9
export const ISL_NUMBERS = [
  { id: 'num-0', name: 'Number 0', value: '0', category: 'Numbers', meaning: 'ISL numeral 0', instructions: 'Form a round closed "0" circle with all fingertips meeting thumb tip.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-1', name: 'Number 1', value: '1', category: 'Numbers', meaning: 'ISL numeral 1', instructions: 'Extend dominant index finger straight up; curl other fingers and thumb in.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-2', name: 'Number 2', value: '2', category: 'Numbers', meaning: 'ISL numeral 2', instructions: 'Extend index and middle fingers in upright V; fold other fingers and thumb.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-3', name: 'Number 3', value: '3', category: 'Numbers', meaning: 'ISL numeral 3', instructions: 'Extend index, middle, and ring fingers upright; fold pinky with thumb.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-4', name: 'Number 4', value: '4', category: 'Numbers', meaning: 'ISL numeral 4', instructions: 'Extend 4 fingers upright; fold thumb across palm.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-5', name: 'Number 5', value: '5', category: 'Numbers', meaning: 'ISL numeral 5', instructions: 'Extend all 5 fingers open wide with palm facing outward.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-6', name: 'Number 6', value: '6', category: 'Numbers', meaning: 'ISL numeral 6', instructions: 'Touch thumb tip to pinky tip while keeping index, middle, ring upright.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-7', name: 'Number 7', value: '7', category: 'Numbers', meaning: 'ISL numeral 7', instructions: 'Touch thumb tip to ring finger tip while keeping index, middle, pinky upright.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-8', name: 'Number 8', value: '8', category: 'Numbers', meaning: 'ISL numeral 8', instructions: 'Touch thumb tip to middle finger tip while keeping index, ring, pinky upright.', handshapeType: 'one-handed', isVerified: true },
  { id: 'num-9', name: 'Number 9', value: '9', category: 'Numbers', meaning: 'ISL numeral 9', instructions: 'Touch thumb tip to index finger tip (OK ring) while keeping middle, ring, pinky upright.', handshapeType: 'one-handed', isVerified: true }
];

// Alphabet A to Z
export const ISL_ALPHABET = [
  { letter: 'A', name: 'Letter A', summary: 'Fist with thumb upright along side', poseTip: 'Curl all 4 fingers into a tight fist. Keep your thumb pointing straight up resting against the outer side of your index knuckle.', distinctionTip: 'Thumb stays on the side, NOT wrapped across the front (which is S).' },
  { letter: 'B', name: 'Letter B', summary: 'Four fingers straight up, thumb across palm', poseTip: 'Extend index, middle, ring, and pinky straight up touching together. Fold thumb flat across your palm.', distinctionTip: 'Keep all four fingers touching parallel.' },
  { letter: 'C', name: 'Letter C', summary: 'Curved open "C" cup profile', poseTip: 'Curve all fingers and thumb in an open arc facing sideways, like grasping a glass.', distinctionTip: 'Keep an open gap between thumb and fingertips (touching is O).' },
  { letter: 'D', name: 'Letter D', summary: 'Index straight up, thumb touches middle pad', poseTip: 'Point index finger straight up. Curl middle, ring, pinky down, with thumb touching middle fingertip.', distinctionTip: 'Only index points up.' },
  { letter: 'E', name: 'Letter E', summary: 'All fingers hooked tightly down onto thumb', poseTip: 'Curl all 4 fingertips down tightly so their tips press directly onto the top edge of your folded thumb.', distinctionTip: 'Thumb is tucked horizontally beneath all fingertips.' },
  { letter: 'F', name: 'Letter F', summary: 'Index and thumb form circle, other 3 up', poseTip: 'Touch index tip to thumb tip to form an "OK" circle. Keep middle, ring, and pinky extended straight up and spread.', distinctionTip: 'Opposite of D.' },
  { letter: 'G', name: 'Letter G', summary: 'Index pointing sideways, thumb parallel', poseTip: 'Turn hand sideways. Point index finger horizontally to the side, with thumb extended parallel above it.', distinctionTip: 'Only 1 finger points sideways.' },
  { letter: 'H', name: 'Letter H', summary: 'Index & middle together pointing sideways', poseTip: 'Extend both index and middle fingers together horizontally sideways. Fold ring and pinky into palm.', distinctionTip: 'Two fingers together sideways.' },
  { letter: 'I', name: 'Letter I', summary: 'Only pinky extended straight up', poseTip: 'Extend pinky straight up. Curl index, middle, ring into a fist with thumb folded over them.', distinctionTip: 'Only pinky is up.' },
  { letter: 'J', name: 'Letter J', summary: 'Pinky traces a "J" curve in the air', poseTip: 'Start with pinky up (like I) and draw a small curved "J" hook in the air from the wrist.', distinctionTip: 'Traces motion from I.' },
  { letter: 'K', name: 'Letter K', summary: 'Index up, middle forward/up, thumb between', poseTip: 'Index straight up, middle finger angled slightly forward/up, thumb tip placed between them at the knuckle.', distinctionTip: 'Thumb rests between index and middle.' },
  { letter: 'L', name: 'Letter L', summary: 'Index up, thumb extended sideways (~90°)', poseTip: 'Index finger straight up, thumb pointing horizontally outward to form an "L" shape. Other 3 fingers curled.', distinctionTip: 'Distinct 90° angle between thumb and index.' },
  { letter: 'M', name: 'Letter M', summary: '3 fingers folded over thumb', poseTip: 'Fold index, middle, and ring fingers down over your thumb so thumb peeks between ring and pinky.', distinctionTip: 'Three fingers over thumb.' },
  { letter: 'N', name: 'Letter N', summary: '2 fingers folded over thumb', poseTip: 'Fold index and middle fingers down over thumb so thumb peeks between middle and ring.', distinctionTip: 'Two fingers over thumb.' },
  { letter: 'O', name: 'Letter O', summary: 'All fingertips touch thumb tip forming "O"', poseTip: 'Curve all five fingers so all fingertips touch the thumb tip, creating a closed circle.', distinctionTip: 'Closed circle (C is open).' },
  { letter: 'P', name: 'Letter P', summary: 'K shape pointing downward', poseTip: 'Form K shape (index and middle with thumb between) and aim fingers downward towards the floor.', distinctionTip: 'Points downward.' },
  { letter: 'Q', name: 'Letter Q', summary: 'G shape pointing downward', poseTip: 'Index and thumb pointing downward like a downward pinch. Other fingers curled into palm.', distinctionTip: 'Index and thumb aim downward.' },
  { letter: 'R', name: 'Letter R', summary: 'Index and middle crossed together', poseTip: 'Extend index and middle straight up and cross middle over index finger (cross your fingers for luck).', distinctionTip: 'Fingers crossed.' },
  { letter: 'S', name: 'Letter S', summary: 'Fist with thumb across front of knuckles', poseTip: 'Make a tight fist and wrap your thumb horizontally across the front surface of your curled fingers.', distinctionTip: 'Thumb is on the FRONT surface (A is on the side).' },
  { letter: 'T', name: 'Letter T', summary: 'Thumb tucked between index and middle', poseTip: 'Make a fist with thumb tip wedged between index and middle knuckles.', distinctionTip: 'Thumb peeks between index & middle.' },
  { letter: 'U', name: 'Letter U', summary: 'Index and middle straight up touching parallel', poseTip: 'Extend index and middle fingers straight up held close together (touching). Thumb folded across palm.', distinctionTip: 'Fingers touching parallel (V is spread).' },
  { letter: 'V', name: 'Letter V', summary: 'Index and middle straight up spread in "V"', poseTip: 'Extend index and middle fingers straight up spread apart like a peace / victory sign.', distinctionTip: 'Fingers spread apart (U is touching).' },
  { letter: 'W', name: 'Letter W', summary: 'Index, middle, ring spread in "W"', poseTip: 'Extend index, middle, and ring fingers straight up and spread apart. Thumb holds pinky down.', distinctionTip: 'Three spread fingers.' },
  { letter: 'X', name: 'Letter X', summary: 'Index finger hooked / crooked', poseTip: 'Bend index finger at the first knuckle into a pirate hook. All other fingers curled into palm.', distinctionTip: 'Hooked index finger.' },
  { letter: 'Y', name: 'Letter Y', summary: 'Thumb and pinky extended wide ("shaka")', poseTip: 'Extend thumb and pinky wide to the sides. Keep index, middle, ring curled tightly into palm.', distinctionTip: '"Hang loose" / shaka shape.' },
  { letter: 'Z', name: 'Letter Z', summary: 'Index finger traces a "Z" path in the air', poseTip: 'Point index finger forward and trace the letter "Z" in the air from left to right, down-left, and right.', distinctionTip: 'Index pointing motion.' }
];

/**
 * Search ISL knowledge base for words or signs matching the query.
 */
export function searchIslVocabulary(query, category) {
  const clean = (query || '').trim().toLowerCase();
  if (!clean) {
    return {
      query: '',
      found: false,
      totalMatches: 0,
      matches: [],
      canBeFingerspelled: false,
      fingerspellingLetters: []
    };
  }

  const matches = [];

  // 1. Search verified signs
  for (const sign of VERIFIED_ISL_SIGNS) {
    if (category && category.toLowerCase() !== 'all' && sign.category.toLowerCase() !== category.toLowerCase()) {
      continue;
    }

    const matchesName = sign.name.toLowerCase().includes(clean);
    const matchesMeaning = sign.meaning.toLowerCase().includes(clean);
    const matchesInstructions = sign.instructions.toLowerCase().includes(clean);
    const matchesSynonyms = sign.synonyms?.some(s => s.toLowerCase() === clean || clean.includes(s.toLowerCase()));

    if (matchesName || matchesMeaning || matchesInstructions || matchesSynonyms) {
      matches.push({
        id: sign.id,
        name: sign.name,
        category: sign.category,
        meaning: sign.meaning,
        instructions: sign.instructions,
        poseTip: sign.poseTip,
        handshapeType: sign.handshapeType,
        isVerified: sign.isVerified,
        sourceName: sign.sourceName,
        sourceUrl: sign.sourceUrl,
        hasVisualMedia: !!sign.mediaReference,
        mediaReference: sign.mediaReference
      });
    }
  }

  // 2. Search numbers
  for (const num of ISL_NUMBERS) {
    if (category && category.toLowerCase() !== 'all' && category.toLowerCase() !== 'numbers') {
      continue;
    }
    if (clean === num.value || clean === num.name.toLowerCase() || num.name.toLowerCase().includes(clean)) {
      matches.push({
        id: num.id,
        name: num.name,
        category: 'Numbers',
        meaning: num.meaning,
        instructions: num.instructions,
        handshapeType: num.handshapeType,
        isVerified: num.isVerified,
        sourceName: 'ISLRTC Official Dictionary Vol 1',
        sourceUrl: 'https://islrtc.nic.in',
        hasVisualMedia: true,
        mediaReference: {
          type: 'illustration',
          description: `Hand showing numeral ${num.value}`,
          url: `https://islrtc.nic.in/numerals/${num.value}`
        }
      });
    }
  }

  // 3. Search alphabet letters
  for (const alpha of ISL_ALPHABET) {
    if (category && category.toLowerCase() !== 'all' && category.toLowerCase() !== 'alphabet') {
      continue;
    }
    if (clean === alpha.letter.toLowerCase() || clean === alpha.name.toLowerCase() || alpha.name.toLowerCase().includes(clean)) {
      matches.push({
        id: `letter-${alpha.letter.toLowerCase()}`,
        name: alpha.name,
        category: 'Alphabet',
        meaning: `Fingerspelling letter ${alpha.letter} in ISL`,
        instructions: alpha.poseTip,
        poseTip: alpha.poseTip,
        distinctionTip: alpha.distinctionTip,
        handshapeType: 'one-handed',
        isVerified: true,
        sourceName: 'ISLRTC Official Dictionary Vol 1',
        sourceUrl: 'https://islrtc.nic.in',
        hasVisualMedia: true,
        mediaReference: {
          type: 'illustration',
          description: `Hand posture for letter ${alpha.letter}: ${alpha.summary}`,
          url: `https://islrtc.nic.in/alphabet/${alpha.letter}`
        }
      });
    }
  }

  // Check if query is a word that can be fingerspelled letter-by-letter
  const lettersOnly = clean.replace(/[^a-z]/g, '').toUpperCase();
  const canBeFingerspelled = lettersOnly.length > 0 && lettersOnly.length <= 15;
  const fingerspellingLetters = canBeFingerspelled ? lettersOnly.split('') : [];

  return {
    query: clean,
    found: matches.length > 0,
    totalMatches: matches.length,
    matches,
    canBeFingerspelled,
    fingerspellingLetters
  };
}

/**
 * Get comprehensive details for a specific sign ID.
 */
export function getSignDetailsById(signId) {
  const cleanId = (signId || '').trim().toLowerCase();
  if (!cleanId) {
    return {
      found: false,
      sign_id: '',
      message: 'Sign ID is required'
    };
  }

  // Check verified signs
  const sign = VERIFIED_ISL_SIGNS.find(s => 
    s.id.toLowerCase() === cleanId || 
    s.name.toLowerCase() === cleanId ||
    s.synonyms?.some(syn => syn.toLowerCase() === cleanId)
  );
  if (sign) {
    return {
      found: true,
      sign: {
        id: sign.id,
        name: sign.name,
        category: sign.category,
        meaning: sign.meaning,
        instructions: sign.instructions,
        poseTip: sign.poseTip,
        handshapeType: sign.handshapeType,
        isVerified: sign.isVerified,
        sourceName: sign.sourceName,
        sourceUrl: sign.sourceUrl,
        mediaReference: sign.mediaReference
      }
    };
  }

  // Check numbers
  const num = ISL_NUMBERS.find(n => n.id.toLowerCase() === cleanId || n.value === cleanId || n.name.toLowerCase() === cleanId);
  if (num) {
    return {
      found: true,
      sign: {
        id: num.id,
        name: num.name,
        category: 'Numbers',
        meaning: num.meaning,
        instructions: num.instructions,
        handshapeType: num.handshapeType,
        isVerified: num.isVerified,
        sourceName: 'ISLRTC Official Dictionary Vol 1',
        sourceUrl: 'https://islrtc.nic.in',
        mediaReference: {
          type: 'illustration',
          description: `Hand posture for numeral ${num.value}`,
          url: `https://islrtc.nic.in/numerals/${num.value}`
        }
      }
    };
  }

  // Check alphabet
  const alpha = ISL_ALPHABET.find(a => 
    a.letter.toLowerCase() === cleanId || 
    `letter-${a.letter.toLowerCase()}` === cleanId ||
    a.name.toLowerCase() === cleanId
  );
  if (alpha) {
    return {
      found: true,
      sign: {
        id: `letter-${alpha.letter.toLowerCase()}`,
        name: alpha.name,
        category: 'Alphabet',
        meaning: `Fingerspelling letter ${alpha.letter} in ISL`,
        instructions: alpha.poseTip,
        poseTip: alpha.poseTip,
        distinctionTip: alpha.distinctionTip,
        handshapeType: 'one-handed',
        isVerified: true,
        sourceName: 'ISLRTC Official Dictionary Vol 1',
        sourceUrl: 'https://islrtc.nic.in',
        mediaReference: {
          type: 'illustration',
          description: `Hand posture for letter ${alpha.letter}: ${alpha.summary}`,
          url: `https://islrtc.nic.in/alphabet/${alpha.letter}`
        }
      }
    };
  }

  return {
    found: false,
    sign_id: signId,
    message: `Sign "${signId}" is not currently in the verified ISLRTC dataset. You can fingerspell it letter-by-letter using the ISL camera recognition.`
  };
}

/**
 * Format a clear, dignified, and accessible message for non-signing recipients.
 */
export function formatAccessibleCommunicationMessage({ requirement, context, urgency = 'normal' }) {
  const req = (requirement || '').trim();
  const ctx = (context || 'general').trim().toLowerCase();
  const isUrgent = urgency.toLowerCase() === 'urgent' || /emergency|urgent|immediate|pain|doctor|police/i.test(req);

  let recipient = 'Staff / Counter Assistant';
  let title = 'Assistance Request';

  if (/reception|receptionist|front desk/i.test(req) || ctx.includes('reception')) {
    recipient = 'Receptionist';
    title = 'Front Desk Inquiry';
  } else if (/medical|doctor|nurse|clinic|first aid|sick|pain|hospital/i.test(req) || ctx.includes('medical')) {
    recipient = 'Medical / Clinic Staff';
    title = 'Healthcare / Medical Request';
  } else if (/fee|payment|counter|accounts|cash/i.test(req) || ctx.includes('fee')) {
    recipient = 'Accounts & Fee Counter';
    title = 'Fee Payment Request';
  } else if (/library|book|reading/i.test(req) || ctx.includes('library')) {
    recipient = 'Librarian / Library Desk';
    title = 'Library Services Request';
  } else if (/room|classroom|direction|where/i.test(req) || ctx.includes('room')) {
    recipient = 'Campus Information Desk';
    title = 'Directions & Room Inquiry';
  }

  // Construct dignified, high-contrast readable statement
  let accessibleStatement = '';
  if (isUrgent) {
    accessibleStatement = `URGENT ASSISTANCE NEEDED:\n"Hello, I am Deaf / Hard-of-Hearing. I require immediate assistance regarding: ${req}. Please write your response or guide me."`;
  } else {
    accessibleStatement = `Hello, I communicate using Indian Sign Language (ISL).\n\nRequest:\n"${req}"\n\nPlease reply by typing here, writing on paper, or pointing in the appropriate direction. Thank you for your assistance!`;
  }

  return {
    success: true,
    originalRequirement: req,
    context: ctx,
    isUrgent,
    recipientType: recipient,
    displayTitle: title,
    accessibleMessage: accessibleStatement,
    suggestedActions: [
      'Show this message on full screen to the counter staff',
      'Copy message to clipboard',
      'Have counter staff type their reply in the SignBridge composer'
    ],
    cardDisplay: {
      header: `${isUrgent ? '⚠️ URGENT — ' : ''}${title}`,
      addressedTo: recipient,
      body: req,
      instructionsForRecipient: 'Please read the request above. You may type your reply in this window or write it down.'
    }
  };
}
