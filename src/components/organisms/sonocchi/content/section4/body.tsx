import AdContainer from '@/components/molecules/ad_container';
import Video from '@/components/molecules/video';
import { Box, Stack, Typography } from '@mui/material';
import { t } from 'i18next';

export default function Body() {
    return (
        <Stack sx={{ padding: '16px 0px 64px 0px' }} spacing={4}>
            <Typography lineHeight={4} sx={{ padding: '16px 0px 64px' }}>
                {t('sonocchi.content.sections.section4.text')}
            </Typography>
            <Video
                src={t('sonocchi.content.sections.section4.video.src')}
                title={t('sonocchi.content.sections.section4.video.title')}
            />
            <Box
                sx={{
                    alignSelf: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <AdContainer
                    imageSrc={t(
                        'sonocchi.content.sections.section4.ad.imageSrc'
                    )}
                    imageTitle={t(
                        'sonocchi.content.sections.section4.ad.imageTitle'
                    )}
                    description={t(
                        'sonocchi.content.sections.section4.ad.description'
                    )}
                    ctaLink={t('sonocchi.content.sections.section4.ad.ctaLink')}
                    ctaText={t('sonocchi.content.sections.section4.ad.ctaText')}
                />
            </Box>
        </Stack>
    );
}
