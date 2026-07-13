export default function ErrorMessage({ message }: { message?: string }) {
  return <p className="text-[12.5px] text-destructive mt-0.5">{message}</p>;
}
