import {
    AppBar,
    Drawer, LinearProgress,
    ListItemButton,
    listItemButtonClasses,
    Toolbar
} from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {CloseRounded, ComputerRounded, LogoutRounded, Person, SettingsRounded} from "@mui/icons-material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import ColorSchemeToggle from "./ColorSchemeToggle.tsx";
import {NavLink} from "react-router-dom";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Avatar from "@mui/material/Avatar";

const drawerWidth = 240;

export default function ResponsiveDrawer() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    //@ts-ignore
    const {registeredDisplays} = useWebSocketContext();


    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const [currentTab, setCurrentTab] = useState('');

    useEffect(() => {
        setCurrentTab(window.location.pathname.split('/')[1]);
    }, []);

    const drawer = (
        <Box sx={{
            transition: 'transform 0.4s, width 0.4s',
            zIndex: 10000,
            height: '100vh',
            width: 'var(--Sidebar-width)',
            top: 0,
            left: 0,
            p: 2,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRight: '1px solid',
            borderColor: 'divider',
        }}>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}} height={"fit-content"}>
                <Typography variant={'h6'} fontWeight={"bold"}>Display Manager.</Typography>
                <ColorSchemeToggle/>
            </Box>
            <Divider/>
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
                    component={"nav"}
                >
                    {/*<ListItem sx={{paddingX: 0}}>*/}
                    {/*    <ListItemButton sx={{borderRadius: 3}} component={NavLink} to={"/"}*/}
                    {/*                    selected={currentTab == "" ? true : false}*/}
                    {/*                    onClick={() => setCurrentTab('')}>*/}
                    {/*        <HomeRounded/>*/}
                    {/*        <Typography>Home</Typography>*/}
                    {/*    </ListItemButton>*/}
                    {/*</ListItem>*/}

                    <ListItem sx={{paddingX: 0}}>
                        <ListItemButton sx={{borderRadius: 3}} component={NavLink} to={"displays"}
                                        selected={currentTab == "displays" ? true : false}
                                        onClick={() => setCurrentTab('displays')}>
                            <ComputerRounded/>
                            <Typography>Displays</Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{paddingX: 0}}>
                        <ListItemButton sx={{borderRadius: 3}} component={NavLink} to={"accounts"}
                                        selected={currentTab == "accounts" ? true : false}
                                        onClick={() => setCurrentTab('accounts')}>
                            <Person/>
                            <Typography>Accounts</Typography>
                        </ListItemButton>
                    </ListItem>
                </List>
                <List
                    sx={{
                        mt: 'auto',
                        flexGrow: 0,
                        // '--ListItem-radius': (theme) => theme.cssVariables.radius.sm,
                        '--List-gap': '8px',
                    }}
                >
                    <ListItem sx={{paddingX: 0}}>
                        <ListItemButton sx={{borderRadius: 3}}>
                            <SettingsRounded/>
                            Settings
                        </ListItemButton>
                    </ListItem>
                </List>
                <Card
                    // variant="soft"
                    color="neutral"
                    sx={{boxShadow: 'none'}}
                >
                    <Stack
                        direction="row"
                        sx={{justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <Typography>Available displays</Typography>
                        <IconButton>
                            <CloseRounded/>
                        </IconButton>
                    </Stack>
                    <Typography>
                        There are {registeredDisplays.length} device online ready to display content
                        from {registeredDisplays.length} devices.
                    </Typography>
                    <LinearProgress variant={'determinate'} value={80} sx={{my: 1}}/>
                </Card>

            </Box>
            <Divider/>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                <Avatar
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                />
                <Box sx={{minWidth: 0, flex: 1}}>
                    <Typography>Siriwat K.</Typography>
                    <Typography>siriwatk@test.com</Typography>
                </Box>
                <IconButton>
                    <LogoutRounded/>
                </IconButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{
                    width: {md: `calc(100% - ${drawerWidth}px)`},
                    ml: {md: `${drawerWidth}px`},
                    display: {md: 'none'},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {md: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Display Manager.
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', md: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', md: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}