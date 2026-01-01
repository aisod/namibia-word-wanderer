// Oshikwanyama Language Knowledge Base
// Source: Teacher Vaskez (Mbongue Lucas Shuukifeni)

export interface VocabularyItem {
  id: string;
  english: string;
  oshikwanyama: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LanguageInfo {
  name: string;
  nativeName: string;
  speakers: string;
  regions: string[];
  description: string;
  history: string;
  funFacts: string[];
}

export const oshikwanyamaInfo: LanguageInfo = {
  name: "Oshikwanyama",
  nativeName: "Oshiwambo",
  speakers: "Approximately 1+ million speakers",
  regions: ["Kunene", "Ohangwena", "Omusati", "Oshikoto", "Oshana"],
  description: "Oshikwanyama (also called Oshiwambo) is a Bantu language belonging to the larger Niger-Congo Phylum. It is spoken in both Namibia and Angola, making it a truly cross-border language that unites communities across national boundaries.",
  history: "The Owambo people have a rich cultural heritage spanning centuries. Oshiwambo has evolved while maintaining its core structure, incorporating some loanwords from colonial languages while preserving its grammatical integrity. The language is read as it is written - making it relatively accessible for learners who master the phonetic system.",
  funFacts: [
    "Oshiwambo is one of the most widely spoken languages in Namibia",
    "The language has unique letters like NG, NGH, SH, and NY",
    "Unlike English, Oshiwambo is phonetic - words are pronounced as written",
    "The Owambo people are known for their rich cultural traditions and hospitality"
  ]
};

export const greetings: VocabularyItem[] = [
  { id: "g1", english: "Hello / How are you?", oshikwanyama: "Ongeipi", category: "greetings", difficulty: "easy" },
  { id: "g2", english: "Good morning", oshikwanyama: "Walelepo", category: "greetings", difficulty: "easy" },
  { id: "g3", english: "Good afternoon", oshikwanyama: "Wauhalapo", category: "greetings", difficulty: "easy" },
  { id: "g4", english: "Good evening", oshikwanyama: "Watokelwapo", category: "greetings", difficulty: "easy" },
  { id: "g5", english: "Hi / Fine!", oshikwanyama: "Nawa", category: "greetings", difficulty: "easy" },
  { id: "g6", english: "What is your name?", oshikwanyama: "Edina loye?", category: "greetings", difficulty: "medium" },
  { id: "g7", english: "My name is...", oshikwanyama: "Edina lange aame...", category: "greetings", difficulty: "medium" },
  { id: "g8", english: "See you tomorrow!", oshikwanyama: "Otuliweteni mongula!", category: "greetings", difficulty: "medium" },
];

export const pronouns: VocabularyItem[] = [
  { id: "p1", english: "I", oshikwanyama: "Ame", category: "pronouns", difficulty: "easy" },
  { id: "p2", english: "You", oshikwanyama: "Ove", category: "pronouns", difficulty: "easy" },
  { id: "p3", english: "He/She/It", oshikwanyama: "Ye", category: "pronouns", difficulty: "easy" },
  { id: "p4", english: "We", oshikwanyama: "Fyee", category: "pronouns", difficulty: "easy" },
  { id: "p5", english: "They", oshikwanyama: "Voo", category: "pronouns", difficulty: "easy" },
  { id: "p6", english: "Who", oshikwanyama: "Lyelye", category: "pronouns", difficulty: "medium" },
  { id: "p7", english: "What", oshikwanyama: "Oshike", category: "pronouns", difficulty: "medium" },
  { id: "p8", english: "This", oshikwanyama: "Eshi", category: "pronouns", difficulty: "medium" },
  { id: "p9", english: "That", oshikwanyama: "Shinya", category: "pronouns", difficulty: "medium" },
];

export const verbs: VocabularyItem[] = [
  { id: "v1", english: "To eat", oshikwanyama: "Lya", category: "verbs", difficulty: "easy" },
  { id: "v2", english: "To sleep", oshikwanyama: "Kofa", category: "verbs", difficulty: "easy" },
  { id: "v3", english: "To come", oshikwanyama: "Ila", category: "verbs", difficulty: "easy" },
  { id: "v4", english: "To go", oshikwanyama: "Inda", category: "verbs", difficulty: "easy" },
  { id: "v5", english: "To sing", oshikwanyama: "Imba", category: "verbs", difficulty: "easy" },
  { id: "v6", english: "To laugh", oshikwanyama: "Yola", category: "verbs", difficulty: "easy" },
  { id: "v7", english: "To write", oshikwanyama: "Shanga", category: "verbs", difficulty: "medium" },
  { id: "v8", english: "To speak", oshikwanyama: "Popya", category: "verbs", difficulty: "medium" },
  { id: "v9", english: "To see", oshikwanyama: "Tala", category: "verbs", difficulty: "medium" },
  { id: "v10", english: "To cry", oshikwanyama: "Kwena", category: "verbs", difficulty: "medium" },
  { id: "v11", english: "To swim", oshikwanyama: "Yowa", category: "verbs", difficulty: "medium" },
];

export const numbers: VocabularyItem[] = [
  { id: "n1", english: "One", oshikwanyama: "Imwe", category: "numbers", difficulty: "easy" },
  { id: "n2", english: "Two", oshikwanyama: "Mbali", category: "numbers", difficulty: "easy" },
  { id: "n3", english: "Three", oshikwanyama: "Nhatu", category: "numbers", difficulty: "easy" },
  { id: "n4", english: "Four", oshikwanyama: "Nhee", category: "numbers", difficulty: "easy" },
  { id: "n5", english: "Five", oshikwanyama: "Nhano", category: "numbers", difficulty: "easy" },
  { id: "n6", english: "Six", oshikwanyama: "Hamano", category: "numbers", difficulty: "medium" },
  { id: "n7", english: "Seven", oshikwanyama: "Heyali", category: "numbers", difficulty: "medium" },
  { id: "n8", english: "Eight", oshikwanyama: "Hetatu", category: "numbers", difficulty: "medium" },
  { id: "n9", english: "Nine", oshikwanyama: "Omuwoi", category: "numbers", difficulty: "medium" },
  { id: "n10", english: "Ten", oshikwanyama: "Omulongo", category: "numbers", difficulty: "medium" },
  { id: "n11", english: "Hundred", oshikwanyama: "Efele", category: "numbers", difficulty: "hard" },
  { id: "n12", english: "Thousand", oshikwanyama: "Eyovi", category: "numbers", difficulty: "hard" },
];

export const family: VocabularyItem[] = [
  { id: "f1", english: "Father", oshikwanyama: "Tate", category: "family", difficulty: "easy" },
  { id: "f2", english: "Mother", oshikwanyama: "Meme", category: "family", difficulty: "easy" },
  { id: "f3", english: "Son", oshikwanyama: "Monamati", category: "family", difficulty: "medium" },
  { id: "f4", english: "Daughter", oshikwanyama: "Monakadona", category: "family", difficulty: "medium" },
  { id: "f5", english: "Grandfather", oshikwanyama: "Tate Kulu", category: "family", difficulty: "medium" },
  { id: "f6", english: "Grandmother", oshikwanyama: "Meme Kulu", category: "family", difficulty: "medium" },
  { id: "f7", english: "Baby", oshikwanyama: "Okahanana", category: "family", difficulty: "easy" },
  { id: "f8", english: "Child", oshikwanyama: "Okaana", category: "family", difficulty: "easy" },
  { id: "f9", english: "Husband", oshikwanyama: "Omusamane", category: "family", difficulty: "medium" },
  { id: "f10", english: "Wife", oshikwanyama: "Omukulukadi", category: "family", difficulty: "medium" },
];

export const bodyParts: VocabularyItem[] = [
  { id: "b1", english: "Head", oshikwanyama: "Omutwe", category: "body", difficulty: "easy" },
  { id: "b2", english: "Hand", oshikwanyama: "Okuoko", category: "body", difficulty: "easy" },
  { id: "b3", english: "Ear", oshikwanyama: "Okutwi", category: "body", difficulty: "easy" },
  { id: "b4", english: "Mouth", oshikwanyama: "Okanya", category: "body", difficulty: "easy" },
  { id: "b5", english: "Neck", oshikwanyama: "Ofingo", category: "body", difficulty: "medium" },
  { id: "b6", english: "Stomach", oshikwanyama: "Edimo", category: "body", difficulty: "medium" },
  { id: "b7", english: "Heart", oshikwanyama: "Omutima", category: "body", difficulty: "easy" },
  { id: "b8", english: "Leg", oshikwanyama: "Okulu", category: "body", difficulty: "easy" },
  { id: "b9", english: "Tongue", oshikwanyama: "Elaka", category: "body", difficulty: "medium" },
  { id: "b10", english: "Eye", oshikwanyama: "Eiso", category: "body", difficulty: "easy" },
];

export const animals: VocabularyItem[] = [
  { id: "a1", english: "Cow", oshikwanyama: "Ngobe", category: "animals", difficulty: "easy" },
  { id: "a2", english: "Goat", oshikwanyama: "Shikombo", category: "animals", difficulty: "easy" },
  { id: "a3", english: "Chicken", oshikwanyama: "Xuxa", category: "animals", difficulty: "easy" },
  { id: "a4", english: "Dog", oshikwanyama: "Mbwa", category: "animals", difficulty: "easy" },
  { id: "a5", english: "Cat", oshikwanyama: "Mbishi", category: "animals", difficulty: "easy" },
  { id: "a6", english: "Lion", oshikwanyama: "Nghoshi", category: "animals", difficulty: "medium" },
  { id: "a7", english: "Elephant", oshikwanyama: "Ndjaba", category: "animals", difficulty: "medium" },
  { id: "a8", english: "Giraffe", oshikwanyama: "Nduli", category: "animals", difficulty: "medium" },
  { id: "a9", english: "Zebra", oshikwanyama: "Ngolo", category: "animals", difficulty: "medium" },
  { id: "a10", english: "Snake", oshikwanyama: "Eyoka", category: "animals", difficulty: "medium" },
];

export const nature: VocabularyItem[] = [
  { id: "na1", english: "Sun", oshikwanyama: "Etango", category: "nature", difficulty: "easy" },
  { id: "na2", english: "Moon", oshikwanyama: "Omwedhi", category: "nature", difficulty: "easy" },
  { id: "na3", english: "Water", oshikwanyama: "Omeva", category: "nature", difficulty: "easy" },
  { id: "na4", english: "Stars", oshikwanyama: "Eenyofi", category: "nature", difficulty: "easy" },
  { id: "na5", english: "Earth", oshikwanyama: "Edu", category: "nature", difficulty: "easy" },
  { id: "na6", english: "Sky", oshikwanyama: "Eulu", category: "nature", difficulty: "easy" },
  { id: "na7", english: "Rain", oshikwanyama: "Odula", category: "nature", difficulty: "medium" },
  { id: "na8", english: "River", oshikwanyama: "Omilonga", category: "nature", difficulty: "medium" },
  { id: "na9", english: "Sea", oshikwanyama: "Efuta", category: "nature", difficulty: "medium" },
  { id: "na10", english: "Fish", oshikwanyama: "Ooshi", category: "nature", difficulty: "easy" },
];

export const daysOfWeek: VocabularyItem[] = [
  { id: "d1", english: "Sunday", oshikwanyama: "Oshondaxa", category: "days", difficulty: "medium" },
  { id: "d2", english: "Monday", oshikwanyama: "Omandaxa", category: "days", difficulty: "medium" },
  { id: "d3", english: "Tuesday", oshikwanyama: "Etivali", category: "days", difficulty: "medium" },
  { id: "d4", english: "Wednesday", oshikwanyama: "Etitatu", category: "days", difficulty: "medium" },
  { id: "d5", english: "Thursday", oshikwanyama: "Etine", category: "days", difficulty: "medium" },
  { id: "d6", english: "Friday", oshikwanyama: "Etitano", category: "days", difficulty: "medium" },
  { id: "d7", english: "Saturday", oshikwanyama: "Olomakaya", category: "days", difficulty: "medium" },
];

export const food: VocabularyItem[] = [
  { id: "fo1", english: "Food", oshikwanyama: "Oikulya", category: "food", difficulty: "easy" },
  { id: "fo2", english: "Salt", oshikwanyama: "Omongwa", category: "food", difficulty: "easy" },
  { id: "fo3", english: "Sugar", oshikwanyama: "Osuuka", category: "food", difficulty: "easy" },
  { id: "fo4", english: "Bread", oshikwanyama: "Omboloto", category: "food", difficulty: "easy" },
  { id: "fo5", english: "Meat", oshikwanyama: "Ombelela", category: "food", difficulty: "easy" },
  { id: "fo6", english: "Beans", oshikwanyama: "Omakunde", category: "food", difficulty: "medium" },
  { id: "fo7", english: "Watermelon", oshikwanyama: "Enuwa", category: "food", difficulty: "medium" },
  { id: "fo8", english: "Banana", oshikwanyama: "Ebanana", category: "food", difficulty: "easy" },
  { id: "fo9", english: "Orange", oshikwanyama: "Elemuna", category: "food", difficulty: "medium" },
];

export const adverbs: VocabularyItem[] = [
  { id: "ad1", english: "Fast", oshikwanyama: "Diva", category: "adverbs", difficulty: "easy" },
  { id: "ad2", english: "Today", oshikwanyama: "Nena", category: "adverbs", difficulty: "easy" },
  { id: "ad3", english: "Yesterday", oshikwanyama: "Onghela", category: "adverbs", difficulty: "medium" },
  { id: "ad4", english: "Tomorrow", oshikwanyama: "Mongula", category: "adverbs", difficulty: "easy" },
  { id: "ad5", english: "Behind", oshikwanyama: "Konima", category: "adverbs", difficulty: "medium" },
  { id: "ad6", english: "Down", oshikwanyama: "Pedu", category: "adverbs", difficulty: "easy" },
  { id: "ad7", english: "Above", oshikwanyama: "Pombada", category: "adverbs", difficulty: "medium" },
];

export const questions: VocabularyItem[] = [
  { id: "q1", english: "Where?", oshikwanyama: "Peni?", category: "questions", difficulty: "easy" },
  { id: "q2", english: "Why?", oshikwanyama: "Omolwashike?", category: "questions", difficulty: "medium" },
  { id: "q3", english: "When?", oshikwanyama: "Neini?", category: "questions", difficulty: "medium" },
  { id: "q4", english: "How?", oshikwanyama: "Ngahelipi?", category: "questions", difficulty: "medium" },
  { id: "q5", english: "How are you?", oshikwanyama: "Ouli ngahelipi?", category: "questions", difficulty: "easy" },
];

// All vocabulary combined
export const allVocabulary: VocabularyItem[] = [
  ...greetings,
  ...pronouns,
  ...verbs,
  ...numbers,
  ...family,
  ...bodyParts,
  ...animals,
  ...nature,
  ...daysOfWeek,
  ...food,
  ...adverbs,
  ...questions,
];

export const categories = [
  { id: "greetings", name: "Greetings", icon: "👋", count: greetings.length },
  { id: "pronouns", name: "Pronouns", icon: "👤", count: pronouns.length },
  { id: "verbs", name: "Verbs", icon: "🏃", count: verbs.length },
  { id: "numbers", name: "Numbers", icon: "🔢", count: numbers.length },
  { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦", count: family.length },
  { id: "body", name: "Body Parts", icon: "🫀", count: bodyParts.length },
  { id: "animals", name: "Animals", icon: "🦁", count: animals.length },
  { id: "nature", name: "Nature", icon: "🌍", count: nature.length },
  { id: "days", name: "Days of Week", icon: "📅", count: daysOfWeek.length },
  { id: "food", name: "Food", icon: "🍎", count: food.length },
  { id: "adverbs", name: "Adverbs", icon: "⏰", count: adverbs.length },
  { id: "questions", name: "Questions", icon: "❓", count: questions.length },
];

export function getVocabularyByCategory(categoryId: string): VocabularyItem[] {
  switch (categoryId) {
    case "greetings": return greetings;
    case "pronouns": return pronouns;
    case "verbs": return verbs;
    case "numbers": return numbers;
    case "family": return family;
    case "body": return bodyParts;
    case "animals": return animals;
    case "nature": return nature;
    case "days": return daysOfWeek;
    case "food": return food;
    case "adverbs": return adverbs;
    case "questions": return questions;
    default: return allVocabulary;
  }
}

export function getRandomVocabulary(count: number, category?: string): VocabularyItem[] {
  const source = category ? getVocabularyByCategory(category) : allVocabulary;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
