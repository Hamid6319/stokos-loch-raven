export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="max-w-md w-full text-center rounded-3xl border p-8 shadow-xl dark:border-zinc-800">
        <h1 className="text-3xl font-black text-green-600 mb-3">
          Order Placed!
        </h1>

        <p className="text-zinc-500 mb-6">
          Your payment was successful. Thank you for your order.
        </p>

        <a
          href="/store/towson"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#DA3327] px-6 font-black text-white"
        >
          Back to Menu
        </a>
      </div>
    </main>
  );
}