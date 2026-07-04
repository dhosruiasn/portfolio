export const resumeData = {
  cv: {
    zh: {
      file: 'cv/Doris_Kao_CV_ZH.pdf',
      viewLabel: '查看履歷',
      downloadLabel: '下載 PDF 履歷',
    },
    en: {
      file: 'cv/Doris_Kao_CV_EN.pdf',
      viewLabel: 'VIEW CV',
      downloadLabel: 'DOWNLOAD CV',
    },
  },
  portrait: {
    src: '/images/about/cv Portrait.jpg',
  },
  contact: [
    {
      id: 'email',
      label: { zh: 'Email', en: 'Email' },
      value: 'doris.kao20000619@gmail.com',
      href: 'mailto:doris.kao20000619@gmail.com',
    },
    {
      id: 'location',
      label: { zh: 'Location', en: 'Location' },
      value: 'Taipei, Taiwan',
    },
  ],
  links: [
    {
      id: 'github',
      label: { zh: 'GitHub', en: 'GitHub' },
      value: 'dhosruiasn',
      href: 'https://github.com/dhosruiasn',
    },
    {
      id: 'portfolio',
      label: { zh: 'Portfolio', en: 'Portfolio' },
      value: 'Wix Portfolio',
      href: 'https://ning888ning3050.wixsite.com/dorisme/mybrand',
    },
  ],
  zh: {
    ariaLabel: 'About / CV 履歷區塊',
    portraitAlt: '個人照片或品牌視覺預留位置',
    portraitLabel: 'Portrait / brand visual',
    role: '品牌視覺設計師',
    location: 'Taipei, Taiwan',
    title: 'DORIS KAO',
    positioning: '品牌視覺設計師，結合數位介面與 AI 輔助實作',
    intro: '品牌視覺設計師，專注於品牌系統、數位介面與互動體驗。',
    profile:
      '具備近 5 年品牌與視覺設計經驗，曾於蝦皮購物負責數位素材、品牌合作、IP 商品與大型線下活動視覺。擅長將品牌概念轉化為可跨媒介延展的視覺語言，近期並透過 AI 與 VibeCoding，將設計能力延伸至 Web App、互動工具與品牌電商網站。',
    labels: {
      profile: 'PROFILE',
      projects: 'SELECTED PROJECTS',
      expertise: 'CORE EXPERTISE',
      tools: 'TOOLS',
      experience: 'EXPERIENCE',
      contact: 'CONTACT',
      links: 'LINKS',
      viewProject: '查看',
    },
    expertise: [
      { id: 'brand', number: '01', title: 'Brand Identity', detail: '品牌識別與視覺系統' },
      { id: 'direction', number: '02', title: 'Art Direction', detail: '視覺概念與設計方向' },
      { id: 'campaign', number: '03', title: 'Digital Campaign', detail: '數位活動視覺' },
      { id: 'ui', number: '04', title: 'UI & Interaction', detail: 'UI 與互動設計' },
      { id: 'motion', number: '05', title: 'Motion Design', detail: '動態與數位體驗' },
      { id: 'ai', number: '06', title: 'AI-assisted Design', detail: 'AI 輔助設計／VibeCoding' },
    ],
    tools: [
      {
        id: 'design',
        title: 'DESIGN',
        items: [
          { id: 'illustrator', label: 'Adobe Illustrator' },
          { id: 'photoshop', label: 'Adobe Photoshop' },
          { id: 'figma', label: 'Figma' },
        ],
      },
      {
        id: 'ai-development',
        title: 'AI & DEVELOPMENT',
        items: [
          { id: 'claude', label: 'Claude' },
          { id: 'codex', label: 'Codex' },
          { id: 'react', label: 'React' },
          { id: 'vite', label: 'Vite' },
          { id: 'nextjs', label: 'Next.js' },
          { id: 'git', label: 'Git' },
        ],
      },
    ],
    experience: {
      companyHeading: '蝦皮購物 SHOPEE TAIWAN',
      roles: [
        {
          id: 'shopee-graphic-designer',
          title: '平面設計師',
          period: '2022.08 — 2026.06',
          responsibilities: [
            { id: 'brand-campaign', label: '品牌、活動與數位視覺設計' },
            { id: 'ip-merchandise', label: 'IP 商品與跨媒介延伸' },
            { id: 'offline-retail', label: '大型線下活動與全台門市觸點' },
            { id: 'ai-workflow', label: 'AI 輔助工作流程與內部工具' },
          ],
        },
        {
          id: 'shopee-design-intern',
          title: '設計實習生',
          period: '2021.10 — 2022.08',
          responsibilities: [
            { id: 'ecommerce-brand', label: '協助電商與品牌視覺設計' },
            { id: 'campaign-assets', label: '製作數位及線下活動素材' },
            { id: 'cross-team-support', label: '支援活動與跨部門設計需求' },
          ],
        },
      ],
    },
    projects: [
      {
        id: 'pickmin',
        number: '01',
        title: 'PICKMIN POSTCARDS',
        meta: 'Product Design / Design System / VibeCoding',
      },
      {
        id: 'ui-tweaker',
        number: '02',
        title: 'UI TWEAKER',
        meta: 'Tool Design / Interaction Design / AI Plugin',
      },
      {
        id: 'googoolii',
        number: '03',
        title: 'GOOGOOLII',
        meta: 'Brand Strategy / E-commerce / Interactive Experience',
      },
    ],
  },
  en: {
    ariaLabel: 'About / CV resume section',
    portraitAlt: 'Portrait or brand visual placeholder',
    portraitLabel: 'Portrait / brand visual',
    role: 'Brand Visual Designer',
    location: 'Taipei, Taiwan',
    title: 'DORIS KAO',
    positioning: 'Brand Visual Designer with a Digital & AI-assisted Practice',
    intro: 'I focus on brand systems, digital interfaces, and interactive experiences.',
    profile:
      'With nearly five years of experience in brand and visual design, I worked at Shopee Taiwan across digital campaigns, brand collaborations, IP merchandise, and large-scale offline events. I translate brand concepts into adaptable visual systems and have recently expanded my practice into web apps, interactive tools, and e-commerce experiences through AI-assisted and VibeCoding workflows.',
    labels: {
      profile: 'PROFILE',
      projects: 'SELECTED PROJECTS',
      expertise: 'CORE EXPERTISE',
      tools: 'TOOLS',
      experience: 'EXPERIENCE',
      contact: 'CONTACT',
      links: 'LINKS',
      viewProject: 'VIEW',
    },
    expertise: [
      { id: 'brand', number: '01', title: 'Brand Identity', detail: 'Brand identity & visual systems' },
      { id: 'direction', number: '02', title: 'Art Direction', detail: 'Visual concepts & design direction' },
      { id: 'campaign', number: '03', title: 'Digital Campaign', detail: 'Digital campaign visuals' },
      { id: 'ui', number: '04', title: 'UI & Interaction', detail: 'UI & interaction design' },
      { id: 'motion', number: '05', title: 'Motion Design', detail: 'Motion & digital experiences' },
      { id: 'ai', number: '06', title: 'AI-assisted Design', detail: 'AI-assisted design / VibeCoding' },
    ],
    tools: [
      {
        id: 'design',
        title: 'DESIGN',
        items: [
          { id: 'illustrator', label: 'Adobe Illustrator' },
          { id: 'photoshop', label: 'Adobe Photoshop' },
          { id: 'figma', label: 'Figma' },
        ],
      },
      {
        id: 'ai-development',
        title: 'AI & DEVELOPMENT',
        items: [
          { id: 'claude', label: 'Claude' },
          { id: 'codex', label: 'Codex' },
          { id: 'react', label: 'React' },
          { id: 'vite', label: 'Vite' },
          { id: 'nextjs', label: 'Next.js' },
          { id: 'git', label: 'Git' },
        ],
      },
    ],
    experience: {
      companyHeading: 'SHOPEE TAIWAN',
      roles: [
        {
          id: 'shopee-graphic-designer',
          title: 'Graphic Designer',
          period: '2022.08 — 2026.06',
          responsibilities: [
            { id: 'brand-campaign', label: 'Brand, campaign, and digital visual design' },
            { id: 'ip-merchandise', label: 'IP merchandise and cross-media applications' },
            { id: 'offline-retail', label: 'Large-scale events and nationwide retail touchpoints' },
            { id: 'ai-workflow', label: 'AI-assisted workflows and internal tools' },
          ],
        },
        {
          id: 'shopee-design-intern',
          title: 'Design Intern',
          period: '2021.10 — 2022.08',
          responsibilities: [
            { id: 'ecommerce-brand', label: 'Supported e-commerce and brand visual design' },
            { id: 'campaign-assets', label: 'Produced digital and offline campaign assets' },
            { id: 'cross-team-support', label: 'Assisted event and cross-team design requests' },
          ],
        },
      ],
    },
    projects: [
      {
        id: 'pickmin',
        number: '01',
        title: 'PICKMIN POSTCARDS',
        meta: 'Product Design / Design System / VibeCoding',
      },
      {
        id: 'ui-tweaker',
        number: '02',
        title: 'UI TWEAKER',
        meta: 'Tool Design / Interaction Design / AI Plugin',
      },
      {
        id: 'googoolii',
        number: '03',
        title: 'GOOGOOLII',
        meta: 'Brand Strategy / E-commerce / Interactive Experience',
      },
    ],
  },
};
