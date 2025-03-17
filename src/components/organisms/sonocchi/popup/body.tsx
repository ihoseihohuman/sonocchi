import AdContainer from '@/components/molecules/ad_container';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import { t } from 'i18next';

type BodyProps = {
    onClose: VoidFunction;
};

export default function Body(props: BodyProps) {
    const { onClose } = props;
    return (
        <>
            <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                aria-label="close"
            >
                <CloseIcon />
            </IconButton>
            <Box
                sx={{
                    alignSelf: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <AdContainer
                    imageSrc={t(
                        'sonocchi.content.sections.section5.ad.imageSrc'
                    )}
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
        </>
    );
}
