import type { BookingContact } from '@api/booking';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';

type Props = {
  contact: BookingContact;
  label: string;
  showDetails: boolean;
};

export function BookingContactInfo({ contact, label, showDetails }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-inter text-xs font-semibold text-zoopsy-gray uppercase tracking-wide">
        {label}
      </span>
      <span className="font-inter font-semibold text-sm text-zoopsy-dark-gray">
        {contact.fullName}
      </span>

      {showDetails && (
        <>
          <div className="flex flex-col gap-1 mt-0.5">
            {contact.phoneNumber && (
              <a
                href={`tel:${contact.phoneNumber}`}
                className="flex items-center gap-1.5 font-inter text-xs text-zoopsy-green-900 hover:underline"
              >
                <MdPhone className="shrink-0" size={13} />
                {contact.phoneNumber}
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 font-inter text-xs text-zoopsy-green-900 hover:underline"
              >
                <MdEmail className="shrink-0" size={13} />
                {contact.email}
              </a>
            )}
            {contact.address && (
              <span className="flex items-start gap-1.5 font-inter text-xs text-zoopsy-gray">
                <MdLocationOn className="shrink-0 mt-px" size={13} />
                {contact.address}
              </span>
            )}
          </div>
          <p className="font-inter text-xs text-zoopsy-gray/70 italic mt-1">
            {
              "Для зручного спілкування завантажте мобільний застосунок Zoopsy або зв'яжіться напряму за телефоном."
            }
          </p>
        </>
      )}
    </div>
  );
}
