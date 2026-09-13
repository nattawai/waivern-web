import { CvHeader } from "./features/cv/cv-header";
import { CvExperience } from "./features/cv/cv-experience";
import { jobs } from "./features/cv/cv-data";

export default function Home() {
  return (
    <main>
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <CvHeader
            name="ณัฐศักดิ์ วิวัฒน์วิศวกร"
            role="Senior Software Engineer"
          ></CvHeader>
        </div>
      </div>

      <div className="mx-auto max w 4xl bg-paper px-6 py-10">
        <CvExperience jobs={jobs}></CvExperience>
      </div>
    </main>
  );
}
