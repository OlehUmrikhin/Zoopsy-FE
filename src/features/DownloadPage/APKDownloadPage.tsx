export function APKDownloadPage() {
  const apkUrl = 'zoopsy.apk';

  return (
    <div className="min-h-screen bg-zoopsy-mint flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl p-8 text-center shadow">
        <h1 className="text-2xl font-bold mb-2">Завантажити застосунок</h1>
        <p className="text-sm text-gray-600 mb-6">
          Встановіть мобільний додаток для Android для доступу к чату. Натисніть кнопку нижче, щоб
          завантажити APK-файл.
        </p>

        <a
          href={apkUrl}
          download
          className="mt-6 inline-block bg-[#2C694E] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-95 transition"
        >
          Завантажити для Android
        </a>

        
      </div>
    </div>
  );
}

export default APKDownloadPage;
