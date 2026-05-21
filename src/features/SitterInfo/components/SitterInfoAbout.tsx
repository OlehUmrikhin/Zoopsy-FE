type Props = {
  description: string;
};

export function SitterInfoAbout({ description }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-lg mb-3">Про мене:</h2>
      <p className="font-inter text-zoopsy-gray text-sm leading-relaxed">{description}</p>
    </div>
  );
}
