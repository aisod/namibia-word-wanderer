-- Seed Oshikwanyama language and vocabulary (full migration from oshikwanyamaData.ts)
-- Run this AFTER applying the migration (20260130000000_initial_schema.sql)
-- Execute via Supabase Dashboard SQL Editor or: supabase db reset (applies migrations + seed)

-- Insert Oshikwanyama language
INSERT INTO public.languages (
  slug, name, native_name, speakers, regions, description, history, fun_facts, cover_image, is_available, sort_order
) VALUES (
  'oshikwanyama',
  'Oshikwanyama',
  'Oshiwambo',
  'Approximately 1+ million speakers',
  ARRAY['Kunene', 'Ohangwena', 'Omusati', 'Oshikoto', 'Oshana'],
  'Oshikwanyama (also called Oshiwambo) is a Bantu language belonging to the larger Niger-Congo Phylum. It is spoken in both Namibia and Angola, making it a truly cross-border language that unites communities across national boundaries.',
  'The Owambo people have a rich cultural heritage spanning centuries. Oshiwambo has evolved while maintaining its core structure, incorporating some loanwords from colonial languages while preserving its grammatical integrity. The language is read as it is written - making it relatively accessible for learners who master the phonetic system.',
  ARRAY[
    'Oshiwambo is one of the most widely spoken languages in Namibia',
    'The language has unique letters like NG, NGH, SH, and NY',
    'Unlike English, Oshiwambo is phonetic - words are pronounced as written',
    'The Owambo people are known for their rich cultural traditions and hospitality'
  ],
  '/oshiwambo.png',
  true,
  0
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  native_name = EXCLUDED.native_name,
  speakers = EXCLUDED.speakers,
  regions = EXCLUDED.regions,
  description = EXCLUDED.description,
  history = EXCLUDED.history,
  fun_facts = EXCLUDED.fun_facts,
  updated_at = now();

-- Migrate full vocabulary
DO $$
DECLARE
  lang_id uuid;
BEGIN
  SELECT id INTO lang_id FROM public.languages WHERE slug = 'oshikwanyama' LIMIT 1;
  
  IF lang_id IS NOT NULL THEN
    -- Insert categories
    INSERT INTO public.categories (language_id, slug, name, icon, sort_order)
    VALUES 
      (lang_id, 'greetings', 'Greetings', '👋', 0),
      (lang_id, 'pronouns', 'Pronouns', '👤', 1),
      (lang_id, 'verbs', 'Verbs', '🏃', 2),
      (lang_id, 'numbers', 'Numbers', '🔢', 3),
      (lang_id, 'family', 'Family', '👨‍👩‍👧‍👦', 4),
      (lang_id, 'body', 'Body Parts', '🫀', 5),
      (lang_id, 'animals', 'Animals', '🦁', 6),
      (lang_id, 'nature', 'Nature', '🌍', 7),
      (lang_id, 'days', 'Days of Week', '📅', 8),
      (lang_id, 'food', 'Food', '🍎', 9),
      (lang_id, 'adverbs', 'Adverbs', '⏰', 10),
      (lang_id, 'questions', 'Questions', '❓', 11)
    ON CONFLICT (language_id, slug) DO NOTHING;

    -- Clear existing vocabulary for this language (allows re-running migration)
    DELETE FROM public.vocabulary WHERE language_id = lang_id;

    -- Insert ALL vocabulary from oshikwanyamaData.ts
    INSERT INTO public.vocabulary (language_id, english, native_word, category, difficulty)
    VALUES
      -- Greetings
      (lang_id, 'Hello / How are you?', 'Ongeipi', 'greetings', 'easy'),
      (lang_id, 'Good morning', 'Walelepo', 'greetings', 'easy'),
      (lang_id, 'Good afternoon', 'Wauhalapo', 'greetings', 'easy'),
      (lang_id, 'Good evening', 'Watokelwapo', 'greetings', 'easy'),
      (lang_id, 'Hi / Fine!', 'Nawa', 'greetings', 'easy'),
      (lang_id, 'What is your name?', 'Edina loye?', 'greetings', 'medium'),
      (lang_id, 'My name is...', 'Edina lange aame...', 'greetings', 'medium'),
      (lang_id, 'See you tomorrow!', 'Otuliweteni mongula!', 'greetings', 'medium'),
      -- Pronouns
      (lang_id, 'I', 'Ame', 'pronouns', 'easy'),
      (lang_id, 'You', 'Ove', 'pronouns', 'easy'),
      (lang_id, 'He/She/It', 'Ye', 'pronouns', 'easy'),
      (lang_id, 'We', 'Fyee', 'pronouns', 'easy'),
      (lang_id, 'They', 'Voo', 'pronouns', 'easy'),
      (lang_id, 'Who', 'Lyelye', 'pronouns', 'medium'),
      (lang_id, 'What', 'Oshike', 'pronouns', 'medium'),
      (lang_id, 'This', 'Eshi', 'pronouns', 'medium'),
      (lang_id, 'That', 'Shinya', 'pronouns', 'medium'),
      -- Verbs
      (lang_id, 'To eat', 'Lya', 'verbs', 'easy'),
      (lang_id, 'To sleep', 'Kofa', 'verbs', 'easy'),
      (lang_id, 'To come', 'Ila', 'verbs', 'easy'),
      (lang_id, 'To go', 'Inda', 'verbs', 'easy'),
      (lang_id, 'To sing', 'Imba', 'verbs', 'easy'),
      (lang_id, 'To laugh', 'Yola', 'verbs', 'easy'),
      (lang_id, 'To write', 'Shanga', 'verbs', 'medium'),
      (lang_id, 'To speak', 'Popya', 'verbs', 'medium'),
      (lang_id, 'To see', 'Tala', 'verbs', 'medium'),
      (lang_id, 'To cry', 'Kwena', 'verbs', 'medium'),
      (lang_id, 'To swim', 'Yowa', 'verbs', 'medium'),
      -- Numbers
      (lang_id, 'One', 'Imwe', 'numbers', 'easy'),
      (lang_id, 'Two', 'Mbali', 'numbers', 'easy'),
      (lang_id, 'Three', 'Nhatu', 'numbers', 'easy'),
      (lang_id, 'Four', 'Nhee', 'numbers', 'easy'),
      (lang_id, 'Five', 'Nhano', 'numbers', 'easy'),
      (lang_id, 'Six', 'Hamano', 'numbers', 'medium'),
      (lang_id, 'Seven', 'Heyali', 'numbers', 'medium'),
      (lang_id, 'Eight', 'Hetatu', 'numbers', 'medium'),
      (lang_id, 'Nine', 'Omuwoi', 'numbers', 'medium'),
      (lang_id, 'Ten', 'Omulongo', 'numbers', 'medium'),
      (lang_id, 'Hundred', 'Efele', 'numbers', 'hard'),
      (lang_id, 'Thousand', 'Eyovi', 'numbers', 'hard'),
      -- Family
      (lang_id, 'Father', 'Tate', 'family', 'easy'),
      (lang_id, 'Mother', 'Meme', 'family', 'easy'),
      (lang_id, 'Son', 'Monamati', 'family', 'medium'),
      (lang_id, 'Daughter', 'Monakadona', 'family', 'medium'),
      (lang_id, 'Grandfather', 'Tate Kulu', 'family', 'medium'),
      (lang_id, 'Grandmother', 'Meme Kulu', 'family', 'medium'),
      (lang_id, 'Baby', 'Okahanana', 'family', 'easy'),
      (lang_id, 'Child', 'Okaana', 'family', 'easy'),
      (lang_id, 'Husband', 'Omusamane', 'family', 'medium'),
      (lang_id, 'Wife', 'Omukulukadi', 'family', 'medium'),
      -- Body parts
      (lang_id, 'Head', 'Omutwe', 'body', 'easy'),
      (lang_id, 'Hand', 'Okuoko', 'body', 'easy'),
      (lang_id, 'Ear', 'Okutwi', 'body', 'easy'),
      (lang_id, 'Mouth', 'Okanya', 'body', 'easy'),
      (lang_id, 'Neck', 'Ofingo', 'body', 'medium'),
      (lang_id, 'Stomach', 'Edimo', 'body', 'medium'),
      (lang_id, 'Heart', 'Omutima', 'body', 'easy'),
      (lang_id, 'Leg', 'Okulu', 'body', 'easy'),
      (lang_id, 'Tongue', 'Elaka', 'body', 'medium'),
      (lang_id, 'Eye', 'Eiso', 'body', 'easy'),
      -- Animals
      (lang_id, 'Cow', 'Ngobe', 'animals', 'easy'),
      (lang_id, 'Goat', 'Shikombo', 'animals', 'easy'),
      (lang_id, 'Chicken', 'Xuxa', 'animals', 'easy'),
      (lang_id, 'Dog', 'Mbwa', 'animals', 'easy'),
      (lang_id, 'Cat', 'Mbishi', 'animals', 'easy'),
      (lang_id, 'Lion', 'Nghoshi', 'animals', 'medium'),
      (lang_id, 'Elephant', 'Ndjaba', 'animals', 'medium'),
      (lang_id, 'Giraffe', 'Nduli', 'animals', 'medium'),
      (lang_id, 'Zebra', 'Ngolo', 'animals', 'medium'),
      (lang_id, 'Snake', 'Eyoka', 'animals', 'medium'),
      -- Nature
      (lang_id, 'Sun', 'Etango', 'nature', 'easy'),
      (lang_id, 'Moon', 'Omwedhi', 'nature', 'easy'),
      (lang_id, 'Water', 'Omeva', 'nature', 'easy'),
      (lang_id, 'Stars', 'Eenyofi', 'nature', 'easy'),
      (lang_id, 'Earth', 'Edu', 'nature', 'easy'),
      (lang_id, 'Sky', 'Eulu', 'nature', 'easy'),
      (lang_id, 'Rain', 'Odula', 'nature', 'medium'),
      (lang_id, 'River', 'Omilonga', 'nature', 'medium'),
      (lang_id, 'Sea', 'Efuta', 'nature', 'medium'),
      (lang_id, 'Fish', 'Ooshi', 'nature', 'easy'),
      -- Days of week
      (lang_id, 'Sunday', 'Oshondaxa', 'days', 'medium'),
      (lang_id, 'Monday', 'Omandaxa', 'days', 'medium'),
      (lang_id, 'Tuesday', 'Etivali', 'days', 'medium'),
      (lang_id, 'Wednesday', 'Etitatu', 'days', 'medium'),
      (lang_id, 'Thursday', 'Etine', 'days', 'medium'),
      (lang_id, 'Friday', 'Etitano', 'days', 'medium'),
      (lang_id, 'Saturday', 'Olomakaya', 'days', 'medium'),
      -- Food
      (lang_id, 'Food', 'Oikulya', 'food', 'easy'),
      (lang_id, 'Salt', 'Omongwa', 'food', 'easy'),
      (lang_id, 'Sugar', 'Osuuka', 'food', 'easy'),
      (lang_id, 'Bread', 'Omboloto', 'food', 'easy'),
      (lang_id, 'Meat', 'Ombelela', 'food', 'easy'),
      (lang_id, 'Beans', 'Omakunde', 'food', 'medium'),
      (lang_id, 'Watermelon', 'Enuwa', 'food', 'medium'),
      (lang_id, 'Banana', 'Ebanana', 'food', 'easy'),
      (lang_id, 'Orange', 'Elemuna', 'food', 'medium'),
      -- Adverbs
      (lang_id, 'Fast', 'Diva', 'adverbs', 'easy'),
      (lang_id, 'Today', 'Nena', 'adverbs', 'easy'),
      (lang_id, 'Yesterday', 'Onghela', 'adverbs', 'medium'),
      (lang_id, 'Tomorrow', 'Mongula', 'adverbs', 'easy'),
      (lang_id, 'Behind', 'Konima', 'adverbs', 'medium'),
      (lang_id, 'Down', 'Pedu', 'adverbs', 'easy'),
      (lang_id, 'Above', 'Pombada', 'adverbs', 'medium'),
      -- Questions
      (lang_id, 'Where?', 'Peni?', 'questions', 'easy'),
      (lang_id, 'Why?', 'Omolwashike?', 'questions', 'medium'),
      (lang_id, 'When?', 'Neini?', 'questions', 'medium'),
      (lang_id, 'How?', 'Ngahelipi?', 'questions', 'medium'),
      (lang_id, 'How are you?', 'Ouli ngahelipi?', 'questions', 'easy')
    ;
  END IF;
END $$;
