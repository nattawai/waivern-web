import type { Job } from "./cv-data";

export function CvExperience({ jobs }: { jobs: Job[] }) {
  return (
    <section>
      <h2 className="border-b border-line pb-2 font-serif text-xl font-semibold text-navy">
        ประสบการณ์ทำงาน
      </h2>

      <div className="mt-6 space-y-6">
        {jobs.map((job) => (
          <article
            key={job.company}
            className="border-b border-line pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-lg font-semibold">{job.role}</h3>
              <span className="text-sm text-ink-faint">{job.period}</span>
            </div>
            <p className="text-sm font-medium text-navy">{job.company}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
