import PublicLayout from "@/components/layout/PublicLayout";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Link from "next/link";

export default function NotFound() {
  return (
    <PublicLayout>
      <Section variant="base" className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Container>
          <p className="text-6xl font-bold text-accent">404</p>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Page Not Found</h1>
          <p className="mt-2 max-w-md mx-auto text-muted">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="mt-8 inline-block">
            <Button>Back to Home</Button>
          </Link>
        </Container>
      </Section>
    </PublicLayout>
  );
}
