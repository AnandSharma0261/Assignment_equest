import SiteFooter from '@/components/SiteFooter';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[576px] flex-col items-stretch gap-10">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
