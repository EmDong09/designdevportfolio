import { useEffect, useRef, type ReactNode } from 'react'
import './PreviewDialog.css'

interface PreviewDialogProps {
  isOpen: boolean
  onClose: () => void
  titleId: string
  children: ReactNode
}

export default function PreviewDialog({
  isOpen,
  onClose,
  titleId,
  children,
}: PreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Open the native dialog (top layer, built-in focus containment) and move
  // focus to its close control.
  useEffect(() => {
    const dialogEl = dialogRef.current
    if (!dialogEl) return
    if (isOpen && !dialogEl.open) {
      dialogEl.showModal()
      closeButtonRef.current?.focus()
    }
  }, [isOpen])

  // The dialog's own `close` event fires for Escape, the close button, and
  // backdrop dismissal alike — treat it as the single source of truth so
  // React state and focus restoration stay in sync with however it closed.
  useEffect(() => {
    const dialogEl = dialogRef.current
    if (!dialogEl) return

    const handleClose = () => onClose()
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialogEl) {
        dialogEl.close()
      }
    }

    dialogEl.addEventListener('close', handleClose)
    dialogEl.addEventListener('click', handleBackdropClick)
    return () => {
      dialogEl.removeEventListener('close', handleClose)
      dialogEl.removeEventListener('click', handleBackdropClick)
    }
  }, [onClose])

  return (
    <dialog ref={dialogRef} className="preview-dialog" aria-labelledby={titleId}>
      <div className="preview-dialog__content">
        <button
          ref={closeButtonRef}
          type="button"
          className="preview-dialog__close"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close preview"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        {children}
      </div>
    </dialog>
  )
}
