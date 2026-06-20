import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type SectionProps = {
    title: string;
    content: ReactNode;
};

/**
 * 1セクションをまとめたコンポーネント
 */
export default function Section(props: SectionProps) {
    const { title, content } = props;
    const { t } = useTranslation();

    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h2"
                sx={{
                    color: '#2980b9',
                    borderBottom: '2px solid #2980b9',
                    mb: 2,
                    fontSize: '32px',
                    fontWeight: 'bold',
                }}
            >
                {t(title)}
            </Typography>
            {content}
        </Box>
    );
}
