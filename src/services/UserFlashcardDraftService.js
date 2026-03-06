const STORAGE_KEY = "enarm_user_flashcards_v1";

const reviewIntervalsInDays = {
  0: 1,
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14
};

const parseStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStored = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
};

export default class UserFlashcardDraftService {
  static listAll() {
    return parseStored();
  }

  static listDue() {
    const now = new Date().toISOString();
    return parseStored().filter((item) => !item.next_review_at || item.next_review_at <= now);
  }

  static create({ question, answer, category }) {
    const now = new Date().toISOString();
    const entry = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      question,
      answer,
      category: category || "",
      source: "local",
      created_at: now,
      next_review_at: now,
      last_quality: null
    };

    const data = parseStored();
    data.unshift(entry);
    saveStored(data);
    return entry;
  }

  static review(id, quality) {
    const data = parseStored();
    const idx = data.findIndex((item) => item.id === id);
    if (idx === -1) return null;

    const days = reviewIntervalsInDays[quality] ?? 1;
    data[idx] = {
      ...data[idx],
      last_quality: quality,
      next_review_at: addDays(new Date(), days)
    };

    saveStored(data);
    return data[idx];
  }
}
