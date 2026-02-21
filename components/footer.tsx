import Link from "next/link";
import { BrandLogo } from "./brand-logo";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-[var(--stroke)] bg-white py-12">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                    <div className="max-w-xs">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <BrandLogo size={32} className="h-8 w-8 object-cover" />
                            <span className="text-black font-bold tracking-tight">Katalis Construye</span>
                        </Link>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Infraestructura educativa y financiera para emprendedores. Detecta fugas, optimiza márgenes y toma el control de tu caja.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-8">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Plataforma</h4>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-sm text-neutral-600 hover:text-black transition-colors">Inicio</Link></li>
                                <li><Link href="/learn" className="text-sm text-neutral-600 hover:text-black transition-colors">Ruta de Aprendizaje</Link></li>
                                <li><Link href="/tools" className="text-sm text-neutral-600 hover:text-black transition-colors">Herramientas</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Síguenos</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="https://mx.linkedin.com/company/katalis-hq" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        LinkedIn
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com/katalishq" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.tiktok.com/@katalishq" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18c0 1.94-.66 3.82-1.88 5.32-1.22 1.5-3.05 2.52-5.07 2.66-2.02.14-4.04-.37-5.6-1.55-1.56-1.18-2.61-2.91-2.83-4.83-.22-1.92.35-3.89 1.5-5.38 1.15-1.49 2.95-2.45 4.9-2.6.28-.02.56-.03.84-.03.01 1.34 0 2.67 0 4.01-.2.01-.4.02-.6.04-1.14.12-2.19.8-2.73 1.77-.54.97-.56 2.14-.07 3.12.49.98 1.48 1.66 2.59 1.79 1.11.13 2.23-.2 2.97-1.01.74-.81 1.05-1.91 1.05-2.99V0c-.01 0-.01.01-.01.02z" /></svg>
                                        TikTok
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.facebook.com/IAKatalis" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                        Facebook
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link href="/aviso-de-privacidad" className="text-sm text-neutral-600 hover:text-black transition-colors">Privacidad</Link></li>
                                <li><Link href="/terminos-y-condiciones" className="text-sm text-neutral-600 hover:text-black transition-colors">Términos</Link></li>
                                <li><Link href="/politica-de-cookies" className="text-sm text-neutral-600 hover:text-black transition-colors">Cookies</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-neutral-400">
                        © {currentYear} Katalis HQ. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="https://www.katalishq.com" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-black transition-colors">
                            katalishq.com
                        </a>
                        <span className="text-xs text-neutral-200">|</span>
                        <p className="text-xs text-neutral-400 italic">
                            Hecho para fundadores que construyen.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
