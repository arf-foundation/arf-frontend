import type { ComponentType, ReactNode } from "react";

interface TierLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function TierBody({
  name,
  meta,
  price,
  items,
  cta,
  dominant,
  renderLink: LinkTag = "a",
}: {
  name: string;
  meta: string;
  price: string;
  items: readonly string[];
  cta: { label: string; href: string };
  dominant: boolean;
  /** Defaults to a plain <a>. Pass next/link's Link to get client-side navigation. */
  renderLink?: ComponentType<TierLinkProps> | "a";
}) {
  return (
    <>
      <p
        className={`mb-1.5 font-semibold tracking-[-0.018em] ${dominant ? "text-[21px]" : "text-[19px]"}`}
      >
        {name}
      </p>
      <p
        className={`mb-5.5 font-mono text-[13px] ${dominant ? "text-arf-blue" : "text-[color:var(--text-muted)]"}`}
      >
        {meta}
      </p>
      <p
        className={`mb-6 font-semibold leading-none tracking-[-0.027em] ${dominant ? "text-[32px]" : "text-[30px]"}`}
      >
        {price}
      </p>
      <ul className="mb-6 flex flex-col gap-2.5 border-t border-[color:var(--hairline)] pt-5.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-[14.5px] leading-[1.5] text-[color:var(--text-secondary)]"
          >
            {item}
          </li>
        ))}
      </ul>
      {dominant ? (
        <LinkTag
          href={cta.href}
          className="block rounded-[9px] bg-gradient-to-br from-arf-blue to-arf-purple py-3 text-center text-[14.5px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
        >
          {cta.label}
        </LinkTag>
      ) : (
        <LinkTag
          href={cta.href}
          className="block rounded-[9px] border border-[color:var(--hairline)] py-2.5 text-center text-[14.5px] font-semibold transition hover:border-arf-blue hover:text-arf-blue active:scale-[0.98]"
        >
          {cta.label}
        </LinkTag>
      )}
    </>
  );
}
