// src/types/index.ts

export type ButtonProps = {
    label: string;
    onClick: () => void;
};

export type HeaderProps = {
    title: string;
};

export type TypographyProps = {
    text: string;
    variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2';
};

export type AdContainerProps = {
    imageSrc: string;
    imageTitle: string;
    description: string;
    ctaLink: string;
    ctaText: string;
};

export type PopupProps = {
    isOpen: boolean;
    onClose: () => void;
    content: React.ReactNode;
};

export type AdProps = AdContainerProps;

export type VideoProps = {
    videoUrl: string;
};

export type ContentProps = {
    sections: React.ReactNode[];
};

export type SidebarProps = {
    ads: AdContainerProps[];
};

export type SectionProps = {
    title: string;
    content: React.ReactNode;
};

export type MainTemplateProps = {
    header: React.ReactNode;
    content: React.ReactNode;
    sidebar: React.ReactNode;
};

export type HomePageProps = {
    content: React.ReactNode;
};
