export default function PollsLayout({
  children,
  comments,
}: {
  children: React.ReactNode;
  comments: React.ReactNode;
}) {
  return (
    <>
      {children}
      {comments}
    </>
  );
}
