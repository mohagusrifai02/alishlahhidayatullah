import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Image
                src="/logo.jpeg"
                alt="Yayasan Al-Ishlah Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-bold text-xl tracking-tight">Yayasan Al-Ishlah</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center font-medium">
              <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors">
                Beranda
              </Link>
              <Link href="/program" className="text-gray-600 hover:text-red-600 transition-colors">
                Program
              </Link>
              <Link href="/kegiatan" className="text-gray-600 hover:text-red-600 transition-colors">
                Kegiatan
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-red-600 transition-colors">
                Tentang Kami
              </Link>
              <Link
                href="/program"
                className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all shadow-md"
              >
                Donasi Sekarang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden isolate">
        <Image
          src="https://plus.unsplash.com/premium_photo-1686920245950-58617c8a602e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpbGRyZW58ZW58MHx8MHx8fDA%3D"
          alt="Hero Background"
          fill
          priority
          className="object-cover -z-10 opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              Membangun Harapan, <span className="text-red-600">Mengubah Masa Depan.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Setiap donasi yang Anda berikan adalah langkah nyata untuk membantu pendidikan, kesehatan, dan kesejahteraan mereka yang membutuhkan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/program"
                className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl hover:shadow-red-200"
              >
                Mulai Berdonasi
              </Link>
              <button className="px-8 py-4 bg-white border border-gray-200 text-gray-700 text-lg font-bold rounded-2xl hover:bg-gray-50 transition-all">
                Lihat Program Kami
              </button>
            </div>
          </div>
        </div>
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-50/50 rounded-full blur-3xl -z-0 pointer-events-none"></div>
      </header>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Tentang Kami</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">Sejarah Pendirian</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yayasan Kita didirikan pada tahun 2010 berawal dari kepedulian sekelompok pemuda terhadap kondisi pendidikan anak-anak di pinggiran kota. Seiring berjalannya waktu, yayasan ini tumbuh menjadi lembaga sosial yang berfokus pada pemberdayaan masyarakat secara menyeluruh.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-2">Visi</h3>
                    <p className="text-gray-600 italic">"Menjadi lembaga filantropi terdepan yang amanah dan profesional dalam mewujudkan kesejahteraan umat."</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-2">Misi</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Pendidikan yatim & dhuafa</li>
                      <li>Bantuan sosial tepat sasaran</li>
                      <li>Dakwah Islam moderat</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] flex items-center justify-center group">
              <div className="absolute inset-0 bg-red-50 rounded-[3rem] -z-0"></div>
              <Image
                src="/piknik.jpg"
                alt="Tentang Al-Ishlah"
                width={260}
                height={320}
                className="absolute z-10 transform -translate-x-12 -translate-y-8 -rotate-6 rounded-2xl shadow-xl transition-all duration-500 object-cover w-60 h-80 border-8 border-white group-hover:-translate-y-12 group-hover:-rotate-12"
              />
              <Image
                src="/mbakmbak.jpg"
                alt="Tentang Al-Ishlah"
                width={260}
                height={320}
                className="absolute z-20 transform translate-x-12 translate-y-8 rotate-6 rounded-2xl shadow-2xl transition-all duration-500 object-cover w-60 h-80 border-8 border-white group-hover:translate-y-12 group-hover:rotate-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Programs Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Program Utama</h2>
            <p className="text-gray-600">Fokus kami dalam menciptakan perubahan nyata di tengah masyarakat.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Pendidikan", desc: "Beasiswa anak yatim, renovasi sarana belajar, dan pengadaan alat peraga pendidikan untuk masa depan cerah.", icon: "📚" },
              { title: "Sosial", desc: "Bantuan logistik bencana alam, santunan sembako rutin, dan program pemberdayaan ekonomi umat.", icon: "🤝" },
              { title: "Dakwah", desc: "Pembangunan masjid, pembinaan mualaf, dan penyebaran nilai-nilai kebaikan melalui kajian dan literasi.", icon: "🌙" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-24 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Hubungi Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50">
              <div className="text-3xl mb-4">📍</div>
              <h4 className="font-bold mb-2">Kantor Pusat</h4>
              <p className="text-gray-600">Jl. Jali timur, Dampyak Kab. Tegal, Indonesia</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50">
              <div className="text-3xl mb-4">📧</div>
              <h4 className="font-bold mb-2">Email</h4>
              <p className="text-gray-600">info@yayasankita.org<br/>donasi@yayasankita.org</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50">
              <div className="text-3xl mb-4">📞</div>
              <h4 className="font-bold mb-2">Telepon / WA</h4>
              <p className="text-gray-600">+62 895-1658-9293<br/>(021) 1234567</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-600 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Menjadi Pahlawan bagi Mereka?</h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Mari bergabung dengan ribuan donatur lainnya untuk menciptakan dampak sosial yang berkelanjutan.
            </p>
            <Link
              href="/program"
              className="inline-block px-10 py-4 bg-white text-red-600 text-lg font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-lg"
            >
              Kirim Donasi Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Yayasan Al-Ishlah. Transparansi & Amanah.</p>
        </div>
      </footer>
    </div>
  );
}
