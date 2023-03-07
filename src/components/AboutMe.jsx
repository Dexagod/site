import { FOAF, SCHEMA } from "../namespaces.js"
import { useState } from "react";

import { fetch as authFetch } from "@inrupt/solid-client-authn-browser";

import { findName } from "../util.js";

import ContactItems from "./ContactItems.jsx"

let loadedImage;

export default function AboutMe(props) {
  const { user, graph } = props;

  const [imageUri, setImageUri] = useState(null);

  const image = graph.anyValue(user, FOAF("img")) || graph.anyValue(user, SCHEMA("image"));
  if (image && image !== loadedImage) {
    authFetch(image)
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then((uri) => {
        loadedImage = image;
        setImageUri(uri);
       })
      .catch(err => {
        console.log(err);
        loadedImage = null;
        setImageUri(null);
      });
  }

  const name = findName(graph, user);

  return (
    <header id="about-me">
      <img
        id="profile-picture"
        src={imageUri || "https://via.placeholder.com/150x150"}
        alt={name || "Profile picture"}
        property={image ? FOAF("img").value + " " + SCHEMA("image").value : undefined}
        resource={image}
      />
      <div id="name-contact">
        <h1
          property={name ? FOAF("name").value + " " + SCHEMA("name").value : undefined}
          className={name ? undefined : 'loading'}
        >
          <a href={user.value}>
            {name || "Loading..."}
          </a>
        </h1>
        <ContactItems {...props} />
      </div>
    </header>
  );
}
