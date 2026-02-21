import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h1 className="section-title text-4xl mb-8">Aviso de Privacidad</h1>

            <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
                <section>
                    <h2 className="text-xl font-bold text-black">1. Responsable del Tratamiento</h2>
                    <p>
                        Katalis Construye (en adelante "Nosotros" o "Katalis"), con domicilio en
                        Calle Convento de Churubusco No. 61, Colonia Jardines de Santa Mónica,
                        Tlalnepantla de Baz, C.P. 54050, Estado de México, es responsable de recabar
                        sus datos personales, del uso que se le dé a los mismos y de su protección.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">2. Datos Personales Recabados</h2>
                    <p>
                        Recabamos información que usted nos proporciona directamente al utilizar nuestra
                        herramienta, incluyendo: nombre completo, correo electrónico, nombre de su negocio,
                        y datos operativos sobre su etapa de negocio.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">3. Finalidades del Tratamiento</h2>
                    <p>Los datos personales recabados serán utilizados para las siguientes finalidades primarias:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Personalizar su experiencia en el web-book interactivo.</li>
                        <li>Proveer los servicios y asesorías financieras solicitadas.</li>
                        <li>Realizar diagnósticos sobre el estado de su negocio radicados en sus inputs.</li>
                        <li>Contactarlo para seguimiento y agendar sesiones de consultoría si así lo desea.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">4. Derechos ARCO</h2>
                    <p>
                        Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos
                        y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la
                        corrección de su información personal en caso de que esté desactualizada, sea inexacta o
                        incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando
                        considere que la misma no está siendo utilizada conforme a los principios, deberes y
                        obligaciones previstos en la normativa (Cancelación); así como oponerse al uso de sus
                        datos personales para fines específicos (Oposición).
                    </p>
                    <p className="mt-2">
                        Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud
                        respectiva enviando un correo electrónico a: <strong className="text-black">hola@katalishq.com</strong>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black">5. Uso de Cookies</h2>
                    <p>
                        Utilizamos cookies para que el sitio funcione correctamente y para analizar el tráfico de
                        forma anónima. Puede obtener más información en nuestra <Link href="/politica-de-cookies" className="underline hover:text-black">Política de Cookies</Link>.
                    </p>
                </section>

                <p className="pt-8 text-sm text-neutral-500 border-t border-neutral-200">
                    Última actualización: 20 de febrero de 2026.
                </p>
            </div>
        </div>
    );
}
