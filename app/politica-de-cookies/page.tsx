export default function CookiesPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="section-title text-4xl mb-8">Política de Cookies</h1>

            <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
                <section>
                    <h2 className="text-xl font-bold text-black">1. ¿Qué son las Cookies?</h2>
                    <p>
                        Las cookies son pequeños archivos de texto que los sitios web que visita instalan en su
                        navegador para reconocerlo, recordar sus preferencias y mejorar su experiencia de navegación.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">2. Tipos de Cookies que utilizamos</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold">Cookies Técnicas (Necesarias)</h3>
                            <p>Esenciales para que pueda navegar por el sitio y utilizar sus funciones, como guardar su sesión y progreso en los capítulos.</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Cookies de Análisis</h3>
                            <p>Nos ayudan a entender cómo interactúan los visitantes con el sitio web reuniendo y proporcionando información de forma anónima.</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Cookies de Preferencias</h3>
                            <p>Permiten al sitio recordar información que cambia la forma en que el sitio se comporta o se ve, como su idioma preferido o la moneda seleccionada.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">3. Gestión de Cookies</h2>
                    <p>
                        La mayoría de los navegadores le permiten controlar las cookies a través de sus ajustes de
                        configuración. Si decide bloquear las cookies técnicas, es posible que algunas partes del
                        sitio no funcionen correctamente y su progreso local se vea afectado.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">4. Terceros</h2>
                    <p>
                        Es posible que utilicemos herramientas de medición externas para analizar el tráfico.
                        Estas herramientas pueden usar sus propias cookies que están fuera de nuestro control directo.
                    </p>
                </section>

                <p className="pt-8 text-sm text-neutral-500 border-t border-neutral-200">
                    Última actualización: 20 de febrero de 2026.
                </p>
            </div>
        </div>
    );
}
