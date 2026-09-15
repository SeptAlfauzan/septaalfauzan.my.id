<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'

const lang = ref<'id' | 'en'>('id')

function select(next: 'id' | 'en') {
  lang.value = next
}

watchEffect(() => {
  document.documentElement.lang = lang.value
  document.title =
    lang.value === 'id' ? 'Kebijakan Privasi — Saku' : 'Privacy Policy — Saku'
})

onMounted(() => {
  document.documentElement.lang = 'id'
})
</script>

<template>
  <main class="doc-wrap">
    <nav class="lang-switch" aria-label="Language / Bahasa">
      <button
        type="button"
        :aria-current="lang === 'id'"
        :aria-pressed="lang === 'id'"
        @click="select('id')"
      >
        Bahasa Indonesia
      </button>
      <button
        type="button"
        :aria-current="lang === 'en'"
        :aria-pressed="lang === 'en'"
        @click="select('en')"
      >
        English
      </button>
    </nav>

    <header>
      <span class="kicker">Kebijakan Privasi</span>
      <h1>Saku</h1>
      <p class="sub">Aplikasi pencatat keuangan pribadi</p>
      <div class="meta">
        <span>Terakhir diperbarui: 15 September 2026</span>
        <span>Pengembang: Septa Alfauzan</span>
      </div>
    </header>

    <section v-show="lang === 'id'" lang="id">
      <p>
        Saku ("kami") menghormati privasi Anda. Dokumen ini menjelaskan data apa
        saja yang diproses Saku, cara kami menggunakannya, dan pilihan yang Anda
        miliki. Saku dirancang agar data keuangan Anda tetap
        <strong>tersimpan di perangkat Anda</strong>.
      </p>

      <h2>1. Data yang Kami Proses</h2>

      <h3>1.1 Notifikasi bank dan dompet digital</h3>
      <p>
        Dengan izin Anda, Saku membaca notifikasi pembayaran dari aplikasi bank
        dan dompet digital (misalnya BCA, GoPay, OVO, dan DANA) untuk
        mengubahnya menjadi catatan transaksi. Isi notifikasi diproses
        <strong>langsung di perangkat Anda</strong> dan hanya informasi
        transaksi (jumlah, pedagang/merchant, jenis transaksi) yang disimpan
        sebagai catatan.
      </p>

      <h3>1.2 Foto struk (resit)</h3>
      <p>
        Saat Anda memindai struk dengan kamera, foto struk dikirim ke server
        kami di <code>saku-api.septaalfauzan.my.id</code> hanya untuk membaca
        nilai transaksi (OCR). Foto digunakan semata-mata untuk keperluan
        pemindaian, tidak dibagikan ke pihak lain, dan tidak disimpan di server
        kami.
      </p>

      <h3>1.3 Data yang Anda masukkan sendiri</h3>
      <p>
        Catatan transaksi manual, transfer, pengelompokan kategori, dan
        penyesuaian lainnya disimpan di perangkat Anda. Jika Anda mengekspor
        atau mengimpor berkas CSV, berkas tersebut hanya diproses sesuai
        perintah Anda.
      </p>

      <h2>2. Cara Data Disimpan</h2>
      <p>
        Semua catatan transaksi Anda disimpan secara lokal di perangkat Anda.
        Kami tidak memiliki akun, sehingga tidak ada data transaksi yang dikirim
        atau disimpan di server kami — kecuali pemindaian struk pada poin 1.2 di
        atas.
      </p>
      <p>Menghapus aplikasi akan menghapus seluruh data Saku dari perangkat Anda.</p>

      <h2>3. Izin yang Digunakan</h2>
      <ul>
        <li>
          <strong>Akses Notifikasi:</strong> untuk membaca notifikasi transaksi
          dari aplikasi bank dan dompet digital yang Anda pilih. Akses dapat
          Anda cabut kapan saja dari pengaturan perangkat atau aplikasi.
        </li>
        <li>
          <strong>Kamera:</strong> untuk memotret struk saat Anda menggunakan
          fitur pemindaian struk.
        </li>
      </ul>

      <h2>4. Layanan Pihak Ketiga</h2>
      <p>
        Kami tidak menggunakan iklan, pelacak, analitik, atau SDK pihak ketiga.
        Satu-satunya komunikasi jaringan adalah pengunggahan foto struk ke
        server OCR kami saat fitur pemindaian struk digunakan, sebagaimana
        dijelaskan pada poin 1.2.
      </p>

      <h2>5. Keamanan</h2>
      <p>
        Karena data transaksi disimpan di perangkat Anda, keamanannya mengikuti
        keamanan perangkat Anda (misalnya kunci layar atau biometrik). Komunikasi
        dengan server OCR menggunakan koneksi terenkripsi (HTTPS).
      </p>

      <h2>6. Anak-anak</h2>
      <p>
        Saku tidak ditujukan untuk anak-anak di bawah 13 tahun, dan kami tidak
        secara sengaja mengumpulkan data dari anak-anak.
      </p>

      <h2>7. Perubahan Kebijakan Ini</h2>
      <p>
        Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan
        yang bersifat penting akan kami umumkan melalui pembaruan aplikasi.
        Tanggal "Terakhir diperbarui" di bagian atas dokumen menandakan versi
        kebijakan yang berlaku.
      </p>

      <h2>8. Hubungi Kami</h2>
      <p>
        Jika Anda memiliki pertanyaan atau keberatan tentang kebijakan privasi
        ini, hubungi kami di:
      </p>
      <p>
        <a href="mailto:alfauzansepta@gmail.com">alfauzansepta@gmail.com</a>
      </p>

      <div class="note">
        Dengan menggunakan Saku, Anda menyatakan telah membaca dan memahami
        kebijakan privasi ini.
      </div>
    </section>

    <section v-show="lang === 'en'" lang="en">
      <p>
        Saku ("we") respects your privacy. This document explains what data Saku
        processes, how we use it, and the choices you have. Saku is designed so
        your financial data stays <strong>on your device</strong>.
      </p>

      <h2>1. Data We Process</h2>

      <h3>1.1 Banking and e-wallet notifications</h3>
      <p>
        With your permission, Saku reads payment notifications from banking and
        e-wallet apps (for example BCA, GoPay, OVO, and DANA) to turn them into
        transaction records. Notification content is processed
        <strong>directly on your device</strong>, and only transaction information
        (amount, merchant, transaction type) is stored as a record.
      </p>

      <h3>1.2 Receipt photos</h3>
      <p>
        When you scan a receipt with the camera, the receipt photo is sent to
        our server at <code>saku-api.septaalfauzan.my.id</code> solely to read
        the transaction amount (OCR). The photo is used only for scanning, is
        not shared with any third party, and is not stored on our servers.
      </p>

      <h3>1.3 Data you enter yourself</h3>
      <p>
        Manual transaction records, transfers, category assignments, and other
        adjustments are stored on your device. If you export or import CSV files,
        those files are processed only when and as you request.
      </p>

      <h2>2. How Data Is Stored</h2>
      <p>
        All of your transaction records are stored locally on your device. There
        is no account system, so no transaction data is sent to or stored on our
        servers — except for receipt scanning described in section 1.2 above.
      </p>
      <p>Uninstalling the app deletes all Saku data from your device.</p>

      <h2>3. Permissions Used</h2>
      <ul>
        <li>
          <strong>Notification Access:</strong> to read transaction notifications
          from the banking and e-wallet apps you choose. You can revoke access at
          any time from your device or app settings.
        </li>
        <li>
          <strong>Camera:</strong> to take a photo of a receipt when using the
          receipt scanning feature.
        </li>
      </ul>

      <h2>4. Third-Party Services</h2>
      <p>
        We do not use advertising, trackers, analytics, or third-party SDKs. The
        only network communication is the upload of a receipt photo to our OCR
        server when the receipt scanning feature is used, as described in
        section 1.2.
      </p>

      <h2>5. Security</h2>
      <p>
        Because your transaction data is stored on your device, its security
        follows the security of your device (for example screen lock or
        biometrics). Communication with the OCR server uses an encrypted
        connection (HTTPS).
      </p>

      <h2>6. Children</h2>
      <p>
        Saku is not intended for children under 13, and we do not knowingly
        collect data from children.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. Material changes
        will be announced through app updates. The "Last updated" date at the
        top of this document marks the version currently in effect.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have questions or concerns about this privacy policy, contact us
        at:
      </p>
      <p>
        <a href="mailto:alfauzansepta@gmail.com">alfauzansepta@gmail.com</a>
      </p>

      <div class="note">
        By using Saku, you acknowledge that you have read and understood this
        privacy policy.
      </div>
    </section>

    <footer>© 2026 Septa Alfauzan. Saku.</footer>
  </main>
</template>

<style scoped>
.doc-wrap {
  width: 760px;
  max-width: 100%;
  background: var(--bg-editor);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 48px 56px 40px;
  margin: 0 auto;
  max-height: calc(100vh - 56px);
  overflow-y: auto;
}

.lang-switch {
  display: inline-flex;
  gap: 6px;
  margin-bottom: 32px;
}

.lang-switch button {
  font: inherit;
  font-size: 13px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.lang-switch button:hover {
  border-color: var(--text-dim);
  color: var(--text-bright);
}

.lang-switch button[aria-current='true'] {
  background: var(--blue);
  border-color: var(--blue);
  color: var(--btn-primary-text);
}

header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 24px;
  margin-bottom: 36px;
}

.kicker {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 8px;
}

h1 {
  font-size: 30px;
  line-height: 1.2;
  margin: 0;
  color: var(--text-bright);
  font-weight: 700;
}

.sub {
  color: var(--text-muted);
  font-size: 14px;
  margin: 12px 0 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-muted);
}

section {
  line-height: 1.7;
  font-size: 14px;
}

section p {
  margin: 0 0 14px;
}

h2 {
  font-size: 19px;
  color: var(--text-bright);
  margin: 40px 0 12px;
  letter-spacing: -0.01em;
}

h3 {
  font-size: 15px;
  margin: 26px 0 8px;
  color: var(--text-bright);
}

ul {
  margin: 0 0 14px;
  padding-left: 20px;
}

li {
  margin-bottom: 6px;
}

strong {
  font-weight: 600;
  color: var(--text-bright);
}

a {
  color: var(--blue);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

code {
  font-family: var(--font);
  font-size: 13px;
  background: var(--bg-hover);
  border: 1px solid var(--border-soft);
  border-radius: 4px;
  padding: 1px 5px;
  color: var(--blue);
}

.note {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  margin: 24px 0 0;
  font-size: 14px;
  color: var(--text-muted);
}

footer {
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 13px;
}

@media (max-width: 640px) {
  .doc-wrap {
    padding: 32px 20px;
  }
}
</style>