import images from '@/assets/images';
import AdContainer from '@/components/molecules/ad_container';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';

export default function Body() {
    return (
        <Box sx={{ padding: '16px 0px 64px 0px' }}>
            <Typography lineHeight={4} sx={{ padding: '16px 0px 64px' }}>
                {t('sonocchi.content.sections.section2.text')}
            </Typography>
            <Box
                sx={{
                    alignSelf: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <AdContainer
                    imageSrc={
                        images[
                            t('sonocchi.content.sections.section2.ad.imageSrc')
                        ]
                    }
                    imageTitle={t(
                        'sonocchi.content.sections.section2.ad.imageTitle'
                    )}
                    description={t(
                        'sonocchi.content.sections.section2.ad.description'
                    )}
                    ctaLink={t('sonocchi.content.sections.section2.ad.ctaLink')}
                    ctaText={t('sonocchi.content.sections.section2.ad.ctaText')}
                />
            </Box>
        </Box>
    );
}
