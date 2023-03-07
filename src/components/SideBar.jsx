import { useState } from 'react';

import { getDefaultSession, fetch as authFetch, logout } from '@inrupt/solid-client-authn-browser';

import { findName } from "../util.js";

import { OWL } from "../namespaces.js";

import * as rdflib from 'rdflib';

export default function SideBar(props) {
  const [ sideBarOpen, setSideBarOpen ] = useState(false);
  const [ solidUri, setSolidUri ] = useState("https://pod.rubendedecker.be/");
  const [ loggedInName, setLoggedInName ] = useState(null);

  const { loggedInWebId } = props;

  const graph = rdflib.graph();
  const fetcher = new rdflib.Fetcher(graph, {
    fetch: authFetch
  });

  if (loggedInName && !loggedInWebId) {
    setLoggedInName(null);
  }

  if (loggedInWebId && !loggedInName) {
    fetcher.load(loggedInWebId).then(() => {
      let name = findName(graph, loggedInWebId, undefined);

      if (!name) {
        // Check one level of "sameAs" for a name
        graph.each(rdflib.sym(loggedInWebId), OWL('sameAs'), undefined)
             .forEach((otherUri) => {
               name ||= findName(graph, otherUri, undefined);
              });
      }

      setLoggedInName(name || "there");
    });
  }

  return (
    <div id="sidebar">
      <div
        className={sideBarOpen ? "sidebar open" : "sidebar closed"}
        id="sidebar-content"
      >
        {loggedInName
         ? <span className="sidebar-header">Hello {loggedInName}!</span>
         : <span className="sidebar-header">Log in to see more!</span>}

        <span>
          <label htmlFor="provider-uri">Solid Pod URI</label>
          <input
            id="provider-uri"
            onChange={e => setSolidUri(e.target.value)}
            onKeyPress={e => {
              if (e.key === "Enter") {
                props.login(solidUri);
              }
            }}
            value={solidUri}
          />
          <button
            className="login-button"
            onClick={() => props.login(solidUri)}
          >Log In</button>
          {loggedInWebId && (
            <button
              className="logout-button"
              onClick={() => props.logout()}
            >Log out</button>
          )}
        </span>
        <span className="sidebar-icons">
          <a href="https://github.com/Robbe7730/Website">
            <i className="fab fa-github fa-xl"/>
          </a>
        </span>
      </div>
      <a
        id="sidebar-toggle"
        className={sideBarOpen ? "open" : "closed"}
        onClick={() => setSideBarOpen(!sideBarOpen)}
      >
        <i className={
          sideBarOpen ?
            "fas fa-angle-double-left":
            "fas fa-angle-double-right"
        }></i>
      </a>
    </div>
  )
}
