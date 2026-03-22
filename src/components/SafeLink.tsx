/**
 * SafeLink: only renders an <a> tag if the href uses http/https or starts with /.
 * Prevents javascript: protocol XSS from database-stored URLs.
 */
export default function SafeLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  try {
    const url = new URL(href, "https://placeholder.com");
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return <>{children}</>;
    }
  } catch {
    if (!href.startsWith("/")) {
      return <>{children}</>;
    }
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
