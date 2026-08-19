-- Run this once in the Supabase Dashboard -> SQL Editor -> New Query -> Run.
--
-- Why: the live `interviews` / `questions` tables are missing columns that the
-- app has always written to. PostgREST rejects an entire insert/update when the
-- payload references one unknown column, so these writes have been silently
-- failing end-to-end:
--   - `interviews` has no `updated_at`, so every score-completion update that
--     included `updated_at` was rejected outright and the interview's `score`
--     stayed at its initial value of 0 -> History/Dashboard/Profile always show 0.
--   - `questions` has no `question_text` / `question_number` / `user_answer` /
--     `question_score` / `ai_feedback`, so every per-question insert/update has
--     been failing too -> the `questions` table has been completely empty,
--     which also breaks the app's own score self-repair logic (it recomputes a
--     score from `questions.question_score` when `interviews.score` is 0/missing).
--
-- This migration only ADDS columns (IF NOT EXISTS) — it does not touch or drop
-- any existing data.

alter table public.interviews
  add column if not exists updated_at timestamptz not null default now();

alter table public.questions
  add column if not exists question_text text,
  add column if not exists question_number integer,
  add column if not exists user_answer text,
  add column if not exists question_score integer,
  add column if not exists ai_feedback text;
