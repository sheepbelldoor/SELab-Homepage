import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">SELab</h3>
            <p className="text-sm leading-relaxed">
              Software Engineering Laboratory
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/people" className="block hover:text-white transition-colors">People</Link>
              <Link href="/publications" className="block hover:text-white transition-colors">Publications</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>selab@university.ac.kr</p>
              <p>공학관 000호</p>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-gray-800" />
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} SELab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
