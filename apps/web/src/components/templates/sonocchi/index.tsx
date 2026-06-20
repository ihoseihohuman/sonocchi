// src/components/templates/main_template.tsx
import { Box, Button } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Header from '@/components/atoms/header';
import SideBar from '@/components/organisms/sonocchi/side_bar';
import Popup from '@/components/organisms/sonocchi/popup';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type MainTemplateProps = {
    children: ReactNode;
    title: string;
};

export default function MainTemplate(props: MainTemplateProps) {
    const { children, title } = props;
    const { t } = useTranslation();
    // ゲームは別アプリ(/sonocchi/game/)。BASE_URL を基準にリンクする。
    const gameUrl = `${import.meta.env.BASE_URL}game/`;
    return (
        <Box sx={{ backgroundColor: '#f0f0f0', position: 'relative' }}>
            <Popup />
            <Header title={title} />
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '14px 8px 4px' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    href={gameUrl}
                    startIcon={<SportsEsportsIcon />}
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '18px',
                        borderRadius: '999px',
                        px: 4,
                        py: 1.5,
                        boxShadow: '0 4px 14px rgba(243, 156, 18, 0.5)',
                    }}
                >
                    🎳 {t('common.play_game')}
                </Button>
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                marginY={2}
                sx={{ padding: '8px' }}
            >
                {children}
            </Box>
        </Box>
    );
}
