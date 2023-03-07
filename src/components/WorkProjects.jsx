import { SCHEMA, FOAF, RDF } from '../namespaces.js'

export default function WorkProjects(props) {
  const { graph, user } = props;

  let projects = graph.each(null, RDF("type"), SCHEMA("ResearchProject")).map(uri => {
    const funderId = graph.any(uri, SCHEMA('funder'));
    const funder = { 
      name: graph.anyValue(funderId, SCHEMA('name')),
      logo: graph.anyValue(funderId, SCHEMA('logo')),
      url: graph.anyValue(funderId, SCHEMA('url')),
    }
    return ({
      name: graph.anyValue(uri, SCHEMA('name')),
      url: graph.anyValue(uri, SCHEMA('url')),
      funder
    })
  })

  return (
    <section id="work-projects" className="half-block">
      <h2>Research Projects</h2>
      {projects.length === 0 && <span className="loading">Loading...</span>}
      {projects.map((project, i) => (
        <div
          className='entry'
          rel={SCHEMA("memberOf").value}
          typeof={SCHEMA("ResearchProject").value}
          key={i}
        >
          <h3 property={SCHEMA('name').value}>
            <a href={project.url}>
              {project.name}
            </a>
          </h3>
          <p>
            Commisioned by:{" "}
            <a href={project.funder.url}>
              {project.funder.name}
            </a>
          </p>
          <img
            className='organization-logo'
            src={project.funder.logo}
            alt={"Organization logo"}
            property={project.funder.logo ? SCHEMA("image").value : undefined}
            resource={project.funder.logo}
          />
        </div>
      ))}
    </section>
  );
}
