import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-black mb-2 text-purple-400">404 - Track Not Found</h2>
      <p className="text-slate-400 text-sm mb-6">The page or track you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white"
      >
        Back to Studio Dashboard
      </Link>
    </div>
  );
}
