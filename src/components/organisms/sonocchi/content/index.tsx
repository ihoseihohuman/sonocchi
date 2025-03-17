import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Section from '@/components/molecules/section';
import Section1 from './section1';
import Section2 from './section2';
import Section3 from './section3';
import Section4 from './section4';
import Section5 from './section5';

type ContentProps = {};

const Content: React.FC<ContentProps> = (props) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                padding: '56px',
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <Typography
                variant="body1"
                sx={{ marginBottom: 2, padding: '16px 0px 64px' }}
                lineHeight={4}
            >
                {t('sonocchi.content.introduction')}
            </Typography>
            <Section1 />
            <Section2 />
            <Section3 />
            <Section4 />
            <Section5 />
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                <Typography variant="h6">{t('sonocchi.footer')}</Typography>
            </Box>
        </Box>
    );
};

export default Content;
