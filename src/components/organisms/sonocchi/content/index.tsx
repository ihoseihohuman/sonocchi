import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import Section from '@/components/molecules/section';
import Section1 from './section1';
import Section2 from './section2';
import Section3 from './section3';
import Section4 from './section4';
import Section5 from './section5';
import SonocchiPageBgm from '@/pages/sonocchi';
import Button from '@/components/atoms/button';

type ContentProps = {};

const Content: React.FC<ContentProps> = (props) => {
    const { t } = useTranslation();

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'ja' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    return (
        <Box
            sx={{
                padding: '56px',
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: 1,
                marginRight: '8px',
            }}
        >
            <SonocchiPageBgm />
            <Button
                onClick={toggleLanguage}
                variant="contained"
                color="primary"
                style={{ fontSize: '16px', padding: '10px 20px' }}
                label={t('common.switchLanguage')}
            />
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
