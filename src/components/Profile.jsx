import AboutMe from "./AboutMe.jsx"

import Page from './Page.jsx';
import Education from './Education.jsx';
import Skills from './Skills.jsx';
import Projects from './Projects.jsx';
import VolunteerWork from './VolunteerWork.jsx';
import Experience from './Experience.jsx';
import Achievements from './Achievements.jsx';
import WorkProjects from "./WorkProjects.jsx";

export function checkLoading(className, loadingDone) { 
  if (!loadingDone) {
    return <span className={className + "loading"}>Loading...</span>
  } else { 
    return <span className={className + "loading"}>Not authorized</span>
  }
}

export default function Profile(props) {
  return (
    <div id="profile">
      <AboutMe {...props}/>
      <main>
        <Page>
          <Education {...props}/>
          <Skills {...props}/>
        </Page>
        <Page>
          <Experience {...props}/>
          <WorkProjects {...props}/>
        </Page>
        <Page>
          <Projects {...props}/>
        </Page>
        <Page></Page>
      </main>
    </div>
  )
}
