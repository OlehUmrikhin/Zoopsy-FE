import { createFileRoute } from '@tanstack/react-router';
import APKDownloadPage from '../features/DownloadPage/APKDownloadPage';

export const Route = createFileRoute('/download-apk')({
  component: APKDownloadPage,
});
