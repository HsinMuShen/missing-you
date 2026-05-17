const LIGHT_TEXT = '#1a1614';
const LIGHT_NODE = '#ddd4c8';
const LIGHT_EDGE_LABEL_BG = '#faf8f5';
const LIGHT_LINE = '#4a4540';

const DARK_TEXT = '#f5f2ed';
const DARK_NODE = '#3a3531';
const DARK_EDGE_LABEL_BG = '#24211e';
const DARK_LINE = '#b8b0a6';

/** High-contrast Mermaid palette — flowchart nodes + sequence messages. */
export function getMermaidThemeVariables(dark: boolean): Record<string, string | boolean> {
  const text = dark ? DARK_TEXT : LIGHT_TEXT;
  const node = dark ? DARK_NODE : LIGHT_NODE;
  const edgeBg = dark ? DARK_EDGE_LABEL_BG : LIGHT_EDGE_LABEL_BG;
  const line = dark ? DARK_LINE : LIGHT_LINE;

  return {
    darkMode: dark,
    background: dark ? '#1a1816' : '#faf8f5',
    mainBkg: node,
    textColor: text,
    titleColor: text,
    lineColor: line,
    primaryColor: node,
    primaryTextColor: text,
    primaryBorderColor: dark ? '#8a8278' : '#6b645c',
    secondaryColor: dark ? '#2e2a27' : '#d4cbc0',
    secondaryTextColor: text,
    secondaryBorderColor: dark ? '#8a8278' : '#6b645c',
    tertiaryColor: dark ? '#332f2c' : '#ebe4da',
    tertiaryTextColor: text,
    tertiaryBorderColor: dark ? '#8a8278' : '#6b645c',
    mainContrastColor: text,
    darkTextColor: text,
    lineTextColor: text,
    nodeTextColor: text,
    nodeBorder: dark ? '#8a8278' : '#6b645c',
    clusterBkg: dark ? '#2e2a27' : '#f0ebe4',
    clusterBorder: dark ? '#8a8278' : '#6b645c',
    defaultLinkColor: line,
    edgeLabelBackground: edgeBg,
    edgeLabelText: text,
    actorBkg: node,
    actorTextColor: text,
    actorBorder: dark ? '#8a8278' : '#6b645c',
    actorLineColor: line,
    signalColor: line,
    signalTextColor: text,
    labelTextColor: text,
    labelBoxBkgColor: edgeBg,
    labelBoxBorderColor: dark ? '#8a8278' : '#6b645c',
    loopTextColor: text,
    noteBkgColor: dark ? '#3a3531' : '#f0ebe4',
    noteTextColor: text,
    noteBorderColor: dark ? '#8a8278' : '#6b645c',
    activationBkgColor: dark ? '#4a4540' : '#d4cbc0',
    activationBorderColor: dark ? '#8a8278' : '#6b645c',
    sequenceNumberColor: text,
    fontFamily: 'var(--font-sans), IBM Plex Sans, system-ui, sans-serif',
  };
}

/** Overrides Mermaid SVG/HTML labels that ignore themeVariables (e.g. white-on-white nodes). */
export function getMermaidThemeCSS(dark: boolean): string {
  const text = dark ? DARK_TEXT : LIGHT_TEXT;
  const node = dark ? DARK_NODE : LIGHT_NODE;
  const edgeBg = dark ? DARK_EDGE_LABEL_BG : LIGHT_EDGE_LABEL_BG;
  const line = dark ? DARK_LINE : LIGHT_LINE;

  return `
    .node rect, .node polygon, .node circle { fill: ${node} !important; stroke: ${line} !important; }
    .node .label, .nodeLabel, .label, .label text, .node .label text { fill: ${text} !important; color: ${text} !important; }
    .edgeLabel rect { fill: ${edgeBg} !important; stroke: ${line} !important; }
    .edgeLabel span, .edgeLabel p, .edgeLabel .label, .edgeLabel text { fill: ${text} !important; color: ${text} !important; }
    .messageText, .messageText0, .messageText1, .messageText2, .messageText3 { fill: ${text} !important; }
    text.actor, .actor tspan { fill: ${text} !important; }
    rect.actor { fill: ${node} !important; stroke: ${line} !important; }
    .loopText, .loopText tspan { fill: ${text} !important; }
    .labelText, .labelBox { fill: ${text} !important; }
    foreignObject, foreignObject div, foreignObject span, foreignObject p {
      color: ${text} !important;
      fill: ${text} !important;
    }
  `;
}

/** Fix inline #fff fills Mermaid embeds on flowchart/sequence labels. */
export function postProcessMermaidSvg(svg: string, dark: boolean): string {
  const text = dark ? DARK_TEXT : LIGHT_TEXT;
  const node = dark ? DARK_NODE : LIGHT_NODE;
  const edgeBg = dark ? DARK_EDGE_LABEL_BG : LIGHT_EDGE_LABEL_BG;

  return (
    svg
      .replace(/\bfill:\s*#fff(?:fff)?\b/gi, `fill:${text}`)
      .replace(/\bfill:\s*#ffffff\b/gi, `fill:${text}`)
      .replace(/\bfill:\s*white\b/gi, `fill:${text}`)
      .replace(/\bfill="#fff"/gi, `fill="${text}"`)
      .replace(/\bfill="#ffffff"/gi, `fill="${text}"`)
      .replace(/\bcolor:\s*#fff(?:fff)?\b/gi, `color:${text}`)
      .replace(/\bcolor:\s*#ffffff\b/gi, `color:${text}`)
      .replace(/\bcolor:\s*white\b/gi, `color:${text}`)
      // Light node boxes that stayed pure white
      .replace(/\bfill="#fafafa"/gi, `fill="${node}"`)
      .replace(/\bfill="#ffffff"(?=[^>]*\bclass="[^"]*node)/gi, `fill="${node}"`)
      // Edge label pills on white
      .replace(
        /(<g[^>]*class="[^"]*edgeLabel[^"]*"[^>]*>[\s\S]*?<rect[^>]*)\bfill="#ffffff"/gi,
        `$1fill="${edgeBg}"`,
      )
  );
}

export function applyMermaidTheme(mermaid: {
  initialize: (config: Record<string, unknown>) => void;
}, dark: boolean): void {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: getMermaidThemeVariables(dark),
    themeCSS: getMermaidThemeCSS(dark),
    flowchart: {
      htmlLabels: false,
      useMaxWidth: true,
      curve: 'basis',
    },
    sequence: {
      useMaxWidth: true,
      mirrorActors: false,
    },
  });
}
