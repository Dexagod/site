import './App.scss'

import React, { useState } from 'react';

import * as rdflib from 'rdflib';

import { login, handleIncomingRedirect, logout, getDefaultSession } from "@inrupt/solid-client-authn-browser";

import Profile from './components/Profile.jsx';
import SideBar from './components/SideBar.jsx';

// TODO: make this a config
const SOURCES = [
  'https://pod.rubendedecker.be/profile/card',
  'https://pod.rubendedecker.be/profile/card-private',
  'https://pod.rubendedecker.be/profile/card-public',
  'https://pod.rubendedecker.be/profile/cv-data',
];
const TARGET = rdflib.sym('https://pod.rubendedecker.be/profile/card#me');

function doLogin(solidUri) {
  login({
    oidcIssuer: solidUri,
    redirectUrl: window.location.href,
    clientName: "Ruben D. personal profile"
  });
}

function doLogout(setGraph, setLoggedInWebId) {
  logout().then(() => {
    setGraph(rdflib.graph());
    setLoadingDone(true);
    setLoggedInWebId(null);
  });
}

function App() {
  const [graph, setGraph] = useState(rdflib.graph());
  const [loadingDone, setLoadingDone] = useState(false);
  const [loggedinWebId, setLoggedinWebId] = useState(null);

  handleIncomingRedirect( {restorePreviousSession: true} ).then(() => {
    if (loggedinWebId && !getDefaultSession().info.isLoggedIn) {
      setLoggedinWebId(null);
    }

    if (!loggedinWebId && getDefaultSession().info.isLoggedIn) {
      setLoggedinWebId(getDefaultSession().info.webId);
    }

    if (graph.length === 0) {
      const newGraph = rdflib.graph();
      const fetcher = new rdflib.Fetcher(newGraph, {
        fetch: getDefaultSession().fetch
      });

      Promise.all(SOURCES.map((source) => {
        return fetcher.load(source).catch((e) => {
          console.error("Could not fetch ", source);
        });
      })).then(() => {
        setGraph(newGraph);
        setLoadingDone(true);
      });
    }
  })

  return [
    <SideBar
      key={1}
      login={(uri) => {
        doLogin(
          uri
        )
      }}
      logout={() => {
        doLogout(
          (g) => setGraph(g),
          (id) => setLoggedinWebId(id)
        )
      }}
      loggedInWebId={loggedinWebId}
    />,
    <Profile
      graph={graph}
      user={TARGET}
      loadingDone={loadingDone}
      key={2}
    />
  ]
}

export default App
