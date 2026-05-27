import React, { useState } from 'react'
import { MemoryEntry, CityId } from '../../../db/schema'
import { AddPickerSheet } from './add/AddPickerSheet'
import { AddNoteSheet } from './add/AddNoteSheet'
import { AddFoodSheet } from './add/AddFoodSheet'
import { AddQuoteSheet } from './add/AddQuoteSheet'
import { AddTicketSheet } from './add/AddTicketSheet'
import { AddPhotoSheet } from './add/AddPhotoSheet'
import { VoiceRecordSheet } from './add/VoiceRecordSheet'

type Step = 'picker' | 'note' | 'food' | 'quote' | 'ticket' | 'photo' | 'voice'

interface Props {
  cityId: CityId
  date: string
  onSave: (entry: Omit<MemoryEntry, 'id' | 'cityId'>) => void
  onClose: () => void
}

export function AddMemorySheet({ cityId, date, onSave, onClose }: Props) {
  const [step, setStep] = useState<Step>('picker')
  const [photoSrc, setPhotoSrc] = useState<string>('')

  const sheetStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--color-paper)',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    paddingBottom: 'calc(var(--space-lg) + env(safe-area-inset-bottom, 0px))',
    maxHeight: '92vh',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    animation: 'sheetSlideUp var(--duration-sheet) var(--ease-out-expo) both',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 'var(--z-sheet)',
        animation: 'backdropFadeIn var(--duration-base) var(--ease-out-expo) both',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-memory-title"
        style={sheetStyle}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-rule)' }} />
        </div>

        {step === 'picker' && (
          <AddPickerSheet
            onSelect={setStep}
            onClose={onClose}
            onPhotoSelected={(src) => { setPhotoSrc(src); setStep('photo') }}
          />
        )}
        {step === 'note'   && <AddNoteSheet   onSave={onSave} onClose={onClose} onBack={() => setStep('picker')} />}
        {step === 'food'   && <AddFoodSheet   onSave={onSave} onClose={onClose} onBack={() => setStep('picker')} />}
        {step === 'quote'  && <AddQuoteSheet  date={date} cityId={cityId} onClose={onClose} onBack={() => setStep('picker')} />}
        {step === 'ticket' && <AddTicketSheet onSave={onSave} onClose={onClose} onBack={() => setStep('picker')} />}
        {step === 'photo'  && <AddPhotoSheet  src={photoSrc} onSave={onSave} onClose={onClose} onBack={() => setStep('picker')} />}
        {step === 'voice'  && <VoiceRecordSheet onSave={entry => { onSave(entry); onClose() }} onBack={() => setStep('picker')} />}
      </div>
    </div>
  )
}
