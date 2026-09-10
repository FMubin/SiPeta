import pandas as pd
import json
import os

excel_path = '14 utp.xlsx'
if not os.path.exists(excel_path):
    print("File 14 utp.xlsx not found!")
    exit(1)

xl = pd.ExcelFile(excel_path)
sheet_name = 'Sheet1' if 'Sheet1' in xl.sheet_names else xl.sheet_names[0]
df = xl.parse(sheet_name)

# Drop rows without Kode SLS
if 'Kode SLS' in df.columns:
    df = df.dropna(subset=['Kode SLS'])

kec_map = {}
desa_map = {}
sls_list = []
ppl_map = {}

for _, r in df.iterrows():
    k_code = str(int(r['Kode Kec'])).strip() if pd.notna(r['Kode Kec']) else ''
    k_name = str(r['Nama Kec']).strip() if pd.notna(r['Nama Kec']) else ''
    full_k_name = f"{k_code} - {k_name}"
    if k_code:
        kec_map[k_code] = full_k_name

    d_code = str(int(r['Kode Desa'])).strip() if pd.notna(r['Kode Desa']) else ''
    d_name = str(r['Nama Desa']).strip() if pd.notna(r['Nama Desa']) else ''
    short_d_code = d_code[-3:] if len(d_code) >= 3 else d_code
    full_d_name = f"{short_d_code} - {d_name}"
    
    if d_code and d_code not in desa_map:
        desa_map[d_code] = {
            'id': d_code,
            'kec_id': k_code,
            'nama': full_d_name
        }

    sls_code = str(int(r['Kode SLS'])).strip() if pd.notna(r['Kode SLS']) else ''
    sls_name = str(r['Nama SLS']).strip() if pd.notna(r['Nama SLS']) else ''
    ppl_name = str(r['PPL (Pencacah)']).strip() if pd.notna(r['PPL (Pencacah)']) else ''
    ppl_phone = str(r['No Telp PPL']).strip() if ('No Telp PPL' in r and pd.notna(r['No Telp PPL'])) else ''
    ppl_email = str(r['Email PPL']).strip() if ('Email PPL' in r and pd.notna(r['Email PPL'])) else ''

    ppl_full_label = ppl_name
    if ppl_phone and ppl_phone != 'nan':
        ppl_full_label = f"{ppl_name} ({ppl_phone})"
    elif ppl_email and ppl_email != 'nan':
        ppl_full_label = f"{ppl_name} ({ppl_email})"

    if ppl_name:
        ppl_key = (ppl_name, ppl_phone if ppl_phone != 'nan' else '')
        if ppl_key not in ppl_map:
            ppl_map[ppl_key] = {
                'id': ppl_full_label,
                'nama': ppl_name,
                'no_telp': ppl_phone if ppl_phone != 'nan' else '',
                'email': ppl_email if ppl_email != 'nan' else '',
                'label': ppl_full_label
            }

    sls_list.append({
        'id_sls': sls_code,
        'nama_sls': sls_name,
        'kec_id': k_code,
        'desa_id': d_code,
        'ppl': ppl_full_label,
        'ppl_name': ppl_name,
        'no_telp_ppl': ppl_phone if ppl_phone != 'nan' else '',
        'email_ppl': ppl_email if ppl_email != 'nan' else ''
    })

kec_list = [{'id': k, 'nama': name} for k, name in kec_map.items()]
desa_list = list(desa_map.values())
ppl_list = list(ppl_map.values())

out = {
    'kecamatan': kec_list,
    'desa': desa_list,
    'sls': sls_list,
    'ppl': ppl_list
}

os.makedirs('data', exist_ok=True)
with open('data/master_utp.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("SUCCESS: Master data 14 UTP successfully extracted from Sheet1!")
print(f"Kecamatan: {len(kec_list)}")
print(f"Desa: {len(desa_list)}")
print(f"SLS: {len(sls_list)}")
print(f"PPL Total: {len(ppl_list)}")
