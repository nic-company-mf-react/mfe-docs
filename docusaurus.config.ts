import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'React MultiRepo MFE Boilerplate',
  tagline: '멀티레포 환경에서 React기반 마이크로 프론트엔드(Micro Frontend) 아키텍처 구현을 위한 예제 및 기본 코드 골격 프로젝트입니다.',
  favicon: 'img/logo.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'http://redsky0212.dothome.co.kr',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/2026/mfe-multirepo/guide/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'MultiRepo MFE Boilerplate',
      logo: {
        alt: 'MultiRepo MFE Boilerplate Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          label: "Getting Started",
          type: "docSidebar",
          position: "left",
          sidebarId: "startDocSidebar",
        },
        {
          label: 'Docs',
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'documentDocSidebar',
        },
        {
          label: 'Components',
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'componentsDocSidebar',
        },
        {
          label: 'API Reference',
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'apiDocSidebar',
        },
        {
          href: 'http://example.com',
          label: 'Example',
          position: 'left',
        },
        {
          label: 'Micro Frontend 프로젝트 준비(common)',
          type: 'docSidebar',
          position: 'right',
          sidebarId: 'taskDocSidebar',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: '소개',
              to: '/docs/intro',
            },
            {
              label: '개발환경구성',
              to: '/docs/intro',
            },
            {
              label: '개발구조 및 규칙',
              to: '/docs/intro',
            },
            {
              label: '개발 가이드',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'UI Components',
          items: [
            {
              label: 'Accordion',
              to: '/docs/components',
            },
            {
              label: 'Alert Dialog',
              to: '/docs/components',
            },
            {
              label: 'Button',
              to: '/docs/components',
            },
          ],
        },
        {
          title: 'API Reference',
          items: [
            {
              label: 'Functions',
              to: '/docs/intro',
            },
            {
              label: 'Objects',
              to: '/docs/intro',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Redsky Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
