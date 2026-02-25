import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-midnight">
      <div className="text-center px-4">
        <h1 className="text-7xl font-bold text-gold sm:text-9xl">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-soft-white sm:text-3xl">
          Page Not Found
        </h2>
        <p className="mx-auto mt-4 max-w-md text-soft-white/60">
          The page you are looking for doesn't exist or has been moved.
          Head back to the homepage and explore from there.
        </p>
        <div className="mt-8">
          <Button href="/" variant="primary">
            Back to Homepage
          </Button>
        </div>
      </div>
    </section>
  );
}
