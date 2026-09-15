const fs = require('fs');
const path = require('path');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const isSupabaseEnabled = Boolean(supabaseUrl && supabaseKey);
let supabase = null;

if (isSupabaseEnabled) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase Client Connected:', supabaseUrl);
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err);
  }
}

const isVercel = Boolean(process.env.VERCEL);
const LOCAL_DB_DIR = path.join(__dirname, 'data');
const LOCAL_DB_FILE = path.join(LOCAL_DB_DIR, 'db.json');

const DB_DIR = isVercel ? os.tmpdir() : LOCAL_DB_DIR;
const DB_FILE = isVercel ? path.join(DB_DIR, 'db.json') : LOCAL_DB_FILE;
const MASTER_UTP_FILE = path.join(LOCAL_DB_DIR, 'master_utp.json');

// Kode Jenis Perubahan SLS (1 - 9)
const kodePerubahanSls = [
  { kode: '1', label: '1 - Pemekaran SLS' },
  { kode: '2', label: '2 - Penggabungan SLS' },
  { kode: '3', label: '3 - Perubahan Jenis SLS' },
  { kode: '4', label: '4 - Perubahan Nama SLS' },
  { kode: '5', label: '5 - Perubahan Kode SLS' },
  { kode: '6', label: '6 - Pemekaran Sub SLS' },
  { kode: '7', label: '7 - Penggabungan Sub SLS' },
  { kode: '8', label: '8 - Perubahan Kode Sub SLS' },
  { kode: '9', label: '9 - Perubahan Muatan Sub SLS' }
];

function getMasterUtp() {
  if (fs.existsSync(MASTER_UTP_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(MASTER_UTP_FILE, 'utf-8'));
      data.kode_perubahan_sls = kodePerubahanSls;
      return data;
    } catch (e) {
      console.error('Error reading master_utp.json', e);
    }
  }
  return {
    kecamatan: [],
    desa: [],
    sls: [],
    ppl: [],
    kode_perubahan_sls: kodePerubahanSls
  };
}

const defaultUsers = [
  { id: 'usr-superadmin', username: 'superadmin', password: 'superadmin', nama: 'Super Administrator BPS', role: 'superadmin', assigned_kec: [] },
  { id: 'usr-admin', username: 'admin', password: 'admin', nama: 'Administrator BPS', role: 'admin', assigned_kec: [] },
  { id: 'usr-entry1', username: 'entry1', password: '123', nama: 'Petugas Entry 1', role: 'entry', assigned_kec: [] },
  { id: 'usr-scan1', username: 'scan1', password: '123', nama: 'Petugas Scan 1', role: 'scan', assigned_kec: [] },
  { id: 'usr-nana', username: 'nana', password: '123', nama: 'Nana Sumarna', role: 'penerima', assigned_kec: [], assigned_surveys: ['srv-sensus-14utp'] },
  { id: 'usr-juniar', username: 'juniar', password: '123', nama: 'Juniar', role: 'penerima', assigned_kec: [], assigned_surveys: ['srv-sensus-14utp'] }
];

const defaultSurveys = [
  {
    id: 'srv-sensus-14utp',
    nama_kegiatan: 'Sensus Wilkerstat BPS Kabupaten Pandeglang',
    jenis: 'sensus',
    tahun: '2026',
    status: 'aktif',
    sample_sls: []
  }
];

function initDBLocal() {
  if (!fs.existsSync(DB_DIR)) {
    try {
      fs.mkdirSync(DB_DIR, { recursive: true });
    } catch (e) {}
  }
  if (!fs.existsSync(DB_FILE)) {
    let initialData = null;
    if (fs.existsSync(LOCAL_DB_FILE)) {
      try {
        initialData = JSON.parse(fs.readFileSync(LOCAL_DB_FILE, 'utf-8'));
      } catch (e) {}
    }
    if (!initialData) {
      initialData = {
        users: defaultUsers,
        receivings: [],
        surveys: defaultSurveys
      };
    }
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error initializing DB_FILE:', e);
    }
  }
}

async function readDB() {
  if (isSupabaseEnabled && supabase) {
    try {
      const [usersRes, surveysRes, receivingsRes] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('surveys').select('*'),
        supabase.from('receivings').select('*').limit(10000)
      ]);

      let users = usersRes.data || [];
      let surveys = surveysRes.data || [];
      let receivings = receivingsRes.data || [];

      if (users.length === 0) {
        users = [...defaultUsers];
        await supabase.from('users').upsert(defaultUsers);
      }
      if (surveys.length === 0) {
        surveys = [...defaultSurveys];
        await supabase.from('surveys').upsert(defaultSurveys);
      }

      if (!users.some(u => u.username === 'superadmin')) {
        users.unshift(defaultUsers[0]);
        await supabase.from('users').upsert([defaultUsers[0]]);
      }
      if (!users.some(u => u.username === 'nana')) {
        users.push(defaultUsers[4]);
        await supabase.from('users').upsert([defaultUsers[4]]);
      }
      if (!users.some(u => u.username === 'juniar')) {
        users.push(defaultUsers[5]);
        await supabase.from('users').upsert([defaultUsers[5]]);
      }

      users.forEach(u => {
        u.username = String(u.username || '').trim();
        u.password = String(u.password || '').trim();
        if (!Array.isArray(u.assigned_kec)) u.assigned_kec = [];
        if (!Array.isArray(u.assigned_surveys)) u.assigned_surveys = [];
      });

      receivings.forEach(item => {
        if (!item.status_diterima || item.status_diterima === 'Belum') {
          item.status_diterima = 'Belum Diterima';
        }
        if (item.status_diterima === 'Belum Diterima') {
          item.tgl_diterima = '';
          item.petugas_penerima = '';
        } else {
          if (item.tgl_diterima === undefined) item.tgl_diterima = item.tgl_penerimaan || '';
          if (item.petugas_penerima === undefined) item.petugas_penerima = item.petugas_receiving || '';
        }
        if (item.status_scan === undefined) item.status_scan = 'Tidak';
        if (item.petugas_scan === undefined) item.petugas_scan = '';
        if (item.tgl_scan === undefined) item.tgl_scan = '';
        if (item.petugas_receiving === undefined) item.petugas_receiving = '';
        if (item.survey_id === undefined) item.survey_id = 'srv-sensus-14utp';
      });

      return {
        users,
        surveys,
        receivings,
        master: getMasterUtp()
      };
    } catch (err) {
      console.error('Error querying Supabase, falling back to local file storage:', err);
    }
  }

  // Local JSON fallback
  initDBLocal();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(content);
    db.master = getMasterUtp();
    
    if (!db.users || db.users.length === 0) {
      db.users = defaultUsers;
    }

    if (!db.users.some(u => u.username === 'superadmin')) {
      db.users.unshift(defaultUsers[0]);
    }
    if (!db.users.some(u => u.username === 'nana')) {
      db.users.push(defaultUsers[4]);
    }
    if (!db.users.some(u => u.username === 'juniar')) {
      db.users.push(defaultUsers[5]);
    }

    db.users.forEach(u => {
      u.username = String(u.username || '').trim();
      u.password = String(u.password || '').trim();
      if (!Array.isArray(u.assigned_kec)) u.assigned_kec = [];
      if (!Array.isArray(u.assigned_surveys)) u.assigned_surveys = [];
    });

    if (!Array.isArray(db.surveys) || db.surveys.length === 0) {
      db.surveys = defaultSurveys;
    }

    (db.receivings || []).forEach(item => {
      if (!item.status_diterima || item.status_diterima === 'Belum') {
        item.status_diterima = 'Belum Diterima';
      }
      if (item.status_diterima === 'Belum Diterima') {
        item.tgl_diterima = '';
        item.petugas_penerima = '';
      } else {
        if (item.tgl_diterima === undefined) item.tgl_diterima = item.tgl_penerimaan || '';
        if (item.petugas_penerima === undefined) item.petugas_penerima = item.petugas_receiving || '';
      }
      if (item.status_scan === undefined) item.status_scan = 'Tidak';
      if (item.petugas_scan === undefined) item.petugas_scan = '';
      if (item.tgl_scan === undefined) item.tgl_scan = '';
      if (item.petugas_receiving === undefined) item.petugas_receiving = '';
      if (item.survey_id === undefined) item.survey_id = 'srv-sensus-14utp';
    });

    return db;
  } catch (err) {
    console.error('Error reading local DB, re-initializing...', err);
    initDBLocal();
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    db.master = getMasterUtp();
    db.users = defaultUsers;
    db.surveys = defaultSurveys;
    return db;
  }
}

async function writeDB(data, targetItems = null, targetTable = null) {
  if (isSupabaseEnabled && supabase) {
    try {
      if (targetTable === 'users' && targetItems && targetItems.length > 0) {
        const { error } = await supabase.from('users').upsert(targetItems, { onConflict: 'id' });
        if (error) console.error('❌ Supabase users upsert error:', error.message || error);
      } else if (targetTable === 'receivings' && targetItems && targetItems.length > 0) {
        const BATCH_SIZE = 200;
        for (let i = 0; i < targetItems.length; i += BATCH_SIZE) {
          const chunk = targetItems.slice(i, i + BATCH_SIZE);
          const { error } = await supabase.from('receivings').upsert(chunk, { onConflict: 'id' });
          if (error) console.error('❌ Supabase receivings upsert error:', error.message || error);
        }
      } else if (targetTable === 'surveys' && targetItems && targetItems.length > 0) {
        const { error } = await supabase.from('surveys').upsert(targetItems, { onConflict: 'id' });
        if (error) console.error('❌ Supabase surveys upsert error:', error.message || error);
      } else {
        if (data.users && data.users.length > 0) {
          const { error } = await supabase.from('users').upsert(data.users, { onConflict: 'id' });
          if (error) console.error('❌ Supabase users full upsert error:', error.message || error);
        }
        if (data.surveys && data.surveys.length > 0) {
          const { error } = await supabase.from('surveys').upsert(data.surveys, { onConflict: 'id' });
          if (error) console.error('❌ Supabase surveys full upsert error:', error.message || error);
        }
        if (data.receivings && data.receivings.length > 0) {
          const BATCH_SIZE = 200;
          for (let i = 0; i < data.receivings.length; i += BATCH_SIZE) {
            const chunk = data.receivings.slice(i, i + BATCH_SIZE);
            const { error } = await supabase.from('receivings').upsert(chunk, { onConflict: 'id' });
            if (error) console.error('❌ Supabase receivings full upsert error:', error.message || error);
          }
        }
      }
    } catch (err) {
      console.error('Error writing to Supabase:', err);
    }
  }

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const toSave = {
      users: data.users || defaultUsers,
      receivings: data.receivings || [],
      surveys: data.surveys || defaultSurveys
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing local DB_FILE:', e);
  }
}

async function deleteUserDB(id) {
  if (isSupabaseEnabled && supabase) {
    try {
      await supabase.from('users').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting user from Supabase:', e);
    }
  }
}

async function deleteSurveyDB(id) {
  if (isSupabaseEnabled && supabase) {
    try {
      await supabase.from('surveys').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting survey from Supabase:', e);
    }
  }
}

async function deleteReceivingDB(id) {
  if (isSupabaseEnabled && supabase) {
    try {
      await supabase.from('receivings').delete().eq('id', id);
    } catch (e) {
      console.error('Error deleting receiving from Supabase:', e);
    }
  }
}

module.exports = {
  readDB,
  writeDB,
  deleteUserDB,
  deleteSurveyDB,
  deleteReceivingDB,
  getMasterUtp,
  isSupabaseEnabled
};
