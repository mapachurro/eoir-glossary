const bibliographyEntries = [
  {
    title: "Anuario de la Comisión de Derecho Internacional 2009, Vol.I",
    author: "",
  },
  {
    title: "Aplicación del estándar de prueba por los jueces promiscuos",
    author: "Varios",
  },
  {
    title: "BIA Interim Decision 3342, In re C-V-T-, Respondent",
    author: "",
  },
  {
    title: "Black's Law Dictionary, 9th Edxition",
    author: "",
  },
  {
    title: "Codigo de Procedimiento Penal de Peru",
    author: "",
  },
  {
    title: "Convención contra delincuencia organizada y trata de personas",
    author: "Naciones Unidas, Oficina contra la Droga y el Delito",
  },
  {
    title:
      "Convención internacional sobre la protección de los derechos de todos los trabajadores migratorios y de sus familias",
    author: "Naciones Unidas",
  },
  {
    title: "De los Motivos Fundados",
    author: "Zuluaga",
  },
  {
    title: "Diccionario de Ossorio",
    author: "Manuel Ossorio",
  },
  {
    title: "Diccionario Juridico Universal Paraguay",
    author: "",
  },
  {
    title: "Directiva 2001-55-CE del Consejo de 20 de julio de 2001",
    author: "Varios",
  },
  {
    title: "EASO Practical Guide: Evidence Assessment",
    author: "EASO (European Asylum Support Office)",
  },
  {
    title: "Estándares probatorios en el sistema acusatorio y su desarrollo en Colombia",
    author: "Claudia Edith Velandia Coy",
  },
  {
    title:
      "Garner, Bryan A. A Dictionary of Modern Legal Usage, Second Edition. New York, New York: Oxford University Press.",
    author: "",
  },
  {
    title:
      "Glosario de Términos y de Conceptos Jurídicos o Relativos al Poder Judicial",
    author: "Oficina de Administración de los Tribunales, Academia Judicial Puertorriqueña, 2015",
  },
  {
    title: "Guía Práctica de la EASO: Valoración de las pruebas",
    author: "EASO (European Asylum Support Office)",
  },
  {
    title:
      "Guia practica para responsables de expedientes relativos al convenio de cobro de alimentos para los hijos de 2007",
    author: "",
  },
  {
    title:
      "Handbook on Procedures and Criteria for Determining Refugee Status and Guidelines on International Protection",
    author: "UNHCR",
  },
  {
    title: "http://noticias.juridicas.com/base_datos/Admin/rd2393-2004.t11.html#a138",
    author: "",
  },
  {
    title: "https://2009-2017.state.gov//documents/organization/65466.pdf",
    author: "",
  },
  {
    title: "https://foreignpolicy.com/2015/01/26/al-qaeda-islamic-state-myth-of-the-terrorist-safe-haven/",
    author: "",
  },
  {
    title:
      "https://www.law.cornell.edu/wex/es/leyes_predominantes_que_afectan_la_inmigraci%C3%B3n_y_naturalizaci%C3%B3n",
    author: "",
  },
  {
    title: "I-877",
    author: "DHS",
  },
  {
    title: "Immigration and Nationality Act",
    author: "Various",
  },
  {
    title:
      "Informe Final, El estándar de prueba en los proceso administrativos sancionatorios",
    author:
      "Lucero Ocampo Henao, Johana Catalina Restrepo Ramírez, Dr. Luis Orlando Toro Garzón",
  },
  {
    title: "La Legitimación en el Código Civil y en la Ley 14.367",
    author: "Guillermo F. Frugoni Rey",
  },
  {
    title: "Léxico Temático de Terminología Jurídica Español-Inglés",
    author: "Rebecca Jowers",
  },
  {
    title:
      "Ley de Migración, publicada en el Diario Oficial de la Federación el 25 de mayo de 2011",
    author: "Cámara de Diputados del H. Congreso de la Unión (de México)",
  },
  {
    title: "Lobo, S., 1992. A House Of My Own. Tucson, Ariz.: University of Arizona Press",
    author: "",
  },
  {
    title: "Los estándares de prueba en el proceso penal español",
    author: "Jordi Ferrer Beltrán",
  },
  {
    title:
      "Manual Sobre Procedimientos y Criterios para Determinar la Condición de Refugiado y Directrices sobre Protección Internacional",
    author: "ACNUR",
  },
  {
    title: "Nuevo Código de Proceso Penal de Perú",
    author: "Ministerio de Justicia y Derechos Humanos",
  },
  {
    title: "Precedente Judicial",
    author: "Victoria Iturralde",
  },
  {
    title: "Public Law 104-208, Sept. 30 1996",
    author: "Various",
  },
  {
    title: "Public Law 105-100, Nov. 19, 1997",
    author: "Various",
  },
  {
    title: "Publication 850 (EN-SP)",
    author: "IRS",
  },
  {
    title:
      "Reglamento de pasaportes y del documento de identidad y viaje, publicado en el Diario Oficial de la Federación el 5 de agosto del 2011",
    author: "Varios",
  },
  {
    title: "Reglas de Evidencia de Puerto Rico",
    author: "Tribunal Supremo de Puerto Rico",
  },
  {
    title: "Reglas de Procedimiento y Prueba",
    author: "Corte Penal Internacional",
  },
  {
    title: "Sentencia Casación No. 1640-2019-Nacional",
    author: "Corte Suprema de Justicia de la República (de Perú)",
  },
  {
    title: "STS 1257-2020-ECLI: ES:TS:2020:1257",
    author: "Tribunal Supremo de España",
  },
  {
    title: "Style Manual",
    author: "GPO, 2016",
  },
  {
    title: "Taller de Litigación Oral Básico",
    author: "Fernando Ugaz Z.",
  },
  {
    title: "Terrorist Safe Havens",
    author: "US Dept. of State",
  },
  {
    title: "The Inconvenience of the reasonable person standard in criminal law",
    author: "Juan Pablo Pérez-León Acevedo",
  },
  {
    title: "The Operation of the Immigrant Numerical Control System",
    author: "US Dept. of State",
  },
];

function isUrl(value) {
  return /^https?:\/\//i.test(value);
}

export default function SourcesPage() {
  return (
    <section className="page">
      <h1>Bibliography &amp; Sources</h1>

      <p className="page-intro">
        This page is intended to provide clarity as to how this glossary came to
        be, and where its information came from. Any terminological decision is
        only as good as its sources, so we encourage you to understand how
        those decisions were made.
      </p>

      <section className="source-section">
        <p>
          The bibliography below lists source materials consulted in compiling
          and maintaining the glossary. 
          Some sources were drawn from broadly, while others served to narrow down more specific contexts.
        </p>
        <p>
          Whenever a source was used, we have attempted to make note of it in the corresponding definition, note, or comment, but there may be cases where we failed to do this.
          If an entry does not cite a source, it is safe to assume that the equivalent provided has not been thoroughly interrogated.
          Whether that's acceptable or not in each case we leave to your best judgment.
        </p>

        <div className="sources-table-wrapper">
          <table className="sources-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
              </tr>
            </thead>
            <tbody>
              {bibliographyEntries.map((entry) => (
                <tr key={`${entry.title}-${entry.author}`}>
                  <td>
                    {isUrl(entry.title) ? (
                      <a
                        href={entry.title}
                        target="_blank"
                        rel="noreferrer"
                        className="source-link"
                      >
                        {entry.title}
                      </a>
                    ) : (
                      entry.title
                    )}
                  </td>
                  <td>{entry.author || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}