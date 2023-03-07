import { CV, SCHEMA, FOAF } from "../namespaces.js";

export default function Experience(props) {
  const { graph, user } = props;

  const entries = graph.each(user, CV('hasWorkHistory')).reduce((acc, uri) => {
    const companyUri = graph.any(uri, CV('employedIn'));
    acc.push({
      title: graph.anyValue(uri, CV('jobTitle')),
      companyUri: companyUri.value,
      companyName: (graph.anyValue(companyUri, SCHEMA('name')) ||
                    graph.anyValue(companyUri, FOAF('name'))),
      started: graph.anyValue(uri, CV('startDate')),
      ended: graph.anyValue(uri, CV('endDate')),
      description: graph.anyValue(uri, CV('jobDescription')).trim(),
    })
    return acc;
  }, []);

  // TODO: I use cv:hasWorkHistory for volunteer work, this is not 100% correct
  // but I found no ontology to describe volunteer work...

  return (
    <section id="experience" className="half-block">
      <h2>Work Experience</h2>
      {entries.length === 0 && <span className="loading">Loading...</span>}
      {entries.map((entry, i) => (
        <div rel={CV("hasWorkHistory").value} typeof={CV("WorkHistory").value} key={i} className='entry'>
          <h3>
            <span property={CV('jobTitle').value}>{entry.title}</span>
            &nbsp;at&nbsp;
            <a
              href={entry.companyUri}
              property={CV('employedIn').value}
              typeof={CV('Company').value}
            >
              <span property={SCHEMA("name").value + " " + FOAF("name").value}>
                {entry.companyName}
              </span>
            </a>
            &nbsp;(
            <time property={CV('startDate').value} dateTime={entry.started}>
              {entry.started}
            </time>
            &nbsp;-&nbsp;
            {
              entry.ended
              ? <time property={CV('endDate').value} dateTime={entry.ended}>
                  {entry.ended}
                </time>
              : <span property={CV('endDate').value}>now</span>
            }
            )
          </h3>
          <p property={CV("jobDescription").value}>
            {entry.description}
          </p>
        </div>
      ))}
    </section>
  );
}
