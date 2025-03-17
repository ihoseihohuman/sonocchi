import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Button from '../button';
import { useCallback } from 'react';

export type AdCardProps = {
    imgSrc: string;
    title: string;
    description: string;
    link: string;
};

export default function AdCard(props: AdCardProps) {
    const { imgSrc, title, description, link } = props;
    const handleClick = useCallback(() => {
        window.open(link, '_blank');
    }, [link]);

    return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image={imgSrc}
                alt={title}
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                <Button onClick={handleClick} label="詳細はこちら" />
            </CardContent>
        </Card>
    );
}
