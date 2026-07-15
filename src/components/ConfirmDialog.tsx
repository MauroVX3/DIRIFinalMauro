import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useIntl } from 'react-intl'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({ open, title, message, onConfirm, onClose }: ConfirmDialogProps) {
  const intl = useIntl()
  return (
    <Dialog open={open} onClose={onClose} className="dialog-root">
      <DialogBackdrop className="dialog-backdrop" />
      <div className="dialog-container">
        <DialogPanel className="dialog-panel">
          <DialogTitle className="dialog-title">{title}</DialogTitle>
          <p>{message}</p>
          <div className="dialog-actions">
            <button type="button" className="button-secondary" onClick={onClose}>{intl.formatMessage({ id: 'common.cancel' })}</button>
            <button type="button" className="button-danger" onClick={onConfirm}>{intl.formatMessage({ id: 'dialog.confirm' })}</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
