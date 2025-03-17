import { Box } from '@mui/material';

type VideoProps = {
    src: string;
    title: string;
};

export default function Video(props: VideoProps) {
    const { src, title } = props;
    return (
        <Box
            sx={{
                textAlign: 'center',
                marginTop: 3,
                padding: 2,
                backgroundColor: '#ecf0f1',
                borderRadius: 2,
            }}
        >
            <iframe
                src={src}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    height: '450px',
                    borderRadius: '8px',
                }}
                title={title}
            />
        </Box>
    );
}
