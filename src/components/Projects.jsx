import { FOAF, SCHEMA } from "../namespaces.js";

export default function Projects(props) {
  const { graph, user } = props;

  const projectUris = graph.each(user, FOAF('currentProject'));

  const projects = projectUris?.map((projectUri) => {
    return {
      name: (
        graph.any(projectUri, FOAF('name')) ||
        graph.any(projectUri, SCHEMA('name'))
      )?.value,
      description: graph.any(projectUri, SCHEMA('description'))?.value.trim(),
      lanuages: graph.each(projectUri, SCHEMA('programmingLanguage'))?.map((lang) => lang.value),
      uri: projectUri.value,
    }
  });

  return (
    <section id="projects" className="full-block">
      <h2>Github Highlights</h2>
      <div id="project-list">
        {projects.length === 0 && (
          <div className="project">
            <h3>
              <i className="icon fa-brands fa-github"></i>
              <span className="loading">Loading...</span>
            </h3>
            <div className="project-description">
              <span className="loading">Loading...</span>
            </div>
          </div>
        )}
        {projects?.map((project, i) => (
          <div
            className="project"
            rev={SCHEMA('creator').value}
            property={FOAF('currentProject').value}
            typeof={SCHEMA('SoftwareSourceCode').value}
            resource={project.uri}
            key={i}
          >
            <h3>
              <a property={SCHEMA('codeRepository').value} href={project.uri}>
                <i className="icon fa-brands fa-github"></i>
                <span
                  property={SCHEMA('name').value + " " + FOAF('name').value}
                >
                  {project.name}
                </span>
              </a>
            </h3>
            <div
              className="project-description"
              property={SCHEMA('description').value}
            >
              {project.description}
            </div>
            {project.lanuages.map((lang, i) => {
              return (
                <span
                  className="project-language"
                  property={SCHEMA("programmingLanguage").value}
                  key={i}
                >
                  {lang}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
