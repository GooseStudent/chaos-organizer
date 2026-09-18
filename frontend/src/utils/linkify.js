const URL_RE = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?])/g;

export function linkify(text) {
  const nodes = [];
  let last = 0;
  let match;

  while ((match = URL_RE.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(document.createTextNode(text.slice(last, match.index)));
    }

    const a = document.createElement("a");
    a.href = match[0];
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "message-link";
    a.textContent = match[0];
    nodes.push(a);

    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(document.createTextNode(text.slice(last)));
  }

  return nodes;
}
