type LinkItem = { label: string; href: string };

type Props = {
  title: string;
  links: LinkItem[];
};

export function ExternalLinksList({ title, links }: Props) {
  return (
    <section className="not-prose mt-10 rounded-xl border border-border bg-muted/30 p-5">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
