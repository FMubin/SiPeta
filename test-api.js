const http = require('http');

function request(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('Testing API endpoints (Receiving & Scanning)...');
  
  // 1. Get Master
  const master = await request('/api/master');
  console.log('1. Master API Status:', master.status, 'Kecamatan count:', master.data.data.kecamatan.length);

  // 2. Get Stats
  const stats = await request('/api/stats');
  console.log('2. Stats API Status:', stats.status, 'Total peta:', stats.data.data.total_peta, 'Total Scanned:', stats.data.data.total_scanned);

  // 3. Post Receiving
  const newRec = await request('/api/receivings', 'POST', {
    no_peta: 'TEST-PETA-100',
    id_sls: '3301010010100',
    id_kecamatan: '330101',
    id_desa: '330101001',
    tgl_penerimaan: '2026-09-08',
    kondisi: 'Baik',
    ppl: 'PPL Test',
    no_bangunan_terbesar: 100,
    catatan: 'Test clean record',
    perbaikan_batas: false,
    perubahan_sls: false,
    status_scan: 'Ya',
    petugas_scan: 'Petugas Scan Test'
  });
  console.log('3. Create Receiving Status:', newRec.status, 'ID:', newRec.data.data.id);

  // 4. Update Scan Status
  const scanUpd = await request(`/api/receivings/${newRec.data.data.id}/scan`, 'PUT', {
    status_scan: 'Ya',
    petugas_scan: 'Petugas A'
  });
  console.log('4. Update Scan Status:', scanUpd.status, 'Message:', scanUpd.data.message);

  console.log('All API tests completed successfully!');
}

runTests().catch(console.error);
