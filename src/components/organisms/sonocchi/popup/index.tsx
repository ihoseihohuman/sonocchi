import { Popup as PopupComponent } from '@/components/molecules/popup';
import { useCallback, useState } from 'react';
import Body from './body';
import { useTranslation } from 'react-i18next';

export default function Popup() {
    const [open, setOpen] = useState(true);
    const handleClose = useCallback(() => {
        window.open(t('sonocchi.popup.ctaLink'), '_blank');
        setOpen(false);
    }, []);
    const { t } = useTranslation();

    return (
        <PopupComponent
            open={open}
            onClose={handleClose}
            title={t('sonocchi.popup.title')}
            content={<Body onClose={handleClose} />}
            ctaText={t('sonocchi.popup.ctaText')}
            ctaLink={t('sonocchi.popup.ctaLink')}
        />
    );
}
