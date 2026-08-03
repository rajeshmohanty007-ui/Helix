import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        {/* BRAND */}
        <div>
          <Link href="/">
            <h2 className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-3xl font-black text-transparent cursor-pointer">
              Helix
            </h2>
          </Link>

          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Collaborative productivity platform built for creators, developers,
            and modern teams.
          </p>
        </div>

        {/* PRODUCT */}
        <div className="col-span-3 grid gap-12 grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Product</h3>

            <div className="space-y-3 text-sm text-gray-400">
              <p className="transition hover:text-white cursor-pointer">
                Features
              </p>

              <p className="transition hover:text-white cursor-pointer">
                Pricing
              </p>

              <p className="transition hover:text-white cursor-pointer">
                Integrations
              </p>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>

            <div className="space-y-3 text-sm text-gray-400">
              <Link href="/about" className="transition hover:text-white cursor-pointer block">
                About
              </Link>

              <p className="transition hover:text-white cursor-pointer">
                Careers
              </p>

              <p className="transition hover:text-white cursor-pointer">
                Contact
              </p>
            </div>
          </div>

          {/* SOCIALS */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Socials</h3>

            <div className="space-y-3 text-sm text-gray-400">
              <p className="transition hover:text-white cursor-pointer">
                LinkedIn
              </p>

              <p className="transition hover:text-white cursor-pointer">
                GitHub
              </p>

              <p className="transition hover:text-white cursor-pointer">
                Discord
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 md:flex-row">
          <p>© 2026 Helix. All rights reserved.</p>

          <div className="flex gap-6">
            <p className="cursor-pointer transition hover:text-white">
              Privacy
            </p>

            <p className="cursor-pointer transition hover:text-white">Terms</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
