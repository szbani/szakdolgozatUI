// @ts-nocheck
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {CardActions, CardContent} from "@mui/material";
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
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
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

    const style = {
        transform: CSS.Transform.toString(transform),
        height: 150,
        margin: 8,
    };

    return (
        <img src={`/displays/${props.clientId}/${props.changeTime.replace(":","_")}/${props.fileName}`} id={props.fileName} ref={setNodeRef}
             style={style} {...attributes} {...listeners}/>
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

    return (
        <Card sx={{marginBottom: 4}}>
            <CardHeader title={'Change Image Order'}></CardHeader>
            <CardContent sx={{display: "flex", overflow: "scroll"}}>
                { fileOrder.length === 0 && <Typography margin={5} fontSize={20}>No images to display</Typography>}
                <DndContext
                    modifiers={[restrictToHorizontalAxis]}
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
                            return <SortableItem clientId={props.clientId} fileName={fileName} changeTime={props.changeTime}></SortableItem>
                        })}
                    </SortableContext>
                    {/*<DragOverlay>*/}
                    {/*    {activeId ? (*/}
                    {/*        <Box>*/}
                    {/*            <img src={`/displays/${props.clientId}/${props.changeTime}/${activeId}`} style={{height: 150}}/>*/}
                    {/*        </Box>*/}
                    {/*    ) : null}*/}
                    {/*</DragOverlay>*/}
                </DndContext>
            </CardContent>
            <CardActions><Button onClick={handleOrderChange} disabled={fileOrder.length === 0}>Change Order</Button></CardActions>
        </Card>
    );
}

export default PictureOrder;