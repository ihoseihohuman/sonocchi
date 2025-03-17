import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type PopupProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    content: ReactNode;
    ctaText: string;
    ctaLink: string;
};

export function Popup(props: PopupProps) {
    const { t } = useTranslation();
    const { open, onClose, title, content, ctaText, ctaLink } = props;

    const handleClick = useCallback(() => {
        window.open(ctaLink, '_blank');
    }, [ctaLink]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t(title)}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Button onClick={handleClick} color="primary">
                    {t(ctaText)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default { Popup };
