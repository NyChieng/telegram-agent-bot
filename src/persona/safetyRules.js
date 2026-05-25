const SAFE_REFUSALS = Object.freeze({
  explicit_sexual_content:
    "Aiyo, kopitiam table not for explicit content lah. I can help rewrite it clean or funny instead.",
  sexual_content_involving_minors:
    "Cannot, comrade. Anything sexual with minors is fully off-limits. I can help with a safe non-sexual scene.",
  hate_speech:
    "No hate campaign here lah. We can criticize ideas or behavior without attacking protected groups.",
  harassment:
    "This one too attack-mode. I can help make it firm, funny, and non-harassing.",
  violence:
    "Cannot plan harm. Put down the parang metaphorically and we solve the real problem safely.",
  political_extremism:
    "No extremist recruitment from this kopitiam. I can help with neutral history or safety-focused analysis.",
  real_person_impersonation:
    "I am fictional Mao-Kopitiam Bot, not the real Mao Zedong. Parody helper can, impersonation cannot.",
  propaganda:
    "No real-world propaganda machine here lah. I can help write neutral analysis or a clearly fictional parody."
});

const RULES = [
  {
    reason: "sexual_content_involving_minors",
    test: (text) => hasMinorReference(text) && hasSexualReference(text)
  },
  {
    reason: "explicit_sexual_content",
    pattern:
      /\b(?:porn|explicit sex|sexual scene|erotic|nude|nudes|blowjob|handjob|deepthroat|hardcore|rape fantasy)\b/i
  },
  {
    reason: "real_person_impersonation",
    pattern:
      /\b(?:pretend|act|reply|speak|write)\s+as\s+(?:the\s+real\s+)?mao(?:\s+zedong)?\b|\b(?:impersonate|be)\s+(?:the\s+real\s+)?mao(?:\s+zedong)?\b/i
  },
  {
    reason: "propaganda",
    pattern:
      /\b(?:write|generate|make|create)\b[\s\S]{0,80}\b(?:propaganda|political manifesto|campaign speech)\b|\bpropaganda\b[\s\S]{0,80}\b(?:praising|supporting|promoting|recruiting)\b/i
  },
  {
    reason: "political_extremism",
    pattern:
      /\b(?:extremist political movement|violent extremist|terrorist group|supremacist movement|recruit people into an extremist|radicalize|jihadist recruitment|nazi recruitment)\b/i
  },
  {
    reason: "violence",
    pattern:
      /\b(?:how to|help me|plan to|tell me how to|instructions to)\b[\s\S]{0,80}\b(?:kill|murder|assassinate|bomb|stab|shoot|beat up|hurt|poison)\b/i
  },
  {
    reason: "hate_speech",
    pattern:
      /\b(?:hate speech|racial slur|inferior race|dehumanize|gas all|exterminate all)\b/i
  },
  {
    reason: "harassment",
    pattern:
      /\b(?:dox|doxx|harass|bully|humiliate)\b[\s\S]{0,80}\b(?:classmate|coworker|teacher|boss|person|user|him|her|them)\b/i
  }
];

export function checkSafety(input = "") {
  const text = String(input).trim();

  if (!text) {
    return { allowed: true, reason: null, reply: null };
  }

  const matchedRule = RULES.find((rule) => {
    if (typeof rule.test === "function") {
      return rule.test(text);
    }

    return rule.pattern.test(text);
  });

  if (!matchedRule) {
    return { allowed: true, reason: null, reply: null };
  }

  return {
    allowed: false,
    reason: matchedRule.reason,
    reply: getSafeRefusal(matchedRule.reason)
  };
}

export function getSafeRefusal(reason) {
  return (
    SAFE_REFUSALS[reason] ??
    "I cannot help with that safely, but I can redirect to safe, practical help lah."
  );
}

function hasSexualReference(text) {
  return /\b(?:sex|sexual|porn|erotic|nude|explicit|molest|abuse)\b/i.test(text);
}

function hasMinorReference(text) {
  return /\b(?:minor|child|children|kid|underage|teen|student|1[0-7]\s*(?:year[- ]?old|yo)|[0-9]\s*(?:year[- ]?old|yo))\b/i.test(
    text
  );
}
