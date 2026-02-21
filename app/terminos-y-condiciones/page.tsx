export default function TermsAndConditionsPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="section-title text-4xl mb-8">Términos y Condiciones</h1>

            <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
                <section>
                    <h2 className="text-xl font-bold text-black">1. Aceptación de los Términos</h2>
                    <p>
                        Al acceder y utilizar Katalis Construye, usted acepta estar sujeto a estos Términos y
                        Condiciones de Uso. Si no está de acuerdo con alguno de estos términos, tiene prohibido
                        el uso de este sitio.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">2. Uso de la Licencia</h2>
                    <p>
                        Katalis Construye es una herramienta interactiva diseñada para la educación financiera
                        y el diagnóstico de negocios. El uso de la plataforma es personal e intransferible para
                        fines lícitos de administración y aprendizaje.
                    </p>
                    <p className="mt-2">Está prohibido:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Modificar o copiar los materiales y metodologías presentadas.</li>
                        <li>Utilizar los materiales para cualquier fin comercial público.</li>
                        <li>Intentar descompilar o realizar ingeniería inversa de cualquier software contenido en el sitio.</li>
                        <li>Vulnerar la seguridad de la plataforma o realizar actividades fraudulentas.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">3. Propiedad Intelectual</h2>
                    <p>
                        Todo el contenido, incluyendo textos, logotipos, gráficos, metodologías financieras y
                        estructura de datos, son propiedad intelectual exclusiva de Katalis HQ y están protegidos
                        por las leyes de derechos de autor aplicables.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">4. Limitación de Responsabilidad</h2>
                    <p>
                        La información y herramientas proporcionadas en este sitio se ofrecen para fines formativos
                        e informativos. Los resultados obtenidos dependen de la precisión de los datos ingresados
                        por el usuario y de la ejecución externa. Katalis no se hace responsable de daños directos
                        o indirectos derivados de decisiones de negocio tomadas basándose en el uso de esta herramienta.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">5. Ley Aplicable y Jurisdicción</h2>
                    <p>
                        Cualquier reclamación relacionada con Katalis Construye se regirá por las leyes de México,
                        y específicamente bajo la jurisdicción de los tribunales competentes en el Estado de México.
                    </p>
                </section>

                <p className="pt-8 text-sm text-neutral-500 border-t border-neutral-200">
                    Última actualización: 20 de febrero de 2026.
                </p>
            </div>
        </div>
    );
}
