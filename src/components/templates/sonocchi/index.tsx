// src/components/templates/main_template.tsx
import { Box } from '@mui/material';
import Header from '@/components/atoms/header';
import SideBar from '@/components/organisms/sonocchi/side_bar';
import Popup from '@/components/organisms/sonocchi/popup';
import { ReactNode } from 'react';

type MainTemplateProps = {
    children: ReactNode;
    title: string;
};

export default function MainTemplate(props: MainTemplateProps) {
    const { children, title } = props;
    return (
        <Box sx={{ backgroundColor: '#f0f0f0' }}>
            <Header title={title} />
            <Box
                display="flex"
                justifyContent="space-between"
                marginY={2}
                sx={{ padding: '20px' }}
            >
                {children}
            </Box>
            <Popup />
        </Box>
    );
}
