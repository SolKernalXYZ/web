import Link from "next/link";
import Button from "@/components/Button";
import { NotFoundArt } from "@/components/graphics/StatusArt";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <NotFoundArt />
        <p className="mt-6 font-mono text-tiny uppercase tracking-[0.18em] text-text-tertiary">Error 404</p>
        <h1 className="mt-2 text-h2">This route doesn&apos;t resolve</h1>
        <p className="mt-2 text-body text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-7">
          <Link href="/">
            <Button variant="accent" trailingIcon={<ArrowRight size={16} />}>Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
