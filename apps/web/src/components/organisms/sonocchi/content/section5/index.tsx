import Section from '@/components/molecules/section';
import { useTranslation } from 'react-i18next';
import Body from './body';

export default function Section5() {
    const { t } = useTranslation();
    return (
        <Section
            title={t('sonocchi.content.sections.section5.title')}
            content={<Body />}
        />
    );
}
