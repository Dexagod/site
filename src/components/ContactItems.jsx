import { FOAF, SCHEMA } from '../namespaces.js';

import * as rdflib from 'rdflib';

// TODO: make this a config?
const CONTACTITEMS = [
  [FOAF('phone'), SCHEMA('telephone')],
  [FOAF('mbox'), SCHEMA('email')],
  [FOAF('homepage'), SCHEMA('url')],
  [FOAF('holdsAccount')],
  [SCHEMA('callSign')]
];

const ICONS_BY_URI = {
  "https://github.com": "fab fa-github",
  "https://twitter.com": "fab fa-twitter",
  "https://facebook.com": "fab fa-facebook",
  "https://linkedin.com": "fab fa-linkedin",
  "https://instagram.com": "fab fa-instagram",
  "https://youtube.com": "fab fa-youtube",
  "https://flickr.com": "fab fa-flickr",
  "https://foursquare.com": "fab fa-foursquare",
  "https://tumblr.com": "fab fa-tumblr",
  "https://pinterest.com": "fab fa-pinterest",
  "https://snapchat.com": "fab fa-snapchat",
  "https://soundcloud.com": "fab fa-soundcloud",
  "https://spotify.com": "fab fa-spotify",
  "https://vimeo.com": "fab fa-vimeo",
  "https://vine.co": "fab fa-vine",
  "https://whatsapp.com": "fab fa-whatsapp",
  "https://wikipedia.org": "fab fa-wikipedia-w",
  "https://wordpress.com": "fab fa-wordpress",
  "https://yelp.com": "fab fa-yelp",
  "https://orcid.org": "fab fa-orcid",
  "https://scholar.google.com": "fab fa-google",
}

export default function ContactItems(props) {
  const { user, graph } = props;

  const children = [];

  let key = 0;

  CONTACTITEMS.forEach(contactItem => {
    const values = new Set();
    contactItem.forEach(predicate => {
      const value = graph.each(user, predicate)
      if (value && value.length > 0) {
        value.forEach(v => values.add(v.value));
      }
    });
    if (!values) {
      return;
    }

    values.forEach(value => {
      let icon;
      let displayValue;
      let isAccount = false;
      let isURL = true;
      let accountHomepage;
      console.log('test', value)

      if (value.startsWith('tel:')) {
        icon = "fas fa-phone";
        displayValue = value.replace('tel:', '').replace(/-/g, ' ');
      } else if (value.startsWith('mailto:')) {
        icon = "fas fa-envelope";
        displayValue = value.replace('mailto:', '');
      } else if (contactItem[0].value === FOAF('homepage').value) {
        icon = "fas fa-home";
        displayValue = value.replace(/https?:\/\//, '');
      } else if (contactItem[0].value === SCHEMA('callSign').value) {
        icon = "fas fa-radio";
        displayValue = value;
        isURL = false;
      } else {
        const accountType = graph.any(rdflib.sym(value), FOAF('accountServiceHomepage'));
        const accountName = graph.any(rdflib.sym(value), FOAF('accountName'));

        isAccount = !!accountName || !!accountType;

        if (!accountType || !ICONS_BY_URI[accountType.value]) {
          icon = "fas fa-question";
        } else {
          icon = ICONS_BY_URI[accountType.value];
          accountHomepage = accountType.value;
        }

        if (!accountName) {
          displayValue = value;
        } else {
          displayValue = accountName.value;
        }
      }

      children.push(
        <a
          href={isURL ? value : undefined}
          key={key++}
          property={contactItem.map(x => x.value).join(" ")}
          resource={isURL ? value : undefined}
          typeof={isAccount ? FOAF('OnlineAccount').value : null}
        >
          <i
            className={"icon " + icon}
            property={accountHomepage ? FOAF('accountServiceHomepage').value : null}
            href={accountHomepage ? accountHomepage : null}
          ></i>
          <span
            property={isAccount ? FOAF('accountName').value : null}
          >{displayValue}</span>
        </a>
      );
    })
  })

  return (
    <div className="contact-items">
      {children}
    </div>
  )
}
