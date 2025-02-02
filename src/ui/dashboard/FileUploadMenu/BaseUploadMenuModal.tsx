import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from "@mui/material/Button";
import {Backdrop, Fade, Modal, Tab, tabClasses} from "@mui/material";
import Typography from "@mui/material/Typography";
import {SyntheticEvent, useState} from "react";
import {FileDropZone} from "../client/FileDropZone.tsx";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Image, Videocam} from "@mui/icons-material";

const BaseUploadMenuModal = () => {

    const [tabIndex, setTabIndex] = useState(0);

    // @ts-ignore
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '0px solid #000',
        boxShadow: 24,
        borderRadius: 4,
        p: 4,
    };

    const steps = [
        'Select Time Period', //TODO: select time period
        'Select Files to Upload',//drag and drop
        'Select the order of the files',//TODO: drag and drop
    ];

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        if (activeStep === steps.length -1) handleClose();
        else setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setTabIndex(0)
        setActiveStep(0)
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    return (
        <Box sx={{width: '100%'}}>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{backdrop: Backdrop}}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{mb:2}}>
                            {steps.map((label) => {
                                const stepProps: { completed?: boolean } = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                )
                            })}
                        </Stepper>
                        <Box>
                            {activeStep === 0 ? <Typography>Time Period</Typography> :
                                activeStep === 1
                                ? <Box
                                        sx={{backgroundColor: "background.paper"}}
                                        marginBottom={3}
                                        borderRadius="12px"
                                        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                                    >
                                        <TabContext value={tabIndex}>
                                            <TabList
                                                onChange={handleChange}
                                                sx={{
                                                    p: 0.5,
                                                    gap: 0.5,
                                                    [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                                        boxShadow: 'sm',
                                                        borderRadius: 4,
                                                        bgcolor: 'background.default',
                                                    },
                                                    [`& .${tabClasses.root}:hover`]: {
                                                        boxShadow: 'sm',
                                                        borderRadius: 4,
                                                        bgcolor: 'background.default',
                                                    },
                                                }}
                                            >
                                                <Tab
                                                    icon={<Image/>}
                                                    iconPosition={"start"}
                                                    label={"Images"}
                                                    value={0}
                                                    sx={{paddingy: 1, margin: 0.5, minHeight: '48px',}}
                                                >
                                                </Tab>
                                                <Tab
                                                    icon={<Videocam/>}
                                                    iconPosition={"start"}
                                                    label={"Video"}
                                                    value={1}
                                                    sx={{paddingy: 1, margin: 0.5, minHeight: '48px',}}
                                                >
                                                </Tab>
                                            </TabList>
                                            <TabPanel value={0}><FileDropZone acceptedFileType={'image'} isPlaylist={true}/></TabPanel>
                                            <TabPanel value={1}><FileDropZone acceptedFileType={'video'} isPlaylist={true}/></TabPanel>
                                        </TabContext></Box>
                                : <Typography>Drag and drop files here</Typography>
                            }
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <Button
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>

                    </Box>
                </Fade>
            </Modal>
        </Box>
    );

}

export default BaseUploadMenuModal;