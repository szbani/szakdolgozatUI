import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, {listItemButtonClasses} from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import ColorSchemeToggle from './ColorSchemeToggle';
import {closeSidebar} from '../utils.tsx';
import {ComputerRounded, FolderRounded} from "@mui/icons-material";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import {NavLink} from "react-router-dom";

// import {Websocket} from "../../../websocket/WebSocketBase.ts";

function Toggler({
                     defaultExpanded = false,
                     renderToggle,
                     children,
                 }: {
    defaultExpanded?: boolean;
    children: React.ReactNode;
    renderToggle: (params: {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }) => React.ReactNode;
}) {
    const [open, setOpen] = React.useState(defaultExpanded);
    return (
        <React.Fragment>
            {renderToggle({open, setOpen})}
            <Box
                sx={[
                    {
                        display: 'grid',
                        transition: '0.2s ease',
                        '& > *': {
                            overflow: 'hidden',
                        },
                    },
                    open ? {gridTemplateRows: '1fr'} : {gridTemplateRows: '0fr'},
                ]}
            >
                {children}
            </Box>
        </React.Fragment>
    );
}

export default function Sidebar() {
    //@ts-ignore
    const {clients} = useWebSocketContext();
    // @ts-ignore
    const [currentTab, setCurrentTab] = React.useState('home');

    // React.useEffect(() => {
    //     getConnectedUsers();
    // }, []);

    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: {xs: 'fixed', md: 'sticky'},
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',
                zIndex: 10000,
                height: '100dvh',
                width: 'var(--Sidebar-width)',
                top: 0,
                p: 2,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '220px',
                        [theme.breakpoints.up('lg')]: {
                            '--Sidebar-width': '240px',
                        },
                    },
                })}
            />
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: 'fixed',
                    zIndex: 9998,
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    opacity: 'var(--SideNavigation-slideIn)',
                    backgroundColor: 'var(--joy-palette-background-backdrop)',
                    transition: 'opacity 0.4s',
                    transform: {
                        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
                        lg: 'translateX(-100%)',
                    },
                }}
                onClick={() => closeSidebar()}
            />
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                <Typography level="title-lg">Display Manager.</Typography>
                <ColorSchemeToggle sx={{ml: 'auto'}}/>
            </Box>
            <Input size="sm" startDecorator={<SearchRoundedIcon/>} placeholder="Search"/>
            <Box
                sx={{
                    minHeight: 0,
                    overflow: 'hidden auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                    },
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 1,
                        '--List-nestedInsetStart': '30px',
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                    }}
                >
                    <ListItem>
                        <ListItemButton component={NavLink} to={"/"} >
                            <HomeRoundedIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">Home</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton id={'Onlinedisplays'} component={NavLink} to={"displays"}>
                            <ComputerRounded/>
                            <ListItemContent>
                                <Typography level="title-sm">Displays</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton selected>
                            <FolderRounded/>
                            <ListItemContent>
                                <Typography level="title-sm">Files</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                    <ListItem nested>
                        <Toggler
                            renderToggle={({open, setOpen}) => (
                                <ListItemButton onClick={() => setOpen(!open)}>
                                    <GroupRoundedIcon/>
                                    <ListItemContent>
                                        <Typography level="title-sm">Users</Typography>
                                    </ListItemContent>
                                    <KeyboardArrowDownIcon
                                        sx={[
                                            open
                                                ? {
                                                    transform: 'rotate(180deg)',
                                                }
                                                : {
                                                    transform: 'none',
                                                },
                                        ]}
                                    />
                                </ListItemButton>
                            )}
                        >
                            <List sx={{gap: 0.5}}>
                                <ListItem sx={{mt: 0.5}}>
                                    <ListItemButton
                                        role="menuitem"
                                        component="a"
                                        href="/joy-ui/getting-started/templates/profile-dashboard/"
                                    >
                                        My profile
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton
                                        role="menuitem"
                                        component="a"
                                        href="/joy-ui/getting-started/templates/profile-dashboard/"
                                    >
                                        Create a new user
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>Clients</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>Admins</ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>
                </List>
                <List
                    size="sm"
                    sx={{
                        mt: 'auto',
                        flexGrow: 0,
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                        '--List-gap': '8px',
                        mb: 2,
                    }}
                >
                    <ListItem>
                        <ListItemButton>
                            <SettingsRoundedIcon/>
                            Settings
                        </ListItemButton>
                    </ListItem>
                </List>
                <Card
                    invertedColors
                    variant="soft"
                    color="neutral"
                    size="sm"
                    sx={{boxShadow: 'none'}}
                >
                    <Stack
                        direction="row"
                        sx={{justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <Typography level="title-sm">Available displays</Typography>
                        <IconButton size="sm">
                            <CloseRoundedIcon/>
                        </IconButton>
                    </Stack>
                    <Typography level="body-xs">
                        There are {clients.length} device online ready to display content from Y devices.
                    </Typography>
                    <LinearProgress variant="outlined" value={80} determinate sx={{my: 1}}/>
                </Card>
            </Box>
            <Divider/>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                <Avatar
                    variant="outlined"
                    size="sm"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                />
                <Box sx={{minWidth: 0, flex: 1}}>
                    <Typography level="title-sm">Siriwat K.</Typography>
                    <Typography level="body-xs">siriwatk@test.com</Typography>
                </Box>
                <IconButton size="sm" variant="plain" color="neutral">
                    <LogoutRoundedIcon/>
                </IconButton>
            </Box>
        </Sheet>
    );
}