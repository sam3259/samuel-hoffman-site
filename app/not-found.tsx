import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found page-pad">
      <p>404</p>
      <h1>This page is not part of the portfolio.</h1>
      <Link href="/">Return home →</Link>
    </main>
  );
}
