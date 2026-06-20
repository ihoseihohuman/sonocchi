import { Popup as PopupContent } from '@/components/molecules/popup';
import { useCallback, useState } from 'react';
import Body from './body';
import { useTranslation } from 'react-i18next';
import { Box, IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

export default function Popup() {
    const [open, setOpen] = useState(true);
    const handleClose = useCallback(() => {
        window.open(t('sonocchi.popup.dummyLink'), '_blank');
        setOpen(false);
    }, [setOpen]);
    const { t } = useTranslation();

    const handleClickBackDrop = () => {};

    const handleClickDummyLink = handleClose;

    return (
        <>
            {open && (
                <IconButton
                    sx={{
                        position: 'absolute', // 絶対位置
                        top: 8, // 上から16pxの位置
                        left: 8, // 左から16pxの位置
                        zIndex: 1500, // `Dialog`のバックドロップが1300のzIndexを持つため、少し高い値に設定
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon sx={{ color: 'gray' }} />
                </IconButton>
            )}
            <PopupContent
                open={open}
                onClose={handleClickBackDrop}
                title={t('sonocchi.popup.title')}
                content={<Body onClick={handleClose} />}
                ctaText={t('sonocchi.popup.ctaText')}
                ctaLink={t('sonocchi.popup.ctaLink')}
                dummyLink={t('sonocchi.popup.dummyLink')}
                onClickDummyLink={handleClickDummyLink}
            />
        </>
    );
}
