type CvHeaderProps = {
  name: string;
  role: string;
};

export function CvHeader({ name, role }: CvHeaderProps) {
  return (
    <header>
      <h1 className="font-serif text-4xl font-semibold leading-[1.3]">
        {name}
      </h1>
      <p className="mt-1 text-white/75">{role}</p>
    </header>
  );
}
