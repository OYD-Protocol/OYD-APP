export default function Logo() {
  return (
    <>
      <div className="flex items-center">
        <img src="/logo.svg" alt="Data DAO Logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold text-slate-900">
          <span className="text-blue-600">OYD</span> Protocol
        </h1>
      </div>
    </>
  );
}