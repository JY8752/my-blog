import { ScrapCreateForm } from "@/components/scraps/ScrapCreateForm";

export default function NewScrapPage() {
  return (
    <section>
      <p className="font-label text-[0.6875rem] tracking-[0.08em] text-tertiary uppercase">
        New scrap
      </p>
      <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-none font-bold tracking-[-0.035em]">
        新しい記録を始める
      </h1>
      <div className="mt-12 rounded-lg border border-outline-variant bg-surface-container p-5 shadow-paper sm:p-8">
        <ScrapCreateForm />
      </div>
    </section>
  );
}
