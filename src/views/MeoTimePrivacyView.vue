<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'

const lang = ref<'id' | 'en'>('id')

function select(next: 'id' | 'en') {
  lang.value = next
}

watchEffect(() => {
  document.documentElement.lang = lang.value
  document.title =
    lang.value === 'id' ? 'Kebijakan Privasi — Meotime' : 'Privacy Policy — Meotime'
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
      <h1>Meotime</h1>
      <p class="sub">Aplikasi pemantau waktu layar dan pembatas penggunaan aplikasi</p>
      <div class="meta">
        <span>Terakhir diperbarui: 17 November 2026</span>
        <span>Pengembang: Septa Alfauzan</span>
      </div>
    </header>

    <section v-show="lang === 'id'" lang="id">
      <p>
        Meotime ("kami") menghormati privasi Anda. Dokumen ini menjelaskan data
        apa saja yang diproses Meotime, cara kami menggunakannya, dan pilihan
        yang Anda miliki. Meotime dirancang agar data penggunaan Anda tetap
        <strong>tersimpan di perangkat Anda</strong>.
      </p>

      <h2>1. Data yang Kami Proses</h2>

      <h3>1.1 Penggunaan aplikasi</h3>
      <p>
        Dengan izin Akses Penggunaan, Meotime mendeteksi aplikasi yang sedang
        berjalan di layar (foreground) dan mengukur durasi pemakaiannya, hanya
        untuk aplikasi yang <strong>Anda pilih sendiri</strong> untuk dipantau.
        Durasi penggunaan harian setiap aplikasi tersebut dicatat untuk
        menampilkan dasbor dan menerapkan batas harian Anda.
      </p>

      <h3>1.2 Daftar aplikasi terpasang</h3>
      <p>
        Saat Anda menambahkan aplikasi, Meotime membaca daftar aplikasi yang
        terpasang di perangkat (nama, ikon, dan nama paket) agar Anda dapat
        memilih aplikasi yang ingin dipantau. Daftar ini hanya diproses di
        perangkat Anda dan tidak dikirim ke mana pun.
      </p>

      <h3>1.3 Pengaturan yang Anda buat sendiri</h3>
      <p>
        Daftar aplikasi yang dipantau, batas harian, dan status aktif/nonaktif
        pemantauan setiap aplikasi disimpan di perangkat Anda.
      </p>

      <h2>2. Cara Data Disimpan</h2>
      <p>
        Seluruh data Meotime (aplikasi yang dipantau, durasi penggunaan harian,
        dan status sinkronisasi internal) disimpan secara lokal pada basis data
        di perangkat Anda. Kami tidak memiliki sistem akun, sehingga tidak ada
        data penggunaan Anda yang dikirim atau disimpan di server kami.
      </p>
      <p>
        Durasi penggunaan dicatat saat sesi pemakaian aplikasi yang dipantau
        berakhir. Menghapus aplikasi akan menghapus seluruh data Meotime dari
        perangkat Anda.
      </p>

      <h2>3. Izin yang Digunakan</h2>
      <ul>
        <li>
          <strong>Akses Penggunaan (Usage Access):</strong> untuk mengetahui
          aplikasi yang sedang digunakan dan menghitung durasinya. Akses dapat
          Anda cabut kapan saja dari pengaturan perangkat.
        </li>
        <li>
          <strong>Tampil di atas aplikasi lain (Overlay):</strong> untuk
          menampilkan layar pengingat saat batas harian suatu aplikasi
          tercapai.
        </li>
        <li>
          <strong>Notifikasi:</strong> untuk menampilkan notifikasi layanan
          pemantauan yang berjalan dan pemberitahuan terkait batas penggunaan
          (diminta saat aplikasi berjalan pada Android 13 ke atas).
        </li>
        <li>
          <strong>Layanan latar depan (Foreground Service):</strong> agar
          pemantauan dapat berjalan terus-menerus selama aplikasi dipantau.
        </li>
        <li>
          <strong>Jalankan saat perangkat menyala (Boot Completed):</strong>
          untuk melanjutkan pemantauan setelah perangkat dihidupkan ulang.
        </li>
        <li>
          <strong>Melihat semua aplikasi terpasang:</strong> untuk menampilkan
          daftar aplikasi yang dapat Anda pilih untuk dipantau.
        </li>
      </ul>

      <h2>4. Layanan Pihak Ketiga</h2>
      <p>
        Kami tidak menggunakan iklan, pelacak, analitik, atau SDK pihak ketiga
        untuk mengumpulkan data penggunaan Anda, dan kami tidak membagikan data
        Anda kepada pihak mana pun.
      </p>

      <h2>5. Keamanan</h2>
      <p>
        Karena data disimpan di perangkat Anda, keamanannya mengikuti keamanan
        perangkat Anda (misalnya kunci layar atau biometrik). Meotime tidak
        mengirimkan data penggunaan Anda melalui jaringan.
      </p>

      <h2>6. Anak-anak</h2>
      <p>
        Meotime tidak ditujukan untuk anak-anak di bawah 13 tahun, dan kami
        tidak secara sengaja mengumpulkan data dari anak-anak.
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
        Dengan menggunakan Meotime, Anda menyatakan telah membaca dan memahami
        kebijakan privasi ini.
      </div>
    </section>

    <section v-show="lang === 'en'" lang="en">
      <p>
        Meotime ("we") respects your privacy. This document explains what data
        Meotime processes, how we use it, and the choices you have. Meotime is
        designed so your usage data stays <strong>on your device</strong>.
      </p>

      <h2>1. Data We Process</h2>

      <h3>1.1 App usage</h3>
      <p>
        With the Usage Access permission, Meotime detects which app is currently
        in the foreground and measures how long it is used, only for the apps
        <strong>you choose</strong> to monitor. The daily usage of each of those
        apps is recorded to show your dashboard and enforce your daily limits.
      </p>

      <h3>1.2 List of installed apps</h3>
      <p>
        When you add an app, Meotime reads the list of apps installed on your
        device (name, icon, and package name) so you can pick which ones to
        monitor. This list is processed only on your device and is not sent
        anywhere.
      </p>

      <h3>1.3 Settings you create</h3>
      <p>
        Your list of monitored apps, daily limits, and each app's monitoring
        on/off status are stored on your device.
      </p>

      <h2>2. How Data Is Stored</h2>
      <p>
        All Meotime data (monitored apps, daily usage durations, and internal
        sync state) is stored locally in a database on your device. There is no
        account system, so none of your usage data is sent to or stored on our
        servers.
      </p>
      <p>
        Usage time is recorded when a monitored app session ends. Uninstalling
        the app deletes all Meotime data from your device.
      </p>

      <h2>3. Permissions Used</h2>
      <ul>
        <li>
          <strong>Usage Access:</strong> to know which app is in use and to
          calculate its duration. You can revoke access at any time from your
          device settings.
        </li>
        <li>
          <strong>Display over other apps (Overlay):</strong> to show a reminder
          screen when an app's daily limit is reached.
        </li>
        <li>
          <strong>Notifications:</strong> to show the running monitoring
          service notification and limit-related alerts (requested at runtime
          on Android 13 and above).
        </li>
        <li>
          <strong>Foreground service:</strong> so monitoring can run
          continuously while apps are being monitored.
        </li>
        <li>
          <strong>Run at startup (Boot Completed):</strong> to resume monitoring
          after your device restarts.
        </li>
        <li>
          <strong>See all installed apps:</strong> to show the list of apps you
          can choose to monitor.
        </li>
      </ul>

      <h2>4. Third-Party Services</h2>
      <p>
        We do not use advertising, trackers, analytics, or third-party SDKs to
        collect your usage data, and we do not share your data with anyone.
      </p>

      <h2>5. Security</h2>
      <p>
        Because your data is stored on your device, its security follows the
        security of your device (for example screen lock or biometrics). Meotime
        does not transmit your usage data over the network.
      </p>

      <h2>6. Children</h2>
      <p>
        Meotime is not intended for children under 13, and we do not knowingly
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
        By using Meotime, you acknowledge that you have read and understood this
        privacy policy.
      </div>
    </section>

    <footer>© 2026 Septa Alfauzan. Meotime.</footer>
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
