import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

type ModalProps = {
  onClose: () => void
  children: ReactNode
  isSaving: boolean
  labelledBy: string
}

export default function Modal({
  onClose, children, isSaving, labelledBy
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    dialog.showModal()

    return () => {
      dialog.close()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault()
        
        if(!isSaving) {
            onClose()
        }
      }}
    >
      {children}
    </dialog>
  )
}