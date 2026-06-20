import AdContainer from '@/components/molecules/ad_container';
import { AdProps } from '@/types';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type SidebarProps = {
    ads: AdProps[];
};

/**
 * サイドバー
 */
export function Sidebar(props: SidebarProps) {
    const { t } = useTranslation();
    const { ads } = props;

    return (
        <Box
            sx={{
                flex: '0 0 320px',
                backgroundColor: '#fff',
                padding: '20px',
                boxShadow: '-3px 0 10px rgba(0, 0, 0, 0.2)',
                borderLeft: '3px solid #ddd',
                position: 'sticky',
                top: 0,
                zIndex: 999,
                height: 'fit-content',
            }}
        >
            <Typography
                variant="h2"
                sx={{ color: '#2980b9', marginBottom: '10px' }}
            >
                {t('common.related_ads')}
            </Typography>
            {ads.map((ad, index) => (
                <AdContainer
                    key={index}
                    imageSrc={ad.imageSrc}
                    imageTitle={ad.imageTitle}
                    description={ad.description}
                    ctaLink={ad.ctaLink}
                    ctaText={ad.ctaText}
                />
            ))}
        </Box>
    );
}

export default { Sidebar };
