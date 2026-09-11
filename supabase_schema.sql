-- =========================================================================
-- SHI-PETA (BPS KABUPATEN PANDEGLANG) - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Instructions:
-- 1. Open your Supabase Dashboard: https://app.supabase.com
-- 2. Go to SQL Editor -> New Query
-- 3. Copy & paste this entire script, then click "RUN"
-- =========================================================================

-- 1. Tabel Users (Manajemen Hak Akses & Alokasi Wilayah)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nama TEXT NOT NULL,
  role TEXT NOT NULL,
  assigned_kec JSONB DEFAULT '[]'::jsonb,
  assigned_surveys JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabel Surveys (Multi-Kegiatan & Sampel SLS)
CREATE TABLE IF NOT EXISTS public.surveys (
  id TEXT PRIMARY KEY,
  nama_kegiatan TEXT NOT NULL,
  jenis TEXT NOT NULL,
  tahun TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aktif',
  sample_sls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabel Receivings (Penerimaan Fisik & Progress Scanning Peta SLS)
CREATE TABLE IF NOT EXISTS public.receivings (
  id TEXT PRIMARY KEY,
  no_peta TEXT,
  id_sls TEXT,
  nama_sls TEXT,
  id_kecamatan TEXT,
  id_desa TEXT,
  status_diterima TEXT DEFAULT 'Belum Diterima',
  tgl_diterima TEXT DEFAULT '',
  petugas_penerima TEXT DEFAULT '',
  tgl_penerimaan TEXT DEFAULT '',
  kondisi TEXT DEFAULT 'Baik',
  ppl TEXT DEFAULT '',
  no_bangunan_terbesar INT DEFAULT 0,
  catatan TEXT DEFAULT '',
  perbaikan_batas BOOLEAN DEFAULT false,
  perubahan_sls BOOLEAN DEFAULT false,
  kode_jenis_perubahan_sls TEXT DEFAULT '',
  kualitas_jaringan TEXT DEFAULT 'Kuat',
  status_scan TEXT DEFAULT 'Tidak',
  petugas_scan TEXT DEFAULT '',
  petugas_receiving TEXT DEFAULT '',
  tgl_scan TEXT DEFAULT '',
  survey_id TEXT DEFAULT 'srv-sensus-14utp',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexing untuk mempercepat query filter & pencarian
CREATE INDEX IF NOT EXISTS idx_receivings_id_sls ON public.receivings(id_sls);
CREATE INDEX IF NOT EXISTS idx_receivings_id_kecamatan ON public.receivings(id_kecamatan);
CREATE INDEX IF NOT EXISTS idx_receivings_id_desa ON public.receivings(id_desa);
CREATE INDEX IF NOT EXISTS idx_receivings_survey_id ON public.receivings(survey_id);
CREATE INDEX IF NOT EXISTS idx_receivings_status_diterima ON public.receivings(status_diterima);
CREATE INDEX IF NOT EXISTS idx_receivings_status_scan ON public.receivings(status_scan);

-- Disable Row Level Security (RLS) agar backend serverless Vercel dapat membaca & menulis data dengan lancar
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.receivings DISABLE ROW LEVEL SECURITY;
