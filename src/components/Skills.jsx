import { CV, RDF } from '../namespaces.js';
import { checkLoading } from './Profile.jsx';

export default function Skills(props) {
  const { user, graph, loadingDone } = props;

  const skillUris = graph.each(user, CV('hasSkill'));
  const skillsByLevel = skillUris.reduce((acc, skillUri) => {
    const level = graph.any(skillUri, CV('skillLevel'));
    const skillName = graph.any(skillUri, CV('skillName'))?.value;

    const key = (graph.match(skillUri, RDF('type'), CV('LanguageSkill')).length === 0)
        ? "programmingLanguages"
        : "humanLanguages";
    if (!acc[key][level]) {
      acc[key][level] = [];
    }
    acc[key][level].push(skillName);
    return acc;
  }, {
    programmingLanguages:{},
    humanLanguages:{},
  });

  return (
    <section id="skills" className="half-block">
      <h2>Skills</h2>
      <h3>Programming Languages</h3>
      <ul>
        {Object.keys(skillsByLevel.programmingLanguages).length == 0 && (
          checkLoading("", props.loadingDone)
          // <li className="loading">Loading...</li>
        )}
        {Object.keys(skillsByLevel.programmingLanguages).map((level, j) => (
          <li marker={level} className="listify" key={j}>
            {skillsByLevel.programmingLanguages[level].map((skill, i) => (
              <span rel={CV("hasSkill").value} typeof={CV("Skill").value} key={i}>
                <span property={CV("skillName").value}>{skill}</span>
                <span property={CV("skillLevel").value} hidden>{level}</span>
              </span>
            ))}
          </li>
        ))}
      </ul>
      <h3>Languages</h3>
      <ul>
        {Object.keys(skillsByLevel.humanLanguages).length == 0 && (
          checkLoading("", props.loadingDone)
          // <li className="loading">Loading...</li>
        )}
        {Object.keys(skillsByLevel.humanLanguages).map((level, i) => (
          <li
            marker={level} className="listify" key={i}
          >
            {skillsByLevel.humanLanguages[level].map((skill, i) => (
              <span rel={CV("hasSkill").value} typeof={CV("LanguageSkill").value} key={i}>
                <span property={CV("skillName").value}>{skill}</span>
                <span property={CV("skillLevel").value} hidden>{level}</span>
              </span>
            ))}
          </li>
        ))}
      </ul>
    </section>
  )
}
