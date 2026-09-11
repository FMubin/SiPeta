// Global Application State
const state = {
  master: { kecamatan: [], desa: [], ppl: [], kode_perubahan_sls: [] },
  currentSlsList: [],
  receivings: [],
  users: [],
  currentUser: null,
  surveys: [],
  activeSurveyId: 'srv-sensus-14utp',
  stats: {},
  activeTab: 'receiving',
  receivingMode: 'bulk', // 'bulk' or 'single'
  filters: {
    kec_id: '',
    desa_id: '',
    search: '',
    sort_by: 'sls_asc',
    status_scan: '',
    status_diterima: '',
    kode_perubahan: '',
    search_perubahan: '',
    search_scanning: '',
    kondisi: '',
    jaringan: '',
    perbaikan_batas: '',
    perubahan_sls: ''
  },
  pagination: {
    receivings: { page: 1, limit: 10 },
    perubahan: { page: 1, limit: 10 },
    scanning: { page: 1, limit: 10 },
    dashboardKec: { page: 1, limit: 10 },
    users: { page: 1, limit: 10 }
  }
};

// DOM Elements
const elements = {
  mainTabs: document.getElementById('mainTabs'),
  tabContents: document.querySelectorAll('.tab-content'),
  filterKecamatan: document.getElementById('filterKecamatan'),
  filterDesa: document.getElementById('filterDesa'),
  filterStatusDiterima: document.getElementById('filterStatusDiterima'),
  filterKondisi: document.getElementById('filterKondisi'),
  filterJaringan: document.getElementById('filterJaringan'),
  filterPerbaikanBatas: document.getElementById('filterPerbaikanBatas'),
  filterPerubahanSls: document.getElementById('filterPerubahanSls'),
  btnResetFilter: document.getElementById('btnResetFilter'),
  btnExportExcel: document.getElementById('btnExportExcel'),
  tabBtnDashboard: document.getElementById('tabBtnDashboard'),
  dashSurveyTitle: document.getElementById('dashSurveyTitle'),
  dashProgressPct: document.getElementById('dashProgressPct'),
  dashRecCount: document.getElementById('dashRecCount'),
  dashRecTotalTarget: document.getElementById('dashRecTotalTarget'),
  dashRecBar: document.getElementById('dashRecBar'),
  dashScanCount: document.getElementById('dashScanCount'),
  dashScanPct: document.getElementById('dashScanPct'),
  dashScanBar: document.getElementById('dashScanBar'),
  dashPerubahanSlsCount: document.getElementById('dashPerubahanSlsCount'),
  dashPerbaikanBatasCount: document.getElementById('dashPerbaikanBatasCount'),
  dashRusakCount: document.getElementById('dashRusakCount'),
  dashHilangCount: document.getElementById('dashHilangCount'),
  dashKondisiSummaryText: document.getElementById('dashKondisiSummaryText'),
  barKondisiBaik: document.getElementById('barKondisiBaik'),
  barKondisiRusak: document.getElementById('barKondisiRusak'),
  barKondisiHilang: document.getElementById('barKondisiHilang'),
  valKondisiBaik: document.getElementById('valKondisiBaik'),
  valKondisiRusak: document.getElementById('valKondisiRusak'),
  valKondisiHilang: document.getElementById('valKondisiHilang'),
  barJaringanKuat: document.getElementById('barJaringanKuat'),
  barJaringanSedang: document.getElementById('barJaringanSedang'),
  barJaringanLemah: document.getElementById('barJaringanLemah'),
  valJaringanKuat: document.getElementById('valJaringanKuat'),
  valJaringanSedang: document.getElementById('valJaringanSedang'),
  valJaringanLemah: document.getElementById('valJaringanLemah'),
  dashLatestReceivingsList: document.getElementById('dashLatestReceivingsList'),
  tbodyDashKecamatanProgress: document.getElementById('tbodyDashKecamatanProgress'),
  infoDashKecPage: document.getElementById('infoDashKecPage'),
  limitDashKec: document.getElementById('limitDashKec'),
  btnPrevDashKec: document.getElementById('btnPrevDashKec'),
  txtPageDashKec: document.getElementById('txtPageDashKec'),
  btnNextDashKec: document.getElementById('btnNextDashKec'),
  
  // Auth & Profile Header Elements
  modalLogin: document.getElementById('modalLogin'),
  formLogin: document.getElementById('formLogin'),
  loginUsername: document.getElementById('loginUsername'),
  loginPassword: document.getElementById('loginPassword'),
  loginAlert: document.getElementById('loginAlert'),
  loginAlertText: document.getElementById('loginAlertText'),
  modalLoginSuccess: document.getElementById('modalLoginSuccess'),
  loginSuccessUser: document.getElementById('loginSuccessUser'),
  loginSuccessRole: document.getElementById('loginSuccessRole'),
  loginSuccessMessage: document.getElementById('loginSuccessMessage'),
  btnDismissLoginSuccess: document.getElementById('btnDismissLoginSuccess'),
  userProfileHeader: document.getElementById('userProfileHeader'),
  hdrUserName: document.getElementById('hdrUserName'),
  hdrUserRole: document.getElementById('hdrUserRole'),
  btnLogout: document.getElementById('btnLogout'),

  // Navigation Tab Buttons
  tabBtnPenerima: document.getElementById('tabBtnPenerima'),
  tabBtnReceiving: document.getElementById('tabBtnReceiving'),
  tabBtnDaftarPeta: document.getElementById('tabBtnDaftarPeta'),
  tabBtnPerubahanSls: document.getElementById('tabBtnPerubahanSls'),
  tabBtnScanning: document.getElementById('tabBtnScanning'),
  tabBtnSurvey: document.getElementById('tabBtnSurvey'),
  tabBtnUsers: document.getElementById('tabBtnUsers'),

  // Multi-Surveys Elements
  selectActiveSurveyHeader: document.getElementById('selectActiveSurveyHeader'),
  btnOpenAddSurveyModal: document.getElementById('btnOpenAddSurveyModal'),
  tbodySurveys: document.getElementById('tbodySurveys'),

  // Modal Survey Form
  modalSurveyForm: document.getElementById('modalSurveyForm'),
  modalSurveyTitle: document.getElementById('modalSurveyTitle'),
  surveyEditId: document.getElementById('surveyEditId'),
  inputSurveyNama: document.getElementById('inputSurveyNama'),
  inputSurveyJenis: document.getElementById('inputSurveyJenis'),
  inputSurveyTahun: document.getElementById('inputSurveyTahun'),
  inputSurveyStatus: document.getElementById('inputSurveyStatus'),
  formSurvey: document.getElementById('formSurvey'),
  btnCloseSurveyModal: document.getElementById('btnCloseSurveyModal'),
  btnCancelSurveyModal: document.getElementById('btnCancelSurveyModal'),

  // Modal Upload Sample
  modalUploadSample: document.getElementById('modalUploadSample'),
  uploadSampleSurveyTitle: document.getElementById('uploadSampleSurveyTitle'),
  uploadSampleSurveyId: document.getElementById('uploadSampleSurveyId'),
  inputSampleFileModal: document.getElementById('inputSampleFileModal'),
  btnCloseUploadSampleModal: document.getElementById('btnCloseUploadSampleModal'),
  btnCancelUploadSampleModal: document.getElementById('btnCancelUploadSampleModal'),
  btnSubmitUploadSampleModal: document.getElementById('btnSubmitUploadSampleModal'),

  // User Management Elements
  formAddUser: document.getElementById('formAddUser'),
  inputUserNama: document.getElementById('inputUserNama'),
  inputUserUsername: document.getElementById('inputUserUsername'),
  inputUserPassword: document.getElementById('inputUserPassword'),
  inputUserRole: document.getElementById('inputUserRole'),
  addUserKecContainer: document.getElementById('addUserKecContainer'),
  btnToggleAllAddUserKec: document.getElementById('btnToggleAllAddUserKec'),
  addUserSurveyContainer: document.getElementById('addUserSurveyContainer'),
  btnToggleAllAddUserSurvey: document.getElementById('btnToggleAllAddUserSurvey'),
  tbodyUsers: document.getElementById('tbodyUsers'),
  inputImportUsersSurvey: document.getElementById('inputImportUsersSurvey'),
  inputImportUsersFile: document.getElementById('inputImportUsersFile'),
  btnProcessImportUsers: document.getElementById('btnProcessImportUsers'),
  infoUsersPage: document.getElementById('infoUsersPage'),
  limitUsers: document.getElementById('limitUsers'),
  btnPrevUsers: document.getElementById('btnPrevUsers'),
  btnNextUsers: document.getElementById('btnNextUsers'),
  txtPageUsers: document.getElementById('txtPageUsers'),

  // Modal Allocation Elements
  modalAllocation: document.getElementById('modalAllocation'),
  modalAllocUserTitle: document.getElementById('modalAllocUserTitle'),
  editAllocUserId: document.getElementById('editAllocUserId'),
  editAllocKecContainer: document.getElementById('editAllocKecContainer'),
  btnToggleAllAllocKec: document.getElementById('btnToggleAllAllocKec'),
  editAllocSurveyContainer: document.getElementById('editAllocSurveyContainer'),
  btnToggleAllAllocSurvey: document.getElementById('btnToggleAllAllocSurvey'),
  formEditAllocation: document.getElementById('formEditAllocation'),
  btnCloseAllocModal: document.getElementById('btnCloseAllocModal'),
  btnCancelAllocModal: document.getElementById('btnCancelAllocModal'),

  // Modal Edit User & Reset Password Elements
  modalEditUser: document.getElementById('modalEditUser'),
  modalEditUserTitle: document.getElementById('modalEditUserTitle'),
  editUserId: document.getElementById('editUserId'),
  editUserNama: document.getElementById('editUserNama'),
  editUserUsername: document.getElementById('editUserUsername'),
  editUserPassword: document.getElementById('editUserPassword'),
  editUserRole: document.getElementById('editUserRole'),
  editUserKecContainer: document.getElementById('editUserKecContainer'),
  btnToggleAllEditUserKec: document.getElementById('btnToggleAllEditUserKec'),
  editUserSurveyContainer: document.getElementById('editUserSurveyContainer'),
  btnToggleAllEditUserSurvey: document.getElementById('btnToggleAllEditUserSurvey'),
  formEditUser: document.getElementById('formEditUser'),
  btnCloseEditUserModal: document.getElementById('btnCloseEditUserModal'),
  btnCancelEditUserModal: document.getElementById('btnCancelEditUserModal'),

  // Perubahan SLS & Scanning Filter Elements
  filterKecamatanPerubahan: document.getElementById('filterKecamatanPerubahan'),
  filterDesaPerubahan: document.getElementById('filterDesaPerubahan'),
  btnResetFilterPerubahan: document.getElementById('btnResetFilterPerubahan'),
  searchPerubahanSls: document.getElementById('searchPerubahanSls'),
  filterKodePerubahanSls: document.getElementById('filterKodePerubahanSls'),

  filterKecamatanScanning: document.getElementById('filterKecamatanScanning'),
  filterDesaScanning: document.getElementById('filterDesaScanning'),
  btnResetFilterScanning: document.getElementById('btnResetFilterScanning'),
  searchScanning: document.getElementById('searchScanning'),

  // Stats
  statPetaKecamatan: document.getElementById('statPetaKecamatan'),
  statTotal: document.getElementById('statTotal'),
  statScanned: document.getElementById('statScanned'),
  statUnscanned: document.getElementById('statUnscanned'),
  statPerubahanSls: document.getElementById('statPerubahanSls'),
  statPerbaikanBatas: document.getElementById('statPerbaikanBatas'),
  statRusak: document.getElementById('statRusak'),
  statHilang: document.getElementById('statHilang'),
  badgeTotalPeta: document.getElementById('badgeTotalPeta'),
  badgePerubahanSls: document.getElementById('badgePerubahanSls'),
  badgeScan: document.getElementById('badgeScan'),
  countPerubahanSlsBig: document.getElementById('countPerubahanSlsBig'),

  // Receiving Form Modes & Header Selectors
  btnModeBulk: document.getElementById('btnModeBulk'),
  btnModeSingle: document.getElementById('btnModeSingle'),
  viewBulkEntry: document.getElementById('viewBulkEntry'),
  viewSingleEntry: document.getElementById('viewSingleEntry'),
  inputKecamatan: document.getElementById('inputKecamatan'),
  inputDesa: document.getElementById('inputDesa'),
  inputTglPenerimaanBulk: document.getElementById('inputTglPenerimaanBulk'),
  btnAutoNoPeta: document.getElementById('btnAutoNoPeta'),
  bulkEmptyState: document.getElementById('bulkEmptyState'),
  bulkTableContainer: document.getElementById('bulkTableContainer'),
  bulkDesaInfo: document.getElementById('bulkDesaInfo'),
  tbodyBulkSls: document.getElementById('tbodyBulkSls'),
  chkSelectAllRows: document.getElementById('chkSelectAllRows'),
  btnCheckAllBulk: document.getElementById('btnCheckAllBulk'),
  txtSelectedCount: document.getElementById('txtSelectedCount'),
  btnSubmitBulk: document.getElementById('btnSubmitBulk'),

  // Single Receiving Form
  formReceiving: document.getElementById('formReceiving'),
  selectSlsMaster: document.getElementById('selectSlsMaster'),
  inputNamaSls: document.getElementById('inputNamaSls'),
  inputNoPeta: document.getElementById('inputNoPeta'),
  inputIdSls: document.getElementById('inputIdSls'),
  inputTglPenerimaan: document.getElementById('inputTglPenerimaan'),
  inputKondisi: document.getElementById('inputKondisi'),
  inputPpl: document.getElementById('inputPpl'),
  listPpl: document.getElementById('listPpl'),
  inputNoBangunanTerbesar: document.getElementById('inputNoBangunanTerbesar'),
  inputKualasJaringan: document.getElementById('inputKualasJaringan'),
  inputCatatan: document.getElementById('inputCatatan'),
  sectionPerubahanSls: document.getElementById('sectionPerubahanSls'),
  inputKodeJenisPerubahanSls: document.getElementById('inputKodeJenisPerubahanSls'),

  // Modal Edit Receiving Elements
  modalEditReceiving: document.getElementById('modalEditReceiving'),
  editReceivingId: document.getElementById('editReceivingId'),
  editReceivingSlsTitle: document.getElementById('editReceivingSlsTitle'),
  editTglPenerimaan: document.getElementById('editTglPenerimaan'),
  editKondisiPeta: document.getElementById('editKondisiPeta'),
  editPpl: document.getElementById('editPpl'),
  editNoBangunan: document.getElementById('editNoBangunan'),
  editPerbaikanBatas: document.getElementById('editPerbaikanBatas'),
  editKualitasJaringan: document.getElementById('editKualitasJaringan'),
  editKodeJenisPerubahanSls: document.getElementById('editKodeJenisPerubahanSls'),
  editCatatan: document.getElementById('editCatatan'),
  formEditReceiving: document.getElementById('formEditReceiving'),
  btnCloseEditReceivingModal: document.getElementById('btnCloseEditReceivingModal'),
  btnCancelEditReceivingModal: document.getElementById('btnCancelEditReceivingModal'),
  
  // Tables
  tbodyReceivings: document.getElementById('tbodyReceivings'),
  tbodyPerubahanSls: document.getElementById('tbodyPerubahanSls'),
  tbodyScanning: document.getElementById('tbodyScanning'),
  searchReceiving: document.getElementById('searchReceiving'),
  selectSortReceiving: document.getElementById('selectSortReceiving'),
  filterStatusScan: document.getElementById('filterStatusScan'),
  btnExportCsv: document.getElementById('btnExportCsv'),

  // Pagination Elements
  infoReceivingsPage: document.getElementById('infoReceivingsPage'),
  limitReceivings: document.getElementById('limitReceivings'),
  btnPrevReceivings: document.getElementById('btnPrevReceivings'),
  btnNextReceivings: document.getElementById('btnNextReceivings'),
  txtPageReceivings: document.getElementById('txtPageReceivings'),

  infoPerubahanPage: document.getElementById('infoPerubahanPage'),
  limitPerubahan: document.getElementById('limitPerubahan'),
  btnPrevPerubahan: document.getElementById('btnPrevPerubahan'),
  btnNextPerubahan: document.getElementById('btnNextPerubahan'),
  txtPagePerubahan: document.getElementById('txtPagePerubahan'),

  infoScanningPage: document.getElementById('infoScanningPage'),
  limitScanning: document.getElementById('limitScanning'),
  btnPrevScanning: document.getElementById('btnPrevScanning'),
  btnNextScanning: document.getElementById('btnNextScanning'),
  txtPageScanning: document.getElementById('txtPageScanning'),

  // Role Penerima Elements
  inputPenerimaKecamatan: document.getElementById('inputPenerimaKecamatan'),
  inputPenerimaDesa: document.getElementById('inputPenerimaDesa'),
  inputTglDiterima: document.getElementById('inputTglDiterima'),
  lblPetugasPenerima: document.getElementById('lblPetugasPenerima'),
  viewPenerimaEntry: document.getElementById('viewPenerimaEntry'),
  penerimaEmptyState: document.getElementById('penerimaEmptyState'),
  penerimaTableContainer: document.getElementById('penerimaTableContainer'),
  penerimaDesaInfo: document.getElementById('penerimaDesaInfo'),
  btnCheckAllPenerima: document.getElementById('btnCheckAllPenerima'),
  tbodyPenerima: document.getElementById('tbodyPenerima'),
  txtPenerimaCount: document.getElementById('txtPenerimaCount'),
  btnSubmitPenerima: document.getElementById('btnSubmitPenerima'),

  // Dashboard Diterima Metrics
  statPetaDiterima: document.getElementById('statPetaDiterima'),
  dashDiterimaCount: document.getElementById('dashDiterimaCount'),
  dashDiterimaPct: document.getElementById('dashDiterimaPct'),
  dashDiterimaBar: document.getElementById('dashDiterimaBar')
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  initDateInput();
  setupEventListeners();
  checkAuth();
  await loadMasterData();
  await refreshAllData();
});

function initDateInput() {
  const today = new Date().toISOString().split('T')[0];
  if (elements.inputTglPenerimaan) {
    elements.inputTglPenerimaan.value = today;
  }
  if (elements.inputTglPenerimaanBulk) {
    elements.inputTglPenerimaanBulk.value = today;
  }
  if (elements.inputTglDiterima) {
    elements.inputTglDiterima.value = today;
  }
}

// -------------------------------------------------------------
// AUTHENTICATION & ROLE MANAGEMENT
// -------------------------------------------------------------

function checkAuth() {
  const savedUser = localStorage.getItem('bps_user');
  if (savedUser) {
    try {
      const u = JSON.parse(savedUser);
      if (u && u.id && u.username && u.role) {
        state.currentUser = u;
        applyUserPermissions();
        hideLoginModal();
        return;
      }
    } catch (e) {}
    localStorage.removeItem('bps_user');
  }
  showLoginModal();
}

function showLoginModal() {
  if (elements.modalLogin) elements.modalLogin.classList.remove('hidden');
}

function hideLoginModal() {
  if (elements.modalLogin) elements.modalLogin.classList.add('hidden');
}

function showLoginSuccessModal(user) {
  const roleLabels = {
    superadmin: 'Super Administrator',
    admin: 'Administrator',
    penerima: 'Petugas Penerima Dokumen',
    entry: 'Petugas Entry',
    scan: 'Petugas Scan'
  };
  
  if (elements.loginSuccessUser) elements.loginSuccessUser.textContent = user.nama || user.username;
  if (elements.loginSuccessRole) elements.loginSuccessRole.textContent = roleLabels[user.role] || user.role;
  if (elements.loginSuccessMessage) elements.loginSuccessMessage.textContent = `Selamat datang kembali, ${user.nama || user.username}!`;

  if (elements.modalLoginSuccess) {
    elements.modalLoginSuccess.classList.remove('hidden');
  }
}

function hideLoginSuccessModal() {
  if (elements.modalLoginSuccess) elements.modalLoginSuccess.classList.add('hidden');
}

window.fillLoginDemo = function(username, password) {
  if (elements.loginUsername) elements.loginUsername.value = username;
  if (elements.loginPassword) elements.loginPassword.value = password;
  if (elements.formLogin) {
    if (typeof elements.formLogin.requestSubmit === 'function') {
      elements.formLogin.requestSubmit();
    } else {
      elements.formLogin.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }
};

function applyUserPermissions() {
  const user = state.currentUser;
  if (!user) return;

  if (elements.hdrUserName) elements.hdrUserName.textContent = user.nama || user.username;
  
  const roleLabels = {
    superadmin: 'Super Administrator',
    admin: 'Administrator',
    penerima: 'Petugas Penerima Dokumen',
    entry: 'Petugas Entry',
    scan: 'Petugas Scan'
  };
  if (elements.hdrUserRole) elements.hdrUserRole.textContent = roleLabels[user.role] || user.role;

  // Role-based Navigation Tabs Visibility
  const isSuperAdmin = user.role === 'superadmin';
  const isRegularAdmin = user.role === 'admin';
  const isAdmin = isRegularAdmin || isSuperAdmin;
  const isPenerima = user.role === 'penerima';
  const isEntry = user.role === 'entry';
  const isScan = user.role === 'scan';

  // 1. Dashboard: Hide for Penerima, Entry, and Scan roles
  const hideDashboard = isPenerima || isEntry || isScan;
  if (elements.tabBtnDashboard) elements.tabBtnDashboard.classList.toggle('hidden', hideDashboard);
  const topStatsContainer = document.getElementById('topStatsBarContainer');
  if (topStatsContainer) topStatsContainer.classList.toggle('hidden', hideDashboard);

  // 2. Tab visibility settings:
  // - Penerima: Penerimaan Dokumen (Cek Fisik Diterima)
  // - Entry: Receiving Peta, Daftar Peta, Perubahan SLS
  // - Scan: Status Scanning
  // - Admin (Regular Admin): Penerimaan Dokumen, Daftar Peta, Perubahan SLS, Status Scanning, Kelola Kegiatan, Kelola Petugas
  // - Superadmin: ONLY Summary (top cards), Kelola Kegiatan, and Kelola Petugas (NO Penerimaan Peta tab)
  if (elements.tabBtnPenerima) elements.tabBtnPenerima.classList.toggle('hidden', !isPenerima && !isRegularAdmin);
  if (elements.tabBtnReceiving) elements.tabBtnReceiving.classList.toggle('hidden', !isEntry);
  if (elements.tabBtnDaftarPeta) elements.tabBtnDaftarPeta.classList.toggle('hidden', !isEntry && !isRegularAdmin);
  if (elements.tabBtnPerubahanSls) elements.tabBtnPerubahanSls.classList.toggle('hidden', !isEntry && !isRegularAdmin);
  if (elements.tabBtnScanning) elements.tabBtnScanning.classList.toggle('hidden', !isScan && !isRegularAdmin);
  if (elements.tabBtnSurvey) elements.tabBtnSurvey.classList.toggle('hidden', !isAdmin);
  if (elements.tabBtnUsers) elements.tabBtnUsers.classList.toggle('hidden', !isAdmin);

  // Re-populate dropdowns
  populateMasterDropdowns();
  populateRoleDropdowns();

  // Fetch surveys for ALL users so header selector & survey filtering work for Petugas
  fetchSurveys();

  // Switch to allowed active tab if current active tab is restricted
  if (isSuperAdmin) {
    if (state.activeTab !== 'survey' && state.activeTab !== 'users' && state.activeTab !== 'dashboard') {
      switchTab('survey');
    }
    fetchUsers();
  } else if (isRegularAdmin) {
    if (state.activeTab === 'receiving') {
      switchTab('daftarpeta');
    }
    fetchUsers();
  } else if (isPenerima) {
    if (elements.lblPetugasPenerima) elements.lblPetugasPenerima.textContent = user.nama || user.username;
    switchTab('penerima');
  } else if (isScan) {
    switchTab('batching');
  } else if (isEntry) {
    if (state.activeTab === 'scanning' || state.activeTab === 'batching' || state.activeTab === 'users' || state.activeTab === 'survey' || state.activeTab === 'penerima') {
      switchTab('receiving');
    }
  }
}

function populateRoleDropdowns() {
  const isSuper = state.currentUser && state.currentUser.role === 'superadmin';
  const options = isSuper ? `
    <option value="penerima">Petugas Penerima Dokumen</option>
    <option value="entry">Petugas Entry / Receiving</option>
    <option value="scan">Petugas Scanning</option>
    <option value="admin">Administrator</option>
  ` : `
    <option value="penerima">Petugas Penerima Dokumen</option>
    <option value="entry">Petugas Entry / Receiving</option>
    <option value="scan">Petugas Scanning</option>
  `;
  if (elements.inputUserRole) elements.inputUserRole.innerHTML = options;
  if (elements.editUserRole) elements.editUserRole.innerHTML = options;
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');

  elements.tabContents.forEach(c => c.classList.add('hidden'));
  const targetTab = document.getElementById(`tab-${tabName}`);
  if (targetTab) targetTab.classList.remove('hidden');
  state.activeTab = tabName;

  if (tabName === 'penerima') {
    fetchPenerimaSlsList();
  }
}

async function fetchSurveys() {
  try {
    const res = await fetch('/api/surveys');
    const json = await res.json();
    if (json.success) {
      state.surveys = json.data || [];
      populateHeaderSurveySelector();
      renderSurveysTable();
      populateSurveyCheckboxes();
      populateMasterDropdowns();
    }
  } catch (err) {
    console.error('Fetch surveys error', err);
  }
}

function getAvailableSurveysForUser() {
  const user = state.currentUser;
  const allSurveys = state.surveys || [];
  if (!user || user.role === 'admin' || user.role === 'superadmin' || !Array.isArray(user.assigned_surveys) || user.assigned_surveys.length === 0) {
    return allSurveys;
  }
  const assigned = user.assigned_surveys.map(String);
  return allSurveys.filter(s => assigned.includes(String(s.id)));
}

function populateHeaderSurveySelector() {
  const selectors = document.querySelectorAll('.select-active-survey, #selectActiveSurveyHeader');
  if (selectors.length === 0) return;

  const availableSurveys = getAvailableSurveysForUser();

  const optionsHtml = availableSurveys.map(s => {
    const countLabel = s.jenis === 'survei' ? ` (${s.sample_sls ? s.sample_sls.length : 0} SLS Sampel)` : ` (Sensus 7.609 SLS)`;
    return `<option value="${s.id}" ${s.id === state.activeSurveyId ? 'selected' : ''}>${s.nama_kegiatan}${countLabel}</option>`;
  }).join('');

  selectors.forEach(sel => {
    sel.innerHTML = optionsHtml;
    sel.value = state.activeSurveyId;
  });

  if (!availableSurveys.some(s => s.id === state.activeSurveyId) && availableSurveys.length > 0) {
    const prevActiveId = state.activeSurveyId;
    state.activeSurveyId = availableSurveys[0].id;
    selectors.forEach(sel => sel.value = state.activeSurveyId);
    populateMasterDropdowns();
    if (prevActiveId !== state.activeSurveyId) {
      if (elements.inputDesa && elements.inputDesa.value) {
        fetchSlsListForDesa(elements.inputDesa.value);
      }
      refreshAllData();
    }
  }
}

function renderSurveysTable() {
  if (!elements.tbodySurveys) return;
  const list = state.surveys || [];
  if (list.length === 0) {
    elements.tbodySurveys.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">Belum ada kegiatan / survei terdaftar.</td></tr>`;
    return;
  }

  elements.tbodySurveys.innerHTML = list.map((s, idx) => {
    const jenisBadge = s.jenis === 'survei' 
      ? '<span class="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-list-check mr-1"></i>Survei Sampel</span>'
      : '<span class="bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-earth-asia mr-1"></i>Sensus Full</span>';

    const statusBadge = s.status === 'aktif'
      ? '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Aktif</span>'
      : '<span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Selesai</span>';

    const sampleCount = s.jenis === 'survei' ? `${s.sample_sls ? s.sample_sls.length : 0} SLS Sampel` : '7.609 SLS (Full Sensus)';

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="p-3 text-center font-mono text-slate-400">${idx + 1}</td>
        <td class="p-3">
          <div class="font-bold text-slate-800">${s.nama_kegiatan}</div>
          <div class="text-[10px] text-slate-400 font-mono">ID: ${s.id}</div>
        </td>
        <td class="p-3">${jenisBadge}</td>
        <td class="p-3 text-center font-mono font-semibold">${s.tahun || '-'}</td>
        <td class="p-3 font-semibold text-slate-700">${sampleCount}</td>
        <td class="p-3 text-center">${statusBadge}</td>
        <td class="p-3 text-center space-x-1">
          <button onclick="openUploadSampleModal('${s.id}')" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-2.5 py-1 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm" title="Upload Excel Master SLS Sampel">
            <i class="fa-solid fa-file-excel"></i> Sampel
          </button>
          <button onclick="openEditSurveyModal('${s.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm" title="Edit Metadata Kegiatan">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          ${s.id === 'srv-sensus-14utp' ? '' : `
            <button onclick="deleteSurvey('${s.id}')" class="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-2 py-1 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm" title="Hapus Kegiatan">
              <i class="fa-solid fa-trash"></i>
            </button>
          `}
        </td>
      </tr>`;
  }).join('');
}

function getKecamatanListForSurveys(selectedSurveyIds = []) {
  const allKec = (state.master && state.master.kecamatan) || [];
  if (!Array.isArray(selectedSurveyIds) || selectedSurveyIds.length === 0) {
    return allKec;
  }

  const surveys = state.surveys || [];
  const selectedSurveys = surveys.filter(s => selectedSurveyIds.includes(String(s.id)));

  // If any selected survey is 'sensus', return all kecamatan
  const hasSensus = selectedSurveys.some(s => s.jenis === 'sensus');
  if (hasSensus) {
    return allKec;
  }

  // Collect all valid kecamatan IDs from sample SLS of selected survei types
  const validKecIds = new Set();
  selectedSurveys.forEach(s => {
    if (s.jenis === 'survei' && Array.isArray(s.sample_sls)) {
      s.sample_sls.forEach(item => {
        const id = String(item.id_sls || item).trim();
        const kecId = item.kec_id ? String(item.kec_id) : (id.length >= 7 ? id.slice(0, 7) : '');
        if (kecId) validKecIds.add(kecId);
      });
    }
  });

  if (validKecIds.size === 0) return allKec;
  return allKec.filter(k => validKecIds.has(String(k.id)));
}

function updateAddUserKecCheckboxes() {
  if (!elements.addUserKecContainer) return;
  const checkedSurveyIds = Array.from(document.querySelectorAll('.chk-add-user-survey:checked')).map(c => c.value);
  const filteredKec = getKecamatanListForSurveys(checkedSurveyIds);
  const currentlyChecked = new Set(Array.from(document.querySelectorAll('.chk-add-user-kec:checked')).map(c => c.value));

  elements.addUserKecContainer.innerHTML = filteredKec.map(k => {
    const isChecked = currentlyChecked.has(String(k.id));
    return `
      <label class="flex items-center space-x-2 text-slate-700 hover:bg-slate-100 p-1.5 rounded cursor-pointer border border-slate-200 bg-white">
        <input type="checkbox" class="chk-add-user-kec w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500" value="${k.id}" ${isChecked ? 'checked' : ''}>
        <span class="font-semibold text-xs">${k.nama}</span>
      </label>
    `;
  }).join('');
}

function updateEditUserKecCheckboxes(initialAssignedKec = null) {
  const container = document.getElementById('editUserKecContainer');
  if (!container) return;

  const checkedSurveyIds = Array.from(document.querySelectorAll('.chk-edit-user-survey:checked')).map(c => c.value);
  const filteredKec = getKecamatanListForSurveys(checkedSurveyIds);

  const currentlyChecked = initialAssignedKec !== null 
    ? new Set(initialAssignedKec.map(String))
    : new Set(Array.from(document.querySelectorAll('.chk-edit-user-kec:checked')).map(c => c.value));

  container.innerHTML = filteredKec.map(k => {
    const isChecked = currentlyChecked.has(String(k.id));
    return `
      <label class="flex items-center space-x-2 text-slate-700 hover:bg-slate-100 p-1.5 rounded cursor-pointer border border-slate-200 bg-white">
        <input type="checkbox" class="chk-edit-user-kec w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500" value="${k.id}" ${isChecked ? 'checked' : ''}>
        <span class="font-semibold text-xs">${k.nama}</span>
      </label>
    `;
  }).join('');
}

function updateAllocKecCheckboxes(initialAssignedKec = null) {
  const container = elements.editAllocKecContainer;
  if (!container) return;

  const checkedSurveyIds = Array.from(document.querySelectorAll('.chk-edit-alloc-survey:checked')).map(c => c.value);
  const filteredKec = getKecamatanListForSurveys(checkedSurveyIds);

  const currentlyChecked = initialAssignedKec !== null
    ? new Set(initialAssignedKec.map(String))
    : new Set(Array.from(document.querySelectorAll('.chk-edit-alloc-kec:checked')).map(c => c.value));

  container.innerHTML = filteredKec.map(k => {
    const isChecked = currentlyChecked.has(String(k.id));
    return `
      <label class="flex items-center space-x-2 text-slate-700 hover:bg-slate-100 p-2 rounded-lg cursor-pointer border border-slate-200 bg-white">
        <input type="checkbox" class="chk-edit-alloc-kec w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" value="${k.id}" ${isChecked ? 'checked' : ''}>
        <span class="font-semibold text-xs">${k.nama}</span>
      </label>
    `;
  }).join('');
}

function populateSurveyCheckboxes() {
  const allSurveys = state.surveys || [];
  const renderBoxes = (clsName) => allSurveys.map(s => `
    <label class="flex items-center space-x-2 text-slate-700 hover:bg-slate-100 p-1.5 rounded cursor-pointer border border-slate-200 bg-white">
      <input type="checkbox" class="${clsName} w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500" value="${s.id}">
      <span class="font-semibold text-xs">${s.nama_kegiatan} <span class="text-[10px] text-slate-400">(${s.jenis})</span></span>
    </label>
  `).join('');

  if (elements.addUserSurveyContainer) {
    elements.addUserSurveyContainer.innerHTML = renderBoxes('chk-add-user-survey');
    document.querySelectorAll('.chk-add-user-survey').forEach(chk => {
      chk.addEventListener('change', updateAddUserKecCheckboxes);
    });
    updateAddUserKecCheckboxes();
  }

  if (elements.inputImportUsersSurvey) {
    elements.inputImportUsersSurvey.innerHTML = '<option value="">-- Pilih Kegiatan / Survei --</option>' +
      allSurveys.map(s => `<option value="${s.id}">${s.nama_kegiatan} (${s.jenis === 'survei' ? (s.sample_sls ? s.sample_sls.length : 0) + ' Sampel' : 'Sensus Full'})</option>`).join('');
  }
}

async function fetchUsers() {
  const user = state.currentUser;
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) return;
  try {
    const res = await fetch('/api/users');
    const json = await res.json();
    if (json.success) {
      state.users = json.data;
      renderUsersTable();
    }
  } catch (err) {
    console.error('Fetch users error', err);
  }
}

function renderUsersTable() {
  if (!elements.tbodyUsers) return;
  const list = state.users || [];
  const total = list.length;
  const page = state.pagination.users.page;
  const limit = state.pagination.users.limit;

  const totalPages = Math.ceil(total / limit) || 1;
  if (state.pagination.users.page > totalPages) state.pagination.users.page = totalPages;

  const startIdx = (state.pagination.users.page - 1) * limit;
  const endIdx = Math.min(startIdx + limit, total);
  const pagedList = list.slice(startIdx, endIdx);

  if (total === 0) {
    elements.tbodyUsers.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">Belum ada akun petugas.</td></tr>`;
  } else {
    const roleBadges = {
      superadmin: '<span class="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300"><i class="fa-solid fa-crown mr-1"></i>Super Admin</span>',
      admin: '<span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Administrator</span>',
      penerima: '<span class="bg-teal-100 text-teal-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-300"><i class="fa-solid fa-square-check mr-1"></i>Penerima Dokumen</span>',
      entry: '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Petugas Entry</span>',
      scan: '<span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Petugas Scan</span>'
    };

    const allKec = state.master.kecamatan || [];
    const currentRole = state.currentUser ? state.currentUser.role : 'entry';

    elements.tbodyUsers.innerHTML = pagedList.map((u, idx) => {
      const globalIdx = startIdx + idx + 1;
      let kecBadges = '<span class="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">Semua Wilayah</span>';
      if (Array.isArray(u.assigned_kec) && u.assigned_kec.length > 0 && u.role !== 'admin' && u.role !== 'superadmin') {
        const names = u.assigned_kec.map(id => {
          const k = allKec.find(item => String(item.id) === String(id));
          return k ? k.nama : id;
        });
        kecBadges = names.map(n => `<span class="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mr-1 mb-1">${n}</span>`).join('');
      }

      let surveyBadges = '<span class="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">Semua Kegiatan</span>';
      if (Array.isArray(u.assigned_surveys) && u.assigned_surveys.length > 0 && u.role !== 'admin' && u.role !== 'superadmin') {
        const names = u.assigned_surveys.map(id => {
          const s = (state.surveys || []).find(item => String(item.id) === String(id));
          return s ? s.nama_kegiatan : id;
        });
        surveyBadges = names.map(n => `<span class="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mr-1 mb-1">${n}</span>`).join('');
      }

      const isProtected = u.username === 'superadmin' || (currentRole === 'admin' && (u.role === 'admin' || u.role === 'superadmin'));

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="p-3 text-center font-mono text-slate-400">${globalIdx}</td>
          <td class="p-3 font-bold text-slate-800">${u.nama}</td>
          <td class="p-3 font-mono text-slate-600">${u.username}</td>
          <td class="p-3">${roleBadges[u.role] || u.role}</td>
          <td class="p-3">${kecBadges}<br>${surveyBadges}</td>
          <td class="p-3 text-center space-x-1.5">
            ${isProtected ? '<span class="text-slate-400 text-xs italic">Diproteksi</span>' : `
              <button onclick="openEditUserModal('${u.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm" title="Edit Data Petugas, Reset Password & Alokasi Wilayah/Kegiatan">
                <i class="fa-solid fa-user-pen"></i> Edit Akun
              </button>
              <button onclick="deleteUser('${u.id}')" class="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-2.5 py-1 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm" title="Hapus User">
                <i class="fa-solid fa-trash"></i> Hapus
              </button>
            `}
          </td>
        </tr>`;
    }).join('');
  }

  // Update Pagination Controls
  if (elements.infoUsersPage) {
    elements.infoUsersPage.textContent = total === 0 
      ? 'Menampilkan 0 petugas' 
      : `Menampilkan ${startIdx + 1} - ${endIdx} dari ${total} petugas`;
  }
  if (elements.txtPageUsers) elements.txtPageUsers.textContent = `Hal ${state.pagination.users.page} / ${totalPages}`;
  if (elements.btnPrevUsers) elements.btnPrevUsers.disabled = (state.pagination.users.page <= 1);
  if (elements.btnNextUsers) elements.btnNextUsers.disabled = (state.pagination.users.page >= totalPages);
}

window.openEditUserModal = function(userId) {
  const u = (state.users || []).find(x => x.id === userId);
  if (!u) return;

  const modal = document.getElementById('modalEditUser');
  const title = document.getElementById('modalEditUserTitle');
  const inpId = document.getElementById('editUserId');
  const inpNama = document.getElementById('editUserNama');
  const inpUsername = document.getElementById('editUserUsername');
  const inpPassword = document.getElementById('editUserPassword');
  const inpRole = document.getElementById('editUserRole');
  const surveyContainer = document.getElementById('editUserSurveyContainer');

  if (title) title.textContent = `Petugas: ${u.nama} (@${u.username})`;
  if (inpId) inpId.value = u.id;
  if (inpNama) inpNama.value = u.nama;
  if (inpUsername) inpUsername.value = u.username;
  if (inpPassword) inpPassword.value = '';
  if (inpRole) inpRole.value = u.role;

  const allSurveys = state.surveys || [];
  const assignedSurveys = u.assigned_surveys || [];
  const assignedKec = u.assigned_kec || [];

  if (surveyContainer) {
    surveyContainer.innerHTML = allSurveys.map(s => {
      const isChecked = assignedSurveys.includes(String(s.id));
      return `
        <label class="flex items-center space-x-2 text-slate-700 hover:bg-slate-100 p-1.5 rounded cursor-pointer border border-slate-200 bg-white">
          <input type="checkbox" class="chk-edit-user-survey w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500" value="${s.id}" ${isChecked ? 'checked' : ''}>
          <span class="font-semibold text-xs">${s.nama_kegiatan} <span class="text-[10px] text-slate-400">(${s.jenis})</span></span>
        </label>
      `;
    }).join('');

    document.querySelectorAll('.chk-edit-user-survey').forEach(chk => {
      chk.addEventListener('change', () => updateEditUserKecCheckboxes());
    });
  }

  updateEditUserKecCheckboxes(assignedKec);

  if (modal) modal.classList.remove('hidden');
};

function closeEditUserModal() {
  const modal = document.getElementById('modalEditUser');
  if (modal) modal.classList.add('hidden');
}

function closeEditReceivingModal() {
  if (elements.modalEditReceiving) elements.modalEditReceiving.classList.add('hidden');
}

window.openAllocModal = function(userId) {
  const u = (state.users || []).find(x => x.id === userId);
  if (!u) return;

  if (elements.modalAllocUserTitle) {
    const roleText = u.role === 'entry' ? 'Petugas Entry' : u.role === 'scan' ? 'Petugas Scan' : 'Admin';
    elements.modalAllocUserTitle.textContent = `Petugas: ${u.nama} (${roleText})`;
  }
  if (elements.editAllocUserId) elements.editAllocUserId.value = u.id;

  const allSurveys = state.surveys || [];
  const assignedSurveys = u.assigned_surveys || [];
  const assignedKec = u.assigned_kec || [];

  if (elements.editAllocSurveyContainer) {
    elements.editAllocSurveyContainer.innerHTML = allSurveys.map(s => {
      const isChecked = assignedSurveys.includes(String(s.id));
      return `
        <label class="flex items-center space-x-2 text-slate-700 hover:bg-slate-100 p-2 rounded-lg cursor-pointer border border-slate-200 bg-white">
          <input type="checkbox" class="chk-edit-alloc-survey w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" value="${s.id}" ${isChecked ? 'checked' : ''}>
          <span class="font-semibold text-xs">${s.nama_kegiatan} <span class="text-[10px] text-slate-400">(${s.jenis})</span></span>
        </label>
      `;
    }).join('');

    document.querySelectorAll('.chk-edit-alloc-survey').forEach(chk => {
      chk.addEventListener('change', () => updateAllocKecCheckboxes());
    });
  }

  updateAllocKecCheckboxes(assignedKec);

  if (elements.modalAllocation) elements.modalAllocation.classList.remove('hidden');
};

function closeAllocModal() {
  if (elements.modalAllocation) elements.modalAllocation.classList.add('hidden');
}

window.openAddSurveyModal = function() {
  if (elements.surveyEditId) elements.surveyEditId.value = '';
  if (elements.inputSurveyNama) elements.inputSurveyNama.value = '';
  if (elements.inputSurveyJenis) elements.inputSurveyJenis.value = 'sensus';
  if (elements.inputSurveyTahun) elements.inputSurveyTahun.value = new Date().getFullYear();
  if (elements.inputSurveyStatus) elements.inputSurveyStatus.value = 'aktif';
  if (elements.modalSurveyTitle) elements.modalSurveyTitle.innerHTML = '<i class="fa-solid fa-folder-plus text-amber-400"></i> Tambah Kegiatan / Survei Baru';
  if (elements.modalSurveyForm) elements.modalSurveyForm.classList.remove('hidden');
};

function closeSurveyModal() {
  if (elements.modalSurveyForm) elements.modalSurveyForm.classList.add('hidden');
}

window.openEditSurveyModal = function(surveyId) {
  const s = (state.surveys || []).find(x => x.id === surveyId);
  if (!s) return;

  if (elements.surveyEditId) elements.surveyEditId.value = s.id;
  if (elements.inputSurveyNama) elements.inputSurveyNama.value = s.nama_kegiatan;
  if (elements.inputSurveyJenis) elements.inputSurveyJenis.value = s.jenis || 'sensus';
  if (elements.inputSurveyTahun) elements.inputSurveyTahun.value = s.tahun || new Date().getFullYear();
  if (elements.inputSurveyStatus) elements.inputSurveyStatus.value = s.status || 'aktif';
  if (elements.modalSurveyTitle) elements.modalSurveyTitle.innerHTML = '<i class="fa-solid fa-pen-to-square text-amber-400"></i> Edit Kegiatan / Survei';
  if (elements.modalSurveyForm) elements.modalSurveyForm.classList.remove('hidden');
};

window.openUploadSampleModal = function(surveyId) {
  const s = (state.surveys || []).find(x => x.id === surveyId);
  if (!s) return;

  if (elements.uploadSampleSurveyId) elements.uploadSampleSurveyId.value = s.id;
  if (elements.uploadSampleSurveyTitle) elements.uploadSampleSurveyTitle.textContent = `Kegiatan: ${s.nama_kegiatan}`;
  if (elements.inputSampleFileModal) elements.inputSampleFileModal.value = '';
  if (elements.modalUploadSample) elements.modalUploadSample.classList.remove('hidden');
};

function closeUploadSampleModal() {
  if (elements.modalUploadSample) elements.modalUploadSample.classList.add('hidden');
}

window.deleteSurvey = async function(surveyId) {
  if (!confirm('Apakah Anda yakin ingin menghapus kegiatan/survei ini?')) return;
  try {
    const res = await fetch(`/api/surveys/${surveyId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast(json.message, 'success');
      await fetchSurveys();
    } else {
      showToast(json.message || 'Gagal menghapus kegiatan', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan', 'error');
  }
};

window.deleteUser = async function(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus akun petugas ini?')) return;
  try {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Akun petugas berhasil dihapus', 'success');
      await fetchUsers();
    } else {
      showToast(json.message || 'Gagal menghapus user', 'error');
    }
  } catch (err) {
    showToast('Terjadi kesalahan jaringan', 'error');
  }
};

// -------------------------------------------------------------
// API CALLS
// -------------------------------------------------------------

async function loadMasterData() {
  try {
    const res = await fetch('/api/master');
    const json = await res.json();
    if (json.success) {
      state.master = json.data;
      populateMasterDropdowns();
    }
  } catch (err) {
    showToast('Gagal memuat master data SLS BPS Kabupaten Pandeglang', 'error');
  }
}

async function fetchSlsListForDesa(desaId) {
  if (!desaId) {
    state.currentSlsList = [];
    if (elements.selectSlsMaster) elements.selectSlsMaster.innerHTML = '<option value="">-- Pilih Desa Terlebih Dahulu --</option>';
    renderBulkSlsTable();
    return;
  }

  if (elements.selectSlsMaster) elements.selectSlsMaster.innerHTML = '<option value="">Memuat daftar SLS...</option>';
  try {
    const surveyParam = state.activeSurveyId ? `&survey_id=${state.activeSurveyId}` : '';
    const res = await fetch(`/api/master/sls?desa_id=${desaId}${surveyParam}`);
    const json = await res.json();
    if (json.success) {
      state.currentSlsList = json.data;
      
      // Update Single Form Dropdown
      if (elements.selectSlsMaster) {
        if (json.data.length === 0) {
          elements.selectSlsMaster.innerHTML = '<option value="">Tidak ada SLS pada Desa ini</option>';
        } else {
          elements.selectSlsMaster.innerHTML = '<option value="">-- Pilih Kode SLS / Nama SLS --</option>' +
            json.data.map(s => `<option value="${s.id_sls}">${s.id_sls} - ${s.nama_sls} (PPL: ${s.ppl || '-'})</option>`).join('');
        }
      }

      // Render Bulk SLS Grid
      renderBulkSlsTable();
    }
  } catch (err) {
    showToast('Gagal memuat SLS untuk desa ini', 'error');
  }
}

async function refreshAllData() {
  await Promise.all([
    fetchReceivings(),
    fetchStats()
  ]);
}

async function fetchReceivings() {
  try {
    const params = new URLSearchParams();
    if (state.activeSurveyId) params.append('survey_id', state.activeSurveyId);
    if (state.filters.kec_id) params.append('kec_id', state.filters.kec_id);
    if (state.filters.desa_id) params.append('desa_id', state.filters.desa_id);
    if (state.filters.search) params.append('search', state.filters.search);
    if (state.filters.sort_by) params.append('sort_by', state.filters.sort_by);
    if (state.filters.status_scan) params.append('status_scan', state.filters.status_scan);
    if (state.filters.status_diterima) params.append('status_diterima', state.filters.status_diterima);
    if (state.filters.kondisi) params.append('kondisi', state.filters.kondisi);
    if (state.filters.jaringan) params.append('kualitas_jaringan', state.filters.jaringan);
    if (state.filters.perbaikan_batas) params.append('perbaikan_batas', state.filters.perbaikan_batas);
    if (state.filters.perubahan_sls) params.append('perubahan_sls', state.filters.perubahan_sls);

    const res = await fetch('/api/receivings?' + params.toString());
    const json = await res.json();
    if (json.success) {
      state.receivings = json.data;
      renderReceivingsTable();
      renderPerubahanSlsTable();
      renderScanningTable();
    }
  } catch (err) {
    showToast('Gagal memuat data receiving peta', 'error');
  }
}

async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const json = await res.json();
    if (json.success) {
      state.stats = json.data;
      renderStats();
    }
  } catch (err) {
    console.error('Fetch stats error', err);
  }
}

// -------------------------------------------------------------
// UI POPULATION & RENDERING
// -------------------------------------------------------------

function getAvailableKecamatanList() {
  const user = state.currentUser;
  let allKec = (state.master && state.master.kecamatan) || [];
  
  // 1. Filter by Petugas Assigned Kecamatan (if restricted user)
  if (user && user.role !== 'admin' && user.role !== 'superadmin' && Array.isArray(user.assigned_kec) && user.assigned_kec.length > 0) {
    const assigned = user.assigned_kec.map(String);
    allKec = allKec.filter(k => assigned.includes(String(k.id)));
  }

  // 2. Filter by Active Survey sample SLS if active survey is a survei type with sample_sls
  if (state.activeSurveyId) {
    const surveyObj = (state.surveys || []).find(s => s.id === state.activeSurveyId);
    if (surveyObj && surveyObj.jenis === 'survei' && Array.isArray(surveyObj.sample_sls) && surveyObj.sample_sls.length > 0) {
      const sampleKecIds = new Set();
      surveyObj.sample_sls.forEach(item => {
        const id = String(item.id_sls || item).trim();
        const kecId = item.kec_id ? String(item.kec_id) : (id.length >= 7 ? id.slice(0, 7) : '');
        if (kecId) sampleKecIds.add(kecId);
      });
      if (sampleKecIds.size > 0) {
        allKec = allKec.filter(k => sampleKecIds.has(String(k.id)));
      }
    }
  }

  return allKec;
}

function getAvailableDesaList(selectedKecId = '') {
  const availableKec = getAvailableKecamatanList();
  const availableKecIds = availableKec.map(k => String(k.id));

  let filteredDesa = (state.master && state.master.desa) || [];

  // Filter by selected or available Kecamatan
  if (selectedKecId) {
    filteredDesa = filteredDesa.filter(d => String(d.kec_id) === String(selectedKecId));
  } else {
    filteredDesa = filteredDesa.filter(d => availableKecIds.includes(String(d.kec_id)));
  }

  // Filter by Active Survey sample SLS if active survey is a survei type with sample_sls
  if (state.activeSurveyId) {
    const surveyObj = (state.surveys || []).find(s => s.id === state.activeSurveyId);
    if (surveyObj && surveyObj.jenis === 'survei' && Array.isArray(surveyObj.sample_sls) && surveyObj.sample_sls.length > 0) {
      const sampleDesaIds = new Set();
      surveyObj.sample_sls.forEach(item => {
        const id = String(item.id_sls || item).trim();
        const desaId = item.desa_id ? String(item.desa_id) : (id.length >= 10 ? id.slice(0, 10) : '');
        if (desaId) sampleDesaIds.add(desaId);
      });
      if (sampleDesaIds.size > 0) {
        filteredDesa = filteredDesa.filter(d => sampleDesaIds.has(String(d.id)));
      }
    }
  }

  return filteredDesa;
}

function getFilteredReceivingsForUser() {
  let list = state.receivings || [];
  const user = state.currentUser;

  // Filter by Active Survey if active survey is a survei type with sample_sls
  if (state.activeSurveyId) {
    const surveyObj = (state.surveys || []).find(s => s.id === state.activeSurveyId);
    if (surveyObj && surveyObj.jenis === 'survei' && Array.isArray(surveyObj.sample_sls) && surveyObj.sample_sls.length > 0) {
      const sampleSet = new Set(surveyObj.sample_sls.map(s => String(s.id_sls || s).trim()));
      list = list.filter(item => sampleSet.has(String(item.id_sls).trim()));
    }
  }

  if (user && user.role !== 'admin' && user.role !== 'superadmin' && Array.isArray(user.assigned_kec) && user.assigned_kec.length > 0) {
    const assigned = user.assigned_kec.map(String);
    list = list.filter(item => assigned.includes(String(item.id_kecamatan)));
  }

  // Filter by Status Diterima
  if (state.filters.status_diterima) {
    if (state.filters.status_diterima === 'Belum Diterima') {
      list = list.filter(item => (item.status_diterima || 'Belum Diterima') === 'Belum Diterima');
    } else {
      list = list.filter(item => (item.status_diterima || 'Belum Diterima') !== 'Belum Diterima');
    }
  }

  // Filter by Kondisi Peta
  if (state.filters.kondisi) {
    list = list.filter(item => (item.kondisi || 'Baik') === state.filters.kondisi);
  }

  // Filter by Kualitas Jaringan/Sinyal
  if (state.filters.jaringan) {
    list = list.filter(item => (item.kualitas_jaringan || 'Kuat') === state.filters.jaringan);
  }

  // Filter by Perbaikan Batas
  if (state.filters.perbaikan_batas) {
    const isPerbaikan = state.filters.perbaikan_batas === 'ya' || state.filters.perbaikan_batas === 'true' || state.filters.perbaikan_batas === 'Ada';
    list = list.filter(item => item.perbaikan_batas === isPerbaikan);
  }

  // Filter by Perubahan SLS
  if (state.filters.perubahan_sls) {
    const isPerubahan = state.filters.perubahan_sls === 'ya' || state.filters.perubahan_sls === 'true' || state.filters.perubahan_sls === 'Ada';
    list = list.filter(item => item.perubahan_sls === isPerubahan);
  }

  return list;
}

function populateMasterDropdowns() {
  const availableKec = getAvailableKecamatanList();
  const allKec = (state.master && state.master.kecamatan) || [];

  const kecOptions = '<option value="">-- Pilih Kecamatan --</option>' +
    availableKec.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
  
  const isRestrictedUser = state.currentUser && state.currentUser.role !== 'admin' && state.currentUser.role !== 'superadmin' && Array.isArray(state.currentUser.assigned_kec) && state.currentUser.assigned_kec.length > 0;
  
  const kecFilterOptions = isRestrictedUser
    ? '<option value="">Semua Kecamatan Hak Akses</option>' + availableKec.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')
    : '<option value="">Semua Kecamatan</option>' + availableKec.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');

  if (elements.inputKecamatan) elements.inputKecamatan.innerHTML = kecOptions;
  if (elements.inputPenerimaKecamatan) elements.inputPenerimaKecamatan.innerHTML = kecFilterOptions;
  if (elements.filterKecamatan) elements.filterKecamatan.innerHTML = kecFilterOptions;
  if (elements.filterKecamatanPerubahan) elements.filterKecamatanPerubahan.innerHTML = kecFilterOptions;
  if (elements.filterKecamatanScanning) elements.filterKecamatanScanning.innerHTML = kecFilterOptions;

  // Auto-select first kecamatan & first desa for inputPenerima to load table fast & smoothly
  if (availableKec.length > 0) {
    if (elements.inputPenerimaKecamatan && !elements.inputPenerimaKecamatan.value) {
      elements.inputPenerimaKecamatan.value = availableKec[0].id;
    }
    const currentKecId = elements.inputPenerimaKecamatan ? elements.inputPenerimaKecamatan.value : availableKec[0].id;
    const filteredDesa = getAvailableDesaList(currentKecId);
    if (elements.inputPenerimaDesa) {
      elements.inputPenerimaDesa.innerHTML = '<option value="">Semua Desa/Kelurahan</option>' +
        filteredDesa.map(d => `<option value="${d.id}">${d.nama}</option>`).join('');
      if (filteredDesa.length > 0 && !elements.inputPenerimaDesa.value) {
        elements.inputPenerimaDesa.value = filteredDesa[0].id;
      }
    }
  }

  // Auto-select if restricted user has only 1 assigned kecamatan
  if (isRestrictedUser && availableKec.length === 1) {
    if (elements.inputKecamatan) elements.inputKecamatan.value = availableKec[0].id;
  }

  // Populate Add User Kecamatan Checkboxes (For Admin Form)
  if (elements.addUserKecContainer) {
    elements.addUserKecContainer.innerHTML = allKec.map(k => `
      <label class="flex items-center space-x-2 text-slate-700 hover:bg-slate-100 p-1.5 rounded cursor-pointer border border-slate-200 bg-white">
        <input type="checkbox" class="chk-add-user-kec w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500" value="${k.id}">
        <span class="font-semibold text-xs">${k.nama}</span>
      </label>
    `).join('');
  }

  const kodeOptions = '<option value="">-- Pilih Kode Perubahan --</option>' +
    (state.master.kode_perubahan_sls || []).map(k => `<option value="${k.kode}">${k.label}</option>`).join('');
  if (elements.inputKodeJenisPerubahanSls) elements.inputKodeJenisPerubahanSls.innerHTML = kodeOptions;

  const kodeFilterOptions = '<option value="">Semua Jenis Perubahan (1-9)</option>' +
    (state.master.kode_perubahan_sls || []).map(k => `<option value="${k.kode}">${k.label}</option>`).join('');
  if (elements.filterKodePerubahanSls) elements.filterKodePerubahanSls.innerHTML = kodeFilterOptions;

  if (state.master.ppl && elements.listPpl) {
    elements.listPpl.innerHTML = state.master.ppl.map(p => `<option value="${p.label || p.nama}"></option>`).join('');
  }

  updateFilterDesaDropdown();
  updateDesaDropdowns();
  fetchPenerimaSlsList();
}

function updateDesaDropdowns(selectedKecId = '') {
  const kecId = selectedKecId || (elements.inputKecamatan ? elements.inputKecamatan.value : '');
  const filteredDesa = getAvailableDesaList(kecId);

  const desaOptions = '<option value="">-- Pilih Desa / Kelurahan --</option>' +
    filteredDesa.map(d => `<option value="${d.id}">${d.nama}</option>`).join('');

  if (elements.inputDesa) elements.inputDesa.innerHTML = desaOptions;
  if (elements.selectSlsMaster) elements.selectSlsMaster.innerHTML = '<option value="">-- Pilih Desa Terlebih Dahulu --</option>';
  state.currentSlsList = [];
  renderBulkSlsTable();
}

function updateFilterDesaDropdown(kecId = '') {
  const filteredDesa = getAvailableDesaList(kecId);

  const desaFilterOptions = '<option value="">Semua Desa/Kelurahan Hak Akses</option>' +
    filteredDesa.map(d => `<option value="${d.id}">${d.nama}</option>`).join('');

  if (elements.filterDesa) elements.filterDesa.innerHTML = desaFilterOptions;
  if (elements.filterDesaPerubahan) elements.filterDesaPerubahan.innerHTML = desaFilterOptions;
  if (elements.filterDesaScanning) elements.filterDesaScanning.innerHTML = desaFilterOptions;
}

function syncRegionFilters(kecId, desaId) {
  state.filters.kec_id = kecId;
  state.filters.desa_id = desaId;

  if (elements.filterKecamatan) elements.filterKecamatan.value = kecId;
  if (elements.filterKecamatanPerubahan) elements.filterKecamatanPerubahan.value = kecId;
  if (elements.filterKecamatanScanning) elements.filterKecamatanScanning.value = kecId;

  updateFilterDesaDropdown(kecId);

  if (elements.filterDesa) elements.filterDesa.value = desaId;
  if (elements.filterDesaPerubahan) elements.filterDesaPerubahan.value = desaId;
  if (elements.filterDesaScanning) elements.filterDesaScanning.value = desaId;

  state.pagination.receivings.page = 1;
  state.pagination.perubahan.page = 1;
  state.pagination.scanning.page = 1;
}

function calculateTotalPetaKecamatan() {
  const availKec = getAvailableKecamatanList();
  const availKecIds = new Set(availKec.map(k => String(k.id)));

  if (state.activeSurveyId) {
    const surveyObj = (state.surveys || []).find(s => s.id === state.activeSurveyId);
    if (surveyObj && surveyObj.jenis === 'survei' && Array.isArray(surveyObj.sample_sls) && surveyObj.sample_sls.length > 0) {
      let count = 0;
      surveyObj.sample_sls.forEach(item => {
        const cleanId = String(item.id_sls || item).trim();
        const kId = item.kec_id ? String(item.kec_id) : (cleanId.length >= 7 ? cleanId.slice(0, 7) : '');
        if (availKecIds.has(kId)) {
          count++;
        }
      });
      return count;
    }
  }

  return availKec.reduce((sum, k) => sum + (k.total_sls || 0), 0);
}

function renderStats() {
  const user = state.currentUser;
  const isRestricted = (user && user.role !== 'admin' && user.role !== 'superadmin' && Array.isArray(user.assigned_kec) && user.assigned_kec.length > 0) || (state.activeSurveyId && state.activeSurveyId !== 'srv-sensus-14utp');
  
  let s = state.stats || {};
  if (isRestricted || (state.activeSurveyId && state.surveys && state.surveys.some(srv => srv.id === state.activeSurveyId && srv.jenis === 'survei'))) {
    const list = getFilteredReceivingsForUser();
    s = {
      total_peta: list.length,
      total_diterima: list.filter(r => r.status_diterima !== 'Belum Diterima').length,
      total_scanned: list.filter(r => (r.status_scan || 'Tidak') === 'Ya').length,
      total_unscanned: list.filter(r => (r.status_scan || 'Tidak') !== 'Ya').length,
      perubahan_sls: list.filter(r => r.perubahan_sls).length,
      perbaikan_batas: list.filter(r => r.perbaikan_batas).length,
      kondisi_rusak: list.filter(r => r.kondisi === 'Rusak').length,
      kondisi_hilang: list.filter(r => r.kondisi === 'Hilang').length
    };
  }

  const totalPetaKec = calculateTotalPetaKecamatan();

  if (elements.statPetaKecamatan) elements.statPetaKecamatan.textContent = totalPetaKec;
  if (elements.statPetaDiterima) elements.statPetaDiterima.textContent = s.total_diterima || 0;
  if (elements.statTotal) elements.statTotal.textContent = s.total_peta || 0;
  if (elements.statScanned) elements.statScanned.textContent = s.total_scanned || 0;
  if (elements.statUnscanned) elements.statUnscanned.textContent = s.total_unscanned || 0;
  if (elements.statPerubahanSls) elements.statPerubahanSls.textContent = s.perubahan_sls || 0;
  if (elements.statPerbaikanBatas) elements.statPerbaikanBatas.textContent = s.perbaikan_batas || 0;
  if (elements.statRusak) elements.statRusak.textContent = s.kondisi_rusak || 0;
  if (elements.statHilang) elements.statHilang.textContent = s.kondisi_hilang || 0;

  if (elements.badgeTotalPeta) elements.badgeTotalPeta.textContent = s.total_peta || 0;
  if (elements.badgePerubahanSls) elements.badgePerubahanSls.textContent = s.perubahan_sls || 0;
  if (elements.badgeScan) elements.badgeScan.textContent = s.total_scanned || 0;
  if (elements.countPerubahanSlsBig) elements.countPerubahanSlsBig.textContent = s.perubahan_sls || 0;

  renderDashboardUI();
}

function renderDashboardUI() {
  const list = getFilteredReceivingsForUser();
  const totalTargetSLS = calculateTotalPetaKecamatan();
  const totalDiinput = list.length;
  
  const recPct = totalTargetSLS > 0 ? ((totalDiinput / totalTargetSLS) * 100).toFixed(1) : 0;
  
  const totalDiterima = list.filter(r => r.status_diterima !== 'Belum Diterima').length;
  const ditPct = totalTargetSLS > 0 ? ((totalDiterima / totalTargetSLS) * 100).toFixed(1) : 0;

  const totalScanned = list.filter(r => (r.status_scan || 'Tidak') === 'Ya').length;
  const scanPct = totalDiinput > 0 ? ((totalScanned / totalDiinput) * 100).toFixed(1) : 0;

  const surveyObj = (state.surveys || []).find(s => s.id === state.activeSurveyId);
  const surveyName = surveyObj ? surveyObj.nama_kegiatan : 'Sensus Wilkerstat BPS Kabupaten Pandeglang';

  if (elements.dashSurveyTitle) elements.dashSurveyTitle.textContent = surveyName;
  if (elements.dashProgressPct) elements.dashProgressPct.textContent = `${recPct}%`;

  if (elements.dashDiterimaCount) elements.dashDiterimaCount.textContent = totalDiterima;
  if (elements.dashDiterimaPct) elements.dashDiterimaPct.textContent = `${ditPct}% Diterima`;
  if (elements.dashDiterimaBar) elements.dashDiterimaBar.style.width = `${Math.min(ditPct, 100)}%`;

  if (elements.dashRecCount) elements.dashRecCount.textContent = totalDiinput;
  if (elements.dashRecTotalTarget) elements.dashRecTotalTarget.textContent = `/ ${totalTargetSLS} Target SLS`;
  if (elements.dashRecBar) elements.dashRecBar.style.width = `${Math.min(recPct, 100)}%`;

  if (elements.dashScanCount) elements.dashScanCount.textContent = totalScanned;
  if (elements.dashScanPct) elements.dashScanPct.textContent = `${scanPct}% Scanned`;
  if (elements.dashScanBar) elements.dashScanBar.style.width = `${Math.min(scanPct, 100)}%`;

  const totalPerubahan = list.filter(r => r.perubahan_sls).length;
  const totalPerbaikan = list.filter(r => r.perbaikan_batas).length;
  const totalRusak = list.filter(r => r.kondisi === 'Rusak').length;
  const totalHilang = list.filter(r => r.kondisi === 'Hilang').length;
  const totalBaik = list.filter(r => (r.kondisi || 'Baik') === 'Baik').length;

  if (elements.dashPerubahanSlsCount) elements.dashPerubahanSlsCount.textContent = totalPerubahan;
  if (elements.dashPerbaikanBatasCount) elements.dashPerbaikanBatasCount.textContent = totalPerbaikan;
  if (elements.dashRusakCount) elements.dashRusakCount.textContent = totalRusak;
  if (elements.dashHilangCount) elements.dashHilangCount.textContent = totalHilang;

  // Breakdown Kondisi Fisik Peta
  if (elements.dashKondisiSummaryText) elements.dashKondisiSummaryText.textContent = `${totalDiinput} Peta Diterima`;
  const baikPct = totalDiinput > 0 ? (totalBaik / totalDiinput * 100).toFixed(1) : 0;
  const rusakPct = totalDiinput > 0 ? (totalRusak / totalDiinput * 100).toFixed(1) : 0;
  const hilangPct = totalDiinput > 0 ? (totalHilang / totalDiinput * 100).toFixed(1) : 0;

  if (elements.barKondisiBaik) elements.barKondisiBaik.style.width = `${baikPct}%`;
  if (elements.barKondisiRusak) elements.barKondisiRusak.style.width = `${rusakPct}%`;
  if (elements.barKondisiHilang) elements.barKondisiHilang.style.width = `${hilangPct}%`;

  if (elements.valKondisiBaik) elements.valKondisiBaik.textContent = `${totalBaik} (${baikPct}%)`;
  if (elements.valKondisiRusak) elements.valKondisiRusak.textContent = `${totalRusak} (${rusakPct}%)`;
  if (elements.valKondisiHilang) elements.valKondisiHilang.textContent = `${totalHilang} (${hilangPct}%)`;

  // Breakdown Sinyal/Jaringan Internet
  const totalKuat = list.filter(r => (r.kualitas_jaringan || 'Kuat') === 'Kuat').length;
  const totalSedang = list.filter(r => r.kualitas_jaringan === 'Sedang').length;
  const totalLemah = list.filter(r => r.kualitas_jaringan === 'Lemah').length;

  const kuatPct = totalDiinput > 0 ? (totalKuat / totalDiinput * 100).toFixed(1) : 0;
  const sedangPct = totalDiinput > 0 ? (totalSedang / totalDiinput * 100).toFixed(1) : 0;
  const lemahPct = totalDiinput > 0 ? (totalLemah / totalDiinput * 100).toFixed(1) : 0;

  if (elements.barJaringanKuat) elements.barJaringanKuat.style.width = `${kuatPct}%`;
  if (elements.barJaringanSedang) elements.barJaringanSedang.style.width = `${sedangPct}%`;
  if (elements.barJaringanLemah) elements.barJaringanLemah.style.width = `${lemahPct}%`;

  if (elements.valJaringanKuat) elements.valJaringanKuat.textContent = `${totalKuat} (${kuatPct}%)`;
  if (elements.valJaringanSedang) elements.valJaringanSedang.textContent = `${totalSedang} (${sedangPct}%)`;
  if (elements.valJaringanLemah) elements.valJaringanLemah.textContent = `${totalLemah} (${lemahPct}%)`;

  // 5 Terbaru Receiving Entries
  if (elements.dashLatestReceivingsList) {
    const latest5 = [...list].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 5);
    if (latest5.length === 0) {
      elements.dashLatestReceivingsList.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">Belum ada data receiving diinput.</p>`;
    } else {
      elements.dashLatestReceivingsList.innerHTML = latest5.map(item => {
        const kecObj = (state.master.kecamatan || []).find(k => String(k.id) === String(item.id_kecamatan));
        const desaObj = (state.master.desa || []).find(d => String(d.id) === String(item.id_desa));
        const kecName = kecObj ? kecObj.nama : item.id_kecamatan;
        const desaName = desaObj ? desaObj.nama : item.id_desa;

        return `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <div class="font-bold text-bps-navy font-mono">${item.id_sls} <span class="text-slate-700 font-semibold font-sans ml-1">${item.nama_sls || ''}</span></div>
              <div class="text-[10px] text-slate-400">${desaName} (${kecName}) • PPL: ${item.ppl || '-'}</div>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-slate-500 block">${item.tgl_penerimaan || ''}</span>
              <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">${item.kondisi || 'Baik'}</span>
            </div>
          </div>`;
      }).join('');
    }
  }

  // Table Progress per Kecamatan (Paged)
  if (elements.tbodyDashKecamatanProgress) {
    const availKec = getAvailableKecamatanList();
    const totalKec = availKec.length;
    const page = state.pagination.dashboardKec.page;
    const limit = state.pagination.dashboardKec.limit;

    const totalPages = Math.ceil(totalKec / limit) || 1;
    if (state.pagination.dashboardKec.page > totalPages) state.pagination.dashboardKec.page = totalPages;

    const startIdx = (state.pagination.dashboardKec.page - 1) * limit;
    const endIdx = Math.min(startIdx + limit, totalKec);
    const pagedKec = availKec.slice(startIdx, endIdx);

    if (totalKec === 0) {
      elements.tbodyDashKecamatanProgress.innerHTML = `
        <tr>
          <td colspan="9" class="p-6 text-center text-slate-400 font-medium">Tidak ada kecamatan tersedia.</td>
        </tr>`;
    } else {
      const kecRows = pagedKec.map((k, idx) => {
        const globalIdx = startIdx + idx + 1;
        const kecIdStr = String(k.id);
        const kecReceivings = list.filter(r => String(r.id_kecamatan) === kecIdStr);
        
        let targetSLS = k.total_sls || 0;
        if (surveyObj && surveyObj.jenis === 'survei' && Array.isArray(surveyObj.sample_sls)) {
          targetSLS = surveyObj.sample_sls.filter(s => {
            const id = String(s.id_sls || s).trim();
            const kecId = s.kec_id ? String(s.kec_id) : (id.length >= 7 ? id.slice(0, 7) : '');
            return kecId === kecIdStr;
          }).length;
        }

        const kecDiterima = kecReceivings.filter(r => r.status_diterima !== 'Belum Diterima').length;
        const diinput = kecReceivings.length;
        const kPct = targetSLS > 0 ? Math.min(((diinput / targetSLS) * 100), 100).toFixed(1) : 0;
        const kecPerubahan = kecReceivings.filter(r => r.perubahan_sls).length;
        const kecPerbaikan = kecReceivings.filter(r => r.perbaikan_batas).length;
        const kecBermasalah = kecReceivings.filter(r => r.kondisi === 'Rusak' || r.kondisi === 'Hilang').length;

        return `
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 text-center font-mono text-slate-400 font-semibold">${globalIdx}</td>
            <td class="p-3">
              <div class="font-bold text-bps-navy text-xs">${k.nama}</div>
              <div class="font-mono text-[10px] text-slate-400">Kode: ${k.id}</div>
            </td>
            <td class="p-3 text-center font-bold text-slate-700">${targetSLS}</td>
            <td class="p-3 text-center font-bold text-teal-700">${kecDiterima}</td>
            <td class="p-3 text-center font-bold text-blue-700">${diinput}</td>
            <td class="p-3">
              <div class="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>${kPct}%</span>
                <span class="text-[10px] text-slate-400 font-normal">${diinput}/${targetSLS} SLS</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${kPct}%"></div>
              </div>
            </td>
            <td class="p-3 text-center">
              ${kecPerubahan > 0 ? `<span class="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full text-[10px]">${kecPerubahan}</span>` : '<span class="text-slate-300">0</span>'}
            </td>
            <td class="p-3 text-center">
              ${kecPerbaikan > 0 ? `<span class="bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded-full text-[10px]">${kecPerbaikan}</span>` : '<span class="text-slate-300">0</span>'}
            </td>
            <td class="p-3 text-center">
              ${kecBermasalah > 0 ? `<span class="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[10px]">${kecBermasalah}</span>` : '<span class="text-emerald-600 font-semibold">Clean</span>'}
            </td>
          </tr>`;
      }).join('');

      elements.tbodyDashKecamatanProgress.innerHTML = kecRows;
    }

    // Update Pagination Bar UI
    if (elements.infoDashKecPage) {
      elements.infoDashKecPage.textContent = totalKec === 0 
        ? 'Menampilkan 0 kecamatan' 
        : `Menampilkan ${startIdx + 1} - ${endIdx} dari ${totalKec} kecamatan`;
    }
    if (elements.txtPageDashKec) {
      elements.txtPageDashKec.textContent = `Hal ${state.pagination.dashboardKec.page} / ${totalPages}`;
    }
    if (elements.btnPrevDashKec) elements.btnPrevDashKec.disabled = (state.pagination.dashboardKec.page <= 1);
    if (elements.btnNextDashKec) elements.btnNextDashKec.disabled = (state.pagination.dashboardKec.page >= totalPages);
  }
}

// -------------------------------------------------------------
// BULK SLS ENTRY MATRIX RENDERER
// -------------------------------------------------------------

function renderBulkSlsTable() {
  if (!elements.bulkEmptyState || !elements.bulkTableContainer) return;

  const slsList = state.currentSlsList;
  if (!slsList || slsList.length === 0) {
    elements.bulkEmptyState.classList.remove('hidden');
    elements.bulkTableContainer.classList.add('hidden');
    return;
  }

  elements.bulkEmptyState.classList.add('hidden');
  elements.bulkTableContainer.classList.remove('hidden');

  const desaObj = state.master.desa.find(d => String(d.id) === String(elements.inputDesa.value));
  const kecObj = state.master.kecamatan.find(k => String(k.id) === String(elements.inputKecamatan.value));
  const desaName = desaObj ? desaObj.nama : elements.inputDesa.value;
  const kecName = kecObj ? kecObj.nama : elements.inputKecamatan.value;

  elements.bulkDesaInfo.innerHTML = `Desa <strong>${desaName}</strong> (${kecName}): <strong>${slsList.length} SLS</strong> terdaftar di BPS Kabupaten Pandeglang`;

  elements.tbodyBulkSls.innerHTML = slsList.map((item, idx) => {
    // Check if this SLS already has a saved receiving record in DB
    const existingRec = state.receivings.find(r => String(r.id_sls) === String(item.id_sls));
    
    const defaultKondisi = existingRec ? existingRec.kondisi : 'Baik';
    const defaultBangunan = existingRec ? existingRec.no_bangunan_terbesar : 0;
    const defaultPerbaikan = existingRec ? (existingRec.perbaikan_batas ? 'ya' : 'tidak') : 'tidak';
    const defaultPerubahan = existingRec ? (existingRec.kode_jenis_perubahan_sls || (existingRec.perubahan_sls ? '1' : '')) : '';
    const defaultJaringan = existingRec ? (existingRec.kualitas_jaringan || 'Kuat') : 'Kuat';
    const defaultCatatan = existingRec ? (existingRec.catatan || '') : '';

    return `
      <tr class="hover:bg-amber-50/40 transition border-b border-slate-100 ${existingRec ? 'bg-emerald-50/30' : ''}">
        <td class="p-3 text-center">
          <input type="checkbox" class="chk-bulk-row w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" data-id-sls="${item.id_sls}" checked>
        </td>
        <td class="p-3 text-center font-mono text-slate-400 text-xs">${idx + 1}</td>
        <td class="p-3">
          <div class="font-mono font-bold text-bps-navy text-xs">${item.id_sls}</div>
          <div class="font-semibold text-slate-800 text-xs">${item.nama_sls}</div>
          <div class="text-[11px] text-slate-500"><i class="fa-solid fa-user-tie mr-1 text-slate-400"></i>PPL: ${item.ppl || '-'}</div>
        </td>
        <td class="p-3">
          <select id="bulkKondisi_${item.id_sls}" class="w-full text-xs border border-slate-300 rounded-lg p-2 font-bold bg-white focus:ring-2 focus:ring-bps-blue">
            <option value="Baik" ${defaultKondisi === 'Baik' ? 'selected' : ''}>Baik</option>
            <option value="Rusak" ${defaultKondisi === 'Rusak' ? 'selected' : ''}>Rusak</option>
            <option value="Hilang" ${defaultKondisi === 'Hilang' ? 'selected' : ''}>Hilang</option>
          </select>
        </td>
        <td class="p-3 text-center">
          <input type="number" id="bulkNoBangunan_${item.id_sls}" value="${defaultBangunan}" min="0" class="w-full text-xs border border-slate-300 rounded-lg p-2 text-center font-semibold font-mono focus:ring-2 focus:ring-bps-blue">
        </td>
        <td class="p-3 text-center">
          <select id="bulkPerbaikanBatas_${item.id_sls}" class="w-full text-xs border border-slate-300 rounded-lg p-2 font-semibold bg-white focus:ring-2 focus:ring-bps-blue">
            <option value="tidak" ${defaultPerbaikan === 'tidak' ? 'selected' : ''}>Tidak Ada</option>
            <option value="ya" ${defaultPerbaikan === 'ya' ? 'selected' : ''}>Ada</option>
          </select>
        </td>
        <td class="p-3">
          <select id="bulkPerubahanSls_${item.id_sls}" class="w-full text-xs border border-slate-300 rounded-lg p-2 font-bold text-purple-900 bg-purple-50 border-purple-200 focus:ring-2 focus:ring-purple-500">
            <option value="">Tidak Ada</option>
            <option value="1" ${String(defaultPerubahan) === '1' ? 'selected' : ''}>1 - Pemekaran SLS</option>
            <option value="2" ${String(defaultPerubahan) === '2' ? 'selected' : ''}>2 - Penggabungan SLS</option>
            <option value="3" ${String(defaultPerubahan) === '3' ? 'selected' : ''}>3 - Perubahan Jenis SLS</option>
            <option value="4" ${String(defaultPerubahan) === '4' ? 'selected' : ''}>4 - Perubahan Nama SLS</option>
            <option value="5" ${String(defaultPerubahan) === '5' ? 'selected' : ''}>5 - Perubahan Kode SLS</option>
            <option value="6" ${String(defaultPerubahan) === '6' ? 'selected' : ''}>6 - Pemekaran Sub SLS</option>
            <option value="7" ${String(defaultPerubahan) === '7' ? 'selected' : ''}>7 - Penggabungan Sub SLS</option>
            <option value="8" ${String(defaultPerubahan) === '8' ? 'selected' : ''}>8 - Perubahan Kode Sub SLS</option>
            <option value="9" ${String(defaultPerubahan) === '9' ? 'selected' : ''}>9 - Perubahan Muatan Sub SLS</option>
          </select>
        </td>
        <td class="p-3">
          <select id="bulkKualitasJaringan_${item.id_sls}" class="w-full text-xs border border-slate-300 rounded-lg p-2 font-semibold bg-white focus:ring-2 focus:ring-bps-blue">
            <option value="Kuat" ${defaultJaringan === 'Kuat' ? 'selected' : ''}>Kuat</option>
            <option value="Sedang" ${defaultJaringan === 'Sedang' ? 'selected' : ''}>Sedang</option>
            <option value="Lemah" ${defaultJaringan === 'Lemah' ? 'selected' : ''}>Lemah</option>
          </select>
        </td>
        <td class="p-3">
          <input type="text" id="bulkCatatan_${item.id_sls}" value="${defaultCatatan}" placeholder="Catatan fisik..." class="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-bps-blue">
        </td>
      </tr>`;
  }).join('');

  // Attach change listeners to checkboxes
  document.querySelectorAll('.chk-bulk-row').forEach(chk => {
    chk.addEventListener('change', updateSelectedBulkCount);
  });

  updateSelectedBulkCount();
}

function updateSelectedBulkCount() {
  const checkboxes = document.querySelectorAll('.chk-bulk-row');
  const checked = document.querySelectorAll('.chk-bulk-row:checked');
  if (elements.txtSelectedCount) elements.txtSelectedCount.textContent = checked.length;
  if (elements.chkSelectAllRows) elements.chkSelectAllRows.checked = (checkboxes.length > 0 && checked.length === checkboxes.length);
}

// -------------------------------------------------------------
// PENERIMAAN DOKUMEN (STAGE 1 FAST CHECKLIST)
// -------------------------------------------------------------

async function fetchPenerimaSlsList(desaId = '', kecId = '') {
  const targetDesaId = desaId || (elements.inputPenerimaDesa ? elements.inputPenerimaDesa.value : '');
  const targetKecId = kecId || (elements.inputPenerimaKecamatan ? elements.inputPenerimaKecamatan.value : '');

  if (elements.penerimaEmptyState) elements.penerimaEmptyState.classList.add('hidden');
  if (elements.penerimaTableContainer) elements.penerimaTableContainer.classList.remove('hidden');

  const params = new URLSearchParams();
  if (state.activeSurveyId) params.append('survey_id', state.activeSurveyId);
  if (targetDesaId) params.append('desa_id', targetDesaId);
  else if (targetKecId) params.append('kec_id', targetKecId);

  try {
    const res = await fetch(`/api/master/sls?${params.toString()}`);
    const json = await res.json();
    if (json.success) {
      state.currentSlsList = json.data || [];
      renderPenerimaMatrix(json.data || []);
    }
  } catch (err) {
    showToast('Gagal memuat SLS penerima', 'error');
  }
}

function getCurrentFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  const tStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return `${dStr} ${tStr}`;
}

function renderPenerimaMatrix(slsList) {
  if (!elements.tbodyPenerima) return;
  const selectedDesaId = elements.inputPenerimaDesa ? elements.inputPenerimaDesa.value : '';
  const selectedKecId = elements.inputPenerimaKecamatan ? elements.inputPenerimaKecamatan.value : '';
  const desaObj = (state.master.desa || []).find(d => String(d.id) === String(selectedDesaId));
  const kecObj = (state.master.kecamatan || []).find(k => String(k.id) === String(selectedKecId));
  const desaName = desaObj ? desaObj.nama : '';
  const kecName = kecObj ? kecObj.nama : '';

  const maxRender = 100;
  const displayList = slsList.slice(0, maxRender);
  const isTruncated = slsList.length > maxRender;

  if (elements.penerimaDesaInfo) {
    const suffix = isTruncated ? ` <span class="text-amber-700 font-normal">(Menampilkan 100 dari ${slsList.length} SLS - silakan pilih desa spesifik untuk rincian)</span>` : '';
    if (desaName) {
      elements.penerimaDesaInfo.innerHTML = `Desa <strong>${desaName}</strong> (${kecName}): <strong>${slsList.length} SLS</strong> terdaftar di BPS Kabupaten Pandeglang${suffix}`;
    } else if (kecName) {
      elements.penerimaDesaInfo.innerHTML = `Kecamatan <strong>${kecName}</strong>: <strong>${slsList.length} SLS</strong> terdaftar di BPS Kabupaten Pandeglang${suffix}`;
    } else {
      elements.penerimaDesaInfo.innerHTML = `Semua SLS: <strong>${slsList.length} SLS</strong> terdaftar di BPS Kabupaten Pandeglang${suffix}`;
    }
  }

  const defaultPetugas = state.currentUser ? (state.currentUser.nama || state.currentUser.username) : 'Nana Sumarna';
  const defaultStamp = getCurrentFormattedTimestamp();

  elements.tbodyPenerima.innerHTML = displayList.map((item, idx) => {
    const existingRec = (state.receivings || []).find(r => String(r.id_sls) === String(item.id_sls));
    const isDiterima = existingRec ? (existingRec.status_diterima === 'Sudah Diterima') : false;
    const kondisi = existingRec ? (existingRec.kondisi || 'Baik') : 'Baik';
    const noBangunan = existingRec ? (existingRec.no_bangunan_terbesar || 0) : 0;
    const ketStamp = (existingRec && isDiterima && existingRec.tgl_diterima) ? existingRec.tgl_diterima : '';

    return `
      <tr class="hover:bg-teal-50/50 transition border-b border-slate-100 ${isDiterima ? 'bg-teal-50/20' : ''}">
        <td class="p-3 text-center font-mono text-slate-400 text-xs">${idx + 1}</td>
        <td class="p-3">
          <div class="font-mono font-bold text-teal-950 text-xs">${item.id_sls}</div>
          <div class="font-semibold text-slate-800 text-xs">${item.nama_sls}</div>
          <div class="text-[11px] text-slate-500"><i class="fa-solid fa-user-tie mr-1 text-slate-400"></i>PPL: ${item.ppl || '-'}</div>
        </td>
        <td class="p-3 text-center">
          <select id="penerimaKondisi_${item.id_sls}" class="w-full text-xs font-bold border rounded-lg p-2 bg-white text-slate-800 border-slate-300 focus:ring-2 focus:ring-teal-500">
            <option value="Baik" ${kondisi === 'Baik' ? 'selected' : ''}>Baik</option>
            <option value="Rusak" ${kondisi === 'Rusak' ? 'selected' : ''}>Rusak</option>
            <option value="Hilang" ${kondisi === 'Hilang' ? 'selected' : ''}>Hilang</option>
          </select>
        </td>
        <td class="p-3 text-center">
          <input type="number" id="penerimaNoBangunan_${item.id_sls}" value="${noBangunan}" min="0" placeholder="0" class="w-full text-xs border border-slate-300 rounded-lg p-2 text-center font-semibold font-mono bg-white focus:ring-2 focus:ring-teal-500">
        </td>
        <td class="p-3 text-center">
          <select id="penerimaStatus_${item.id_sls}" data-id-sls="${item.id_sls}" class="chk-penerima-status w-full text-xs font-bold border rounded-lg p-2 ${isDiterima ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-600 border-slate-300'}">
            <option value="Belum Diterima" ${!isDiterima ? 'selected' : ''}>Belum Diterima</option>
            <option value="Sudah Diterima" ${isDiterima ? 'selected' : ''}>Sudah Diterima</option>
          </select>
        </td>
        <td class="p-3 text-center">
          <input type="text" id="penerimaKet_${item.id_sls}" value="${ketStamp}" placeholder="Waktu & tanggal diterima..." class="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono font-semibold bg-white focus:ring-2 focus:ring-teal-500">
        </td>
      </tr>`;
  }).join('');

  updatePenerimaCount();

  document.querySelectorAll('.chk-penerima-status').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const slsId = e.target.dataset.idSls;
      const inpKet = document.getElementById(`penerimaKet_${slsId}`);

      if (e.target.value === 'Sudah Diterima') {
        e.target.className = 'chk-penerima-status w-full text-xs font-bold border rounded-lg p-2 bg-emerald-50 text-emerald-800 border-emerald-300';
        if (inpKet && (!inpKet.value || inpKet.value.trim() === '')) {
          inpKet.value = getCurrentFormattedTimestamp();
        }
      } else {
        e.target.className = 'chk-penerima-status w-full text-xs font-bold border rounded-lg p-2 bg-slate-50 text-slate-600 border-slate-300';
        if (inpKet) inpKet.value = '';
      }
      updatePenerimaCount();
    });
  });
}

function updatePenerimaCount() {
  const statuses = document.querySelectorAll('.chk-penerima-status');
  let count = 0;
  statuses.forEach(s => {
    if (s.value === 'Sudah Diterima') count++;
  });
  if (elements.txtPenerimaCount) elements.txtPenerimaCount.textContent = count;
}

// -------------------------------------------------------------
// TABLE RENDERERS WITH PAGINATION
// -------------------------------------------------------------

function renderReceivingsTable() {
  const list = getFilteredReceivingsForUser();
  const total = list.length;
  const page = state.pagination.receivings.page;
  const limit = state.pagination.receivings.limit;

  const totalPages = Math.ceil(total / limit) || 1;
  if (state.pagination.receivings.page > totalPages) state.pagination.receivings.page = totalPages;

  const startIdx = (state.pagination.receivings.page - 1) * limit;
  const endIdx = Math.min(startIdx + limit, total);
  const pagedList = list.slice(startIdx, endIdx);

  if (total === 0) {
    elements.tbodyReceivings.innerHTML = `
      <tr>
        <td colspan="13" class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-folder-open text-3xl mb-2"></i>
          <p>Belum ada data penerimaan peta sesuai filter.</p>
        </td>
      </tr>`;
  } else {
    elements.tbodyReceivings.innerHTML = pagedList.map((item, idx) => {
      const globalIdx = startIdx + idx + 1;
      const kecObj = state.master.kecamatan.find(k => String(k.id) === String(item.id_kecamatan));
      const kecName = kecObj ? kecObj.nama : item.id_kecamatan;

      const desaObj = state.master.desa.find(d => String(d.id) === String(item.id_desa));
      const desaName = desaObj ? desaObj.nama : item.id_desa;

      const kondisiBadge = item.kondisi === 'Baik' 
        ? '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-circle-check mr-1"></i>Baik</span>'
        : item.kondisi === 'Hilang'
        ? '<span class="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-circle-xmark mr-1"></i>Hilang</span>'
        : '<span class="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Rusak</span>';

      const perbaikanBadge = item.perbaikan_batas
        ? '<span class="bg-teal-100 text-teal-900 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-draw-polygon mr-1"></i>Ada</span>'
        : '<span class="text-slate-400 font-medium">Tidak Ada</span>';

      const kodeObj = state.master.kode_perubahan_sls.find(k => String(k.kode) === String(item.kode_jenis_perubahan_sls));
      const kodeLabel = kodeObj ? kodeObj.label : (item.kode_jenis_perubahan_sls || 'Ya');

      const perubahanBadge = item.perubahan_sls
        ? `<span class="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-full" title="${kodeLabel}"><i class="fa-solid fa-code-fork mr-1"></i>${kodeLabel}</span>`
        : '<span class="text-slate-400 font-medium">Tidak Ada</span>';

      const jaringanBadge = (item.kualitas_jaringan === 'Lemah')
        ? '<span class="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-wifi mr-1"></i>Lemah</span>'
        : (item.kualitas_jaringan === 'Sedang')
        ? '<span class="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-wifi mr-1"></i>Sedang</span>'
        : '<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-wifi mr-1"></i>Kuat</span>';

      const isScanYa = (item.status_scan || 'Tidak') === 'Ya';
      const scanBadge = isScanYa
        ? `<div class="flex flex-col items-center gap-0.5"><span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fa-solid fa-check mr-1"></i>Ya</span>${item.petugas_scan ? `<span class="text-[10px] font-semibold text-slate-700">${item.petugas_scan}</span>` : ''}${item.tgl_scan ? `<span class="text-[9px] font-mono text-slate-400">${item.tgl_scan}</span>` : ''}</div>`
        : '<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Tidak</span>';

      const isDiterima = (item.status_diterima || 'Belum Diterima') !== 'Belum Diterima';
      const statusDiterimaBadge = isDiterima
        ? '<span class="bg-teal-100 text-teal-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-300"><i class="fa-solid fa-circle-check mr-1"></i>Sudah Diterima</span>'
        : '<span class="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Belum Diterima</span>';

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="p-3 text-center font-mono text-slate-400 text-xs">${globalIdx}</td>
          <td class="p-3 font-mono font-bold text-bps-navy text-xs">
            ${item.id_sls}
          </td>
          <td class="p-3 font-semibold text-slate-800 text-xs">
            ${item.nama_sls || '-'}
          </td>
          <td class="p-3 text-slate-700">
            <div class="font-semibold text-xs">${desaName}</div>
            <div class="text-[10px] text-slate-400">${kecName}</div>
          </td>
          <td class="p-3 text-center">
            ${statusDiterimaBadge}
          </td>
          <td class="p-3 text-slate-700 font-semibold text-xs">
            ${item.petugas_penerima || item.petugas_receiving || '-'}
          </td>
          <td class="p-3 text-slate-700 font-medium text-xs">
            ${item.ppl || '-'}
          </td>
          <td class="p-3 text-center font-mono font-bold text-slate-800">
            ${item.no_bangunan_terbesar || 0}
          </td>
          <td class="p-3 text-center">
            ${kondisiBadge}
          </td>
          <td class="p-3 text-center">
            ${perbaikanBadge}
          </td>
          <td class="p-3 text-center">
            ${perubahanBadge}
          </td>
          <td class="p-3 text-center">
            ${jaringanBadge}
          </td>
          <td class="p-3 text-center">
            ${scanBadge}
          </td>
          <td class="p-3 text-center space-x-1">
            <button onclick="openEditReceivingModal('${item.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2 py-1 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm" title="Edit Data Receiving">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button onclick="deleteReceiving('${item.id}')" class="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-2 py-1 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm" title="Hapus Data">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>`;
    }).join('');
  }

  // Update Pagination Controls
  if (elements.infoReceivingsPage) {
    elements.infoReceivingsPage.textContent = total === 0 
      ? 'Menampilkan 0 data' 
      : `Menampilkan ${startIdx + 1} - ${endIdx} dari ${total} data`;
  }
  if (elements.txtPageReceivings) elements.txtPageReceivings.textContent = `Hal ${state.pagination.receivings.page} / ${totalPages}`;
  if (elements.btnPrevReceivings) elements.btnPrevReceivings.disabled = (state.pagination.receivings.page <= 1);
  if (elements.btnNextReceivings) elements.btnNextReceivings.disabled = (state.pagination.receivings.page >= totalPages);
}

function renderPerubahanSlsTable() {
  let list = getFilteredReceivingsForUser().filter(r => r.perubahan_sls);

  if (state.filters.kode_perubahan) {
    list = list.filter(r => String(r.kode_jenis_perubahan_sls) === String(state.filters.kode_perubahan));
  }

  if (state.filters.search_perubahan) {
    const query = state.filters.search_perubahan.toLowerCase();
    list = list.filter(r => 
      (r.id_sls && r.id_sls.toLowerCase().includes(query)) ||
      (r.nama_sls && r.nama_sls.toLowerCase().includes(query)) ||
      (r.ppl && r.ppl.toLowerCase().includes(query)) ||
      (r.catatan && r.catatan.toLowerCase().includes(query))
    );
  }

  const total = list.length;
  const page = state.pagination.perubahan.page;
  const limit = state.pagination.perubahan.limit;

  const totalPages = Math.ceil(total / limit) || 1;
  if (state.pagination.perubahan.page > totalPages) state.pagination.perubahan.page = totalPages;

  const startIdx = (state.pagination.perubahan.page - 1) * limit;
  const endIdx = Math.min(startIdx + limit, total);
  const pagedList = list.slice(startIdx, endIdx);

  if (total === 0) {
    elements.tbodyPerubahanSls.innerHTML = `
      <tr>
        <td colspan="5" class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-code-fork text-3xl mb-2 text-purple-300"></i>
          <p>Belum ada data penerimaan peta dengan Perubahan SLS.</p>
        </td>
      </tr>`;
  } else {
    elements.tbodyPerubahanSls.innerHTML = pagedList.map((item, idx) => {
      const globalIdx = startIdx + idx + 1;
      const kodeObj = state.master.kode_perubahan_sls.find(k => String(k.kode) === String(item.kode_jenis_perubahan_sls));
      const kodeLabel = kodeObj ? kodeObj.label : (item.kode_jenis_perubahan_sls || '-');

      return `
        <tr class="hover:bg-purple-50/50 transition border-b border-purple-100">
          <td class="p-3 text-center font-mono text-slate-400 text-xs">${globalIdx}</td>
          <td class="p-3 font-mono font-bold text-purple-900">${item.id_sls}</td>
          <td class="p-3 font-semibold text-slate-800 text-xs">${item.nama_sls || '-'}</td>
          <td class="p-3 font-bold text-purple-900 bg-purple-50 rounded">${kodeLabel}</td>
          <td class="p-3 text-slate-700 text-xs">${item.ppl || '-'}</td>
          <td class="p-3 text-slate-600 italic text-xs">${item.catatan || '-'}</td>
        </tr>`;
    }).join('');
  }

  // Update Pagination Controls
  if (elements.infoPerubahanPage) {
    elements.infoPerubahanPage.textContent = total === 0 
      ? 'Menampilkan 0 data' 
      : `Menampilkan ${startIdx + 1} - ${endIdx} dari ${total} data`;
  }
  if (elements.txtPagePerubahan) elements.txtPagePerubahan.textContent = `Hal ${state.pagination.perubahan.page} / ${totalPages}`;
  if (elements.btnPrevPerubahan) elements.btnPrevPerubahan.disabled = (state.pagination.perubahan.page <= 1);
  if (elements.btnNextPerubahan) elements.btnNextPerubahan.disabled = (state.pagination.perubahan.page >= totalPages);
}

// -------------------------------------------------------------
// CORE SCANNING TABLE RENDER WITH PAGINATION
// -------------------------------------------------------------

function renderScanningTable() {
  let list = getFilteredReceivingsForUser();

  if (state.filters.search_scanning) {
    const query = state.filters.search_scanning.toLowerCase();
    list = list.filter(r => 
      (r.id_sls && r.id_sls.toLowerCase().includes(query)) ||
      (r.nama_sls && r.nama_sls.toLowerCase().includes(query)) ||
      (r.ppl && r.ppl.toLowerCase().includes(query)) ||
      (r.petugas_scan && r.petugas_scan.toLowerCase().includes(query))
    );
  }

  const total = list.length;
  const page = state.pagination.scanning.page;
  const limit = state.pagination.scanning.limit;

  const totalPages = Math.ceil(total / limit) || 1;
  if (state.pagination.scanning.page > totalPages) state.pagination.scanning.page = totalPages;

  const startIdx = (state.pagination.scanning.page - 1) * limit;
  const endIdx = Math.min(startIdx + limit, total);
  const pagedList = list.slice(startIdx, endIdx);

  if (total === 0) {
    elements.tbodyScanning.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-barcode text-3xl mb-2 text-blue-300"></i>
          <p>Belum ada data peta untuk modul scanning.</p>
        </td>
      </tr>`;
  } else {
    elements.tbodyScanning.innerHTML = pagedList.map((item, idx) => {
      const globalIdx = startIdx + idx + 1;
      const isScanYa = (item.status_scan || 'Tidak') === 'Ya';

      const kecObj = state.master.kecamatan.find(k => String(k.id) === String(item.id_kecamatan));
      const kecName = kecObj ? kecObj.nama : item.id_kecamatan;

      const desaObj = state.master.desa.find(d => String(d.id) === String(item.id_desa));
      const desaName = desaObj ? desaObj.nama : item.id_desa;

      return `
        <tr class="hover:bg-blue-50/40 transition border-b border-slate-100 ${isScanYa ? 'bg-emerald-50/40' : ''}">
          <td class="p-3 text-center font-mono text-slate-400 text-xs">${globalIdx}</td>
          <td class="p-3">
            <div class="font-mono font-bold text-slate-800">${item.id_sls}</div>
            <div class="text-[11px] text-slate-600 font-medium">${item.nama_sls || '-'}</div>
          </td>
          <td class="p-3 text-slate-700">
            <div class="font-semibold text-xs">${desaName}</div>
            <div class="text-[10px] text-slate-400">${kecName}</div>
          </td>
          <td class="p-3 text-center">
            <select onchange="updateScanStatus('${item.id}', this.value)" class="text-xs border ${isScanYa ? 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold' : 'border-slate-300 bg-white text-slate-700'} rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="Tidak" ${!isScanYa ? 'selected' : ''}>Tidak</option>
              <option value="Ya" ${isScanYa ? 'selected' : ''}>Ya (Sudah Scan)</option>
            </select>
          </td>
          <td class="p-3">
            <div class="flex items-center space-x-1">
              <input type="text" id="inputPetugasScan_${item.id}" value="${item.petugas_scan || ''}" placeholder="Nama Petugas Scan" class="w-full text-xs border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500 font-medium">
              <button onclick="savePetugasScan('${item.id}')" class="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg text-xs transition" title="Simpan Petugas Scan">
                <i class="fa-solid fa-floppy-disk"></i>
              </button>
            </div>
          </td>
          <td class="p-3 text-center text-slate-600 font-mono text-[11px] font-semibold">
            ${item.tgl_scan || '-'}
          </td>
          <td class="p-3 text-center space-x-1">
            <button onclick="quickToggleScan('${item.id}', '${isScanYa ? 'Tidak' : 'Ya'}')" class="text-xs px-2.5 py-1 rounded-lg font-bold transition ${isScanYa ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}">
              ${isScanYa ? 'Batal Scan' : '<i class="fa-solid fa-barcode mr-1"></i>Scan'}
            </button>
          </td>
        </tr>`;
    }).join('');
  }

  // Update Pagination Controls
  if (elements.infoScanningPage) {
    elements.infoScanningPage.textContent = total === 0 
      ? 'Menampilkan 0 data' 
      : `Menampilkan ${startIdx + 1} - ${endIdx} dari ${total} data`;
  }
  if (elements.txtPageScanning) elements.txtPageScanning.textContent = `Hal ${state.pagination.scanning.page} / ${totalPages}`;
  if (elements.btnPrevScanning) elements.btnPrevScanning.disabled = (state.pagination.scanning.page <= 1);
  if (elements.btnNextScanning) elements.btnNextScanning.disabled = (state.pagination.scanning.page >= totalPages);
}

// -------------------------------------------------------------
// EVENT LISTENERS & HANDLERS
// -------------------------------------------------------------

function setupEventListeners() {
  // Navigation Tabs
  elements.mainTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tabName = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    elements.tabContents.forEach(c => c.classList.add('hidden'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    state.activeTab = tabName;
  });

  // Receiving Form Mode Switcher (Bulk vs Single)
  if (elements.btnModeBulk && elements.btnModeSingle) {
    elements.btnModeBulk.addEventListener('click', () => {
      state.receivingMode = 'bulk';
      elements.btnModeBulk.className = 'px-3 py-1.5 text-xs font-bold rounded-lg transition bg-amber-500 text-bps-navy shadow';
      elements.btnModeSingle.className = 'px-3 py-1.5 text-xs font-bold rounded-lg transition text-slate-200 hover:bg-white/10';
      elements.viewBulkEntry.classList.remove('hidden');
      elements.viewSingleEntry.classList.add('hidden');
    });

    elements.btnModeSingle.addEventListener('click', () => {
      state.receivingMode = 'single';
      elements.btnModeSingle.className = 'px-3 py-1.5 text-xs font-bold rounded-lg transition bg-amber-500 text-bps-navy shadow';
      elements.btnModeBulk.className = 'px-3 py-1.5 text-xs font-bold rounded-lg transition text-slate-200 hover:bg-white/10';
      elements.viewSingleEntry.classList.remove('hidden');
      elements.viewBulkEntry.classList.add('hidden');
    });
  }

  // Dynamic Kecamatan -> Desa dropdown change
  elements.inputKecamatan.addEventListener('change', (e) => {
    updateDesaDropdowns(e.target.value);
  });

  // Dynamic Desa -> SLS dropdown & table fetch
  elements.inputDesa.addEventListener('change', (e) => {
    fetchSlsListForDesa(e.target.value);
  });

  // Role Penerima Controls
  if (elements.inputPenerimaKecamatan) {
    elements.inputPenerimaKecamatan.addEventListener('change', (e) => {
      const kecId = e.target.value;
      const filteredDesa = getAvailableDesaList(kecId);
      if (elements.inputPenerimaDesa) {
        elements.inputPenerimaDesa.innerHTML = '<option value="">Semua Desa/Kelurahan</option>' +
          filteredDesa.map(d => `<option value="${d.id}">${d.nama}</option>`).join('');
        if (filteredDesa.length > 0) {
          elements.inputPenerimaDesa.value = filteredDesa[0].id;
        }
      }
      fetchPenerimaSlsList(elements.inputPenerimaDesa ? elements.inputPenerimaDesa.value : '', kecId);
    });
  }

  if (elements.inputPenerimaDesa) {
    elements.inputPenerimaDesa.addEventListener('change', (e) => {
      fetchPenerimaSlsList(e.target.value);
    });
  }

  if (elements.btnCheckAllPenerima) {
    elements.btnCheckAllPenerima.addEventListener('click', () => {
      const nowStamp = getCurrentFormattedTimestamp();

      document.querySelectorAll('.chk-penerima-status').forEach(sel => {
        sel.value = 'Sudah Diterima';
        sel.className = 'chk-penerima-status w-full text-xs font-bold border rounded-lg p-2 bg-emerald-50 text-emerald-800 border-emerald-300';
        const slsId = sel.dataset.idSls || sel.id.replace('penerimaStatus_', '');
        const inpKet = document.getElementById(`penerimaKet_${slsId}`);

        if (inpKet && (!inpKet.value || inpKet.value.trim() === '')) {
          inpKet.value = nowStamp;
        }
      });
      updatePenerimaCount();
    });
  }

  if (elements.btnSubmitPenerima) {
    elements.btnSubmitPenerima.addEventListener('click', async () => {
      const rows = document.querySelectorAll('#tbodyPenerima tr');
      if (rows.length === 0) {
        showToast('Tidak ada data SLS untuk disimpan', 'error');
        return;
      }

      const currentUserName = state.currentUser ? (state.currentUser.nama || state.currentUser.username) : 'Nana Sumarna';
      const items = [];
      rows.forEach(tr => {
        const selStatus = tr.querySelector('.chk-penerima-status');
        if (selStatus) {
          const id_sls = selStatus.dataset.idSls || selStatus.id.replace('penerimaStatus_', '');
          const selKondisi = tr.querySelector(`#penerimaKondisi_${id_sls}`);
          const inpBangunan = tr.querySelector(`#penerimaNoBangunan_${id_sls}`);
          const inpKet = tr.querySelector(`#penerimaKet_${id_sls}`);
          const slsObj = (state.currentSlsList || []).find(s => String(s.id_sls) === String(id_sls));
          const isSudahDiterima = selStatus.value === 'Sudah Diterima';

          items.push({
            id_sls: id_sls,
            nama_sls: slsObj ? slsObj.nama_sls : '',
            id_kecamatan: slsObj ? (slsObj.kec_id || slsObj.id_kecamatan || '') : (elements.inputPenerimaKecamatan ? elements.inputPenerimaKecamatan.value : ''),
            id_desa: slsObj ? (slsObj.desa_id || slsObj.id_desa || '') : (elements.inputPenerimaDesa ? elements.inputPenerimaDesa.value : ''),
            kondisi: selKondisi ? selKondisi.value : 'Baik',
            no_bangunan_terbesar: inpBangunan ? (Number(inpBangunan.value) || 0) : 0,
            status_diterima: selStatus.value,
            tgl_diterima: isSudahDiterima ? (inpKet && inpKet.value ? inpKet.value : getCurrentFormattedTimestamp()) : '',
            petugas_penerima: isSudahDiterima ? currentUserName : ''
          });
        }
      });

      try {
        const res = await fetch('/api/receivings/penerima-bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, survey_id: state.activeSurveyId })
        });
        const json = await res.json();
        if (json.success) {
          showToast(json.message || 'Status penerimaan dokumen peta berhasil disimpan!', 'success');
          await refreshAllData();
        } else {
          showToast(json.message || 'Gagal menyimpan status penerimaan', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan jaringan', 'error');
      }
    });
  }

  // Auto No. Peta Button in Bulk Mode
  if (elements.btnAutoNoPeta) {
    elements.btnAutoNoPeta.addEventListener('click', () => {
      state.currentSlsList.forEach(item => {
        const inp = document.getElementById(`bulkNoPeta_${item.id_sls}`);
        if (inp) {
          inp.value = `PETA-${item.id_sls.slice(-4)}`;
        }
      });
      showToast('No. Peta berhasil diisi otomatis untuk semua SLS!', 'info');
    });
  }

  // Check all / uncheck all in Bulk Mode
  if (elements.chkSelectAllRows) {
    elements.chkSelectAllRows.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      document.querySelectorAll('.chk-bulk-row').forEach(chk => {
        chk.checked = isChecked;
      });
      updateSelectedBulkCount();
    });
  }

  if (elements.btnCheckAllBulk) {
    elements.btnCheckAllBulk.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll('.chk-bulk-row');
      const allChecked = Array.from(checkboxes).every(c => c.checked);
      checkboxes.forEach(c => c.checked = !allChecked);
      if (elements.chkSelectAllRows) elements.chkSelectAllRows.checked = !allChecked;
      updateSelectedBulkCount();
    });
  }

  // Login Form Handler
  if (elements.formLogin) {
    elements.formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (elements.loginAlert) elements.loginAlert.classList.add('hidden');

      const username = (elements.loginUsername ? elements.loginUsername.value : '').trim();
      const password = (elements.loginPassword ? elements.loginPassword.value : '').trim();

      if (!username || !password) {
        showToast('Username dan Password wajib diisi!', 'error');
        return;
      }

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const json = await res.json();
        if (json.success) {
          state.currentUser = json.user;
          localStorage.setItem('bps_user', JSON.stringify(json.user));
          applyUserPermissions();
          hideLoginModal();
          showLoginSuccessModal(json.user);
          await refreshAllData();
        } else {
          if (elements.loginAlert) {
            elements.loginAlert.classList.remove('hidden');
            if (elements.loginAlertText) elements.loginAlertText.textContent = json.message || 'Username / Password salah.';
          }
          showToast(json.message || 'Username / Password salah.', 'error');
        }
      } catch (err) {
        console.error('Login error:', err);
        showToast('Gagal terhubung ke server login', 'error');
      }
    });
  }

  // Dismiss Login Success Modal Handler
  if (elements.btnDismissLoginSuccess) {
    elements.btnDismissLoginSuccess.addEventListener('click', () => {
      hideLoginSuccessModal();
    });
  }

  // Logout Handler
  if (elements.btnLogout) {
    elements.btnLogout.addEventListener('click', () => {
      state.currentUser = null;
      localStorage.removeItem('bps_user');
      showLoginModal();
      showToast('Anda telah keluar (logout)', 'info');
    });
  }

  // Add User Form Handler (Admin Only)
  if (elements.formAddUser) {
    elements.formAddUser.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nama = elements.inputUserNama.value;
      const username = elements.inputUserUsername.value;
      const password = elements.inputUserPassword.value;
      const role = elements.inputUserRole.value;

      const checkedKec = Array.from(document.querySelectorAll('.chk-add-user-kec:checked')).map(c => c.value);
      const checkedSurveys = Array.from(document.querySelectorAll('.chk-add-user-survey:checked')).map(c => c.value);

      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama, username, password, role, assigned_kec: checkedKec, assigned_surveys: checkedSurveys, requester_role: state.currentUser ? state.currentUser.role : 'entry' })
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Petugas ${nama} berhasil ditambahkan!`, 'success');
          elements.formAddUser.reset();
          document.querySelectorAll('.chk-add-user-kec').forEach(c => c.checked = false);
          document.querySelectorAll('.chk-add-user-survey').forEach(c => c.checked = false);
          await fetchUsers();
        } else {
          showToast(json.message || 'Gagal menambahkan user', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan koneksi', 'error');
      }
    });
  }

  if (elements.btnToggleAllAddUserKec) {
    elements.btnToggleAllAddUserKec.addEventListener('click', () => {
      const chks = document.querySelectorAll('.chk-add-user-kec');
      const allChecked = Array.from(chks).every(c => c.checked);
      chks.forEach(c => c.checked = !allChecked);
      elements.btnToggleAllAddUserKec.textContent = !allChecked ? 'Batal Pilih' : 'Pilih Semua';
    });
  }

  if (elements.btnToggleAllAddUserSurvey) {
    elements.btnToggleAllAddUserSurvey.addEventListener('click', () => {
      const chks = document.querySelectorAll('.chk-add-user-survey');
      const allChecked = Array.from(chks).every(c => c.checked);
      chks.forEach(c => c.checked = !allChecked);
      elements.btnToggleAllAddUserSurvey.textContent = !allChecked ? 'Batal Pilih' : 'Pilih Semua';
    });
  }

  // Modal Allocation Event Handlers
  if (elements.btnCloseAllocModal) elements.btnCloseAllocModal.addEventListener('click', closeAllocModal);
  if (elements.btnCancelAllocModal) elements.btnCancelAllocModal.addEventListener('click', closeAllocModal);

  if (elements.btnToggleAllAllocKec) {
    elements.btnToggleAllAllocKec.addEventListener('click', () => {
      const chks = document.querySelectorAll('.chk-edit-alloc-kec');
      const allChecked = Array.from(chks).every(c => c.checked);
      chks.forEach(c => c.checked = !allChecked);
    });
  }

  if (elements.btnToggleAllAllocSurvey) {
    elements.btnToggleAllAllocSurvey.addEventListener('click', () => {
      const chks = document.querySelectorAll('.chk-edit-alloc-survey');
      const allChecked = Array.from(chks).every(c => c.checked);
      chks.forEach(c => c.checked = !allChecked);
    });
  }

  if (elements.formEditAllocation) {
    elements.formEditAllocation.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userId = elements.editAllocUserId.value;
      if (!userId) return;

      const checkedKec = Array.from(document.querySelectorAll('.chk-edit-alloc-kec:checked')).map(c => c.value);
      const checkedSurveys = Array.from(document.querySelectorAll('.chk-edit-alloc-survey:checked')).map(c => c.value);

      try {
        const res = await fetch(`/api/users/${userId}/allocation`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assigned_kec: checkedKec, assigned_surveys: checkedSurveys })
        });
        const json = await res.json();
        if (json.success) {
          showToast(json.message, 'success');
          closeAllocModal();
          await fetchUsers();
          if (state.currentUser && state.currentUser.id === userId) {
            state.currentUser.assigned_kec = checkedKec;
            state.currentUser.assigned_surveys = checkedSurveys;
            localStorage.setItem('bps_user', JSON.stringify(state.currentUser));
            populateMasterDropdowns();
            populateHeaderSurveySelector();
          }
        } else {
          showToast(json.message || 'Gagal memperbarui alokasi', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan koneksi saat menyimpan alokasi', 'error');
      }
    });
  }

  // Modal Edit User & Reset Password Event Handlers
  if (elements.btnCloseEditUserModal) elements.btnCloseEditUserModal.addEventListener('click', closeEditUserModal);
  if (elements.btnCancelEditUserModal) elements.btnCancelEditUserModal.addEventListener('click', closeEditUserModal);

  if (elements.btnToggleAllEditUserKec) {
    elements.btnToggleAllEditUserKec.addEventListener('click', () => {
      const chks = document.querySelectorAll('.chk-edit-user-kec');
      const allChecked = Array.from(chks).every(c => c.checked);
      chks.forEach(c => c.checked = !allChecked);
      elements.btnToggleAllEditUserKec.textContent = !allChecked ? 'Batal Pilih' : 'Pilih Semua';
    });
  }

  if (elements.btnToggleAllEditUserSurvey) {
    elements.btnToggleAllEditUserSurvey.addEventListener('click', () => {
      const chks = document.querySelectorAll('.chk-edit-user-survey');
      const allChecked = Array.from(chks).every(c => c.checked);
      chks.forEach(c => c.checked = !allChecked);
      elements.btnToggleAllEditUserSurvey.textContent = !allChecked ? 'Batal Pilih' : 'Pilih Semua';
    });
  }

  if (elements.formEditUser) {
    elements.formEditUser.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userId = elements.editUserId.value;
      if (!userId) return;

      const nama = elements.editUserNama.value;
      const username = elements.editUserUsername.value;
      const password = elements.editUserPassword.value;
      const role = elements.editUserRole.value;
      const checkedKec = Array.from(document.querySelectorAll('.chk-edit-user-kec:checked')).map(c => c.value);
      const checkedSurveys = Array.from(document.querySelectorAll('.chk-edit-user-survey:checked')).map(c => c.value);

      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama, username, password, role, assigned_kec: checkedKec, assigned_surveys: checkedSurveys, requester_role: state.currentUser ? state.currentUser.role : 'entry' })
        });
        const json = await res.json();
        if (json.success) {
          showToast(json.message, 'success');
          closeEditUserModal();
          await fetchUsers();

          if (state.currentUser && state.currentUser.id === userId) {
            state.currentUser.nama = nama;
            state.currentUser.username = username;
            state.currentUser.role = role;
            state.currentUser.assigned_kec = checkedKec;
            state.currentUser.assigned_surveys = checkedSurveys;
            localStorage.setItem('bps_user', JSON.stringify(state.currentUser));
            applyUserPermissions();
          }
        } else {
          showToast(json.message || 'Gagal memperbarui data user', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan koneksi saat menyimpan perubahan user', 'error');
      }
    });
  }

  // Active Survey Selectors Event Listener (Sync across Dashboard Banner & Tabs)
  document.addEventListener('change', async (e) => {
    if (e.target && (e.target.classList.contains('select-active-survey') || e.target.id === 'selectActiveSurveyHeader')) {
      state.activeSurveyId = e.target.value;
      const selectors = document.querySelectorAll('.select-active-survey, #selectActiveSurveyHeader');
      selectors.forEach(sel => sel.value = state.activeSurveyId);

      populateMasterDropdowns();
      if (elements.inputDesa && elements.inputDesa.value) {
        await fetchSlsListForDesa(elements.inputDesa.value);
      }
      await refreshAllData();
      const selectedText = e.target.options && e.target.options[e.target.selectedIndex] ? e.target.options[e.target.selectedIndex].text : '';
      showToast(`Beralih ke kegiatan: ${selectedText}`, 'info');
    }
  });

  // Modal Survey Form Event Listeners
  if (elements.btnOpenAddSurveyModal) elements.btnOpenAddSurveyModal.addEventListener('click', openAddSurveyModal);
  if (elements.btnCloseSurveyModal) elements.btnCloseSurveyModal.addEventListener('click', closeSurveyModal);
  if (elements.btnCancelSurveyModal) elements.btnCancelSurveyModal.addEventListener('click', closeSurveyModal);

  if (elements.formSurvey) {
    elements.formSurvey.addEventListener('submit', async (e) => {
      e.preventDefault();
      const surveyId = elements.surveyEditId ? elements.surveyEditId.value : '';
      const nama_kegiatan = elements.inputSurveyNama.value;
      const jenis = elements.inputSurveyJenis.value;
      const tahun = elements.inputSurveyTahun.value;
      const status = elements.inputSurveyStatus.value;

      const url = surveyId ? `/api/surveys/${surveyId}` : '/api/surveys';
      const method = surveyId ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama_kegiatan, jenis, tahun, status })
        });
        const json = await res.json();
        if (json.success) {
          showToast(json.message, 'success');
          closeSurveyModal();
          await fetchSurveys();
        } else {
          showToast(json.message || 'Gagal menyimpan kegiatan', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan koneksi', 'error');
      }
    });
  }

  // Modal Upload Sample Event Listeners
  if (elements.btnCloseUploadSampleModal) elements.btnCloseUploadSampleModal.addEventListener('click', closeUploadSampleModal);
  if (elements.btnCancelUploadSampleModal) elements.btnCancelUploadSampleModal.addEventListener('click', closeUploadSampleModal);

  if (elements.btnSubmitUploadSampleModal) {
    elements.btnSubmitUploadSampleModal.addEventListener('click', async () => {
      const surveyId = elements.uploadSampleSurveyId.value;
      const fileInput = elements.inputSampleFileModal;
      if (!surveyId || !fileInput || !fileInput.files || fileInput.files.length === 0) {
        showToast('Pilih file Excel atau CSV sampel SLS terlebih dahulu', 'error');
        return;
      }

      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });

          const sampleSlsList = [];
          rawData.forEach(row => {
            if (!row || typeof row !== 'object') return;
            
            let id = '';
            let nama = '';

            // Smart key matching across all possible header variations
            Object.keys(row).forEach(key => {
              const val = String(row[key] || '').trim();
              if (!val) return;
              const normKey = key.toString().toLowerCase().replace(/[^a-z0-9]/g, '');

              // Check for Kode SLS / id_sls
              if (normKey === 'kodesls' || normKey === 'idsls' || normKey === 'kodesls16' || normKey === 'slsid' || normKey === 'kdsls') {
                id = val;
              }
              // Check for Nama SLS / nama_sls
              else if (normKey === 'namasls' || normKey === 'nmsls' || normKey === 'slsnama' || normKey === 'namasls16') {
                nama = val;
              }
            });

            // Direct key fallback if smart matching did not catch it
            if (!id) {
              id = row['Kode SLS'] || row['kode_sls'] || row['KODE SLS'] || row.id_sls || row.ID_SLS || row['ID SLS'] || row['Kode_SLS'] || '';
            }
            if (!nama) {
              nama = row['Nama SLS'] || row['nama_sls'] || row['NAMA SLS'] || row.nama_sls || row.NAMA_SLS || row['Nama_SLS'] || '';
            }

            if (id && String(id).trim() !== '') {
              sampleSlsList.push({
                id_sls: String(id).trim(),
                nama_sls: String(nama).trim()
              });
            }
          });

          if (sampleSlsList.length === 0) {
            showToast('File tidak valid atau kolom "Kode SLS" / "id_sls" tidak ditemukan.', 'error');
            return;
          }

          const res = await fetch(`/api/surveys/${surveyId}/upload-sample`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sample_sls: sampleSlsList })
          });
          const json = await res.json();
          if (json.success) {
            showToast(json.message, 'success');
            closeUploadSampleModal();
            await fetchSurveys();
            if (elements.inputDesa && elements.inputDesa.value) {
              await fetchSlsListForDesa(elements.inputDesa.value);
            }
          } else {
            showToast(json.message || 'Gagal mengunggah sampel SLS', 'error');
          }
        } catch (err) {
          showToast('Gagal membaca file Excel/CSV sampel.', 'error');
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // Process Import Petugas via Excel/CSV (Admin Only)
  if (elements.btnProcessImportUsers) {
    elements.btnProcessImportUsers.addEventListener('click', () => {
      const fileInput = elements.inputImportUsersFile;
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showToast('Pilih file Excel / CSV terlebih dahulu', 'error');
        return;
      }

      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

          const usersToImport = rawRows.map(r => {
            const getVal = (keyNames) => {
              for (const k of Object.keys(r)) {
                if (keyNames.includes(k.trim().toLowerCase())) return String(r[k]).trim();
              }
              return '';
            };

            return {
              nama: getVal(['nama', 'name', 'nama lengkap']),
              username: getVal(['username', 'user']),
              password: getVal(['password', 'pass']),
              role: getVal(['role', 'peran', 'tupoksi']) || 'entry',
              assigned_kec: getVal(['assigned_kec', 'alokasi_kec', 'kecamatan', 'assigned'])
            };
          }).filter(u => u.nama && u.username && u.password);

          if (usersToImport.length === 0) {
            showToast('Data tidak valid atau file kosong. Pastikan header memuat: nama, username, password, role, assigned_kec.', 'error');
            return;
          }

          const res = await fetch('/api/users/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users: usersToImport })
          });
          const json = await res.json();
          if (json.success) {
            showToast(json.message, 'success');
            fileInput.value = '';
            await fetchUsers();
          } else {
            showToast(json.message || 'Gagal mengimpor petugas', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('Terjadi kesalahan saat membaca file Excel / CSV', 'error');
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // Submit Bulk SLS for 1 Desa
  if (elements.btnSubmitBulk) {
    elements.btnSubmitBulk.addEventListener('click', async () => {
      const kecId = elements.inputKecamatan.value;
      const desaId = elements.inputDesa.value;

      if (!kecId || !desaId) {
        showToast('Pilih Kecamatan dan Desa terlebih dahulu', 'error');
        return;
      }

      const checkedRows = Array.from(document.querySelectorAll('.chk-bulk-row:checked'));
      if (checkedRows.length === 0) {
        showToast('Pilih minimal 1 SLS yang akan disimpan', 'error');
        return;
      }

      const tglBulk = elements.inputTglPenerimaanBulk.value || new Date().toISOString().split('T')[0];
      const petugasReceiving = state.currentUser ? (state.currentUser.nama || state.currentUser.username) : '';

      const itemsToSubmit = [];

      checkedRows.forEach(chk => {
        const slsId = chk.dataset.idSls;
        const slsObj = state.currentSlsList.find(s => String(s.id_sls) === String(slsId));
        if (!slsObj) return;

        const kondisiVal = document.getElementById(`bulkKondisi_${slsId}`)?.value || 'Baik';
        const bangunanVal = document.getElementById(`bulkNoBangunan_${slsId}`)?.value || 0;
        const perbaikanVal = document.getElementById(`bulkPerbaikanBatas_${slsId}`)?.value === 'ya';
        const kodePerubahanVal = document.getElementById(`bulkPerubahanSls_${slsId}`)?.value || '';
        const isPerubahanVal = !!kodePerubahanVal;
        const jaringanVal = document.getElementById(`bulkKualitasJaringan_${slsId}`)?.value || 'Kuat';
        const catatanVal = document.getElementById(`bulkCatatan_${slsId}`)?.value || '';

        itemsToSubmit.push({
          no_peta: slsId,
          id_sls: slsId,
          nama_sls: slsObj.nama_sls,
          id_kecamatan: kecId,
          id_desa: desaId,
          tgl_penerimaan: tglBulk,
          kondisi: kondisiVal,
          ppl: slsObj.ppl || '',
          no_bangunan_terbesar: Number(bangunanVal) || 0,
          catatan: catatanVal,
          perbaikan_batas: perbaikanVal,
          perubahan_sls: isPerubahanVal,
          kode_jenis_perubahan_sls: kodePerubahanVal,
          kualitas_jaringan: jaringanVal,
          petugas_receiving: petugasReceiving,
          status_scan: 'Tidak',
          petugas_scan: ''
        });
      });

      try {
        const res = await fetch('/api/receivings/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: itemsToSubmit, petugas_receiving: petugasReceiving })
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Berhasil menyimpan ${json.count} SLS untuk Desa ini!`, 'success');
          await refreshAllData();
          renderBulkSlsTable();
        } else {
          showToast(json.message || 'Gagal menyimpan data bulk', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan koneksi saat mengirim data bulk', 'error');
      }
    });
  }

  // Modal Edit Receiving Event Handlers
  if (elements.btnCloseEditReceivingModal) elements.btnCloseEditReceivingModal.addEventListener('click', closeEditReceivingModal);
  if (elements.btnCancelEditReceivingModal) elements.btnCancelEditReceivingModal.addEventListener('click', closeEditReceivingModal);

  if (elements.formEditReceiving) {
    elements.formEditReceiving.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = elements.editReceivingId.value;
      if (!id) return;

      const payload = {
        tgl_penerimaan: elements.editTglPenerimaan.value,
        kondisi: elements.editKondisiPeta.value,
        ppl: elements.editPpl.value,
        no_bangunan_terbesar: elements.editNoBangunan.value,
        perbaikan_batas: elements.editPerbaikanBatas.value === 'ya',
        kode_jenis_perubahan_sls: elements.editKodeJenisPerubahanSls.value,
        perubahan_sls: !!elements.editKodeJenisPerubahanSls.value,
        kualitas_jaringan: elements.editKualitasJaringan.value,
        catatan: elements.editCatatan.value
      };

      try {
        const res = await fetch(`/api/receivings/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          showToast(json.message, 'success');
          closeEditReceivingModal();
          await refreshAllData();
          renderBulkSlsTable();
        } else {
          showToast(json.message || 'Gagal mengedit data receiving', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan koneksi saat menyimpan perubahan', 'error');
      }
    });
  }

  // Global function for edit modal
  window.openEditReceivingModal = (id) => {
    const item = state.receivings.find(r => r.id === id);
    if (!item) return;
    elements.editReceivingId.value = item.id;
    elements.editTglPenerimaan.value = item.tgl_penerimaan;
    elements.editKondisiPeta.value = item.kondisi;
    elements.editPpl.value = item.ppl;
    elements.editNoBangunan.value = item.no_bangunan_terbesar;
    elements.editPerbaikanBatas.value = item.perbaikan_batas ? 'ya' : 'tidak';
    elements.editKodeJenisPerubahanSls.value = item.kode_jenis_perubahan_sls || '';
    elements.editKualitasJaringan.value = item.kualitas_jaringan || 'Kuat';
    elements.editCatatan.value = item.catatan || '';
    elements.modalEditReceiving.classList.remove('hidden');
  };

  // Select SLS Master Auto-Populate in Single Mode
  if (elements.selectSlsMaster) {
    elements.selectSlsMaster.addEventListener('change', (e) => {
      const slsId = e.target.value;
      if (!slsId) {
        elements.inputIdSls.value = '';
        elements.inputNamaSls.value = '';
        elements.inputPpl.value = '';
        return;
      }

      const slsObj = state.currentSlsList.find(s => String(s.id_sls) === String(slsId));
      if (slsObj) {
        elements.inputIdSls.value = slsObj.id_sls;
        elements.inputNamaSls.value = slsObj.nama_sls;
        elements.inputPpl.value = slsObj.ppl || '';
      }
    });
  }

  // Filter listeners for Kecamatan (Synced across tabs)
  const handleKecamatanChange = (e) => {
    syncRegionFilters(e.target.value, '');
    fetchReceivings();
  };
  if (elements.filterKecamatan) elements.filterKecamatan.addEventListener('change', handleKecamatanChange);
  if (elements.filterKecamatanPerubahan) elements.filterKecamatanPerubahan.addEventListener('change', handleKecamatanChange);
  if (elements.filterKecamatanScanning) elements.filterKecamatanScanning.addEventListener('change', handleKecamatanChange);

  // Filter listeners for Desa (Synced across tabs)
  const handleDesaChange = (e) => {
    syncRegionFilters(state.filters.kec_id, e.target.value);
    fetchReceivings();
  };
  if (elements.filterDesa) elements.filterDesa.addEventListener('change', handleDesaChange);
  if (elements.filterDesaPerubahan) elements.filterDesaPerubahan.addEventListener('change', handleDesaChange);
  if (elements.filterDesaScanning) elements.filterDesaScanning.addEventListener('change', handleDesaChange);

  // Reset filter listeners (Synced across tabs)
  const handleResetFilters = () => {
    state.filters.search = '';
    state.filters.search_perubahan = '';
    state.filters.search_scanning = '';
    state.filters.kode_perubahan = '';
    state.filters.status_scan = '';
    state.filters.status_diterima = '';
    state.filters.sort_by = 'sls_asc';
    state.filters.kondisi = '';
    state.filters.jaringan = '';
    state.filters.perbaikan_batas = '';
    state.filters.perubahan_sls = '';

    if (elements.searchReceiving) elements.searchReceiving.value = '';
    if (elements.searchPerubahanSls) elements.searchPerubahanSls.value = '';
    if (elements.searchScanning) elements.searchScanning.value = '';
    if (elements.filterKodePerubahanSls) elements.filterKodePerubahanSls.value = '';
    if (elements.filterStatusScan) elements.filterStatusScan.value = '';
    if (elements.filterStatusDiterima) elements.filterStatusDiterima.value = '';
    if (elements.selectSortReceiving) elements.selectSortReceiving.value = 'sls_asc';
    if (elements.filterKondisi) elements.filterKondisi.value = '';
    if (elements.filterJaringan) elements.filterJaringan.value = '';
    if (elements.filterPerbaikanBatas) elements.filterPerbaikanBatas.value = '';
    if (elements.filterPerubahanSls) elements.filterPerubahanSls.value = '';

    syncRegionFilters('', '');
    fetchReceivings();
  };
  if (elements.btnResetFilter) elements.btnResetFilter.addEventListener('click', handleResetFilters);
  if (elements.btnResetFilterPerubahan) elements.btnResetFilterPerubahan.addEventListener('click', handleResetFilters);
  if (elements.btnResetFilterScanning) elements.btnResetFilterScanning.addEventListener('click', handleResetFilters);

  // New Filter Listeners for Daftar Peta
  if (elements.filterStatusDiterima) {
    elements.filterStatusDiterima.addEventListener('change', (e) => {
      state.filters.status_diterima = e.target.value;
      state.pagination.receivings.page = 1;
      fetchReceivings();
    });
  }

  if (elements.filterKondisi) {
    elements.filterKondisi.addEventListener('change', (e) => {
      state.filters.kondisi = e.target.value;
      state.pagination.receivings.page = 1;
      fetchReceivings();
    });
  }

  if (elements.filterJaringan) {
    elements.filterJaringan.addEventListener('change', (e) => {
      state.filters.jaringan = e.target.value;
      state.pagination.receivings.page = 1;
      fetchReceivings();
    });
  }

  if (elements.filterPerbaikanBatas) {
    elements.filterPerbaikanBatas.addEventListener('change', (e) => {
      state.filters.perbaikan_batas = e.target.value;
      state.pagination.receivings.page = 1;
      fetchReceivings();
    });
  }

  if (elements.filterPerubahanSls) {
    elements.filterPerubahanSls.addEventListener('change', (e) => {
      state.filters.perubahan_sls = e.target.value;
      state.pagination.receivings.page = 1;
      fetchReceivings();
    });
  }

  // Export Excel Handler
  if (elements.btnExportExcel) {
    elements.btnExportExcel.addEventListener('click', () => {
      const params = new URLSearchParams();
      if (state.activeSurveyId) params.append('survey_id', state.activeSurveyId);
      if (state.filters.kec_id) params.append('kec_id', state.filters.kec_id);
      if (state.filters.desa_id) params.append('desa_id', state.filters.desa_id);
      if (state.filters.search) params.append('search', state.filters.search);
      if (state.filters.kondisi) params.append('kondisi', state.filters.kondisi);
      if (state.filters.jaringan) params.append('kualitas_jaringan', state.filters.jaringan);
      if (state.filters.perbaikan_batas) params.append('perbaikan_batas', state.filters.perbaikan_batas);
      if (state.filters.perubahan_sls) params.append('perubahan_sls', state.filters.perubahan_sls);

      window.location.href = '/api/export/excel?' + params.toString();
      showToast('Mengunduh rekap data receiving dalam format Excel...', 'info');
    });
  }

  // Search input on Receiving tab
  if (elements.searchReceiving) {
    elements.searchReceiving.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      state.pagination.receivings.page = 1;
      fetchReceivings();
    });
  }

  // Search input on Perubahan SLS tab
  if (elements.searchPerubahanSls) {
    elements.searchPerubahanSls.addEventListener('input', (e) => {
      state.filters.search_perubahan = e.target.value;
      state.pagination.perubahan.page = 1;
      renderPerubahanSlsTable();
    });
  }

  // Kode Perubahan SLS filter (1-9)
  if (elements.filterKodePerubahanSls) {
    elements.filterKodePerubahanSls.addEventListener('change', (e) => {
      state.filters.kode_perubahan = e.target.value;
      state.pagination.perubahan.page = 1;
      renderPerubahanSlsTable();
    });
  }

  // Search input on Scanning tab
  if (elements.searchScanning) {
    elements.searchScanning.addEventListener('input', (e) => {
      state.filters.search_scanning = e.target.value;
      state.pagination.scanning.page = 1;
      renderScanningTable();
    });
  }

  if (elements.selectSortReceiving) {
    elements.selectSortReceiving.addEventListener('change', (e) => {
      state.filters.sort_by = e.target.value;
      fetchReceivings();
    });
  }

  if (elements.filterStatusScan) {
    elements.filterStatusScan.addEventListener('change', (e) => {
      state.filters.status_scan = e.target.value;
      state.pagination.scanning.page = 1;
      fetchReceivings();
    });
  }

  // Pagination Event Listeners: Daftar Peta
  if (elements.limitReceivings) {
    elements.limitReceivings.addEventListener('change', (e) => {
      state.pagination.receivings.limit = parseInt(e.target.value) || 10;
      state.pagination.receivings.page = 1;
      renderReceivingsTable();
    });
  }
  if (elements.btnPrevReceivings) {
    elements.btnPrevReceivings.addEventListener('click', () => {
      if (state.pagination.receivings.page > 1) {
        state.pagination.receivings.page--;
        renderReceivingsTable();
      }
    });
  }
  if (elements.btnNextReceivings) {
    elements.btnNextReceivings.addEventListener('click', () => {
      const totalPages = Math.ceil(state.receivings.length / state.pagination.receivings.limit) || 1;
      if (state.pagination.receivings.page < totalPages) {
        state.pagination.receivings.page++;
        renderReceivingsTable();
      }
    });
  }

  // Pagination Event Listeners: Perubahan SLS
  if (elements.limitPerubahan) {
    elements.limitPerubahan.addEventListener('change', (e) => {
      state.pagination.perubahan.limit = parseInt(e.target.value) || 10;
      state.pagination.perubahan.page = 1;
      renderPerubahanSlsTable();
    });
  }
  if (elements.btnPrevPerubahan) {
    elements.btnPrevPerubahan.addEventListener('click', () => {
      if (state.pagination.perubahan.page > 1) {
        state.pagination.perubahan.page--;
        renderPerubahanSlsTable();
      }
    });
  }
  if (elements.btnNextPerubahan) {
    elements.btnNextPerubahan.addEventListener('click', () => {
      const list = state.receivings.filter(r => r.perubahan_sls);
      const totalPages = Math.ceil(list.length / state.pagination.perubahan.limit) || 1;
      if (state.pagination.perubahan.page < totalPages) {
        state.pagination.perubahan.page++;
        renderPerubahanSlsTable();
      }
    });
  }

  // Pagination Event Listeners: Scanning
  if (elements.limitScanning) {
    elements.limitScanning.addEventListener('change', (e) => {
      state.pagination.scanning.limit = parseInt(e.target.value) || 10;
      state.pagination.scanning.page = 1;
      renderScanningTable();
    });
  }
  if (elements.btnPrevScanning) {
    elements.btnPrevScanning.addEventListener('click', () => {
      if (state.pagination.scanning.page > 1) {
        state.pagination.scanning.page--;
        renderScanningTable();
      }
    });
  }
  if (elements.btnNextScanning) {
    elements.btnNextScanning.addEventListener('click', () => {
      const totalPages = Math.ceil(state.receivings.length / state.pagination.scanning.limit) || 1;
      if (state.pagination.scanning.page < totalPages) {
        state.pagination.scanning.page++;
        renderScanningTable();
      }
    });
  }

  // Pagination Event Listeners: Dashboard Kecamatan
  if (elements.limitDashKec) {
    elements.limitDashKec.addEventListener('change', (e) => {
      state.pagination.dashboardKec.limit = parseInt(e.target.value) || 10;
      state.pagination.dashboardKec.page = 1;
      renderDashboardUI();
    });
  }
  if (elements.btnPrevDashKec) {
    elements.btnPrevDashKec.addEventListener('click', () => {
      if (state.pagination.dashboardKec.page > 1) {
        state.pagination.dashboardKec.page--;
        renderDashboardUI();
      }
    });
  }
  if (elements.btnNextDashKec) {
    elements.btnNextDashKec.addEventListener('click', () => {
      const availKec = getAvailableKecamatanList();
      const totalPages = Math.ceil(availKec.length / state.pagination.dashboardKec.limit) || 1;
      if (state.pagination.dashboardKec.page < totalPages) {
        state.pagination.dashboardKec.page++;
        renderDashboardUI();
      }
    });
  }

  // Pagination Event Listeners: Kelola Petugas
  if (elements.limitUsers) {
    elements.limitUsers.addEventListener('change', (e) => {
      state.pagination.users.limit = parseInt(e.target.value) || 10;
      state.pagination.users.page = 1;
      renderUsersTable();
    });
  }
  if (elements.btnPrevUsers) {
    elements.btnPrevUsers.addEventListener('click', () => {
      if (state.pagination.users.page > 1) {
        state.pagination.users.page--;
        renderUsersTable();
      }
    });
  }
  if (elements.btnNextUsers) {
    elements.btnNextUsers.addEventListener('click', () => {
      const totalPages = Math.ceil((state.users || []).length / state.pagination.users.limit) || 1;
      if (state.pagination.users.page < totalPages) {
        state.pagination.users.page++;
        renderUsersTable();
      }
    });
  }

  // Survey Config Mode Selection Buttons
  if (elements.btnSelectModeSensus) {
    elements.btnSelectModeSensus.addEventListener('click', () => {
      state.selectedSurveyMode = 'sensus';
      renderSurveyConfigUI();
    });
  }

  if (elements.btnSelectModeSurvei) {
    elements.btnSelectModeSurvei.addEventListener('click', () => {
      state.selectedSurveyMode = 'survei';
      renderSurveyConfigUI();
    });
  }

  // Save Survey Mode Button
  if (elements.btnSaveSurveyMode) {
    elements.btnSaveSurveyMode.addEventListener('click', async () => {
      const mode = state.selectedSurveyMode;
      const survey_name = elements.inputSurveyName ? elements.inputSurveyName.value.trim() : '';

      try {
        const res = await fetch('/api/survey-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, survey_name })
        });
        const json = await res.json();
        if (json.success) {
          showToast(json.message, 'success');
          state.surveyConfig = json.data;
          renderSurveyConfigUI();
          await loadMasterData();
          if (elements.inputDesa && elements.inputDesa.value) {
            await fetchSlsListForDesa(elements.inputDesa.value);
          }
        } else {
          showToast(json.message || 'Gagal mengubah mode kegiatan', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan jaringan', 'error');
      }
    });
  }

  // Upload Excel / CSV Master SLS Sampel
  if (elements.btnUploadSampleSls) {
    elements.btnUploadSampleSls.addEventListener('click', async () => {
      const fileInput = elements.inputSampleSlsFile;
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showToast('Pilih file Excel atau CSV sampel SLS terlebih dahulu.', 'error');
        return;
      }

      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet);

          const sampleSlsList = [];
          rawData.forEach(row => {
            let id = row.id_sls || row.ID_SLS || row.Id_sls || row['Kode SLS'] || row['kode_sls'] || row['ID SLS'];
            let nama = row.nama_sls || row.NAMA_SLS || row.Nama_sls || row['Nama SLS'] || row['nama_sls'] || '';
            if (id) {
              sampleSlsList.push({ id_sls: String(id).trim(), nama_sls: String(nama).trim() });
            }
          });

          if (sampleSlsList.length === 0) {
            showToast('File tidak valid atau tidak memiliki kolom "id_sls".', 'error');
            return;
          }

          const survey_name = elements.inputSurveyName ? elements.inputSurveyName.value.trim() : '';

          const res = await fetch('/api/survey-config/upload-sample', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sample_sls: sampleSlsList, survey_name })
          });
          const json = await res.json();
          if (json.success) {
            showToast(json.message, 'success');
            state.surveyConfig = json.data;
            state.selectedSurveyMode = 'survei';
            fileInput.value = '';
            renderSurveyConfigUI();
            await loadMasterData();
            if (elements.inputDesa && elements.inputDesa.value) {
              await fetchSlsListForDesa(elements.inputDesa.value);
            }
          } else {
            showToast(json.message || 'Gagal mengunggah sampel SLS', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('Gagal membaca file Excel/CSV sampel.', 'error');
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // Conditional Section Toggle: Perubahan SLS in Single Mode
  const radioPerubahanSlsList = document.querySelectorAll('input[name="radioPerubahanSls"]');
  radioPerubahanSlsList.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'ya') {
        elements.sectionPerubahanSls.classList.remove('hidden');
      } else {
        elements.sectionPerubahanSls.classList.add('hidden');
        elements.inputKodeJenisPerubahanSls.value = '';
      }
    });
  });

  // Submit Single Receiving Form
  if (elements.formReceiving) {
    elements.formReceiving.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isPerubahanSls = document.querySelector('input[name="radioPerubahanSls"]:checked')?.value === 'ya';
      const isPerbaikanBatas = document.querySelector('input[name="radioPerbaikanBates"]:checked')?.value === 'ya';

      if (isPerubahanSls && !elements.inputKodeJenisPerubahanSls.value) {
        showToast('Pilih Kode Jenis Perubahan SLS (1-9) terlebih dahulu.', 'error');
        return;
      }

      const payload = {
        no_peta: elements.inputIdSls.value,
        id_sls: elements.inputIdSls.value,
        nama_sls: elements.inputNamaSls.value,
        id_kecamatan: elements.inputKecamatan.value,
        id_desa: elements.inputDesa.value,
        tgl_penerimaan: elements.inputTglPenerimaan.value,
        kondisi: elements.inputKondisi.value,
        ppl: elements.inputPpl.value,
        no_bangunan_terbesar: elements.inputNoBangunanTerbesar.value,
        catatan: elements.inputCatatan.value,
        perbaikan_batas: isPerbaikanBatas,
        perubahan_sls: isPerubahanSls,
        kode_jenis_perubahan_sls: isPerubahanSls ? elements.inputKodeJenisPerubahanSls.value : '',
        petugas_receiving: state.currentUser ? (state.currentUser.nama || state.currentUser.username) : ''
      };

      try {
        const res = await fetch('/api/receivings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          showToast('Data penerimaan peta berhasil disimpan!', 'success');
          elements.formReceiving.reset();
          initDateInput();
          elements.sectionPerubahanSls.classList.add('hidden');
          elements.selectSlsMaster.innerHTML = '<option value="">-- Pilih Desa Terlebih Dahulu --</option>';
          await refreshAllData();
          renderBulkSlsTable();
        } else {
          showToast(json.message || 'Gagal menyimpan data', 'error');
        }
      } catch (err) {
        showToast('Terjadi kesalahan jaringan', 'error');
      }
    });
  }

  // Export CSV
  elements.btnExportCsv.addEventListener('click', () => {
    window.location.href = '/api/export/csv';
  });
}

// Global Scanning Actions attached to window
window.updateScanStatus = async function(id, statusScan) {
  const inputPetugas = document.getElementById(`inputPetugasScan_${id}`);
  let petugasScan = inputPetugas ? inputPetugas.value.trim() : '';
  const isScanYa = (statusScan === 'Ya' || statusScan === 'ya' || statusScan === 'true');

  if (isScanYa) {
    if (!petugasScan && state.currentUser) {
      petugasScan = state.currentUser.nama || state.currentUser.username;
      if (inputPetugas) inputPetugas.value = petugasScan;
    }
  }

  const tglScan = isScanYa ? getCurrentFormattedTimestamp() : '';

  try {
    const res = await fetch(`/api/receivings/${id}/scan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_scan: statusScan, petugas_scan: petugasScan, tgl_scan: tglScan })
    });
    const json = await res.json();
    if (json.success) {
      showToast(json.message, 'success');
      await refreshAllData();
    }
  } catch (err) {
    showToast('Gagal memperbarui status scan', 'error');
  }
};

window.savePetugasScan = async function(id) {
  const inputPetugas = document.getElementById(`inputPetugasScan_${id}`);
  const petugasScan = inputPetugas ? inputPetugas.value.trim() : '';
  const item = state.receivings.find(r => r.id === id);
  const statusScan = item ? (item.status_scan || 'Tidak') : 'Tidak';
  const isScanYa = (statusScan === 'Ya');
  const tglScan = isScanYa ? (item.tgl_scan || getCurrentFormattedTimestamp()) : '';

  try {
    const res = await fetch(`/api/receivings/${id}/scan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_scan: statusScan, petugas_scan: petugasScan, tgl_scan: tglScan })
    });
    const json = await res.json();
    if (json.success) {
      showToast('Petugas scan berhasil disimpan', 'success');
      await refreshAllData();
    }
  } catch (err) {
    showToast('Gagal menyimpan petugas scan', 'error');
  }
};

window.quickToggleScan = async function(id, targetStatus) {
  const inputPetugas = document.getElementById(`inputPetugasScan_${id}`);
  const petugasScan = inputPetugas ? inputPetugas.value : '';
  await window.updateScanStatus(id, targetStatus);
};

window.deleteReceiving = async function(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus data penerimaan peta ini?')) return;
  try {
    const res = await fetch('/api/receivings/' + id, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Data berhasil dihapus', 'success');
      await refreshAllData();
      renderBulkSlsTable();
    }
  } catch (err) {
    showToast('Gagal menghapus data', 'error');
  }
};

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800';
  const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-info-circle';

  toast.className = `${bgClass} text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 text-xs font-semibold transition-all duration-300 transform translate-y-2 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function parseCsvContent(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const idxNama = headers.indexOf('nama');
  const idxUsername = headers.indexOf('username');
  const idxPassword = headers.indexOf('password');
  const idxRole = headers.indexOf('role');

  if (idxNama === -1 || idxUsername === -1 || idxPassword === -1) {
    return [];
  }

  const users = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (row.length <= Math.max(idxNama, idxUsername, idxPassword)) continue;

    const nama = row[idxNama];
    const username = row[idxUsername];
    const password = row[idxPassword];
    const role = idxRole !== -1 ? row[idxRole] : 'entry';

    if (nama && username && password) {
      users.push({ nama, username, password, role });
    }
  }
  return users;
}
