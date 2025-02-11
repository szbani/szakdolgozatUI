//@ts-nocheck

import {createTheme} from "@mui/material";

export const MainTheme = createTheme({
    "colorSchemes": {
        "light": {
            "palette": {
                "mode": 'light',
                "primary": {
                    "main": "#1B6B51",
                },
                "secondary": {
                    "main": "#4C6358",
                },
                "background": {
                    "default": "#d8eade",
                    "paper": "#f5fbf5",
                    "cards": "#eff5f0",
                },
                "text": {
                    "primary": "#000000",
                    "secondary": "#4C6358",
                },
                "error": {
                    "main": "#ba1a1a",
                    "light": "#ffdad6",
                    "dark": "#410002",
                    // "200": "#690005",
                    // "300": "#93000a",
                    // "400": "#ba1a1a",
                    // "800": "#ffb4ab",
                    // "900":"#ffdad6",
                },
                "success": {
                    "main": "#008000",
                }
            },
        },
        "dark": {
            "palette": {
                "mode": 'dark',
                "primary": {
                    "main": "#8BD6B6",
                },
                "secondary": {
                    "main": "#B3CCBF",
                },
                "background": {
                    "default": "#354b41",
                    "paper": "#303633",
                    "cards": "#2b2f2c",
                },
                "text": {
                    "primary": "#FFFFFF",
                    "secondary": "#B3CCBF",
                },
                "error": {
                    "main": "#93000a",
                    "light": "#ffdad6",
                    "dark": "#690005",
                }
            },
        },
    },
    "typography": {
        "h4": {
            "fontSize": '2.5rem',
            "fontWeight": 500,
        },
        "h6": {
            "fontSize": '1.5rem',
            "fontWeight": 400,
        },
        "subtitle1": {
            "fontSize": '1.2rem',
            "fontWeight": 300,
        },
        "subtitle2": {
            "fontSize": '1rem',
            "fontWeight": 300,
        },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: ({theme}) => ({
                    "&:hover": {
                        backgroundColor: theme.palette.mode == 'light' ?
                            'rgba(0,0,0,0.05)' :
                            'rgba(255,255,255,0.1)',
                        borderRadius: "12px"
                    },
                    transition: "background-color 0.2s",
                    borderRadius: "12px"
                }),
            }
        },
        MuiCard: {
            styleOverrides: {
                root: ({theme}) => ({
                    backgroundColor: theme.palette.mode == "light" ?
                        "#eff5f0" :
                        "#2b2f2c",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
                }),
            }
        },
        MuiButton: {
            styleOverrides: {
                root: ({theme}) => ({
                    borderRadius: "12px",
                    padding: "6px 16px",
                    backgroundColor: theme.palette.mode == 'light' ?
                        "#3daa82" :
                        '#8BD6B6',
                    color: theme.palette.mode == 'light' ?
                        "#FFFFFF" :
                        '#303633',
                    "&:hover": {
                        backgroundColor: theme.palette.mode == 'light' ?
                            "#2b8a67" :
                            '#6e9b8b',
                    },
                    "&:active": {
                        backgroundColor: theme.palette.mode == 'light' ?
                            "#1b6b51" :
                            '#4c6358',
                    },
                    "&:disabled": {
                        backgroundColor: theme.palette.mode == 'light' ?
                            "#c5e4d8" :
                            '#c3d8cd',
                        color: theme.palette.mode == 'light' ?
                            "#FFFFFF" :
                            '#555e5a',
                    }
                }),
            }
        }
    },
});
export default MainTheme;
