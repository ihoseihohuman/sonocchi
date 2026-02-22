import images from '@/assets/images';
import AdContainer from '@/components/molecules/ad_container';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';

export default function Body() {
    return (
        <Box sx={{ padding: '16px 0px 64px 0px' }}>
            <Typography lineHeight={4} sx={{ padding: '16px 0px 64px' }}>
                {t('sonocchi.content.sections.section5.text')}
            </Typography>
            <Box
                sx={{
                    background: '#d9d9d9',
                    borderRadius: '16px',
                }}
            >
                <Typography lineHeight={4} sx={{ px: 2 }}>
                    {(
                        t('sonocchi.content.sections.section5.reactions', {
                            returnObjects: true,
                        }) as string[]
                    ).map((reaction: string, index: number) => (
                        <div key={index}>
                            <em>"{reaction}"</em>
                        </div>
                    ))}
                </Typography>
            </Box>
            <Box
                sx={{
                    paddingTop: '32px',
                    alignSelf: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <AdContainer
                    imageSrc={
                        images[
                            t('sonocchi.content.sections.section5.ad.imageSrc')
                        ]
                    }
                    imageTitle={t(
                        'sonocchi.content.sections.section5.ad.imageTitle'
                    )}
                    description={t(
                        'sonocchi.content.sections.section5.ad.description'
                    )}
                    ctaLink={t('sonocchi.content.sections.section5.ad.ctaLink')}
                    ctaText={t('sonocchi.content.sections.section5.ad.ctaText')}
                />
            </Box>
        </Box>
    );
}
