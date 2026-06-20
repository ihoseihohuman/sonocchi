import { Button as MuiButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ButtonProps as MuiButtonProps } from '@mui/material/Button';

type ButtonProps = MuiButtonProps & {
    label: string;
    onClick: VoidFunction;
};

export default function Button(props: ButtonProps) {
    const { label, onClick, variant = 'contained', ...buttonProps } = props;
    const { t } = useTranslation();

    return (
        <MuiButton variant={variant} onClick={onClick} {...buttonProps}>
            {t(label)}
        </MuiButton>
    );
}
