import { Meteor } from 'meteor/meteor';
import { onPageLoad } from 'meteor/server-render';
import { Lists } from '../../api/lists/lists.js';

const siteName = 'Todos';
const defaultImage = 'https://yourcdn.net/assets/og-image.png';
const defaultMetaTags = `
<meta property="og:title"       content="${siteName}" />
<meta property="og:description" content="All your todos synced wherever you happen to be" />
<meta property="og:image"       content="${defaultImage}" />
`;

function extractListId(pathname) {
  const tripIdRegExp = new RegExp('/lists/([23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17})');
  const match = pathname.match(tripIdRegExp);
  if (!match || match.length > 2) {
    return null;
  }
  return match[1];
}


function createMetaTag(property, content) {
  return `<meta property="${property}" content="${content}">`;
}

onPageLoad((sink) => {
  const { pathname } = sink.request.url;
  const meteorHost = Meteor.absoluteUrl();
  const listId = extractListId(pathname);
  const list = listId ? Lists.findOne({ _id: listId }) : null;

  if (list) {
    const title = list.name;
    const description = `This list contains ${list.incompleteCount} incomplete tasks`;
    const fullUrl = meteorHost + pathname.replace(/^\/+/g, '');
    sink.appendToHead(createMetaTag('og:title', title));
    sink.appendToHead(createMetaTag('og:description', description));
    sink.appendToHead(createMetaTag('og:url', fullUrl));
    sink.appendToHead(createMetaTag('og:image', defaultImage));
    sink.appendToHead(createMetaTag('og:site_name', siteName));
  } else {
    sink.appendToHead(defaultMetaTags);
    sink.appendToHead(createMetaTag('og:url', meteorHost));
  }
});
