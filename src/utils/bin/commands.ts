// List of commands that do not require API calls

import * as bin from './index';
import config from '../../../config.json';

// Help
export const help = async (args: string[]): Promise<string> => {
  const commands = Object.keys(bin).sort().join(', ');
  var c = '';
  for (let i = 1; i <= Object.keys(bin).sort().length; i++) {
    if (i % 7 === 0) {
      c += Object.keys(bin).sort()[i - 1] + '\n';
    } else {
      c += Object.keys(bin).sort()[i - 1] + ' ';
    }
  }
  return `Welcome! Here are all the available commands:
\n${c}\n
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.\n
Type 'sumfetch' to display summary.
`;
};

// Redirection
export const repo = async (args: string[]): Promise<string> => {
  window.open(`${config.repo}`);
  return 'Opening Github repository...';
};

// About
export const about = async (args: string[]): Promise<string> => {
  return `Hi, I am ${config.name}.
Computer Science student at Andrews University (B.S., class of 2027),
currently a Software Engineer Intern at Synergy Power, Inc. — building
a local-first AI assistant on NVIDIA Jetson Thor.

I care about local-first AI, clean microservices, and building things
that don't need the cloud to work.

More about me:
 'sumfetch'    - short summary
 'experience'  - where I've worked
 'education'   - where I've studied
 'projects'    - what I've built
 'skills'      - tools I use
 'resume'      - my latest resume (PDF)
 'hire'        - let's talk
`;
};

export const resume = async (args: string[]): Promise<string> => {
  window.open(`${config.resume_url}`, '_blank');
  return 'Opening resume...';
};

// Experience
export const experience = async (args: string[]): Promise<string> => {
  return `<u>EXPERIENCE</u>

<b>Synergy Power, Inc</b> — Software Engineer Intern  (Remote)
  Jan 2026 – Present
  - Engineered a local-first AI assistant on NVIDIA Jetson Thor,
    integrating a Llama-family LLM with Home Assistant over REST +
    WebSocket for real-time voice-controlled smart home automation
    with <u>zero cloud dependency</u>.
  - Designed a 4-service microservices architecture (FastAPI +
    Docker Compose): orchestrator, LLM server, voice pipeline, RAG
    document service — with stable API contracts across milestones.
  - Built a safety-gated tool execution pipeline with PIN lockout,
    SQLite session management, and structured confirmation flows to
    reduce risk of destructive Home Assistant actions.
  - Developed a RAG document Q&A service with local ingestion,
    embeddings, and citation-grounded answers over private docs.

<b>Centro de Medios Adventista</b> — Web Developer  (San Cristóbal, VE)
  Jun 2018 – Dec 2018
  - Diagnosed and fixed HTML/CSS/JavaScript bugs across the public
    site, keeping media and content delivery consistently online.
  - Shipped new site features with the media team, improving
    cross-platform presentation for organizational audiences.
`;
};

// Education
export const education = async (args: string[]): Promise<string> => {
  return `<u>EDUCATION</u>

<b>Andrews University</b> — Berrien Springs, MI
  B.S. Computer Science  |  Aug 2023 – May 2027  |  GPA 3.5
  Coursework: Software Engineering, Operating Systems, Data
  Structures & Algorithms, Artificial Intelligence, Media
  Applications Development, Web Development.

<b>American Preparatory Academy</b> — Draper, UT
  Aug 2022 – May 2023  |  GPA 3.8
  Class Valedictorian. President of Computing Club.
  Python Development Summer Class.
`;
};

// Projects (curated — overrides the GitHub API version)
export const projects = async (args: string[]): Promise<string> => {
  return `<u>PROJECTS</u>

<b>★ TimeTube</b>  <span>— JavaScript</span>
  AI-powered web app that ingests any YouTube URL and auto-generates
  structured timestamps via speech-to-text + LLM summarization.
  <u><a class="text-light-blue dark:text-dark-blue underline" href="https://github.com/jpalacio0x/timetube" target="_blank">github.com/jpalacio0x/timetube</a></u>

<b>palacioj.com — Terminal Portfolio</b>  <span>— TypeScript</span>
  This site. A terminal-emulator UI built in TypeScript/Next.js.
  <u><a class="text-light-blue dark:text-dark-blue underline" href="https://palacioj.com" target="_blank">palacioj.com</a></u>

<b>JuliosBoots — Minecraft Mod</b>  <span>— Kotlin</span>
  Custom Minecraft mod in Kotlin using the Fabric/Forge modding API,
  extending core game mechanics through JVM bytecode integration.
  <u><a class="text-light-blue dark:text-dark-blue underline" href="https://github.com/jpalacio0x/juliosboots" target="_blank">github.com/jpalacio0x/juliosboots</a></u>

Type 'ghprojects' to list my public GitHub repos live.
`;
};

// Skills
export const skills = async (args: string[]): Promise<string> => {
  return `<u>SKILLS</u>

<b>Languages</b>
  Python · C++ · TypeScript · JavaScript · Kotlin · SQL

<b>Frameworks & Tools</b>
  FastAPI · Node.js · React · Next.js · Docker · Docker Compose
  SQLite · Git · REST APIs · WebSocket · OpenAI-compatible APIs

<b>Focus areas</b>
  Local-first AI · Microservices · RAG pipelines · Home automation
`;
};

// Hire / contact CTA
export const hire = async (args: string[]): Promise<string> => {
  return `<u>LET'S BUILD SOMETHING</u>

I'm open to internships, part-time roles, and interesting collabs —
especially anything around local-first AI, embedded/edge ML, or
developer tooling.

 email    : <u><a class="text-light-blue dark:text-dark-blue underline" href="mailto:${config.email}">${config.email}</a></u>
 phone    : ${config.phone}
 linkedin : <u><a class="text-light-blue dark:text-dark-blue underline" href="https://www.linkedin.com/in/${config.social.linkedin}" target="_blank">linkedin.com/in/${config.social.linkedin}</a></u>
 github   : <u><a class="text-light-blue dark:text-dark-blue underline" href="https://github.com/${config.social.github}" target="_blank">github.com/${config.social.github}</a></u>
 based in : ${config.location}
`;
};

// Contact
export const email = async (args: string[]): Promise<string> => {
  window.open(`mailto:${config.email}`);
  return `Opening mailto:${config.email}...`;
};

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://github.com/${config.social.github}/`);

  return 'Opening github...';
};

export const linkedin = async (args: string[]): Promise<string> => {
  window.open(`https://www.linkedin.com/in/${config.social.linkedin}/`);

  return 'Opening linkedin...';
};

// Search
export const google = async (args: string[]): Promise<string> => {
  window.open(`https://google.com/search?q=${args.join(' ')}`);
  return `Searching google for ${args.join(' ')}...`;
};

export const duckduckgo = async (args: string[]): Promise<string> => {
  window.open(`https://duckduckgo.com/?q=${args.join(' ')}`);
  return `Searching duckduckgo for ${args.join(' ')}...`;
};

export const crafty = async (args: string[]): Promise<string> => {
  window.open(`https://crafty.palacioj.com/${args.join(' ')}`);
  return `Opening Crafty Controller ${args.join(' ')}...`;
};

export const bing = async (args: string[]): Promise<string> => {
  window.open(`https://bing.com/search?q=${args.join(' ')}`);
  return `Wow, really? You are using bing for ${args.join(' ')}?`;
};

export const reddit = async (args: string[]): Promise<string> => {
  window.open(`https://www.reddit.com/search/?q=${args.join(' ')}`);
  return `Searching reddit for ${args.join(' ')}...`;
};

// Typical linux commands
export const echo = async (args: string[]): Promise<string> => {
  return args.join(' ');
};

export const whoami = async (args: string[]): Promise<string> => {
  return `${config.ps1_username}`;
};

export const ls = async (args: string[]): Promise<string> => {
  return `experience
education
projects
skills
resume.pdf
.secrets/`;
};

export const cd = async (args: string[]): Promise<string> => {
  if (args[0] === '.secrets' || args[0] === '.secrets/') {
    return `nice try. type 'jetson' if you're curious.`;
  }
  return `there's only one directory here, and you're already in it.
try 'ls' or 'help'.`;
};

export const date = async (args: string[]): Promise<string> => {
  return new Date().toString();
};

export const vi = async (args: string[]): Promise<string> => {
  return `woah, you still use 'vi'? just try 'vim'.`;
};

export const vim = async (args: string[]): Promise<string> => {
  return `'vim' is so outdated. how about 'nvim'?`;
};

export const nvim = async (args: string[]): Promise<string> => {
  return `'nvim'? too fancy. why not 'emacs'?`;
};

export const emacs = async (args?: string[]): Promise<string> => {
  return `you know what? just use vscode.`;
};

export const sudo = async (args?: string[]): Promise<string> => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // ...I'm sorry
  return `Permission denied: with little power comes... no responsibility? `;
};

// ── easter eggs ────────────────────────────────────────────────
export const jetson = async (args?: string[]): Promise<string> => {
  return `
     ╔══════════════════════════════════════╗
     ║   NVIDIA Jetson Thor — status: ON    ║
     ╠══════════════════════════════════════╣
     ║  llama.cpp ............ running      ║
     ║  home-assistant ....... connected    ║
     ║  orchestrator ......... healthy      ║
     ║  rag-docs ............. 1,204 chunks ║
     ║  voice-pipeline ....... listening    ║
     ║  cloud dependency ..... 0 %          ║
     ╚══════════════════════════════════════╝

 "the cloud is just someone else's computer.
  mine lives on my desk."
`;
};

export const coffee = async (args?: string[]): Promise<string> => {
  return `
      ( (
       ) )
    .______.
    |      |]
    \\      /
     '----'      ☕  fuel acquired. back to shipping.
`;
};

export const andrews = async (args?: string[]): Promise<string> => {
  window.open('https://www.andrews.edu/', '_blank');
  return 'Go Cardinals! Opening andrews.edu...';
};

// Banner
export const banner = (args?: string[]): string => {
  return `

 ███████████    █████████   █████         █████████     █████████  █████    ███████          █████
░░███░░░░░███  ███░░░░░███ ░░███         ███░░░░░███   ███░░░░░███░░███   ███░░░░░███       ░░███
 ░███    ░███ ░███    ░███  ░███        ░███    ░███  ███     ░░░  ░███  ███     ░░███       ░███
 ░██████████  ░███████████  ░███        ░███████████ ░███          ░███ ░███      ░███       ░███
 ░███░░░░░░   ░███░░░░░███  ░███        ░███░░░░░███ ░███          ░███ ░███      ░███       ░███
 ░███         ░███    ░███  ░███      █ ░███    ░███ ░░███     ███ ░███ ░░███     ███  ███   ░███
 █████        █████   █████ ███████████ █████   █████ ░░█████████  █████ ░░░███████░  ░░████████
░░░░░        ░░░░░   ░░░░░ ░░░░░░░░░░░ ░░░░░   ░░░░░   ░░░░░░░░░  ░░░░░    ░░░░░░░     ░░░░░░░░

CS @ Andrews University  ·  SWE Intern @ Synergy Power  ·  Berrien Springs, MI

Type 'help' to see the list of available commands.
Type 'sumfetch' to display summary.
Type 'about' to get to know me, or 'hire' if you want to work together.
`;
};
