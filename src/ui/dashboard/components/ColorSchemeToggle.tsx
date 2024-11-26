import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

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
                {...other}
                sx={sx}
                disabled
            />
        );
    }
    return (
        <IconButton
            aria-label="toggle light/dark mode"
            disabled={!mounted}
            onClick={(event) => {
                setMode(mode === 'light' ? 'dark' : 'light');
                onClick?.(event);
            }}
            {...other}
        >
            {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>
    );
}