export default function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { moduleId: string }; // Changé de params: { slug: string }
}) {
  return (
    <div>
      <h1>Course Module: {params.moduleId}</h1>
      {children}
    </div>
  );
}
