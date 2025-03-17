import Content from '@/components/organisms/sonocchi/content';
import Sidebar from '@/components/organisms/sonocchi/side_bar';
import MainTemplate from '@/components/templates/sonocchi';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
    const { t } = useTranslation();

    return (
        <MainTemplate title={t('sonocchi.header.title')}>
            <Content />
            <Sidebar />
        </MainTemplate>
    );
}
