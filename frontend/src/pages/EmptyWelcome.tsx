function EmptyWelcome() {
  return (
    <section className="flex h-full items-center justify-center">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-semibold text-white">Open a log file</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Upload a log from the sidebar to create a tab and start viewing it
          here.
        </p>
      </div>
    </section>
  );
}

export default EmptyWelcome;
