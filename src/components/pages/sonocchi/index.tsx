import Content from '@/components/organisms/sonocchi/content';
import Popup from '@/components/organisms/sonocchi/popup';
import Sidebar from '@/components/organisms/sonocchi/side_bar';
import MainTemplate from '@/components/templates/sonocchi';
import SonocchiPageBgm from '@/pages/sonocchi';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <MainTemplate title={t('sonocchi.header.title')}>
            <SonocchiPageBgm />
            <Content />
            <Sidebar />
        </MainTemplate>
    );
}
