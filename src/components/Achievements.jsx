import { SCHEMA, FOAF } from '../namespaces.js'
import { checkLoading } from './Profile.jsx';

export default function Achievements(props) {
  const { graph, user } = props;

  const achievements = graph.each(user, SCHEMA("hasCredential")).map(uri => {
    return {
      title: graph.anyValue(uri, SCHEMA("name")) || graph.anyValue(uri, FOAF('name')),
      description: graph.anyValue(uri, SCHEMA("description")).trim(),
    }
  });

  return (
    <section id="achievements" className="half-block">
      <h2>Achievements</h2>
      {
        achievements.length === 0 && checkLoading("", props.loadingDone)
      }
      {achievements.map((achievement, i) => (
        <div
          rel={SCHEMA("hasCredential").value}
          typeof={SCHEMA("EducationalOccupationalCredential").value}
          key={i}
        >
          <h3 property={SCHEMA('name').value + " " + FOAF('name').value}>
            {achievement.title}
          </h3>
          <p property={SCHEMA('description').value}>{achievement.description}</p>
        </div>
      ))}
    </section>
  );
}
