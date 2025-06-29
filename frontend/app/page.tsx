import { Header } from '@/components/layout/header';
import { Hero } from '@/components/home/hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  );
}