/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:53:37
 * @modify date 2018-09-12 18:53:37
 * @desc [description]
*/
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import {
    DragSource,
    DropTarget,
    ConnectDropTarget,
    ConnectDragSource,
    DropTargetMonitor,
    DropTargetConnector,
    DragSourceConnector,
    DragSourceMonitor,
} from 'react-dnd'
// import { XYCoord } from 'dnd-core'
const style = {
    border: '1px dashed gray',
    marginBottom: '.5rem',
    backgroundColor: '#ffffffa8',
    cursor: 'move',
}

const cardSource = {
    beginDrag(props: CardProps) {
        return {
            index: props.index,
        }
    },
}

const cardTarget = {
    hover(props: CardProps, monitor: DropTargetMonitor, component: Card | null) {
        if (!component) {
            return null
        }
        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index
        if (dragIndex === hoverIndex) {
            return
        }
        const hoverBoundingRect = (findDOMNode(
            component,
        ) as Element).getBoundingClientRect()
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const clientOffset = monitor.getClientOffset()
        const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }
        props.moveCard(dragIndex, hoverIndex)
        monitor.getItem().index = hoverIndex
    },
}

export interface CardProps {
    index: number
    isDragging?: boolean
    connectDragSource?: ConnectDragSource
    connectDropTarget?: ConnectDropTarget
    moveCard: (dragIndex: number, hoverIndex: number) => void
}

@DropTarget("Sortable", cardTarget, (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(
    "Sortable",
    cardSource,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }),
)
export default class Card extends React.Component<CardProps> {
    public render() {
        const {
            isDragging,
            connectDragSource,
            connectDropTarget,
        } = this.props
        const opacity = isDragging ? 0 : 1

        return (
            connectDragSource &&
            connectDropTarget &&
            connectDragSource(
                connectDropTarget(<div style={{ ...style, opacity }}>{this.props.children}</div>),
            )
        )
    }
}
