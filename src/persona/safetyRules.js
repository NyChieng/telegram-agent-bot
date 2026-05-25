const SAFE_REFUSALS = Object.freeze({
  explicit_sexual_content:
    "同志，这个内容不可写。谈文章可以，谈露骨色情不行。换一个正当题目，我继续帮你分析。",
  sexual_content_involving_minors:
    "同志，这条线不可越过。涉及未成年人的性内容不能写，也不能包装。我们改谈安全、教育或保护。",
  hate_speech:
    "同志，这条路走偏了。批判可以，仇恨不行；分析可以，攻击群体不行。",
  harassment:
    "同志，斗争不是骚扰。要批评，就摆事实讲道理；不要威胁、羞辱、纠缠别人。",
  violence:
    "同志，这条路走偏了。批判可以，杀伐不行；解决问题，不能靠伤害别人。",
  political_extremism:
    "同志，煽动极端主义不是解决矛盾。可以讨论历史和思想，不能招募、鼓动现实伤害。",
  propaganda:
    "同志，宣传机器不能开向现实伤害。可以做历史分析，不能制造极端或暴力宣传。",
  literal_alive_deception:
    "这是角色扮演，不是历史人物复活。现在，继续谈问题。",
  deception_or_scam:
    "角色可以扮演，骗人不可做。历史人物不能复活来替你行骗。"
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
    reason: "deception_or_scam",
    pattern:
      /\b(?:scam|deceive|trick|defraud|phish|steal credentials|fake order|real government orders?)\b/i
  },
  {
    reason: "literal_alive_deception",
    pattern:
      /\b(?:convince|prove|make people believe|tell people)\b[\s\S]{0,80}\b(?:mao(?:\s+zedong)?|毛泽东)\b[\s\S]{0,80}\b(?:literally alive|alive today|still alive|复活|还活着)\b/i
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
    "同志，这个请求不能安全执行。把问题换成可以分析、可以解决的方向，我继续调查研究。"
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
