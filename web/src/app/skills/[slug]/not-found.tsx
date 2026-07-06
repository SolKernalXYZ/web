import Link from "next/link";
import Button from "@/components/Button";
import { NotFoundArt } from "@/components/graphics/StatusArt";
import { SearchIcon } from "@/components/icons";

export default function SkillNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <NotFoundArt />
        <p className="mt-6 font-mono text-tiny uppercase tracking-[0.18em] text-text-tertiary">Skill not found</p>
        <h1 className="mt-2 text-h2">Not in the registry</h1>
        <p className="mt-2 text-body text-text-secondary">
          This skill doesn&apos;t exist or has been removed from the registry.
        </p>
        <div className="mt-7">
          <Link href="/skills">
            <Button variant="accent" leadingIcon={<SearchIcon size={16} />}>Browse skills</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
