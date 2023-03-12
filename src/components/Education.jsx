import { CV, CVB, FOAF, SCHEMA } from '../namespaces.js';
import { checkLoading } from './Profile.jsx';

function displayDegreeType(predicate) {
  switch (predicate) {
    case CVB('EduHighSchool').value:
      return 'High School';
    case CVB('EduVocational').value:
      return 'Vocational';
    case CVB('EduCollegeCoursework').value:
      return 'College Coursework';
    case CVB('EduBachelor').value:
      return 'Bachelor';
    case CVB('EduMaster').value:
      return 'Master';
    case CVB('EduDoctorate').value:
      return 'Doctorate';
    case CVB('EduAssociate').value:
      return 'Associate';
    case CVB('EduProfessional').value:
      return 'Professional';
    default:
      return "Unknown education type";
  }
}

export default function Education(props) {
  const { graph, user } = props;

  const educations = [];

  graph.each(user, CV('hasEducation')).forEach(education => {
    const institution = graph.any(education, CV('studiedIn'));

    educations.push(
      {
        type: graph.any(education, CV('degreeType'))?.value,
        institutionName: institution ? (graph.any(institution, FOAF('name')) || graph.any(institution, SCHEMA('name')))?.value : null,
        institutionUri: institution?.value,
        description: graph.any(education, CV('eduDescription'))?.value,
        startDate: graph.any(education, CV('eduStartDate'))?.value,
        endDate: graph.any(education, CV('eduGradDate'))?.value,
      }
    );
  });

  educations.sort((a, b) => {
    if (a.startDate < b.startDate) {
      return 1;
    }
    if (a.startDate > b.startDate) {
      return -1;
    }
    return 0;
  });

  return (
    <section id="education" className="half-block">
      <h2>Education</h2>
      <ul id="education-timeline">
        {educations[0]?.endDate ?
         (
           <li>
             <time
               dateTime={educations[0].endDate}
               className="education-year"
             >
               {educations[0].endDate}
             </time>
           </li>
         )
         : (
          <li>
            <span className="education-year">Now</span>
          </li>
        )}

        {educations.length === 0 && (
          <li>
            { checkLoading("", props.loadingDone) }
            {/* <span className="education-school loading">Loading...</span> */}
          </li>
        )}

        {educations.map((education, i) => {
          return (
            <li key={i} property={CV("hasEducation").value} typeof={CV("Education").value}>
              <span hidden property={CV('degreeType').value} href={education.type}>
                {displayDegreeType(education.type)}
              </span>
              <a
                className="education-school"
                property={CV('studiedIn').value}
                href={education.institutionUri}
                typeof={CV('EducationalOrg').value}
              >
                <span
                  about={education.institutionUri}
                  property={FOAF('name').value + ' ' + SCHEMA('name').value}
                >
                  {education.institutionName}
                </span>
              </a>
              <span
                className="education-field"
                property={CV('eduDescription').value}
              >
                {education.description}
              </span>
              <time
                dateTime={education.startDate}
                className="education-year"
                property={CV("eduStartDate").value}
              >
                {education.startDate}
              </time>
              {education.endDate && (
                <time
                  hidden
                  dateTime={education.endDate}
                  property={CV("eduGradDate").value}
                >
                  {education.endDate}
                </time>
              )}
            </li>
          )}
        )}
      </ul>
    </section>
  )
}
