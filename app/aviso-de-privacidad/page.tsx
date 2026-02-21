import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="section-title mb-8 text-4xl">Aviso de Privacidad</h1>

      <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700">
        <section>
          <h2 className="text-xl font-bold text-black">1. Responsable del Tratamiento</h2>
          <p>
            Katalis Construye (en adelante &quot;Nosotros&quot; o &quot;Katalis&quot;), con domicilio en Calle
            Convento de Churubusco No. 61, Colonia Jardines de Santa Mónica, Tlalnepantla de
            Baz, C.P. 54050, Estado de México, es responsable de recabar sus datos personales, del
            uso que se les dé y de su protección.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">2. Datos Personales Recabados</h2>
          <p>
            Recabamos información que usted proporciona directamente al utilizar nuestra
            herramienta, incluyendo: nombre completo, correo electrónico, nombre de su negocio y
            datos operativos sobre su etapa de negocio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">3. Finalidades del Tratamiento</h2>
          <p>Los datos personales recabados se utilizarán para las siguientes finalidades:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Personalizar su experiencia en el web-book interactivo.</li>
            <li>Proveer los servicios y asesorías financieras solicitadas.</li>
            <li>Realizar diagnósticos sobre el estado de su negocio a partir de sus entradas.</li>
            <li>Contactarlo para seguimiento y agendar sesiones de consultoría si así lo desea.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">4. Derechos ARCO</h2>
          <p>
            Usted tiene derecho a conocer qué datos personales tenemos de usted y para qué los
            usamos (Acceso). También puede solicitar la corrección de su información personal en
            caso de desactualización o inexactitud (Rectificación), su eliminación cuando no se use
            conforme a la normativa aplicable (Cancelación), así como oponerse a su uso para fines
            específicos (Oposición).
          </p>
          <p className="mt-2">
            Para ejercer cualquiera de estos derechos, envíe su solicitud al correo:{" "}
            <strong className="text-black">hola@katalishq.com</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">5. Uso de Cookies</h2>
          <p>
            Utilizamos cookies para que el sitio funcione correctamente y para analizar el tráfico
            de forma anónima. Puede consultar más información en nuestra{" "}
            <Link href="/politica-de-cookies" className="underline hover:text-black">
              Política de Cookies
            </Link>
            .
          </p>
        </section>

        <p className="border-t border-neutral-200 pt-8 text-sm text-neutral-500">
          Última actualización: 20 de febrero de 2026.
        </p>
      </div>
    </div>
  );
}
