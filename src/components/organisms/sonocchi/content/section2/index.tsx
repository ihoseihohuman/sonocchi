import Section from '@/components/molecules/section';
import { useTranslation } from 'react-i18next';
import Body from './body';

export default function Section2() {
    const { t } = useTranslation();
    return (
        <Section
            title={t('sonocchi.content.sections.section2.title')}
            content={<Body />}
        />
    );
}
