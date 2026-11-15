---
slug: "crypto-locked-desk-drawer"
title: "Locked Desk Drawer"
competition: "FGTE"
category: "Crypto"
difficulty: "Medium"
date: "2026-03-24"
updated: "2026-11-15"
summary: "🔚 Kesimpulan: Challenge ini menggabungkan Forensik (metadata & steganografi) Encoding (Base64) Kriptografi (AES + MD5)"
tags: ["MISC","MEDIUM","AES"]
status: "published"
flag: "FGTE{MISC_MASTERED}"
attachments: [{"url":"https://dfbro.my.id/assets/uploads/27129158-bbdf-4108-9ed0-ac2e7c8b4e40-pkwu-1-.pdf","name":"27129158-bbdf-4108-9ed0-ac2e7c8b4e40-pkwu-1-.pdf","contentType":"application/pdf"}]
source: "https://claritys.web.id/writeups/crypto-locked-desk-drawer"
---

<p>Locked Desk Drawer</p><blockquote><p>🔚 Kesimpulan: Challenge ini menggabungkan Forensik (metadata &amp; steganografi) Encoding (Base64) Kriptografi (AES + MD5)</p></blockquote><h2>🧩 Write-up CTF: <em>Locked Desk Drawer</em> (MISC)</h2><p>(half slop)</p><h2>📌 Deskripsi Singkat</h2><p>Pada challenge ini, diberikan tiga file:</p><ul><li><p><code>desk.png</code></p></li><li><p><code>note.txt</code></p></li><li><p><code>drawer.enc</code></p></li></ul><p>Tujuan dari challenge ini adalah menemukan flag yang tersembunyi melalui beberapa lapisan teknik <strong>forensik, encoding, dan kriptografi</strong>.</p><hr><h2>🖼️ Tahap 1 — Analisis <code>desk.png</code></h2><h3>🔎 Cek metadata</h3><pre><code class="language-bash">~/FGTE/MISC/lockeddeskdrawer
❯ exiftool desk.png
ExifTool Version Number         : 13.50
File Name                       : desk.png
Directory                       : .
File Size                       : 767 bytes
File Modification Date/Time     : 2026:03:03 16:45:00+07:00
File Access Date/Time           : 2026:03:03 16:44:59+07:00
File Inode Change Date/Time     : 2026:03:03 16:45:00+07:00
File Permissions                : -rw-r--r--
File Type                       : PNG
File Type Extension             : png
MIME Type                       : image/png
Image Width                     : 320
Image Height                    : 200
Bit Depth                       : 8
Color Type                      : RGB
Compression                     : Deflate/Inflate
Filter                          : Adaptive
Interlace                       : Noninterlaced
User Comment                    : note2.txt
Description                     : A photo of a wooden desk. (Check UserComment)
Image Size                      : 320x200
Megapixels                      : 0.064
</code></pre><p>Hasil penting:</p><pre><code>User Comment : note2.txt
Description  : A photo of a wooden desk. (Check UserComment)
</code></pre><p>👉 Ini memberikan clue:</p><blockquote><p>Ada sesuatu yang berkaitan dengan <strong>note2.txt</strong></p></blockquote><hr><h3>🔬 Cek struktur file</h3><pre><code class="language-bash">~/FGTE/MISC/lockeddeskdrawer
❯ xxd desk.png
00000000: 8950 4e47 0d0a 1a0a 0000 000d 4948 4452  .PNG........IHDR
00000010: 0000 0140 0000 00c8 0802 0000 0016 66af  ...@..........f.
00000020: fc00 0000 1574 4558 7455 7365 7243 6f6d  .....tEXtUserCom
00000030: 6d65 6e74 006e 6f74 6532 2e74 7874 f2c2  ment.note2.txt..
00000040: f95c 0000 0039 7445 5874 4465 7363 7269  .\...9tEXtDescri
00000050: 7074 696f 6e00 4120 7068 6f74 6f20 6f66  ption.A photo of
00000060: 2061 2077 6f6f 6465 6e20 6465 736b 2e20   a wooden desk.
00000070: 2843 6865 636b 2055 7365 7243 6f6d 6d65  (Check UserComme
00000080: 6e74 2919 d99f 5b00 0002 6049 4441 5478  nt)...[...`IDATx
00000090: 9ced d331 0d00 2000 c030 c0bf 3094 a003  ...1.. ..0..0...
000000a0: 0f3c 6449 ab60 cfe6 de67 004d eb77 00f0  .&lt;dI.`...g.M.w..
000000b0: cec0 1066 6008 3330 8419 18c2 0c0c 6106  ...f`.30......a.
000000c0: 8630 0343 9881 21cc c010 6660 0833 3084  .0.C..!...f`.30.
000000d0: 1918 c20c 0c61 0686 3003 4398 8121 ccc0  .....a..0.C..!..
000000e0: 1066 6008 3330 8419 18c2 0c0c 6106 8630  .f`.30......a..0
000000f0: 0343 9881 21cc c010 6660 0833 3084 1918  .C..!...f`.30...
00000100: c20c 0c61 0686 3003 4398 8121 ccc0 1066  ...a..0.C..!...f
00000110: 6008 3330 8419 18c2 0c0c 6106 8630 0343  `.30......a..0.C
00000120: 9881 21cc c010 6660 0833 3084 1918 c20c  ..!...f`.30.....
00000130: 0c61 0686 3003 4398 8121 ccc0 1066 6008  .a..0.C..!...f`.
00000140: 3330 8419 18c2 0c0c 6106 8630 0343 9881  30......a..0.C..
00000150: 21cc c010 6660 0833 3084 1918 c20c 0c61  !...f`.30......a
00000160: 0686 3003 4398 8121 ccc0 1066 6008 3330  ..0.C..!...f`.30
00000170: 8419 18c2 0c0c 6106 8630 0343 9881 21cc  ......a..0.C..!.
00000180: c010 6660 0833 3084 1918 c20c 0c61 0686  ..f`.30......a..
00000190: 3003 4398 8121 ccc0 1066 6008 3330 8419  0.C..!...f`.30..
000001a0: 18c2 0c0c 6106 8630 0343 9881 21cc c010  ....a..0.C..!...
000001b0: 6660 0833 3084 1918 c20c 0c61 0686 3003  f`.30......a..0.
000001c0: 4398 8121 ccc0 1066 6008 3330 8419 18c2  C..!...f`.30....
000001d0: 0c0c 6106 8630 0343 9881 21cc c010 6660  ..a..0.C..!...f`
000001e0: 0833 3084 1918 c20c 0c61 0686 3003 4398  .30......a..0.C.
000001f0: 8121 ccc0 1066 6008 3330 8419 18c2 0c0c  .!...f`.30......
00000200: 6106 8630 0343 9881 21cc c010 6660 0833  a..0.C..!...f`.3
00000210: 3084 1918 c20c 0c61 0686 3003 4398 8121  0......a..0.C..!
00000220: ccc0 1066 6008 3330 8419 18c2 0c0c 6106  ...f`.30......a.
00000230: 8630 0343 9881 21cc c010 6660 0833 3084  .0.C..!...f`.30.
00000240: 1918 c20c 0c61 0686 3003 4398 8121 ccc0  .....a..0.C..!..
00000250: 1066 6008 3330 8419 18c2 0c0c 6106 8630  .f`.30......a..0
00000260: 0343 9881 21cc c010 6660 0833 3084 1918  .C..!...f`.30...
00000270: c20c 0c61 0686 3003 4398 8121 ccc0 1066  ...a..0.C..!...f
00000280: 6008 3330 8419 18c2 0c0c 6106 8630 0343  `.30......a..0.C
00000290: 9881 21cc c010 6660 0833 3084 1918 c20c  ..!...f`.30.....
000002a0: 0c61 0686 3003 4398 8121 ccc0 1066 6008  .a..0.C..!...f`.
000002b0: 3330 8419 18c2 0c0c 6106 8630 0343 9881  30......a..0.C..
000002c0: 21cc c010 6660 0833 3084 1918 c20c 0c61  !...f`.30......a
000002d0: 0686 3003 4398 8121 ccc0 1066 6008 3330  ..0.C..!...f`.30
000002e0: 8419 18c2 0c0c 6106 86b0 0ba4 f904 06a4  ......a.........
000002f0: 27d6 b900 0000 0049 454e 44ae 4260 82    '......IEND.B`.
</code></pre><p>Terlihat adanya chunk:</p><pre><code>tEXtUserComment → note2.txt
</code></pre><p>Namun tidak ada file <code>note2.txt</code> secara langsung.</p><hr><h3>🧠 Steganografi (LSB)</h3><p>Menggunakan:</p><pre><code class="language-bash">╭─   ~/FGTE/MISC/lockeddeskdrawer ────────────────────────────────────  kali  07:22:42
╰─❯ zsteg -a desk.png
meta UserComment    .. text: "note2.txt"
meta Description    .. text: "A photo of a wooden desk. (Check UserComment)"
chunk:0:IHDR        .. file: Adobe Photoshop Color swatch, version 0, 320 colors; 1st RGB space (0), w 0xc8, x 0x802, y 0, z 0; 2nd RGB space (0), w 0, x 0, y 0, z 0
b6,b,lsb,xy         .. file: OpenPGP Public Key
b6,bgr,lsb,xy       .. file: OpenPGP Public Key
</code></pre><p>Hasil:</p><pre><code>b6,b,lsb,xy → OpenPGP Public Key
</code></pre><hr><h3>⚠️ Insight</h3><p>Data LSB menghasilkan sesuatu yang terlihat seperti <strong>OpenPGP key</strong>, namun:</p><ul><li><p>Tidak bisa di-import dengan GPG</p></li><li><p>Format tidak valid</p></li></ul><p>👉 Ini adalah <strong>decoy / jebakan</strong>, bukan solusi utama.</p><hr><h2>📄 Tahap 3 — Analisis <code>note.txt</code></h2><pre><code class="language-bash">~/FGTE/MISC/lockeddeskdrawer
❯ cat note.txt
T3BlbiB0aGUgZHJhd2VyIHdpdGggcGFzczogcGFzcy14eXoxMjM0
</code></pre><p>Isi:</p><pre><code>T3BlbiB0aGUgZHJhd2VyIHdpdGggcGFzczogcGFzcy14eXoxMjM0
</code></pre><hr><h3>🔓 Decode Base64</h3><pre><code class="language-bash">~/FGTE/MISC/lockeddeskdrawer
❯ echo T3BlbiB0aGUgZHJhd2VyIHdpdGggcGFzczogcGFzcy14eXoxMjM0 | base64 -d
Open the drawer with pass: pass-xyz1234⏎
</code></pre><p>Hasil:</p><pre><code>Open the drawer with pass: pass-xyz1234
</code></pre><p>👉 Didapatkan:</p><pre><code>Password: pass-xyz1234
</code></pre><hr><h2>🔐 Tahap 4 — Analisis <code>drawer.enc</code></h2><h3>🔎 Identifikasi file</h3><pre><code class="language-bash">
~/FGTE/MISC/lockeddeskdrawer
❯ file drawer.enc
drawer.enc: data
</code></pre><p>Hasil:</p><pre><code>data
</code></pre><hr><h3>❌ Percobaan yang gagal</h3><p>Beberapa metode dicoba namun gagal:</p><ul><li><p>❌ OpenSSL (bad magic number)</p></li><li><p>❌ ZIP / archive</p></li><li><p>❌ XOR</p></li></ul><p>👉 Artinya:</p><blockquote><p>Ini bukan format standar → kemungkinan <strong>raw encryption</strong></p></blockquote><hr><h2>🧠 Tahap 5 — Analisis Kriptografi</h2><h3>📏 Observasi penting</h3><pre><code>.rw-r--r--   64 claritys  3 Mar 16:45  drawer.enc
</code></pre><ul><li><p>Ukuran file: <strong>64 byte</strong></p></li><li><p>AES block size: <strong>16 byte</strong></p></li></ul><p>👉 64 byte = 4 blok AES</p><p>➡️ Indikasi kuat:</p><blockquote><p>Menggunakan <strong>AES</strong></p></blockquote><hr><h3>🔑 Masalah: password ≠ key</h3><p>AES membutuhkan:</p><ul><li><p>16 / 24 / 32 byte key</p></li></ul><p></p><img src="https://dfbro.my.id/assets/uploads/d2643c8b-0f6a-40c3-a44e-645c51247867-best-unemployed-moments-kai-cenat-best-unemployed-moments.png" alt="best-unemployed-moments-kai-cenat-best-unemployed-moments.png"><p>Password:</p><pre><code>pass-xyz1234 (12 byte)
</code></pre><p>👉 Maka:</p><blockquote><p>Password harus diubah menjadi key</p></blockquote><hr><h3>🔬 Coba Hash sebagai Key</h3><h4>❌ SHA256 (tidak berhasil)</h4><h4>✅ MD5 (berhasil sebagian)</h4><pre><code class="language-python">import hashlib
from Crypto.Cipher import AES<p>data = open(&quot;drawer.enc&quot;,&quot;rb&quot;).read()
key = hashlib.md5(b&quot;pass-xyz1234&quot;).digest()</p>
<p>cipher = AES.new(key, AES.MODE_ECB)
print(cipher.decrypt(data))
</code></pre><p>Hasil:</p><pre><code>&gt;&gt;&gt; import hashlib
... from Crypto.Cipher import AES
...
... data = open("drawer.enc","rb").read()
... key = hashlib.md5(b"pass-xyz1234").digest()
...
... cipher = AES.new(key, AES.MODE_ECB)
... print(cipher.decrypt(data))
...
b'The desk hides m\xddN\xf2\xc9b5\x83\xb6;:K\xa17A\xdd~\xdcC"\x90b\x11\x12\xa4:0\xae\xdc\xe7?(\xa8\xb7Xh\x9bg\x84\x8a\xb7s\x8alx\x99\xe8R\x18'</p>
<p>The desk hides m...
</code></pre><p>👉 Sudah mulai terbaca → berarti arah benar</p><hr><h3>🔥 Gunakan Mode CBC</h3><pre><code class="language-python">from Crypto.Cipher import AES
import hashlib</p>
<p>data = open(&quot;drawer.enc&quot;,&quot;rb&quot;).read()</p>
<p>key = hashlib.md5(b&quot;pass-xyz1234&quot;).digest()
iv = b&quot;\x00&quot; * 16</p>
<p>cipher = AES.new(key, AES.MODE_CBC, iv)
out = cipher.decrypt(data)</p>
<p>print(out)
</code></pre><hr><h2>🎉 Hasil Akhir</h2><p>Output:</p><pre><code>&gt;&gt;&gt; from Crypto.Cipher import AES
... import hashlib
...
... data = open("drawer.enc","rb").read()
...
... key = hashlib.md5(b"pass-xyz1234").digest()
... iv = b"\x00" * 16
...
... cipher = AES.new(key, AES.MODE_CBC, iv)
... out = cipher.decrypt(data)
...
... print(out)
...
b'The desk hides more than paper.\nFGTE{MISC_MASTERED}\n\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c\x0c'
&gt;&gt;&gt;</p>
<p>The desk hides more than paper.
FGTE{MISC_MASTERED}
</code></pre><hr><h2>🧠 Insight &amp; Pembelajaran</h2><p>Challenge ini mengajarkan beberapa hal penting:</p><h3>🔍 1. Jangan terjebak decoy</h3><ul><li><p>Data LSB menghasilkan PGP key palsu</p></li><li><p>Tidak semua hasil tool adalah solusi</p></li></ul><hr><h3>🔐 2. Password ≠ Key</h3><ul><li><p>Password sering di-hash (MD5/SHA) sebelum dipakai sebagai key</p></li></ul><hr><h3>🧩 3. Kenali pola file kecil</h3><ul><li><p>64 byte → sangat khas AES block cipher</p></li></ul><hr><h3>⚙️ 4. Trial yang terarah</h3><p>Bukan brute force random, tapi:</p><ul><li><p>eliminasi metode</p></li><li><p>gunakan pola umum CTF</p></li></ul><p></p></p>
