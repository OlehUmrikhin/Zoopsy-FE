import {
  useMyBookingsAsSitter,
  useApproveBooking,
  useCancelBooking,
  useCompleteBooking,
} from '@api/booking';
import { toast } from 'react-toastify';
import { BookingsList } from './BookingsList';

export function SitterBookingsView() {
  const { data, isLoading, isError } = useMyBookingsAsSitter();
  const {
    mutate: approve,
    isPending: isApproving,
    variables: approveVars,
  } = useApproveBooking({
    onSuccess: () => toast.success('Бронювання успішно підтверджено!'),
    onError: () => toast.error('Не вдалося підтвердити бронювання. Спробуйте ще раз.'),
  });
  const {
    mutate: cancel,
    isPending: isCancelling,
    variables: cancelVars,
  } = useCancelBooking({
    onSuccess: () => toast.success('Бронювання скасовано. Кошти повернуто власнику.'),

    onError: () => toast.error('Не вдалося відхилити бронювання. Спробуйте ще раз.'),
  });
  const {
    mutate: complete,
    isPending: isCompleting,
    variables: completeVars,
  } = useCompleteBooking({
    onSuccess: () => toast.success('Бронювання завершено.'),
    onError: () => toast.error('Не вдалося завершити бронювання. Спробуйте ще раз.'),
  });

  const loadingId = isApproving
    ? approveVars?.id
    : isCancelling
      ? cancelVars?.id
      : isCompleting
        ? completeVars?.id
        : undefined;

  return (
    <BookingsList
      bookings={data}
      isLoading={isLoading}
      isError={isError}
      mode="sitter"
      onApprove={(id, comment) => approve({ id, sitterComment: comment })}
      onCancel={(id, comment) => cancel({ id, sitterComment: comment })}
      onComplete={(id, comment) => complete({ id, sitterComment: comment })}
      loadingId={loadingId}
    />
  );
}
