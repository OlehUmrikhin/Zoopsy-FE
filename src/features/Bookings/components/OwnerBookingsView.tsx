import { useMyBookingsAsOwner, useCancelBookingByOwner } from '@api/booking';
import { toast } from 'react-toastify';
import { BookingsList } from './BookingsList';

export function OwnerBookingsView() {
  const { data, isLoading, isError } = useMyBookingsAsOwner();
  const {
    mutate: cancelByOwner,
    isPending: isCancelling,
    variables: cancelVars,
  } = useCancelBookingByOwner({
    onSuccess: () => toast.success('Бронювання успішно скасовано.'),
    onError: () => toast.error('Не вдалося скасувати бронювання. Спробуйте ще раз.'),
  });

  const loadingId = isCancelling ? cancelVars?.id : undefined;

  return (
    <BookingsList
      bookings={data}
      isLoading={isLoading}
      isError={isError}
      mode="owner"
      onCancelByOwner={(id, comment) => cancelByOwner({ id, ownerComment: comment })}
      loadingId={loadingId}
    />
  );
}
