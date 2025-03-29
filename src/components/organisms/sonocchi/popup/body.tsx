import images from '@/assets/images';
import AdContainer from '@/components/molecules/ad_container';
import { Box } from '@mui/material';
import { t } from 'i18next';

type BodyProps = {
    onClick?: () => void;
};

export default function Body(props: BodyProps) {
    const { onClick } = props;
    return (
        <Box
            sx={{
                alignSelf: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AdContainer
                imageSrc={
                    images[t('sonocchi.content.sections.section5.ad.imageSrc')]
                }
                imageTitle={t(
                    'sonocchi.content.sections.section5.ad.imageTitle'
                )}
                description={t(
                    'sonocchi.content.sections.section5.ad.description'
                )}
                ctaLink={t('sonocchi.content.sections.section5.ad.ctaLink')}
                ctaText={t('sonocchi.content.sections.section5.ad.ctaText')}
                onClick={onClick}
            />
        </Box>
    );
}
