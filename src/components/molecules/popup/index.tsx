import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';

type PopupProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    content: ReactNode;
    ctaText: string;
    ctaLink: string;
    dummyLink: string;
    onClickDummyLink: () => void;
};

export function Popup(props: PopupProps) {
    const { t } = useTranslation();
    const {
        open,
        onClose,
        title,
        content,
        ctaText,
        ctaLink,
        dummyLink,
        onClickDummyLink,
    } = props;

    const handleClickPupUpButton = useCallback(() => {
        window.open(dummyLink, '_blank');
        onClickDummyLink();
    }, [dummyLink, onClickDummyLink]);

    return (
        <Dialog open={open} onClose={() => {}}>
            <DialogTitle>{t(title)}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Button onClick={handleClickPupUpButton} color="primary">
                    {t(ctaText)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default { Popup };
