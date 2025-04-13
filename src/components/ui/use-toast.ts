import * as React from "react"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type?: ToastType
  content: React.ReactNode
  description?: React.ReactNode
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

const initialState: ToastState = { toasts: [] }

export function useToast() {
  const [state, setState] = React.useState<ToastState>(initialState)

  const toast = React.useCallback((options: Omit<Toast, 'id'>) => {
    const id = generateId()
    
    const newToast: Toast = {
      ...options,
      id,
      duration: options.duration || 3000
    }

    setState(prev => ({
      toasts: [...prev.toasts.slice(-TOAST_LIMIT + 1), newToast]
    }))

    return id
  }, [])

  const dismiss = React.useCallback((toastId?: string) => {
    setState(prev => ({
      toasts: prev.toasts.filter(t => t.id !== toastId)
    }))
  }, [])

  return {
    toast,
    dismiss,
    toasts: state.toasts
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}
