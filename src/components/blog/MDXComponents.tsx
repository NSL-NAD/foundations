import Image from "next/image";
import Link from "next/link";

function MdxLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) return <span {...props}>{children}</span>;

  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

function MdxImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt || ""}
      width={800}
      height={450}
      className="rounded-img"
    />
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 border-l-4 border-primary pl-4 text-muted-foreground italic">
      {children}
    </div>
  );
}

function CourseLink({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="https://foacourse.com/#pricing"
      className="inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
    >
      {children}
    </Link>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mdxComponents: Record<string, any> = {
  a: MdxLink,
  img: MdxImage,
  Callout,
  CourseLink,
};
