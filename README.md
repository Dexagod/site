# Website/CV Generator

To see it in action: <https://rubendedecker.be>

## Features

- Data loaded from a SOLID pod
- Log in to access more data
  - Define who can see what using SOLIDs access control
- Expose in RDFa tagged HTML
  - All data read should be visible as RDFa again
- Export to PDF using browsers' "print to PDF"

## Data model

Ontolgies:

- `foaf`: `http://xmlns.com/foaf/0.1/`
- `schema`: `http://schema.org/`
- `cv:`: `http://rdfs.org/resume-rdf/cv.rdfs#`
- `cvb:`: `http://rdfs.org/resume-rdf/base.rdfs#`

### About Me

- image: `foaf:img` or `schema:image`
- name: `foaf:name` or `schema:name` if either exist, else a combination of
  first name (`schema:givenName`, `foaf:firstName` or `foaf:givenName`) and last
  name (`schema:familyName`, `foaf:surname`, `foaf:family_name`).

### Contact items

- phone number: `foaf:phone` or `schema:telephone`
- email address: `foaf:mbox` or `schema:email`
- homepage: `foaf:homepage` or `schema:url`
- callsign: `schema:callSign`

Other accounts can be specified using `foaf:holdsAccount`, linking to the URL of
the account and providing `foaf:accountServiceHomepage` and/or
`foaf:accountName` for the account.

### Education

Entries are `cv:Education`s found by `cv:hasEducation` with:

- degree type: `cv:degreeType` (one of the `cvb:EduDegree`s)
- name of the degree: `cv:eduDescription`
- started: `cv:eduStartDate`
- ended: `cv:eduEndDate`
- school: `cv:studiedIn`

Schools are `cv:EducationalOrg`s with:

- name: `foaf:name` or `schema:name`

### Skills

TODO: Right now, `cv:Skill`s are assumed to be programming languages and
`cv:LanguageSkill`s for spoken languages. I should look into a "skillType" to
make this more correct.

Entries are `cv:Skill`s (or `cv:LanguageSkill`s for languages) found by
`cv:hasSkill` with:

- name: `cv:skillName`
- proficiency: `cv:skillLevel`

### Projects

Entries are ` schema:SoftwareSourceCode`s found by `foaf:currentProject` with:

- name: `foaf:name` or `schema:name`
- description: `schema:description`
- languages: `schema:programmingLanguage`

### Volunteer Work

TODO: volunteer work is now everything with `cv:hasWorkHistory`, but I should
distinguish between volunteer and career jobs.

Entries are `cv:WorkHistory`s found by `cv:hasWorkHistory` with:

- function: `cv:jobTitle`
- started: `cv:startDate`
- ended: `cv:endDate`
- description: `cv:jobDescription`
- employer: `cv:employedIn`

Employers are `cv:Company`s with:

- name: `schema:name` or `foaf:name`

### Achievements

Entries are `schema:EducationalOccupationalCredential`s found by
`schema:hasCredential` with:

- title: `schema:name` or `foaf:name`
- description: `schema:description`

## Hacks

- Using the order in which data is loaded to allow "overriding" data in
  `card-private` (e.g. in public I define `schema:image`, but in private
  `foaf:img`, since it checks for `foaf:img` first, this is the one that gets
  rendered if private data is loaded)
- Using the order of the entries in the turtle file to format the CV
