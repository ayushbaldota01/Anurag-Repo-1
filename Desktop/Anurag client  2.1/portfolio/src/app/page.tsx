import LoadingIntro from '@/components/sections/LoadingIntro';
import Hero from '@/components/sections/Hero';
import Philosophy from '@/components/sections/Philosophy';
import SelectedWorks from '@/components/sections/SelectedWorks';
import Services from '@/components/sections/Services';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <LoadingIntro />
      <main className="relative flex min-h-screen flex-col items-center justify-between">
        <Hero />
        <Philosophy />
        <SelectedWorks />
        <Services />
      </main>
      <Footer />
    </>
  );
}
