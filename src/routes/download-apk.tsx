import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/download-apk')({
  component: function DownloadApkPage() {
    return (
      <div className="p-8 text-center text-zoopsy-dark-gray">
        Сторінка завантаження APK (в розробці)
      </div>
    );
  },
});
