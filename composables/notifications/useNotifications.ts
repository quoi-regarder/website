export const useNotifications = () => {
  const toast = useToast()

  const success = (title: string, message: string) => {
    const isDuplicate = handleDuplicate(title, message)

    if (isDuplicate) {
      return
    }

    toast.add({
      title,
      description: message,
      icon: 'i-lucide:check-circle',
      color: 'success'
    })
  }

  const error = (title: string, message: string) => {
    const isDuplicate = handleDuplicate(title, message)

    if (isDuplicate) {
      return
    }

    toast.add({
      title,
      description: message,
      icon: 'i-lucide:circle-x',
      color: 'error'
    })
  }

  const info = (title: string, message: string) => {
    const isDuplicate = handleDuplicate(title, message)

    if (isDuplicate) {
      return
    }

    toast.add({
      title,
      description: message,
      icon: 'i-lucide:info',
      color: 'info'
    })
  }

  const handleDuplicate = (title: string, message: string) => {
    const toasts = toast.toasts.value

    if (toasts.length === 0) {
      return false
    }

    return toasts.some((toast) => {
      return toast.title === title && toast.description === message
    })
  }

  return {
    success,
    error,
    info
  }
}
