// @ts-nocheck
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {CardActions, CardContent, useMediaQuery} from "@mui/material";
import {
    closestCenter,
    DndContext, DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';
import Box from "@mui/material/Box";
import {slideShowProps} from "./ClientUI.tsx";
import {restrictToHorizontalAxis, restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable
} from '@dnd-kit/sortable';
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {useWebSocketContext} from "../../../websocket/WebSocketContext.tsx";
import Typography from "@mui/material/Typography";

const SortableItem = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
    } = useSortable({
        id: props.fileName,
    });
    const isXs = useMediaQuery(theme => theme.breakpoints.only("xs"));
    const isSm = useMediaQuery(theme => theme.breakpoints.only("sm"));

    const style = {
        transform: CSS.Transform.toString(transform),
        height: isXs ? "20vh" : "25vh",
        width: isXs ? "34vw" : isSm ? "42vw" : "30vw",
        margin: 8,
        border: props.active ? "2px solid #05e195" : "1px solid black"
    };

    return (
        <img src={`/displays/${props.clientId}/${props.changeTime.replace(":", "_")}/${props.fileName}`}
             id={props.fileName} ref={setNodeRef}
             style={style} {...attributes} {...listeners}
        />
    );
}

const PictureOrder = (props: slideShowProps) => {
    const [activeId, setActiveId] = useState(null);
    const [fileOrder, setFileOrder] = useState(props.fileNames);
    const {sendMessage} = useWebSocketContext();

    useEffect(() => {
        setFileOrder(props.fileNames);
    }, [props.fileNames]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event) {
        const {active} = event;

        setActiveId(active.id);
    }

    function handleDragEnd(event) {
        const {active, over} = event;

        if (active.id !== over.id) {
            setFileOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    }

    function handleButton(direction) {
        setFileOrder((items) => {
            const oldIndex = items.indexOf(activeId);
            const newIndex = oldIndex - direction;
            return arrayMove(items, oldIndex, newIndex);
        });
    }

    function handleOrderChange() {
        const jsonToSend = {
            type: 'modifyImageOrder',
            targetUser: props.clientId,
            fileNames: fileOrder,
            changeTime: props.changeTime,
        }
        // console.log('Sending:', jsonToSend);
        sendMessage(JSON.stringify(jsonToSend));
    }

    const cardTitle = () => {
        return (
            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                <Typography fontSize={"1.5rem"}>Change Image Order</Typography>
                <Button onClick={handleOrderChange}>Save Order</Button>
            </Box>
        )
    }

    return (
        <Card>
            <CardHeader title={cardTitle()}/>
            <CardContent sx={{
                display: "flex",
                height: {xs: "45vh", md: "auto"},
                overflow: "auto",
                flexDirection: "row",
                flexWrap: {xs: "wrap", md: "nowrap"}
            }}>
                {fileOrder.length === 0 && <Typography margin={5} fontSize={20}>No images to display</Typography>}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={fileOrder}
                        strategy={horizontalListSortingStrategy}
                        id={'image-list'}
                    >
                        {fileOrder.map((fileName) => {
                            return <SortableItem active={activeId==fileName} clientId={props.clientId} fileName={fileName}
                                                 changeTime={props.changeTime}></SortableItem>
                        })}
                    </SortableContext>
                    <DragOverlay>
                        {activeId ? (
                            <Box>
                                <img
                                    src={`/displays/${props.clientId}/${props.changeTime.replace(":", "_")}/${activeId}`}
                                    style={{
                                        height: "25vh", maxWidth: "30vw"
                                    }}/>
                            </Box>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </CardContent>
            <CardActions>
                <Button sx={{width:{xs:"50%"}}} onClick={() => handleButton(1)}>Move Up</Button>
                <Button sx={{width:{xs:"50%"}}} onClick={() => handleButton(-1)}>Move Down</Button>
            </CardActions>
        </Card>
    );
}

export default PictureOrder;