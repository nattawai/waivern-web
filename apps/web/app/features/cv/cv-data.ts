export type Job = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

export const jobs: Job[] = [
  {
    role: "Senior Software Engineer",
    company: "GPM Global Company Limited",
    period: "March 2022 - Present",
    bullets: [
      "นำทีมพัฒนาโปรเจกต์แอปพลิเคชันมือถือ",
      "พัฒนาระบบทรัพยากรบุคคล ระบบวางแผนโครงการ และระบบการเงิน ให้คณะมนุษยศาสตร์ มหาวิทยาลัยเกษตรศาสตร์",
    ],
  },
  {
    role: "Software Engineer",
    company: "We Chef Thailand",
    period: "July 2019 - February 2022",
    bullets: [
      "พัฒนาเว็บแอปพลิเคชันจองที่จอดรถแบบ full-stack",
      "ดูแลและบำรุงรักษางานเทคโนโลยีทั้งหมดของบริษัท",
    ],
  },
];
