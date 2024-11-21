import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function ColorSchemeToggle(props: IconButtonProps) {
    const { onClick, sx, ...other } = props;
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (
            <IconButton
                variant="outlined"
                color="neutral"
                {...other}
                sx={sx}
                disabled
            />
        );
    }
    return (
        <IconButton
            data-screenshot="toggle-mode"
            variant="outlined"
            color="neutral"
            {...other}
            onClick={(event) => {
                if (mode === 'light') {
                    setMode('dark');
                } else {
                    setMode('light');
                }
                onClick?.(event);
            }}
            sx={[
                mode === 'dark'
                    ? { '& > *:first-child': { display: 'none' } }
                    : { '& > *:first-child': { display: 'initial' } },
                mode === 'light'
                    ? { '& > *:last-child': { display: 'none' } }
                    : { '& > *:last-child': { display: 'initial' } },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <DarkModeRoundedIcon />
            <LightModeIcon />
        </IconButton>
    );
}