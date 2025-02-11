import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Button from "@mui/material/Button";
import {Backdrop, CardActions, Fade, Modal, StepButton, Tab, tabClasses} from "@mui/material";
import {SyntheticEvent, useState} from "react";
import {FileDropZone} from "../client/FileDropZone.tsx";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Image, Videocam} from "@mui/icons-material";
import {slideShowProps} from "./ClientUI.tsx";
import PictureOrder from "./PictureOrder.tsx";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

const BaseUploadMenuModal = (props: slideShowProps) => {

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

    let steps = [
        // 'Select Time Period',
        'Select Files to Upload',
    ];

    if (props.mediaType === 'image') {
        steps.push('Select the order of the files');
    }

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        if (activeStep === steps.length - 1) handleClose();
        else setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleBack = () => {
        if (activeStep === 0) handleClose();
        else setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const [open, setOpen] = useState(false);
    const handleOpen = ( page:number) => {
        setTabIndex(page)
        setActiveStep(page)
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    return (
        <Card sx={{width: '100%', mt:2, pb:2}}>
            <CardHeader title={"Content Management"}></CardHeader>
            <CardActions sx={{ml:2}}>
                <Button onClick={() => handleOpen(0)}>Upload Content</Button>
                {
                    props.mediaType === 'image' &&
                    <Button onClick={() => handleOpen(1)}>Change Image Order</Button>
                }
            </CardActions>
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
                        <Stepper activeStep={activeStep} alternativeLabel nonLinear sx={{mb: 2}}>
                            {steps.map((label,index) => {
                                const stepProps: { completed?: boolean } = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepButton onClick={handleStep(index)}>{label}</StepButton>
                                    </Step>
                                )
                            })}
                        </Stepper>
                        <Box>
                            {activeStep === 0
                                ? <Card
                                    sx={{
                                        marginBottom:4
                                    }}
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
                                        <TabPanel value={0}><FileDropZone acceptedFileType={'image'}
                                                                          isPlaylist={false}
                                                                          changeTime={props.changeTime}
                                        /></TabPanel>
                                        <TabPanel value={1}><FileDropZone acceptedFileType={'video'}
                                                                          isPlaylist={false}
                                                                          changeTime={props.changeTime}
                                        /></TabPanel>
                                    </TabContext></Card>
                                : <PictureOrder {...props}></PictureOrder>
                            }
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <Box sx={{flex: '1 1 auto'}}/>
                            <Button
                                onClick={handleBack}
                            >
                                {activeStep === 0 ? 'Exit' : 'Back'}
                            </Button>
                            <Button onClick={handleNext} sx={{ml:2}}>
                                {activeStep === steps.length - 1 ? 'Exit' : 'Next'}
                            </Button>
                        </Box>

                    </Box>
                </Fade>
            </Modal>
        </Card>
    );

}

export default BaseUploadMenuModal;