import images from '@/assets/images';
import { Sidebar as SidebarComponent } from '@/components/molecules/sidebar';
import { AdProps } from '@/types';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t } = useTranslation();
    const ads: AdProps[] = [
        {
            imageSrc: images[t('sonocchi.side_bar.ad1.imageSrc')],
            imageTitle: t('sonocchi.side_bar.ad1.title'),
            description: t('sonocchi.side_bar.ad1.description'),
            ctaLink: t('sonocchi.side_bar.ad1.ctaLink'),
            ctaText: t('sonocchi.side_bar.ad1.ctaText'),
        },
        {
            imageSrc: images[t('sonocchi.side_bar.ad2.imageSrc')],
            imageTitle: t('sonocchi.side_bar.ad2.title'),
            description: t('sonocchi.side_bar.ad2.description'),
            ctaLink: t('sonocchi.side_bar.ad2.ctaLink'),
            ctaText: t('sonocchi.side_bar.ad2.ctaText'),
        },
    ];

    return <SidebarComponent ads={ads} />;
}
