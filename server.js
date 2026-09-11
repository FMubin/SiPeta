const express = require('express');
const cors = require('cors');
const path = require('path');
const { readDB, writeDB, deleteUserDB, deleteSurveyDB, deleteReceivingDB, getMasterUtp } = require('./db');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 0. AUTH & USER MANAGEMENT ENDPOINTS
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan Password wajib diisi.' });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const cleanPass = String(password).trim();

  const db = await readDB();
  const user = (db.users || []).find(u => 
    String(u.username).trim().toLowerCase() === cleanUser && 
    String(u.password).trim() === cleanPass
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Username atau Password salah.' });
  }

  const safeUser = {
    id: user.id,
    username: user.username,
    nama: user.nama,
    role: user.role,
    assigned_kec: user.assigned_kec || [],
    assigned_surveys: user.assigned_surveys || []
  };
  res.json({ success: true, message: `Selamat datang, ${user.nama}!`, user: safeUser });
});

app.get('/api/users', async (req, res) => {
  const db = await readDB();
  const safeUsers = (db.users || []).map(u => ({
    id: u.id,
    username: u.username,
    nama: u.nama,
    role: u.role,
    assigned_kec: u.assigned_kec || [],
    assigned_surveys: u.assigned_surveys || []
  }));
  res.json({ success: true, data: safeUsers });
});

app.post('/api/users', async (req, res) => {
  const { username, password, nama, role, assigned_kec, assigned_surveys, requester_role } = req.body;
  if (!username || !password || !nama || !role) {
    return res.status(400).json({ success: false, message: 'Semua field (Username, Password, Nama, Role) wajib diisi.' });
  }

  let cleanRole = role.toLowerCase().trim();
  if (requester_role === 'admin' && (cleanRole === 'admin' || cleanRole === 'superadmin')) {
    return res.status(403).json({ success: false, message: 'Admin hanya diperbolehkan membuat akun Petugas Entry dan Petugas Scan.' });
  }

  const db = await readDB();
  if ((db.users || []).some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
    return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh user lain.' });
  }

  const newUser = {
    id: 'usr-' + Date.now().toString().slice(-6),
    username: username.trim(),
    password: password,
    nama: nama.trim(),
    role: cleanRole,
    assigned_kec: Array.isArray(assigned_kec) ? assigned_kec.map(String) : [],
    assigned_surveys: Array.isArray(assigned_surveys) ? assigned_surveys.map(String) : []
  };

  db.users.push(newUser);
  await writeDB(db);

  res.status(201).json({
    success: true,
    message: 'Petugas baru berhasil ditambahkan.',
    data: { id: newUser.id, username: newUser.username, nama: newUser.nama, role: newUser.role, assigned_kec: newUser.assigned_kec, assigned_surveys: newUser.assigned_surveys }
  });
});

app.put('/api/users/:id', async (req, res) => {
  const db = await readDB();
  const user = (db.users || []).find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
  }

  const { nama, username, password, role, assigned_kec, assigned_surveys, requester_role } = req.body;

  if (requester_role === 'admin' && (user.role === 'admin' || user.role === 'superadmin')) {
    return res.status(403).json({ success: false, message: 'Admin tidak dapat mengubah akun Super Admin atau sesama Admin.' });
  }

  if (username && username.trim().toLowerCase() !== user.username.toLowerCase()) {
    const existing = (db.users || []).find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== user.id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh user lain.' });
    }
    user.username = username.trim();
  }

  if (nama && nama.trim()) user.nama = nama.trim();
  if (role) {
    let cleanRole = role.toLowerCase().trim();
    if (requester_role === 'admin' && (cleanRole === 'admin' || cleanRole === 'superadmin')) {
      return res.status(403).json({ success: false, message: 'Admin hanya dapat menetapkan role Petugas Entry dan Scan.' });
    }
    user.role = cleanRole;
  }
  if (password && String(password).trim()) {
    user.password = String(password).trim();
  }
  if (Array.isArray(assigned_kec)) {
    user.assigned_kec = assigned_kec.map(String);
  }
  if (Array.isArray(assigned_surveys)) {
    user.assigned_surveys = assigned_surveys.map(String);
  }

  await writeDB(db);

  res.json({
    success: true,
    message: `Data & Password petugas ${user.nama} berhasil diperbarui.`,
    data: { id: user.id, username: user.username, nama: user.nama, role: user.role, assigned_kec: user.assigned_kec, assigned_surveys: user.assigned_surveys }
  });
});

app.put('/api/users/:id/allocation', async (req, res) => {
  const db = await readDB();
  const user = (db.users || []).find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
  }

  const { assigned_kec, assigned_surveys } = req.body;
  if (Array.isArray(assigned_kec)) {
    user.assigned_kec = assigned_kec.map(String);
  }
  if (Array.isArray(assigned_surveys)) {
    user.assigned_surveys = assigned_surveys.map(String);
  }
  await writeDB(db);

  res.json({
    success: true,
    message: `Alokasi Wilayah & Kegiatan untuk ${user.nama} berhasil diperbarui.`,
    data: { id: user.id, username: user.username, nama: user.nama, role: user.role, assigned_kec: user.assigned_kec, assigned_surveys: user.assigned_surveys }
  });
});

app.delete('/api/users/:id', async (req, res) => {
  const db = await readDB();
  const index = (db.users || []).findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
  }
  if (db.users[index].username === 'superadmin' || db.users[index].username === 'admin') {
    return res.status(400).json({ success: false, message: 'Akun Super Admin & Admin utama tidak dapat dihapus.' });
  }

  const deletedId = db.users[index].id;
  db.users.splice(index, 1);
  await deleteUserDB(deletedId);
  await writeDB(db);
  res.json({ success: true, message: 'User berhasil dihapus.' });
});

// Import Bulk Users via JSON array
app.post('/api/users/import', async (req, res) => {
  const { users: newUsers } = req.body;
  if (!newUsers || !Array.isArray(newUsers) || newUsers.length === 0) {
    return res.status(400).json({ success: false, message: 'Data petugas tidak boleh kosong.' });
  }

  const db = await readDB();
  const existingUsernames = new Set((db.users || []).map(u => u.username.toLowerCase()));

  let importedCount = 0;
  let skippedCount = 0;
  const added = [];

  newUsers.forEach(u => {
    if (!u.username || !u.password || !u.nama) {
      skippedCount++;
      return;
    }

    const cleanUsername = String(u.username).trim();
    if (existingUsernames.has(cleanUsername.toLowerCase())) {
      skippedCount++;
      return;
    }

    let role = (u.role || 'entry').toLowerCase().trim();
    if (role.includes('admin')) role = 'admin';
    else if (role.includes('scan')) role = 'scan';
    else role = 'entry';

    let assignedKec = [];
    if (Array.isArray(u.assigned_kec)) {
      assignedKec = u.assigned_kec.map(String);
    } else if (typeof u.assigned_kec === 'string' && u.assigned_kec.trim()) {
      const raw = u.assigned_kec.trim().toUpperCase();
      if (raw === 'ALL' || raw === 'SEMUA' || raw === '*') {
        assignedKec = [];
      } else {
        assignedKec = u.assigned_kec.split(';').map(s => s.trim()).filter(Boolean);
      }
    }

    let assignedSurveys = [];
    if (Array.isArray(u.assigned_surveys)) {
      assignedSurveys = u.assigned_surveys.map(String);
    } else if (typeof u.assigned_surveys === 'string' && u.assigned_surveys.trim()) {
      assignedSurveys = u.assigned_surveys.split(';').map(s => s.trim()).filter(Boolean);
    }

    const userObj = {
      id: 'usr-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000),
      username: cleanUsername,
      password: String(u.password).trim(),
      nama: String(u.nama).trim(),
      role: role,
      assigned_kec: assignedKec,
      assigned_surveys: assignedSurveys
    };

    existingUsernames.add(cleanUsername.toLowerCase());
    db.users.push(userObj);
    added.push({ id: userObj.id, username: userObj.username, nama: userObj.nama, role: userObj.role, assigned_kec: userObj.assigned_kec, assigned_surveys: userObj.assigned_surveys });
    importedCount++;
  });

  await writeDB(db);

  res.json({
    success: true,
    message: `Berhasil mengimpor ${importedCount} petugas (${skippedCount} dilewati karena duplikat/invalid).`,
    importedCount,
    skippedCount,
    data: added
  });
});

app.get('/api/users/template', (req, res) => {
  const sampleData = [
    {
      nama: "Budi Santoso",
      username: "budisantoso",
      password: "123",
      role: "entry",
      assigned_kec: "3601010;3601020"
    },
    {
      nama: "Siti Rahma",
      username: "sitirahma",
      password: "123",
      role: "scan",
      assigned_kec: "3601030"
    },
    {
      nama: "Ahmad Yani",
      username: "ahmadyani",
      password: "123",
      role: "entry",
      assigned_kec: "ALL"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 16 },
    { wch: 14 },
    { wch: 10 },
    { wch: 24 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template Import Petugas");

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="template_import_petugas.xlsx"');
  res.status(200).send(buffer);
});

// 1. GET Master Data
app.get('/api/master', (req, res) => {
  const master = getMasterUtp();
  const kecSlsCountMap = {};
  (master.sls || []).forEach(s => {
    const kId = String(s.kec_id || (s.id_sls ? s.id_sls.slice(0, 7) : ''));
    if (kId) {
      kecSlsCountMap[kId] = (kecSlsCountMap[kId] || 0) + 1;
    }
  });

  const kecamatanWithCount = (master.kecamatan || []).map(k => ({
    ...k,
    total_sls: kecSlsCountMap[String(k.id)] || 0
  }));

  res.json({
    success: true,
    data: {
      kecamatan: kecamatanWithCount,
      desa: master.desa,
      ppl: master.ppl,
      kode_perubahan_sls: master.kode_perubahan_sls
    }
  });
});

// 2. GET SLS List
app.get('/api/master/sls', async (req, res) => {
  const db = await readDB();
  const master = getMasterUtp();
  let list = master.sls || [];

  const { desa_id, kec_id, search, survey_id } = req.query;

  if (survey_id) {
    const surveyObj = (db.surveys || []).find(s => s.id === survey_id);
    if (surveyObj && surveyObj.jenis === 'survei' && Array.isArray(surveyObj.sample_sls) && surveyObj.sample_sls.length > 0) {
      const sampleMap = new Map(surveyObj.sample_sls.map(s => [String(s.id_sls || s).trim(), s]));
      list = list.filter(s => sampleMap.has(String(s.id_sls).trim())).map(s => {
        const sampleData = sampleMap.get(String(s.id_sls).trim());
        return {
          ...s,
          nama_sls: (sampleData && sampleData.nama_sls) ? sampleData.nama_sls : s.nama_sls,
          ppl: (sampleData && sampleData.ppl !== undefined) ? sampleData.ppl : '',
          no_hp: (sampleData && sampleData.no_hp !== undefined) ? sampleData.no_hp : ''
        };
      });
    }
  }

  if (desa_id) {
    list = list.filter(s => String(s.desa_id) === String(desa_id));
  } else if (kec_id) {
    list = list.filter(s => String(s.kec_id) === String(kec_id));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(s => 
      s.id_sls.toLowerCase().includes(q) || 
      s.nama_sls.toLowerCase().includes(q) ||
      (s.ppl && s.ppl.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => a.id_sls.localeCompare(b.id_sls, undefined, { numeric: true }));

  res.json({ success: true, count: list.length, data: list });
});

// 2b. MULTI-SURVEYS / KEGIATAN ENDPOINTS
app.get('/api/surveys', async (req, res) => {
  const db = await readDB();
  res.json({
    success: true,
    data: db.surveys || []
  });
});

app.post('/api/surveys', async (req, res) => {
  const { nama_kegiatan, jenis, tahun, status, sample_sls } = req.body;
  if (!nama_kegiatan) {
    return res.status(400).json({ success: false, message: 'Nama Kegiatan / Survei wajib diisi.' });
  }

  const db = await readDB();
  const newId = 'srv-' + Date.now().toString().slice(-6);
  const newSurvey = {
    id: newId,
    nama_kegiatan: nama_kegiatan.trim(),
    jenis: (jenis === 'survei') ? 'survei' : 'sensus',
    tahun: tahun || String(new Date().getFullYear()),
    status: status || 'aktif',
    sample_sls: Array.isArray(sample_sls) ? sample_sls.map(item => {
      if (typeof item === 'object' && item !== null) {
        return { id_sls: String(item.id_sls).trim(), nama_sls: String(item.nama_sls || '').trim() };
      }
      return { id_sls: String(item).trim(), nama_sls: '' };
    }).filter(s => s.id_sls) : []
  };

  db.surveys.push(newSurvey);
  await writeDB(db);

  res.status(201).json({
    success: true,
    message: `Kegiatan "${newSurvey.nama_kegiatan}" berhasil ditambahkan!`,
    data: newSurvey
  });
});

app.put('/api/surveys/:id', async (req, res) => {
  const db = await readDB();
  const survey = (db.surveys || []).find(s => s.id === req.params.id);
  if (!survey) {
    return res.status(404).json({ success: false, message: 'Kegiatan tidak ditemukan.' });
  }

  const { nama_kegiatan, jenis, tahun, status } = req.body;
  if (nama_kegiatan && nama_kegiatan.trim()) survey.nama_kegiatan = nama_kegiatan.trim();
  if (jenis) survey.jenis = (jenis === 'survei') ? 'survei' : 'sensus';
  if (tahun) survey.tahun = String(tahun);
  if (status) survey.status = status;

  await writeDB(db);

  res.json({
    success: true,
    message: `Data kegiatan "${survey.nama_kegiatan}" berhasil diperbarui.`,
    data: survey
  });
});

app.post('/api/surveys/:id/upload-sample', async (req, res) => {
  const db = await readDB();
  const survey = (db.surveys || []).find(s => s.id === req.params.id);
  if (!survey) {
    return res.status(404).json({ success: false, message: 'Kegiatan tidak ditemukan.' });
  }

  const { sample_sls } = req.body;
  if (!sample_sls || !Array.isArray(sample_sls)) {
    return res.status(400).json({ success: false, message: 'Data sampel SLS tidak valid.' });
  }

  survey.jenis = 'survei';
  survey.sample_sls = sample_sls.map(item => {
    if (typeof item === 'object' && item !== null) {
      const cleanId = String(item.id_sls || '').trim();
      return {
        id_sls: cleanId,
        nama_sls: String(item.nama_sls || '').trim(),
        kec_id: item.kec_id ? String(item.kec_id) : (cleanId.length >= 7 ? cleanId.slice(0, 7) : ''),
        desa_id: item.desa_id ? String(item.desa_id) : (cleanId.length >= 10 ? cleanId.slice(0, 10) : ''),
        ppl: String(item.ppl || item.nama_petugas || item.petugas || '').trim(),
        no_hp: String(item.no_hp || item.no_telp || item.telp || '').trim()
      };
    }
    const cleanId = String(item).trim();
    return {
      id_sls: cleanId,
      nama_sls: '',
      kec_id: cleanId.length >= 7 ? cleanId.slice(0, 7) : '',
      desa_id: cleanId.length >= 10 ? cleanId.slice(0, 10) : '',
      ppl: '',
      no_hp: ''
    };
  }).filter(s => s.id_sls);

  await writeDB(db);

  res.json({
    success: true,
    message: `Berhasil mengunggah ${survey.sample_sls.length} SLS sampel terpilih untuk kegiatan "${survey.nama_kegiatan}"!`,
    data: survey
  });
});

app.delete('/api/surveys/:id', async (req, res) => {
  const db = await readDB();
  const index = (db.surveys || []).findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Kegiatan tidak ditemukan.' });
  }
  if (db.surveys[index].id === 'srv-sensus-14utp') {
    return res.status(400).json({ success: false, message: 'Kegiatan Sensus Bawaan tidak dapat dihapus.' });
  }

  const deletedId = db.surveys[index].id;
  const deletedName = db.surveys[index].nama_kegiatan;
  db.surveys.splice(index, 1);
  await deleteSurveyDB(deletedId);
  await writeDB(db);

  res.json({ success: true, message: `Kegiatan "${deletedName}" berhasil dihapus.` });
});

app.get('/api/surveys/template', (req, res) => {
  const sampleData = [
    {
      "Nama Kab": "PANDEGLANG",
      "Kode Kec": "3601010",
      "Nama Kec": "SUMUR",
      "Kode Desa": "3601010001",
      "Nama Desa": "UJUNGJAYA",
      "Kode SLS": "3601010001000100",
      "Nama SLS": "RT 001 RW 01 DUSUN 01"
    },
    {
      "Nama Kab": "PANDEGLANG",
      "Kode Kec": "3601010",
      "Nama Kec": "SUMUR",
      "Kode Desa": "3601010001",
      "Nama Desa": "UJUNGJAYA",
      "Kode SLS": "3601010001000200",
      "Nama SLS": "RT 002 RW 01 DUSUN 01"
    },
    {
      "Nama Kab": "PANDEGLANG",
      "Kode Kec": "3601020",
      "Nama Kec": "CIMANGGU",
      "Kode Desa": "3601020001",
      "Nama Desa": "TITEU",
      "Kode SLS": "3601020001000100",
      "Nama SLS": "RT 001 RW 01 DUSUN 01"
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 16 },
    { wch: 12 },
    { wch: 16 },
    { wch: 14 },
    { wch: 18 },
    { wch: 22 },
    { wch: 30 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template Sampel SLS");

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="template_sampel_sls_survei.xlsx"');
  res.status(200).send(buffer);
});

// 3. GET Specific SLS Detail
app.get('/api/master/sls/:id_sls', (req, res) => {
  const master = getMasterUtp();
  const found = (master.sls || []).find(s => String(s.id_sls) === String(req.params.id_sls));
  if (!found) {
    return res.status(404).json({ success: false, message: 'ID SLS tidak ditemukan pada master data BPS Kabupaten Pandeglang.' });
  }
  res.json({ success: true, data: found });
});

// 4. GET Receivings
app.get('/api/receivings', async (req, res) => {
  const db = await readDB();
  let list = db.receivings || [];

  const { kec_id, desa_id, perubahan_sls, perbaikan_batas, kondisi, kualitas_jaringan, status_scan, status_diterima, search, sort_by, survey_id } = req.query;

  if (status_diterima) {
    if (status_diterima === 'Belum Diterima') {
      list = list.filter(item => (item.status_diterima || 'Belum Diterima') === 'Belum Diterima');
    } else {
      list = list.filter(item => (item.status_diterima || 'Belum Diterima') !== 'Belum Diterima');
    }
  }

  if (survey_id) {
    const surveyObj = (db.surveys || []).find(s => s.id === survey_id);
    if (surveyObj && surveyObj.jenis === 'survei' && Array.isArray(surveyObj.sample_sls) && surveyObj.sample_sls.length > 0) {
      const sampleSet = new Set(surveyObj.sample_sls.map(s => String(s.id_sls || s).trim()));
      list = list.filter(item => sampleSet.has(String(item.id_sls).trim()));
    }
  }

  if (kec_id) {
    list = list.filter(item => String(item.id_kecamatan) === String(kec_id));
  }
  if (desa_id) {
    list = list.filter(item => String(item.id_desa) === String(desa_id));
  }
  if (kondisi) {
    list = list.filter(item => (item.kondisi || 'Baik') === kondisi);
  }
  if (kualitas_jaringan) {
    list = list.filter(item => (item.kualitas_jaringan || 'Kuat') === kualitas_jaringan);
  }
  if (perbaikan_batas !== undefined && perbaikan_batas !== '') {
    const isPerbaikan = perbaikan_batas === 'true' || perbaikan_batas === '1' || perbaikan_batas === 'ya' || perbaikan_batas === 'Ada';
    list = list.filter(item => item.perbaikan_batas === isPerbaikan);
  }
  if (perubahan_sls !== undefined && perubahan_sls !== '') {
    const isPerubahan = perubahan_sls === 'true' || perubahan_sls === 'ya' || perubahan_sls === '1' || perubahan_sls === 'Ada';
    list = list.filter(item => item.perubahan_sls === isPerubahan);
  }
  if (status_scan) {
    list = list.filter(item => (item.status_scan || 'Tidak').toUpperCase() === status_scan.toUpperCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item => 
      (item.no_peta && item.no_peta.toLowerCase().includes(q)) ||
      (item.id_sls && item.id_sls.toLowerCase().includes(q)) ||
      (item.nama_sls && item.nama_sls.toLowerCase().includes(q)) ||
      (item.ppl && item.ppl.toLowerCase().includes(q)) ||
      (item.petugas_scan && item.petugas_scan.toLowerCase().includes(q)) ||
      (item.catatan && item.catatan.toLowerCase().includes(q))
    );
  }

  if (sort_by === 'sls_asc') {
    list.sort((a, b) => a.id_sls.localeCompare(b.id_sls, undefined, { numeric: true }));
  } else {
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  res.json({ success: true, count: list.length, data: list });
});

// 5. POST Create Single Receiving Record
app.post('/api/receivings', async (req, res) => {
  const db = await readDB();
  const {
    no_peta,
    id_sls,
    nama_sls,
    id_kecamatan,
    id_desa,
    tgl_penerimaan,
    kondisi,
    ppl,
    no_bangunan_terbesar,
    catatan,
    perbaikan_batas,
    perubahan_sls,
    kode_jenis_perubahan_sls,
    kualitas_jaringan,
    status_scan,
    petugas_scan,
    petugas_receiving
  } = req.body;

  if (!id_sls || !id_kecamatan || !id_desa) {
    return res.status(400).json({ success: false, message: 'ID SLS, Kecamatan, dan Desa wajib diisi.' });
  }

  const newId = 'REC-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

  const isPerubahan = String(perubahan_sls) === 'true' || String(perubahan_sls) === 'ya' || String(perubahan_sls) === 'Ada';
  const isPerbaikanBatas = String(perbaikan_batas) === 'true' || String(perbaikan_batas) === 'ya' || String(perbaikan_batas) === 'Ada';
  const isScanYa = String(status_scan) === 'Ya' || String(status_scan) === 'ya' || String(status_scan) === 'true';

  let cleanKondisi = kondisi || 'Baik';
  if (cleanKondisi !== 'Baik' && cleanKondisi !== 'Rusak' && cleanKondisi !== 'Hilang') {
    cleanKondisi = 'Baik';
  }

  let cleanJaringan = kualitas_jaringan || 'Kuat';
  if (cleanJaringan !== 'Kuat' && cleanJaringan !== 'Sedang' && cleanJaringan !== 'Lemah') {
    cleanJaringan = 'Kuat';
  }

  const newRecord = {
    id: newId,
    no_peta: (no_peta || id_sls || '').trim(),
    id_sls: id_sls.trim(),
    nama_sls: (nama_sls || '').trim(),
    id_kecamatan: String(id_kecamatan),
    id_desa: String(id_desa),
    tgl_penerimaan: tgl_penerimaan || new Date().toISOString().split('T')[0],
    kondisi: cleanKondisi,
    ppl: ppl || '',
    no_bangunan_terbesar: Number(no_bangunan_terbesar) || 0,
    catatan: catatan || '',
    perbaikan_batas: isPerbaikanBatas,
    perubahan_sls: isPerubahan,
    kode_jenis_perubahan_sls: isPerubahan ? (kode_jenis_perubahan_sls || '') : '',
    kualitas_jaringan: cleanJaringan,
    status_scan: isScanYa ? 'Ya' : 'Tidak',
    petugas_scan: petugas_scan || '',
    petugas_receiving: petugas_receiving || '',
    tgl_scan: isScanYa ? new Date().toISOString().split('T')[0] : '',
    created_at: new Date().toISOString()
  };

  db.receivings.unshift(newRecord);
  await writeDB(db);

  res.status(201).json({ success: true, message: 'Penerimaan Peta berhasil dicatat.', data: newRecord });
});

// 5b. POST Bulk Create Receiving Records for 1 Desa
app.post('/api/receivings/bulk', async (req, res) => {
  const db = await readDB();
  const { items, petugas_receiving } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Pilih minimal satu data SLS untuk disimpan.' });
  }

  let addedCount = 0;
  const createdRecords = [];

  items.forEach(item => {
    if (!item.id_sls || !item.id_kecamatan || !item.id_desa) return;

    const newId = 'REC-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    const isPerubahan = String(item.perubahan_sls) === 'true' || String(item.perubahan_sls) === 'ya' || String(item.perubahan_sls) === 'Ada';
    const isPerbaikanBatas = String(item.perbaikan_batas) === 'true' || String(item.perbaikan_batas) === 'ya' || String(item.perbaikan_batas) === 'Ada';
    const isScanYa = String(item.status_scan) === 'Ya' || String(item.status_scan) === 'ya' || String(item.status_scan) === 'true';

    let cleanKondisi = item.kondisi || 'Baik';
    if (cleanKondisi !== 'Baik' && cleanKondisi !== 'Rusak' && cleanKondisi !== 'Hilang') {
      cleanKondisi = 'Baik';
    }

    let cleanJaringan = item.kualitas_jaringan || 'Kuat';
    if (cleanJaringan !== 'Kuat' && cleanJaringan !== 'Sedang' && cleanJaringan !== 'Lemah') {
      cleanJaringan = 'Kuat';
    }

    const newRecord = {
      id: newId,
      no_peta: (item.no_peta || item.id_sls || '').trim(),
      id_sls: item.id_sls.trim(),
      nama_sls: (item.nama_sls || '').trim(),
      id_kecamatan: String(item.id_kecamatan),
      id_desa: String(item.id_desa),
      tgl_penerimaan: item.tgl_penerimaan || new Date().toISOString().split('T')[0],
      kondisi: cleanKondisi,
      ppl: item.ppl || '',
      no_bangunan_terbesar: Number(item.no_bangunan_terbesar) || 0,
      catatan: item.catatan || '',
      perbaikan_batas: isPerbaikanBatas,
      perubahan_sls: isPerubahan,
      kode_jenis_perubahan_sls: isPerubahan ? (item.kode_jenis_perubahan_sls || '') : '',
      kualitas_jaringan: cleanJaringan,
      status_scan: isScanYa ? 'Ya' : 'Tidak',
      petugas_scan: item.petugas_scan || '',
      petugas_receiving: item.petugas_receiving || petugas_receiving || '',
      tgl_scan: isScanYa ? new Date().toISOString().split('T')[0] : '',
      created_at: new Date().toISOString()
    };

    db.receivings.unshift(newRecord);
    createdRecords.push(newRecord);
    addedCount++;
  });

  await writeDB(db);

  res.status(201).json({
    success: true,
    message: `Berhasil menyimpan ${addedCount} dokumen peta sekaligus untuk Desa ini!`,
    data: createdRecords
  });
});

// 5b-2. POST Fast Penerimaan Physical Checklist (Role: Penerima)
app.post('/api/receivings/penerima-bulk', async (req, res) => {
  const db = await readDB();
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Tidak ada data penerimaan untuk disimpan.' });
  }

  let countCreated = 0;
  let countUpdated = 0;

  items.forEach(item => {
    if (!item.id_sls) return;
    const cleanIdSls = String(item.id_sls).trim();
    const existingIndex = db.receivings.findIndex(r => String(r.id_sls).trim() === cleanIdSls);

    const statusDiterima = item.status_diterima || 'Sudah Diterima';
    const tglDiterima = item.tgl_diterima || new Date().toISOString().split('T')[0];
    const petugasPenerima = item.petugas_penerima || 'Nana Sumarna';

    if (existingIndex !== -1) {
      db.receivings[existingIndex].status_diterima = statusDiterima;
      db.receivings[existingIndex].tgl_diterima = tglDiterima;
      db.receivings[existingIndex].petugas_penerima = petugasPenerima;
      if (item.kondisi) {
        db.receivings[existingIndex].kondisi = (item.kondisi === 'Baik' || item.kondisi === 'Rusak' || item.kondisi === 'Hilang') ? item.kondisi : 'Baik';
      }
      if (item.no_bangunan_terbesar !== undefined) {
        db.receivings[existingIndex].no_bangunan_terbesar = Number(item.no_bangunan_terbesar) || 0;
      }
      countUpdated++;
    } else {
      const newId = 'REC-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
      const cleanKondisi = (item.kondisi === 'Baik' || item.kondisi === 'Rusak' || item.kondisi === 'Hilang') ? item.kondisi : 'Baik';
      const newRecord = {
        id: newId,
        no_peta: cleanIdSls,
        id_sls: cleanIdSls,
        nama_sls: (item.nama_sls || '').trim(),
        id_kecamatan: String(item.id_kecamatan || (cleanIdSls.length >= 7 ? cleanIdSls.slice(0, 7) : '')),
        id_desa: String(item.id_desa || (cleanIdSls.length >= 10 ? cleanIdSls.slice(0, 10) : '')),
        status_diterima: statusDiterima,
        tgl_diterima: tglDiterima,
        petugas_penerima: petugasPenerima,
        tgl_penerimaan: tglDiterima,
        kondisi: cleanKondisi,
        ppl: '',
        no_bangunan_terbesar: Number(item.no_bangunan_terbesar) || 0,
        catatan: '',
        perbaikan_batas: false,
        perubahan_sls: false,
        kode_jenis_perubahan_sls: '',
        kualitas_jaringan: 'Kuat',
        status_scan: 'Tidak',
        petugas_scan: '',
        petugas_receiving: '',
        created_at: new Date().toISOString()
      };
      db.receivings.unshift(newRecord);
      countCreated++;
    }
  });

  await writeDB(db);

  res.json({
    success: true,
    message: `Berhasil memperbarui status penerimaan fisik ${countCreated + countUpdated} dokumen peta!`,
    count_created: countCreated,
    count_updated: countUpdated
  });
});

// 5c. PUT Update Full Receiving Record Details
app.put('/api/receivings/:id', async (req, res) => {
  const db = await readDB();
  const { id } = req.params;

  const index = db.receivings.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data receiving tidak ditemukan.' });
  }

  const {
    tgl_penerimaan,
    kondisi,
    ppl,
    no_bangunan_terbesar,
    catatan,
    perbaikan_batas,
    perubahan_sls,
    kode_jenis_perubahan_sls,
    kualitas_jaringan
  } = req.body;

  const record = db.receivings[index];

  if (tgl_penerimaan) record.tgl_penerimaan = tgl_penerimaan;
  if (kondisi) {
    record.kondisi = (kondisi === 'Baik' || kondisi === 'Rusak' || kondisi === 'Hilang') ? kondisi : 'Baik';
  }
  if (ppl !== undefined) record.ppl = String(ppl).trim();
  if (no_bangunan_terbesar !== undefined) record.no_bangunan_terbesar = Number(no_bangunan_terbesar) || 0;
  if (catatan !== undefined) record.catatan = String(catatan).trim();
  
  if (perbaikan_batas !== undefined) {
    record.perbaikan_batas = String(perbaikan_batas) === 'true' || String(perbaikan_batas) === 'ya' || String(perbaikan_batas) === 'Ada';
  }

  if (perubahan_sls !== undefined) {
    const isPerubahan = String(perubahan_sls) === 'true' || String(perubahan_sls) === 'ya' || String(perubahan_sls) === 'Ada';
    record.perubahan_sls = isPerubahan;
    record.kode_jenis_perubahan_sls = isPerubahan ? (kode_jenis_perubahan_sls || record.kode_jenis_perubahan_sls || '') : '';
  }

  if (kualitas_jaringan) {
    record.kualitas_jaringan = (kualitas_jaringan === 'Kuat' || kualitas_jaringan === 'Sedang' || kualitas_jaringan === 'Lemah') ? kualitas_jaringan : 'Kuat';
  }

  await writeDB(db);

  res.json({
    success: true,
    message: `Data receiving peta SLS ${record.id_sls} berhasil diperbarui.`,
    data: record
  });
});

// 6. PUT Update Scanning Status
app.put('/api/receivings/:id/scan', async (req, res) => {
  const db = await readDB();
  const { id } = req.params;

  const index = db.receivings.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data peta tidak ditemukan.' });
  }

  const { status_scan, petugas_scan, tgl_scan } = req.body;
  const isScanYa = String(status_scan) === 'Ya' || String(status_scan) === 'ya' || String(status_scan) === 'true';

  db.receivings[index].status_scan = isScanYa ? 'Ya' : 'Tidak';
  if (petugas_scan !== undefined) {
    db.receivings[index].petugas_scan = petugas_scan.trim();
  }
  if (isScanYa) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const defaultStamp = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    db.receivings[index].tgl_scan = tgl_scan || db.receivings[index].tgl_scan || defaultStamp;
  } else {
    db.receivings[index].tgl_scan = '';
  }

  await writeDB(db);

  res.json({
    success: true,
    message: `Status scanning peta ${db.receivings[index].no_peta} berhasil diperbarui (${db.receivings[index].status_scan}).`,
    data: db.receivings[index]
  });
});

// 7. DELETE Receiving Record
app.delete('/api/receivings/:id', async (req, res) => {
  const db = await readDB();
  const { id } = req.params;

  const index = db.receivings.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data receiving tidak ditemukan.' });
  }

  const deletedId = db.receivings[index].id;
  db.receivings.splice(index, 1);
  await deleteReceivingDB(deletedId);
  await writeDB(db);

  res.json({ success: true, message: 'Data receiving berhasil dihapus.' });
});

// 8. GET Stats Dashboard
app.get('/api/stats', async (req, res) => {
  const db = await readDB();
  const list = db.receivings || [];

  const totalPeta = list.length;
  const totalDiterima = list.filter(r => (r.status_diterima || 'Belum Diterima') === 'Sudah Diterima' || r.status_diterima === 'Ya').length;
  const perubahanSls = list.filter(r => r.perubahan_sls).length;
  const perbaikanBatas = list.filter(r => r.perbaikan_batas).length;
  const kondisiRusak = list.filter(r => r.kondisi === 'Rusak').length;
  const kondisiHilang = list.filter(r => r.kondisi === 'Hilang').length;
  const totalScanned = list.filter(r => r.status_scan === 'Ya').length;
  const totalUnscanned = list.filter(r => (r.status_scan || 'Tidak') === 'Tidak').length;

  res.json({
    success: true,
    data: {
      total_peta: totalPeta,
      total_diterima: totalDiterima,
      perubahan_sls: perubahanSls,
      perbaikan_batas: perbaikanBatas,
      kondisi_rusak: kondisiRusak,
      kondisi_hilang: kondisiHilang,
      total_scanned: totalScanned,
      total_unscanned: totalUnscanned
    }
  });
});

// 9. GET CSV Export
app.get('/api/export/csv', async (req, res) => {
  const db = await readDB();
  let list = db.receivings || [];

  list.sort((a, b) => a.id_sls.localeCompare(b.id_sls, undefined, { numeric: true }));

  const headers = [
    'ID', 'No Peta', 'ID SLS', 'Nama SLS', 'Kecamatan ID', 'Desa ID', 'Status Diterima', 'Tgl Diterima', 'Petugas Penerima',
    'Tanggal Penerimaan', 'Kondisi Peta', 'PPL', 'No Bangunan Terbesar', 'Catatan', 'Ada Perbaikan Batas',
    'Perubahan SLS', 'Kode Perubahan SLS', 'Kualitas Jaringan Internet',
    'Sudah Discan?', 'Petugas Scan', 'Tanggal Scan', 'Waktu Entry'
  ];

  const rows = list.map(item => [
    `"${item.id}"`,
    `"${item.no_peta}"`,
    `"${item.id_sls}"`,
    `"${(item.nama_sls || '').replace(/"/g, '""')}"`,
    `"${item.id_kecamatan}"`,
    `"${item.id_desa}"`,
    `"${item.status_diterima || 'Belum Diterima'}"`,
    `"${item.tgl_diterima || item.tgl_penerimaan || ''}"`,
    `"${(item.petugas_penerima || item.petugas_receiving || '').replace(/"/g, '""')}"`,
    `"${item.tgl_penerimaan}"`,
    `"${item.kondisi || 'Baik'}"`,
    `"${item.ppl}"`,
    item.no_bangunan_terbesar || 0,
    `"${(item.catatan || '').replace(/"/g, '""')}"`,
    item.perbaikan_batas ? 'Ada' : 'Tidak Ada',
    item.perubahan_sls ? 'Ada' : 'Tidak Ada',
    `"${item.kode_jenis_perubahan_sls || ''}"`,
    `"${item.kualitas_jaringan || 'Kuat'}"`,
    `"${item.status_scan || 'Tidak'}"`,
    `"${(item.petugas_scan || '').replace(/"/g, '""')}"`,
    `"${item.tgl_scan || ''}"`,
    `"${item.created_at}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="rekap_receiving_scanning_peta_' + Date.now() + '.csv"');
  res.status(200).send(csvContent);
});

// 10. GET Excel Export (.xlsx)
app.get('/api/export/excel', async (req, res) => {
  const db = await readDB();
  const master = getMasterUtp();
  let list = db.receivings || [];

  const { survey_id, kec_id, desa_id, kondisi, kualitas_jaringan, perbaikan_batas, perubahan_sls, search } = req.query;

  if (survey_id) {
    const surveyObj = (db.surveys || []).find(s => s.id === survey_id);
    if (surveyObj && surveyObj.jenis === 'survei' && Array.isArray(surveyObj.sample_sls) && surveyObj.sample_sls.length > 0) {
      const sampleSet = new Set(surveyObj.sample_sls.map(s => String(s.id_sls || s).trim()));
      list = list.filter(item => sampleSet.has(String(item.id_sls).trim()));
    }
  }

  if (kec_id) list = list.filter(item => String(item.id_kecamatan) === String(kec_id));
  if (desa_id) list = list.filter(item => String(item.id_desa) === String(desa_id));
  if (kondisi) list = list.filter(item => (item.kondisi || 'Baik') === kondisi);
  if (kualitas_jaringan) list = list.filter(item => (item.kualitas_jaringan || 'Kuat') === kualitas_jaringan);
  if (perbaikan_batas !== undefined && perbaikan_batas !== '') {
    const isPerbaikan = perbaikan_batas === 'true' || perbaikan_batas === 'ya' || perbaikan_batas === '1' || perbaikan_batas === 'Ada';
    list = list.filter(item => item.perbaikan_batas === isPerbaikan);
  }
  if (perubahan_sls !== undefined && perubahan_sls !== '') {
    const isPerubahan = perubahan_sls === 'true' || perubahan_sls === 'ya' || perubahan_sls === '1' || perubahan_sls === 'Ada';
    list = list.filter(item => item.perubahan_sls === isPerubahan);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item => 
      (item.no_peta && item.no_peta.toLowerCase().includes(q)) ||
      (item.id_sls && item.id_sls.toLowerCase().includes(q)) ||
      (item.nama_sls && item.nama_sls.toLowerCase().includes(q)) ||
      (item.ppl && item.ppl.toLowerCase().includes(q)) ||
      (item.catatan && item.catatan.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => a.id_sls.localeCompare(b.id_sls, undefined, { numeric: true }));

  const kecMap = new Map((master.kecamatan || []).map(k => [String(k.id), k.nama]));
  const desaMap = new Map((master.desa || []).map(d => [String(d.id), d.nama]));
  const kodeMap = new Map((master.kode_perubahan_sls || []).map(k => [String(k.kode), k.label]));

  const rows = list.map((r, i) => ({
    "No": i + 1,
    "No Peta": r.no_peta || r.id_sls,
    "ID SLS": r.id_sls,
    "Nama SLS": r.nama_sls || '',
    "Kecamatan": kecMap.get(String(r.id_kecamatan)) || r.id_kecamatan,
    "Desa / Kelurahan": desaMap.get(String(r.id_desa)) || r.id_desa,
    "Status Diterima": r.status_diterima || 'Belum Diterima',
    "Tgl Diterima": r.tgl_diterima || r.tgl_penerimaan || '',
    "Petugas Penerima": r.petugas_penerima || r.petugas_receiving || '',
    "Tgl Penerimaan / Entry": r.tgl_penerimaan || '',
    "Kondisi Fisik Peta": r.kondisi || 'Baik',
    "PPL (Pencacah)": r.ppl || '',
    "No Bangunan Terbesar": r.no_bangunan_terbesar || 0,
    "Ada Perbaikan Batas": r.perbaikan_batas ? 'Ada' : 'Tidak Ada',
    "Ada Perubahan SLS": r.perubahan_sls ? 'Ada' : 'Tidak Ada',
    "Jenis Perubahan SLS": r.perubahan_sls ? (kodeMap.get(String(r.kode_jenis_perubahan_sls)) || r.kode_jenis_perubahan_sls || '-') : '-',
    "Kualitas Jaringan Internet": r.kualitas_jaringan || 'Kuat',
    "Sudah Discan?": r.status_scan || 'Tidak',
    "Petugas Scan": r.petugas_scan || '-',
    "Tgl Scan": r.tgl_scan || '-',
    "Catatan": r.catatan || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 18 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 14 },
    { wch: 16 },
    { wch: 25 },
    { wch: 24 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 30 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Penerimaan Peta");

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="rekap_peta_receiving.xlsx"');
  res.status(200).send(buffer);
});

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  res.status(404).json({ success: false, message: 'Endpoint API tidak ditemukan.' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Shi-Peta - BPS Kabupaten Pandeglang`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
