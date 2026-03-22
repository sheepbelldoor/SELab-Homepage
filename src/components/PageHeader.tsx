export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-lg text-blue-100">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
