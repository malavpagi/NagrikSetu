function HomePage() {
  return (
    <div className="ns-card p-8 text-center font-body">
      <h1 className="font-display font-bold text-xl" style={{ color: "var(--ink)" }}>
        Welcome to your citizen home
      </h1>
      <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
        Use the menu below to capture evidence, file a complaint, or check on one already in progress.
      </p>
    </div>
  );
}
export default HomePage;
