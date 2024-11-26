import * as React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {useNavigate} from "react-router-dom";
import {loadConfig} from "../../config.ts";
import {useEffect} from "react";
import ColorSchemeToggle from "../dashboard/components/ColorSchemeToggle.tsx";


interface FormElements extends HTMLFormControlsCollection {
    username: HTMLInputElement;
    password: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

export default function SignInUI() {
    const navigate = useNavigate();
    const [loginUrl, setLoginUrl] = React.useState<string | undefined>(undefined);

        useEffect(() => {
            const setWebsocketURL = async () => {
                try {
                    const config = await loadConfig();
                    try {
                        if (config !== null) {
                            console.log('Loading Ws Config');
                            setLoginUrl(`${config.websocket}/api/auth/login`);
                        }
                    } catch (error) {
                        console.error('Error Loading config:1:', error);
                    }
                } catch (error) {
                    console.error('Error loading config:2:', error);
                }
            }
            setWebsocketURL();
        }, []);


    const SignIn =  async (username:string, password:string) => {
        console.log('Logging in');
        // @ts-ignore
        const result = await fetch(loginUrl,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username, password}),
        });

        if (result.ok) {
            console.log('Logged in');
            sessionStorage.setItem('loggedIn', String(result.ok));
            navigate('/displays', { replace: true });
        } else {
            console.log('Failed to login');
        }

    };
    return (
        <Box>
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': '0.4s', // set to `none` to disable transition
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: { xs: '100%', md: '50vw' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: theme.palette.mode == 'light' ? 'rgba(255 255 255 / 0.2)':
                        'rgba(19 19 24 / 0.4)',
                })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: '100%',
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                            <Typography>Display Manager</Typography>
                        </Box>
                        <ColorSchemeToggle />
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: 'auto',
                            py: 2,
                            pb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 400,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden',
                            },
                        }}
                    >
                        <Stack sx={{ gap: 4, mb: 2 }}>
                            <Stack sx={{ gap: 1 }}>
                                <Typography component="h1">
                                    Sign in
                                </Typography>
                                <Typography>
                                    Having trouble signing in? Contact an administrator.
                                </Typography>
                            </Stack>
                        </Stack>
                        <Divider />
                        <Stack sx={{ gap: 4, mt: 2 }}>
                            <form
                                onSubmit={(event: React.FormEvent<SignInFormElement>) => {
                                    event.preventDefault();
                                    const formElements = event.currentTarget.elements;
                                    const data = {
                                        username: formElements.username.value,
                                        password: formElements.password.value,
                                    };
                                    SignIn(data.username, data.password).then(() => {});
                                }}
                            >
                                <FormControl required>
                                    <FormLabel>Username</FormLabel>
                                    <Input type="text" name="username" />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" name="password" />
                                </FormControl>
                                <Stack sx={{ gap: 4, mt: 2 }}>
                                    <Button type="submit" fullWidth>
                                        Sign in
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Box>
                    {/*<Box component="footer" sx={{ py: 3 }}>*/}
                    {/*    <Typography sx={{ textAlign: 'center' }}>*/}
                    {/*        © Your company {new Date().getFullYear()}*/}
                    {/*    </Typography>*/}
                    {/*</Box>*/}
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: '50vw' },
                    transition:
                        'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: theme.palette.mode === "light" ?
                        'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)':
                            'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',

                })}
            />
        </Box>
    );
}