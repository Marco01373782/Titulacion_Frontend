    // src/components/NeuroXUI/NeuroXHeader.tsx

    import React from 'react';
    import { AppBar, Toolbar, Typography, Box } from '@mui/material';

    interface NeuroXHeaderProps {
    title?: string;
    }

    const NeuroXHeader: React.FC<NeuroXHeaderProps> = ({ title = 'NeuroX' }) => {
    return (
        <AppBar position="static" color="primary" elevation={3}>
        <Toolbar>
            <Box display="flex" alignItems="center" width="100%">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                {title}
            </Typography>
            </Box>
        </Toolbar>
        </AppBar>
    );
    };

    export default NeuroXHeader;
