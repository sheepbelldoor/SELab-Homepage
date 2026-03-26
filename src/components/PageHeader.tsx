export default function PageHeader({
  title,
  subtitle,
  overline,
}: {
  title: string;
  subtitle?: string;
  overline?: string;
}) {
  return (
    <header className="max-w-7xl mx-auto px-8 pt-32 pb-12 mb-12">
      <div className="border-b border-outline-variant pb-12">
        {overline && (
          <span className="font-headline text-tertiary-container font-bold tracking-widest uppercase text-xs mb-4 block">
            {overline}
          </span>
        )}
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary tracking-tighter leading-tight mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body-text text-xl text-on-surface-variant leading-relaxed italic">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
