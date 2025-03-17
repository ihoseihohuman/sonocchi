import Button from '@/components/atoms/button';
import { Box, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type AdContainerProps = {
    imageSrc: string;
    imageTitle: string;
    description: string;
    ctaLink: string;
    ctaText: string;
};

export default function AdContainer(props: AdContainerProps) {
    const { imageSrc, imageTitle, description, ctaLink, ctaText } = props;
    const { t } = useTranslation();
    const handleClick = useCallback(() => {
        window.open(ctaLink, '_blank');
    }, [ctaLink]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: '#ecf0f1',
                borderRadius: 2,
                padding: 2,
                boxShadow: 1,
                maxWidth: '600px',
                alignSelf: 'center',
            }}
        >
            <img
                src={imageSrc}
                alt={imageTitle}
                style={{
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '600px',
                    alignSelf: 'center',
                }}
            />
            <Typography variant="h6" color="primary">
                {t(imageTitle)}
            </Typography>
            <Typography variant="body1">{t(description)}</Typography>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleClick}
                label={ctaText}
                sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: 'fit-content',
                }}
            />
        </Box>
    );
}
