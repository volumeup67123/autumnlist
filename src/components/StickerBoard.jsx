import React from 'react'
import { motion } from 'framer-motion'
import Sticker from './Sticker'
import './StickerBoard.css'

const StickerBoard = ({ items, completedItems, onUpdatePosition, editingStickerId, onStickerLongPress }) => {
  return (
    <div className="sticker-board">
      {items.map(item => (
        <Sticker
          key={item.id}
          item={item}
          isCompleted={completedItems.includes(item.id)}
          onUpdatePosition={onUpdatePosition}
          isEditing={editingStickerId === item.id}
          onLongPress={onStickerLongPress}
        />
      ))}
    </div>
  )
}

export default StickerBoard